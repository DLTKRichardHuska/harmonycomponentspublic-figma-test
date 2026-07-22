import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/button-group-3';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function setCp(wantDark) {
  await page.evaluate((dark) => {
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-theme', 'cp');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('harmony-demo-mode', dark ? 'dark' : 'light');
    document.documentElement.classList.remove('theme-vp','theme-ppm','theme-maconomy');
    document.documentElement.classList.add('theme-cp');
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.setAttribute('data-mui-color-scheme', dark ? 'dark' : 'light');
  }, wantDark);
}

async function ensureMode(wantDark) {
  await setCp(wantDark);
  for (let i = 0; i < 3; i++) {
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-mui-color-scheme') === 'dark' ||
      getComputedStyle(document.body).backgroundColor === 'rgb(31, 37, 46)'
    );
    if (isDark === wantDark) break;
    const toggle = page.locator('button[aria-label="Toggle color mode"], button[aria-label*="mode" i]').first();
    if (await toggle.count()) {
      await toggle.click();
      await page.waitForTimeout(700);
    } else {
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await setCp(wantDark);
    }
  }
  await setCp(wantDark);
  await page.waitForTimeout(300);
}

function btnProbe(b) {
  const s = getComputedStyle(b);
  const r = b.getBoundingClientRect();
  return {
    text: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40),
    bg: s.backgroundColor,
    color: s.color,
    border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor,
    borderRadius: s.borderRadius,
    padding: s.padding,
    opacity: s.opacity,
    disabled: b.disabled || b.classList.contains('Mui-disabled') || b.classList.contains('btn--disabled'),
    w: Math.round(r.width),
    h: Math.round(r.height),
    fontSize: s.fontSize,
  };
}

async function sample(label, url, wantDark) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await ensureMode(wantDark);
  await page.screenshot({ path: join(outDir, label + '-page.png'), fullPage: true });

  const data = await page.evaluate((btnProbeSrc) => {
    const btnProbe = new Function('return (' + btnProbeSrc + ')')();
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    const first = groups[0];
    const outline = document.querySelector('.btn-group--outline, .MuiButtonGroup-outlined') ||
      groups.find(g => String(g.className).toLowerCase().includes('outline'));
    const icons = groups.find(g => g.querySelector('[aria-label="Bold"]'));
    const disabled = groups.find(g => [...g.querySelectorAll('button,.btn,.MuiButton-root')].some(b => b.disabled || b.classList.contains('Mui-disabled')));
    const vertical = groups.find(g => {
      const s = getComputedStyle(g);
      return s.flexDirection === 'column' || String(g.className).includes('vertical') || String(g.className).includes('Vertical');
    });
    const pack = (g) => {
      if (!g) return null;
      const s = getComputedStyle(g);
      const r = g.getBoundingClientRect();
      const buttons = [...g.querySelectorAll('button,.btn,.MuiButton-root')].map(btnProbe);
      return {
        classes: String(g.className).slice(0, 140),
        bg: s.backgroundColor,
        border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor,
        padding: s.padding,
        gap: s.gap,
        flexDirection: s.flexDirection,
        w: Math.round(r.width),
        h: Math.round(r.height),
        buttons,
      };
    };
    return {
      html: document.documentElement.className,
      muiScheme: document.documentElement.getAttribute('data-mui-color-scheme'),
      bodyBg: getComputedStyle(document.body).backgroundColor,
      h1: document.querySelector('h1')?.textContent?.trim()?.slice(0,80),
      groupCount: groups.length,
      headings: [...document.querySelectorAll('h2, h3, .example-section__title, [class*=\"DemoExample\"] h3, [class*=\"example\"] h3')].map(el => el.textContent.trim()).slice(0, 40),
      contained: pack(first),
      outline: pack(outline),
      disabled: pack(disabled),
      iconOnly: pack(icons),
      vertical: pack(vertical),
    };
  }, btnProbe.toString());

  const firstGroup = page.locator('.btn-group, .MuiButtonGroup-root').first();
  if (await firstGroup.count()) await firstGroup.screenshot({ path: join(outDir, label + '-contained.png') });

  const outlineIdx = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    const oi = groups.findIndex(g => String(g.className).toLowerCase().includes('outline') || String(g.className).includes('Outlined'));
    if (oi >= 0) return oi;
    // last group is often outline on this page
    return groups.length - 1;
  });
  if (outlineIdx >= 0) await page.locator('.btn-group, .MuiButtonGroup-root').nth(outlineIdx).screenshot({ path: join(outDir, label + '-outline.png') });

  const iconIdx = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    return groups.findIndex(g => g.querySelector('[aria-label="Bold"]'));
  });
  if (iconIdx >= 0) await page.locator('.btn-group, .MuiButtonGroup-root').nth(iconIdx).screenshot({ path: join(outDir, label + '-icon-only.png') });

  const disIdx = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    return groups.findIndex(g => [...g.querySelectorAll('button,.btn,.MuiButton-root')].some(b => b.disabled || b.classList.contains('Mui-disabled')));
  });
  if (disIdx >= 0) await page.locator('.btn-group, .MuiButtonGroup-root').nth(disIdx).screenshot({ path: join(outDir, label + '-disabled.png') });

  if (data.vertical) {
    const vIdx = await page.evaluate(() => {
      const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
      return groups.findIndex(g => getComputedStyle(g).flexDirection === 'column' || String(g.className).includes('vertical') || String(g.className).includes('Vertical'));
    });
    if (vIdx >= 0) await page.locator('.btn-group, .MuiButtonGroup-root').nth(vIdx).screenshot({ path: join(outDir, label + '-vertical.png') });
  }

  return data;
}

const result = {
  refLight: await sample('ref-light', 'http://localhost:4321/components/button-groups', false),
  convLight: await sample('conv-light', 'http://localhost:5176/components/button-groups', false),
  refDark: await sample('ref-dark', 'http://localhost:4321/components/button-groups', true),
  convDark: await sample('conv-dark', 'http://localhost:5176/components/button-groups', true),
};

writeFileSync(join(outDir, 'probe.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  refLight: { body: result.refLight.bodyBg, n: result.refLight.groupCount, sel: result.refLight.contained?.buttons?.[0], unsel: result.refLight.contained?.buttons?.[1], outline: result.refLight.outline?.buttons?.[0], dis: result.refLight.disabled?.buttons?.[0], icon: result.refLight.iconOnly?.buttons?.[0] },
  convLight: { body: result.convLight.bodyBg, n: result.convLight.groupCount, sel: result.convLight.contained?.buttons?.[0], unsel: result.convLight.contained?.buttons?.[1], outline: result.convLight.outline?.buttons?.[0], dis: result.convLight.disabled?.buttons?.[0], icon: result.convLight.iconOnly?.buttons?.[0] },
  refDark: { body: result.refDark.bodyBg, n: result.refDark.groupCount, sel: result.refDark.contained?.buttons?.[0], unsel: result.refDark.contained?.buttons?.[1], outline: result.refDark.outline?.buttons?.[0] },
  convDark: { body: result.convDark.bodyBg, n: result.convDark.groupCount, sel: result.convDark.contained?.buttons?.[0], unsel: result.convDark.contained?.buttons?.[1], outline: result.convDark.outline?.buttons?.[0] },
}, null, 2));
await browser.close();
