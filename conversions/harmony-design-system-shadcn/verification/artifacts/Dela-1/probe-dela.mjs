import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const base = process.env.DELA_PROBE_URL ?? 'http://localhost:5178/foundation/dela';
await page.goto(base, { waitUntil: 'networkidle' });

const btn = page.locator('a', { hasText: 'Dela product brand guide' });
const btnStyle = await btn.evaluate((el) => {
  const s = getComputedStyle(el);
  return { bgImage: s.backgroundImage, color: s.color, radius: s.borderRadius };
});

const swatch = page.locator('[aria-label="Dela sidebar active gradient"]');
const swatchStyle = await swatch.evaluate((el) => {
  const s = getComputedStyle(el);
  return { bgImage: s.backgroundImage, bgColor: s.backgroundColor };
});

const headings = await page.locator('h2').allTextContents();
console.log(JSON.stringify({ btnStyle, swatchStyle, headings }, null, 2));
await browser.close();
