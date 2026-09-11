import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
const art = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

function walkFind(root, sel) {
  const hit = root.querySelector(sel);
  if (hit) return hit;
  for (const el of root.querySelectorAll('*')) {
    if (el.shadowRoot) {
      const n = walkFind(el.shadowRoot, sel);
      if (n) return n;
    }
  }
  return null;
}

async function refMetrics() {
  await page.goto('http://localhost:4321/shell/left-sidebar', { waitUntil: 'networkidle' });
  await delay(400);
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await delay(300);
  const m = await page.evaluate(() => {
    const host = document.querySelector('.cp-sidebar-demo .left-sidebar');
    const sections = [...host.querySelectorAll('.left-sidebar__section')].filter(s => getComputedStyle(s).display !== 'none' && s.getBoundingClientRect().height > 0);
    const nav = host.querySelector('.left-sidebar__nav') || host;
    return {
      navGap: getComputedStyle(nav).gap || getComputedStyle(host).gap,
      hostGap: getComputedStyle(host).gap,
      sections: sections.slice(0,2).map(s => {
        const ss = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), bg: ss.backgroundColor, gap: ss.gap, radius: ss.borderRadius };
      }),
      itemH: Math.round(host.querySelector('.left-sidebar__item').getBoundingClientRect().height),
      itemColor: getComputedStyle(host.querySelector('.left-sidebar__item')).color,
    };
  });
  await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-light-demo.png` });
  const box = await page.locator('.cp-sidebar-demo .left-sidebar').boundingBox();
  await page.mouse.move(box.x + 20, box.y + 40);
  await delay(450);
  const hoverW = await page.evaluate(() => Math.round(document.querySelector('.cp-sidebar-demo .left-sidebar').getBoundingClientRect().width));
  await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-light-hover.png` });
  await page.mouse.move(0,0);
  return { ...m, hoverW };
}

async function convMetrics() {
  await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
  await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
  await delay(800);
  await page.evaluate(() => {
    document.querySelector('demo-app')?.setAttribute('product', 'cp');
    document.documentElement.classList.remove('dark');
  });
  await delay(500);
  const m = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const pageEl = walkFind(document, 'demo-left-sidebar-page');
    const root = pageEl.shadowRoot;
    const h2 = [...root.querySelectorAll('h2')].map(h => h.textContent.trim());
    const consume = root.querySelector('demo-consume-snippets');
    const consumeText = consume ? (consume.shadowRoot?.textContent || consume.textContent || '').slice(0, 500) : null;
    const apiTable = root.querySelector('h2') && [...root.querySelectorAll('h2')].some(h => h.textContent.trim() === 'API');
    const tableRows = [...(root.querySelectorAll('table tbody tr') || [])].map(tr => tr.textContent.trim().replace(/\s+/g,' ').slice(0,120));
    const rail = walkFind(document, '#demo-left-default');
    const density = rail?.getAttribute('data-density');
    const sr = rail.shadowRoot;
    const nav = sr.querySelector('.left-sidebar__nav, nav');
    const sections = [...sr.querySelectorAll('.left-sidebar__section')];
    const npmProp = consume?.npm || consume?.getAttribute?.('npm');
    return {
      h2,
      hasConsume: !!consume,
      consumeText,
      npmHasLeftSidebar: typeof (consume?.npm) === 'string' ? consume.npm.includes('harmony-left-sidebar') : (consumeText||'').includes('harmony-left-sidebar'),
      staticHasLeftSidebar: typeof (consume?.staticZip) === 'string' ? consume.staticZip.includes('harmony-left-sidebar') : (consumeText||'').includes('static') || (consumeText||'').includes('vendor'),
      apiTable,
      tableRows,
      density,
      navGap: getComputedStyle(nav).gap,
      sections: sections.slice(0,2).map(s => {
        const ss = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), bg: ss.backgroundColor, gap: ss.gap, radius: ss.borderRadius, border: ss.borderTopColor, shadow: ss.boxShadow !== 'none' };
      }),
      itemCount: sr.querySelectorAll('.left-sidebar__item').length,
      itemH: Math.round(sr.querySelector('.left-sidebar__item').getBoundingClientRect().height),
      itemColor: getComputedStyle(sr.querySelector('.left-sidebar__item')).color,
      hostW: Math.round(rail.getBoundingClientRect().width),
    };
  });
  // clip first demo
  await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    walkFind(document, 'demo-left-sidebar-page')?.shadowRoot?.querySelector('.sidebar-demo')?.scrollIntoView({ block: 'center' });
  });
  await delay(200);
  const clip = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const demo = walkFind(document, 'demo-left-sidebar-page').shadowRoot.querySelector('.sidebar-demo');
    const r = demo.getBoundingClientRect();
    return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(r.width,1200), height: Math.min(r.height, 520) };
  });
  await page.screenshot({ path: `${art}/conv-light-demo.png`, clip });
  const hb = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const r = walkFind(document, '#demo-left-default').getBoundingClientRect();
    return { x: r.x+15, y: r.y+40 };
  });
  await page.mouse.move(hb.x, hb.y);
  await delay(450);
  const clip2 = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const demo = walkFind(document, 'demo-left-sidebar-page').shadowRoot.querySelector('.sidebar-demo');
    const r = demo.getBoundingClientRect();
    return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(r.width,1200), height: Math.min(r.height, 520) };
  });
  await page.screenshot({ path: `${art}/conv-light-hover.png`, clip: clip2 });
  const hoverW = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    return Math.round(walkFind(document, '#demo-left-default').getBoundingClientRect().width);
  });
  // select event + snippets rendered text
  await page.mouse.move(0,0);
  await delay(200);
  const more = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const pageEl = walkFind(document, 'demo-left-sidebar-page');
    const rail = pageEl.shadowRoot.querySelector('#demo-left-default');
    const btn = rail.shadowRoot.querySelector('.left-sidebar__item');
    btn.click();
    const out = pageEl.shadowRoot.querySelector('#demo-select-out')?.textContent?.trim();
    const consume = pageEl.shadowRoot.querySelector('demo-consume-snippets');
    const headings = [...(consume?.shadowRoot?.querySelectorAll('.heading, h2, h3') || [])].map(h => h.textContent.trim());
    const codes = [...(consume?.shadowRoot?.querySelectorAll('pre, code, demo-import-snippet') || [])].map(c => (c.textContent||'').slice(0,80));
    // try pierce demo-import-snippet
    const snippets = [];
    if (consume?.shadowRoot) {
      for (const el of consume.shadowRoot.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const t = el.shadowRoot.textContent || '';
          if (t.includes('harmony-left-sidebar') || t.includes('vendor/harmony')) snippets.push(t.slice(0,200));
        }
      }
    }
    return { out, headings, codes, snippets, npm: consume?.npm?.slice?.(0,180), staticZip: consume?.staticZip?.slice?.(0,180) };
  });
  // dark quick
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await delay(300);
  const dark = await page.evaluate(() => {
    function walkFind(root, sel) {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    }
    const rail = walkFind(document, '#demo-left-default');
    const sec = rail.shadowRoot.querySelector('.left-sidebar__section');
    const ss = getComputedStyle(sec);
    return { bg: ss.backgroundColor, itemColor: getComputedStyle(rail.shadowRoot.querySelector('.left-sidebar__item')).color };
  });
  await page.screenshot({ path: `${art}/conv-dark-top.png`, fullPage: false });
  return { ...m, hoverW, more, dark };
}

const ref = await refMetrics();
const conv = await convMetrics();
const out = { ref, conv };
writeFileSync(`${art}/reverify.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
