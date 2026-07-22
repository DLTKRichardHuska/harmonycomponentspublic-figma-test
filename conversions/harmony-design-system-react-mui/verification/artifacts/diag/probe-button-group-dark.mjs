import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/button-group-1';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function setTheme(p, theme, mode, how) {
  if (how === 'ref') {
    await p.evaluate(({ theme, mode }) => {
      localStorage.setItem('theme', mode);
      localStorage.setItem('colorTheme', theme);
      document.documentElement.classList.remove('dark','theme-cp','theme-vp','theme-ppm','theme-maconomy');
      document.documentElement.classList.add('theme-'+theme);
      if (mode === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }, { theme, mode });
  } else {
    // try common converted demo keys
    await p.evaluate(({ theme, mode }) => {
      localStorage.setItem('theme', mode);
      localStorage.setItem('colorTheme', theme);
      localStorage.setItem('harmony-theme', theme);
      localStorage.setItem('harmony-mode', mode);
      localStorage.setItem('mui-mode', mode);
      document.documentElement.classList.remove('dark','theme-cp','theme-vp','theme-ppm','theme-maconomy');
      document.documentElement.classList.add('theme-'+theme);
      if (mode === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-mui-color-scheme', mode);
    }, { theme, mode });
  }
}

async function probeDark(url, label, how) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await setTheme(page, 'cp', 'dark', how);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // click dark toggle if present
  const toggles = page.locator('button[aria-label*="dark" i], button[aria-label*="mode" i], button[aria-label*="theme" i], [data-testid*="mode"]');
  const n = await toggles.count();
  const htmlClass = await page.evaluate(() => document.documentElement.className);
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const data = await page.evaluate(() => {
    const g = document.querySelector('.btn-group, .MuiButtonGroup-root');
    if (!g) return null;
    const cs = getComputedStyle(g);
    const btns = [...g.querySelectorAll('button,.btn,.MuiButton-root')].map(b => {
      const s = getComputedStyle(b);
      return { text: (b.getAttribute('aria-label')||b.textContent||'').trim().slice(0,30), bg:s.backgroundColor, color:s.color, opacity:s.opacity };
    });
    return { groupBg: cs.backgroundColor, groupBorder: cs.border, html: document.documentElement.className, btns };
  });
  await page.screenshot({ path: join(outDir, label + '-dark-page.png'), fullPage: false });
  if (gExists(data)) await page.locator('.btn-group, .MuiButtonGroup-root').first().screenshot({ path: join(outDir, label + '-dark-group2.png') });
  return { htmlClass, bodyBg, toggleCount: n, data };
}
function gExists(d){ return !!d; }

// Also try clicking mode toggle on converted
async function forceConvDarkViaUI() {
  await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // dump buttons in header
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('header') || document.body;
    return [...header.querySelectorAll('button')].slice(0,20).map(b => ({
      label: b.getAttribute('aria-label'),
      title: b.getAttribute('title'),
      text: b.textContent?.trim().slice(0,40),
      classes: String(b.className).slice(0,80)
    }));
  });
  // try light/dark icons
  const darkBtn = page.locator('button[aria-label="Dark mode"], button[aria-label="Switch to dark mode"], button[aria-label="Toggle dark mode"], button[title*="Dark" i]').first();
  if (await darkBtn.count()) {
    await darkBtn.click();
    await page.waitForTimeout(500);
  } else {
    // click any button that looks like mode toggle (often second icon button)
    const candidates = page.locator('header button, [class*="DemoShell"] button, [class*="AppBar"] button');
    const count = await candidates.count();
    for (let i=0;i<count;i++) {
      const al = await candidates.nth(i).getAttribute('aria-label');
      if (al && /dark|light|mode|theme/i.test(al)) {
        await candidates.nth(i).click();
        await page.waitForTimeout(400);
        break;
      }
    }
  }
  const after = await page.evaluate(() => {
    const g = document.querySelector('.MuiButtonGroup-root');
    const cs = g ? getComputedStyle(g) : null;
    const btns = g ? [...g.querySelectorAll('.MuiButton-root')].map(b => {
      const s = getComputedStyle(b);
      return { text: b.textContent.trim(), bg:s.backgroundColor, color:s.color };
    }) : [];
    return {
      html: document.documentElement.className,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      muiMode: document.documentElement.getAttribute('data-mui-color-scheme'),
      groupBg: cs?.backgroundColor,
      groupBorder: cs?.border,
      btns,
    };
  });
  await page.locator('.MuiButtonGroup-root').first().screenshot({ path: join(outDir, 'conv-dark-via-ui.png') });
  return { headerInfo, after };
}

const refDark = await probeDark('http://localhost:4321/components/button-groups', 'ref', 'ref');
const convDark = await probeDark('http://localhost:5176/components/button-groups', 'conv', 'conv');
const ui = await forceConvDarkViaUI();

// icon-only compare light
await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle' });
await setTheme(page, 'cp', 'light', 'ref');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const refIcons = await page.evaluate(() => {
  const groups = [...document.querySelectorAll('.btn-group')];
  // find icon-only: buttons with aria-label Bold
  const g = groups.find(x => x.querySelector('[aria-label="Bold"]'));
  if (!g) return null;
  const cs = getComputedStyle(g);
  return {
    group: { bg: cs.backgroundColor, pad: cs.padding, gap: cs.gap },
    buttons: [...g.querySelectorAll('button,.btn')].map(b => {
      const s = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      const svg = b.querySelector('svg');
      const sr = svg?.getBoundingClientRect();
      return { label: b.getAttribute('aria-label'), w: Math.round(r.width), h: Math.round(r.height), pad: s.padding, bg:s.backgroundColor, color:s.color, icon: sr ? {w:Math.round(sr.width), h:Math.round(sr.height)} : null };
    })
  };
});
await page.locator('.btn-group').filter({ has: page.locator('[aria-label="Bold"]') }).first().screenshot({ path: join(outDir, 'ref-icon-only.png') });

await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle' });
await setTheme(page, 'cp', 'light', 'conv');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const convIcons = await page.evaluate(() => {
  const groups = [...document.querySelectorAll('.MuiButtonGroup-root')];
  const g = groups.find(x => x.querySelector('[aria-label="Bold"]'));
  if (!g) return null;
  const cs = getComputedStyle(g);
  return {
    group: { bg: cs.backgroundColor, pad: cs.padding, gap: cs.gap },
    buttons: [...g.querySelectorAll('.MuiButton-root')].map(b => {
      const s = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      const svg = b.querySelector('svg');
      const sr = svg?.getBoundingClientRect();
      return { label: b.getAttribute('aria-label'), w: Math.round(r.width), h: Math.round(r.height), pad: s.padding, bg:s.backgroundColor, color:s.color, icon: sr ? {w:Math.round(sr.width), h:Math.round(sr.height)} : null };
    })
  };
});
await page.locator('.MuiButtonGroup-root').filter({ has: page.locator('[aria-label="Bold"]') }).first().screenshot({ path: join(outDir, 'conv-icon-only.png') });

// outline dark
await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle' });
await setTheme(page, 'cp', 'dark', 'ref');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const refOutlineDark = await page.evaluate(() => {
  const g = document.querySelector('.btn-group--outline');
  if (!g) return null;
  const cs = getComputedStyle(g);
  return { bg: cs.backgroundColor, btns: [...g.querySelectorAll('button,.btn')].map(b => { const s=getComputedStyle(b); return {t:b.textContent.trim(), bg:s.backgroundColor, c:s.color, border:s.border}; }) };
});
await page.locator('.btn-group--outline').first().screenshot({ path: join(outDir, 'ref-outline-dark.png') });

const result = { refDark, convDark, ui, refIcons, convIcons, refOutlineDark };
writeFileSync(join(outDir, 'probe-dark-icons.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
