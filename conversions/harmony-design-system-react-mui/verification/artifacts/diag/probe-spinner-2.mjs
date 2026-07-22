import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const out = 'conversions/harmony-design-system-react-mui/verification/artifacts/spinner-2';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

async function ensureLight() {
  for (let i = 0; i < 4; i++) {
    const darkish = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? (Number(m[1]) + Number(m[2]) + Number(m[3])) < 400 : false;
    });
    if (!darkish) break;
    await page.getByRole('button', { name: /color mode/i }).click().catch(() => {});
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-mui-color-scheme', 'light');
    });
  }
}

async function ensureDark(isConv) {
  if (isConv) {
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      const modeBtn = buttons.find((b) => {
        const t = (b.getAttribute('aria-label') || b.title || b.textContent || '').toLowerCase();
        return t.includes('dark') || t.includes('light') || t.includes('mode') || t.includes('theme mode');
      });
      if (modeBtn) modeBtn.click();
    });
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-mui-color-scheme', 'dark');
    });
    await page.waitForTimeout(400);
    return;
  }
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const modeBtn = buttons.find((b) => {
      const t = (b.getAttribute('aria-label') || b.title || '').toLowerCase();
      return t.includes('dark') || t.includes('light') || t.includes('mode');
    });
    if (modeBtn) modeBtn.click();
    else document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(900);
}

async function contentInventory() {
  return page.evaluate(() => {
    const headings = [...document.querySelectorAll('h2, h3')].map((h) => h.textContent.trim()).filter(Boolean);
    const a11yTitles = [...document.querySelectorAll('.a11y-card__title, h3')].map((h) => h.textContent.replace(/\s+/g, ' ').trim());
    const nav = [...document.querySelectorAll('.article-nav a, nav a')].map((a) => a.textContent.trim()).filter((t) => /examples|props|access|mapping/i.test(t));
    const pageDesc =
      document.querySelector('.page-header__description')?.textContent?.trim() ||
      (() => {
        const article = document.querySelector('article');
        const h1 = article?.querySelector('h1');
        if (!h1) return null;
        const block = h1.closest('header, div, section') || h1.parentElement;
        const p = block?.querySelector('p, .MuiTypography-body1, .MuiTypography-body2');
        return p?.textContent?.trim() || null;
      })();
    const texts = {
      loading: document.body.textContent.includes('Loading...'),
      loadingContent: document.body.textContent.includes('Loading content...'),
      animationPrefs: document.body.textContent.includes('Animation Preferences'),
      reducedMotion: document.body.textContent.includes('prefers-reduced-motion') || document.body.textContent.includes('reduced motion'),
      expectedDesc: document.body.textContent.includes('Spinners indicate that content is loading or an action is being processed.'),
      oldDesc: document.body.textContent.includes('Loading spinner components for indicating progress.'),
    };
    return { headings, a11yTitles, nav, pageDesc, texts };
  });
}

async function probeSpinners(isConv) {
  return page.evaluate((conv) => {
    const els = conv
      ? [...document.querySelectorAll('.MuiCircularProgress-root')]
      : [...document.querySelectorAll('.spinner')];
    return els.slice(0, 6).map((el, i) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const result = {
        i,
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        borderTop: cs.borderTopColor,
        borderRight: cs.borderRightColor,
        borderWidth: cs.borderTopWidth,
        color: cs.color,
      };
      if (conv) {
        const track = el.querySelector('.MuiCircularProgress-track');
        const circle = el.querySelector('.MuiCircularProgress-circle');
        if (track) result.trackColor = getComputedStyle(track).color;
        if (circle) result.circleColor = getComputedStyle(circle).color;
      }
      return result;
    });
  }, isConv);
}

// Light inventory + shots
await page.goto('http://localhost:4321/components/spinner', { waitUntil: 'networkidle', timeout: 60000 });
await ensureLight();
const refInv = await contentInventory();
const refSizes = await probeSpinners(false);
await page.screenshot({ path: join(out, 'ref-light-page.png'), fullPage: true });
if (await page.locator('#examples').count()) await page.locator('#examples').screenshot({ path: join(out, 'ref-light-examples.png') });
if (await page.locator('#accessibility').count()) await page.locator('#accessibility').screenshot({ path: join(out, 'ref-light-a11y.png') });

await page.goto('http://localhost:5176/components/spinner', { waitUntil: 'networkidle', timeout: 60000 });
await ensureLight();
const convInv = await contentInventory();
const convSizes = await probeSpinners(true);
await page.screenshot({ path: join(out, 'conv-light-page.png'), fullPage: true });
if (await page.locator('#examples').count()) await page.locator('#examples').screenshot({ path: join(out, 'conv-light-examples.png') });
if (await page.locator('#accessibility').count()) await page.locator('#accessibility').screenshot({ path: join(out, 'conv-light-a11y.png') });

// Dark
await page.goto('http://localhost:4321/components/spinner', { waitUntil: 'networkidle', timeout: 60000 });
await ensureDark(false);
await page.screenshot({ path: join(out, 'ref-dark-page.png'), fullPage: true });
if (await page.locator('#examples').count()) await page.locator('#examples').screenshot({ path: join(out, 'ref-dark-examples.png') });
const refDarkSizes = await probeSpinners(false);

await page.goto('http://localhost:5176/components/spinner', { waitUntil: 'networkidle', timeout: 60000 });
await ensureDark(true);
await page.screenshot({ path: join(out, 'conv-dark-page.png'), fullPage: true });
if (await page.locator('#examples').count()) await page.locator('#examples').screenshot({ path: join(out, 'conv-dark-examples.png') });
const convDarkSizes = await probeSpinners(true);

const result = {
  inventory: { refInv, convInv },
  sizes: { light: { ref: refSizes, conv: convSizes }, dark: { ref: refDarkSizes, conv: convDarkSizes } },
};
writeFileSync(join(out, 'probe.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();

