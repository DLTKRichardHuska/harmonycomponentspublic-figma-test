import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const outDir = 'conversions/harmony-design-system-vanilla/verification/artifacts/logo-recheck';
const browser = await chromium.launch({ headless: true });

async function capture(role, url) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
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
  await delay(1000);

  const probe = await page.evaluate(() => {
    const walk = (root, fn) => {
      fn(root);
      for (const el of root.querySelectorAll('*')) {
        if (el.shadowRoot) walk(el.shadowRoot, fn);
      }
    };
    const logos = [];
    walk(document, (root) => {
      for (const svg of root.querySelectorAll('svg')) {
        const r = svg.getBoundingClientRect();
        const html = svg.outerHTML;
        const isProduct =
          html.includes('4C92D9') ||
          /viewBox="0 0 36 36"/.test(html) ||
          html.includes('clip0_2021');
        if (!isProduct) continue;
        if (r.width < 10 || r.height < 10) continue;
        const paths = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('fill'));
        logos.push({
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          left: Math.round(r.left),
          fills: paths.slice(0, 6),
          hasBlue: html.includes('4C92D9') || paths.includes('#4C92D9'),
          clipRect: [...svg.querySelectorAll('clipPath rect')].map((re) => ({
            w: re.getAttribute('width'),
            h: re.getAttribute('height'),
          })),
          visible: r.width > 0 && r.height > 0,
          opacity: getComputedStyle(svg).opacity,
          display: getComputedStyle(svg).display,
        });
      }
    });

    // Sample pixels near first logo via canvas? skip — use fills
    let productNameNearLogo = null;
    walk(document, (root) => {
      for (const el of root.querySelectorAll('*')) {
        const t = (el.textContent || '').trim();
        if (t === 'Costpoint' && el.children.length === 0) {
          const r = el.getBoundingClientRect();
          productNameNearLogo = {
            left: Math.round(r.left),
            top: Math.round(r.top),
            text: t,
          };
        }
      }
    });

    return {
      theme: [...document.documentElement.classList],
      productHref: document.getElementById('harmony-product-styles')?.getAttribute('href') || null,
      logos,
      productNameNearLogo,
      title: document.title,
      href: location.href,
    };
  });

  await page.screenshot({ path: `${outDir}/${role}-shell-header-cp-light.png`, fullPage: false });
  await page.screenshot({
    path: `${outDir}/${role}-header-band.png`,
    clip: { x: 0, y: 0, width: 1400, height: 140 },
  });

  if (probe.logos[0]) {
    const L = probe.logos[0];
    const clip = {
      x: Math.max(0, L.left - 12),
      y: Math.max(0, L.top - 12),
      width: Math.min(120, L.w + 80),
      height: Math.min(80, L.h + 24),
    };
    await page.screenshot({ path: `${outDir}/${role}-logo-crop.png`, clip });
  }

  // Pixel sample of logo center if present
  if (probe.logos[0]) {
    const L = probe.logos[0];
    const pixels = await page.evaluate(({ x, y }) => {
      // draw page isn't available; use elementFromPoint + getImageData via offscreen not possible
      return { x, y };
    }, { x: L.left + L.w / 2, y: L.top + L.h / 2 });
    probe.pixelPoint = pixels;
  }

  writeFileSync(`${outDir}/${role}-probe.json`, JSON.stringify(probe, null, 2));
  console.log(role, JSON.stringify(probe, null, 2));
  await page.close();
}

await capture('ref', 'http://localhost:4321/shell/header');
await capture('conv', 'http://localhost:5178/shell/header');
await browser.close();
console.log('done');
