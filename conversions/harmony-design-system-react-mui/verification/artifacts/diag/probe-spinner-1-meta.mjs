import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
const out = 'conversions/harmony-design-system-react-mui/verification/artifacts/spinner-1';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function ensureLight(url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  for (let i = 0; i < 4; i++) {
    const darkish = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? (Number(m[1])+Number(m[2])+Number(m[3])) < 400 : false;
    });
    if (!darkish) break;
    await page.getByRole('button', { name: /color mode/i }).click().catch(()=>{});
    await page.waitForTimeout(500);
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }
}

await ensureLight('http://localhost:4321/components/spinner');
const refDesc = await page.evaluate(() => {
  const header = document.querySelector('.page-header');
  return {
    title: document.querySelector('.page-header__title')?.textContent?.trim(),
    desc: document.querySelector('.page-header__description')?.textContent?.trim(),
    badge: document.querySelector('.badge')?.textContent?.trim(),
    primary: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim(),
    border: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
    sizes: [...document.querySelectorAll('#examples .spinner')].slice(0,3).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), bt: cs.borderTopColor, br: cs.borderRightColor, bw: cs.borderTopWidth, box: cs.boxSizing };
    })
  };
});
await page.locator('#examples .example-section, #examples > *').first().screenshot({ path: join(out, 'ref-light-sizes-block.png') }).catch(()=>{});
// screenshot the sizes demo panel
const refSizes = page.locator('#examples').locator('text=Sizes').first();
await page.screenshot({ path: join(out, 'ref-light-viewport.png') });

await ensureLight('http://localhost:5176/components/spinner');
const convDesc = await page.evaluate(() => {
  const article = document.querySelector('article');
  const h1 = article?.querySelector('h1');
  const desc = h1?.parentElement?.parentElement?.querySelector('p, div.MuiTypography-root');
  // find DemoPageHeader description - first body1 after h1
  const texts = [...article.querySelectorAll('.MuiTypography-root')].slice(0,5).map(t => t.textContent.trim());
  const sizes = [...document.querySelectorAll('#examples .MuiCircularProgress-root')].slice(0,3).map(el => {
    const r = el.getBoundingClientRect();
    const circle = el.querySelector('.MuiCircularProgress-circle');
    const track = el.querySelector('.MuiCircularProgress-track');
    return {
      w: +r.width.toFixed(1),
      circle: circle ? getComputedStyle(circle).color : null,
      track: track ? getComputedStyle(track).color : null,
      thicknessAttr: el.getAttribute('aria-valuenow'),
    };
  });
  return {
    texts,
    badge: [...document.querySelectorAll('*')].find(e => e.textContent === 'stable' && e.children.length===0)?.textContent,
    sizes,
    bg: getComputedStyle(document.body).backgroundColor,
  };
});

writeFileSync(join(out, 'compare-meta.json'), JSON.stringify({ refDesc, convDesc }, null, 2));
console.log(JSON.stringify({ refDesc, convDesc }, null, 2));
await browser.close();
