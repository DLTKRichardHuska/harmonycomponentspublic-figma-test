import { chromium } from 'playwright';
const CONV = 'http://localhost:5176/foundation/colors';
async function run(mode) {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();
  await p.goto(CONV, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate((mode) => {
    localStorage.setItem('theme', mode);
    localStorage.setItem('colorTheme', 'cp');
    document.documentElement.classList.remove('dark');
    if (mode === 'dark') document.documentElement.classList.add('dark');
  }, mode);
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1000);
  const res = await p.evaluate(() => {
    const detail = (el) => {
      if (!el) return null;
      let op = 1; let node = el;
      while (node) { const o = parseFloat(getComputedStyle(node).opacity); if (!Number.isNaN(o)) op *= o; node = node.parentElement; }
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: el.textContent.trim().slice(0, 28),
        color: cs.color,
        webkitTextFillColor: cs.webkitTextFillColor,
        opacity: cs.opacity,
        cumulativeOpacity: op.toFixed(3),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 30),
        visibility: cs.visibility,
        rect: { w: Math.round(r.width), h: Math.round(r.height) },
      };
    };
    // article h1 (page title), not shell header h1
    const article = document.querySelector('article');
    const h1 = article ? article.querySelector('h1') : null;
    // swatch label: the Typography.body2 nearest a data-color-key swatch
    const swatch = document.querySelector('[data-color-key="pageBackground"]');
    const label = swatch ? swatch.parentElement.parentElement.querySelector('.MuiTypography-body2') : null;
    return {
      htmlClass: document.documentElement.className,
      articleH1: detail(h1),
      swatchLabel: detail(label),
    };
  });
  await b.close();
  return res;
}
console.log('LIGHT', JSON.stringify(await run('light'), null, 2));
console.log('DARK', JSON.stringify(await run('dark'), null, 2));
