import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const art = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

function pierce(page, js) {
  return page.evaluate(js);
}

// ---- REF deeper ----
await page.goto('http://localhost:4321/shell/left-sidebar', { waitUntil: 'networkidle' });
await delay(600);

const refDeep = await page.evaluate(() => {
  const title = document.querySelector('.page-header__title')?.textContent?.trim();
  const badges = [...document.querySelectorAll('.page-header .badge')].map(b => b.textContent.trim());
  const desc = document.querySelector('.page-header__description')?.textContent?.trim();
  const demo = document.querySelector('.cp-sidebar-demo');
  const host = demo?.querySelector('.left-sidebar');
  const cs = host ? getComputedStyle(host) : null;
  const r = host?.getBoundingClientRect();
  // Find the element that actually has the bg/shadow
  const candidates = host ? [host, ...host.querySelectorAll('*')].slice(0, 40) : [];
  const chrome = candidates.map(el => {
    const s = getComputedStyle(el);
    const rr = el.getBoundingClientRect();
    return {
      tag: el.tagName, cls: String(el.className).slice(0, 80),
      w: Math.round(rr.width), h: Math.round(rr.height),
      bg: s.backgroundColor, radius: s.borderRadius, shadow: s.boxShadow !== 'none',
      shadowVal: s.boxShadow.slice(0, 80),
      border: `${s.borderTopWidth}/${s.borderRightWidth} ${s.borderTopColor}`,
      pos: s.position,
    };
  }).filter(x => x.bg !== 'rgba(0, 0, 0, 0)' || x.shadow || x.radius !== '0px' || parseFloat(x.border) > 0);

  const items = host ? [...host.querySelectorAll('.left-sidebar__item')].map(el => {
    const label = el.querySelector('.left-sidebar__label')?.textContent?.trim();
    const icon = el.querySelector('svg, img');
    const is = getComputedStyle(el);
    return {
      label,
      active: el.classList.contains('left-sidebar__item--active') || el.hasAttribute('data-active'),
      w: Math.round(el.getBoundingClientRect().width),
      h: Math.round(el.getBoundingClientRect().height),
      color: is.color,
      hasIcon: !!icon,
    };
  }) : [];

  const sections = host ? [...host.querySelectorAll('.left-sidebar__section')].map((sec, i) => ({
    i, itemCount: sec.querySelectorAll('.left-sidebar__item').length
  })) : [];

  return { title, badges, desc: desc?.slice(0,200), host: host ? { w: Math.round(r.width), h: Math.round(r.height), cls: host.className, bg: cs.backgroundColor, radius: cs.borderRadius, shadow: cs.boxShadow, border: cs.border } : null, chrome, itemCount: items.length, items, sections };
});

// real hover via mouse
const refBox = await page.locator('.cp-sidebar-demo .left-sidebar').boundingBox();
if (refBox) {
  await page.mouse.move(refBox.x + 20, refBox.y + 40);
  await delay(500);
  await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-demo-hover.png` });
  const hoverW = await page.evaluate(() => {
    const host = document.querySelector('.cp-sidebar-demo .left-sidebar');
    const label = host?.querySelector('.left-sidebar__label');
    const ls = label ? getComputedStyle(label) : null;
    return {
      w: Math.round(host.getBoundingClientRect().width),
      expanded: host.classList.contains('left-sidebar--expanded') || host.matches(':hover'),
      labelOpacity: ls?.opacity, labelVis: ls?.visibility, labelW: label ? Math.round(label.getBoundingClientRect().width) : null,
      labelText: label?.textContent?.trim(),
    };
  });
  writeFileSync(`${art}/ref-hover.json`, JSON.stringify(hoverW, null, 2));
  console.log('REF HOVER', hoverW);
  await page.mouse.move(0, 0);
  await delay(400);
}
await page.locator('.cp-sidebar-demo').screenshot({ path: `${art}/ref-demo-collapsed.png` });
writeFileSync(`${art}/ref-deep.json`, JSON.stringify(refDeep, null, 2));
console.log('REF DEEP', JSON.stringify({ title: refDeep.title, badges: refDeep.badges, sections: refDeep.sections, itemCount: refDeep.itemCount, host: refDeep.host, chrome: refDeep.chrome.slice(0,8), items: refDeep.items.slice(0,6) }, null, 2));

// ---- CONV deeper ----
await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/shell/left-sidebar', { waitUntil: 'networkidle' });
await delay(800);
await page.evaluate(() => document.querySelector('demo-app')?.setAttribute('product', 'cp'));
await delay(400);

const convDeep = await page.evaluate(() => {
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
  const header = walkFind(document, 'demo-page-header');
  const headerInfo = {
    title: header?.getAttribute('title') || header?.shadowRoot?.querySelector('h1')?.textContent?.trim(),
    text: (header?.shadowRoot?.textContent || header?.textContent || '').trim().slice(0, 350),
  };
  const rails = [...(pageEl?.shadowRoot?.querySelectorAll('harmony-left-sidebar') || [])];
  const analyze = (rail) => {
    const hostS = getComputedStyle(rail);
    const hr = rail.getBoundingClientRect();
    const sr = rail.shadowRoot;
    const all = sr ? [rail, ...sr.querySelectorAll('*')].slice(0, 60) : [rail];
    const chrome = all.map(el => {
      const s = getComputedStyle(el);
      const rr = el.getBoundingClientRect();
      return {
        tag: el.tagName, cls: String(el.className || el.getAttribute('part') || '').slice(0, 80),
        part: el.getAttribute?.('part'),
        w: Math.round(rr.width), h: Math.round(rr.height),
        bg: s.backgroundColor, radius: s.borderRadius, shadow: s.boxShadow !== 'none',
        shadowVal: s.boxShadow.slice(0, 90),
        border: `${s.borderTopWidth}/${s.borderRightWidth} ${s.borderRightColor}`,
      };
    }).filter(x => (x.bg && x.bg !== 'rgba(0, 0, 0, 0)' && x.bg !== 'rgba(255, 255, 255, 0)') || x.shadow || (x.radius && x.radius !== '0px'));

    const items = sr ? [...sr.querySelectorAll('.left-sidebar__item, [part="item"]')].map(el => {
      const label = el.querySelector('.left-sidebar__label, [part="label"]')?.textContent?.trim();
      const is = getComputedStyle(el);
      return {
        label,
        classes: el.className,
        activeClass: /active/.test(el.className),
        ariaCurrent: el.getAttribute('aria-current'),
        dataActive: el.getAttribute('data-active'),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
        color: is.color,
        bg: is.backgroundColor,
      };
    }) : [];
    const sections = sr ? [...sr.querySelectorAll('.left-sidebar__section, [part="section"]')].map((sec, i) => ({
      i, itemCount: sec.querySelectorAll('.left-sidebar__item, [part="item"]').length
    })) : [];
    return {
      attrs: Object.fromEntries([...rail.attributes].map(a => [a.name, a.value])),
      host: { w: Math.round(hr.width), h: Math.round(hr.height), bg: hostS.backgroundColor, radius: hostS.borderRadius, shadow: hostS.boxShadow, display: hostS.display },
      chrome, sections, itemCount: items.length, items,
    };
  };
  return { headerInfo, h2: [...(pageEl?.shadowRoot?.querySelectorAll('h2') || [])].map(h => h.textContent.trim()), rails: rails.map(analyze), hasSnippets: !!walkFind(document, 'demo-consume-snippets') };
});

// hover default rail with mouse
const hoverBox = await page.evaluate(() => {
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
  const r = rail.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
if (hoverBox) {
  await page.mouse.move(hoverBox.x + 20, hoverBox.y + 40);
  await delay(500);
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
    const rail = walkFind(document, '#demo-left-default');
    const label = rail.shadowRoot?.querySelector('.left-sidebar__label, [part="label"]');
    const ls = label ? getComputedStyle(label) : null;
    const hostS = getComputedStyle(rail);
    return {
      hostW: Math.round(rail.getBoundingClientRect().width),
      hostShadow: hostS.boxShadow,
      hostBg: hostS.backgroundColor,
      hostRadius: hostS.borderRadius,
      labelOpacity: ls?.opacity, labelVis: ls?.visibility,
      labelW: label ? Math.round(label.getBoundingClientRect().width) : null,
      labelText: label?.textContent?.trim(),
    };
  });
  // screenshot first demo
  const demoClip = await page.evaluate(() => {
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
    return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 700) };
  });
  await page.screenshot({ path: `${art}/conv-demo-hover.png`, clip: demoClip });
  writeFileSync(`${art}/conv-hover.json`, JSON.stringify(hoverW, null, 2));
  console.log('CONV HOVER', hoverW);
  await page.mouse.move(0, 0);
  await delay(400);
}

// expanded rail clip
const expClip = await page.evaluate(() => {
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
  const demos = [...pageEl.shadowRoot.querySelectorAll('.sidebar-demo')];
  const r = demos[1].getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 700) };
});
await page.screenshot({ path: `${art}/conv-demo-expanded.png`, clip: expClip });

// custom active check
const customActive = await page.evaluate(() => {
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
  const custom = walkFind(document, '#demo-left-custom');
  const items = [...(custom.shadowRoot?.querySelectorAll('.left-sidebar__item') || [])].map(el => ({
    label: el.querySelector('.left-sidebar__label')?.textContent?.trim(),
    className: el.className,
    aria: el.getAttribute('aria-current'),
    bg: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
  }));
  const panel = walkFind(document, 'harmony-left-sidebar[panel-open]');
  const pitems = [...(panel?.shadowRoot?.querySelectorAll('.left-sidebar__item') || [])].map(el => ({
    label: el.querySelector('.left-sidebar__label')?.textContent?.trim(),
    className: el.className,
    aria: el.getAttribute('aria-current'),
    dataActive: el.hasAttribute('data-active'),
    bg: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
  }));
  return { custom: items, panel: pitems.slice(0, 3) };
});

// VP product switch
await page.evaluate(() => document.querySelector('demo-app')?.setAttribute('product', 'vp'));
await delay(600);
const vpItems = await page.evaluate(() => {
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
  // may need re-render - check item labels
  return [...(rail?.shadowRoot?.querySelectorAll('.left-sidebar__item') || [])].map(el =>
    el.querySelector('.left-sidebar__label')?.textContent?.trim()
  );
});
await page.screenshot({ path: `${art}/conv-vp-top.png`, fullPage: false });

writeFileSync(`${art}/conv-deep.json`, JSON.stringify({ ...convDeep, customActive, vpItems }, null, 2));
console.log('CONV DEEP', JSON.stringify({
  header: convDeep.headerInfo,
  h2: convDeep.h2,
  rail0: { sections: convDeep.rails[0]?.sections, itemCount: convDeep.rails[0]?.itemCount, host: convDeep.rails[0]?.host, chrome: convDeep.rails[0]?.chrome?.slice(0,8), items: convDeep.rails[0]?.items?.slice(0,5) },
  rail1: { host: convDeep.rails[1]?.host, chrome: convDeep.rails[1]?.chrome?.slice(0,6), items: convDeep.rails[1]?.items?.slice(0,3) },
  customActive, vpItems, hasSnippets: convDeep.hasSnippets
}, null, 2));

await browser.close();
