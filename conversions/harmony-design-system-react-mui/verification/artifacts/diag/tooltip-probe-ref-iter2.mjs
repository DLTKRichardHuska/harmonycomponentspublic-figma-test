import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/diag';

async function refTip(page, mode) {
  await page.goto('http://localhost:4321/components/tooltips', { waitUntil: 'networkidle' });
  await page.evaluate((m) => {
    localStorage.setItem('theme', m);
    document.documentElement.classList.toggle('dark', m === 'dark');
    document.documentElement.classList.toggle('light', m !== 'dark');
    document.documentElement.classList.remove('theme-vp','theme-ppm','theme-maconomy');
    document.documentElement.classList.add('theme-cp');
  }, mode);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => document.documentElement.classList.add('theme-cp'));
  const trigger = page.getByRole('button', { name: /Hover me/i }).first();
  await trigger.hover();
  await page.waitForTimeout(500);
  const tip = await page.evaluate(() => {
    const el = document.querySelector('.tooltip__content');
    if (!el) return { error: 'no .tooltip__content' };
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      text: (el.textContent||'').trim(),
      htmlClass: document.documentElement.className,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });
  const shot = join(outDir, `tooltip-ref-content-cp-${mode}-iter2.png`);
  const box = await page.locator('.tooltip__content').first().boundingBox();
  const tbox = await trigger.boundingBox();
  if (box && tbox) {
    const x = Math.max(0, Math.min(box.x, tbox.x) - 24);
    const y = Math.max(0, Math.min(box.y, tbox.y) - 24);
    const right = Math.max(box.x + box.width, tbox.x + tbox.width) + 24;
    const bottom = Math.max(box.y + box.height, tbox.y + tbox.height) + 24;
    await page.screenshot({ path: shot, clip: { x, y, width: right - x, height: bottom - y } });
  }
  return { ...tip, shot };
}

async function convPositions(page) {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('productTheme', 'cp');
  });
  await page.goto('http://localhost:5176/components/tooltips', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const results = {};
  for (const label of ['Top', 'Bottom', 'Left', 'Right']) {
    const btn = page.getByRole('button', { name: label, exact: true }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.hover();
    await page.waitForTimeout(400);
    const tip = page.locator('.MuiTooltip-tooltip').first();
    await tip.waitFor({ state: 'visible', timeout: 5000 });
    results[label] = await tip.evaluate((el) => (el.textContent || '').trim());
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
  }
  return results;
}

const browser = await chromium.launch({ headless: true });
const out = {};
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
out.refLight = await refTip(page, 'light');
out.refDark = await refTip(page, 'dark');
await page.close();
const p2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
out.convPositions = await convPositions(p2);
await browser.close();
writeFileSync(join(outDir, 'tooltip-ref-content-iter2.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
