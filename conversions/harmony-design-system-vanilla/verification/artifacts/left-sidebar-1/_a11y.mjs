import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
await delay(700);
const info = await page.evaluate(() => {
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
  const panel = pageEl.shadowRoot.querySelector('harmony-left-sidebar[panel-open]');
  const tips = [...(panel?.shadowRoot?.querySelectorAll('harmony-tooltip') || [])];
  const rail = walkFind(document, '#demo-left-default');
  const items = [...rail.shadowRoot.querySelectorAll('.left-sidebar__item')];
  items[0].focus();
  return {
    tipCount: tips.length,
    tipSample: tips.slice(0,2).map(t => t.getAttribute('text')),
    panelW: Math.round(panel.getBoundingClientRect().width),
    kb: {
      focused: items[0] === rail.shadowRoot.activeElement,
      outline: getComputedStyle(items[0]).outline,
      buttons: items.filter(i => i.tagName === 'BUTTON').length,
      nav: !!rail.shadowRoot.querySelector('nav[part="nav"], nav'),
    },
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
