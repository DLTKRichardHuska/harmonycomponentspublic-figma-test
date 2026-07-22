import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
async function hoverProbe(url, isRef) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-demo-mode', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('theme-cp');
    document.documentElement.setAttribute('data-mui-color-scheme', 'light');
  });
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  const sel = isRef ? '.card--interactive' : '.MuiCard-root:has(.MuiCardActionArea-root)';
  const rest = await page.evaluate((s) => {
    const card = document.querySelector(s);
    const cs = getComputedStyle(card);
    return { bg: cs.backgroundColor, border: cs.borderColor, shadow: cs.boxShadow };
  }, sel);
  await page.locator(isRef ? '.card--interactive' : '.MuiCardActionArea-root').first().hover();
  await page.waitForTimeout(400);
  const hover = await page.evaluate((s) => {
    const card = document.querySelector(s);
    const cs = getComputedStyle(card);
    const area = card.querySelector('.MuiCardActionArea-root, .card__body') || card;
    return {
      cardBg: cs.backgroundColor,
      border: cs.borderColor,
      shadow: cs.boxShadow,
      areaBg: getComputedStyle(area).backgroundColor,
      areaCursor: getComputedStyle(area).cursor,
    };
  }, sel);
  await page.close();
  return { rest, hover };
}
const ref = await hoverProbe('http://localhost:4321/components/cards', true);
const conv = await hoverProbe('http://localhost:5176/components/cards', false);
console.log(JSON.stringify({ ref, conv }, null, 2));
await browser.close();
