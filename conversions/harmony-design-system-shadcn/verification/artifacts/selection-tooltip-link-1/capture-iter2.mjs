import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const art = dirname(fileURLToPath(import.meta.url));
mkdirSync(art, { recursive: true });

async function setup(page) {
  await page.evaluate(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '') + ' theme-cp';
  });
  await page.waitForTimeout(300);
}

async function inventory(page) {
  return page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    return {
      h2: [...document.querySelectorAll('h2')].map((el) => clean(el.textContent)).filter(Boolean),
      h3: [...document.querySelectorAll('h3')].map((el) => clean(el.textContent)).filter(Boolean),
      hasDoDont: /Do|Don't|Don’t/.test(document.body.innerText || ''),
      hasUsage: /Usage Guidelines/.test(document.body.innerText || ''),
      hasInline: /Inline Layout/.test(document.body.innerText || ''),
      hasCheckedDisabled: /Checked & Disabled/.test(document.body.innerText || ''),
      hasDisabledWarning: /Disabled warning/.test(document.body.innerText || ''),
      hasDisabledError: /Disabled error/.test(document.body.innerText || ''),
    };
  });
}

async function shotHeading(page, heading, out) {
  const h = page.getByRole('heading', { name: heading, exact: true }).first();
  if (!(await h.count())) {
    console.log('missing', heading, out);
    return false;
  }
  await h.scrollIntoViewIfNeeded();
  const handle = await h.evaluateHandle((el) => {
    let n = el;
    for (let i = 0; i < 6; i++) {
      if (!n.parentElement) break;
      n = n.parentElement;
      const cls = String(n.className || '');
      if (n.tagName === 'SECTION' || /example|card|group|rounded/i.test(cls)) return n;
    }
    return el.parentElement?.parentElement || el.parentElement || el;
  });
  const el = handle.asElement();
  if (el) {
    try {
      writeFileSync(join(art, out), await el.screenshot({ type: 'png', animations: 'disabled' }));
      console.log('shot', out);
      return true;
    } catch (e) {
      console.log('crop fail', out, String(e.message).split('\n')[0]);
    }
  }
  writeFileSync(join(art, out), await page.screenshot({ type: 'png' }));
  console.log('pagefall', out);
  return true;
}

async function probeFace(base, path, kind, out) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  await page.goto(`${base}/components/${path}`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const data = await page.evaluate((kind) => {
    const token = getComputedStyle(document.documentElement)
      .getPropertyValue('--border-width-standard')
      .trim();
    let el =
      kind === 'checkbox'
        ? document.querySelector('button[role="checkbox"]')
        : document.querySelector('button[role="radio"]');
    if (!el && kind === 'checkbox') {
      el = [...document.querySelectorAll('*')].find((n) => {
        const r = n.getBoundingClientRect();
        const cs = getComputedStyle(n);
        return (
          r.width >= 14 &&
          r.width <= 28 &&
          r.height >= 14 &&
          r.height <= 28 &&
          parseFloat(cs.borderTopWidth) >= 1
        );
      });
    }
    if (!el && kind === 'radio') {
      el =
        document.querySelector('.radio__circle') ||
        [...document.querySelectorAll('*')].find((n) => {
          const r = n.getBoundingClientRect();
          const cs = getComputedStyle(n);
          return (
            r.width >= 14 &&
            r.width <= 28 &&
            (cs.borderRadius.includes('50') ||
              cs.borderRadius === '9999px' ||
              parseFloat(cs.borderRadius) > 100) &&
            parseFloat(cs.borderTopWidth) >= 1
          );
        });
    }
    if (!el) return { token, found: false };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      token,
      found: true,
      tag: el.tagName,
      role: el.getAttribute('role'),
      size: { w: Math.round(r.width), h: Math.round(r.height) },
      borderW: cs.borderTopWidth,
      borderC: cs.borderTopColor,
      radius: cs.borderRadius,
      bg: cs.backgroundColor,
    };
  }, kind);
  writeFileSync(join(art, out), JSON.stringify(data, null, 2));
  console.log(out, data);
  await browser.close();
  return data;
}

// Inventories + key crops for iteration 2
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const [base, prefix] of [
  ['http://localhost:5177', 'conv2'],
  ['http://localhost:4321', 'ref2'],
]) {
  for (const slug of ['checkboxes', 'radio-buttons']) {
    await page.goto(`${base}/components/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
    await setup(page);
    const inv = await inventory(page);
    writeFileSync(join(art, `${prefix}-${slug}-inventory.json`), JSON.stringify(inv, null, 2));
    writeFileSync(join(art, `${prefix}-${slug}-top.png`), await page.screenshot({ type: 'png' }));
    console.log(prefix, slug, inv);
  }
}

// Conv section crops for remediated areas
await page.goto('http://localhost:5177/components/checkboxes', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);
await shotHeading(page, 'States', 'conv2-cb-states.png');
await shotHeading(page, 'Usage Guidelines', 'conv2-cb-usage.png');

await page.goto('http://localhost:5177/components/radio-buttons', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);
await shotHeading(page, 'States', 'conv2-rb-states.png');
await shotHeading(page, 'Inline Layout', 'conv2-rb-inline.png');
await shotHeading(page, 'Sizes', 'conv2-rb-sizes.png');
await shotHeading(page, 'State Variants', 'conv2-rb-variants.png');

await page.goto('http://localhost:4321/components/checkboxes', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);
await shotHeading(page, 'States', 'ref2-cb-states.png');
await shotHeading(page, 'Usage Guidelines', 'ref2-cb-usage.png');

await page.goto('http://localhost:4321/components/radio-buttons', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);
await shotHeading(page, 'States', 'ref2-rb-states.png');
await shotHeading(page, 'Inline Layout', 'ref2-rb-inline.png');
await shotHeading(page, 'Size Variants', 'ref2-rb-sizes.png');
await shotHeading(page, 'State Variants', 'ref2-rb-variants.png');

await browser.close();

await probeFace('http://localhost:4321', 'checkboxes', 'checkbox', 'ref2-checkbox-face-probe.json');
await probeFace('http://localhost:5177', 'checkboxes', 'checkbox', 'conv2-checkbox-face-probe.json');
await probeFace('http://localhost:4321', 'radio-buttons', 'radio', 'ref2-radio-face-probe.json');
await probeFace('http://localhost:5177', 'radio-buttons', 'radio', 'conv2-radio-face-probe.json');

console.log('ITER2 DONE');
