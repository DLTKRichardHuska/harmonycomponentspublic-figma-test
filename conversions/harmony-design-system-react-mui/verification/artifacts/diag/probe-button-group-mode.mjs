import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/button-group-1';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Fresh page - default mode may be dark per DemoPreferencesProvider
await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const initial = await page.evaluate(() => ({
  modeKey: localStorage.getItem('harmony-demo-mode') || localStorage.getItem('mode') || localStorage.getItem('theme'),
  keys: Object.keys(localStorage),
  html: document.documentElement.className,
  bodyBg: getComputedStyle(document.body).backgroundColor,
}));
console.log('initial', JSON.stringify(initial));

// Ensure dark via UI: if light, click toggle once; if dark, leave
async function ensureDark() {
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark') || getComputedStyle(document.body).backgroundColor === 'rgb(31, 37, 46)');
  if (!isDark) {
    await page.locator('button[aria-label="Toggle color mode"]').click();
    await page.waitForTimeout(600);
  }
}
async function ensureLight() {
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    await page.locator('button[aria-label="Toggle color mode"]').click();
    await page.waitForTimeout(600);
  }
}

await ensureDark();
const darkState = await page.evaluate(() => {
  const g = document.querySelector('.MuiButtonGroup-root');
  const cs = getComputedStyle(g);
  const btns = [...g.querySelectorAll('.MuiButton-root')].map(b => {
    const s = getComputedStyle(b);
    return { t:b.textContent.trim(), bg:s.backgroundColor, c:s.color };
  });
  // also sample a standalone Button if any on page - none
  // sample page primary from theme via a temporary check of CSS vars
  return {
    html: document.documentElement.className,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    groupBg: cs.backgroundColor,
    groupBorder: cs.border,
    btns,
    // MUI css vars
    primary: getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-primary-main'),
    bgDefault: getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-background-default'),
    modeAttr: document.documentElement.getAttribute('data-mui-color-scheme'),
  };
});
await page.locator('.MuiButtonGroup-root').first().screenshot({ path: join(outDir, 'conv-ensure-dark.png') });
await page.locator('.MuiButtonGroup-outlined').first().screenshot({ path: join(outDir, 'conv-outline-ensure-dark.png') });

const outlineDark = await page.evaluate(() => {
  const g = document.querySelector('.MuiButtonGroup-outlined');
  const cs = getComputedStyle(g);
  return {
    groupBg: cs.backgroundColor,
    btns: [...g.querySelectorAll('.MuiButton-root')].map(b => {
      const s = getComputedStyle(b);
      return { t:b.textContent.trim(), bg:s.backgroundColor, c:s.color, border: s.border };
    })
  };
});

await ensureLight();
const lightState = await page.evaluate(() => {
  const g = document.querySelector('.MuiButtonGroup-root');
  const cs = getComputedStyle(g);
  const btns = [...g.querySelectorAll('.MuiButton-root')].map(b => {
    const s = getComputedStyle(b);
    return { t:b.textContent.trim(), bg:s.backgroundColor, c:s.color };
  });
  return {
    html: document.documentElement.className,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    groupBg: cs.backgroundColor,
    btns,
    primary: getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-primary-main'),
  };
});

writeFileSync(join(outDir, 'probe-mode-toggle.json'), JSON.stringify({ darkState, outlineDark, lightState }, null, 2));
console.log(JSON.stringify({ darkState, outlineDark, lightState }, null, 2));
await browser.close();
