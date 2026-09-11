import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = 'C:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/icon-2';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

async function waitConv() {
  await page.waitForFunction(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-icons-page');
    return (pageEl?.shadowRoot?.querySelectorAll('harmony-icon') ?? []).length > 20;
  }, { timeout: 30000 });
}

await page.goto('http://localhost:4321/components/icons', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-vp');
});
await page.waitForTimeout(300);
await page.screenshot({ path: join(out, 'ref-vp-light-top.png') });
const refInfo = await page.evaluate(() => ({
  ok: document.readyState,
  h2: [...document.querySelectorAll('h2')].map((el) => el.textContent.trim()),
  a11y: [...document.querySelectorAll('h2')].some((h) => /Accessibility/i.test(h.textContent)),
  sizes: [...document.querySelectorAll('svg')].filter((s) => s.getAttribute('data-icon') === 'home').slice(0, 5).map((svg) => {
    const r = svg.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  }),
}));

await page.goto('http://localhost:5178/components/icons', { waitUntil: 'networkidle', timeout: 60000 });
await waitConv();
await page.waitForTimeout(400);
await page.screenshot({ path: join(out, 'conv-vp-light-top.png') });

const convInfo = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const header = app.shadowRoot.querySelector('demo-header');
  const nav = app.shadowRoot.querySelector('demo-nav');
  const sr = app.shadowRoot.querySelector('demo-icons-page').shadowRoot;
  const h2 = [...sr.querySelectorAll('h2')].map((el) => el.textContent.trim());
  const tableRows = [...sr.querySelectorAll('table tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent.trim()));
  const sizeCaptions = [...sr.querySelectorAll('.size span')].map((s) => s.textContent.trim());
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'].map((size) => {
    const el = sr.querySelector('harmony-icon[name="home"][size="' + size + '"]');
    const r = el.getBoundingClientRect();
    return { size, w: Math.round(r.width), h: Math.round(r.height), aria: el.getAttribute('aria-hidden') };
  });
  const snippets = [...sr.querySelectorAll('demo-import-snippet')].map((el) => el.shadowRoot?.textContent);
  const a11yButtons = [...sr.querySelectorAll('button.a11y-example')].map((btn) => ({
    label: btn.getAttribute('aria-label'),
    iconHidden: btn.querySelector('harmony-icon')?.getAttribute('aria-hidden'),
    iconName: btn.querySelector('harmony-icon')?.getAttribute('name'),
  }));
  const labeledStandalone = sr.querySelector('harmony-icon[name="information-circle"][label]');
  const labeled = sr.querySelector('harmony-icon[label="Registered diamond"]');
  const missing = [...sr.querySelectorAll('harmony-icon')].find((el) => el.getAttribute('name') === 'not-a-real-icon');
  const grids = [...sr.querySelectorAll('.grid')];
  const heroUnknown = [...grids[0].querySelectorAll('harmony-icon')].filter((el) => el.shadowRoot.querySelector('[part="fallback"]')).length;
  const customUnknown = [...grids[1].querySelectorAll('harmony-icon')].filter((el) => el.shadowRoot.querySelector('[part="fallback"]')).length;
  const accent = sr.querySelector('harmony-icon.accent');
  const navOk = [...nav.shadowRoot.querySelectorAll('harmony-icon')].slice(0, 5).every((el) => el.shadowRoot.querySelector('svg'));
  return {
    h2,
    tableRows,
    sizeCaptions,
    sizes,
    snippets,
    a11yButtons,
    labeledStandalone: labeledStandalone ? { role: labeledStandalone.getAttribute('role'), ariaLabel: labeledStandalone.getAttribute('aria-label'), hidden: labeledStandalone.getAttribute('aria-hidden') } : null,
    labeledDiamond: labeled ? { role: labeled.getAttribute('role'), ariaLabel: labeled.getAttribute('aria-label') } : null,
    missing: missing ? { fallback: missing.shadowRoot.querySelector('[part="fallback"]')?.textContent, aria: missing.getAttribute('aria-hidden') } : null,
    heroCount: grids[0].querySelectorAll('harmony-icon').length,
    customCount: grids[1].querySelectorAll('harmony-icon').length,
    heroUnknown,
    customUnknown,
    accentColor: accent ? getComputedStyle(accent).color : null,
    navOk,
    headerHasSun: Boolean(header.shadowRoot.querySelector('harmony-icon[name="sun"], harmony-icon[name="moon"]')),
    errorOverlay: Boolean(document.querySelector('vite-error-overlay')),
    hasVariantRow: tableRows.some((r) => r.join(' ').toLowerCase().includes('variant')),
    staticHasBackslash: (snippets[1] || '').includes('\\/script') || (snippets[1] || '').includes('<\\/script>'),
    staticHasClose: (snippets[1] || '').includes('</script>'),
  };
});

await page.evaluate(() => {
  const sr = document.querySelector('demo-app').shadowRoot.querySelector('demo-icons-page').shadowRoot;
  [...sr.querySelectorAll('h2')].find((h) => /Accessibility/i.test(h.textContent))?.scrollIntoView();
});
await page.waitForTimeout(200);
await page.screenshot({ path: join(out, 'conv-vp-light-a11y.png') });

await page.evaluate(() => {
  document.querySelector('demo-app').shadowRoot.querySelector('demo-header').shadowRoot.querySelector('#mode-toggle').click();
});
await page.waitForTimeout(350);
const darkInfo = await page.evaluate(() => ({ htmlDark: document.documentElement.classList.contains('dark') }));
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: join(out, 'conv-vp-dark-top.png') });

await page.emulateMedia({ forcedColors: 'active' });
await page.waitForTimeout(350);
const hcInfo = await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  const btn = app.shadowRoot.querySelector('demo-header').shadowRoot.querySelector('#mode-toggle');
  btn.focus();
  const pageIcon = app.shadowRoot.querySelector('demo-icons-page').shadowRoot.querySelector('harmony-icon[name="home"]');
  const missing = [...app.shadowRoot.querySelector('demo-icons-page').shadowRoot.querySelectorAll('harmony-icon')].find((el) => el.getAttribute('name') === 'not-a-real-icon');
  const fb = missing?.shadowRoot.querySelector('[part="fallback"]');
  const a11yBtn = app.shadowRoot.querySelector('demo-icons-page').shadowRoot.querySelector('button.a11y-example');
  a11yBtn?.focus();
  return {
    matches: matchMedia('(forced-colors: active)').matches,
    pageIconColor: pageIcon ? getComputedStyle(pageIcon).color : null,
    modeOutline: getComputedStyle(btn).outline,
    a11yOutline: a11yBtn ? getComputedStyle(a11yBtn).outline : null,
    fb: fb ? { text: fb.textContent, color: getComputedStyle(fb).color, bg: getComputedStyle(fb).backgroundColor } : null,
  };
});
await page.screenshot({ path: join(out, 'conv-forced-colors.png') });

writeFileSync(join(out, 'compare-notes.json'), JSON.stringify({ refInfo, convInfo, darkInfo, hcInfo }, null, 2));
console.log(JSON.stringify({ refInfo, convInfo, darkInfo, hcInfo }, null, 2));
await browser.close();
