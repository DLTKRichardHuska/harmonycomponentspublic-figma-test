import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const art = dirname(fileURLToPath(import.meta.url));
mkdirSync(art, { recursive: true });

async function setup(page) {
  await page.evaluate(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '') + ' theme-cp';
  });
  await page.waitForTimeout(300);
}

async function shotHeading(page, heading, out) {
  const h = page.getByRole('heading', { name: heading, exact: true }).first();
  if (!(await h.count())) {
    console.log('missing', heading, out);
    return;
  }
  await h.scrollIntoViewIfNeeded();
  const handle = await h.evaluateHandle((el) => {
    let n = el;
    for (let i = 0; i < 6; i++) {
      if (!n.parentElement) break;
      n = n.parentElement;
      const cls = String(n.className || '');
      if (n.tagName === 'SECTION' || /example|card|group|rounded/i.test(cls)) return n;
    }
    return el.parentElement?.parentElement || el.parentElement || el;
  });
  const el = handle.asElement();
  if (el) {
    try {
      writeFileSync(join(art, out), await el.screenshot({ type: 'png', animations: 'disabled' }));
      console.log('shot', out);
      return;
    } catch (e) {
      console.log('crop fail', out, String(e.message).split('\n')[0]);
    }
  }
  writeFileSync(join(art, out), await page.screenshot({ type: 'png' }));
  console.log('pagefall', out);
}

async function run(base, prefix, pairs) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [path, heading, file] of pairs) {
    await page.goto(`${base}/components/${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    await setup(page);
    await shotHeading(page, heading, `${prefix}-${file}.png`);
  }
  await browser.close();
}

const convPairs = [
  ['checkboxes', 'States', 'cb-states'],
  ['checkboxes', 'State Variants', 'cb-variants'],
  ['checkboxes', 'Without Labels', 'cb-nolabel'],
  ['checkboxes', 'Inline Layout', 'cb-inline'],
  ['checkbox-groups', 'Vertical Group', 'cg-vertical'],
  ['checkbox-groups', 'Horizontal Group', 'cg-horizontal'],
  ['checkbox-groups', 'Group Error', 'cg-error'],
  ['radio-buttons', 'Sizes', 'rb-sizes'],
  ['radio-buttons', 'Basic Radio', 'rb-basic'],
  ['radio-buttons', 'State Variants', 'rb-variants'],
  ['radio-groups', 'Vertical Group', 'rg-vertical'],
  ['radio-groups', 'Horizontal Group', 'rg-horizontal'],
  ['links', 'Sizes', 'link-sizes'],
  ['links', 'External', 'link-external'],
  ['links', 'Muted', 'link-muted'],
  ['tooltips', 'Positions', 'tip-positions'],
  ['tooltips', 'On Button', 'tip-button'],
];

const refPairs = [
  ['checkboxes', 'States', 'cb-states'],
  ['checkboxes', 'State Variants', 'cb-variants'],
  ['checkboxes', 'Without Labels', 'cb-nolabel'],
  ['checkboxes', 'Inline Layout', 'cb-inline'],
  ['checkbox-groups', 'Basic Group', 'cg-vertical'],
  ['checkbox-groups', 'Horizontal Layout', 'cg-horizontal'],
  ['checkbox-groups', 'Error State', 'cg-error'],
  ['radio-buttons', 'Size Variants', 'rb-sizes'],
  ['radio-buttons', 'Basic Radio Group', 'rb-basic'],
  ['radio-buttons', 'State Variants', 'rb-variants'],
  ['radio-groups', 'Basic Group', 'rg-vertical'],
  ['radio-groups', 'Horizontal Layout', 'rg-horizontal'],
  ['links', 'Size variants', 'link-sizes'],
  ['links', 'External Link', 'link-external'],
  ['links', 'Muted Link', 'link-muted'],
  ['tooltips', 'Positions', 'tip-positions'],
  ['tooltips', 'Basic Tooltip', 'tip-button'],
];

await run('http://localhost:5177', 'conv', convPairs);
await run('http://localhost:4321', 'ref', refPairs);

async function betterProbe(base, out) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  await page.goto(`${base}/components/checkboxes`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const data = await page.evaluate(() => {
    const radix = document.querySelector('button[role="checkbox"]');
    if (radix) {
      const cs = getComputedStyle(radix);
      const r = radix.getBoundingClientRect();
      const checked = document.querySelector(
        'button[role="checkbox"][data-state="checked"], button[role="checkbox"][aria-checked="true"]',
      );
      const ccs = checked ? getComputedStyle(checked) : null;
      return {
        found: true,
        kind: 'radix',
        size: { w: Math.round(r.width), h: Math.round(r.height) },
        border: `${cs.borderTopWidth} ${cs.borderTopColor}`,
        bg: cs.backgroundColor,
        radius: cs.borderRadius,
        checkedBg: ccs?.backgroundColor ?? null,
        checkedSize: checked
          ? {
              w: Math.round(checked.getBoundingClientRect().width),
              h: Math.round(checked.getBoundingClientRect().height),
            }
          : null,
      };
    }

    const faces = [...document.querySelectorAll('*')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 14 || r.width > 28 || r.height < 14 || r.height > 28) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
      const br = parseFloat(cs.borderTopWidth || '0');
      return br >= 1;
    });
    const el = faces[0];
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const checked = faces.find((n) => {
      const c = getComputedStyle(n).backgroundColor;
      return /rgb\(\s*(42|59|37|29)/.test(c) || c.includes('42, 120, 198');
    });
    const ccs = checked ? getComputedStyle(checked) : null;
    return {
      found: true,
      kind: 'css-face',
      size: { w: Math.round(r.width), h: Math.round(r.height) },
      border: `${cs.borderTopWidth} ${cs.borderTopColor}`,
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      checkedBg: ccs?.backgroundColor ?? null,
      checkedSize: checked
        ? {
            w: Math.round(checked.getBoundingClientRect().width),
            h: Math.round(checked.getBoundingClientRect().height),
          }
        : null,
    };
  });
  writeFileSync(join(art, out), JSON.stringify(data, null, 2));
  console.log(out, data);
  await browser.close();
}

await betterProbe('http://localhost:4321', 'ref-checkbox-face-probe.json');
await betterProbe('http://localhost:5177', 'conv-checkbox-face-probe.json');

async function tipOpen(base, outPrefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  await page.goto(`${base}/components/tooltips`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const btn = page.getByRole('button').filter({ hasText: /Hover me|^top$|Hover/i }).first();
  if (await btn.count()) {
    await btn.scrollIntoViewIfNeeded();
    await btn.focus();
    await btn.hover({ force: true });
    await page.waitForTimeout(900);
  } else {
    const trigger = page.locator('[data-tooltip], .tooltip-trigger, button, [title]').first();
    if (await trigger.count()) {
      await trigger.hover({ force: true });
      await page.waitForTimeout(900);
    }
  }
  writeFileSync(join(art, `${outPrefix}-tip-open2.png`), await page.screenshot({ type: 'png' }));
  const tip = page
    .locator('[role="tooltip"]:visible, .tooltip:visible, .tooltip__content:visible, [data-state="delayed-open"], [data-state="instant-open"]')
    .first();
  if (await tip.count()) {
    try {
      writeFileSync(join(art, `${outPrefix}-tip-panel2.png`), await tip.screenshot({ type: 'png' }));
    } catch {
      /* ignore */
    }
    const probe = await tip.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        fontSize: cs.fontSize,
        padding: cs.padding,
        radius: cs.borderRadius,
        text: el.textContent?.trim(),
      };
    });
    writeFileSync(join(art, `${outPrefix}-tip-probe.json`), JSON.stringify(probe, null, 2));
    console.log('tip probe', outPrefix, probe);
  } else {
    console.log('no tip', outPrefix);
  }
  await browser.close();
}

await tipOpen('http://localhost:4321', 'ref');
await tipOpen('http://localhost:5177', 'conv');
console.log('SECTIONS DONE');
