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

async function clipShot(page, headingText, file, height = 200) {
  const box = await page.evaluate((t) => {
    const hs = [...document.querySelectorAll('h3')];
    const h = hs.find((el) => (el.textContent || '').trim().toLowerCase().includes(t.toLowerCase()));
    if (!h) return null;
    h.scrollIntoView({ block: 'start' });
    const r = h.getBoundingClientRect();
    return { x: Math.max(0, r.left - 8), y: Math.max(0, r.top - 8) };
  }, headingText);
  if (!box) return false;
  await page.waitForTimeout(250);
  const width = 820;
  writeFileSync(join(art, file), await page.screenshot({ type: 'png', clip: { x: box.x, y: 0, width, height } }));
  return true;
}

async function captureSide(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await applyCpLight(page);
  await page.waitForTimeout(500);
  // scroll add tab into view then clip a region starting at top of viewport after scroll
  await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h3')];
    const h = hs.find((el) => (el.textContent || '').trim().toLowerCase().includes('add tab'));
    if (h) h.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(400);
  const box = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h3')];
    const h = hs.find((el) => (el.textContent || '').trim().toLowerCase().includes('add tab'));
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { x: Math.max(0, r.left - 12), y: Math.max(0, r.top - 12) };
  });
  if (box) {
    writeFileSync(join(art, `${prefix}-addtab-focus.png`), await page.screenshot({ type: 'png', clip: { x: box.x, y: box.y, width: 760, height: 210 } }));
  }
  await browser.close();
}

await captureSide('http://localhost:4321/components/tab-strip', 'ref');
await captureSide('http://localhost:5176/components/tab-strip', 'conv');
console.log('done addtab focus');
