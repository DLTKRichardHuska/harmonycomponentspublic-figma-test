import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });

await page.goto('http://localhost:5178/shell/header', { waitUntil: 'networkidle', timeout: 60000 });
await delay(1500);
console.log('url', page.url());
console.log('title', await page.title());
const snap = await page.evaluate(() => ({
  html: document.documentElement.outerHTML.slice(0, 1500),
  bodyText: document.body?.innerText?.slice(0, 800),
  custom: [...document.querySelectorAll('*')].map(e => e.tagName.toLowerCase()).filter(t => t.includes('-')).slice(0, 40),
  demoApp: !!document.querySelector('demo-app'),
}));
console.log(JSON.stringify(snap, null, 2));
writeFileSync(join(outDir, 'van-page.html'), snap.html);
await page.screenshot({ path: join(outDir, 'van-full.png'), fullPage: false });

// try setting product and waiting for CE
await page.evaluate(() => {
  localStorage.setItem('harmony-demo-product', 'cp');
  localStorage.setItem('harmony-color-scheme', 'light');
});
await page.reload({ waitUntil: 'networkidle' });
await delay(2000);
await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  if (app) app.product = 'cp';
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
});
await delay(1500);

const deep = await page.evaluate(() => {
  function walk(root, acc = []) {
    root.querySelectorAll('*').forEach((el) => {
      acc.push(el.tagName.toLowerCase());
      if (el.shadowRoot) walk(el.shadowRoot, acc);
    });
    return acc;
  }
  const tags = walk(document).filter((t) => t.includes('header') || t.includes('shell') || t.includes('demo'));
  let headerHtml = null;
  function findHeader(root) {
    for (const el of root.querySelectorAll('harmony-shell-header, demo-shell-header-page')) {
      return { tag: el.tagName, html: el.outerHTML.slice(0, 500), shadow: el.shadowRoot ? el.shadowRoot.innerHTML.slice(0, 1500) : null };
    }
    for (const el of root.querySelectorAll('*')) {
      if (el.shadowRoot) {
        const f = findHeader(el.shadowRoot);
        if (f) return f;
      }
    }
    return null;
  }
  return {
    tags: [...new Set(tags)],
    found: findHeader(document),
    text: document.body.innerText.slice(0, 1200),
    hrefs: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href),
  };
});
console.log(JSON.stringify(deep, null, 2));
writeFileSync(join(outDir, 'van-deep.json'), JSON.stringify(deep, null, 2));
await page.screenshot({ path: join(outDir, 'van-after.png'), fullPage: false });
await browser.close();
