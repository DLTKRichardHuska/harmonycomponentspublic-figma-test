import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const outDir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:4321/components/notification-badges', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
});
await delay(300);
const ref = await page.evaluate(() =>
  [...document.querySelectorAll('.notification-badge--number')].slice(0, 12).map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      className: el.className,
      w: Math.round(r.width),
      h: Math.round(r.height),
      pad: s.padding,
      minW: s.minWidth,
      minH: s.minHeight,
      fs: s.fontSize,
      lh: s.lineHeight,
      display: s.display,
      boxSizing: s.boxSizing,
      border: s.border,
      text: el.textContent.trim(),
    };
  }),
);

await page.goto('http://localhost:5178/components/notification-badges', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  if (app) {
    app.product = 'cp';
    localStorage.setItem('harmony-demo-product', 'cp');
  }
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
});
await delay(500);
const conv = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const root = app?.shadowRoot?.querySelector('demo-notification-badges-page')?.shadowRoot;
  return [...root.querySelectorAll('harmony-notification-badge')]
    .filter((el) => el.getAttribute('type') === 'number')
    .map((el) => {
      const assigned =
        el.shadowRoot?.querySelector('slot:not([name])')?.assignedElements?.({ flatten: true }) || [];
      if (assigned.length) return null;
      const part = el.shadowRoot?.querySelector('[part=badge]') || el.shadowRoot?.querySelector('span');
      const s = getComputedStyle(part);
      const r = part.getBoundingClientRect();
      return {
        attrs: {
          size: el.getAttribute('size'),
          border: el.hasAttribute('border'),
          variant: el.getAttribute('variant'),
        },
        w: Math.round(r.width),
        h: Math.round(r.height),
        pad: s.padding,
        minW: s.minWidth,
        minH: s.minHeight,
        fs: s.fontSize,
        lh: s.lineHeight,
        display: s.display,
        boxSizing: s.boxSizing,
        border: s.border,
        text: part.textContent.trim(),
      };
    })
    .filter(Boolean)
    .slice(0, 12);
});

writeFileSync(join(outDir, 'number-badge-probe.json'), JSON.stringify({ ref, conv }, null, 2));
console.log(JSON.stringify({ ref, conv }, null, 2));
await browser.close();
