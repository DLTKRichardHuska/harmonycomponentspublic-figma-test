import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/button-group-1';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function applyTheme(p, theme = 'cp', mode = 'light') {
  await p.evaluate(({ theme, mode }) => {
    localStorage.setItem('theme', mode);
    localStorage.setItem('colorTheme', theme);
    document.documentElement.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-' + theme);
    if (mode === 'dark') document.documentElement.classList.add('dark');
  }, { theme, mode });
}

async function probe(url, label) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyTheme(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(outDir, label + '-full.png'), fullPage: true });

  return page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const headings = [...document.querySelectorAll('h2, h3, h4')].map((el) => el.textContent?.trim()).filter(Boolean);
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    const groupStyles = groups.map((g, i) => {
      const cs = getComputedStyle(g);
      const buttons = [...g.querySelectorAll('button, .btn, .MuiButton-root')].map((b) => {
        const bcs = getComputedStyle(b);
        return {
          text: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40),
          bg: bcs.backgroundColor,
          color: bcs.color,
          borderTop: bcs.borderTop,
          borderRight: bcs.borderRight,
          borderBottom: bcs.borderBottom,
          borderLeft: bcs.borderLeft,
          borderRadius: bcs.borderRadius,
          height: bcs.height,
          width: bcs.width,
          padding: bcs.padding,
          fontSize: bcs.fontSize,
          fontWeight: bcs.fontWeight,
          opacity: bcs.opacity,
          disabled: b.disabled || b.classList.contains('Mui-disabled'),
          boxShadow: bcs.boxShadow,
        };
      });
      return {
        i,
        classes: String(g.className).slice(0, 200),
        display: cs.display,
        flexDirection: cs.flexDirection,
        gap: cs.gap,
        padding: cs.padding,
        border: cs.border,
        borderRadius: cs.borderRadius,
        backgroundColor: cs.backgroundColor,
        width: Math.round(g.getBoundingClientRect().width),
        height: Math.round(g.getBoundingClientRect().height),
        buttons,
      };
    });
    const nav = [...document.querySelectorAll('nav a, .article-nav a')].map((a) => a.textContent?.trim());
    const exampleTitles = [...document.querySelectorAll('.example-section__title, [class*="DemoExample"] h3, h3')].map((el) => el.textContent?.trim()).filter(Boolean);
    return { h1, headings, nav, exampleTitles, groupCount: groups.length, groupStyles };
  });
}

const ref = await probe('http://localhost:4321/components/button-groups', 'ref');
const conv = await probe('http://localhost:5176/components/button-groups', 'conv');

await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle' });
await applyTheme(page);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('.btn-group').first().screenshot({ path: join(outDir, 'ref-default-group.png') });
const refOutline = page.locator('.btn-group--outline').first();
if (await refOutline.count()) await refOutline.screenshot({ path: join(outDir, 'ref-outline-group.png') });
const refVert = page.locator('.btn-group--vertical').first();
if (await refVert.count()) await refVert.screenshot({ path: join(outDir, 'ref-vertical-group.png') });
const refDisabled = page.locator('.btn-group').nth(4);
await refDisabled.screenshot({ path: join(outDir, 'ref-disabled-ish.png') });

await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle' });
await applyTheme(page);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('.MuiButtonGroup-root').first().screenshot({ path: join(outDir, 'conv-default-group.png') });
const convOutline = page.locator('.MuiButtonGroup-outlined').first();
if (await convOutline.count()) await convOutline.screenshot({ path: join(outDir, 'conv-outline-group.png') });
const convVert = page.locator('.MuiButtonGroup-vertical').first();
if (await convVert.count()) await convVert.screenshot({ path: join(outDir, 'conv-vertical-group.png') });

await applyTheme(page, 'cp', 'dark');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('.MuiButtonGroup-root').first().screenshot({ path: join(outDir, 'conv-default-dark.png') });

await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle' });
await applyTheme(page, 'cp', 'dark');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.locator('.btn-group').first().screenshot({ path: join(outDir, 'ref-default-dark.png') });

// mobile stack check
await page.setViewportSize({ width: 390, height: 800 });
await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle' });
await applyTheme(page);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const refMobile = await page.evaluate(() => {
  const g = document.querySelector('.btn-group--horizontal');
  if (!g) return null;
  const cs = getComputedStyle(g);
  return { flexDirection: cs.flexDirection, width: cs.width };
});
await page.locator('.btn-group').first().screenshot({ path: join(outDir, 'ref-mobile-default.png') });

await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle' });
await applyTheme(page);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const convMobile = await page.evaluate(() => {
  const g = document.querySelector('.MuiButtonGroup-horizontal');
  if (!g) return null;
  const cs = getComputedStyle(g);
  return { flexDirection: cs.flexDirection, width: cs.width };
});
await page.locator('.MuiButtonGroup-root').first().screenshot({ path: join(outDir, 'conv-mobile-default.png') });

const result = { ref, conv, refMobile, convMobile };
writeFileSync(join(outDir, 'probe.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
