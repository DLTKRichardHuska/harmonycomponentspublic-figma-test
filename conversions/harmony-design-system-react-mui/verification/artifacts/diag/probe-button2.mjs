import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const run = async (url, name) => {
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => { localStorage.setItem('theme','light'); localStorage.setItem('colorTheme','cp'); });
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2500);
  const data = await p.evaluate(() => {
    const headings = [...document.querySelectorAll('h2,h3,h4')].map(h => h.textContent?.trim());
    const sections = [...document.querySelectorAll('h3, .section__title')].map(h => h.textContent?.trim()).filter(Boolean);
    const pickBtn = (root) => {
      const el = root?.querySelector('button, .btn, .MuiButton-root');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { text: el.textContent?.trim(), bg: cs.backgroundColor, color: cs.color, border: cs.border, fw: cs.fontWeight };
    };
    const h4s = [...document.querySelectorAll('h4')];
    const pageHeaderSec = h4s.find(h => h.textContent?.includes('Page Header Buttons'));
    const themeSec = h4s.find(h => h.textContent?.includes('Theme Buttons (Default)'));
    const loadingBtns = [...document.querySelectorAll('button.btn--loading, button[disabled][aria-busy], .MuiButton-loading, .MuiButton-root.Mui-disabled')];
    const loadingSection = [...document.querySelectorAll('h3, h6')].find(h => h.textContent?.trim() === 'Loading State' || h.textContent?.includes('Loading State'));
    let loadingRow = null;
    if (loadingSection) {
      const box = loadingSection.closest('section') || loadingSection.parentElement?.parentElement;
      loadingRow = [...(box?.querySelectorAll('button, .MuiButton-root') || [])].map(el => ({ text: el.textContent?.trim(), ariaBusy: el.getAttribute('aria-busy'), disabled: el.disabled }));
    }
    const a11yCards = [...document.querySelectorAll('.a11y-card__title, .MuiPaper-root h6, .MuiTypography-subtitle2')].map(e => e.textContent?.trim()).filter(t => t && ['Keyboard','Icon','Focus','Disabled'].some(k => t.includes(k)));
    const callouts = [...document.querySelectorAll('.alert, .MuiAlert-root')].length;
    const iconOnlyPlus = [...document.querySelectorAll('button[aria-label=\"Add item\"], .MuiIconButton-root[aria-label=\"Add item\"]')].length;
    return { headings: headings.slice(0,20), pageHeaderPrimary: pickBtn(pageHeaderSec?.parentElement), themePrimary: pickBtn(themeSec?.parentElement), loadingRow, a11yCards, callouts, iconOnlyPlus };
  });
  console.log(name, JSON.stringify(data, null, 2));
};
await run('http://localhost:4321/components/buttons', 'ref');
await run('http://localhost:5176/components/buttons', 'conv');
await b.close();
