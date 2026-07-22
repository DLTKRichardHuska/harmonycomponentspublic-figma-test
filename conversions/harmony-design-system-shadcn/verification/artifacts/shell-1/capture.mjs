import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/shell-1';
mkdirSync(art, { recursive: true });

const pages = [
  ['layout', '/shell/layout'],
  ['header', '/shell/header'],
  ['footer', '/shell/footer'],
  ['page-header', '/shell/page-header'],
  ['left-sidebar', '/shell/left-sidebar'],
  ['right-sidebar', '/shell/right-sidebar'],
  ['panel', '/shell/panel'],
  ['floating-nav', '/cp/floating-nav'],
];

async function capture(name, path) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 940 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('http://localhost:5177' + path, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(600);
  writeFileSync(join(art, 'conv-' + name + '.png'), await page.screenshot({ type: 'png', fullPage: true }));
  await browser.close();
  console.log(name, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'ok');
}

for (const [name, path] of pages) {
  try {
    await capture(name, path);
  } catch (e) {
    console.log('FAIL', name, e.message.split('\n')[0]);
  }
}
console.log('done');
