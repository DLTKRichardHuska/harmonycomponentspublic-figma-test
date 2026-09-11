import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function shot(page, name) {
  await page.screenshot({ path: join(outDir, name), fullPage: false });
}

async function setProduct(page, product) {
  await page.evaluate((product) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.product = product;
      localStorage.setItem('harmony-demo-product', product);
    }
    document.documentElement.classList.remove('theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-' + product);
  }, product);
  await delay(500);
}

async function setMode(page, dark) {
  await page.evaluate((dark) => {
    document.documentElement.classList.toggle('dark', dark);
  }, dark);
  await delay(400);
}

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
      root.querySelectorAll('h1,h2,h3').forEach((h) => {
        headings.push(h.tagName + ':' + (h.textContent || '').trim().slice(0, 100));
      });
    });
    let pageRoot = document;
    if (isConv) {
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page') || document.querySelector('demo-tooltips-page');
      pageRoot = pageEl?.shadowRoot || document;
    }
    const tipHosts = isConv
      ? [...(pageRoot.querySelectorAll?.('harmony-tooltip') || [])]
      : [...document.querySelectorAll('.tooltip')];
    const exampleTitles = [];
    if (isConv) {
      pageRoot.querySelectorAll?.('h3').forEach((h) => exampleTitles.push((h.textContent || '').trim()));
    } else {
      document.querySelectorAll('.example-section__title, .example__title').forEach((h) =>
        exampleTitles.push((h.textContent || '').trim()),
      );
    }
    return {
      htmlTheme: [...document.documentElement.classList],
      h1: (pageRoot.querySelector?.('h1') || document.querySelector('h1'))?.textContent?.trim(),
      desc: (pageRoot.querySelector?.('demo-page-header p, p') || document.querySelector('.page-header__description'))?.textContent?.trim()?.slice(0, 240),
      headings,
      exampleTitles,
      tipCount: tipHosts.length,
      hasApi: !!(pageRoot.querySelector?.('#props') || document.querySelector('#props')),
      hasA11y: !!(pageRoot.querySelector?.('#accessibility') || document.querySelector('#accessibility')),
      hasConsume: isConv ? !!pageRoot.querySelector?.('demo-consume-snippets') : null,
      tipAttrs: tipHosts.slice(0, 14).map((el) =>
        isConv
          ? {
              text: el.getAttribute('text'),
              position: el.getAttribute('position'),
              corner: el.getAttribute('corner-variant'),
              hasContentSlot: !!el.querySelector('[slot="content"]'),
            }
          : {
              text: el.querySelector('.tooltip__content')?.textContent?.trim(),
              classes: el.querySelector('.tooltip__content')?.className,
            },
      ),
    };
  }, { isConv });
}

async function hoverAndMeasure(page, isConv, searchText, shotName) {
  const result = await page.evaluate(({ isConv, searchText }) => {
    function findPage() {
      if (!isConv) return document;
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page') || document.querySelector('demo-tooltips-page');
      return pageEl?.shadowRoot || document;
    }
    const root = findPage();
    const hosts = isConv
      ? [...root.querySelectorAll('harmony-tooltip')]
      : [...document.querySelectorAll('.tooltip')];
    const host = hosts.find((h) => {
      if (isConv) {
        const slotText = [...h.querySelectorAll('[slot="content"]')]
          .map((n) => n.textContent || '')
          .join(' ');
        return (h.getAttribute('text') || '').includes(searchText) || slotText.includes(searchText);
      }
      return (h.querySelector('.tooltip__content')?.textContent || '').includes(searchText);
    });
    if (!host) return { error: 'host not found', searchText };

    let trigger;
    if (isConv) {
      const assigned = host.shadowRoot?.querySelector('slot:not([name])')?.assignedElements?.({ flatten: true }) || [];
      trigger = assigned[0] || host;
      const innerBtn = trigger.shadowRoot?.querySelector('button');
      if (innerBtn) trigger = innerBtn;
    } else {
      trigger = host.querySelector('button, .btn, .icon-btn, span') || host;
    }
    const tr = trigger.getBoundingClientRect();
    return {
      searchText,
      triggerBox: { x: tr.x + tr.width / 2, y: tr.y + tr.height / 2, w: tr.width, h: tr.height },
      hostTag: host.tagName,
    };
  }, { isConv, searchText });

  if (result.error) return result;

  await page.mouse.move(result.triggerBox.x, result.triggerBox.y);
  await delay(500);

  const styles = await page.evaluate(({ isConv, searchText }) => {
    function findPage() {
      if (!isConv) return document;
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page') || document.querySelector('demo-tooltips-page');
      return pageEl?.shadowRoot || document;
    }
    const root = findPage();
    const hosts = isConv
      ? [...root.querySelectorAll('harmony-tooltip')]
      : [...document.querySelectorAll('.tooltip')];
    const host = hosts.find((h) => {
      if (isConv) {
        const slotText = [...h.querySelectorAll('[slot="content"]')]
          .map((n) => n.textContent || '')
          .join(' ');
        return (h.getAttribute('text') || '').includes(searchText) || slotText.includes(searchText);
      }
      return (h.querySelector('.tooltip__content')?.textContent || '').includes(searchText);
    });
    if (!host) return { error: 'host missing after hover' };
    const content = isConv
      ? host.shadowRoot?.querySelector('[part="content"]')
      : host.querySelector('.tooltip__content');
    if (!content) return { error: 'no content' };
    const cs = getComputedStyle(content);
    const r = content.getBoundingClientRect();
    const hostR = host.getBoundingClientRect();
    const after = getComputedStyle(content, '::after');
    return {
      text: (content.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      opacity: cs.opacity,
      visibility: cs.visibility,
      color: cs.color,
      bg: cs.backgroundColor,
      fontSize: cs.fontSize,
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      borderTopLeftRadius: cs.borderTopLeftRadius,
      borderTopRightRadius: cs.borderTopRightRadius,
      borderBottomLeftRadius: cs.borderBottomLeftRadius,
      borderBottomRightRadius: cs.borderBottomRightRadius,
      w: Math.round(r.width),
      h: Math.round(r.height),
      top: Math.round(r.top),
      left: Math.round(r.left),
      hostTop: Math.round(hostR.top),
      hostLeft: Math.round(hostR.left),
      hostW: Math.round(hostR.width),
      hostH: Math.round(hostR.height),
      relTop: Math.round(r.top - hostR.top),
      relLeft: Math.round(r.left - hostR.left),
      arrowDisplay: after.display,
      arrowBorderTopColor: after.borderTopColor,
      arrowBorderBottomColor: after.borderBottomColor,
      arrowBorderLeftColor: after.borderLeftColor,
      arrowBorderRightColor: after.borderRightColor,
      positionAttr: isConv ? host.getAttribute('position') : null,
      cornerAttr: isConv ? host.getAttribute('corner-variant') : null,
      contentClasses: !isConv ? content.className : null,
    };
  }, { isConv, searchText });

  if (shotName) await shot(page, shotName);
  await page.mouse.move(0, 0);
  await delay(250);
  return { ...result, hovered: styles };
}

async function focusEscapeTest(page) {
  return page.evaluate(async () => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page') || document.querySelector('demo-tooltips-page');
    const root = pageEl?.shadowRoot;
    const tip = root?.querySelector('harmony-tooltip[text="This is a tooltip"]');
    if (!tip) return { error: 'basic tip missing' };
    const hostBtn = tip.querySelector('harmony-button, button');
    const focusTarget = hostBtn?.shadowRoot?.querySelector('button') || hostBtn;
    focusTarget?.focus();
    await new Promise((r) => setTimeout(r, 350));
    const content = tip.shadowRoot.querySelector('[part="content"]');
    const csFocus = getComputedStyle(content);
    const onFocus = { opacity: csFocus.opacity, visibility: csFocus.visibility };

    tip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));
    const csEsc = getComputedStyle(content);
    const afterEsc = {
      opacity: csEsc.opacity,
      visibility: csEsc.visibility,
      dismissed: tip.hasAttribute('data-dismissed'),
    };

    tip.removeAttribute('data-dismissed');
    focusTarget?.blur();

    const trigger = tip.querySelector('harmony-button, button, [tabindex]');
    const describedBy = trigger?.getAttribute('aria-describedby');
    let desc = null;
    if (describedBy) desc = document.getElementById(describedBy);
    if (!desc) desc = document.querySelector('[data-harmony-tooltip-desc]');
    const role = tip.shadowRoot.querySelector('[part="content"]')?.getAttribute('role');
    const ariaHidden = tip.shadowRoot.querySelector('[part="content"]')?.getAttribute('aria-hidden');

    let hasForcedColorsRule = false;
    for (const sheet of tip.shadowRoot.adoptedStyleSheets || []) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSMediaRule && String(rule.conditionText).includes('forced-colors')) {
            hasForcedColorsRule = true;
          }
        }
      } catch {
        /* ignore */
      }
    }

    return {
      onFocus,
      afterEsc,
      describedBy,
      descText: desc?.textContent || null,
      role,
      ariaHidden,
      focusTag: focusTarget?.tagName,
      hasForcedColorsRule,
    };
  });
}

const ref = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await ref.goto('http://localhost:4321/components/tooltips', { waitUntil: 'networkidle', timeout: 60000 });
await ref.evaluate(() => {
  document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy', 'dark');
  document.documentElement.classList.add('theme-cp');
});
await delay(600);
const refInv = await inventory(ref, false);
writeFileSync(join(outDir, 'ref-inventory.json'), JSON.stringify(refInv, null, 2));
await shot(ref, 'ref-cp-light-top.png');

const refHovers = {};
for (const [text, file] of [
  ['This is a tooltip', 'ref-hover-basic.png'],
  ['Appears on top', 'ref-hover-pos-top.png'],
  ['Appears on bottom', 'ref-hover-pos-bottom.png'],
  ['Appears on left', 'ref-hover-pos-left.png'],
  ['Appears on right', 'ref-hover-pos-right.png'],
  ['Top corners sharp', 'ref-hover-corner-top.png'],
  ['Bottom corners sharp', 'ref-hover-corner-bottom.png'],
  ['Icon button info', 'ref-hover-icon.png'],
  ['More information', 'ref-hover-text.png'],
]) {
  refHovers[text] = await hoverAndMeasure(ref, false, text, file);
}

await ref.evaluate(() => document.querySelector('#props')?.scrollIntoView({ block: 'start' }));
await delay(300);
await shot(ref, 'ref-cp-light-props.png');
await ref.evaluate(() => document.querySelector('#accessibility')?.scrollIntoView({ block: 'start' }));
await delay(300);
await shot(ref, 'ref-cp-light-a11y.png');
await ref.evaluate(() => document.documentElement.classList.add('dark'));
await delay(400);
await shot(ref, 'ref-cp-dark-top.png');
refHovers['dark-basic'] = await hoverAndMeasure(ref, false, 'This is a tooltip', 'ref-cp-dark-hover-basic.png');
await ref.close();

const conv = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await conv.goto('http://localhost:5178/components/tooltips', { waitUntil: 'networkidle', timeout: 60000 });
await delay(1000);
await setProduct(conv, 'cp');
await setMode(conv, false);
const convInv = await inventory(conv, true);
writeFileSync(join(outDir, 'conv-inventory.json'), JSON.stringify(convInv, null, 2));
await shot(conv, 'conv-cp-light-top.png');

const convHovers = {};
for (const [text, file] of [
  ['This is a tooltip', 'conv-hover-basic.png'],
  ['Appears on top', 'conv-hover-pos-top.png'],
  ['Appears on bottom', 'conv-hover-pos-bottom.png'],
  ['Appears on left', 'conv-hover-pos-left.png'],
  ['Appears on right', 'conv-hover-pos-right.png'],
  ['Top corners sharp', 'conv-hover-corner-top.png'],
  ['Bottom corners sharp', 'conv-hover-corner-bottom.png'],
  ['Icon button info', 'conv-hover-icon.png'],
  ['More information', 'conv-hover-text.png'],
  ['More detail', 'conv-hover-rich.png'],
]) {
  convHovers[text] = await hoverAndMeasure(conv, true, text, file);
}

const behavior = await focusEscapeTest(conv);
// capture focus-visible tip
await conv.evaluate(() => {
  const app = document.querySelector('demo-app');
  const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page');
  const tip = pageEl?.shadowRoot?.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const hostBtn = tip?.querySelector('harmony-button, button');
  const focusTarget = hostBtn?.shadowRoot?.querySelector('button') || hostBtn;
  tip?.removeAttribute('data-dismissed');
  focusTarget?.focus();
});
await delay(400);
await shot(conv, 'conv-focus-basic.png');

await conv.evaluate(() => {
  const app = document.querySelector('demo-app');
  const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page');
  pageEl?.shadowRoot?.querySelector('#props')?.scrollIntoView({ block: 'start' });
});
await delay(300);
await shot(conv, 'conv-cp-light-api.png');
await conv.evaluate(() => {
  const app = document.querySelector('demo-app');
  const pageEl = app?.shadowRoot?.querySelector('demo-tooltips-page');
  pageEl?.shadowRoot?.querySelector('#accessibility')?.scrollIntoView({ block: 'start' });
});
await delay(300);
await shot(conv, 'conv-cp-light-a11y.png');

await setMode(conv, true);
await shot(conv, 'conv-cp-dark-top.png');
convHovers['dark-basic'] = await hoverAndMeasure(conv, true, 'This is a tooltip', 'conv-cp-dark-hover-basic.png');

await conv.emulateMedia({ forcedColors: 'active' });
await delay(400);
await setMode(conv, false);
const fcMetrics = await hoverAndMeasure(conv, true, 'This is a tooltip', 'conv-forced-colors-hover-basic.png');
await shot(conv, 'conv-forced-colors-top.png');

const compare = { refInv, convInv, refHovers, convHovers, behavior, forcedColorsHover: fcMetrics };
writeFileSync(join(outDir, 'compare-notes.json'), JSON.stringify(compare, null, 2));
console.log(JSON.stringify({
  refHeadings: refInv.headings,
  convHeadings: convInv.headings,
  refExamples: refInv.exampleTitles,
  convExamples: convInv.exampleTitles,
  refTipCount: refInv.tipCount,
  convTipCount: convInv.tipCount,
  basicRef: refHovers['This is a tooltip']?.hovered,
  basicConv: convHovers['This is a tooltip']?.hovered,
  posBottomRef: refHovers['Appears on bottom']?.hovered,
  posBottomConv: convHovers['Appears on bottom']?.hovered,
  cornerTopRef: refHovers['Top corners sharp']?.hovered,
  cornerTopConv: convHovers['Top corners sharp']?.hovered,
  leftRef: refHovers['Appears on left']?.hovered,
  leftConv: convHovers['Appears on left']?.hovered,
  behavior,
  fc: fcMetrics?.hovered,
}, null, 2));
await conv.close();
await browser.close();
