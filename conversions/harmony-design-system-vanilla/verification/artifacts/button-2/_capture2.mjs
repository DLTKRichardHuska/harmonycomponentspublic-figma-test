import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'conversions/harmony-design-system-vanilla/verification/artifacts/button-2';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5178/components/buttons', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

async function clipEl(page, name, finder) {
  const box = await page.evaluate((finderSrc) => {
    const finder = eval('(' + finderSrc + ')');
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const el = finder(root);
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.x - 4), y: Math.max(0, r.y - 4), width: Math.min(r.width + 8, 500), height: Math.min(r.height + 8, 100) };
  }, finder.toString());
  if (box && box.width > 0 && box.height > 0) {
    await page.waitForTimeout(100);
    // re-measure after scroll
    const box2 = await page.evaluate((finderSrc) => {
      const finder = eval('(' + finderSrc + ')');
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
      const root = pageEl?.shadowRoot;
      const el = finder(root);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, r.x - 4), y: Math.max(0, r.y - 4), width: Math.min(r.width + 8, 500), height: Math.min(r.height + 8, 100) };
    }, finder.toString());
    await page.screenshot({ path: join(OUT, name), clip: box2 });
    return box2;
  }
  return null;
}

const clips = {};
clips.unclassed = await clipEl(page, 'clip-unclassed.png', (root) => [...root.querySelectorAll('button')].find(b => !b.className || !String(b.className).includes('btn')));
clips.xs = await clipEl(page, 'clip-xs.png', (root) => root.querySelector('button.btn--xs'));
clips.hybridSave = await clipEl(page, 'clip-hybridSave.png', (root) => [...root.querySelectorAll('harmony-button')].find(h => (h.textContent||'').includes('Save') && !h.hasAttribute('loading')));
clips.download = await clipEl(page, 'clip-download.png', (root) => [...root.querySelectorAll('button')].find(b => /Download/.test(b.innerText||'')));
clips.fullWidth = await clipEl(page, 'clip-full.png', (root) => root.querySelector('button.btn--full, .btn--full') || [...root.querySelectorAll('button')].find(b => (b.className||'').includes('full')));

// full page scroll sections without sidebar by targeting main content bounding box
async function sectionShot(slug, headingRe) {
  const clip = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const h2 = [...root.querySelectorAll('h2')].find(h => re.test(h.textContent));
    if (!h2) return null;
    h2.scrollIntoView({ block: 'start' });
    return true;
  }, headingRe);
  await page.waitForTimeout(200);
  const box = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const hs = [...root.querySelectorAll('h2')];
    const h2 = hs.find(h => re.test(h.textContent));
    if (!h2) return null;
    const idx = hs.indexOf(h2);
    const next = hs[idx+1];
    const r1 = h2.getBoundingClientRect();
    const r2 = next ? next.getBoundingClientRect() : { top: r1.top + 420 };
    // content area roughly right of sidebar
    const host = pageEl.getBoundingClientRect();
    const x = Math.max(0, host.x);
    const y = Math.max(0, r1.top - 4);
    const width = Math.min(host.width, 900);
    const height = Math.min(Math.max(r2.top - r1.top - 8, 60), 700);
    return { x, y, width, height };
  }, headingRe);
  if (box) await page.screenshot({ path: join(OUT, `conv-sec-${slug}.png`), clip: box });
  return box;
}

await sectionShot('native-defaults', 'Native defaults');
await sectionShot('variants', '^Variants$');
await sectionShot('sizes', '^Sizes$');
await sectionShot('hybrid', 'Hybrid helper');
await sectionShot('full-width', 'Full width');
await sectionShot('loading', 'Loading');
await sectionShot('states', '^States$');
await sectionShot('icon-only', 'Icon only');
await sectionShot('button-types', 'Button types');

// reference usage + combinations + with icons
const pageR = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await pageR.goto('http://localhost:4321/components/buttons', { waitUntil: 'networkidle' });
await pageR.evaluate(() => { document.documentElement.classList.remove('dark'); document.documentElement.classList.add('theme-cp'); });
await pageR.waitForTimeout(300);

async function refSection(slug, headingRe) {
  await pageR.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const main = document.querySelector('main') || document.body;
    // reference uses h2 Examples then h3 subsections OR h2 sections
    const el = [...main.querySelectorAll('h2,h3')].find(h => re.test(h.textContent));
    el?.scrollIntoView({ block: 'start' });
  }, headingRe);
  await pageR.waitForTimeout(200);
  const box = await pageR.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const main = document.querySelector('main') || document.body;
    const hs = [...main.querySelectorAll('h2,h3')];
    const el = hs.find(h => re.test(h.textContent));
    if (!el) return null;
    const idx = hs.indexOf(el);
    const next = hs[idx+1];
    const r1 = el.getBoundingClientRect();
    const r2 = next ? next.getBoundingClientRect() : { top: r1.top + 500 };
    const content = main.getBoundingClientRect();
    return {
      x: Math.max(0, content.x),
      y: Math.max(0, r1.top - 4),
      width: Math.min(content.width, 900),
      height: Math.min(Math.max(r2.top - r1.top - 4, 80), 800),
    };
  }, headingRe);
  if (box) await pageR.screenshot({ path: join(OUT, `ref-sec-${slug}.png`), clip: box });
}

await refSection('with-icons', 'With Icons|With icons');
await refSection('combinations', 'Button Combinations|Combinations');
await refSection('usage', 'Usage Guidelines');
await refSection('sizes', '^Sizes$');
await refSection('loading', 'Loading');
await refSection('variants', '^Variants$');

// a11y focus ring
const focusInfo = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const root = app?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  const btn = root.querySelector('button.btn--primary') || root.querySelector('button');
  btn.focus();
  const s = getComputedStyle(btn);
  return { outline: s.outline, outlineOffset: s.outlineOffset, boxShadow: s.boxShadow, outlineWidth: s.outlineWidth, outlineStyle: s.outlineStyle, outlineColor: s.outlineColor };
});

// secondary/tertiary/outline/ghost/destructive colors
const variants = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const root = app?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  const pick = (cls) => {
    const el = [...root.querySelectorAll('button')].find(b => String(b.className).includes(cls) && !String(b.className).includes('icon') && !(b.innerText||'').match(/Cancel|Reject/));
    if (!el) return null;
    const s = getComputedStyle(el);
    return { text: (el.innerText||'').trim().slice(0,40), bg: s.backgroundColor, color: s.color, border: s.borderTopColor + ' ' + s.borderTopWidth, fw: s.fontWeight };
  };
  return {
    secondary: pick('btn--secondary'),
    tertiary: pick('btn--tertiary'),
    outline: pick('btn--outline'),
    ghost: pick('btn--ghost'),
    destructive: pick('btn--destructive'),
    pageHeader: (() => {
      const el = root.querySelector('button.btn--page-header.btn--primary, button.btn--page-header');
      if (!el) return null;
      const s = getComputedStyle(el);
      return { text: (el.innerText||'').trim(), bg: s.backgroundColor, color: s.color, fw: s.fontWeight };
    })(),
  };
});

writeFileSync(join(OUT, 'clips-and-variants.json'), JSON.stringify({ clips, focusInfo, variants }, null, 2));
console.log(JSON.stringify({ clips, focusInfo, variants }, null, 2));
await browser.close();
