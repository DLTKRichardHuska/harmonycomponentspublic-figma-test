import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'card-1');
mkdirSync(outDir, { recursive: true });

async function ensureMode(page, url, mode, isRef) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (isRef) {
    await page.evaluate((m) => {
      localStorage.setItem('theme', m);
      localStorage.setItem('colorTheme', 'cp');
      document.documentElement.classList.toggle('dark', m === 'dark');
      document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy');
      document.documentElement.classList.add('theme-cp');
    }, mode);
  } else {
    await page.evaluate((m) => {
      localStorage.setItem('theme', m);
      localStorage.setItem('colorTheme', 'cp');
      localStorage.setItem('harmony-demo-mode', m);
      document.documentElement.classList.toggle('dark', m === 'dark');
      document.documentElement.setAttribute('data-mui-color-scheme', m);
    }, mode);
  }
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  if (!isRef) {
    const darkWanted = mode === 'dark';
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark !== darkWanted) {
      const toggle = page.getByRole('button', { name: /dark|light|mode|theme/i });
      if ((await toggle.count()) > 0) {
        await toggle.first().click().catch(() => {});
        await page.waitForTimeout(800);
      }
    }
  } else {
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if ((mode === 'dark') !== isDark) {
      const toggle = page.getByRole('button', { name: /dark|light|mode/i });
      if ((await toggle.count()) > 0) {
        await toggle.first().click().catch(() => {});
        await page.waitForTimeout(800);
      }
    }
  }
}

function cardSnapshot(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const title = el.querySelector('.card__header-title, .MuiCardHeader-title, h2, .MuiTypography-h5, .MuiTypography-root');
  const subtitle = el.querySelector('.card__header-subtitle, .MuiCardHeader-subheader');
  const body = el.querySelector('.card__body, .MuiCardContent-root');
  const icons = [...el.querySelectorAll('.card__icon-btn, .MuiCardHeader-action .MuiIconButton-root')];
  return {
    w: Math.round(r.width),
    h: Math.round(r.height),
    bg: cs.backgroundColor,
    border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor} / ${cs.borderRightColor}`,
    borderTopWidth: cs.borderTopWidth,
    borderTopColor: cs.borderTopColor,
    radius: cs.borderRadius,
    shadow: cs.boxShadow,
    cursor: cs.cursor,
    title: title ? { text: (title.textContent||'').trim().slice(0,60), fontSize: getComputedStyle(title).fontSize, fontFamily: (getComputedStyle(title).fontFamily||'').split(',')[0].replace(/"/g,''), color: getComputedStyle(title).color, fontWeight: getComputedStyle(title).fontWeight, lineHeight: getComputedStyle(title).lineHeight } : null,
    subtitle: subtitle ? { text: (subtitle.textContent||'').trim().slice(0,60), fontSize: getComputedStyle(subtitle).fontSize, color: getComputedStyle(subtitle).color } : null,
    bodyPad: body ? getComputedStyle(body).padding : null,
    bodyText: body ? (body.textContent||'').trim().slice(0,80) : null,
    bodyFontSize: body ? getComputedStyle(body.querySelector('p, .MuiTypography-root') || body).fontSize : null,
    bodyColor: body ? getComputedStyle(body.querySelector('p, .MuiTypography-root') || body).color : null,
    iconCount: icons.length,
    headerPad: (() => { const h = el.querySelector('.card__header, .MuiCardHeader-root'); return h ? getComputedStyle(h).padding : null; })(),
  };
}

async function inventory(page, label, isRef) {
  return page.evaluate(({ lab, isRef }) => {
    const main = document.querySelector('main, [role="main"], article') || document.body;
    const h1 = document.querySelector('h1');
    const h2s = [...document.querySelectorAll('h2, .section__title, .MuiTypography-h2')].map(el => (el.textContent||'').trim()).filter(Boolean);
    // example group titles
    const exampleTitles = [...document.querySelectorAll('.example-section__title, [class*="DemoExample"], h3')].map(el => (el.textContent||'').trim()).slice(0, 20);
    const cards = [...document.querySelectorAll(isRef ? '.card' : '.MuiCard-root')];
    const callout = document.body.innerText.includes('primary') && (document.body.innerText.includes('not supported') || document.body.innerText.includes('Unsupported') || document.body.innerText.includes('No equivalent'));
    const a11yTitles = [...document.querySelectorAll('.a11y-card__title, [class*="A11y"]')].map(el => (el.textContent||'').trim());
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const title = el.querySelector('.card__header-title, .MuiCardHeader-title');
      const subtitle = el.querySelector('.card__header-subtitle, .MuiCardHeader-subheader');
      const body = el.querySelector('.card__body, .MuiCardContent-root');
      const bodyP = body && (body.querySelector('p, .MuiTypography-root') || body);
      const icons = [...el.querySelectorAll('.card__icon-btn, .MuiCardHeader-action .MuiIconButton-root')];
      const header = el.querySelector('.card__header, .MuiCardHeader-root');
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: cs.backgroundColor,
        borderTopWidth: cs.borderTopWidth,
        borderTopColor: cs.borderTopColor,
        borderColor: cs.borderColor,
        radius: cs.borderRadius,
        shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0, 80),
        cursor: cs.cursor,
        title: title ? { text: (title.textContent||'').trim(), fontSize: getComputedStyle(title).fontSize, fontFamily: (getComputedStyle(title).fontFamily||'').split(',')[0].replace(/"/g,''), color: getComputedStyle(title).color, lineHeight: getComputedStyle(title).lineHeight, fontWeight: getComputedStyle(title).fontWeight } : null,
        subtitle: subtitle ? { text: (subtitle.textContent||'').trim(), fontSize: getComputedStyle(subtitle).fontSize, color: getComputedStyle(subtitle).color } : null,
        bodyPad: body ? getComputedStyle(body).padding : null,
        bodyFontSize: bodyP ? getComputedStyle(bodyP).fontSize : null,
        bodyColor: bodyP ? getComputedStyle(bodyP).color : null,
        bodyText: body ? (body.textContent||'').trim().slice(0,100) : null,
        iconCount: icons.length,
        headerPad: header ? getComputedStyle(header).padding : null,
        classes: String(el.className||'').slice(0,120),
      };
    };
    return {
      label: lab,
      dark: document.documentElement.classList.contains('dark'),
      h1: h1 ? (h1.textContent||'').trim() : null,
      pageTextHasPrimaryCallout: /primary.*(not supported|unsupported|no prop|no equivalent)/i.test(document.body.innerText) || /UnsupportedEquivalent|not supported — see Primary/i.test(document.body.innerText),
      headings: h2s.slice(0, 15),
      exampleTitles: [...document.querySelectorAll('.example-section h3, .example-section__title, h3')].map(e => (e.textContent||'').trim()).filter(t => t && t.length < 80).slice(0, 20),
      cardCount: cards.length,
      cards: cards.map(styleOf),
      a11y: [...document.querySelectorAll('.a11y-card__title')].map(e => (e.textContent||'').replace(/\s+/g,' ').trim()),
      hasProps: !!document.querySelector('#props'),
      hasA11y: !!document.querySelector('#accessibility'),
      hasMapping: !!document.querySelector('#mapping'),
      sectionsPresent: {
        basic: /Basic Card/i.test(document.body.innerText),
        withHeader: /Card with Header/i.test(document.body.innerText),
        headerIcons: /Header Icons/i.test(document.body.innerText),
        elevated: /Elevated Card/i.test(document.body.innerText),
        interactive: /Interactive Card/i.test(document.body.innerText),
        primary: /Primary Border Card/i.test(document.body.innerText),
        primaryOther: /Primary Border \+ Other/i.test(document.body.innerText) || /Primary \+ Elevated/i.test(document.body.innerText),
        elevatedInteractive: /Elevated \+ Interactive|Elevated Interactive/i.test(document.body.innerText),
      }
    };
  }, { lab: label, isRef });
}

async function shot(page, name) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: join(outDir, name + '-page.png'), fullPage: true });
  const examples = page.locator('#examples');
  if (await examples.count()) {
    await examples.first().screenshot({ path: join(outDir, name + '-examples.png') });
  }
  const a11y = page.locator('#accessibility');
  if (await a11y.count()) {
    await a11y.first().screenshot({ path: join(outDir, name + '-a11y.png') });
  }
}

const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString(), surfaces: {} };

for (const mode of ['light', 'dark']) {
  for (const [key, url, isRef] of [
    ['ref', 'http://localhost:4321/components/cards', true],
    ['conv', 'http://localhost:5176/components/cards', false],
  ]) {
    const page = await browser.newPage();
    await ensureMode(page, url, mode, isRef);
    const inv = await inventory(page, `${key}-${mode}`, isRef);
    result.surfaces[`${key}-${mode}`] = inv;
    await shot(page, `${key}-${mode}`);
    // hover first interactive card on light for converted and ref
    if (mode === 'light') {
      const sel = isRef ? '.card--interactive' : '.MuiCardActionArea-root';
      const el = page.locator(sel).first();
      if (await el.count()) {
        await el.hover();
        await page.waitForTimeout(400);
        const hoverStyles = await page.evaluate((s) => {
          const card = document.querySelector(s.includes('interactive') ? '.card--interactive' : '.MuiCard-root:has(.MuiCardActionArea-root)');
          if (!card) return null;
          const cs = getComputedStyle(card);
          return { borderColor: cs.borderColor, shadow: cs.boxShadow.slice(0,100), cursor: cs.cursor };
        }, sel);
        result.surfaces[`${key}-${mode}`].interactiveHover = hoverStyles;
        await page.locator(isRef ? '.card--interactive' : '.MuiCard-root:has(.MuiCardActionArea-root)').first().screenshot({ path: join(outDir, `${key}-${mode}-interactive-hover.png`) });
      }
    }
    await page.close();
  }
}

// preview route sanity
const prev = await browser.newPage();
await ensureMode(prev, 'http://localhost:4321/preview/cards', 'light', true);
result.previewCards = await prev.evaluate(() => ({
  cardCount: document.querySelectorAll('.card').length,
  primaryTop: [...document.querySelectorAll('.card')].map(c => ({
    topW: getComputedStyle(c).borderTopWidth,
    topC: getComputedStyle(c).borderTopColor,
    classes: c.className,
  })),
}));
await prev.screenshot({ path: join(outDir, 'ref-preview-light.png'), fullPage: true });
await prev.close();

writeFileSync(join(outDir, 'probe.json'), JSON.stringify(result, null, 2));
console.log('Wrote', join(outDir, 'probe.json'));
console.log(JSON.stringify({
  refLightCards: result.surfaces['ref-light']?.cardCount,
  convLightCards: result.surfaces['conv-light']?.cardCount,
  refSections: result.surfaces['ref-light']?.sectionsPresent,
  convSections: result.surfaces['conv-light']?.sectionsPresent,
  callout: result.surfaces['conv-light']?.pageTextHasPrimaryCallout,
}, null, 2));
await browser.close();
