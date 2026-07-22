import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
for (const [label, url] of [['ref','http://localhost:4321/components/buttons'],['conv','http://localhost:5176/components/buttons']]) {
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => { localStorage.setItem('theme','light'); localStorage.setItem('colorTheme','cp'); });
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  await p.evaluate(() => window.scrollTo(0, 2200));
  await p.waitForTimeout(500);
  await p.screenshot({ path: label + '-button-mid.png' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(500);
  await p.screenshot({ path: label + '-button-bottom.png' });
}
// probe styles
const probe = async (url, name) => {
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => { localStorage.setItem('theme','light'); localStorage.setItem('colorTheme','cp'); });
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  const data = await p.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, border: cs.borderColor, h: cs.height, br: cs.borderRadius, fs: cs.fontSize, fw: cs.fontWeight };
    };
    const byText = (t) => [...document.querySelectorAll('button, a.btn, .MuiButton-root')].find(e => e.textContent?.trim() === t);
    const dela = [...document.querySelectorAll('button, .MuiButton-root')].find(e => e.textContent?.includes('Ask Dela'));
    return {
      themePrimary: pick(byText('Primary')),
      pageHeaderPrimary: pick([...document.querySelectorAll('button, .MuiButton-root')].find(e => {
        const sec = e.closest('section, .ExampleSection, [class*=Example], div');
        return sec?.textContent?.includes('Page Header') && e.textContent?.trim()==='Primary';
      })),
      dela: pick(dela),
      destructive: pick(byText('Destructive')),
      ghost: pick(byText('Ghost')),
    };
  });
  console.log('PROBE', name, JSON.stringify(data, null, 2));
};
await probe('http://localhost:4321/components/buttons', 'ref');
await probe('http://localhost:5176/components/buttons', 'conv');
await b.close();
