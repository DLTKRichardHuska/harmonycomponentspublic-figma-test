import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
const art = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
await delay(800);
await page.evaluate(() => document.querySelector('demo-app')?.setAttribute('product', 'cp'));
await delay(400);

const data = await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  const pageEl = walkFind(document, 'demo-left-sidebar-page');
  const analyzeRail = (sel) => {
    const rail = typeof sel === 'string' ? walkFind(document, sel) : sel;
    if (!rail) return null;
    const sr = rail.shadowRoot;
    const hostS = getComputedStyle(rail);
    const section = sr?.querySelector('.left-sidebar__section, [part="section"]');
    const ss = section ? getComputedStyle(section) : null;
    const nav = sr?.querySelector('nav, .left-sidebar__nav, [part="nav"]');
    const ns = nav ? getComputedStyle(nav) : null;
    const items = [...(sr?.querySelectorAll('.left-sidebar__item') || [])].map(el => ({
      label: el.querySelector('.left-sidebar__label')?.textContent?.trim(),
      className: el.className,
      ariaCurrent: el.getAttribute('aria-current'),
      dataActive: el.getAttribute('data-active'),
      bg: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      radius: getComputedStyle(el).borderRadius,
      h: Math.round(el.getBoundingClientRect().height),
      w: Math.round(el.getBoundingClientRect().width),
      icon: !!el.querySelector('svg, img, harmony-icon'),
    }));
    const separator = sr?.querySelector('.left-sidebar__separator, hr, [class*="divider"]');
    return {
      attrs: Object.fromEntries([...rail.attributes].map(a => [a.name, a.value])),
      host: {
        w: Math.round(rail.getBoundingClientRect().width),
        h: Math.round(rail.getBoundingClientRect().height),
        bg: hostS.backgroundColor, radius: hostS.borderRadius, shadow: hostS.boxShadow,
        border: `${hostS.borderTopWidth} ${hostS.borderRightWidth} ${hostS.borderRightColor}`,
        overflow: hostS.overflow, position: hostS.position,
      },
      nav: nav ? {
        w: Math.round(nav.getBoundingClientRect().width),
        bg: ns.backgroundColor, radius: ns.borderRadius, shadow: ns.boxShadow,
        border: `${ns.borderTopWidth}/${ns.borderRightWidth} ${ns.borderRightColor}`,
        gap: ns.gap, padding: ns.padding,
      } : null,
      section: section ? {
        count: sr.querySelectorAll('.left-sidebar__section, [part="section"]').length,
        w: Math.round(section.getBoundingClientRect().width),
        h: Math.round(section.getBoundingClientRect().height),
        bg: ss.backgroundColor, radius: ss.borderRadius, shadow: ss.boxShadow,
        border: `${ss.borderTopWidth}/${ss.borderRightWidth} ${ss.borderRightColor}`,
        padding: ss.padding,
      } : null,
      separator: !!separator,
      itemCount: items.length,
      items,
    };
  };

  const def = analyzeRail('#demo-left-default');
  const custom = analyzeRail('#demo-left-custom');
  const panel = analyzeRail('harmony-left-sidebar[panel-open]');
  const expanded = analyzeRail(pageEl.shadowRoot.querySelector('harmony-left-sidebar[expanded]:not(#demo-left-custom)'));

  // focus visible
  const rail = walkFind(document, '#demo-left-default');
  const btn = rail.shadowRoot.querySelector('.left-sidebar__item');
  btn.focus();
  const focus = {
    outline: getComputedStyle(btn).outline,
    outlineOffset: getComputedStyle(btn).outlineOffset,
    boxShadow: getComputedStyle(btn).boxShadow,
  };

  // snippets / a11y text on page
  const text = pageEl.shadowRoot.textContent;
  const hasA11y = /accessib|keyboard|tab/i.test(text);
  const hasStyling = /nav-bg|border-radius|shadow|styling/i.test(text);
  const hasBehavior = /collaps|52px|220px|200ms|fixed position/i.test(text);
  const snippetsEl = walkFind(document, 'demo-consume-snippets');

  return { def, custom, panel, expanded, focus, hasA11y, hasStyling, hasBehavior, snippets: !!snippetsEl,
    headerTitle: walkFind(document,'demo-page-header')?.getAttribute('title') };
});

// hover screenshots with scroll into view
await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  walkFind(document, 'demo-left-sidebar-page')?.shadowRoot?.querySelector('.sidebar-demo')?.scrollIntoView({ block: 'start' });
});
await delay(200);
const box = await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  const pageEl = walkFind(document, 'demo-left-sidebar-page');
  const demos = [...pageEl.shadowRoot.querySelectorAll('.sidebar-demo')];
  return demos.map(d => {
    const r = d.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(r.width, 1300), height: Math.min(r.height, 500) };
  });
});
for (let i = 0; i < box.length; i++) {
  const b = box[i];
  if (b.width > 10 && b.height > 10 && b.y < 1000) {
    await page.screenshot({ path: `${art}/conv-sec-${i}.png`, clip: b });
  }
}
// hover first
const hb = await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  const r = walkFind(document, '#demo-left-default').getBoundingClientRect();
  return { x: r.x + 15, y: r.y + 30 };
});
await page.mouse.move(hb.x, hb.y);
await delay(450);
await page.screenshot({ path: `${art}/conv-sec-0-hover.png`, clip: box[0] });

// product VP
await page.evaluate(() => document.querySelector('demo-app')?.setAttribute('product', 'vp'));
await delay(700);
const vp = await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  const rail = walkFind(document, '#demo-left-default');
  return {
    labels: [...(rail?.shadowRoot?.querySelectorAll('.left-sidebar__label') || [])].map(l => l.textContent.trim()),
    sections: rail?.shadowRoot?.querySelectorAll('.left-sidebar__section').length,
  };
});

// back to CP, forced-colors item active
await page.evaluate(() => document.querySelector('demo-app')?.setAttribute('product', 'cp'));
await delay(400);
await page.emulateMedia({ forcedColors: 'active' });
await delay(300);
const hc2 = await page.evaluate(() => {
  function walkFind(root, sel) {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  }
  const rail = walkFind(document, '#demo-left-default');
  const section = rail.shadowRoot.querySelector('.left-sidebar__section');
  const item = rail.shadowRoot.querySelector('.left-sidebar__item');
  item.focus();
  item.click();
  const active = rail.shadowRoot.querySelector('.left-sidebar__item--active, .left-sidebar__item[data-active], [aria-current="page"]') || item;
  return {
    sectionBg: getComputedStyle(section).backgroundColor,
    sectionBorder: getComputedStyle(section).border,
    itemOutline: getComputedStyle(item).outline,
    activeBg: getComputedStyle(active).backgroundColor,
    activeOutline: getComputedStyle(active).outline,
    activeBorder: getComputedStyle(active).border,
    activeColor: getComputedStyle(active).color,
  };
});
await page.screenshot({ path: `${art}/conv-hc2.png`, fullPage: false });

writeFileSync(`${art}/conv-metrics.json`, JSON.stringify({ data, vp, hc2 }, null, 2));
console.log(JSON.stringify({ 
  defSection: data.def?.section, defHost: data.def?.host, defNav: data.def?.nav,
  sections: data.def?.section, itemSample: data.def?.items?.slice(0,3),
  custom: data.custom?.items, panel: data.panel?.items?.slice(0,2),
  focus: data.focus, flags: { hasA11y: data.hasA11y, hasStyling: data.hasStyling, hasBehavior: data.hasBehavior, snippets: data.snippets },
  vp, hc2
}, null, 2));
await browser.close();
