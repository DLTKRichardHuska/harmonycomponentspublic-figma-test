// Capture-only: open dropdown popover on ref + conv. Evidence only, no verdict.
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

async function open(url, out, triggerSelector) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(url + '/components/dropdowns', { waitUntil: 'networkidle', timeout: 60000 });
  await setCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await setCpLight(page);
  await page.waitForTimeout(400);
  const trigger = page.locator(triggerSelector).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click({ force: true });
  await page.waitForTimeout(600);
  writeFileSync(join(art, out + '-open2.png'), await page.screenshot({ type: 'png' }));
  await browser.close();
  console.log('opened', out);
}

await open('http://localhost:4321', 'ref-dropdown', '.dropdown__trigger');
await open('http://localhost:5177', 'conv-dropdown', 'button[role="combobox"]');
console.log('done');
