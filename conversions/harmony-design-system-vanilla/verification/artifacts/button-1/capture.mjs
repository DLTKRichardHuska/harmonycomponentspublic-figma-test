import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function measureButtons(page, label) {
  const data = await page.evaluate(() => {
    function walkShadow(root, visit) {
      visit(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walkShadow(el.shadowRoot, visit);
      });
    }
    const btns = [];
    walkShadow(document, (root) => {
      btns.push(...root.querySelectorAll('button, input[type=button], input[type=submit], a.btn, harmony-button'));
    });
    const byText = (txt) =>
      btns.find((b) => (b.textContent || b.value || '').replace(/\s+/g, ' ').trim().includes(txt));
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 48),
        tag: el.tagName.toLowerCase(),
        className: String(el.className?.baseVal ?? el.className ?? '').slice(0, 80),
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor,
        radius: cs.borderRadius,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: cs.padding,
        opacity: cs.opacity,
        disabled: !!el.disabled,
      };
    };
    const samples = ['Primary','Secondary','Tertiary','Outline','Ghost','Destructive','XSmall','Small','Medium','Large','Add Item','Continue','Download','Edit','Share','Default','Disabled','Loading','Processing','Saving','Full Width Primary','Full Width Outline','Up','Save Changes','Primary (unclassed)','Input button','Submit','Link with .btn'];
    const result = { samples: {} };
    for (const s of samples) result.samples[s] = styleOf(byText(s));
    const pageHeaderPrimaries = btns.filter((b) => String(b.className).includes('page-header') && (b.textContent || '').includes('Primary'));
    result.pageHeaderPrimary = styleOf(pageHeaderPrimaries[0]);
    const headings = [];
    walkShadow(document, (root) => {
      root.querySelectorAll('h1,h2,h3').forEach((h) => {
        headings.push(h.tagName + ':' + (h.textContent || '').trim().slice(0, 100));
      });
    });
    result.headings = headings;
    result.htmlTheme = [...document.documentElement.classList];
    result.stylesheetHrefs = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href);
    return result;
  });
  writeFileSync(join(outDir, label + '-metrics.json'), JSON.stringify(data, null, 2));
  return data;
}

async function setDemoProduct(page, product) {
  await page.evaluate((product) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.product = product;
      localStorage.setItem('harmony-demo-product', product);
    }
    document.documentElement.classList.remove('theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-' + product);
  }, product);
  await delay(700);
}

async function scrollMainToHeading(page, text) {
  return page.evaluate((text) => {
    const app = document.querySelector('demo-app');
    const main = app?.shadowRoot?.querySelector('main');
    const pageHost = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageHost?.shadowRoot;
    if (!root || !main) return false;
    const hs = [...root.querySelectorAll('h2,h3,h4')];
    const h = hs.find((el) => (el.textContent || '').trim().toLowerCase() === text.toLowerCase());
    if (!h) return false;
    const mainRect = main.getBoundingClientRect();
    const hRect = h.getBoundingClientRect();
    main.scrollTop += hRect.top - mainRect.top - 16;
    return true;
  }, text);
}

async function captureRef() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('http://localhost:4321/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    document.documentElement.classList.remove('dark', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-cp');
  });
  await delay(400);
  const metrics = await measureButtons(page, 'ref-cp-light');
  await page.screenshot({ path: join(outDir, 'ref-cp-light-full.png'), fullPage: true });
  for (const name of ['Button Types','Variants','Dela Buttons','Sizes','With Icons','Icon Only','States','Loading State','Full Width','Vertical Orientation','Button Combinations','Props','Usage Guidelines','Accessibility']) {
    const loc = page.getByRole('heading', { name, exact: true }).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await delay(150);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await page.screenshot({ path: join(outDir, 'ref-sec-' + slug + '.png'), fullPage: false });
    } else console.log('REF missing', name);
  }
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await delay(300);
  await page.getByRole('heading', { name: 'Variants', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(outDir, 'ref-cp-dark-variants.png'), fullPage: false });
  console.log('REF Primary', JSON.stringify(metrics.samples.Primary));
  console.log('REF PH', JSON.stringify(metrics.pageHeaderPrimary));
  console.log('REF sizes', JSON.stringify({ xs: metrics.samples.XSmall?.height, sm: metrics.samples.Small?.height, md: metrics.samples.Medium?.height, lg: metrics.samples.Large?.height, xsFs: metrics.samples.XSmall?.fontSize, lgFs: metrics.samples.Large?.fontSize }));
  await page.close();
  return metrics;
}

async function captureConv() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('http://localhost:5178/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
  await delay(500);
  await setDemoProduct(page, 'cp');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await delay(400);
  const metrics = await measureButtons(page, 'conv-cp-light');
  await page.screenshot({ path: join(outDir, 'conv-cp-light-top.png'), fullPage: false });
  for (const name of ['Native defaults','Button types','Variants','Dela buttons','Sizes','With icons','Icon only','States','Loading state','Full width','Vertical orientation','Hybrid helper (<harmony-button>)','Combinations','API','Accessibility']) {
    const ok = await scrollMainToHeading(page, name);
    console.log('CONV scroll', name, ok);
    await delay(200);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await page.screenshot({ path: join(outDir, 'conv-sec-' + slug + '.png'), fullPage: false });
  }
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await delay(300);
  await scrollMainToHeading(page, 'Variants');
  await delay(200);
  await page.screenshot({ path: join(outDir, 'conv-cp-dark-variants.png'), fullPage: false });
  const darkMetrics = await measureButtons(page, 'conv-cp-dark');
  console.log('CONV Primary', JSON.stringify(metrics.samples.Primary));
  console.log('CONV PH', JSON.stringify(metrics.pageHeaderPrimary));
  console.log('CONV theme', metrics.htmlTheme, metrics.stylesheetHrefs);
  console.log('CONV sizes', JSON.stringify({ xs: metrics.samples.XSmall?.height, sm: metrics.samples.Small?.height, md: metrics.samples.Medium?.height, lg: metrics.samples.Large?.height, xsFs: metrics.samples.XSmall?.fontSize, lgFs: metrics.samples.Large?.fontSize }));
  console.log('CONV dark Primary', JSON.stringify(darkMetrics.samples.Primary));
  await page.close();
  return metrics;
}

async function captureForcedColors() {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, forcedColors: 'active' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5178/components/buttons', { waitUntil: 'networkidle' });
  await delay(500);
  await page.evaluate(() => { const app = document.querySelector('demo-app'); if (app) app.product = 'cp'; });
  await delay(400);
  await page.screenshot({ path: join(outDir, 'conv-forced-colors-top.png'), fullPage: false });
  const hc = await page.evaluate(() => {
    const root = document.querySelector('demo-buttons-page')?.shadowRoot;
    const buttons = [...(root?.querySelectorAll('button') || [])];
    const primary = buttons.find((b) => (b.textContent || '').includes('Primary'));
    const disabled = buttons.find((b) => b.disabled);
    const loading = buttons.find((b) => b.classList.contains('btn--loading'));
    primary?.focus();
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: (el.textContent || '').trim().slice(0, 40), bg: cs.backgroundColor, color: cs.color, border: cs.borderTopColor, outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, opacity: cs.opacity };
    };
    return { primary: styleOf(primary), disabled: styleOf(disabled), loading: styleOf(loading) };
  });
  writeFileSync(join(outDir, 'conv-forced-colors-metrics.json'), JSON.stringify(hc, null, 2));
  await page.screenshot({ path: join(outDir, 'conv-forced-colors-focus.png'), fullPage: false });
  await scrollMainToHeading(page, 'States');
  await delay(200);
  await page.screenshot({ path: join(outDir, 'conv-forced-colors-states.png'), fullPage: false });
  await ctx.close();
  return hc;
}

const ref = await captureRef();
const conv = await captureConv();
const hc = await captureForcedColors();
writeFileSync(join(outDir, 'compare-notes.json'), JSON.stringify({ generatedAt: new Date().toISOString(), refPrimary: ref.samples.Primary, convPrimary: conv.samples.Primary, refPH: ref.pageHeaderPrimary, convPH: conv.pageHeaderPrimary, refSizes: { xs: ref.samples.XSmall, sm: ref.samples.Small, md: ref.samples.Medium, lg: ref.samples.Large }, convSizes: { xs: conv.samples.XSmall, sm: conv.samples.Small, md: conv.samples.Medium, lg: conv.samples.Large }, forcedColors: hc }, null, 2));
await browser.close();
console.log('ALL DONE');
