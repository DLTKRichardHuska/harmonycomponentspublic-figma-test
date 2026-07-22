import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });

function rgbToHex(rgb) {
  if (!rgb) return rgb;
  if (rgb.startsWith('#')) return rgb.toLowerCase();
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return rgb;
  const a = m[4] !== undefined ? Number(m[4]) : 1;
  const hex = '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
  if (a < 1) return 'rgba(' + m[1] + ', ' + m[2] + ', ' + m[3] + ', ' + a + ')';
  return hex;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

async function setConvTheme(product, mode) {
  await page.goto('http://localhost:5177/foundation/colors', { waitUntil: 'networkidle', timeout: 60000 });
  await page.selectOption('select', product);
  const btn = page.getByRole('button', { name: /^(Dark|Light)$/ });
  const txt = await btn.textContent();
  if (mode === 'dark' && txt && txt.includes('Dark')) await btn.click();
  if (mode === 'light' && txt && txt.includes('Light')) await btn.click();
  await page.waitForTimeout(450);
}

async function extractConvColors(product, mode) {
  await setConvTheme(product, mode);
  const data = await page.evaluate(() => {
    const article = document.querySelector('article');
    const h1 = article && article.querySelector('h1') ? article.querySelector('h1').textContent.trim() : null;
    const headings = [...(article ? article.querySelectorAll('h2') : [])].map((h) => h.textContent.trim());
    const indicator = [...(article ? article.querySelectorAll('p,span,div') : [])]
      .map((e) => e.textContent.trim())
      .find((t) => /^Showing/.test(t));
    const tiles = [...(article ? article.querySelectorAll('div') : [])].filter(
      (el) => el.offsetHeight >= 56 && el.offsetHeight <= 80 && el.style.backgroundColor,
    );
    const swatches = tiles.map((el) => {
      const lines = (el.parentElement && el.parentElement.innerText ? el.parentElement.innerText : '')
        .split('\n').map((s) => s.trim()).filter(Boolean);
      return {
        name: lines[0] || '',
        valueLabel: lines[1] || '',
        cssVar: lines[2] || '',
        bg: getComputedStyle(el).backgroundColor,
        inline: el.style.backgroundColor,
      };
    });
    const h1El = article ? article.querySelector('h1') : null;
    const labelEl = article ? article.querySelector('.text-sm') : null;
    return {
      h1, headings, indicator, swatches,
      h1Fs: h1El ? getComputedStyle(h1El).fontSize : null,
      labelFs: labelEl ? getComputedStyle(labelEl).fontSize : null,
      pageBg: getComputedStyle(document.body).backgroundColor,
      htmlAttrs: {
        class: document.documentElement.className,
        product: document.documentElement.getAttribute('data-product'),
        dark: document.documentElement.classList.contains('dark'),
      },
      title: document.title,
    };
  });
  data.swatches = data.swatches.map((s) => Object.assign({}, s, { bgHex: rgbToHex(s.bg) }));
  data.pageBgHex = rgbToHex(data.pageBg);
  return Object.assign({ product, mode }, data);
}

async function extractRefColors(mode) {
  await page.goto('http://localhost:4321/foundation/colors', { waitUntil: 'networkidle', timeout: 60000 });
  if (mode === 'dark') {
    const darkBtn = page.getByRole('button', { name: /dark/i }).first();
    if (await darkBtn.count()) {
      try { await darkBtn.click({ timeout: 2000 }); } catch (e) {}
    }
    await page.evaluate(() => { document.documentElement.classList.add('dark'); });
  } else {
    await page.evaluate(() => { document.documentElement.classList.remove('dark'); });
  }
  await page.waitForTimeout(500);
  const data = await page.evaluate(() => {
    const article = document.querySelector('article');
    const h1 = article && article.querySelector('h1') ? article.querySelector('h1').textContent.trim() : null;
    const headings = [...(article ? article.querySelectorAll('h2') : [])]
      .filter((h) => {
        const sec = h.closest('section');
        if (!sec) return true;
        return !sec.classList.contains('hidden') && getComputedStyle(sec).display !== 'none';
      })
      .map((h) => h.textContent.trim());
    const ind = document.querySelector('#theme-indicator');
    const indicator = ind ? ind.innerText.replace(/\s+/g, ' ').trim() : null;
    const tiles = [...(article ? article.querySelectorAll('[data-color-key][style*=background], [data-css-var]') : [])]
      .filter((el) => el.offsetHeight >= 40 && !el.closest('section.hidden'));
    const swatches = tiles.map((el) => {
      const wrap = el.closest('[data-color-key]') || el.parentElement;
      const lines = (wrap && wrap.innerText ? wrap.innerText : '').split('\n').map((s) => s.trim()).filter(Boolean);
      return {
        key: el.getAttribute('data-color-key') || (wrap ? wrap.getAttribute('data-color-key') : '') || '',
        name: lines[0] || '',
        valueLabel: lines.find((l) => l.startsWith('#') || l.startsWith('rgba')) || lines[1] || '',
        bg: getComputedStyle(el).backgroundColor,
      };
    });
    const semantic = [...(article ? article.querySelectorAll('[data-semantic]') : [])].map((wrap) => {
      const tile = wrap.querySelector('[style*=background]') || wrap.querySelector('div');
      const lines = wrap.innerText.split('\n').map((s) => s.trim()).filter(Boolean);
      return {
        key: wrap.getAttribute('data-semantic'),
        name: lines[0],
        valueLabel: lines[1],
        bg: tile ? getComputedStyle(tile).backgroundColor : null,
      };
    });
    const h1El = article ? article.querySelector('h1') : null;
    const sections = [...(article ? article.querySelectorAll('section') : [])].map((s) => ({
      id: s.id,
      hidden: s.classList.contains('hidden') || getComputedStyle(s).display === 'none',
      title: s.querySelector('h2') ? s.querySelector('h2').textContent.trim() : null,
    }));
    return {
      h1, headings, indicator, swatches, semantic, sections,
      h1Fs: h1El ? getComputedStyle(h1El).fontSize : null,
      pageBg: getComputedStyle(document.body).backgroundColor,
      htmlClass: document.documentElement.className,
      dark: document.documentElement.classList.contains('dark'),
    };
  });
  data.swatches = data.swatches.map((s) => Object.assign({}, s, { bgHex: rgbToHex(s.bg) }));
  data.semantic = data.semantic.map((s) => Object.assign({}, s, { bgHex: rgbToHex(s.bg) }));
  data.pageBgHex = rgbToHex(data.pageBg);
  return Object.assign({ mode }, data);
}

async function extractTypography(base) {
  await page.goto(base + '/foundation/typography', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const article = document.querySelector('article');
    const h1 = article && article.querySelector('h1') ? article.querySelector('h1').textContent.trim() : null;
    const headings = [...(article ? article.querySelectorAll('h2') : [])].map((h) => h.textContent.trim());
    const measured = [];
    const selectors = ['.text-display-xl', '.text-display-l', '.text-display-m', '.text-heading-xl', '.text-heading-l', '.text-heading-m', '.text-heading-s', '.text-base', 'h1'];
    for (const sel of selectors) {
      const el = article ? article.querySelector(sel) : null;
      if (!el) continue;
      const cs = getComputedStyle(el);
      measured.push({
        sel,
        text: el.textContent.trim().slice(0, 48),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
      });
    }
    const large = [...(article ? article.querySelectorAll('p, h1, h2, h3, span') : [])]
      .map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: el.textContent.trim().slice(0, 40),
          fontSize: cs.fontSize,
          fontFamily: cs.fontFamily.split(',')[0].replace(/"/g, ''),
          fontWeight: cs.fontWeight,
        };
      })
      .filter((m) => m.text && parseFloat(m.fontSize) >= 14)
      .slice(0, 30);
    const nav = [...(article ? article.querySelectorAll('a[href^="#"]') : [])].map((a) => a.textContent.trim());
    const tableRows = [...(article ? article.querySelectorAll('table tr') : [])].length;
    return { h1, headings, measured, large, nav, tableRows, title: document.title };
  });
}

async function extractSpacing(base) {
  await page.goto(base + '/foundation/spacing', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const article = document.querySelector('article');
    const h1 = article && article.querySelector('h1') ? article.querySelector('h1').textContent.trim() : null;
    const headings = [...(article ? article.querySelectorAll('h2') : [])].map((h) => h.textContent.trim());
    const bars = [...(article ? article.querySelectorAll('[style*=width]') : [])]
      .filter((el) => el.offsetHeight > 0 && el.offsetHeight < 48)
      .map((el) => {
        const rowText = (el.parentElement && el.parentElement.innerText ? el.parentElement.innerText : '').split('\n')[0] || '';
        return {
          row: rowText.slice(0, 80),
          widthStyle: el.style.width,
          widthPx: Math.round(el.getBoundingClientRect().width),
          bg: getComputedStyle(el).backgroundColor,
        };
      });
    const radiusTiles = [...(article ? article.querySelectorAll('div') : [])]
      .filter((el) => el.style.borderRadius && el.offsetWidth >= 60 && el.offsetWidth <= 120)
      .map((el) => ({
        label: (el.parentElement && el.parentElement.innerText ? el.parentElement.innerText : '').split('\n')[0],
        radius: getComputedStyle(el).borderRadius,
        size: Math.round(el.getBoundingClientRect().width),
      }));
    return { h1, headings, bars: bars.slice(0, 24), radiusTiles: radiusTiles.slice(0, 12) };
  });
}

async function extractElevations(base, setDark) {
  await page.goto(base + '/foundation/elevations', { waitUntil: 'networkidle', timeout: 60000 });
  if (base.includes('5177') && setDark) {
    const btn = page.getByRole('button', { name: /^(Dark|Light)$/ });
    const txt = await btn.textContent();
    if (txt && txt.includes('Dark')) await btn.click();
    await page.waitForTimeout(350);
  }
  if (base.includes('4321') && setDark) {
    await page.evaluate(() => { document.documentElement.classList.add('dark'); });
    await page.waitForTimeout(350);
  }
  return page.evaluate(() => {
    const article = document.querySelector('article');
    const h1 = article && article.querySelector('h1') ? article.querySelector('h1').textContent.trim() : null;
    const headings = [...(article ? article.querySelectorAll('h2') : [])].map((h) => h.textContent.trim());
    const styled = [...(article ? article.querySelectorAll('div') : [])]
      .filter((el) => el.style.boxShadow)
      .map((el) => ({
        text: el.innerText.split('\n').slice(0, 3).join(' | ').slice(0, 120),
        boxShadow: el.style.boxShadow || getComputedStyle(el).boxShadow,
      }));
    return { h1, headings, styled, dark: document.documentElement.classList.contains('dark') };
  });
}

async function extractDela() {
  await page.goto('http://localhost:5177/foundation/dela', { waitUntil: 'networkidle' });
  return page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
    body: document.querySelector('main') ? document.querySelector('main').innerText.slice(0, 500) : null,
  }));
}

const report = {
  conv: {
    cpLight: await extractConvColors('cp', 'light'),
    cpDark: await extractConvColors('cp', 'dark'),
    vpDark: await extractConvColors('vp', 'dark'),
  },
  ref: {
    light: await extractRefColors('light'),
    dark: await extractRefColors('dark'),
  },
  typography: {
    ref: await extractTypography('http://localhost:4321'),
    conv: await extractTypography('http://localhost:5177'),
  },
  spacing: {
    ref: await extractSpacing('http://localhost:4321'),
    conv: await extractSpacing('http://localhost:5177'),
  },
  elevations: {
    refLight: await extractElevations('http://localhost:4321', false),
    convLight: await extractElevations('http://localhost:5177', false),
    convDark: await extractElevations('http://localhost:5177', true),
  },
  dela: await extractDela(),
};

writeFileSync(join(outDir, 'probe.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  convCpLight: { h1: report.conv.cpLight.h1, indicator: report.conv.cpLight.indicator, headings: report.conv.cpLight.headings, h1Fs: report.conv.cpLight.h1Fs, pageBg: report.conv.cpLight.pageBgHex, n: report.conv.cpLight.swatches.length, sample: report.conv.cpLight.swatches.slice(0,8).map(x => [x.name, x.valueLabel, x.bgHex]) },
  convCpDark: { indicator: report.conv.cpDark.indicator, headings: report.conv.cpDark.headings, pageBg: report.conv.cpDark.pageBgHex, html: report.conv.cpDark.htmlAttrs, n: report.conv.cpDark.swatches.length, sample: report.conv.cpDark.swatches.slice(0,8).map(x => [x.name, x.valueLabel, x.bgHex]), accents: report.conv.cpDark.swatches.filter(x => /Success|Warning|Error|Info|Theme|Accent/.test(x.name)).map(x => [x.name, x.valueLabel, x.bgHex]) },
  convVpDark: { indicator: report.conv.vpDark.indicator, headings: report.conv.vpDark.headings, sample: report.conv.vpDark.swatches.slice(0,8).map(x => [x.name, x.valueLabel, x.bgHex]) },
  refLight: { h1: report.ref.light.h1, indicator: report.ref.light.indicator, headings: report.ref.light.headings, h1Fs: report.ref.light.h1Fs, pageBg: report.ref.light.pageBgHex, sections: report.ref.light.sections, n: report.ref.light.swatches.length, sample: report.ref.light.swatches.slice(0,8).map(x => [x.name||x.key, x.valueLabel, x.bgHex]) },
  refDark: { indicator: report.ref.dark.indicator, headings: report.ref.dark.headings, dark: report.ref.dark.dark, sections: report.ref.dark.sections, sample: report.ref.dark.swatches.slice(0,8).map(x => [x.name||x.key, x.valueLabel, x.bgHex]), semantic: report.ref.dark.semantic },
  typography: report.typography,
  spacing: report.spacing,
  elevations: { ref: report.elevations.refLight, conv: report.elevations.convLight, convDark: report.elevations.convDark },
  dela: report.dela,
}, null, 2));
await browser.close();
