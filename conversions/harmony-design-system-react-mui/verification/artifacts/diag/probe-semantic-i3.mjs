import { chromium } from 'playwright';

const REF = 'http://localhost:4321/foundation/colors';
const CONV = 'http://localhost:5176/foundation/colors';
const KEYS = ['success', 'warning', 'error', 'info'];

async function apply(page, url, product, mode) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(({ product, mode }) => {
    localStorage.setItem('theme', mode);
    localStorage.setItem('colorTheme', product);
    document.documentElement.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add(`theme-${product}`);
    if (mode === 'dark') document.documentElement.classList.add('dark');
  }, { product, mode });
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
}

async function readRef(page) {
  return page.evaluate((keys) => {
    const out = {};
    for (const k of keys) {
      const box = document.querySelector(`[data-semantic="${k}"]`);
      const sw = box?.querySelector('.h-20, [data-css-var]');
      out[k] = sw ? getComputedStyle(sw).backgroundColor : null;
    }
    return out;
  }, KEYS);
}

async function readConv(page) {
  return page.evaluate((keys) => {
    const out = {};
    for (const k of keys) {
      const el = document.querySelector(`[data-color-key="${k}"]`);
      out[k] = el ? getComputedStyle(el).backgroundColor : null;
    }
    return out;
  }, KEYS);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
for (const mode of ['light', 'dark']) {
  await apply(page, REF, 'cp', mode);
  const ref = await readRef(page);
  await apply(page, CONV, 'cp', mode);
  const conv = await readConv(page);
  console.log(`\nCP ${mode}:`);
  for (const k of KEYS) {
    console.log(`  ${k}: ref=${ref[k]} conv=${conv[k]} match=${ref[k] === conv[k]}`);
  }
}
await browser.close();
