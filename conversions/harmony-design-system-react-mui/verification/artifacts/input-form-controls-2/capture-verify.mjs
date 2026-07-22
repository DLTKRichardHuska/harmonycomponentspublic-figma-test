import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = dirname(fileURLToPath(import.meta.url));
mkdirSync(out, { recursive: true });

async function goto(page, url, isConv) {
  if (isConv) {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('colorTheme', 'cp');
    });
  }
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (isConv) {
    const dark = await page.evaluate(() => {
      const m = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
      return m && (+m[0] + +m[1] + +m[2]) / 3 < 100;
    });
    if (dark) {
      await page.evaluate(() => {
        localStorage.setItem('theme', 'light');
        localStorage.setItem('colorTheme', 'cp');
      });
      await page.reload({ waitUntil: 'networkidle' });
    }
  }
  const cp = page.getByRole('button', { name: /^CP$/i });
  if (await cp.count()) await cp.first().click({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(300);
}

async function clipHeading(page, file, heading) {
  const h = page.locator('#examples h3').filter({ hasText: heading }).first();
  if (!(await h.count())) {
    console.log('no heading', heading);
    return false;
  }
  await h.scrollIntoViewIfNeeded();
  const box = await page.evaluate((text) => {
    const hs = [...document.querySelectorAll('#examples h3')].find(
      (el) => el.textContent.trim() === text || el.textContent.trim().startsWith(text),
    );
    if (!hs) return null;
    let group = hs;
    while (group.parentElement && group.parentElement.id !== 'examples') {
      group = group.parentElement;
    }
    const r = group.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: Math.min(r.height, 850) };
  }, heading);
  if (!box || box.h < 20) return false;
  await page.screenshot({
    path: file,
    clip: {
      x: Math.max(0, box.x),
      y: Math.max(0, box.y),
      width: Math.min(box.w, 900),
      height: Math.max(box.h, 40),
    },
  });
  return true;
}

async function measure(page) {
  return page.evaluate(() => {
    function fieldByLabel(start) {
      const labs = [...document.querySelectorAll('#examples label, #examples .MuiFormLabel-root')];
      const lab = labs.find((l) => (l.textContent || '').trim().startsWith(start));
      if (!lab) return null;
      const id = lab.getAttribute('for');
      const input =
        (id && document.getElementById(id)) || lab.parentElement?.querySelector('input,textarea');
      if (!input) return null;
      const measureEl =
        input.closest('.MuiOutlinedInput-root') ||
        (input.matches('.input,.textarea') ? input : input);
      const r = measureEl.getBoundingClientRect();
      const cs = getComputedStyle(measureEl);
      const fieldset = measureEl.querySelector?.('fieldset');
      return {
        label: lab.textContent.trim().slice(0, 40),
        h: Math.round(r.height),
        w: Math.round(r.width),
        bg: cs.backgroundColor,
        color: getComputedStyle(input).color,
        fs: getComputedStyle(input).fontSize,
        radius: cs.borderRadius,
        border: fieldset ? getComputedStyle(fieldset).borderColor : cs.borderColor,
      };
    }

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
        helperText: helper?.textContent?.trim(),
        helperColor: helper ? getComputedStyle(helper).color : null,
        helperFs: helper ? getComputedStyle(helper).fontSize : null,
        helperClass: helper?.className?.toString?.().slice(0, 100),
      };
    }

    const numRoot =
      document.querySelector('#examples .number-input') ||
      document
        .querySelector('#examples [aria-label="Decrement"], #examples [aria-label="Decrease"]')
        ?.closest('.MuiOutlinedInput-root');
    const num = numRoot
      ? {
          kind: numRoot.className.toString().slice(0, 70),
          h: Math.round(numRoot.getBoundingClientRect().height),
          w: Math.round(numRoot.getBoundingClientRect().width),
          bg: getComputedStyle(numRoot).backgroundColor,
          border: getComputedStyle(numRoot).border,
          btnW: (() => {
            const btn = numRoot.querySelector('button');
            return btn ? Math.round(btn.getBoundingClientRect().width) : null;
          })(),
          btnBg: (() => {
            const btn = numRoot.querySelector('button');
            return btn ? getComputedStyle(btn).backgroundColor : null;
          })(),
        }
      : null;

    const wrap = document.querySelector('#examples .range-wrap, #examples .MuiSlider-root');
    const range = wrap
      ? {
          kind: wrap.className.toString().slice(0, 70),
          w: Math.round(wrap.getBoundingClientRect().width),
          thumb: (() => {
            const thumb = wrap.querySelector('.MuiSlider-thumb');
            return thumb
              ? {
                  bg: getComputedStyle(thumb).backgroundColor,
                  size: Math.round(thumb.getBoundingClientRect().width),
                }
              : null;
          })(),
          track: (() => {
            const track = wrap.querySelector('.MuiSlider-track');
            return track ? getComputedStyle(track).backgroundColor : null;
          })(),
          rail: (() => {
            const rail = wrap.querySelector('.MuiSlider-rail');
            return rail ? getComputedStyle(rail).backgroundColor : null;
          })(),
          value: (() => {
            const value = wrap.parentElement?.querySelector('.range-value, .MuiTypography-root');
            return value
              ? {
                  text: value.textContent.trim(),
                  color: getComputedStyle(value).color,
                  fs: getComputedStyle(value).fontSize,
                }
              : null;
          })(),
          accent: (() => {
            const native = wrap.querySelector?.('input.range, input[type=range]') || (wrap.matches?.('input') ? wrap : null);
            return native ? getComputedStyle(native).accentColor : null;
          })(),
        }
      : null;

    const req = [...document.querySelectorAll('#examples label, #examples .MuiFormLabel-root')]
      .filter((l) => /\*|Email Address|First Name/.test(l.textContent || ''))
      .slice(0, 4)
      .map((l) => ({
        text: l.textContent.trim(),
        after: getComputedStyle(l, '::after').content,
        afterColor: getComputedStyle(l, '::after').color,
        asterisk: (() => {
          const a = l.querySelector('.MuiFormLabel-asterisk');
          return a ? getComputedStyle(a).color : null;
        })(),
      }));

    const a11yTitles = [
      ...document.querySelectorAll(
        '#accessibility h3, #accessibility .a11y-card__title, #accessibility .MuiTypography-h6',
      ),
    ].map((t) => t.textContent.trim());

    const helperLabel = [...document.querySelectorAll('#examples label, #examples .MuiFormLabel-root')].find(
      (l) => /optional/i.test(l.textContent || ''),
    );
    const helperSpan = helperLabel?.querySelector('.label__helper, .MuiTypography-caption, span');

    return {
      pageBg: getComputedStyle(document.body).backgroundColor,
      email: fieldByLabel('Email'),
      defaultState: fieldByLabel('Default'),
      disabled: fieldByLabel('Disabled'),
      error,
      num,
      range,
      req,
      a11yTitles,
      helperSample: helperLabel
        ? {
            text: helperLabel.textContent.trim(),
            helperColor: helperSpan ? getComputedStyle(helperSpan).color : null,
          }
        : null,
      headings: [...document.querySelectorAll('h1,h2,h3')]
        .map((h) => h.textContent.trim())
        .filter((t) => t.length < 60)
        .slice(0, 40),
    };
  });
}

const clips = {
  inputs: ['States', 'Textarea', 'With Label (Inline)', 'Form Example', 'Trailing icon and slot'],
  labels: ['Required Label', 'With Helper Text'],
  specialty: ['Number Input with steppers', 'Number Input', 'Range Input', 'Range Input With Label', 'URL Input'],
};

const browser = await chromium.launch({ headless: true });
const report = {};

for (const side of [
  { name: 'ref', base: 'http://localhost:4321', conv: false },
  { name: 'conv', base: 'http://localhost:5176', conv: true },
]) {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 1000 },
    colorScheme: 'light',
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  for (const route of [
    { key: 'inputs', path: '/components/inputs' },
    { key: 'labels', path: '/components/labels' },
    { key: 'specialty', path: '/components/specialty-inputs' },
  ]) {
    console.log(side.name, route.key);
    await goto(page, side.base + route.path, side.conv);
    report[`${side.name}-${route.key}`] = await measure(page);
    for (const c of clips[route.key] || []) {
      const file = join(
        out,
        `${side.name}-${route.key}-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      );
      const ok = await clipHeading(page, file, c);
      console.log(' clip', c, ok);
    }
  }
  await context.close();
}

writeFileSync(join(out, 'probe-final.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
