import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-theme', 'cp');
    localStorage.setItem('harmony-mode', 'light');
    const de = document.documentElement;
    de.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    de.classList.add('theme-cp');
    de.dataset.theme = 'cp';
    de.dataset.mode = 'light';
  });
}

async function inventory(page) {
  return page.evaluate(() => {
    const txt = (el) => (el.textContent || '').trim().replace(/\s+/g, ' ');
    const headings = [...document.querySelectorAll('h1,h2')].map(txt);
    const exampleTitles = [...document.querySelectorAll('h3,[class*="ExampleGroup"] h3, .example-section__title')].map(txt).filter(Boolean);
    const callouts = [...document.querySelectorAll('[class*="Unsupported"], [class*="callout"], [class*="Callout"]')].map((el) => txt(el).slice(0, 200));
    // tab roles / step icons quick counts
    const tablists = document.querySelectorAll('[role="tablist"]').length;
    const tabs = document.querySelectorAll('[role="tab"]').length;
    const stepIcons = document.querySelectorAll('.MuiStepIcon-root, .stepper__indicator, [class*="step"] svg').length;
    return { headings, exampleTitles, callouts: callouts.slice(0, 12), tablists, tabs, stepIcons };
  });
}

async function captureSide(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await applyCpLight(page);
  await page.waitForTimeout(700);

  writeFileSync(join(art, `${prefix}-full.png`), await page.screenshot({ type: 'png', fullPage: true }));

  const inv = await inventory(page);
  writeFileSync(join(art, `${prefix}-inventory.json`), JSON.stringify(inv, null, 2));

  // Examples section only
  const ex = page.locator('#examples').first();
  if (await ex.count()) {
    await ex.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(200);
    writeFileSync(join(art, `${prefix}-examples.png`), await ex.screenshot({ type: 'png' }).catch(() => Buffer.from('')));
  }
  console.log(prefix, 'done', JSON.stringify({ tablists: inv.tablists, tabs: inv.tabs, stepIcons: inv.stepIcons, examples: inv.exampleTitles.length }));
  await browser.close();
}

const target = process.argv[2]; // 'stepper' | 'tab-strip'
await captureSide(`http://localhost:4321/components/${target}`, `ref-${target}`);
await captureSide(`http://localhost:5176/components/${target}`, `conv-${target}`);
console.log('all done', target);
