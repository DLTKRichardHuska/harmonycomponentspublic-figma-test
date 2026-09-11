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

async function captureRef() {
  await page.goto('http://localhost:4321/shell/left-sidebar', { waitUntil: 'networkidle', timeout: 60000 });
  await delay(800);
  await page.screenshot({ path: `${art}/ref-full.png`, fullPage: true });
  await page.screenshot({ path: `${art}/ref-top.png`, fullPage: false });

  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const desc = document.querySelector('.page-header__description')?.textContent?.trim();
    const badges = [...document.querySelectorAll('.page-header .badge, header .badge')].map(b => b.textContent.trim());
    const h2 = [...document.querySelectorAll('h2')].map(h => h.textContent.trim());
    const h3 = [...document.querySelectorAll('h3')].map(h => h.textContent.trim());
    const sidebar = document.querySelector('.left-sidebar, [class*="left-sidebar"], aside.left-sidebar, nav.left-sidebar')
      || document.querySelector('.cp-sidebar-demo__sidebar > *');
    const s = sidebar ? getComputedStyle(sidebar) : null;
    const r = sidebar?.getBoundingClientRect();
    const items = sidebar ? [...sidebar.querySelectorAll('button, a, [role="button"], .left-sidebar__item')].map(el => ({
      text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80),
      title: el.getAttribute('title'),
      active: el.classList.contains('is-active') || el.getAttribute('aria-current') === 'page',
      w: Math.round(el.getBoundingClientRect().width),
      h: Math.round(el.getBoundingClientRect().height),
    })) : [];
    const icons = sidebar ? sidebar.querySelectorAll('svg, img, .icon, [class*="icon"]').length : 0;
    const demoBox = document.querySelector('.cp-sidebar-demo');
    const demor = demoBox?.getBoundingClientRect();
    return {
      h1, desc: desc?.slice(0, 300), badges, h2, h3,
      sidebar: sidebar ? {
        tag: sidebar.tagName,
        className: sidebar.className?.toString?.()?.slice(0, 120),
        w: Math.round(r.width), h: Math.round(r.height),
        bg: s.backgroundColor, borderRadius: s.borderRadius, boxShadow: s.boxShadow,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        position: s.position, left: s.left, top: s.top,
      } : null,
      itemCount: items.length,
      items: items.slice(0, 20),
      icons,
      demo: demor ? { w: Math.round(demor.width), h: Math.round(demor.height) } : null,
      bodyTextSample: (document.body.innerText || '').slice(0, 2500),
    };
  });

  // Hover expand
  const hoverInfo = await page.evaluate(async () => {
    const sidebar = document.querySelector('.cp-sidebar-demo__sidebar > *') || document.querySelector('.left-sidebar');
    if (!sidebar) return null;
    const before = Math.round(sidebar.getBoundingClientRect().width);
    sidebar.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await new Promise(r => setTimeout(r, 350));
    const afterHover = Math.round(sidebar.getBoundingClientRect().width);
    const expandedClass = sidebar.className;
    sidebar.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await new Promise(r => setTimeout(r, 350));
    const afterLeave = Math.round(sidebar.getBoundingClientRect().width);
    return { before, afterHover, afterLeave, className: String(expandedClass).slice(0, 160) };
  });

  // Clip demo region
  const demo = page.locator('.cp-sidebar-demo');
  if (await demo.count()) {
    await demo.screenshot({ path: `${art}/ref-demo.png` });
  }

  writeFileSync(`${art}/ref-data.json`, JSON.stringify({ ...data, hover: hoverInfo }, null, 2));
  console.log('REF', JSON.stringify({ h1: data.h1, h2: data.h2, items: data.itemCount, sidebar: data.sidebar, hover: hoverInfo }, null, 2));
}

async function captureConv() {
  await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
  await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle', timeout: 60000 });
  await delay(1000);
  await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    if (app) app.setAttribute('product', 'cp');
  });
  await delay(500);
  await page.screenshot({ path: `${art}/conv-full.png`, fullPage: true });
  await page.screenshot({ path: `${art}/conv-top.png`, fullPage: false });

  const data = await page.evaluate(() => {
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
    const root = pageEl?.shadowRoot || pageEl;
    const h1 = root?.querySelector('h1, demo-page-header')?.textContent?.trim()
      || walkFind(document, 'demo-page-header')?.shadowRoot?.textContent?.trim();
    const header = walkFind(document, 'demo-page-header');
    const headerText = header ? (header.shadowRoot?.textContent || header.textContent || '').trim().slice(0, 400) : null;
    const h2 = root ? [...root.querySelectorAll('h2')].map(h => h.textContent.trim()) : [];
    const rails = root ? [...root.querySelectorAll('harmony-left-sidebar')] : [];
    const railInfos = rails.map((rail, i) => {
      const host = getComputedStyle(rail);
      const r = rail.getBoundingClientRect();
      const sr = rail.shadowRoot;
      const nav = sr?.querySelector('nav, .left-sidebar, [part="nav"], aside') || sr?.firstElementChild;
      const ns = nav ? getComputedStyle(nav) : null;
      const nr = nav?.getBoundingClientRect();
      const items = sr ? [...sr.querySelectorAll('button, a, [part="item"], .left-sidebar__item, [role="button"]')].map(el => ({
        text: (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim().slice(0, 80),
        active: el.classList.contains('is-active') || el.getAttribute('aria-current') === 'page' || el.getAttribute('aria-pressed') === 'true',
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
      })) : [];
      return {
        i,
        attrs: {
          inline: rail.hasAttribute('inline'),
          expanded: rail.hasAttribute('expanded'),
          panelOpen: rail.hasAttribute('panel-open'),
          activeId: rail.getAttribute('active-id'),
        },
        host: { w: Math.round(r.width), h: Math.round(r.height), display: host.display },
        nav: nav ? {
          tag: nav.tagName,
          className: nav.className?.toString?.()?.slice(0, 120),
          w: Math.round(nr.width), h: Math.round(nr.height),
          bg: ns.backgroundColor, borderRadius: ns.borderRadius, boxShadow: ns.boxShadow,
          border: `${ns.borderTopWidth} ${ns.borderTopStyle} ${ns.borderTopColor}`,
        } : null,
        itemCount: items.length,
        items: items.slice(0, 20),
        icons: sr ? sr.querySelectorAll('svg').length : 0,
      };
    });
    const bodyText = root ? (root.textContent || '').slice(0, 2500) : '';
    const snippets = !!walkFind(document, 'demo-consume-snippets');
    return { headerText, h2, railCount: rails.length, rails: railInfos, bodyText, snippets };
  });

  // Hover first default rail
  const hoverInfo = await page.evaluate(async () => {
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
    const rail = walkFind(document, '#demo-left-default') || walkFind(document, 'harmony-left-sidebar');
    if (!rail) return null;
    const nav = rail.shadowRoot?.querySelector('nav, .left-sidebar, [part="nav"], aside') || rail.shadowRoot?.firstElementChild || rail;
    const before = Math.round(nav.getBoundingClientRect().width);
    rail.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    nav.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    const afterHover = Math.round(nav.getBoundingClientRect().width);
    const labels = [...(rail.shadowRoot?.querySelectorAll('[part="label"], .left-sidebar__label') || [])]
      .map(l => ({ text: l.textContent.trim(), opacity: getComputedStyle(l).opacity, visibility: getComputedStyle(l).visibility }));
    rail.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    nav.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    const afterLeave = Math.round(nav.getBoundingClientRect().width);
    return { before, afterHover, afterLeave, labels: labels.slice(0, 5) };
  });

  // Clip first demo
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
    const demo = pageEl?.shadowRoot?.querySelector('.sidebar-demo');
    if (!demo) return null;
    const r = demo.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (clip && clip.width > 0) {
    await page.screenshot({ path: `${art}/conv-demo.png`, clip: { x: Math.max(0, clip.x), y: Math.max(0, clip.y), width: Math.min(clip.width, 1200), height: Math.min(clip.height, 800) } });
  }

  // Click select event
  const selectInfo = await page.evaluate(async () => {
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
    const out = pageEl?.shadowRoot?.querySelector('#demo-select-out');
    const rail = pageEl?.shadowRoot?.querySelector('#demo-left-default');
    const btn = rail?.shadowRoot?.querySelector('button, [part="item"]');
    if (!btn) return { error: 'no button' };
    btn.click();
    await new Promise(r => setTimeout(r, 100));
    return { out: out?.textContent?.trim(), active: btn.className };
  });

  // Forced colors smoke on default rail
  await page.emulateMedia({ forcedColors: 'active' });
  await delay(300);
  const hc = await page.evaluate(() => {
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
    const rail = walkFind(document, '#demo-left-default') || walkFind(document, 'harmony-left-sidebar');
    const nav = rail?.shadowRoot?.querySelector('nav, .left-sidebar, [part="nav"]') || rail?.shadowRoot?.firstElementChild;
    const item = rail?.shadowRoot?.querySelector('button, [part="item"]');
    const ns = nav ? getComputedStyle(nav) : null;
    const is = item ? getComputedStyle(item) : null;
    item?.focus();
    const focusOutline = item ? getComputedStyle(item).outline : null;
    return {
      navBg: ns?.backgroundColor, navBorder: ns ? `${ns.borderTopWidth} ${ns.borderTopColor}` : null,
      itemColor: is?.color, itemBorder: is ? `${is.borderTopWidth} ${is.borderTopColor}` : null,
      outline: focusOutline, forcedColors: matchMedia('(forced-colors: active)').matches,
    };
  });
  await page.screenshot({ path: `${art}/conv-hc.png`, fullPage: false });
  await page.emulateMedia({ forcedColors: 'none' });

  // Dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await delay(400);
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
    const rail = walkFind(document, '#demo-left-default') || walkFind(document, 'harmony-left-sidebar');
    const nav = rail?.shadowRoot?.querySelector('nav, .left-sidebar, [part="nav"]') || rail?.shadowRoot?.firstElementChild;
    const ns = nav ? getComputedStyle(nav) : null;
    return { bg: ns?.backgroundColor, shadow: ns?.boxShadow, color: ns?.color };
  });
  await page.screenshot({ path: `${art}/conv-dark.png`, fullPage: false });

  writeFileSync(`${art}/conv-data.json`, JSON.stringify({ ...data, hover: hoverInfo, selectInfo, hc, dark }, null, 2));
  console.log('CONV', JSON.stringify({ h2: data.h2, rails: data.rails.map(r => ({ attrs: r.attrs, itemCount: r.itemCount, nav: r.nav, items: r.items.slice(0,4) })), hover: hoverInfo, selectInfo, hc, dark }, null, 2));
}

await captureRef();
await captureConv();
await browser.close();
console.log('done');
