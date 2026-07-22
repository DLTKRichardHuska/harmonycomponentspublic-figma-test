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

async function shot(url, prefix, headings) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await applyCpLight(page);
  await page.waitForTimeout(700);

  for (const h of headings) {
    const loc = page.getByRole('heading', { name: h, exact: false }).first();
    if (!(await loc.count())) { console.log(prefix, 'MISSING heading', h); continue; }
    await loc.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(400);
    const safe = h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    writeFileSync(join(art, `${prefix}-${safe}.png`), await page.screenshot({ type: 'png' }));
    console.log(prefix, 'shot', safe);
  }
  await browser.close();
}

const which = process.argv[2];
if (which === 'stepper') {
  const heads = ['Descriptions', 'Disabled'];
  await shot('http://localhost:4321/components/stepper', 'ref-st', heads);
  await shot('http://localhost:5176/components/stepper', 'conv-st', heads);
} else {
  const refHeads = ['Disabled Tab', 'Enforced Icon Position'];
  const convHeads = ['Disabled Tab', 'Enforced Icon Position', 'Scrollable overflow'];
  await shot('http://localhost:4321/components/tab-strip', 'ref-tb', refHeads);
  await shot('http://localhost:5176/components/tab-strip', 'conv-tb', convHeads);
}
console.log('done', which);
