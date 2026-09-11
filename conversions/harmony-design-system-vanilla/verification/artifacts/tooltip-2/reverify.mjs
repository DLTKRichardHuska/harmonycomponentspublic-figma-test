import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function inventory(page, isConv) {
  return page.evaluate(({ isConv }) => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    const headings = [];
    walk(document, (root) => {
      root.querySelectorAll('h1,h2,h3').forEach((h) =>
        headings.push(h.tagName + ':' + (h.textContent || '').trim().slice(0, 80)),
      );
    });
    let pageRoot = document;
    if (isConv) {
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page');
      pageRoot = pageEl?.shadowRoot || document;
    }
    return {
      tipCount: isConv
        ? pageRoot.querySelectorAll('harmony-tooltip').length
        : document.querySelectorAll('.tooltip').length,
      headings: headings.filter((h) =>
        /Tooltip|Examples|Positions|Corner|API|Props|Access|Rich|Different/i.test(h),
      ),
      hasApi: !!(pageRoot.querySelector?.('#props') || document.querySelector('#props')),
      hasA11y: !!(pageRoot.querySelector?.('#accessibility') || document.querySelector('#accessibility')),
    };
  }, { isConv });
}

async function hoverTip(page, searchText) {
  const box = await page.evaluate((searchText) => {
    const root = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-tooltips-page')?.shadowRoot;
    const tips = [...(root?.querySelectorAll('harmony-tooltip') || [])];
    const tip = tips.find((t) => {
      const slot = [...t.querySelectorAll('[slot=content]')].map((n) => n.textContent || '').join(' ');
      return (t.getAttribute('text') || '').includes(searchText) || slot.includes(searchText);
    });
    if (!tip) return null;
    tip.scrollIntoView({ block: 'center' });
    const trigger = tip.querySelector('harmony-button, button, [tabindex], .help-text, span');
    const r = (trigger || tip).getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, searchText);
  if (!box) return { error: 'not found', searchText };
  await page.mouse.move(box.x, box.y);
  await page.waitForTimeout(450);
  return page.evaluate((searchText) => {
    const root = document.querySelector('demo-app').shadowRoot.querySelector('demo-tooltips-page').shadowRoot;
    const tip = [...root.querySelectorAll('harmony-tooltip')].find((t) => {
      const slot = [...t.querySelectorAll('[slot=content]')].map((n) => n.textContent || '').join(' ');
      return (t.getAttribute('text') || '').includes(searchText) || slot.includes(searchText);
    });
    const c = tip.shadowRoot.querySelector('[part=content]');
    const cs = getComputedStyle(c);
    return {
      text: (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      opacity: cs.opacity,
      visibility: cs.visibility,
      color: cs.color,
      bg: cs.backgroundColor,
      w: Math.round(c.getBoundingClientRect().width),
      h: Math.round(c.getBoundingClientRect().height),
    };
  }, searchText);
}

const conv = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await conv.goto('http://localhost:5178/components/tooltips', { waitUntil: 'networkidle', timeout: 60000 });
await conv.waitForTimeout(1000);
const boot = await conv.evaluate(() => ({
  hasApp: !!document.querySelector('demo-app'),
  defined: !!customElements.get('harmony-tooltip'),
}));
if (!boot.hasApp) {
  writeFileSync(join(out, 'reverify.json'), JSON.stringify({ blocked: true, boot }, null, 2));
  console.log(JSON.stringify({ blocked: true, boot }, null, 2));
  await browser.close();
  process.exit(0);
}

await conv.evaluate(() => {
  const app = document.querySelector('demo-app');
  app.product = 'cp';
  localStorage.setItem('harmony-demo-product', 'cp');
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-cp');
});
await conv.waitForTimeout(500);

const convInv = await inventory(conv, true);
await conv.screenshot({ path: join(out, 'conv-cp-light-top.png'), fullPage: false });

const a11y = await conv.evaluate(() => {
  const root = document.querySelector('demo-app').shadowRoot.querySelector('demo-tooltips-page').shadowRoot;
  return [...root.querySelectorAll('harmony-tooltip')].map((tip) => {
    const trigger = tip.querySelector('harmony-button, button, [tabindex], .help-text, span');
    const describedBy = trigger?.getAttribute('aria-describedby');
    const desc = describedBy ? root.getElementById(describedBy) : null;
    const slot = tip.shadowRoot.querySelector('slot[name=content]');
    const assigned = (slot?.assignedNodes({ flatten: true }) || [])
      .map((n) => (n.textContent || '').trim())
      .filter(Boolean)
      .join(' ');
    let ariaIds = null;
    try {
      ariaIds = trigger?.ariaDescribedByElements
        ? [...trigger.ariaDescribedByElements].map((e) => e && e.id)
        : null;
    } catch (e) {
      ariaIds = String(e.message || e);
    }
    const expected = assigned || tip.getAttribute('text') || '';
    const descText = desc?.textContent ?? null;
    return {
      textAttr: tip.getAttribute('text'),
      assigned,
      describedBy,
      descText,
      descFound: !!desc,
      ariaIds,
      tipTextEmpty: tip.shadowRoot.querySelector('.tooltip__text')?.hasAttribute('data-empty'),
      match: (descText || '').replace(/\s+/g, ' ').trim() === expected.replace(/\s+/g, ' ').trim(),
    };
  });
});

const rich = a11y.find((t) => t.assigned);
const textTipsOk = a11y.filter((t) => t.textAttr).every((t) => t.match && t.descText);

const behavior = await conv.evaluate(async () => {
  const root = document.querySelector('demo-app').shadowRoot.querySelector('demo-tooltips-page').shadowRoot;
  const tip = root.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const btn = tip.querySelector('harmony-button');
  tip.removeAttribute('data-dismissed');
  btn.focus();
  await new Promise((r) => setTimeout(r, 400));
  const content = tip.shadowRoot.querySelector('[part=content]');
  const onFocus = {
    opacity: getComputedStyle(content).opacity,
    visibility: getComputedStyle(content).visibility,
  };
  tip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 400));
  const afterEsc = {
    opacity: getComputedStyle(content).opacity,
    visibility: getComputedStyle(content).visibility,
    dismissed: tip.hasAttribute('data-dismissed'),
  };
  tip.removeAttribute('data-dismissed');
  btn.blur();
  return { onFocus, afterEsc };
});

const basicHover = await hoverTip(conv, 'This is a tooltip');
await conv.screenshot({ path: join(out, 'conv-hover-basic.png'), fullPage: false });
await conv.mouse.move(0, 0);
await conv.waitForTimeout(200);

const richHover = await hoverTip(conv, 'More detail');
await conv.screenshot({ path: join(out, 'conv-hover-rich.png'), fullPage: false });
await conv.mouse.move(0, 0);

await conv.evaluate(() => {
  document.documentElement.classList.add('dark');
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[text="This is a tooltip"]');
  tip?.removeAttribute('data-dismissed');
  tip?.scrollIntoView({ block: 'center' });
});
await conv.waitForTimeout(350);
const darkHover = await hoverTip(conv, 'This is a tooltip');
await conv.screenshot({ path: join(out, 'conv-cp-dark-hover-basic.png'), fullPage: false });

await conv.emulateMedia({ forcedColors: 'active' });
await conv.evaluate(() => document.documentElement.classList.remove('dark'));
await conv.waitForTimeout(350);
const fcHover = await hoverTip(conv, 'This is a tooltip');
await conv.screenshot({ path: join(out, 'conv-forced-colors-hover-basic.png'), fullPage: false });

const ref = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await ref.goto('http://localhost:4321/components/tooltips', { waitUntil: 'networkidle', timeout: 60000 });
await ref.evaluate(() => {
  document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy', 'dark');
  document.documentElement.classList.add('theme-cp');
});
await ref.waitForTimeout(500);
const refInv = await inventory(ref, false);
const rbox = await ref.evaluate(() => {
  const tip = document.querySelector('.tooltip');
  const btn = tip.querySelector('button');
  const r = btn.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await ref.mouse.move(rbox.x, rbox.y);
await ref.waitForTimeout(450);
const refBasic = await ref.evaluate(() => {
  const c = document.querySelector('.tooltip__content');
  const cs = getComputedStyle(c);
  return {
    text: c.textContent.trim(),
    opacity: cs.opacity,
    color: cs.color,
    bg: cs.backgroundColor,
    fontSize: cs.fontSize,
    padding: cs.padding,
  };
});
await ref.screenshot({ path: join(out, 'ref-hover-basic.png'), fullPage: false });

const payload = {
  boot,
  convInv,
  refInv,
  a11ySummary: {
    tipCount: a11y.length,
    textTipsOk,
    richDescText: rich?.descText ?? null,
    richAssigned: rich?.assigned ?? null,
    richMatch: rich?.match ?? false,
    richDescribedBy: rich?.describedBy ?? null,
    allDescNonEmpty: a11y.every((t) => !!(t.descText && t.descText.trim())),
    allMatch: a11y.every((t) => t.match),
  },
  a11y,
  behavior,
  basicHover,
  richHover,
  darkHover,
  fcHover,
  refBasic,
};
writeFileSync(join(out, 'reverify.json'), JSON.stringify(payload, null, 2));
console.log(
  JSON.stringify(
    {
      boot,
      a11ySummary: payload.a11ySummary,
      behavior,
      basicHover,
      richHover,
      darkHover,
      fcHover,
      refBasic,
      convTips: convInv.tipCount,
    },
    null,
    2,
  ),
);
await browser.close();
