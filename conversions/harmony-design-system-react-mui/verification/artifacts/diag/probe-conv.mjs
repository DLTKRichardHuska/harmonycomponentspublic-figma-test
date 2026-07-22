import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:5176/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate(() => { localStorage.setItem('theme','light'); localStorage.setItem('colorTheme','cp'); });
await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
const data = await p.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, border: cs.borderColor, opacity: cs.opacity, fw: cs.fontWeight };
  };
  const subs = [...document.querySelectorAll('.MuiTypography-subtitle2, h4')];
  const ph = subs.find(s => s.textContent?.includes('Page Header Buttons'));
  const phRow = ph?.parentElement?.querySelectorAll('.MuiButton-root');
  const dis = [...document.querySelectorAll('.MuiButton-root.Mui-disabled')].slice(0,6).map(pick);
  const sec = [...document.querySelectorAll('.MuiButton-root')].find(b => b.textContent?.trim()==='Secondary' && getComputedStyle(b).borderWidth !== '0px');
  const ter = [...document.querySelectorAll('.MuiButton-root')].find(b => b.textContent?.trim()==='Tertiary' && getComputedStyle(b).backgroundColor === 'rgba(0, 0, 0, 0)');
  const dela = [...document.querySelectorAll('.MuiButton-root')].find(b => b.textContent?.includes('Ask Dela'));
  const delaBg = dela ? getComputedStyle(dela).backgroundImage : null;
  return {
    pageHeader: [...(phRow||[])].slice(0,3).map(pick),
    disabled: dis,
    secondary: pick(sec),
    tertiary: pick(ter),
    delaBg,
  };
});
console.log(JSON.stringify(data, null, 2));
await b.close();
