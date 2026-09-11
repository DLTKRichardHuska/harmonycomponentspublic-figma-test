import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = 'C:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/icon-1';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function waitConv(p) {
  await p.waitForFunction(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-icons-page');
    const icons = pageEl?.shadowRoot?.querySelectorAll('harmony-icon') ?? [];
    return icons.length > 20;
  }, { timeout: 30000 });
}

await page.goto('http://localhost:4321/components/icons', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-vp');
});
await page.waitForTimeout(400);
await page.screenshot({ path: join(out, 'ref-vp-light-top.png'), fullPage: false });

const refInfo = await page.evaluate(() => {
  const h1 = document.querySelector('h1')?.textContent?.trim();
  const h2 = [...document.querySelectorAll('h2')].map((el) => el.textContent.trim());
  const homeIcons = [...document.querySelectorAll('svg')].filter((s) => s.getAttribute('data-icon') === 'home').map((svg) => {
    const r = svg.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  const pinCell = document.querySelector('[title="pin"]');
  return {
    h1,
    h2,
    homeIcons,
    a11y: h2.some((h) => /Accessibility/i.test(h)),
    tabler: document.body.innerText.includes('Tabler'),
    heroCountText: document.body.innerText.match(/All (\d+) outline icons/)?.[1],
    customCountText: document.body.innerText.match(/(\d+) domain-specific icons/)?.[1],
    pinHasSvg: Boolean(pinCell?.querySelector('svg')),
    pinFallback: pinCell?.querySelector('span')?.textContent?.trim() || null,
    title: document.title,
    gantt: Boolean(document.querySelector('svg[data-icon="gantt-chart"]')),
    risk: Boolean(document.querySelector('svg[data-icon="Risk Shield"]')),
    sizeLabels: [...document.querySelectorAll('span')].filter((s) => /xs \(12px\)|xl \(32px\)/).map((s) => s.textContent.trim()),
  };
});

await page.locator('h2', { hasText: 'Custom Icons' }).scrollIntoViewIfNeeded();
await page.screenshot({ path: join(out, 'ref-vp-light-custom.png'), fullPage: false });
await page.locator('h2', { hasText: 'Accessibility' }).scrollIntoViewIfNeeded();
await page.screenshot({ path: join(out, 'ref-vp-light-a11y.png'), fullPage: false });
await page.evaluate(() => document.documentElement.classList.add('dark'));
await page.waitForTimeout(300);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: join(out, 'ref-vp-dark-top.png'), fullPage: false });

await page.goto('http://localhost:5178/components/icons', { waitUntil: 'networkidle', timeout: 60000 });
await waitConv(page);
await page.waitForTimeout(500);
await page.screenshot({ path: join(out, 'conv-vp-light-top.png'), fullPage: false });

const convInfo = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const header = app.shadowRoot.querySelector('demo-header');
  const nav = app.shadowRoot.querySelector('demo-nav');
  const iconsPage = app.shadowRoot.querySelector('demo-icons-page');
  const sr = iconsPage.shadowRoot;
  const text = sr.textContent;
  const h1 = sr.querySelector('h1')?.textContent?.trim();
  const h2 = [...sr.querySelectorAll('h2')].map((el) => el.textContent.trim());
  const h3 = [...sr.querySelectorAll('h3')].map((el) => el.textContent.trim());
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'].map((size) => {
    const el = sr.querySelector('harmony-icon[name="home"][size="' + size + '"]');
    const r = el.getBoundingClientRect();
    return { size, w: Math.round(r.width), h: Math.round(r.height), aria: el.getAttribute('aria-hidden'), role: el.getAttribute('role') };
  });
  const labeled = sr.querySelector('harmony-icon[label]');
  const missing = [...sr.querySelectorAll('harmony-icon')].find((el) => el.getAttribute('name') === 'not-a-real-icon');
  const fallback = missing?.shadowRoot?.querySelector('[part="fallback"]');
  const grids = [...sr.querySelectorAll('.grid')];
  const heroCount = grids[0]?.querySelectorAll('harmony-icon').length;
  const customCount = grids[1]?.querySelectorAll('harmony-icon').length;
  const customNames = [...(grids[1]?.querySelectorAll('.icon-name') ?? [])].map((n) => n.textContent);
  const pinCell = [...sr.querySelectorAll('.icon-cell')].find((c) => c.getAttribute('title') === 'pin');
  const pinIcon = pinCell?.querySelector('harmony-icon');
  const gantt = [...sr.querySelectorAll('harmony-icon')].find((el) => el.getAttribute('name') === 'gantt-chart');
  const navIcons = [...nav.shadowRoot.querySelectorAll('harmony-icon')].slice(0, 8).map((el) => ({
    name: el.getAttribute('name'),
    hasSvg: Boolean(el.shadowRoot.querySelector('svg')),
    fallback: el.shadowRoot.querySelector('[part="fallback"]')?.textContent || null,
  }));
  const headerIcons = [...header.shadowRoot.querySelectorAll('harmony-icon')].map((el) => ({
    name: el.getAttribute('name'),
    hasSvg: Boolean(el.shadowRoot.querySelector('svg')),
  }));
  const snippets = [...sr.querySelectorAll('demo-import-snippet')].map((el) => el.shadowRoot?.textContent);
  const accent = sr.querySelector('harmony-icon.accent');
  const productSelect = header.shadowRoot.querySelector('#product-select');
  const unknownCount = [...grids[0].querySelectorAll('harmony-icon')].filter((el) => el.shadowRoot.querySelector('[part="fallback"]')).length;
  const customUnknown = [...grids[1].querySelectorAll('harmony-icon')].filter((el) => el.shadowRoot.querySelector('[part="fallback"]')).length;
  return {
    h1, h2, h3,
    textHasA11y: /Accessibility/i.test(text),
    textHasTabler: /Tabler/i.test(text),
    sizes,
    labeled: labeled ? { label: labeled.getAttribute('label'), role: labeled.getAttribute('role'), ariaHidden: labeled.getAttribute('aria-hidden'), ariaLabel: labeled.getAttribute('aria-label') } : null,
    missing: missing ? { ariaHidden: missing.getAttribute('aria-hidden'), fallback: fallback?.textContent, title: fallback?.getAttribute('title') } : null,
    heroCount, customCount,
    pinFallback: pinIcon?.shadowRoot?.querySelector('[part="fallback"]')?.textContent || null,
    pinHasSvg: Boolean(pinIcon?.shadowRoot?.querySelector('[part="svg"]')),
    ganttHasSvg: Boolean(gantt?.shadowRoot.querySelector('svg')),
    navIcons, headerIcons, snippets,
    accentColor: accent ? getComputedStyle(accent).color : null,
    product: productSelect?.value,
    dataProduct: document.documentElement.getAttribute('data-product'),
    customSample: customNames.slice(0, 12),
    customHasPin: customNames.includes('pin'),
    customHasFavicon: customNames.includes('favicon'),
    heroUnknownCount: unknownCount,
    customUnknownCount: customUnknown,
    errorOverlay: document.querySelector('vite-error-overlay') ? document.querySelector('vite-error-overlay').shadowRoot?.textContent?.slice(0, 200) : null,
  };
});

await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const p = app.shadowRoot.querySelector('demo-icons-page');
  [...p.shadowRoot.querySelectorAll('h2')].find((h) => /Usage/i.test(h.textContent))?.scrollIntoView();
});
await page.waitForTimeout(200);
await page.screenshot({ path: join(out, 'conv-vp-light-usage.png'), fullPage: false });

await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const p = app.shadowRoot.querySelector('demo-icons-page');
  [...p.shadowRoot.querySelectorAll('h2')].find((h) => /custom/i.test(h.textContent))?.scrollIntoView();
});
await page.waitForTimeout(200);
await page.screenshot({ path: join(out, 'conv-vp-light-custom.png'), fullPage: false });

await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const btn = app.shadowRoot.querySelector('demo-header').shadowRoot.querySelector('#mode-toggle');
  btn.click();
});
await page.waitForTimeout(400);
const darkInfo = await page.evaluate(() => ({ htmlDark: document.documentElement.classList.contains('dark') }));
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: join(out, 'conv-vp-dark-top.png'), fullPage: false });

await page.emulateMedia({ forcedColors: 'active' });
await page.waitForTimeout(400);
const hcInfo = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const header = app.shadowRoot.querySelector('demo-header');
  const btn = header.shadowRoot.querySelector('#mode-toggle');
  const icon = header.shadowRoot.querySelector('harmony-icon');
  const svg = icon?.shadowRoot?.querySelector('svg');
  btn.focus();
  const missing = [...app.shadowRoot.querySelector('demo-icons-page').shadowRoot.querySelectorAll('harmony-icon')].find((el) => el.getAttribute('name') === 'not-a-real-icon');
  const fb = missing?.shadowRoot?.querySelector('[part="fallback"]');
  const pageIcon = app.shadowRoot.querySelector('demo-icons-page').shadowRoot.querySelector('harmony-icon[name="home"]');
  return {
    iconColor: icon ? getComputedStyle(icon).color : null,
    svgColor: svg ? getComputedStyle(svg).color : null,
    outline: getComputedStyle(btn).outline,
    pageIconColor: pageIcon ? getComputedStyle(pageIcon).color : null,
    fbStyle: fb ? { color: getComputedStyle(fb).color, bg: getComputedStyle(fb).backgroundColor, border: getComputedStyle(fb).border, text: fb.textContent } : null,
    matches: matchMedia('(forced-colors: active)').matches,
  };
});
await page.screenshot({ path: join(out, 'conv-forced-colors.png'), fullPage: false });

writeFileSync(join(out, 'compare-notes.json'), JSON.stringify({ refInfo, convInfo, darkInfo, hcInfo }, null, 2));
console.log(JSON.stringify({ refInfo, convInfo, darkInfo, hcInfo, out }, null, 2));
await browser.close();


