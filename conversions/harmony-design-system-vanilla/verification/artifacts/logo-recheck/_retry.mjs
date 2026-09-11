import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const outDir = 'conversions/harmony-design-system-vanilla/verification/artifacts/logo-recheck';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
await page.route('**/*', (route) => route.continue());
await page.addInitScript(() => {
  localStorage.setItem('harmony-demo-product', 'cp');
  localStorage.setItem('harmony-color-scheme', 'light');
});
await page.goto('http://localhost:5178/shell/header', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.reload({ waitUntil: 'domcontentloaded' });
await delay(2000);
const overlay = await page.evaluate(() => {
  const err = document.querySelector('vite-error-overlay');
  return {
    hasOverlay: !!err,
    bodyText: (document.body?.innerText || '').slice(0, 800),
    title: document.title,
  };
});
console.log(JSON.stringify(overlay, null, 2));
await page.screenshot({ path: `${outDir}/conv-retry-full.png`, fullPage: false });

// Try to dismiss overlay and inspect logo if page somehow loaded
if (overlay.hasOverlay) {
  writeFileSync(`${outDir}/conv-status.json`, JSON.stringify({ status: 'vite-error', ...overlay }, null, 2));
} else {
  const info = await page.evaluate(() => {
    const findLogos = (root, acc = []) => {
      for (const el of root.querySelectorAll('harmony-shell-header')) {
        const logo = el.shadowRoot?.querySelector('.header__logo');
        const svg = logo?.querySelector('svg');
        const r = svg?.getBoundingClientRect();
        acc.push({
          productName: el.getAttribute('product-name'),
          logoHtml: logo?.innerHTML?.slice(0, 300) || null,
          hasSvg: !!svg,
          fills: svg ? [...svg.querySelectorAll('path')].slice(0, 3).map((p) => p.getAttribute('fill')) : [],
          clipWH: svg ? [...svg.querySelectorAll('clipPath rect')].map((re) => [re.getAttribute('width'), re.getAttribute('height')]) : [],
          box: r ? { w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), top: Math.round(r.top) } : null,
        });
      }
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) findLogos(el.shadowRoot, acc);
      }
      return acc;
    };
    return findLogos(document);
  });
  console.log('logos', JSON.stringify(info, null, 2));
  writeFileSync(`${outDir}/conv-status.json`, JSON.stringify({ status: 'ok', logos: info }, null, 2));
  if (info[0]?.box) {
    const b = info[0].box;
    await page.screenshot({
      path: `${outDir}/conv-logo-visible-crop.png`,
      clip: { x: Math.max(0, b.left - 8), y: Math.max(0, b.top - 8), width: 220, height: 40 },
    });
  }
}
await browser.close();
