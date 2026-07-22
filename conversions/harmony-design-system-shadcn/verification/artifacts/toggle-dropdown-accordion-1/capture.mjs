// Capture-only evidence for toggle/dropdown/accordion fidelity verify.
// This script writes PNG + JSON artifacts ONLY. It does not decide PASS/FAIL.
// Compare is designer judgment (see FIDELITY_PRINCIPLES.md / VISUAL_MATCH_GATE.md).
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const art = 'conversions/harmony-design-system-shadcn/verification/artifacts/toggle-dropdown-accordion-1';
mkdirSync(art, { recursive: true });

const REF = 'http://localhost:4321';
const CONV = 'http://localhost:5177';

async function setCpLight(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('colorTheme', 'cp');
      localStorage.setItem('harmony-theme', 'cp');
      localStorage.setItem('harmony-mode', 'light');
      localStorage.setItem('harmony-product', 'cp');
    } catch {}
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '').trim() + ' theme-cp';
  });
}

async function fullPage(url, out) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await setCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await setCpLight(page);
  await page.waitForTimeout(500);
  writeFileSync(join(art, out + '.png'), await page.screenshot({ type: 'png', fullPage: true }));
  // content inventory: section titles + example group titles
  const inv = await page.evaluate(() => {
    const text = (sel) => [...document.querySelectorAll(sel)].map(n => (n.textContent || '').trim().replace(/\s+/g, ' ')).filter(Boolean);
    return {
      h1: text('h1'),
      h2: text('h2, .section__title'),
      exampleTitles: text('.example-section__title, [class*="ExampleGroup"] h3, h3'),
      a11yTitles: text('.a11y-card__title'),
      callouts: text('[role="alert"], .alert, [class*="alert"]').slice(0, 6),
    };
  });
  writeFileSync(join(art, out + '-inventory.json'), JSON.stringify(inv, null, 2));
  await browser.close();
  console.log('page', out);
}

async function openDropdown(url, out) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  await page.goto(url + '/components/dropdowns', { waitUntil: 'networkidle', timeout: 60000 });
  await setCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await setCpLight(page);
  await page.waitForTimeout(400);
  // click first trigger (combobox/button)
  const trigger = page.locator('button[role="combobox"], [role="combobox"], .dropdown__trigger, button').first();
  try {
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click({ force: true });
    await page.waitForTimeout(500);
  } catch (e) { console.log('open fail', out, e.message.split('\n')[0]); }
  writeFileSync(join(art, out + '-open.png'), await page.screenshot({ type: 'png' }));
  const panel = page.locator('[role="listbox"], [data-radix-popper-content-wrapper], .dropdown__menu, [class*="SelectContent"]').first();
  if (await panel.count()) {
    try { writeFileSync(join(art, out + '-panel.png'), await panel.screenshot({ type: 'png' })); } catch (e) { console.log('panel fail', out, e.message.split('\n')[0]); }
  } else {
    console.log('no panel', out);
  }
  await browser.close();
  console.log('dropdown-open', out);
}

const routes = ['/components/toggle-switches', '/components/dropdowns', '/components/accordion'];
const names = ['toggle', 'dropdown', 'accordion'];

for (let i = 0; i < routes.length; i++) {
  await fullPage(REF + routes[i], 'ref-' + names[i]);
  await fullPage(CONV + routes[i], 'conv-' + names[i]);
}

await openDropdown(REF, 'ref-dropdown');
await openDropdown(CONV, 'conv-dropdown');

console.log('done');
