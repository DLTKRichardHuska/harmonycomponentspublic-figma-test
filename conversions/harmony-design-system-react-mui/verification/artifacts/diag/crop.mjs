import { chromium } from 'playwright';
const [,, mode] = process.argv;
const CONV = 'http://localhost:5176/foundation/colors';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(CONV, { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate((mode) => {
  localStorage.setItem('theme', mode);
  localStorage.setItem('colorTheme', 'cp');
}, mode);
await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
const d = 'conversions/harmony-design-system-react-mui/verification/artifacts/diag';
const header = await p.$('header.MuiBox-root, article header');
if (header) await header.screenshot({ path: `${d}/crop-header-${mode}.png` });
// first palette swatch cell container
const cell = await p.$('[data-color-key="pageBackground"]');
if (cell) {
  const container = await cell.evaluateHandle((el) => el.closest('.MuiGrid-root') || el.parentElement.parentElement);
  await container.asElement().screenshot({ path: `${d}/crop-swatch-${mode}.png` });
}
await b.close();
console.log('cropped', mode);
