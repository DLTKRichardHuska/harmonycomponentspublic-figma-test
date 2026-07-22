import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-theme', 'cp');
    localStorage.setItem('harmony-mode', 'light');
    const de = document.documentElement;
    de.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    de.classList.add('theme-cp');
    de.dataset.theme = 'cp';
    de.dataset.mode = 'light';
  });
}

async function zoom(url, prefix, sel) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 3 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await applyCpLight(page);
  await page.waitForTimeout(800);
  const loc = page.locator(sel).first();
  if (await loc.count()) {
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(200);
    writeFileSync(join(art, `${prefix}-firstrow.png`), await loc.screenshot({ type: 'png' }));
    console.log(prefix, 'ok');
  } else {
    console.log(prefix, 'NOT FOUND', sel);
  }
  await browser.close();
}

// First MUI stepper on the converted page, and first stepper card on reference.
await zoom('http://localhost:4321/components/stepper', 'ref', '.stepper, [class*="stepper"]');
await zoom('http://localhost:5176/components/stepper', 'conv', '.MuiStepper-root');
console.log('done');
