import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const art = dirname(fileURLToPath(import.meta.url));
mkdirSync(art, { recursive: true });

const routes = [
  'checkboxes',
  'checkbox-groups',
  'radio-buttons',
  'radio-groups',
  'links',
  'tooltips',
];

async function setup(page) {
  await page.evaluate(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '') + ' theme-cp';
  });
  await page.waitForTimeout(350);
}

async function inventory(page) {
  return page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const h1 = clean(document.querySelector('h1')?.textContent);
    const h2 = [...document.querySelectorAll('h2')]
      .map((el) => clean(el.textContent))
      .filter(Boolean);
    const h3 = [...document.querySelectorAll('h3')]
      .map((el) => clean(el.textContent))
      .filter(Boolean);
    const h4 = [...document.querySelectorAll('h4')]
      .map((el) => clean(el.textContent))
      .filter(Boolean);
    const exampleTitles = h3.length ? h3 : h4;
    const text = document.body.innerText || '';
    const importSnippet =
      /@dltkrichardhuska\/harmony-design-system-shadcn/.test(text) ||
      /Import/.test(text);
    return {
      h1,
      h2,
      exampleTitles,
      importSnippet,
      bodyTextLen: text.length,
      hasCallout: /not supported|unsupported|equivalent/i.test(text),
    };
  });
}

async function capturePage(base, slug, outPrefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const url = `${base}/components/${slug}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const inv = await inventory(page);
  writeFileSync(join(art, `${outPrefix}-inventory.json`), JSON.stringify(inv, null, 2));
  writeFileSync(join(art, `${outPrefix}-top.png`), await page.screenshot({ type: 'png', fullPage: false }));
  const main = page.locator('main, article').first();
  try {
    if (await main.count()) {
      writeFileSync(
        join(art, `${outPrefix}-full.png`),
        await main.screenshot({ type: 'png', animations: 'disabled' }),
      );
    } else {
      writeFileSync(join(art, `${outPrefix}-full.png`), await page.screenshot({ type: 'png', fullPage: true }));
    }
  } catch {
    writeFileSync(join(art, `${outPrefix}-full.png`), await page.screenshot({ type: 'png', fullPage: true }));
  }
  await browser.close();
  console.log('ok', outPrefix, inv.h1, 'examples:', inv.exampleTitles.length);
  return inv;
}

async function captureTooltip(base, outPrefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/components/tooltips`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);

  const candidates = page.locator('main button, article button, main a, article a');
  const count = await candidates.count();
  let hovered = false;
  for (let i = 0; i < Math.min(count, 30); i++) {
    const el = candidates.nth(i);
    await el.scrollIntoViewIfNeeded();
    await el.hover({ force: true });
    await page.waitForTimeout(500);
    const tip = page.locator('[role="tooltip"]:visible, [data-state="instant-open"], [data-state="delayed-open"]').first();
    const tipAlt = page.locator('[data-radix-popper-content-wrapper], .tooltip[data-show], .tooltip.is-visible, .tooltip--open').first();
    const found = (await tip.count()) ? tip : tipAlt;
    if (await found.count()) {
      writeFileSync(join(art, `${outPrefix}-tooltip-open.png`), await page.screenshot({ type: 'png' }));
      try {
        writeFileSync(join(art, `${outPrefix}-tooltip-panel.png`), await found.screenshot({ type: 'png' }));
      } catch {
        /* ignore crop failures */
      }
      hovered = true;
      break;
    }
  }
  if (!hovered) {
    writeFileSync(join(art, `${outPrefix}-tooltip-open.png`), await page.screenshot({ type: 'png' }));
    console.log('tooltip hover weak', outPrefix);
  } else {
    console.log('tooltip open', outPrefix);
  }
  await browser.close();
}

async function probeCheckbox(base, outName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/components/checkboxes`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const data = await page.evaluate(() => {
    const cb =
      document.querySelector('button[role="checkbox"]') ||
      document.querySelector('[role="checkbox"]') ||
      document.querySelector('input[type="checkbox"]');
    const label = document.querySelector('label');
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const box = cs(cb);
    return {
      checkboxTag: cb?.tagName,
      checkboxRole: cb?.getAttribute('role'),
      size: cb
        ? { w: Math.round(cb.getBoundingClientRect().width), h: Math.round(cb.getBoundingClientRect().height) }
        : null,
      border: box ? `${box.borderTopWidth} ${box.borderTopStyle} ${box.borderTopColor}` : null,
      bg: box?.backgroundColor,
      radius: box?.borderRadius,
      labelColor: label ? cs(label).color : null,
      labelSize: label ? cs(label).fontSize : null,
    };
  });
  writeFileSync(join(art, `${outName}-checkbox-probe.json`), JSON.stringify(data, null, 2));
  await browser.close();
  console.log('probe', outName, JSON.stringify(data));
}

async function probeRadio(base, outName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/components/radio-buttons`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const data = await page.evaluate(() => {
    const rb =
      document.querySelector('button[role="radio"]') ||
      document.querySelector('[role="radio"]') ||
      document.querySelector('input[type="radio"]');
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const box = cs(rb);
    return {
      tag: rb?.tagName,
      role: rb?.getAttribute('role'),
      size: rb
        ? { w: Math.round(rb.getBoundingClientRect().width), h: Math.round(rb.getBoundingClientRect().height) }
        : null,
      border: box ? `${box.borderTopWidth} ${box.borderTopStyle} ${box.borderTopColor}` : null,
      bg: box?.backgroundColor,
      radius: box?.borderRadius,
    };
  });
  writeFileSync(join(art, `${outName}-radio-probe.json`), JSON.stringify(data, null, 2));
  await browser.close();
  console.log('probe-radio', outName, JSON.stringify(data));
}

async function probeLink(base, outName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${base}/components/links`, { waitUntil: 'networkidle', timeout: 60000 });
  await setup(page);
  const data = await page.evaluate(() => {
    const links = [...document.querySelectorAll('main a, article a')].filter((a) => {
      const t = (a.textContent || '').trim();
      return t && !/skip|nav|getting/i.test(t) && a.getBoundingClientRect().width > 20;
    });
    const a = links[0];
    const cs = a ? getComputedStyle(a) : null;
    return {
      text: a?.textContent?.trim()?.slice(0, 80),
      color: cs?.color,
      fontSize: cs?.fontSize,
      textDecoration: cs?.textDecorationLine,
      fontWeight: cs?.fontWeight,
    };
  });
  writeFileSync(join(art, `${outName}-link-probe.json`), JSON.stringify(data, null, 2));
  await browser.close();
  console.log('probe-link', outName, JSON.stringify(data));
}

for (const slug of routes) {
  await capturePage('http://localhost:4321', slug, `ref-${slug}`);
  await capturePage('http://localhost:5177', slug, `conv-${slug}`);
}

await captureTooltip('http://localhost:4321', 'ref');
await captureTooltip('http://localhost:5177', 'conv');
await probeCheckbox('http://localhost:4321', 'ref');
await probeCheckbox('http://localhost:5177', 'conv');
await probeRadio('http://localhost:4321', 'ref');
await probeRadio('http://localhost:5177', 'conv');
await probeLink('http://localhost:4321', 'ref');
await probeLink('http://localhost:5177', 'conv');

console.log('DONE');
