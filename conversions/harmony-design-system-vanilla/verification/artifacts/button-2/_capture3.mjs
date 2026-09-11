import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'conversions/harmony-design-system-vanilla/verification/artifacts/button-2';
const browser = await chromium.launch({ headless: true });

async function getRoot(page) {
  return page.evaluateHandle(() => {
    const app = document.querySelector('demo-app');
    return app?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  });
}

async function setProductCP(page) {
  // Prefer Costpoint via demo header select
  await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const header = app?.shadowRoot?.querySelector('demo-header');
    const sel = header?.shadowRoot?.querySelector('select');
    if (sel) {
      const opt = [...sel.options].find(o => /costpoint|cp/i.test(o.text + o.value));
      if (opt) {
        sel.value = opt.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    document.documentElement.classList.add('theme-cp');
  });
  await page.waitForTimeout(400);
}

async function setDark(page, dark) {
  await page.evaluate((dark) => {
    const app = document.querySelector('demo-app');
    const header = app?.shadowRoot?.querySelector('demo-header');
    // try explicit API
    if (app) {
      if ('dark' in app) app.dark = dark;
      if ('mode' in app) app.mode = dark ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', dark);
    const btn = [...(header?.shadowRoot?.querySelectorAll('button') || [])].find(b => /mode|dark|light|sun|moon/i.test((b.textContent||'')+(b.getAttribute('aria-label')||'')));
    if (btn) {
      const isDark = document.documentElement.classList.contains('dark') || app?.classList?.contains?.('dark');
      if (dark !== isDark) btn.click();
    }
  }, dark);
  await page.waitForTimeout(500);
  // force class if still wrong
  await page.evaluate((dark) => {
    document.documentElement.classList.toggle('dark', dark);
    const app = document.querySelector('demo-app');
    app?.classList?.toggle?.('dark', dark);
    // pierce and set on host attributes often used
    if (app) {
      if (dark) app.setAttribute('dark', '');
      else app.removeAttribute('dark');
    }
  }, dark);
  await page.waitForTimeout(300);
}

async function measureButtons(page) {
  return page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const root = app?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
    const htmlDark = document.documentElement.classList.contains('dark');
    const appDark = app?.classList?.contains('dark') || app?.hasAttribute('dark');
    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        text: (el.innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
        className: String(el.className||''),
        bg: s.backgroundColor,
        color: s.color,
        fw: s.fontWeight,
        border: s.borderTopColor,
      };
    };
    const unclassed = [...root.querySelectorAll('button')].find(b => !b.className || !String(b.className).includes('btn'));
    const primary = root.querySelector('button.btn--primary');
    const secondary = [...root.querySelectorAll('button')].find(b => String(b.className).includes('btn--secondary') && /Secondary/.test(b.innerText||''));
    const xs = root.querySelector('button.btn--xs');
    const pageHeader = root.querySelector('button.btn--page-header.btn--primary, button.btn--page-header');
    return { htmlDark, appDark, unclassed: styleOf(unclassed), primary: styleOf(primary), secondary: styleOf(secondary), xs: styleOf(xs), pageHeader: styleOf(pageHeader) };
  });
}

async function shotSection(page, name, re) {
  await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const root = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
    const h = [...root.querySelectorAll('h2')].find(x => re.test(x.textContent));
    h?.scrollIntoView({ block: 'start' });
  }, re);
  await page.waitForTimeout(200);
  const box = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const pageEl = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const hs = [...root.querySelectorAll('h2')];
    const h = hs.find(x => re.test(x.textContent));
    if (!h) return null;
    const idx = hs.indexOf(h);
    const next = hs[idx+1];
    const r1 = h.getBoundingClientRect();
    const r2 = next ? next.getBoundingClientRect() : { top: r1.top + 360 };
    const host = pageEl.getBoundingClientRect();
    return { x: Math.max(0, host.x), y: Math.max(0, r1.top - 4), width: Math.min(host.width, 920), height: Math.min(Math.max(r2.top - r1.top - 4, 80), 520) };
  }, re);
  if (box) await page.screenshot({ path: join(OUT, name), clip: box });
}

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5178/components/buttons', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await setProductCP(page);

// LIGHT metrics already known — capture dark
await setDark(page, true);
const darkMetrics = await measureButtons(page);
await page.screenshot({ path: join(OUT, 'conv-cp-dark-viewport.png'), fullPage: false });
await shotSection(page, 'conv-cp-dark-native.png', 'Native defaults');
await shotSection(page, 'conv-cp-dark-variants.png', '^Variants$');
await shotSection(page, 'conv-cp-dark-sizes.png', '^Sizes$');

// FORCED COLORS on light first reset dark
await setDark(page, false);
await page.emulateMedia({ forcedColors: 'active', colorScheme: 'light' });
await page.waitForTimeout(400);
const hcMetrics = await page.evaluate(() => {
  const root = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  const btn = root.querySelector('button.btn--primary') || root.querySelector('button');
  const disabled = root.querySelector('button[disabled]');
  const styleOf = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return { text: (el.innerText||'').trim().slice(0,30), bg: s.backgroundColor, color: s.color, border: s.border, outline: s.outline, opacity: s.opacity };
  };
  btn?.focus();
  const focused = styleOf(btn);
  return { primary: styleOf(btn), disabled: styleOf(disabled), focused };
});
await shotSection(page, 'conv-hc-variants.png', '^Variants$');
await shotSection(page, 'conv-hc-states.png', '^States$');
await shotSection(page, 'conv-hc-native.png', 'Native defaults');
await page.screenshot({ path: join(OUT, 'conv-hc-viewport.png'), fullPage: false });

// focus-visible check without HC
await page.emulateMedia({ forcedColors: 'none', colorScheme: 'light' });
await page.waitForTimeout(200);
const focusRing = await page.evaluate(() => {
  const root = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  const btn = root.querySelector('button.btn--primary') || [...root.querySelectorAll('button')].find(b => /Primary/.test(b.innerText||''));
  btn.focus();
  // synthesize focus-visible if possible
  btn.dispatchEvent(new Event('focus', { bubbles: true }));
  const s = getComputedStyle(btn);
  const before = getComputedStyle(btn, '::before');
  const after = getComputedStyle(btn, '::after');
  return {
    outline: s.outline,
    outlineOffset: s.outlineOffset,
    boxShadow: s.boxShadow,
    border: s.border,
    beforeContent: before.content,
    afterContent: after.content,
    afterOutline: after.outline,
    afterBoxShadow: after.boxShadow,
  };
});

// stable badge
const badge = await page.evaluate(() => {
  const root = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-buttons-page')?.shadowRoot;
  const h1 = root.querySelector('h1')?.textContent;
  const near = root.querySelector('h1')?.parentElement?.innerText?.slice(0, 200);
  return { h1, near, hasStable: /stable/i.test(near||'') };
});

// ref focus for compare
const pageR = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await pageR.goto('http://localhost:4321/components/buttons', { waitUntil: 'networkidle' });
await pageR.evaluate(() => { document.documentElement.classList.add('theme-cp'); document.documentElement.classList.remove('dark'); });
const refFocus = await pageR.evaluate(() => {
  const btn = document.querySelector('main button.btn--primary');
  btn?.focus();
  const s = getComputedStyle(btn);
  return { outline: s.outline, boxShadow: s.boxShadow, outlineOffset: s.outlineOffset };
});
await pageR.evaluate(() => document.documentElement.classList.add('dark'));
await pageR.waitForTimeout(300);
const refDark = await pageR.evaluate(() => {
  const btn = document.querySelector('main button.btn--primary:not(.btn--page-header)');
  const s = getComputedStyle(btn);
  return { bg: s.backgroundColor, color: s.color, fw: s.fontWeight, text: btn.innerText.trim() };
});

writeFileSync(join(OUT, 'dark-hc-focus.json'), JSON.stringify({ darkMetrics, hcMetrics, focusRing, badge, refFocus, refDark }, null, 2));
console.log(JSON.stringify({ darkMetrics, hcMetrics, focusRing, badge, refFocus, refDark }, null, 2));
await browser.close();
