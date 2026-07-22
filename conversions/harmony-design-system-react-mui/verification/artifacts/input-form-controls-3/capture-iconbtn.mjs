import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(out, { recursive: true });

async function goto(page, product) {
  await page.addInitScript((p) => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', p);
  }, product);
  await page.goto('http://localhost:5176/components/inputs', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(400);
}

async function clipHeading(page, file, heading) {
  const box = await page.evaluate((text) => {
    const hs = [...document.querySelectorAll('#examples h3')].find((el) =>
      el.textContent.trim().startsWith(text),
    );
    if (!hs) return null;
    let group = hs;
    while (group.parentElement && group.parentElement.id !== 'examples') group = group.parentElement;
    group.scrollIntoView({ block: 'center' });
    const r = group.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, heading);
  if (!box) return false;
  const vp = page.viewportSize();
  const x = Math.max(0, Math.floor(box.x));
  const y = Math.max(0, Math.floor(box.y));
  const width = Math.min(Math.floor(box.w), vp.width - x, 900);
  const height = Math.min(Math.floor(box.h), vp.height - y);
  if (width < 5 || height < 5) return false;
  await page.screenshot({ path: file, clip: { x, y, width, height } });
  return true;
}

async function measure(page) {
  return page.evaluate(() => {
    const btn = [...document.querySelectorAll('#examples .MuiInputAdornment-root button.MuiIconButton-root')]
      .find((b) => /password/i.test(b.getAttribute('aria-label') || ''));
    if (!btn) return { error: 'no password toggle found' };
    const root = btn.closest('.MuiOutlinedInput-root');
    const icon = btn.querySelector('.MuiSvgIcon-root, [data-icon], span, svg');
    const br = btn.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    const ir = icon ? icon.getBoundingClientRect() : null;
    const cs = getComputedStyle(btn);
    return {
      field: { right: Math.round(rr.right), height: Math.round(rr.height) },
      button: {
        w: Math.round(br.width),
        h: Math.round(br.height),
        right: Math.round(br.right),
        padding: cs.padding,
        marginRight: cs.marginRight,
        fontSize: cs.fontSize,
      },
      icon: ir ? { w: Math.round(ir.width), h: Math.round(ir.height), right: Math.round(ir.right) } : null,
      buttonOverflowsField: Math.round(br.right) > Math.round(rr.right),
      iconRightVsFieldRight: ir ? Math.round(ir.right) - Math.round(rr.right) : null,
    };
  });
}

const browser = await chromium.launch({ headless: true });
const report = {};
for (const product of ['vp', 'cp']) {
  const context = await browser.newContext({ viewport: { width: 1400, height: 1000 }, colorScheme: 'light', deviceScaleFactor: 2 });
  const page = await context.newPage();
  await goto(page, product);
  report[product] = await measure(page);
  try {
    const ok = await clipHeading(page, join(out, `conv-${product}-trailing.png`), 'Trailing icon');
    console.log('clip', product, ok);
  } catch (e) {
    console.log('clip failed', product, e.message);
  }
  await context.close();
}
writeFileSync(join(out, 'iconbtn-probe.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
