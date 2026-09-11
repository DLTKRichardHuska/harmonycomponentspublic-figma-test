import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const OUT = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function prepRef(product = 'vp') {
  await page.goto('http://localhost:4321/components/inputs', { waitUntil: 'networkidle' });
  await page.evaluate((product) => {
    document.documentElement.classList.remove('dark');
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.documentElement.classList.add(`theme-${product}`);
  }, product);
  await delay(400);
}

async function prepConv(product = 'vp') {
  await page.goto('http://localhost:5178/components/inputs', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await delay(200);
  await page.evaluate((product) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.product = product;
      localStorage.setItem('harmony-vanilla-demo-product', product);
    }
  }, product);
  await delay(700);
}

async function scrollToHeading(text) {
  return page.evaluate((text) => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll?.('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    let found = null;
    walk(document, (root) => {
      root.querySelectorAll?.('h2,h3,.example-section__title').forEach((h) => {
        if (!found && (h.textContent || '').includes(text)) found = h;
      });
    });
    found?.scrollIntoView({ block: 'start' });
    return !!found;
  }, text);
}

async function clipHeading(text, maxH = 480) {
  return page.evaluate(
    ({ text, maxH }) => {
      function walk(root, visit) {
        visit(root);
        root.querySelectorAll?.('*').forEach((el) => {
          if (el.shadowRoot) walk(el.shadowRoot, visit);
        });
      }
      let found = null;
      walk(document, (root) => {
        root.querySelectorAll?.('h2,h3,.example-section__title').forEach((h) => {
          if (!found && (h.textContent || '').includes(text)) found = h;
        });
      });
      if (!found) return null;
      const section =
        found.closest('.example-section, demo-example, section') || found.parentElement;
      const r = (section || found).getBoundingClientRect();
      return {
        x: Math.max(0, r.x),
        y: Math.max(0, r.y),
        width: Math.min(1100, r.width || 800),
        height: Math.min(maxH, r.height || 300),
      };
    },
    { text, maxH },
  );
}

async function probe() {
  return page.evaluate(() => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll?.('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    const headings = [];
    const inputs = [];
    const labels = [];
    walk(document, (root) => {
      root.querySelectorAll?.('h2').forEach((h) =>
        headings.push((h.textContent || '').trim().slice(0, 80)),
      );
      root.querySelectorAll?.('harmony-input, input.input, input[type=email], input[type=text]').forEach(
        (el) => {
          const control =
            el.tagName === 'HARMONY-INPUT'
              ? el.shadowRoot?.querySelector('[part=control]')
              : el;
          if (!control) return;
          const cs = getComputedStyle(control);
          const r = control.getBoundingClientRect();
          inputs.push({
            tag: el.tagName.toLowerCase(),
            h: Math.round(r.height),
            font: cs.fontSize,
            bg: cs.backgroundColor,
            border: cs.borderTopColor,
            radius: cs.borderRadius,
          });
        },
      );
      root.querySelectorAll?.('label.label, .label').forEach((el) => {
        const cs = getComputedStyle(el);
        labels.push({
          text: (el.textContent || '').trim().slice(0, 40),
          font: cs.fontSize,
          color: cs.color,
          mb: cs.marginBottom,
        });
      });
    });
    return {
      headings,
      inputSample: inputs.slice(0, 8),
      labelSample: labels.slice(0, 8),
      formLayouts: (() => {
        let n = 0;
        walk(document, (root) => {
          n += root.querySelectorAll?.('harmony-form-layout')?.length || 0;
        });
        return n;
      })(),
    };
  });
}

const metrics = {};

await prepRef('vp');
metrics.refVp = await probe();
await page.screenshot({ path: join(OUT, 'ref-vp-light-top.png'), fullPage: false });
await scrollToHeading('With Icon');
await delay(200);
let clip = await clipHeading('With Icon');
if (clip) await page.screenshot({ path: join(OUT, 'ref-sec-with-icon.png'), clip });
await scrollToHeading('States');
await delay(200);
clip = await clipHeading('States');
if (clip) await page.screenshot({ path: join(OUT, 'ref-sec-states.png'), clip });
await scrollToHeading('Form Example');
await delay(200);
clip = await clipHeading('Form Example', 560);
if (clip) await page.screenshot({ path: join(OUT, 'ref-sec-form.png'), clip });

await prepRef('cp');
metrics.refCp = await probe();
await page.screenshot({ path: join(OUT, 'ref-cp-light-top.png'), fullPage: false });

await prepConv('vp');
metrics.convVp = await probe();
await page.screenshot({ path: join(OUT, 'conv-vp-light-top.png'), fullPage: false });
await scrollToHeading('With Icon');
await delay(200);
clip = await clipHeading('With Icon');
if (clip) await page.screenshot({ path: join(OUT, 'conv-sec-with-icon.png'), clip });
await scrollToHeading('States');
await delay(200);
clip = await clipHeading('States');
if (clip) await page.screenshot({ path: join(OUT, 'conv-sec-states.png'), clip });
await scrollToHeading('Form layout (inline)');
await delay(200);
clip = await clipHeading('Form layout (inline)', 560);
if (clip) await page.screenshot({ path: join(OUT, 'conv-sec-form-layout-inline.png'), clip });
await scrollToHeading('Form Example');
await delay(200);
clip = await clipHeading('Form Example', 560);
if (clip) await page.screenshot({ path: join(OUT, 'conv-sec-form.png'), clip });

await prepConv('cp');
metrics.convCp = await probe();
await page.screenshot({ path: join(OUT, 'conv-cp-light-top.png'), fullPage: false });

await page.goto('http://localhost:4321/components/labels', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-vp');
});
await delay(300);
await page.screenshot({ path: join(OUT, 'ref-labels-top.png'), fullPage: false });

await page.goto('http://localhost:5178/components/labels', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  const app = document.querySelector('demo-app');
  if (app) app.product = 'vp';
});
await delay(500);
await page.screenshot({ path: join(OUT, 'conv-labels-top.png'), fullPage: false });

writeFileSync(join(OUT, 'capture-metrics.json'), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
await browser.close();
