import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const outDir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5178/components/notification-badges', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  if (app) { app.product = 'cp'; localStorage.setItem('harmony-demo-product', 'cp'); }
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
});
await delay(400);
const client = await page.context().newCDPSession(page);
await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
await delay(400);
const fc = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const root = app?.shadowRoot?.querySelector('demo-notification-badges-page')?.shadowRoot;
  return [...root.querySelectorAll('harmony-notification-badge')].slice(0, 30).map((el) => {
    const part = el.shadowRoot?.querySelector('[part=badge]') || el.shadowRoot?.querySelector('span');
    const s = getComputedStyle(part);
    return {
      type: el.getAttribute('type'),
      size: el.getAttribute('size'),
      variant: el.getAttribute('variant'),
      border: el.hasAttribute('border'),
      text: part.textContent.trim(),
      color: s.color,
      bg: s.backgroundColor,
      borderCss: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
      forcedColorAdjust: s.forcedColorAdjust,
      w: Math.round(part.getBoundingClientRect().width),
      h: Math.round(part.getBoundingClientRect().height),
    };
  });
});
writeFileSync(join(outDir, 'forced-colors-badges.json'), JSON.stringify(fc, null, 2));
console.log(JSON.stringify(fc.filter(b => b.type !== 'dot'), null, 2));
await page.evaluate(() => window.scrollTo(0, 280));
await delay(200);
await page.screenshot({ path: join(outDir, 'conv-nb-forced-colors-numbers.png'), fullPage: false });
await browser.close();
