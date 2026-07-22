import { chromium } from 'playwright';
const CONV = 'http://localhost:5177';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
await page.goto(CONV + '/components/tab-strip', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(300);
await page.locator('button[aria-haspopup="listbox"]').first().click();
await page.waitForTimeout(150);
const options = await page.locator('[role="option"]').allTextContents();
await page.locator('[role="option"]').nth(2).click();
await page.waitForTimeout(400);
const product = await page.evaluate(() => document.documentElement.dataset.product);
// find the pill tablist (11th) active trigger and read computed styles + classlist
const info = await page.evaluate(() => {
  const lists = document.querySelectorAll('[role="tablist"]');
  const pill = lists[10];
  if (!pill) return { err: 'no pill list', count: lists.length };
  const active = pill.querySelector('[data-state="active"]');
  const cs = active ? getComputedStyle(active) : null;
  return {
    count: lists.length,
    activeText: active ? active.textContent : null,
    className: active ? active.className : null,
    bg: cs ? cs.backgroundColor : null,
    borderBottom: cs ? cs.borderBottomWidth + ' ' + cs.borderBottomColor : null,
    borderRadius: cs ? cs.borderTopLeftRadius : null,
  };
});
console.log(JSON.stringify({ product, options, info }, null, 2));
await browser.close();
