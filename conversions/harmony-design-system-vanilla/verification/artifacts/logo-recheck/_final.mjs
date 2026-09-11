import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const outDir = 'conversions/harmony-design-system-vanilla/verification/artifacts/logo-recheck';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
const consoleMsgs = [];
const pageErrors = [];
page.on('console', (m) => consoleMsgs.push(m.type() + ': ' + m.text()));
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.addInitScript(() => {
  localStorage.setItem('harmony-demo-product', 'cp');
  localStorage.setItem('harmony-color-scheme', 'light');
});
await page.goto('http://localhost:5178/shell/header', { waitUntil: 'networkidle', timeout: 90000 });
await delay(2500);
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-cp');
  document.querySelector('demo-app')?.setAttribute('product', 'cp');
});
await delay(1000);

const dump = await page.evaluate(() => {
  const html = document.documentElement.outerHTML.slice(0, 2500);
  const demoApp = document.querySelector('demo-app');
  const sr = demoApp?.shadowRoot;
  const children = sr ? [...sr.children].map((c) => c.tagName) : [];
  const inner = sr?.innerHTML?.slice(0, 1500) || null;
  const headers = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll('*')) {
      if (el.tagName === 'HARMONY-SHELL-HEADER') {
        const logo = el.shadowRoot?.querySelector('.header__logo');
        headers.push({
          product: el.getAttribute('product-name'),
          logoInner: logo?.innerHTML?.slice(0, 400) || null,
          title: el.shadowRoot?.querySelector('.header__title')?.textContent || null,
          rect: (() => {
            const r = el.getBoundingClientRect();
            return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) };
          })(),
        });
      }
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  if (sr) walk(sr);
  walk(document);
  return {
    bodyChildCount: document.body?.childElementCount,
    demoApp: !!demoApp,
    shadowChildren: children,
    shadowSample: inner,
    headers,
    htmlHead: html,
  };
});

writeFileSync(`${outDir}/conv-dump.json`, JSON.stringify({ dump, pageErrors, consoleMsgs: consoleMsgs.slice(0, 40) }, null, 2));
console.log('errors', pageErrors);
console.log('console', consoleMsgs.filter((m) => /error|fail|productLogo|resolve/i.test(m)).slice(0, 20));
console.log('demoApp', dump.demoApp, 'shadowChildren', dump.shadowChildren);
console.log('headers', JSON.stringify(dump.headers, null, 2));
await page.screenshot({ path: `${outDir}/conv-final.png`, fullPage: false });

// scroll to first header if any
if (dump.headers[0] && dump.headers[0].rect.h > 0) {
  const h = dump.headers[0].rect;
  await page.screenshot({
    path: `${outDir}/conv-header-demo.png`,
    clip: { x: Math.max(0, h.left), y: Math.max(0, h.top), width: Math.min(1000, Math.max(200, h.w)), height: Math.min(80, Math.max(40, h.h)) },
  });
  // logo crop beside Costpoint
  const logoInfo = dump.headers[0];
  console.log('logoInner sample', logoInfo.logoInner?.slice(0, 200));
}
await browser.close();
