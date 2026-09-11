import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5178/components/tables', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.setItem('harmony-demo-product','cp');
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
  document.querySelector('demo-app')?.setAttribute('product','cp');
});
await delay(600);
await page.addScriptTag({ content: `window.__deepFind=(sel)=>{const walk=(r)=>{const h=r.querySelector?.(sel);if(h)return h;for(const el of r.querySelectorAll?.('*')||[]){if(el.shadowRoot){const n=walk(el.shadowRoot);if(n)return n;}}return null;};return walk(document);};` });
const token = await page.evaluate(() => {
  const host = window.__deepFind('demo-tables-page');
  const total = host.shadowRoot.querySelector('tr.table-row--total');
  const cs = getComputedStyle(total);
  const fromHost = getComputedStyle(host);
  const fromHtml = getComputedStyle(document.documentElement);
  return {
    totalBg: cs.backgroundColor,
    tableTotalOnHost: fromHost.getPropertyValue('--table-total-bg').trim(),
    tableTotalOnHtml: fromHtml.getPropertyValue('--table-total-bg').trim(),
    stripedOnHost: fromHost.getPropertyValue('--table-row-striped-bg').trim() || fromHost.getPropertyValue('--table-striped-bg').trim(),
  };
});
writeFileSync(outDir + '/total-token.json', JSON.stringify(token, null, 2));
console.log(JSON.stringify(token, null, 2));
await browser.close();
