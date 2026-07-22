// Capture-only: toggle Sizes + Without Label regions. Evidence only.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/toggle-dropdown-accordion-1';
mkdirSync(art, { recursive: true });

async function setCpLight(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('colorTheme', 'cp');
      localStorage.setItem('harmony-theme', 'cp');
      localStorage.setItem('harmony-mode', 'light');
      localStorage.setItem('harmony-product', 'cp');
    } catch {}
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '').trim() + ' theme-cp';
  });
}

async function shot(url, out, heading) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(url + '/components/toggle-switches', { waitUntil: 'networkidle', timeout: 60000 });
  await setCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await setCpLight(page);
  await page.waitForTimeout(400);
  const h = page.getByText(heading, { exact: true }).first();
  await h.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  writeFileSync(join(art, out + '.png'), await page.screenshot({ type: 'png' }));
  await browser.close();
  console.log('shot', out);
}

await shot('http://localhost:4321', 'ref-toggle-sizes', 'Sizes');
await shot('http://localhost:5177', 'conv-toggle-sizes', 'Sizes');
console.log('done');
