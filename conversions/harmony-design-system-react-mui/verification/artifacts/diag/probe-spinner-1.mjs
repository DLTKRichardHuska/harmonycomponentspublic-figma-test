import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const out = 'conversions/harmony-design-system-react-mui/verification/artifacts/spinner-1';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

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
        w: Math.round(r.width),
        h: Math.round(r.height),
        borderTop: cs.borderTopColor,
        borderColor: cs.borderColor,
        borderWidth: cs.borderTopWidth,
        color: cs.color,
      };
      if (conv) {
        const track = el.querySelector('.MuiCircularProgress-track');
        const circle = el.querySelector('.MuiCircularProgress-circle');
        if (track) result.trackColor = getComputedStyle(track).color;
        if (circle) result.circleColor = getComputedStyle(circle).color;
        const svg = el.querySelector('svg');
        if (svg) {
          result.svgW = Math.round(svg.getBoundingClientRect().width);
        }
      }
      return result;
    });
  }, isConv);
}

async function goAndShot(url, prefix, isConv) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(out, prefix + '-page.png'), fullPage: true });
  const examples = page.locator('#examples');
  if (await examples.count()) {
    await examples.screenshot({ path: join(out, prefix + '-examples.png') });
  }
  const info = await probeSpinners(isConv);
  return info;
}

const light = {
  ref: await goAndShot('http://localhost:4321/components/spinner', 'ref', false),
  conv: await goAndShot('http://localhost:5176/components/spinner', 'conv', true),
};

async function ensureDark(isConv) {
  if (isConv) {
    const clicked = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')];
      const modeBtn = buttons.find((b) => {
        const t = (b.getAttribute('aria-label') || b.title || b.textContent || '').toLowerCase();
        return t.includes('dark') || t.includes('light') || t.includes('mode') || t.includes('theme mode');
      });
      if (modeBtn) { modeBtn.click(); return modeBtn.getAttribute('aria-label') || modeBtn.textContent; }
      // MUI IconButton with DarkMode/LightMode
      const svgParent = buttons.find((b) => b.querySelector('svg') && (b.getAttribute('aria-label')||'').match(/mode|theme|dark|light/i));
      if (svgParent) { svgParent.click(); return 'svg-parent'; }
      return null;
    });
    await page.waitForTimeout(900);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark') || document.body.dataset.muiColorScheme === 'dark' || !!document.querySelector('[data-mui-color-scheme=\"dark\"]'));
    if (!isDark) {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-mui-color-scheme', 'dark');
      });
      await page.waitForTimeout(400);
    }
    return { clicked, isDark };
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
  return { ok: true };
}

await page.goto('http://localhost:4321/components/spinner', { waitUntil: 'networkidle' });
const refDarkMeta = await ensureDark(false);
await page.screenshot({ path: join(out, 'ref-dark-page.png'), fullPage: true });
const examplesR = page.locator('#examples');
if (await examplesR.count()) await examplesR.screenshot({ path: join(out, 'ref-dark-examples.png') });
const refDark = await probeSpinners(false);

await page.goto('http://localhost:5176/components/spinner', { waitUntil: 'networkidle' });
const convDarkMeta = await ensureDark(true);
await page.screenshot({ path: join(out, 'conv-dark-page.png'), fullPage: true });
const examplesC = page.locator('#examples');
if (await examplesC.count()) await examplesC.screenshot({ path: join(out, 'conv-dark-examples.png') });
const convDark = await probeSpinners(true);

const probe = { light, dark: { ref: refDark, conv: convDark, refDarkMeta, convDarkMeta } };
writeFileSync(join(out, 'probe.json'), JSON.stringify(probe, null, 2));
console.log(JSON.stringify(probe, null, 2));
await browser.close();
