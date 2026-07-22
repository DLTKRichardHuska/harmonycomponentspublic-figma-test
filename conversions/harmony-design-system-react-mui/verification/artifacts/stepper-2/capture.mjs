import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    localStorage.setItem('harmony-theme', 'cp');
    localStorage.setItem('harmony-mode', 'light');
    const de = document.documentElement;
    de.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    de.classList.add('theme-cp');
    de.dataset.theme = 'cp';
    de.dataset.mode = 'light';
  });
}

// Probe StepIcon rendering: fill of the SVG circle + border/outline + number color.
async function probeStepIcons(page) {
  return page.evaluate(() => {
    const round = (s) => (s || '').trim();
    const icons = [...document.querySelectorAll('.MuiStepIcon-root, .stepper__indicator, [class*="indicator"]')];
    const out = [];
    for (const el of icons.slice(0, 24)) {
      const cs = getComputedStyle(el);
      const cls = el.getAttribute('class') || '';
      const state = /Mui-active|active/.test(cls) ? 'active'
        : /Mui-completed|completed/.test(cls) ? 'completed'
        : /Mui-error|error/.test(cls) ? 'error'
        : /Mui-disabled|disabled/.test(cls) ? 'disabled'
        : 'idle';
      // svg fill (MUI StepIcon is an <svg> with class MuiStepIcon-root)
      const fill = round(cs.fill);
      const color = round(cs.color);
      const border = round(cs.border || `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`);
      const textEl = el.querySelector('.MuiStepIcon-text');
      const textFill = textEl ? round(getComputedStyle(textEl).fill) : '';
      out.push({ tag: el.tagName.toLowerCase(), state, fill, color, border, textFill });
    }
    // Active step label color
    const activeLabels = [...document.querySelectorAll('.MuiStepLabel-label.Mui-active, .stepper__label--active, [class*="label"][class*="active"]')].map((l) => {
      const cs = getComputedStyle(l);
      return { text: (l.textContent || '').trim().slice(0, 40), color: cs.color, fontWeight: cs.fontWeight };
    });
    return { icons: out, activeLabels };
  });
}

async function captureSide(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: 'networkidle' });
  await applyCpLight(page);
  await page.waitForTimeout(800);

  writeFileSync(join(art, `${prefix}-full.png`), await page.screenshot({ type: 'png', fullPage: true }));

  const ex = page.locator('#examples').first();
  if (await ex.count()) {
    await ex.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(200);
    writeFileSync(join(art, `${prefix}-examples.png`), await ex.screenshot({ type: 'png' }).catch(() => Buffer.from('')));
  }

  const probe = await probeStepIcons(page);
  writeFileSync(join(art, `${prefix}-probe.json`), JSON.stringify(probe, null, 2));
  console.log(prefix, 'done', JSON.stringify({ icons: probe.icons.length, activeLabels: probe.activeLabels.length }));
  await browser.close();
}

await captureSide('http://localhost:4321/components/stepper', 'ref-stepper');
await captureSide('http://localhost:5176/components/stepper', 'conv-stepper');
console.log('all done');
