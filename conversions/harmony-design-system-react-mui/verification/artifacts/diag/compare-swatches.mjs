/**
 * Evidence-only re-compare of foundation/colors swatches by data-color-key,
 * which both reference (:4321) and converted (:5176) expose. The stock
 * audit-palette-swatches.mjs reads converted swatches via .MuiPaper-root inside
 * the label parent, but this conversion renders swatches as
 * <div data-color-key=... class="MuiBox-root ...">, so the stock reader returns
 * null. This script reads getComputedStyle background on the [data-color-key]
 * element (or its colored child) on BOTH sides, composites alpha over
 * pageBackground, and reports true rendered deltas.
 */
import { chromium } from 'playwright';

const REF = 'http://localhost:4321/foundation/colors';
const CONV = 'http://localhost:5176/foundation/colors';
const KEYS = [
  'pageBackground', 'cardBackground', 'navBackground', 'inputBackground',
  'inputDisabled', 'cellBackground', 'hover', 'tableTotal', 'titleText',
  'secondaryText', 'mutedText', 'border', 'link',
  'success', 'warning', 'error', 'info',
];
const PRODUCTS = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

function parse(css) {
  if (!css) return null;
  const m = css.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return { raw: css };
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
}
function comp(fg, bg) {
  const a = fg.a ?? 1;
  const r = Math.round(fg.r * a + bg.r * (1 - a));
  const g = Math.round(fg.g * a + bg.g * (1 - a));
  const b = Math.round(fg.b * a + bg.b * (1 - a));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}
function eff(p, bg) {
  if (!p || p.raw) return p?.raw ?? null;
  if ((p.a ?? 1) < 1 && bg && !bg.raw) return comp(p, bg);
  return `#${[p.r, p.g, p.b].map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

async function apply(page, url, product, mode) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(({ product, mode }) => {
    localStorage.setItem('theme', mode);
    localStorage.setItem('colorTheme', product);
    document.documentElement.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add(`theme-${product}`);
    document.documentElement.dataset.colorTheme = product;
    if (mode === 'dark') document.documentElement.classList.add('dark');
  }, { product, mode });
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
}

async function read(page) {
  return page.evaluate((keys) => {
    const visible = (el) => {
      if (!el) return false;
      const s = el.closest('section');
      if (s && s.classList.contains('hidden')) return false;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    };
    const bgOf = (container) => {
      const inner = container.querySelector(
        '.semi-light-swatch, .cp-dark-swatch, .vp-ppm-maconomy-dark-swatch, div[class*="rounded"], div.h-20',
      );
      const self = getComputedStyle(container).backgroundColor;
      if (self && self !== 'rgba(0, 0, 0, 0)' && self !== 'transparent') return self;
      if (inner) return getComputedStyle(inner).backgroundColor;
      return self;
    };
    const out = {};
    for (const k of keys) {
      const els = [...document.querySelectorAll(`[data-color-key="${k}"]`)].filter(visible);
      out[k] = els[0] ? bgOf(els[0]) : null;
    }
    return out;
  }, KEYS);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const rows = [];
try {
  for (const product of PRODUCTS) {
    for (const mode of MODES) {
      await apply(page, REF, product, mode);
      const ref = await read(page);
      await apply(page, CONV, product, mode);
      const conv = await read(page);
      const refBg = parse(ref.pageBackground);
      for (const k of KEYS) {
        const rp = parse(ref[k]);
        const cp = parse(conv[k]);
        const rh = eff(rp, refBg);
        const ch = eff(cp, refBg);
        let match = null;
        if (rh && ch && rh.startsWith('#') && ch.startsWith('#')) {
          const d = ['1', '3', '5'].map((i) => Math.abs(parseInt(rh.slice(+i, +i + 2), 16) - parseInt(ch.slice(+i, +i + 2), 16)));
          match = d.every((x) => x <= 4);
        } else {
          match = rh === ch;
        }
        rows.push({ product, mode, key: k, ref: rh ?? ref[k], conv: ch ?? conv[k], match });
      }
    }
  }
} finally {
  await browser.close();
}

const bad = rows.filter((r) => !r.match);
console.log('| product | mode | key | reference | converted | match |');
console.log('|---|---|---|---|---|---|');
for (const r of rows) console.log(`| ${r.product} | ${r.mode} | ${r.key} | ${r.ref} | ${r.conv} | ${r.match ? 'yes' : 'NO'} |`);
console.log(`\nTotal rows: ${rows.length}  Mismatches: ${bad.length}`);
if (bad.length) {
  console.log('\nMismatches:');
  for (const r of bad) console.log(`- ${r.product}/${r.mode}/${r.key}: ref ${r.ref} vs conv ${r.conv}`);
}
