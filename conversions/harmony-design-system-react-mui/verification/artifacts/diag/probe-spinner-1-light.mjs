import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const out = 'conversions/harmony-design-system-react-mui/verification/artifacts/spinner-1';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

async function forceLight() {
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-mui-color-scheme', 'light');
    document.documentElement.style.colorScheme = 'light';
    // click toggle if currently dark
    const btn = [...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label')||'').toLowerCase().includes('color mode') || (b.getAttribute('aria-label')||'').toLowerCase().includes('mode'));
    if (btn && document.documentElement.classList.contains('dark')) btn.click();
  });
  await page.waitForTimeout(600);
  // if still dark, remove dark
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    const root = document.querySelector('[data-mui-color-scheme]');
    if (root) root.setAttribute('data-mui-color-scheme', 'light');
  });
  await page.waitForTimeout(500);
}

async function contentInventory(isConv) {
  return page.evaluate((conv) => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const desc = document.querySelector('.page-header__description, [class*=\"DemoPageHeader\"] p, article > header p, article p')?.textContent?.trim()
      || [...document.querySelectorAll('article p')].map(p => p.textContent.trim()).find(t => t.length > 20);
    const headings = [...document.querySelectorAll('h2, h3')].map(h => h.textContent.trim()).filter(Boolean);
    const a11yTitles = [...document.querySelectorAll('.a11y-card__title, [class*=\"A11yCard\"] h3, h3')].map(h => h.textContent.trim());
    const nav = [...document.querySelectorAll('.article-nav a, nav a')].map(a => a.textContent.trim()).filter(t => /examples|props|access|mapping/i.test(t));
    const texts = {
      loading: !!document.body.textContent.includes('Loading...'),
      loadingContent: !!document.body.textContent.includes('Loading content...'),
      animationPrefs: !!document.body.textContent.includes('Animation Preferences') || !!document.body.textContent.includes('prefers-reduced-motion'),
      reducedMotion: !!document.body.textContent.includes('reduced motion'),
    };
    // visible page description near title
    const headerPs = [...document.querySelectorAll('article header p, article > .MuiBox-root p, article p')].slice(0, 3).map(p => p.textContent.trim());
    return { h1, headings, nav, texts, headerPs, htmlDark: document.documentElement.classList.contains('dark'), scheme: document.documentElement.getAttribute('data-mui-color-scheme') };
  }, isConv);
}

await page.goto('http://localhost:4321/components/spinner', { waitUntil: 'networkidle' });
await forceLight();
const refInv = await contentInventory(false);
await page.screenshot({ path: join(out, 'ref-light-page.png'), fullPage: true });
const ex = page.locator('#examples');
if (await ex.count()) await ex.screenshot({ path: join(out, 'ref-light-examples.png') });

await page.goto('http://localhost:5176/components/spinner', { waitUntil: 'networkidle' });
// click toggle to light if dark
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.setAttribute('data-mui-color-scheme', 'light');
});
await page.waitForTimeout(200);
const modeBtn = page.getByRole('button', { name: /color mode|toggle/i });
if (await modeBtn.count()) {
  // if page still looks dark, click
  const isDark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log('conv bg before', isDark);
}
// Demo may use MUI CssVarsProvider - click until light
for (let i = 0; i < 3; i++) {
  const darkish = await page.evaluate(() => {
    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return false;
    return (Number(m[1])+Number(m[2])+Number(m[3])) < 400;
  });
  if (!darkish) break;
  await page.getByRole('button', { name: /color mode/i }).click().catch(()=>{});
  await page.waitForTimeout(700);
}
const convInv = await contentInventory(true);
await page.screenshot({ path: join(out, 'conv-light-page.png'), fullPage: true });
const ex2 = page.locator('#examples');
if (await ex2.count()) await ex2.screenshot({ path: join(out, 'conv-light-examples.png') });

// clip individual spinner rows
await page.goto('http://localhost:4321/components/spinner', { waitUntil: 'networkidle' });
await forceLight();
await page.locator('#examples').screenshot({ path: join(out, 'ref-light-examples.png') });

const inventory = { refInv, convInv };
writeFileSync(join(out, 'inventory.json'), JSON.stringify(inventory, null, 2));
console.log(JSON.stringify(inventory, null, 2));
await browser.close();
