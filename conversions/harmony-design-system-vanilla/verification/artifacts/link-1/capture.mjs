import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function probe(page, label) {
  const data = await page.evaluate(() => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    const anchors = [];
    walk(document, (root) => {
      root.querySelectorAll('a').forEach((a) => anchors.push(a));
    });
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        className: String(el.className || '').slice(0, 100),
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        textDecorationLine: cs.textDecorationLine,
        target: el.getAttribute('target'),
        rel: el.getAttribute('rel'),
        href: el.getAttribute('href'),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    const byText = (t) =>
      anchors.find((a) => (a.textContent || '').replace(/\s+/g, ' ').trim().includes(t));
    const samples = {};
    for (const t of [
      'documentation',
      'Small link',
      'Medium link',
      'Large link',
      'GitHub',
      'Privacy Policy',
      'Terms of Service',
      'Link with .btn',
    ]) {
      samples[t] = styleOf(byText(t));
    }
    let extIcon = null;
    walk(document, (root) => {
      root.querySelectorAll('.link__external-icon, harmony-icon').forEach((el) => {
        const inGithub = el.closest?.('a')?.textContent?.includes('GitHub');
        if (!extIcon && (el.classList?.contains('link__external-icon') || inGithub)) {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          extIcon = {
            tag: el.tagName,
            className: String(el.className || ''),
            color: cs.color,
            w: Math.round(r.width),
            h: Math.round(r.height),
            display: cs.display,
            marginInlineStart: cs.marginInlineStart || cs.marginLeft,
          };
        }
      });
    });
    const headings = [];
    walk(document, (root) => {
      root.querySelectorAll('h1,h2,h3').forEach((h) =>
        headings.push(h.tagName + ':' + (h.textContent || '').trim().slice(0, 80)),
      );
    });
    const muted = byText('Privacy Policy');
    const basic = byText('documentation');
    return {
      htmlTheme: [...document.documentElement.classList],
      headings,
      samples,
      extIcon,
      linkCount: anchors.length,
      mutedVsBasic:
        muted && basic
          ? { muted: getComputedStyle(muted).color, basic: getComputedStyle(basic).color }
          : null,
    };
  });
  writeFileSync(join(outDir, label + '-metrics.json'), JSON.stringify(data, null, 2));
  return data;
}

async function shot(page, name) {
  await page.screenshot({ path: join(outDir, name), fullPage: false });
}

async function setProduct(page, product) {
  await page.evaluate((product) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.product = product;
      localStorage.setItem('harmony-demo-product', product);
    }
    document.documentElement.classList.remove(
      'theme-cp',
      'theme-vp',
      'theme-ppm',
      'theme-maconomy',
    );
    document.documentElement.classList.add('theme-' + product);
  }, product);
  await delay(500);
}

async function setMode(page, dark) {
  await page.evaluate((dark) => {
    document.documentElement.classList.toggle('dark', dark);
  }, dark);
  await delay(400);
}

async function scrollToH2(page, title) {
  await page.evaluate((title) => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    let target = null;
    walk(document, (root) => {
      root.querySelectorAll('h2').forEach((h) => {
        if ((h.textContent || '').trim() === title) target = h;
      });
    });
    if (target) target.scrollIntoView({ block: 'start' });
  }, title);
  await delay(300);
}

const ref = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await ref.goto('http://localhost:4321/components/links', { waitUntil: 'networkidle', timeout: 60000 });
await ref.evaluate(() => {
  document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy', 'dark');
  document.documentElement.classList.add('theme-cp');
});
await delay(600);
const refM = await probe(ref, 'ref-cp-light');
await shot(ref, 'ref-cp-light-top.png');
await scrollToH2(ref, 'Size variants');
await shot(ref, 'ref-cp-light-sizes.png');
await scrollToH2(ref, 'External Link');
await shot(ref, 'ref-cp-light-external.png');
await scrollToH2(ref, 'Muted Link');
await shot(ref, 'ref-cp-light-muted.png');
await ref.evaluate(() => document.documentElement.classList.add('dark'));
await delay(400);
await probe(ref, 'ref-cp-dark');
await shot(ref, 'ref-cp-dark-top.png');
await ref.close();

const conv = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await conv.goto('http://localhost:5178/components/links', { waitUntil: 'networkidle', timeout: 60000 });
await delay(1000);
await setProduct(conv, 'cp');
await setMode(conv, false);
const convM = await probe(conv, 'conv-cp-light');
await shot(conv, 'conv-cp-light-top.png');
for (const [title, file] of [
  ['Basic Link', 'basic'],
  ['Size variants', 'sizes'],
  ['External Link', 'external'],
  ['Muted Link', 'muted'],
  ['Button link', 'button'],
]) {
  await scrollToH2(conv, title);
  await shot(conv, 'conv-cp-light-' + file + '.png');
}
await setMode(conv, true);
await probe(conv, 'conv-cp-dark');
await shot(conv, 'conv-cp-dark-top.png');
await conv.emulateMedia({ forcedColors: 'active' });
await delay(400);
await setMode(conv, false);
await probe(conv, 'conv-forced-colors');
await shot(conv, 'conv-forced-colors-top.png');
await conv.close();

writeFileSync(
  join(outDir, 'compare-notes.json'),
  JSON.stringify(
    {
      refHeadings: refM.headings,
      convHeadings: convM.headings,
      refSamples: refM.samples,
      convSamples: convM.samples,
      refExt: refM.extIcon,
      convExt: convM.extIcon,
      refMuted: refM.mutedVsBasic,
      convMuted: convM.mutedVsBasic,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({
  refSamples: refM.samples,
  convSamples: convM.samples,
  refExt: refM.extIcon,
  convExt: convM.extIcon,
  refMuted: refM.mutedVsBasic,
  convMuted: convM.mutedVsBasic,
  refHeadings: refM.headings,
  convHeadings: convM.headings,
}, null, 2));
await browser.close();
