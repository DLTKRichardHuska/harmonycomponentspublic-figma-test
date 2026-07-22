import { chromium } from 'playwright';
const [,, url, mode, out] = process.argv;
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate((mode) => {
  localStorage.setItem('theme', mode);
  localStorage.setItem('colorTheme', 'cp');
}, mode);
await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(3500);
await p.screenshot({ path: out, fullPage: true });
await b.close();
console.log('shot', out);
