import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

function inject() {
  return page.addScriptTag({ content: `window.__deepFind=(sel)=>{const walk=(root)=>{const hit=root.querySelector?.(sel);if(hit)return hit;for(const el of root.querySelectorAll?.('*')||[]){if(el.shadowRoot){const n=walk(el.shadowRoot);if(n)return n;}}return null;};return walk(document);};` });
}

await page.goto('http://localhost:4321/components/tables', { waitUntil: 'networkidle' });
await page.evaluate(() => document.documentElement.classList.add('theme-cp'));
await delay(400);
const ref = await page.evaluate(() => {
  const total = document.querySelector('tr.table-row--total, .table-row--total');
  const ts = total ? getComputedStyle(total) : null;
  const badges = [...document.querySelectorAll('table .badge')].slice(0,4).map(b => {
    const s = getComputedStyle(b);
    return { text: b.textContent.trim(), cls: b.className, bg: s.backgroundColor, color: s.color, radius: s.borderRadius };
  });
  return {
    totalBg: ts?.backgroundColor,
    totalColor: ts?.color,
    badges,
  };
});

await page.goto('http://localhost:5178/components/tables', { waitUntil: 'networkidle' });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.evaluate(() => {
  document.documentElement.classList.add('theme-cp');
  document.querySelector('demo-app')?.setAttribute('product', 'cp');
});
await delay(800);
await inject();
const conv = await page.evaluate(() => {
  const host = window.__deepFind('demo-tables-page');
  const root = host.shadowRoot;
  const total = root.querySelector('tr.table-row--total');
  const ts = total ? getComputedStyle(total) : null;
  const chips = [...root.querySelectorAll('table harmony-chip')].slice(0,4).map(c => {
    const inner = c.shadowRoot?.querySelector('*') || c;
    const s = getComputedStyle(inner);
    return { text: c.textContent.trim(), variant: c.getAttribute('variant'), bg: s.backgroundColor, color: s.color, border: s.borderTopColor, radius: s.borderRadius, h: Math.round(c.getBoundingClientRect().height) };
  });
  // try harmony-badge if any
  const badges = [...root.querySelectorAll('harmony-badge')].length;
  const cc = root.querySelector('harmony-table[variant="commandCenter"]');
  const ccHeaders = [...(cc?.querySelectorAll('thead th')||[])].map(th => th.textContent.replace(/\s+/g,' ').trim());
  const ccRows = [...(cc?.querySelectorAll('tbody tr')||[])].map(tr => tr.innerText.replace(/\s+/g,' ').trim());
  return {
    totalBg: ts?.backgroundColor,
    chips,
    badgeCount: badges,
    ccHeaders,
    ccRows,
    a11y: [...root.querySelectorAll('h2')].some(h => /Accessibility/i.test(h.textContent||'')),
    usage: [...root.querySelectorAll('h2')].some(h => /Usage|Best Practices/i.test(h.textContent||'')),
    literalStub: /Table body content|>COLUMN</.test(root.innerHTML),
  };
});

writeFileSync(`${outDir}/parity-colors.json`, JSON.stringify({ ref, conv }, null, 2));
console.log(JSON.stringify({ ref, conv }, null, 2));
await browser.close();
