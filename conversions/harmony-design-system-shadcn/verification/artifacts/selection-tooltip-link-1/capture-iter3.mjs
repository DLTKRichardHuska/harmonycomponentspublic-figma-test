import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const art = dirname(fileURLToPath(import.meta.url));
mkdirSync(art, { recursive: true });

async function setup(page) {
  await page.evaluate(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.className = (html.className || '').replace(/theme-\w+/g, '') + ' theme-cp';
  });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:5177/components/checkboxes', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);

const section = page.locator('#usage');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
writeFileSync(
  join(art, 'conv3-cb-usage.png'),
  await section.screenshot({ type: 'png', animations: 'disabled' }),
);

const probe = await section.evaluate((el) => {
  const lis = [...el.querySelectorAll('li')].map((li) => (li.textContent || '').trim());
  const text = (el.innerText || '').trim();
  const smashed =
    text.includes('DoUse') ||
    text.includes('selectionsProvide') ||
    text.includes('buttons)Have') ||
    text.includes("Don'tUse");
  return {
    liCount: lis.length,
    lis,
    smashed,
    textSample: text.slice(0, 700),
  };
});
writeFileSync(join(art, 'conv3-cb-usage-probe.json'), JSON.stringify(probe, null, 2));
console.log(JSON.stringify(probe, null, 2));

await page.goto('http://localhost:4321/components/checkboxes', {
  waitUntil: 'networkidle',
  timeout: 60000,
});
await setup(page);
const refH = page.getByRole('heading', { name: 'Usage Guidelines', exact: true }).first();
await refH.scrollIntoViewIfNeeded();
const handle = await refH.evaluateHandle((el) => {
  let n = el;
  for (let i = 0; i < 5; i++) {
    if (!n.parentElement) break;
    n = n.parentElement;
    if (n.tagName === 'SECTION' || n.id === 'usage') return n;
  }
  return el.parentElement || el;
});
const el = handle.asElement();
if (el) {
  writeFileSync(
    join(art, 'ref3-cb-usage.png'),
    await el.screenshot({ type: 'png', animations: 'disabled' }),
  );
}
await browser.close();
console.log('DONE');
