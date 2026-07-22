// Capture-only: accordion open + disabled section regions. Evidence only.
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

async function shotRegion(url, out, headingText) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(url + '/components/accordion', { waitUntil: 'networkidle', timeout: 60000 });
  await setCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await setCpLight(page);
  await page.waitForTimeout(400);
  const heading = page.getByText(headingText, { exact: true }).first();
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  writeFileSync(join(art, out + '.png'), await page.screenshot({ type: 'png' }));
  await browser.close();
  console.log('shot', out);
}

await shotRegion('http://localhost:4321', 'ref-acc-defaultopen', 'With Default Open');
await shotRegion('http://localhost:5177', 'conv-acc-defaultopen', 'With Default Open');
await shotRegion('http://localhost:4321', 'ref-acc-disabled', 'Disabled Sections');
await shotRegion('http://localhost:5177', 'conv-acc-disabled', 'Disabled Sections');
console.log('done');
