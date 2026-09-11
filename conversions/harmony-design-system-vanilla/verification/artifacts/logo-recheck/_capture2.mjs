import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const outDir = 'conversions/harmony-design-system-vanilla/verification/artifacts/logo-recheck';
const browser = await chromium.launch({ headless: true });

function deepQuery(root, selector) {
  const hit = root.querySelector?.(selector);
  if (hit) return hit;
  const all = root.querySelectorAll?.('*') || [];
  for (const el of all) {
    if (el.shadowRoot) {
      const n = deepQuery(el.shadowRoot, selector);
      if (n) return n;
    }
  }
  return null;
}

async function capture(role, url) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  await page.addInitScript(() => {
    localStorage.setItem('harmony-demo-product', 'cp');
    localStorage.setItem('harmony-color-scheme', 'light');
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    const html = document.documentElement;
    [...html.classList].forEach((c) => {
      if (c.startsWith('theme-') || c === 'dark') html.classList.remove(c);
    });
    html.classList.add('theme-cp');
    html.classList.remove('dark');
    document.querySelector('demo-app')?.setAttribute('product', 'cp');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const html = document.documentElement;
    [...html.classList].forEach((c) => {
      if (c.startsWith('theme-') || c === 'dark') html.classList.remove(c);
    });
    html.classList.add('theme-cp');
    html.classList.remove('dark');
    document.querySelector('demo-app')?.setAttribute('product', 'cp');
  });
  await delay(1200);

  const probe = await page.evaluate(() => {
    const results = [];
    const walk = (node, path) => {
      if (!node) return;
      if (node.nodeType === 1) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'svg') {
          const r = node.getBoundingClientRect();
          const html = node.outerHTML;
          results.push({
            path,
            w: Math.round(r.width),
            h: Math.round(r.height),
            top: Math.round(r.top),
            left: Math.round(r.left),
            viewBox: node.getAttribute('viewBox'),
            fills: [...node.querySelectorAll('path,circle,rect')].slice(0, 8).map((p) => p.getAttribute('fill')),
            has4C92: html.includes('4C92D9'),
            hasClip: html.includes('clipPath') || html.includes('clip-path'),
            clipRectWH: [...node.querySelectorAll('clipPath rect, defs clipPath rect')].map((re) => [re.getAttribute('width'), re.getAttribute('height')]),
            sample: html.replace(/\s+/g, ' ').slice(0, 220),
            parentClass: node.parentElement?.className || node.parentElement?.tagName,
          });
        }
        if (tag === 'img' || tag === 'harmony-icon') {
          const r = node.getBoundingClientRect();
          results.push({
            path,
            kind: tag,
            w: Math.round(r.width),
            h: Math.round(r.height),
            top: Math.round(r.top),
            left: Math.round(r.left),
            src: node.getAttribute?.('src') || node.getAttribute?.('name'),
            className: node.className?.toString?.() || '',
          });
        }
        for (const child of node.children || []) walk(child, path + '>' + child.tagName.toLowerCase());
        if (node.shadowRoot) walk(node.shadowRoot, path + '::shadow');
      } else if (node.nodeType === 11) {
        for (const child of node.children || []) walk(child, path + '>' + child.tagName.toLowerCase());
      }
    };
    walk(document.documentElement, 'html');

    const headers = [];
    const walkH = (node, path) => {
      if (!node || node.nodeType !== 1) {
        if (node?.nodeType === 11) for (const c of node.children) walkH(c, path);
        return;
      }
      const tag = node.tagName.toLowerCase();
      if (tag.includes('shell-header') || tag === 'header' || (node.className && String(node.className).includes('shell-header'))) {
        const r = node.getBoundingClientRect();
        headers.push({
          path: path + '>' + tag,
          tag,
          className: String(node.className || ''),
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          left: Math.round(r.left),
          htmlSample: node.innerHTML?.replace(/\s+/g, ' ').slice(0, 400),
        });
      }
      for (const c of node.children) walkH(c, path + '>' + tag);
      if (node.shadowRoot) walkH(node.shadowRoot, path + '>' + tag + '::shadow');
    };
    walkH(document.documentElement, 'html');

    const logoish = results.filter(
      (x) =>
        x.has4C92 ||
        x.viewBox === '0 0 36 36' ||
        (x.sample && x.sample.includes('clip0')) ||
        (x.src && /logo|CPVP|product/i.test(String(x.src))) ||
        (x.className && /logo/i.test(x.className)) ||
        (x.parentClass && /logo/i.test(String(x.parentClass))),
    );

    return {
      theme: [...document.documentElement.classList],
      svgCount: results.filter((r) => !r.kind).length,
      logoish,
      headers: headers.slice(0, 8),
      allSmallSvgs: results.filter((r) => !r.kind && r.w > 0 && r.w <= 48 && r.h <= 48).slice(0, 20),
    };
  });

  writeFileSync(`${outDir}/${role}-deep.json`, JSON.stringify(probe, null, 2));
  console.log(role, 'logoish', probe.logoish.length, 'headers', probe.headers.length, 'smallSvgs', probe.allSmallSvgs.length);

  // screenshot first demo header if found
  const h = probe.headers.find((x) => x.h > 40 && x.h < 120) || probe.headers[0];
  if (h) {
    await page.screenshot({
      path: `${outDir}/${role}-first-header.png`,
      clip: {
        x: Math.max(0, h.left),
        y: Math.max(0, h.top),
        width: Math.min(900, Math.max(100, h.w)),
        height: Math.min(100, Math.max(40, h.h + 4)),
      },
    });
  }

  // scroll to Costpoint in page and screenshot region
  await page.evaluate(() => {
    const walk = (root) => {
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) walk(el.shadowRoot);
        if ((el.textContent || '').trim() === 'Costpoint' && el.children.length === 0) {
          el.scrollIntoView({ block: 'center' });
          return true;
        }
      }
      return false;
    };
    walk(document);
  });
  await delay(400);
  await page.screenshot({ path: `${outDir}/${role}-near-costpoint.png`, fullPage: false });

  // For converted, also try harmony-shell-header shadow
  const logoBox = await page.evaluate(() => {
    const find = (root) => {
      for (const el of root.querySelectorAll('harmony-shell-header, .shell-header, [class*=shell-header]')) {
        const sr = el.shadowRoot || el;
        const svg = sr.querySelector?.('svg') || el.querySelector?.('svg');
        if (svg) {
          const r = svg.getBoundingClientRect();
          return {
            found: true,
            w: r.width,
            h: r.height,
            top: r.top,
            left: r.left,
            html: svg.outerHTML.slice(0, 500),
            fills: [...svg.querySelectorAll('path')].slice(0, 4).map((p) => p.getAttribute('fill')),
          };
        }
        // product logo slot/part
        const logo = sr.querySelector?.('[part=product-logo], .shell-header__product-logo, .product-logo, [class*=product-logo]');
        if (logo) {
          const r = logo.getBoundingClientRect();
          return { found: true, kind: 'container', w: r.width, h: r.height, top: r.top, left: r.left, html: logo.innerHTML.slice(0, 500) };
        }
      }
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const n = find(el.shadowRoot);
          if (n) return n;
        }
      }
      return null;
    };
    return find(document);
  });
  console.log(role, 'logoBox', JSON.stringify(logoBox, null, 2));
  if (logoBox?.found && logoBox.w > 0) {
    await page.screenshot({
      path: `${outDir}/${role}-logo-box.png`,
      clip: {
        x: Math.max(0, logoBox.left - 20),
        y: Math.max(0, logoBox.top - 10),
        width: Math.min(400, logoBox.w + 200),
        height: Math.min(80, logoBox.h + 30),
      },
    });
  }

  await page.close();
}

await capture('ref', 'http://localhost:4321/shell/header');
await capture('conv', 'http://localhost:5178/shell/header');
await browser.close();
console.log('done');
