import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'avatar-3');
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
        className: String(el.className || '').slice(0, 160),
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
        img: img ? { w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height), complete: img.complete } : null,
      };
    };
    const html = document.documentElement;
    const allAvatars = [...document.querySelectorAll('.avatar, .MuiAvatar-root')];
    const buttons = [...document.querySelectorAll('button.avatar, button.MuiButtonBase-root')].filter(
      (b) => b.classList.contains('avatar') || b.querySelector('.MuiAvatar-root'),
    );
    const labels = [...document.querySelectorAll('#examples .text-sm, #examples .MuiTypography-root, #examples span')]
      .map((el) => (el.textContent || '').trim())
      .filter((t) => /Default|Hover|Focus|Disabled/i.test(t));
    const groupTitles = [...document.querySelectorAll('#examples h3, #examples [class*="DemoExample"] h3, #examples .demo-example-group__title')]
      .map((h) => (h.textContent || '').trim())
      .filter(Boolean);
    return {
      label: lab,
      dark: html.classList.contains('dark'),
      colorScheme: html.getAttribute('data-mui-color-scheme'),
      dataTheme: html.getAttribute('data-theme'),
      pageBg: getComputedStyle(document.body).backgroundColor,
      sectionTitles: [...document.querySelectorAll('h2, h3')].map((h) => (h.textContent || '').trim()).filter(Boolean).slice(0, 40),
      interactiveLabels: labels,
      groupTitles,
      avatarCount: allAvatars.length,
      avatars: allAvatars.slice(0, 24).map((el, i) => ({ i, ...styleOfInner(el) })),
      interactive: buttons.slice(0, 8).map((el, i) => ({ i, ...styleOfInner(el), childAvatar: styleOfInner(el.querySelector('.MuiAvatar-root') || el) })),
    };
  }, label);
}

async function probeForcedStates(page) {
  return page.evaluate(() => {
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const child = el.querySelector('.MuiAvatar-root') || el;
      const ccs = getComputedStyle(child);
      return {
        btnClass: String(el.className || '').slice(0, 120),
        btnOpacity: cs.opacity,
        btnOutline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
        btnOutlineOffset: cs.outlineOffset,
        btnShadow: cs.boxShadow,
        childBg: ccs.backgroundColor,
        childRadius: ccs.borderRadius,
      };
    };
    const btn = [...document.querySelectorAll('button.MuiButtonBase-root')].find((b) => b.querySelector('.MuiAvatar-root') && !b.disabled);
    if (!btn) return { error: 'no interactive avatar button' };
    const idle = styleOf(btn);
    btn.classList.add('Mui-focusVisible');
    const focused = styleOf(btn);
    btn.classList.remove('Mui-focusVisible');
    // hover via :hover cannot be faked easily; dispatch mouseover + force style check after hover media
    return { idle, focused };
  });
}

const browser = await chromium.launch({ headless: true });
const report = {};
for (const mode of ['light', 'dark']) {
  const ref = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
  await ensureMode(ref, 'http://localhost:4321/components/avatar', mode, true);
  await ref.screenshot({ path: join(outDir, 'ref-' + mode + '-page.png'), fullPage: true });
  const refExamples = ref.locator('#examples');
  if ((await refExamples.count()) > 0) await refExamples.screenshot({ path: join(outDir, 'ref-' + mode + '-examples.png') });
  report['ref-' + mode] = await probeAvatars(ref, 'ref-' + mode);
  await ref.close();

  const conv = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
  await ensureMode(conv, 'http://localhost:5176/components/avatar', mode, false);
  await conv.screenshot({ path: join(outDir, 'conv-' + mode + '-page.png'), fullPage: true });
  const convExamples = conv.locator('#examples');
  if ((await convExamples.count()) > 0) await convExamples.screenshot({ path: join(outDir, 'conv-' + mode + '-examples.png') });
  report['conv-' + mode] = await probeAvatars(conv, 'conv-' + mode);
  report['conv-' + mode + '-forced'] = await probeForcedStates(conv);
  // real hover screenshot of first interactive
  const firstBtn = conv.locator('button.MuiButtonBase-root').filter({ has: conv.locator('.MuiAvatar-root') }).first();
  if ((await firstBtn.count()) > 0) {
    await firstBtn.hover();
    await conv.waitForTimeout(300);
    report['conv-' + mode + '-hover'] = await firstBtn.evaluate((el) => {
      const child = el.querySelector('.MuiAvatar-root') || el;
      const cs = getComputedStyle(child);
      return { childBg: cs.backgroundColor, btnOpacity: getComputedStyle(el).opacity };
    });
    await firstBtn.focus();
    await conv.keyboard.press('Tab'); // may move away; better force focus-visible via evaluate
    await conv.evaluate(() => {
      const btn = [...document.querySelectorAll('button.MuiButtonBase-root')].find((b) => b.querySelector('.MuiAvatar-root') && !b.disabled);
      if (btn) { btn.focus(); btn.classList.add('Mui-focusVisible'); }
    });
    await conv.waitForTimeout(200);
    const interactiveSection = conv.locator('#examples').locator('text=Interactive').locator('..').locator('..');
    try {
      await conv.locator('#examples').screenshot({ path: join(outDir, 'conv-' + mode + '-examples-focus.png') });
    } catch {}
  }
  await conv.close();
}
writeFileSync(join(outDir, 'probe.json'), JSON.stringify(report, null, 2));
console.log('wrote', outDir);
for (const key of Object.keys(report)) {
  const r = report[key];
  if (!r || !r.avatars) { console.log(key, JSON.stringify(r)); continue; }
  console.log(key, 'avatars=', r.avatarCount, 'labels=', r.interactiveLabels, 'sizes=', (r.avatars||[]).slice(0,6).map(a => a.w+'x'+a.h+' r='+a.radius+' bg='+a.bg+' c='+a.color+' svg='+(a.svg&&a.svg.w)+' txt='+a.text));
}
await browser.close();
