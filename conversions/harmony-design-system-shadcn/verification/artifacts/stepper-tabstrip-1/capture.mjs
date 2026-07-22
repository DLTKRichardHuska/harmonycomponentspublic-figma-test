// Capture-only evidence for Stepper + TabStrip fidelity verify (PNG + JSON only).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/stepper-tabstrip-1';
mkdirSync(art, { recursive: true });

const REF = 'http://localhost:4321';
const CONV = 'http://localhost:5177';

async function setRefTheme(page, product) {
  await page.evaluate((p) => {
    try {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('colorTheme', p);
      localStorage.setItem('harmony-theme', p);
      localStorage.setItem('harmony-mode', 'light');
      localStorage.setItem('harmony-product', p);
    } catch {}
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '').trim() + ' theme-' + p;
  }, product);
}

async function setConvTheme(page, product) {
  await page.evaluate((p) => {
    try {
      localStorage.setItem('harmony-shadcn-product', p);
      localStorage.setItem('harmony-shadcn-mode', 'light');
    } catch {}
  }, product);
}

async function fullPage(base, route, out, product = 'cp') {
  const isRef = base === REF;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  if (isRef) await setRefTheme(page, product);
  else await setConvTheme(page, product);
  await page.reload({ waitUntil: 'networkidle' });
  if (isRef) await setRefTheme(page, product);
  await page.waitForTimeout(600);
  writeFileSync(join(art, out + '.png'), await page.screenshot({ type: 'png', fullPage: true }));
  const inv = await page.evaluate(() => {
    const text = (sel) => [...document.querySelectorAll(sel)].map((n) => (n.textContent || '').trim().replace(/\s+/g, ' ')).filter(Boolean);
    return { h1: text('h1'), h2: text('h2, .section__title'), h3: text('h3') };
  });
  writeFileSync(join(art, out + '-inventory.json'), JSON.stringify(inv, null, 2));
  await browser.close();
  console.log('page', out);
}

await fullPage(REF, '/components/stepper', 'ref-stepper');
await fullPage(CONV, '/components/stepper', 'conv-stepper');
await fullPage(REF, '/components/tab-strip', 'ref-tabstrip');
await fullPage(CONV, '/components/tab-strip', 'conv-tabstrip');
await fullPage(REF, '/components/tab-strip', 'ref-tabstrip-vp', 'vp');
await fullPage(CONV, '/components/tab-strip', 'conv-tabstrip-vp', 'vp');

console.log('done');
