import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:4321/components/buttons', { waitUntil: 'networkidle', timeout: 60000 });
await p.evaluate(() => { localStorage.setItem('theme','light'); localStorage.setItem('colorTheme','cp'); });
await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
const data = await p.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, border: cs.borderColor, opacity: cs.opacity, fw: cs.fontWeight };
  };
  const btns = [...document.querySelectorAll('button.btn')];
  const sec = btns.find(b => b.textContent?.trim()==='Secondary' && b.className.includes('btn--secondary') && !b.className.includes('page-header'));
  const disPrimary = btns.find(b => b.textContent?.trim()==='Disabled' && b.className.includes('btn--primary') && b.className.includes('btn--disabled'));
  const disSecondary = btns.find(b => b.textContent?.trim()==='Disabled' && b.className.includes('btn--secondary') && b.className.includes('btn--disabled'));
  const dela = btns.find(b => b.textContent?.includes('Ask Dela'));
  return { secondary: pick(sec), disPrimary: pick(disPrimary), disSecondary: pick(disSecondary), delaBg: dela ? getComputedStyle(dela).backgroundImage : null };
});
console.log(JSON.stringify(data, null, 2));
await b.close();
