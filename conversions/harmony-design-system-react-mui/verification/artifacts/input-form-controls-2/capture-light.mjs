import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(out, { recursive: true });

async function goto(page, url) {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    document.documentElement.classList.remove('dark');
  });
  const cp = page.getByRole('button', { name: /^CP$/i });
  if (await cp.count()) await cp.first().click({ timeout: 2000 }).catch(() => {});
  let dark = await page.evaluate(() => {
    const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
    return m && (+m[0] + +m[1] + +m[2]) / 3 < 120;
  });
  if (dark) {
    const toggles = page.locator('header button, [class*="header"] button, nav button');
    const n = await toggles.count();
    for (let i = 0; i < Math.min(n, 16); i++) {
      const label = (await toggles.nth(i).getAttribute('aria-label')) || '';
      const title = (await toggles.nth(i).getAttribute('title')) || '';
      if (/dark|light|mode|theme|appearance/i.test(label + ' ' + title)) {
        await toggles.nth(i).click().catch(() => {});
        await page.waitForTimeout(350);
        dark = await page.evaluate(() => {
          const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
          return m && (+m[0] + +m[1] + +m[2]) / 3 < 120;
        });
        if (!dark) break;
      }
    }
  }
  if (dark) {
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle' });
    const cp2 = page.getByRole('button', { name: /^CP$/i });
    if (await cp2.count()) await cp2.first().click({ timeout: 2000 }).catch(() => {});
  }
  await page.waitForTimeout(250);
}

async function clipGroup(page, file, pickFn) {
  const box = await page.evaluate(pickFn);
  if (!box || box.h < 20) {
    console.log(' miss', file);
    return false;
  }
  // scroll so y is on screen
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 80)), box.y + (await page.evaluate(() => window.scrollY)));
  const box2 = await page.evaluate(pickFn);
  if (!box2) return false;
  const vp = page.viewportSize();
  const x = Math.max(0, Math.min(box2.x, vp.width - 10));
  const y = Math.max(0, Math.min(box2.y, vp.height - 10));
  const w = Math.min(box2.w, vp.width - x);
  const h = Math.min(box2.h, vp.height - y);
  if (w < 10 || h < 10) {
    console.log(' empty clip', file, { x, y, w, h, box2 });
    return false;
  }
  await page.screenshot({ path: file, clip: { x, y, width: w, height: h } });
  return true;
}

const browser = await chromium.launch({ headless: true });
const probe = {};

for (const side of [
  { name: 'ref', base: 'http://localhost:4321' },
  { name: 'conv', base: 'http://localhost:5176' },
]) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 },
    colorScheme: 'light',
  });
  const page = await context.newPage();
  for (const route of [
    { key: 'inputs', path: '/components/inputs' },
    { key: 'labels', path: '/components/labels' },
    { key: 'specialty', path: '/components/specialty-inputs' },
  ]) {
    console.log(side.name, route.key);
    await goto(page, side.base + route.path);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(' bg', bg);
    await page.screenshot({ path: join(out, `${side.name}-${route.key}-light-page.png`) });

    probe[`${side.name}-${route.key}`] = await page.evaluate(() => {
      const errInput = [...document.querySelectorAll('#examples input')].find(
        (i) => i.getAttribute('aria-invalid') === 'true' || i.classList.contains('input--error'),
      );
      let error = null;
      if (errInput) {
        const root = errInput.closest('.MuiOutlinedInput-root') || errInput;
        const fs = root.querySelector?.('fieldset');
        const desc = errInput.getAttribute('aria-describedby');
        const helper =
          (desc && document.getElementById(desc)) ||
          document.querySelector('#examples .MuiFormHelperText-root, #examples .input-wrapper__error');
        error = {
          border: fs ? getComputedStyle(fs).borderColor : getComputedStyle(root).borderColor,
          helperColor: helper ? getComputedStyle(helper).color : null,
          helperText: helper?.textContent?.trim(),
        };
      }
      const numRoot =
        document.querySelector('#examples .number-input') ||
        document
          .querySelector('#examples [aria-label="Decrement"], #examples [aria-label="Decrease"]')
          ?.closest('.MuiOutlinedInput-root');
      const wrap = document.querySelector('#examples .range-wrap, #examples .MuiSlider-root');
      const a11ySec = document.querySelector('#accessibility');
      let a11yCardTitles = [];
      if (a11ySec) {
        // Demo A11yCard titles are typically bold/subtitle near top of each card
        a11yCardTitles = [...a11ySec.querySelectorAll('h3, h4, .MuiTypography-subtitle1, .MuiTypography-subtitle2, strong')]
          .map((t) => t.textContent.trim())
          .filter((t) => t && t.length < 60);
        if (!a11yCardTitles.length) {
          // fallback: scan for known titles in section text blocks
          const text = a11ySec.innerText;
          for (const title of [
            'Label Association',
            'Required Indicators',
            'Screen Reader Support',
            'Semantic HTML',
            'Labels',
            'Error Announcements',
          ]) {
            if (text.includes(title)) a11yCardTitles.push(title);
          }
        }
      }
      return {
        pageBg: getComputedStyle(document.body).backgroundColor,
        error,
        num: numRoot
          ? {
              w: Math.round(numRoot.getBoundingClientRect().width),
              h: Math.round(numRoot.getBoundingClientRect().height),
            }
          : null,
        range: wrap
          ? {
              track: (() => {
                const t = wrap.querySelector('.MuiSlider-track');
                return t ? getComputedStyle(t).backgroundColor : null;
              })(),
              rail: (() => {
                const t = wrap.querySelector('.MuiSlider-rail');
                return t ? getComputedStyle(t).backgroundColor : null;
              })(),
              thumb: (() => {
                const t = wrap.querySelector('.MuiSlider-thumb');
                return t ? getComputedStyle(t).backgroundColor : null;
              })(),
              accent: (() => {
                const n = wrap.querySelector('input[type=range]');
                return n ? getComputedStyle(n).accentColor : null;
              })(),
            }
          : null,
        a11yCardTitles,
        headings: [...document.querySelectorAll('h1,h2,h3')]
          .map((h) => h.textContent.trim())
          .filter((t) => t.length < 60)
          .slice(0, 50),
      };
    });

    if (route.key === 'inputs') {
      await page.locator('#examples h3', { hasText: 'States' }).first().scrollIntoViewIfNeeded().catch(() => {});
      await clipGroup(page, join(out, `${side.name}-inputs-states.png`), () => {
        const hs = [...document.querySelectorAll('#examples h3')].find((el) =>
          el.textContent.trim().startsWith('States'),
        );
        if (!hs) return null;
        let g = hs;
        while (g.parentElement && g.parentElement.id !== 'examples') g = g.parentElement;
        const r = g.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: Math.min(r.height + 8, 700) };
      });
    }
    if (route.key === 'specialty') {
      const stepperHeading = page.locator('#examples h3').filter({ hasText: /Number Input/ }).first();
      await stepperHeading.scrollIntoViewIfNeeded().catch(() => {});
      await clipGroup(page, join(out, `${side.name}-specialty-number-steppers.png`), () => {
        const hs = [...document.querySelectorAll('#examples h3')];
        for (const h of hs) {
          const t = h.textContent.trim();
          if (t === 'Number Input with steppers' || t.startsWith('Number Input')) {
            let g = h;
            while (g.parentElement && g.parentElement.id !== 'examples') g = g.parentElement;
            if (g.querySelector('button') || g.querySelector('.number-input') || t.includes('steppers')) {
              const r = g.getBoundingClientRect();
              return { x: r.x, y: r.y, w: r.width, h: Math.min(r.height + 8, 500) };
            }
          }
        }
        return null;
      });
      await page.locator('#examples h3', { hasText: 'Range Input' }).first().scrollIntoViewIfNeeded().catch(() => {});
      await clipGroup(page, join(out, `${side.name}-specialty-range-input.png`), () => {
        const hs = [...document.querySelectorAll('#examples h3')].find(
          (el) => el.textContent.trim() === 'Range Input',
        );
        if (!hs) return null;
        let g = hs;
        while (g.parentElement && g.parentElement.id !== 'examples') g = g.parentElement;
        const r = g.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: Math.min(r.height + 8, 400) };
      });
    }
    if (route.key === 'labels') {
      await page.locator('#accessibility').first().scrollIntoViewIfNeeded().catch(() => {});
      const a11y = page.locator('#accessibility');
      if (await a11y.count()) {
        try {
          await a11y.first().screenshot({ path: join(out, `${side.name}-labels-a11y.png`) });
        } catch (e) {
          console.log('a11y shot fail', e.message);
        }
      }
    }
  }
  await context.close();
}

writeFileSync(join(out, 'probe-light.json'), JSON.stringify(probe, null, 2));
console.log(JSON.stringify(probe, null, 2));
await browser.close();
