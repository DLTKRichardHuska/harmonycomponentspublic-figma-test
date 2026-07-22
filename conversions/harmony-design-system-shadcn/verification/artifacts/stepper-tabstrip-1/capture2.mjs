// Element-level captures of tablists (ref vs conv) for direct widget comparison.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/stepper-tabstrip-1';
mkdirSync(art, { recursive: true });
const REF = 'http://localhost:4321';
const CONV = 'http://localhost:5177';

async function shots(base, route, prefix, sel, count, product) {
  const isRef = base === REF;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate((p) => {
    try {
      if (location.port === '5177') {
        localStorage.setItem('harmony-shadcn-product', p);
        localStorage.setItem('harmony-shadcn-mode', 'light');
      } else {
        localStorage.setItem('colorTheme', p);
        localStorage.setItem('harmony-product', p);
        localStorage.setItem('harmony-mode', 'light');
        const html = document.documentElement;
        html.classList.remove('dark');
        html.className = (html.className || '').replace(/theme-\w+/g, '').trim() + ' theme-' + p;
      }
    } catch {}
  }, product);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const items = page.locator(sel);
  const n = Math.min(await items.count(), count);
  for (let i = 0; i < n; i++) {
    const el = items.nth(i);
    try {
      await el.scrollIntoViewIfNeeded();
      writeFileSync(join(art, `${prefix}-${i}.png`), await el.screenshot({ type: 'png' }));
    } catch (e) {
      console.log('skip', prefix, i, e.message.split('\n')[0]);
    }
  }
  await browser.close();
  console.log('done', prefix, n);
}

// Reference tablist container is .tabstrip; conv Radix list is [role="tablist"].
await shots(REF, '/components/tab-strip', 'ref-tl', '.tabstrip', 12, 'cp');
await shots(CONV, '/components/tab-strip', 'conv-tl', '[role="tablist"]', 12, 'cp');
await shots(REF, '/components/tab-strip', 'ref-tl-vp', '.tabstrip', 12, 'vp');
await shots(CONV, '/components/tab-strip', 'conv-tl-vp', '[role="tablist"]', 12, 'vp');
console.log('all done');
