import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
const art = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

async function refMode(mode) {
  await page.goto('http://localhost:4321/shell/left-sidebar', { waitUntil: 'networkidle' });
  await delay(400);
  await page.evaluate((mode) => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, mode);
  await delay(400);
  const metrics = await page.evaluate(() => {
    const host = document.querySelector('.cp-sidebar-demo .left-sidebar');
    const sections = [...host.querySelectorAll('.left-sidebar__section')];
    // only visible CP sections - filter by visibility
    const vis = sections.filter(s => getComputedStyle(s).display !== 'none' && s.getBoundingClientRect().height > 0);
    return {
      htmlDark: document.documentElement.classList.contains('dark'),
      sectionCount: vis.length,
      sections: vis.map(s => {
        const ss = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        return {
          w: Math.round(r.width), h: Math.round(r.height),
          bg: ss.backgroundColor, radius: ss.borderRadius, shadow: ss.boxShadow.slice(0,100),
          border: `${ss.borderTopWidth} ${ss.borderRightColor}`,
          margin: ss.margin, gapParent: getComputedStyle(s.parentElement).gap,
        };
      }),
      navGap: getComputedStyle(host.querySelector('.left-sidebar__nav') || host).gap,
      itemColor: getComputedStyle(host.querySelector('.left-sidebar__item')).color,
      itemH: Math.round(host.querySelector('.left-sidebar__item').getBoundingClientRect().height),
    };
  });
  await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-${mode}-demo.png` });
  // hover
  const box = await page.locator('.cp-sidebar-demo .left-sidebar').boundingBox();
  await page.mouse.move(box.x + 20, box.y + 40);
  await delay(450);
  await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-${mode}-hover.png` });
  const hoverW = await page.evaluate(() => Math.round(document.querySelector('.cp-sidebar-demo .left-sidebar').getBoundingClientRect().width));
  await page.mouse.move(0,0);
  await delay(300);
  return { ...metrics, hoverW };
}

async function convMode(mode, product = 'cp') {
  await page.addInitScript((p) => localStorage.setItem('harmony-demo-product', p), product);
  await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
  await delay(600);
  await page.evaluate(({ mode, product }) => {
    document.querySelector('demo-app')?.setAttribute('product', product);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, { mode, product });
  await delay(500);
  const metrics = await page.evaluate(() => {
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
    const sr = rail.shadowRoot;
    const sections = [...sr.querySelectorAll('.left-sidebar__section')];
    const nav = sr.querySelector('.left-sidebar__nav, nav');
    return {
      htmlDark: document.documentElement.classList.contains('dark'),
      sectionCount: sections.length,
      sections: sections.map(s => {
        const ss = getComputedStyle(s);
        const r = s.getBoundingClientRect();
        return {
          w: Math.round(r.width), h: Math.round(r.height),
          bg: ss.backgroundColor, radius: ss.borderRadius, shadow: ss.boxShadow.slice(0,100),
          border: `${ss.borderTopWidth} ${ss.borderRightColor}`,
          margin: ss.margin,
        };
      }),
      navGap: getComputedStyle(nav).gap,
      itemColor: getComputedStyle(sr.querySelector('.left-sidebar__item')).color,
      itemH: Math.round(sr.querySelector('.left-sidebar__item').getBoundingClientRect().height),
      hostW: Math.round(rail.getBoundingClientRect().width),
    };
  });
  // clip first demo
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
    const pageEl = walkFind(document, 'demo-left-sidebar-page');
    const demo = pageEl.shadowRoot.querySelector('.sidebar-demo');
    demo.scrollIntoView({ block: 'center' });
    const r = demo.getBoundingClientRect();
    return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(r.width,1200), height: Math.min(r.height, 520) };
  });
  await delay(200);
  await page.screenshot({ path: `${art}/conv-${mode}-demo.png`, clip });
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
    const pageEl = walkFind(document, 'demo-left-sidebar-page');
    const demo = pageEl.shadowRoot.querySelector('.sidebar-demo');
    const r = demo.getBoundingClientRect();
    return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(r.width,1200), height: Math.min(r.height, 520) };
  });
  await page.screenshot({ path: `${art}/conv-${mode}-hover.png`, clip: clip2 });
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
  await page.mouse.move(0,0);
  return { ...metrics, hoverW };
}

const refLight = await refMode('light');
const refDark = await refMode('dark');
const convLight = await convMode('light');
const convDark = await convMode('dark');

const out = { refLight, refDark, convLight, convDark };
writeFileSync(`${art}/mode-compare.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
