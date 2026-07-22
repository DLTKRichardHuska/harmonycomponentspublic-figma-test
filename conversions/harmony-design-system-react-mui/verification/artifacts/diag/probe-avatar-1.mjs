import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'avatar-1');
mkdirSync(outDir, { recursive: true });

async function ensureMode(page, url, mode, isRef) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (isRef) {
    await page.evaluate((m) => {
      localStorage.setItem('theme', m);
      localStorage.setItem('colorTheme', 'cp');
      document.documentElement.classList.toggle('dark', m === 'dark');
      document.documentElement.setAttribute('data-theme', 'theme-cp');
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
  await page.waitForTimeout(1500);

  if (!isRef) {
    const darkWanted = mode === 'dark';
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (isDark !== darkWanted) {
      const candidates = [page.getByRole('button', { name: /dark|light|mode|theme/i })];
      for (const c of candidates) {
        if ((await c.count()) > 0) {
          await c.first().click().catch(() => {});
          await page.waitForTimeout(800);
          break;
        }
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

async function probeAvatars(page, label) {
  return page.evaluate((lab) => {
    const styleOfInner = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const img = el.querySelector('img');
      const svg = el.querySelector('svg');
      const svgR = svg ? svg.getBoundingClientRect() : null;
      return {
        tag: el.tagName.toLowerCase(),
        className: String(el.className || '').slice(0, 140),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: cs.backgroundColor,
        color: cs.color,
        radius: cs.borderRadius,
        opacity: cs.opacity,
        boxShadow: cs.boxShadow,
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
        outlineOffset: cs.outlineOffset,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: (cs.fontFamily || '').split(',')[0].replace(/"/g, ''),
        text: (el.textContent || '').trim().slice(0, 40),
        svg: svgR ? { w: Math.round(svgR.width), h: Math.round(svgR.height) } : null,
        img: img
          ? {
              w: Math.round(img.getBoundingClientRect().width),
              h: Math.round(img.getBoundingClientRect().height),
              complete: img.complete,
            }
          : null,
      };
    };

    const html = document.documentElement;
    const allAvatars = [...document.querySelectorAll('.avatar, .MuiAvatar-root')];
    const buttons = [...document.querySelectorAll('button.avatar, button.MuiButtonBase-root')].filter(
      (b) => b.classList.contains('avatar') || b.querySelector('.MuiAvatar-root'),
    );

    return {
      label: lab,
      dark: html.classList.contains('dark'),
      colorScheme: html.getAttribute('data-mui-color-scheme'),
      dataTheme: html.getAttribute('data-theme'),
      pageBg: getComputedStyle(document.body).backgroundColor,
      sectionTitles: [...document.querySelectorAll('h2, h3')]
        .map((h) => (h.textContent || '').trim())
        .filter(Boolean)
        .slice(0, 40),
      avatarCount: allAvatars.length,
      avatars: allAvatars.slice(0, 24).map((el, i) => ({ i, ...styleOfInner(el) })),
      interactive: buttons.slice(0, 8).map((el, i) => ({
        i,
        ...styleOfInner(el),
        childAvatar: styleOfInner(el.querySelector('.MuiAvatar-root') || el),
      })),
    };
  }, label);
}

const browser = await chromium.launch({ headless: true });
const report = {};

for (const mode of ['light', 'dark']) {
  const ref = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
  await ensureMode(ref, 'http://localhost:4321/components/avatar', mode, true);
  await ref.screenshot({ path: join(outDir, 'ref-' + mode + '-page.png'), fullPage: true });
  const refExamples = ref.locator('#examples');
  if ((await refExamples.count()) > 0) {
    await refExamples.screenshot({ path: join(outDir, 'ref-' + mode + '-examples.png') });
  }
  report['ref-' + mode] = await probeAvatars(ref, 'ref-' + mode);
  await ref.close();

  const conv = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
  await ensureMode(conv, 'http://localhost:5176/components/avatar', mode, false);
  await conv.screenshot({ path: join(outDir, 'conv-' + mode + '-page.png'), fullPage: true });
  const convExamples = conv.locator('#examples');
  if ((await convExamples.count()) > 0) {
    await convExamples.screenshot({ path: join(outDir, 'conv-' + mode + '-examples.png') });
  }
  report['conv-' + mode] = await probeAvatars(conv, 'conv-' + mode);
  await conv.close();
}

writeFileSync(join(outDir, 'probe.json'), JSON.stringify(report, null, 2));
console.log('wrote', outDir);
for (const key of Object.keys(report)) {
  const r = report[key];
  console.log(
    key,
    'dark=',
    r.dark,
    'avatars=',
    r.avatarCount,
    'sizes=',
    (r.avatars || []).slice(0, 6).map((a) => a.w + 'x' + a.h + ' r=' + a.radius + ' bg=' + a.bg + ' svg=' + (a.svg && a.svg.w)),
  );
}

await browser.close();
