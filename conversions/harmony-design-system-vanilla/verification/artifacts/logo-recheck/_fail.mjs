import { chromium } from 'playwright';
import { setTimeout as delay } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

const outDir = 'conversions/harmony-design-system-vanilla/verification/artifacts/logo-recheck';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
const failed = [];
page.on('response', async (res) => {
  if (res.status() >= 400) {
    let body = '';
    try { body = (await res.text()).slice(0, 500); } catch {}
    failed.push({ url: res.url(), status: res.status(), body });
  }
});
await page.goto('http://localhost:5178/shell/header', { waitUntil: 'networkidle', timeout: 90000 });
await delay(1500);
console.log(JSON.stringify(failed, null, 2));
writeFileSync(`${outDir}/conv-failed-requests.json`, JSON.stringify(failed, null, 2));
// also try fetching the module directly
const direct = await page.goto('http://localhost:5178/@fs/C:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/packages/ui/src/elements/generated/productLogoSvgs.js', { waitUntil: 'domcontentloaded' });
console.log('direct status', direct?.status());
const txt = await page.content();
writeFileSync(`${outDir}/direct-module.html`, txt.slice(0, 2000));
await browser.close();
