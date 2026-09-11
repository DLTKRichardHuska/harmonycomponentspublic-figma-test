import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
const art = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
await delay(700);

// Use demo mode toggle if present
const toggleInfo = await page.evaluate(async () => {
  const app = document.querySelector('demo-app');
  // try attribute / method
  const before = document.documentElement.classList.contains('dark');
  // common patterns
  const btn = app?.shadowRoot?.querySelector('[data-mode], button.mode, .mode-toggle, [aria-label*="Mode"]')
    || document.querySelector('button');
  return { before, appProduct: app?.getAttribute('product'), htmlClass: document.documentElement.className };
});

await page.evaluate(() => {
  document.querySelector('demo-app')?.setAttribute('product', 'cp');
  document.documentElement.classList.add('dark');
  // also set on demo-app if it mirrors
  document.querySelector('demo-app')?.setAttribute('mode', 'dark');
});
await delay(500);

const darkProbe = await page.evaluate(() => {
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
  const item = rail.shadowRoot.querySelector('.left-sidebar__item');
  const icon = item.querySelector('.left-sidebar__icon, harmony-icon');
  const sec = rail.shadowRoot.querySelector('.left-sidebar__section');
  const hostStyle = getComputedStyle(rail);
  return {
    htmlDark: document.documentElement.classList.contains('dark'),
    hostColor: hostStyle.color,
    hostTextPrimary: hostStyle.getPropertyValue('--text-primary').trim(),
    itemColor: getComputedStyle(item).color,
    iconColor: icon ? getComputedStyle(icon).color : null,
    secBg: getComputedStyle(sec).backgroundColor,
    svgColor: item.querySelector('svg') ? getComputedStyle(item.querySelector('svg')).color : null,
  };
});

// screenshot dark demo
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
  walkFind(document, 'demo-left-sidebar-page')?.shadowRoot?.querySelector('.sidebar-demo')?.scrollIntoView({ block: 'center' });
});
await delay(200);
const clip = await page.evaluate(() => {
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
  const r = walkFind(document, 'demo-left-sidebar-page').shadowRoot.querySelector('.sidebar-demo').getBoundingClientRect();
  return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(r.width,1200), height: Math.min(r.height,520) };
});
await page.screenshot({ path: `${art}/conv-dark-demo.png`, clip });

// reference dark for compare
await page.goto('http://localhost:4321/shell/left-sidebar', { waitUntil: 'networkidle' });
await page.evaluate(() => document.documentElement.classList.add('dark'));
await delay(400);
const refDark = await page.evaluate(() => {
  const host = document.querySelector('.cp-sidebar-demo .left-sidebar');
  const item = host.querySelector('.left-sidebar__item');
  const sec = host.querySelector('.left-sidebar__section');
  return {
    itemColor: getComputedStyle(item).color,
    secBg: getComputedStyle(sec).backgroundColor,
    textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
  };
});
await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-dark-demo.png` });

writeFileSync(`${art}/dark-probe.json`, JSON.stringify({ toggleInfo, darkProbe, refDark }, null, 2));
console.log(JSON.stringify({ toggleInfo, darkProbe, refDark }, null, 2));
await browser.close();
