import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
async function measure(url, isRef) {
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
  const data = await page.evaluate((isRef) => {
    const card = [...document.querySelectorAll(isRef ? '.card' : '.MuiCard-root')].find(c => /All Three Icons/i.test(c.textContent||''));
    const bodyP = card?.querySelector('.card__body p, .card__body, .MuiCardContent-root .MuiTypography-root, .MuiCardContent-root');
    const typo = card?.querySelector('.MuiCardContent-root .MuiTypography-root, .card__body');
    const icons = [...(card?.querySelectorAll(isRef ? '.card__icon-btn svg' : '.MuiCardHeader-action svg') || [])];
    const bodyCs = typo ? getComputedStyle(typo) : null;
    return {
      body: bodyCs ? { size: bodyCs.fontSize, weight: bodyCs.fontWeight, color: bodyCs.color, lineHeight: bodyCs.lineHeight, variant: typo.className } : null,
      icons: icons.map(svg => {
        const br = svg.getBoundingClientRect();
        const cs = getComputedStyle(svg);
        return { w: +br.width.toFixed(1), h: +br.height.toFixed(1), cssW: cs.width, cssH: cs.height };
      }),
    };
  }, isRef);
  await page.close();
  return data;
}
const ref = await measure('http://localhost:4321/components/cards', true);
const conv = await measure('http://localhost:5176/components/cards', false);
console.log(JSON.stringify({ ref, conv }, null, 2));
await browser.close();
