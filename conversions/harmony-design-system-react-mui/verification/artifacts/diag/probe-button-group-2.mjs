import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const outDir = 'conversions/harmony-design-system-react-mui/verification/artifacts/button-group-2';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function ensureMode(wantDark) {
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
      || document.documentElement.getAttribute('data-mui-color-scheme') === 'dark'
      || getComputedStyle(document.body).backgroundColor === 'rgb(31, 37, 46)';
  });
  if (wantDark !== isDark) {
    const toggle = page.locator('button[aria-label="Toggle color mode"], button[aria-label*="mode" i], button[aria-label*="Dark" i], button[aria-label*="Light" i]').first();
    if (await toggle.count()) {
      await toggle.click();
      await page.waitForTimeout(700);
    } else {
      await page.evaluate((dark) => {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        localStorage.setItem('harmony-demo-mode', dark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.setAttribute('data-mui-color-scheme', dark ? 'dark' : 'light');
      }, wantDark);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(700);
    }
  }
  // Ensure CP product
  await page.evaluate(() => {
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-theme', 'cp');
    document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-cp');
  });
}

function btnProbe(b) {
  const s = getComputedStyle(b);
  const r = b.getBoundingClientRect();
  const svg = b.querySelector('svg, .MuiSvgIcon-root');
  const sr = svg?.getBoundingClientRect();
  return {
    text: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40),
    bg: s.backgroundColor,
    color: s.color,
    border: s.border,
    borderRadius: s.borderRadius,
    padding: s.padding,
    opacity: s.opacity,
    disabled: b.disabled || b.classList.contains('Mui-disabled') || b.classList.contains('btn--disabled') || b.hasAttribute('disabled'),
    w: Math.round(r.width),
    h: Math.round(r.height),
    fontSize: s.fontSize,
    icon: sr ? { w: Math.round(sr.width), h: Math.round(sr.height) } : null,
    classes: String(b.className).slice(0, 120),
  };
}

async function samplePage(label, wantDark) {
  await ensureMode(wantDark);
  await page.waitForTimeout(400);
  const data = await page.evaluate((btnProbeSrc) => {
    // eslint-disable-next-line no-new-func
    const btnProbe = new Function('return (' + btnProbeSrc + ')')();
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    const findByAria = (aria) => groups.find((g) => g.querySelector(`[aria-label="${aria}"]`));
    const findOutline = () =>
      document.querySelector('.btn-group--outline, .MuiButtonGroup-outlined') ||
      groups.find((g) => String(g.className).includes('outline') || String(g.className).includes('Outlined'));
    const findDisabled = () =>
      groups.find((g) => [...g.querySelectorAll('button,.btn,.MuiButton-root')].some((b) => b.disabled || b.classList.contains('Mui-disabled')));
    const first = groups[0];
    const outline = findOutline();
    const icons = findByAria('Bold');
    const disabled = findDisabled();
    const pack = (g) => {
      if (!g) return null;
      const cs = getComputedStyle(g);
      return {
        classes: String(g.className).slice(0, 180),
        bg: cs.backgroundColor,
        border: cs.border,
        padding: cs.padding,
        gap: cs.gap,
        flexDirection: cs.flexDirection,
        w: Math.round(g.getBoundingClientRect().width),
        h: Math.round(g.getBoundingClientRect().height),
        buttons: [...g.querySelectorAll('button,.btn,.MuiButton-root')].map(btnProbe),
      };
    };
    return {
      html: document.documentElement.className,
      muiScheme: document.documentElement.getAttribute('data-mui-color-scheme'),
      bodyBg: getComputedStyle(document.body).backgroundColor,
      primary: getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-primary-main').trim(),
      textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-text-primary').trim(),
      inputBg: getComputedStyle(document.documentElement).getPropertyValue('--input-bg').trim() || getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-background-paper').trim(),
      h1: document.querySelector('h1')?.textContent?.trim(),
      groupCount: groups.length,
      contained: pack(first),
      outline: pack(outline),
      iconOnly: pack(icons),
      disabled: pack(disabled),
    };
  }, btnProbe.toString());

  const prefix = `${label}-${wantDark ? 'dark' : 'light'}`;
  await page.screenshot({ path: join(outDir, `${prefix}-page.png`), fullPage: false });
  const containedSel = label.startsWith('ref') ? '.btn-group' : '.MuiButtonGroup-root';
  const outlineSel = label.startsWith('ref') ? '.btn-group--outline' : '.MuiButtonGroup-outlined';
  await page.locator(containedSel).first().screenshot({ path: join(outDir, `${prefix}-contained.png`) });
  if (await page.locator(outlineSel).count()) {
    await page.locator(outlineSel).first().screenshot({ path: join(outDir, `${prefix}-outline.png`) });
  }
  const iconLoc = page.locator(containedSel).filter({ has: page.locator('[aria-label="Bold"]') }).first();
  if (await iconLoc.count()) await iconLoc.screenshot({ path: join(outDir, `${prefix}-icon-only.png`) });
  // disabled group screenshot
  const disabledIdx = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.btn-group, .MuiButtonGroup-root')];
    return groups.findIndex((g) => [...g.querySelectorAll('button,.btn,.MuiButton-root')].some((b) => b.disabled || b.classList.contains('Mui-disabled')));
  });
  if (disabledIdx >= 0) {
    await page.locator(containedSel).nth(disabledIdx).screenshot({ path: join(outDir, `${prefix}-disabled.png`) });
  }
  return data;
}

const result = {};

await page.goto('http://localhost:4321/components/button-groups', { waitUntil: 'networkidle', timeout: 60000 });
result.refLight = await samplePage('ref', false);
result.refDark = await samplePage('ref', true);

await page.goto('http://localhost:5176/components/button-groups', { waitUntil: 'networkidle', timeout: 60000 });
result.convLight = await samplePage('conv', false);
result.convDark = await samplePage('conv', true);

// Also capture vertical + sizes lightly in light for regression
await ensureMode(false);
result.convLightExtra = await page.evaluate(() => {
  const groups = [...document.querySelectorAll('.MuiButtonGroup-root')];
  const vertical = groups.find((g) => g.classList.contains('MuiButtonGroup-vertical'));
  const pack = (g) => {
    if (!g) return null;
    const cs = getComputedStyle(g);
    return {
      bg: cs.backgroundColor,
      gap: cs.gap,
      pad: cs.padding,
      flexDirection: cs.flexDirection,
      buttons: [...g.querySelectorAll('.MuiButton-root')].map((b) => {
        const s = getComputedStyle(b);
        return { t: b.textContent.trim(), bg: s.backgroundColor, c: s.color, h: s.height, fs: s.fontSize };
      }),
    };
  };
  return { vertical: pack(vertical), first3: groups.slice(0, 3).map(pack) };
});

writeFileSync(join(outDir, 'probe.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify({
  refLightContained: result.refLight.contained,
  convLightContained: result.convLight.contained,
  refDarkContained: result.refDark.contained,
  convDarkContained: result.convDark.contained,
  refLightOutline: result.refLight.outline,
  convLightOutline: result.convLight.outline,
  refDarkOutline: result.refDark.outline,
  convDarkOutline: result.convDark.outline,
  refLightDisabled: result.refLight.disabled,
  convLightDisabled: result.convLight.disabled,
  refLightIcons: result.refLight.iconOnly,
  convLightIcons: result.convLight.iconOnly,
  modes: {
    refL: { html: result.refLight.html, body: result.refLight.bodyBg },
    refD: { html: result.refDark.html, body: result.refDark.bodyBg },
    convL: { html: result.convLight.html, body: result.convLight.bodyBg, primary: result.convLight.primary, scheme: result.convLight.muiScheme },
    convD: { html: result.convDark.html, body: result.convDark.bodyBg, primary: result.convDark.primary, scheme: result.convDark.muiScheme },
  }
}, null, 2));
await browser.close();
