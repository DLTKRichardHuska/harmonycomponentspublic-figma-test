import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/diag';
mkdirSync(outDir, { recursive: true });

async function setConvertedMode(page, mode) {
  await page.addInitScript((m) => {
    localStorage.setItem('theme', m);
    localStorage.setItem('productTheme', 'cp');
  }, mode);
  await page.goto('http://localhost:5176/components/tooltips', { waitUntil: 'networkidle' });
  await page.evaluate((m) => {
    localStorage.setItem('theme', m);
    localStorage.setItem('productTheme', 'cp');
    document.documentElement.classList.toggle('dark', m === 'dark');
    document.documentElement.classList.toggle('light', m === 'light');
    document.documentElement.dataset.colorTheme = 'cp';
  }, mode);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function probeConverted(page, mode) {
  await setConvertedMode(page, mode);
  const trigger = page.locator('button:has-text("Hover me")').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.hover();
  await page.waitForTimeout(600);
  const tip = page.locator('.MuiTooltip-tooltip').first();
  await tip.waitFor({ state: 'visible', timeout: 8000 });
  const styles = await tip.evaluate((el) => {
    const cs = getComputedStyle(el);
    const root = getComputedStyle(document.documentElement);
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily.split(',')[0].replace(/"/g, ''),
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      textPrimaryVar: root.getPropertyValue('--mui-palette-text-primary').trim(),
      contrastTextVar: root.getPropertyValue('--mui-palette-primary-contrastText').trim(),
      htmlClass: document.documentElement.className,
      colorTheme: document.documentElement.dataset.colorTheme,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      tipText: (el.textContent || '').trim(),
    };
  });
  let arrowColor = null;
  const arrow = page.locator('.MuiTooltip-arrow').first();
  if (await arrow.count()) {
    arrowColor = await arrow.evaluate((el) => getComputedStyle(el).color);
  }
  const tipBox = await tip.boundingBox();
  const trigBox = await trigger.boundingBox();
  const shot = join(outDir, `tooltip-conv-basic-cp-${mode}-iter2.png`);
  if (tipBox && trigBox) {
    const x = Math.max(0, Math.min(tipBox.x, trigBox.x) - 24);
    const y = Math.max(0, Math.min(tipBox.y, trigBox.y) - 24);
    const right = Math.max(tipBox.x + tipBox.width, trigBox.x + trigBox.width) + 24;
    const bottom = Math.max(tipBox.y + tipBox.height, trigBox.y + trigBox.height) + 24;
    await page.screenshot({ path: shot, clip: { x, y, width: right - x, height: bottom - y } });
  } else {
    await page.screenshot({ path: shot });
  }
  return { ...styles, arrowColor, shot };
}

async function setReferenceMode(page, mode) {
  await page.addInitScript((m) => {
    localStorage.setItem('theme', m);
  }, mode);
  await page.goto('http://localhost:4321/components/tooltips', { waitUntil: 'networkidle' });
  await page.evaluate((m) => {
    localStorage.setItem('theme', m);
    document.documentElement.classList.toggle('dark', m === 'dark');
    document.documentElement.classList.toggle('light', m !== 'dark');
    for (const t of ['theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy']) {
      document.documentElement.classList.remove(t);
    }
    document.documentElement.classList.add('theme-cp');
  }, mode);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.documentElement.classList.add('theme-cp');
  });
}

async function probeReference(page, mode) {
  await setReferenceMode(page, mode);
  const trigger = page.getByRole('button', { name: /Hover me/i }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.hover();
  await page.waitForTimeout(600);
  const styles = await page.evaluate(() => {
    const tips = [...document.querySelectorAll('.tooltip, [class*="tooltip"]')];
    const visible = tips.find((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return r.width > 10 && r.height > 8 && cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none';
    });
    const el = visible || tips[0];
    if (!el) {
      return {
        error: 'no tip',
        htmlClass: document.documentElement.className,
        bodyBg: getComputedStyle(document.body).backgroundColor,
      };
    }
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      tipText: (el.textContent || '').trim().slice(0, 60),
      className: String(el.className),
      htmlClass: document.documentElement.className,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });
  const shot = join(outDir, `tooltip-ref-basic-cp-${mode}-iter2.png`);
  await page.screenshot({ path: shot });
  return { ...styles, shot };
}

const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString() };
try {
  const convPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  result.convLight = await probeConverted(convPage, 'light');
  await convPage.close();
  const convPage2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  result.convDark = await probeConverted(convPage2, 'dark');
  await convPage2.close();
  const refPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  result.refLight = await probeReference(refPage, 'light');
  await refPage.close();
  const refPage2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  result.refDark = await probeReference(refPage2, 'dark');
  await refPage2.close();
} catch (e) {
  result.error = String(e);
  result.stack = e.stack;
}
await browser.close();
writeFileSync(join(outDir, 'tooltip-dark-check-iter2.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
