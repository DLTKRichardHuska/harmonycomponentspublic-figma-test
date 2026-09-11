import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'conversions/harmony-design-system-vanilla/verification/artifacts/button-2';
mkdirSync(OUT, { recursive: true });

function cs(el) {
  if (!el) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    tag: el.tagName.toLowerCase(),
    className: el.className?.baseVal ?? el.className ?? '',
    text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    bg: s.backgroundColor,
    color: s.color,
    border: s.border,
    radius: s.borderRadius,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
    height: Math.round(r.height),
    width: Math.round(r.width),
    padding: s.padding,
    opacity: s.opacity,
    disabled: !!el.disabled,
  };
}

async function pierceButtonsPage(page) {
  return page.evaluateHandle(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page')
      || document.querySelector('demo-buttons-page');
    return pageEl?.shadowRoot || pageEl || document.body;
  });
}

async function collectConverted(page) {
  return page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page')
      || document.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot || pageEl;
    if (!root) return { error: 'no demo-buttons-page' };

    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : String(el.className || ''),
        text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
        bg: s.backgroundColor,
        color: s.color,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: s.padding,
        disabled: !!el.disabled,
      };
    };

    const h1 = root.querySelector('h1')?.textContent?.trim();
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent.trim());
    const h3s = [...root.querySelectorAll('h3')].map((h) => h.textContent.trim());
    const bodyText = root.textContent || '';

    // Native defaults first unclassed button
    const nativeSection = [...root.querySelectorAll('h2')].find((h) => /native defaults/i.test(h.textContent));
    let unclassed = null;
    if (nativeSection) {
      let n = nativeSection.nextElementSibling;
      while (n && n.tagName !== 'H2') {
        const btn = n.querySelector?.('button:not([class]), button[class=""]') || [...(n.querySelectorAll?.('button') || [])].find((b) => !b.className || b.className === '');
        if (btn) { unclassed = styleOf(btn); break; }
        // also try first button in section
        n = n.nextElementSibling;
      }
    }
    // fallback: first button without btn-- classes except empty
    if (!unclassed) {
      const btns = [...root.querySelectorAll('button')];
      const u = btns.find((b) => !b.className || !String(b.className).includes('btn'));
      unclassed = styleOf(u);
    }

    const byText = (text, sel = 'button') => {
      const els = [...root.querySelectorAll(sel)];
      return styleOf(els.find((e) => (e.innerText || e.textContent || '').replace(/\s+/g, ' ').includes(text)));
    };

    // sizes
    const sizes = {};
    for (const label of ['XSmall', 'Small', 'Medium', 'Large', 'xs', 'sm', 'md', 'lg']) {
      const el = [...root.querySelectorAll('button')].find((b) => {
        const t = (b.innerText || '').trim();
        return t === label || t.toLowerCase() === label.toLowerCase();
      });
      if (el) sizes[label] = styleOf(el);
    }
    // also by class
    for (const sz of ['xs', 'sm', 'md', 'lg']) {
      const el = root.querySelector(`button.btn--${sz}, button.btn.btn--${sz}`);
      if (el) sizes[`class-${sz}`] = styleOf(el);
    }

    const primaryClassed = styleOf(root.querySelector('button.btn--primary') || root.querySelector('.btn--primary'));
    const pageHeader = styleOf(root.querySelector('button.btn--page-header.btn--primary, button.btn--page-header'));
    const secondary = styleOf([...root.querySelectorAll('button')].find((b) => b.className.includes('btn--secondary') && !b.className.includes('icon')));
    const download = byText('Download');
    const confirm = byText('Confirm');
    const reject = byText('Reject');

    // hybrid CEs
    const hybrids = [...root.querySelectorAll('harmony-button')].map((hb) => {
      const s = styleOf(hb);
      const innerBtn = hb.querySelector('button') || hb;
      return {
        attrs: {
          variant: hb.getAttribute('variant'),
          icon: hb.getAttribute('icon'),
          loading: hb.hasAttribute('loading'),
          'loading-text': hb.getAttribute('loading-text'),
        },
        textContent: (hb.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        lightDomChildren: [...hb.childNodes].map((c) => ({
          nodeType: c.nodeType,
          text: c.nodeType === 3 ? c.textContent.trim() : c.nodeName,
        })).filter((x) => x.text),
        style: s,
        classes: typeof hb.className === 'string' ? hb.className : '',
        width: s?.width,
      };
    });

    const hasDownload = /Download/.test(bodyText);
    const hasConfirm = /Confirm/.test(bodyText);
    const hasReject = /Reject/.test(bodyText);
    const hasUsage = h2s.some((h) => /usage/i.test(h));
    const hasStableBadge = !!root.querySelector('.badge, [class*="stable"]') || /stable/i.test(bodyText);

    // section clips via headings
    const sections = h2s;

    // focus check on first primary
    const focusTarget = root.querySelector('button.btn--primary') || root.querySelector('button');
    let focusOutline = null;
    if (focusTarget) {
      focusTarget.focus();
      const fs = getComputedStyle(focusTarget);
      focusOutline = { outline: fs.outline, outlineOffset: fs.outlineOffset, boxShadow: fs.boxShadow };
    }

    return {
      h1, h2s, h3s,
      hasDownload, hasConfirm, hasReject, hasUsage, hasStableBadge,
      unclassed, primaryClassed, pageHeader, secondary, download, confirm, reject, sizes,
      hybrids,
      focusOutline,
      buttonCount: root.querySelectorAll('button').length,
      harmonyButtonCount: root.querySelectorAll('harmony-button').length,
      aBtnCount: root.querySelectorAll('a.btn').length,
    };
  });
}

async function collectReference(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        className: el.className,
        text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 100),
        bg: s.backgroundColor,
        color: s.color,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: s.padding,
      };
    };
    const h1 = main.querySelector('h1')?.textContent?.trim();
    const h2s = [...main.querySelectorAll('h2')].map((h) => h.textContent.trim());
    const h3s = [...main.querySelectorAll('h3')].map((h) => h.textContent.trim());
    const primary = styleOf([...main.querySelectorAll('button.btn--primary, button.btn.btn--primary')].find((b) => /Primary/i.test(b.innerText) && !b.className.includes('page-header')));
    const pageHeader = styleOf(main.querySelector('button.btn--page-header'));
    const sizes = {};
    for (const sz of ['xs', 'sm', 'md', 'lg']) {
      const el = main.querySelector(`button.btn--${sz}`);
      if (el) sizes[sz] = styleOf(el);
    }
    const download = styleOf([...main.querySelectorAll('button')].find((b) => /Download/.test(b.innerText || '')));
    const confirm = styleOf([...main.querySelectorAll('button')].find((b) => /Confirm/.test(b.innerText || '')));
    const reject = styleOf([...main.querySelectorAll('button, a')].find((b) => /Reject/.test(b.innerText || '')));
    const hasUsage = h2s.some((h) => /usage/i.test(h));
    const hasStable = !!main.querySelector('[class*="badge"]') || /stable/i.test(main.textContent || '');
    return { h1, h2s, h3s, primary, pageHeader, sizes, download, confirm, reject, hasUsage, hasStable };
  });
}

async function screenshotSections(page, side, isConverted) {
  const headings = await page.evaluate((converted) => {
    let root = document;
    if (converted) {
      const app = document.querySelector('demo-app');
      const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page') || document.querySelector('demo-buttons-page');
      root = pageEl?.shadowRoot || pageEl || document;
    }
    const main = converted ? root : (document.querySelector('main') || document.body);
    return [...main.querySelectorAll('h2')].map((h, i) => ({
      i,
      text: h.textContent.trim(),
      top: h.getBoundingClientRect().top + window.scrollY,
    }));
  }, isConverted);

  for (const h of headings) {
    const slug = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    await page.evaluate(({ converted, text }) => {
      let root = document;
      if (converted) {
        const app = document.querySelector('demo-app');
        const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page') || document.querySelector('demo-buttons-page');
        root = pageEl?.shadowRoot || pageEl || document;
      }
      const main = converted ? root : (document.querySelector('main') || document.body);
      const el = [...main.querySelectorAll('h2')].find((x) => x.textContent.trim() === text);
      el?.scrollIntoView({ block: 'start' });
    }, { converted: isConverted, text: h.text });
    await page.waitForTimeout(200);
    // clip section: from this h2 to next
    const clip = await page.evaluate(({ converted, text }) => {
      let root = document;
      if (converted) {
        const app = document.querySelector('demo-app');
        const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page') || document.querySelector('demo-buttons-page');
        root = pageEl?.shadowRoot || pageEl || document;
      }
      const main = converted ? root : (document.querySelector('main') || document.body);
      const hs = [...main.querySelectorAll('h2')];
      const el = hs.find((x) => x.textContent.trim() === text);
      if (!el) return null;
      const idx = hs.indexOf(el);
      const next = hs[idx + 1];
      const top = el.getBoundingClientRect().top + window.scrollY;
      const bottom = next
        ? next.getBoundingClientRect().top + window.scrollY
        : top + 500;
      const height = Math.min(Math.max(bottom - top + 16, 80), 900);
      return {
        x: 0,
        y: Math.max(0, top - 8),
        width: Math.min(document.documentElement.clientWidth, 1200),
        height,
      };
    }, { converted: isConverted, text: h.text });
    if (clip && clip.height > 0) {
      await page.screenshot({
        path: join(OUT, `${side}-sec-${slug}.png`),
        clip: {
          x: clip.x,
          y: clip.y,
          width: clip.width,
          height: clip.height,
        },
      });
    }
  }
  return headings;
}

async function setConvTheme(page, { product = 'cp', dark = false } = {}) {
  await page.evaluate(({ product, dark }) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.setAttribute('product', product === 'cp' ? 'Costpoint' : product);
      // try common APIs
      if (typeof app.product !== 'undefined') app.product = product === 'cp' ? 'Costpoint' : product;
    }
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.add('theme-cp');
    // demo may use data attributes
    document.documentElement.dataset.theme = product;
  }, { product, dark });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ headless: true });
const results = { generatedAt: new Date().toISOString() };

// REFERENCE
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4321/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('theme-cp');
  });
  await page.waitForTimeout(400);
  results.ref = await collectReference(page);
  await page.screenshot({ path: join(OUT, 'ref-cp-light-top.png'), fullPage: false });
  results.refHeadings = await screenshotSections(page, 'ref', false);

  // dark
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  await page.waitForTimeout(400);
  results.refDarkPrimary = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const el = [...main.querySelectorAll('button.btn--primary')].find((b) => !b.className.includes('page-header'));
    if (!el) return null;
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, color: s.color, fontWeight: s.fontWeight, text: el.innerText.trim().slice(0,40) };
  });
  await page.screenshot({ path: join(OUT, 'ref-cp-dark-top.png'), fullPage: false });
  await page.close();
}

// CONVERTED
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:5178/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  await setConvTheme(page, { product: 'cp', dark: false });
  results.conv = await collectConverted(page);
  await page.screenshot({ path: join(OUT, 'conv-cp-light-top.png'), fullPage: false });
  results.convHeadings = await screenshotSections(page, 'conv', true);

  // clip unclassed + xs
  const clips = await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page') || document.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot || pageEl;
    const pick = (selOrFn) => {
      const el = typeof selOrFn === 'function' ? selOrFn(root) : root.querySelector(selOrFn);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y + window.scrollY - 8), width: Math.min(r.width + 16, 400), height: Math.min(r.height + 16, 120) };
    };
    const unclassed = [...root.querySelectorAll('button')].find((b) => !b.className || !String(b.className).includes('btn'));
    const xs = root.querySelector('button.btn--xs');
    const hybridSave = [...root.querySelectorAll('harmony-button')].find((h) => (h.textContent || '').includes('Save') && !h.hasAttribute('loading'));
    return {
      unclassed: unclassed && (() => { const r = unclassed.getBoundingClientRect(); return { x: Math.max(0,r.x-8), y: Math.max(0, r.y + window.scrollY - 8), width: Math.min(r.width+16,400), height: Math.min(r.height+16,80)}; })(),
      xs: xs && (() => { const r = xs.getBoundingClientRect(); return { x: Math.max(0,r.x-8), y: Math.max(0, r.y + window.scrollY - 8), width: Math.min(r.width+16,200), height: Math.min(r.height+16,80)}; })(),
      hybridSave: hybridSave && (() => { const r = hybridSave.getBoundingClientRect(); return { x: Math.max(0,r.x-8), y: Math.max(0, r.y + window.scrollY - 8), width: Math.min(r.width+16,200), height: Math.min(r.height+16,80)}; })(),
    };
  });
  for (const [name, clip] of Object.entries(clips)) {
    if (clip && clip.height > 0) {
      await page.screenshot({ path: join(OUT, `clip-${name}.png`), clip });
    }
  }

  // dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const app = document.querySelector('demo-app');
    if (app) app.classList?.add?.('dark');
    // toggle via header if present
    const header = document.querySelector('demo-app')?.shadowRoot?.querySelector('demo-header');
    const btn = header?.shadowRoot?.querySelector('[data-mode], button[aria-label*="dark" i], button[aria-label*="mode" i]');
    // also set on host
  });
  // try clicking mode toggle
  try {
    const toggled = await page.evaluate(() => {
      const app = document.querySelector('demo-app');
      const header = app?.shadowRoot?.querySelector('demo-header');
      const root = header?.shadowRoot;
      if (!root) return false;
      const candidates = [...root.querySelectorAll('button, select')];
      const modeBtn = candidates.find((b) => /dark|light|mode/i.test(b.getAttribute('aria-label') || b.textContent || b.title || ''));
      if (modeBtn) { modeBtn.click(); return true; }
      // select for mode?
      return false;
    });
    await page.waitForTimeout(400);
    results.modeToggleClicked = toggled;
  } catch (e) {
    results.modeToggleError = String(e);
  }
  results.convDark = await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const htmlDark = document.documentElement.classList.contains('dark');
    const btn = root?.querySelector('button.btn--primary') || [...(root?.querySelectorAll('button') || [])][0];
    if (!btn) return { htmlDark };
    const s = getComputedStyle(btn);
    return { htmlDark, bg: s.backgroundColor, color: s.color, fontWeight: s.fontWeight, text: (btn.innerText||'').trim().slice(0,40), className: btn.className };
  });
  await page.screenshot({ path: join(OUT, 'conv-cp-dark-top.png'), fullPage: false });

  // forced-colors
  await page.emulateMedia({ forcedColors: 'active', colorScheme: 'dark' });
  await page.waitForTimeout(300);
  results.convForcedColors = await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector('demo-buttons-page');
    const root = pageEl?.shadowRoot;
    const btn = root?.querySelector('button.btn--primary') || root?.querySelector('button');
    const disabled = root?.querySelector('button[disabled], button:disabled');
    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, color: s.color, border: s.border, outline: s.outline, opacity: s.opacity };
    };
    if (btn) btn.focus();
    const focused = btn ? styleOf(btn) : null;
    return {
      primary: styleOf(btn),
      disabled: styleOf(disabled),
      focused,
    };
  });
  await page.screenshot({ path: join(OUT, 'conv-forced-colors-top.png'), fullPage: false });
  await page.close();
}

writeFileSync(join(OUT, 'compare-metrics.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify({
  refH2: results.ref?.h2s,
  convH2: results.conv?.h2s,
  unclassed: results.conv?.unclassed,
  primaryClassed: results.conv?.primaryClassed,
  download: results.conv?.download,
  confirm: results.conv?.confirm,
  reject: results.conv?.reject,
  hasUsage: results.conv?.hasUsage,
  hybrids: results.conv?.hybrids?.map((h) => ({ text: h.textContent, w: h.width, attrs: h.attrs })),
  refPrimary: results.ref?.primary,
  sizes: results.conv?.sizes,
}, null, 2));

await browser.close();
