import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });

async function scrollDemoToHeading(page, textRe) {
  return page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const deep = (root, sel) => {
      const out = [];
      const walk = (n) => {
        if (!n?.querySelectorAll) return;
        out.push(...n.querySelectorAll(sel));
        for (const el of n.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
      };
      walk(root);
      return out;
    };
    const host = document.querySelector('demo-tables-page');
    const root = host?.shadowRoot;
    if (!root) return { ok: false, reason: 'no host' };
    const h = [...root.querySelectorAll('h2')].find((el) => re.test(el.textContent || ''));
    if (!h) return { ok: false, reason: 'no heading', headings: [...root.querySelectorAll('h2')].map((x) => x.textContent.trim()) };
    // Find scrollable ancestor in composed path
    let node = h;
    let scrolled = false;
    while (node) {
      const style = node instanceof Element ? getComputedStyle(node) : null;
      const oy = style?.overflowY;
      if (node instanceof Element && (oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight + 20) {
        const top = h.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop - 16;
        node.scrollTop = top;
        scrolled = true;
        break;
      }
      node = node.parentElement || node.getRootNode()?.host || null;
    }
    if (!scrolled) h.scrollIntoView({ block: 'start' });
    // Also try scrolling demo-app main
    const app = document.querySelector('demo-app');
    const main = app?.shadowRoot?.querySelector('main, [part="main"], .main, .content, [class*="main"]');
    if (main && main.scrollHeight > main.clientHeight) {
      const top = h.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 16;
      main.scrollTop = top;
      scrolled = true;
    }
    return {
      ok: true,
      heading: h.textContent.trim(),
      hostH: Math.round(host.getBoundingClientRect().height),
      hTop: Math.round(h.getBoundingClientRect().top),
      scrolled,
      mainTag: main?.tagName,
      mainScroll: main ? { top: main.scrollTop, h: main.scrollHeight, client: main.clientHeight } : null,
    };
  }, textRe.source);
}

async function clipAroundHeading(page, textRe, outPath) {
  const info = await scrollDemoToHeading(page, textRe);
  await delay(400);
  // Prefer clipping the demo-example after heading
  const box = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const host = document.querySelector('demo-tables-page');
    const root = host?.shadowRoot;
    const h = [...(root?.querySelectorAll('h2') || [])].find((el) => re.test(el.textContent || ''));
    if (!h) return null;
    let block = h.nextElementSibling;
    // include heading + next few siblings
    const nodes = [h];
    let n = h.nextElementSibling;
    let i = 0;
    while (n && i < 3) {
      nodes.push(n);
      n = n.nextElementSibling;
      i++;
    }
    const rects = nodes.map((el) => el.getBoundingClientRect());
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return {
      x: Math.max(0, left - 8),
      y: Math.max(0, top - 8),
      width: Math.min(1200, right - left + 16),
      height: Math.min(700, bottom - top + 16),
    };
  }, textRe.source);
  if (box && box.width > 50 && box.height > 50) {
    await page.screenshot({ path: outPath, clip: box });
  } else {
    await page.screenshot({ path: outPath });
  }
  return info;
}

const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/components/tables', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
  document.querySelector('demo-app')?.setAttribute('product', 'cp');
});
await delay(800);

// Diagnose scroll ancestry
const diag = await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const app = document.querySelector('demo-app');
  const chain = [];
  let n = host;
  while (n) {
    if (n instanceof Element) {
      const s = getComputedStyle(n);
      chain.push({
        tag: n.tagName,
        class: (n.className || '').toString().slice(0, 60),
        h: Math.round(n.getBoundingClientRect().height),
        scrollH: n.scrollHeight,
        clientH: n.clientHeight,
        overflow: s.overflow + '/' + s.overflowY,
      });
    }
    n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null;
  }
  const appSR = app?.shadowRoot;
  const appChildren = appSR ? [...appSR.children].map((c) => ({ tag: c.tagName, class: (c.className||'').toString().slice(0,40), h: Math.round(c.getBoundingClientRect().height), scrollH: c.scrollHeight, clientH: c.clientHeight, oy: getComputedStyle(c).overflowY })) : [];
  return { hostDisplay: host ? getComputedStyle(host).display : null, hostH: host?.getBoundingClientRect().height, chain, appChildren, bodyScroll: document.documentElement.scrollHeight };
});
writeFileSync(`${outDir}/scroll-diag.json`, JSON.stringify(diag, null, 2));
console.log(JSON.stringify(diag, null, 2));

const sections = [
  [/Native — default gray/i, 'clip-native-gray.png'],
  [/striped/i, 'clip-striped.png'],
  [/Interactive/i, 'clip-interactive.png'],
  [/Reorderable/i, 'clip-reorderable.png'],
  [/Grouped/i, 'clip-grouped.png'],
  [/Sortable/i, 'clip-sortable.png'],
  [/Filter/i, 'clip-filter.png'],
  [/Command Center/i, 'clip-cc.png'],
  [/API/i, 'clip-api.png'],
  [/Accessibility/i, 'clip-a11y.png'],
];

const results = {};
for (const [re, file] of sections) {
  const info = await clipAroundHeading(page, re, `${outDir}/${file}`);
  results[file] = info;
  console.log(file, JSON.stringify(info));
}
writeFileSync(`${outDir}/clip-meta.json`, JSON.stringify(results, null, 2));

// Ref clips
await page.goto('http://localhost:4321/components/tables', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => { document.documentElement.classList.add('theme-cp'); document.documentElement.classList.remove('dark'); });
await delay(500);

async function clipRef(titleRe, file) {
  await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const el = [...document.querySelectorAll('h2,h3,.example-section__title')].find((e) => re.test(e.textContent || ''));
    el?.scrollIntoView({ block: 'start' });
  }, titleRe.source);
  await delay(350);
  const box = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const el = [...document.querySelectorAll('h2,h3,.example-section__title')].find((e) => re.test(e.textContent || ''));
    if (!el) return null;
    // climb to example section / section
    let section = el.closest('.example-section, section, .space-y-6') || el.parentElement;
    const r = section.getBoundingClientRect();
    return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(1100, r.width), height: Math.min(650, r.height) };
  }, titleRe.source);
  if (box && box.height > 40) await page.screenshot({ path: `${outDir}/${file}`, clip: box });
  else await page.screenshot({ path: `${outDir}/${file}` });
}

await clipRef(/Default Table with Gray Header/i, 'clip-ref-native-gray.png');
await clipRef(/Interactive Table/i, 'clip-ref-interactive.png');
await clipRef(/Reorderable Rows/i, 'clip-ref-reorderable.png');
await clipRef(/Grouped Rows/i, 'clip-ref-grouped.png');
await clipRef(/Sortable column headers/i, 'clip-ref-sortable.png');
await clipRef(/Filter Bar$/i, 'clip-ref-filter.png');
await clipRef(/Command Center table/i, 'clip-ref-cc.png');
await clipRef(/Usage Guidelines/i, 'clip-ref-a11y.png');

await browser.close();
console.log('clips done');
