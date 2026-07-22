// Switch demo product to VP via the header switcher, then capture the pill tablist.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/stepper-tabstrip-1';
mkdirSync(art, { recursive: true });
const CONV = 'http://localhost:5177';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
await page.goto(CONV + '/components/tab-strip', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(400);
// open product switcher
await page.locator('button[aria-haspopup="listbox"]').first().click();
await page.waitForTimeout(200);
// switcher order is CP, VP, PPM, Maconomy -> VP is index 1
await page.locator('[role="option"]').nth(1).click();
await page.waitForTimeout(500);
const pill = page.locator('[role="tablist"]').nth(10);
await pill.scrollIntoViewIfNeeded();
writeFileSync(join(art, 'conv-tl-vp-pill.png'), await pill.screenshot({ type: 'png' }));
// also capture the active + a hovered state via full row
console.log('captured pill');
await browser.close();
