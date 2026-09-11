import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pwPath = require.resolve('playwright');
console.log('playwright', pwPath);

const outDir = 'c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/shell-header-logo-reverify';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function probe(url, label, isVanilla) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await delay(1000);
  if (isVanilla) {
    await page.evaluate(() => {
      const app = document.querySelector('demo-app');
      if (app) {
        app.product = 'cp';
        localStorage.setItem('harmony-demo-product', 'cp');
      }
      document.documentElement.classList.remove('theme-cp','theme-vp','theme-ppm','theme-maconomy','dark');
      document.documentElement.classList.add('theme-cp');
      localStorage.setItem('harmony-color-scheme', 'light');
    });
  } else {
    await page.evaluate(() => {
      document.documentElement.classList.remove('theme-cp','theme-vp','theme-ppm','theme-maconomy','dark');
      document.documentElement.classList.add('theme-cp');
      const sel = document.querySelector('#product-select');
      if (sel) {
        sel.value = 'cp';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }
  await delay(1200);

  const data = await page.evaluate(() => {
    function walk(root, fn) {
      fn(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, fn);
      });
    }
    const logos = [];
    walk(document, (root) => {
      root.querySelectorAll('harmony-shell-header').forEach((el) => {
        const r = el.getBoundingClientRect();
        const svg = el.shadowRoot?.querySelector('svg');
        const nameEl = el.shadowRoot?.querySelector('.header__title, .header__product-name, [class*=product], .product-name');
        const brand = el.shadowRoot?.querySelector('.header__brand, .brand, .header__logo');
        const fills = svg ? [...svg.querySelectorAll('[fill]')].map((n) => n.getAttribute('fill')) : [];
        const clipRect = svg?.querySelector('clipPath rect');
        logos.push({
          type: 'ce',
          productAttr: el.getAttribute('product-name'),
          nameText: (nameEl?.textContent || '').trim().slice(0, 40),
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
          hasSvg: !!svg,
          svgClient: svg ? { w: svg.clientWidth, h: svg.clientHeight, vb: svg.getAttribute('viewBox') } : null,
          brandRect: brand ? ((br) => ({ x: br.x, y: br.y, w: br.width, h: br.height }))(brand.getBoundingClientRect()) : null,
          fills: fills.slice(0, 12),
          clipRect: clipRect ? { outer: clipRect.outerHTML, w: clipRect.getAttribute('width'), h: clipRect.getAttribute('height') } : null,
          currentColor: svg ? getComputedStyle(svg).color : null,
        });
      });
      root.querySelectorAll('img.header__logo').forEach((el) => {
        const r = el.getBoundingClientRect();
        logos.push({
          type: 'img',
          src: el.getAttribute('src'),
          natural: { w: el.naturalWidth, h: el.naturalHeight },
          client: { w: el.clientWidth, h: el.clientHeight },
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        });
      });
    });
    return {
      htmlClass: [...document.documentElement.classList],
      productHref: document.getElementById('harmony-product-styles')?.getAttribute('href') || null,
      logos,
    };
  });

  // Paint first logo and sample blue pixels
  const paint = await page.evaluate(async () => {
    function walk(root, fn) {
      fn(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, fn);
      });
    }
    let svg = null;
    let img = null;
    walk(document, (root) => {
      root.querySelectorAll('harmony-shell-header').forEach((el) => {
        if (!svg) svg = el.shadowRoot?.querySelector('svg') || null;
      });
      root.querySelectorAll('img.header__logo').forEach((el) => {
        if (!img) img = el;
      });
    });

    async function paintSvg(el) {
      if (!el) return null;
      const w = Math.max(1, Math.round(el.getBoundingClientRect().width) || 20);
      const h = Math.max(1, Math.round(el.getBoundingClientRect().height) || 20);
      const xml = new XMLSerializer().serializeToString(el);
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      const image = new Image();
      await new Promise((res, rej) => {
        image.onload = res;
        image.onerror = rej;
        image.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let opaque = 0;
      let blueish = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 20) continue;
        opaque++;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (b > 120 && b > r && b > g - 20) blueish++;
      }
      const mid = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
      return {
        w,
        h,
        opaque,
        blueish,
        mid: [mid[0], mid[1], mid[2], mid[3]],
        fills: [...el.querySelectorAll('[fill]')].map((n) => n.getAttribute('fill')).slice(0, 8),
        clip: el.querySelector('clipPath rect')?.outerHTML || null,
      };
    }

    function paintImg(el) {
      if (!el) return null;
      const w = Math.max(1, el.clientWidth || 20);
      const h = Math.max(1, el.clientHeight || 20);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      try {
        ctx.drawImage(el, 0, 0, w, h);
      } catch (e) {
        return { error: String(e) };
      }
      const data = ctx.getImageData(0, 0, w, h).data;
      let opaque = 0;
      let blueish = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 20) continue;
        opaque++;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (b > 120 && b > r && b > g - 20) blueish++;
      }
      const mid = ctx.getImageData(Math.floor(w / 2), Math.floor(h / 2), 1, 1).data;
      return { w, h, opaque, blueish, mid: [mid[0], mid[1], mid[2], mid[3]] };
    }

    return { svg: await paintSvg(svg), img: paintImg(img) };
  });

  // screenshot brand strip of first matching header in demo content
  const clip = await page.evaluate(() => {
    function walk(root, fn) {
      fn(root);
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, fn);
      });
    }
    let target = null;
    walk(document, (root) => {
      root.querySelectorAll('harmony-shell-header').forEach((el) => {
        if (target) return;
        const r = el.getBoundingClientRect();
        if (r.width > 150 && r.top >= 0 && r.top < 900) {
          target = { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(520, r.width), height: Math.min(72, Math.max(40, r.height + 4)) };
        }
      });
    });
    if (!target) {
      const img = document.querySelector('img.header__logo');
      if (img) {
        const wrap = img.closest('.header') || img.parentElement;
        const r = wrap.getBoundingClientRect();
        target = { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(520, r.width), height: Math.min(72, Math.max(40, r.height + 4)) };
      }
    }
    return target;
  });

  if (clip && clip.width > 0 && clip.height > 0) {
    const buf = await page.screenshot({ clip, type: 'png' });
    writeFileSync(join(outDir, label + '-brand.png'), buf);
  }

  writeFileSync(join(outDir, label + '-probe.json'), JSON.stringify({ data, paint, clip }, null, 2));
  console.log('===', label, '===');
  console.log(JSON.stringify({ htmlClass: data.htmlClass, productHref: data.productHref, logos: data.logos, paint }, null, 2));
  await page.close();
}

await probe('http://localhost:4321/shell/header', 'ref', false);
await probe('http://localhost:5178/shell/header', 'van', true);
await browser.close();
console.log('DONE');
