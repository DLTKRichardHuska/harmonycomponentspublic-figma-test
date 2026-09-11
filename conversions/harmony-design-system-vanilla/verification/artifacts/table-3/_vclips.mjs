import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/components/tables', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.add('theme-cp');
  document.documentElement.classList.remove('dark');
  const app = document.querySelector('demo-app');
  app?.setAttribute('product', 'cp');
});
await delay(1000);

const helpers = `
  window.__deepFind = (sel) => {
    const walk = (root) => {
      const hit = root.querySelector?.(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll?.('*') || []) {
        if (el.shadowRoot) {
          const n = walk(el.shadowRoot);
          if (n) return n;
        }
      }
      return null;
    };
    return walk(document);
  };
  window.__deepAll = (sel) => {
    const out = [];
    const walk = (root) => {
      out.push(...(root.querySelectorAll?.(sel) || []));
      for (const el of root.querySelectorAll?.('*') || []) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);
    return out;
  };
`;
await page.addScriptTag({ content: helpers });

const layout = await page.evaluate(() => {
  const host = window.__deepFind('demo-tables-page');
  const app = document.querySelector('demo-app');
  // find scroll parent
  let scrollers = [];
  let n = host;
  while (n) {
    if (n instanceof Element) {
      const s = getComputedStyle(n);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll' || s.overflowY === 'hidden') && n.scrollHeight > n.clientHeight + 5) {
        scrollers.push({ tag: n.tagName, class: (n.className||'').toString().slice(0,50), scrollH: n.scrollHeight, clientH: n.clientHeight, oy: s.overflowY });
      }
    }
    const p = n.parentElement;
    if (p) n = p;
    else {
      const rn = n.getRootNode?.();
      n = rn?.host || null;
    }
  }
  // inspect demo-app body/main
  const body = app?.shadowRoot?.querySelector('.body');
  const main = body?.querySelector('main, .main, [part=main], .content, demo-router-outlet, #outlet') || body?.children?.[1];
  const allInBody = body ? [...body.querySelectorAll('*')].slice(0, 30).map(el => ({ tag: el.tagName, class: (el.className||'').toString().slice(0,40), scrollH: el.scrollHeight, clientH: el.clientHeight, oy: getComputedStyle(el).overflowY })) : [];
  return {
    hostFound: !!host,
    hostH: host ? Math.round(host.getBoundingClientRect().height) : 0,
    hostScrollH: host?.scrollHeight,
    headings: host?.shadowRoot ? [...host.shadowRoot.querySelectorAll('h2')].map(h => h.textContent.trim()) : [],
    scrollers,
    bodyKids: body ? [...body.children].map(c => ({ tag: c.tagName, class: (c.className||'').toString().slice(0,40), h: Math.round(c.getBoundingClientRect().height), scrollH: c.scrollHeight, clientH: c.clientHeight, oy: getComputedStyle(c).overflowY })) : [],
    allInBody,
  };
});
writeFileSync(`${outDir}/layout-diag.json`, JSON.stringify(layout, null, 2));
console.log(JSON.stringify(layout, null, 2));

async function scrollToH2(reSrc) {
  return page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const host = window.__deepFind('demo-tables-page');
    const h = [...(host?.shadowRoot?.querySelectorAll('h2') || [])].find(el => re.test(el.textContent || ''));
    if (!h) return { ok: false };
    // Prefer scrolling nearest overflow ancestor across shadow boundaries
    let node = h;
    let scrolledEl = null;
    while (node) {
      if (node instanceof Element) {
        const s = getComputedStyle(node);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && node.scrollHeight > node.clientHeight + 10) {
          node.scrollTop = h.getBoundingClientRect().top - node.getBoundingClientRect().top + node.scrollTop - 12;
          scrolledEl = node.tagName + '.' + (node.className||'');
          break;
        }
      }
      const p = node.parentElement;
      if (p) node = p;
      else node = node.getRootNode?.()?.host || null;
    }
    // Also try common demo shell main
    const app = document.querySelector('demo-app');
    const candidates = [];
    const walk = (root) => {
      for (const el of root.querySelectorAll('*')) {
        const s = getComputedStyle(el);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 20) candidates.push(el);
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    };
    if (app?.shadowRoot) walk(app.shadowRoot);
    for (const el of candidates) {
      el.scrollTop = h.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 12;
    }
    h.scrollIntoView({ block: 'start', inline: 'nearest' });
    return { ok: true, heading: h.textContent.trim(), top: Math.round(h.getBoundingClientRect().top), scrolledEl, candidates: candidates.length };
  }, reSrc);
}

async function clipH2(reSrc, file) {
  const info = await scrollToH2(reSrc);
  await delay(450);
  const box = await page.evaluate((reSrc) => {
    const re = new RegExp(reSrc, 'i');
    const host = window.__deepFind('demo-tables-page');
    const h = [...(host?.shadowRoot?.querySelectorAll('h2') || [])].find(el => re.test(el.textContent || ''));
    if (!h) return null;
    const nodes = [h];
    let n = h.nextElementSibling; let i = 0;
    while (n && i < 2) { nodes.push(n); n = n.nextElementSibling; i++; }
    const rects = nodes.map(el => el.getBoundingClientRect());
    const left = Math.min(...rects.map(r => r.left));
    const top = Math.min(...rects.map(r => r.top));
    const right = Math.max(...rects.map(r => r.right));
    const bottom = Math.max(...rects.map(r => r.bottom));
    // clamp to viewport
    const y = Math.max(0, Math.min(top, 900));
    const height = Math.min(720, Math.max(80, bottom - top + 16));
    return { x: Math.max(0, left - 8), y: Math.max(0, top - 8), width: Math.min(1100, right - left + 16), height };
  }, reSrc);
  if (box && box.width > 40 && box.height > 40 && box.y < 980) {
    await page.screenshot({ path: `${outDir}/${file}`, clip: box });
  } else {
    await page.screenshot({ path: `${outDir}/${file}` });
  }
  console.log(file, JSON.stringify({ info, box }));
  return { info, box };
}

const clips = {};
for (const [re, file] of [
  ['Native — default gray', 'v-native-gray.png'],
  ['striped', 'v-striped.png'],
  ['Interactive', 'v-interactive.png'],
  ['Reorderable', 'v-reorderable.png'],
  ['Grouped', 'v-grouped.png'],
  ['Sortable', 'v-sortable.png'],
  ['Filter', 'v-filter.png'],
  ['Command Center', 'v-cc.png'],
  ['API', 'v-api.png'],
  ['Accessibility', 'v-a11y.png'],
]) {
  clips[file] = await clipH2(re, file);
}
writeFileSync(`${outDir}/v-clips-meta.json`, JSON.stringify(clips, null, 2));

// Also full-page via element screenshot of host if possible
const hostShot = await page.evaluate(() => {
  const host = window.__deepFind('demo-tables-page');
  return host ? { w: host.getBoundingClientRect().width, h: host.getBoundingClientRect().height, scrollH: host.scrollHeight } : null;
});
console.log('hostShot', hostShot);

await browser.close();
