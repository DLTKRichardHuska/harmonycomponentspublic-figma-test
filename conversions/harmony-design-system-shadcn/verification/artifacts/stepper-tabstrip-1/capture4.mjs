import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/stepper-tabstrip-1';
mkdirSync(art, { recursive: true });
const REF = 'http://localhost:4321';
const CONV = 'http://localhost:5177';
async function shots(base, prefix, sel) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(base + '/components/stepper', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(500);
  const items = page.locator(sel);
  const n = Math.min(await items.count(), 8);
  for (let i = 0; i < n; i++) {
    try {
      await items.nth(i).scrollIntoViewIfNeeded();
      writeFileSync(join(art, `${prefix}-${i}.png`), await items.nth(i).screenshot({ type: 'png' }));
    } catch (e) { console.log('skip', prefix, i); }
  }
  await browser.close();
  console.log('done', prefix, n);
}
await shots(REF, 'ref-st', '.stepper');
await shots(CONV, 'conv-st', '[aria-label="Stepper"]');
console.log('all done');
