import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = HERE;
mkdirSync(OUT, { recursive: true });

function styleOf(el) {
  if (!el) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    tag: el.tagName.toLowerCase(),
    className: typeof el.className === 'string' ? el.className : String(el.className || ''),
    text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    bg: s.backgroundColor,
    color: s.color,
    border: s.border,
    borderTop: s.borderTop,
    radius: s.borderRadius,
    shadow: s.boxShadow,
    cursor: s.cursor,
    height: Math.round(r.height),
    width: Math.round(r.width),
    padding: s.padding,
    role: el.getAttribute?.('role'),
    tabIndex: el.tabIndex,
  };
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const results = {};

  // Reference
  await page.goto('http://localhost:4321/components/cards', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  results.ref = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const sections = [...document.querySelectorAll('h2, h3')].map((h) =>
      `${h.tagName} ${h.textContent.trim()}`,
    );
    const cards = [...document.querySelectorAll('.card')].slice(0, 8).map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        className: el.className,
        bg: s.backgroundColor,
        border: s.border,
        borderTop: s.borderTop,
        radius: s.borderRadius,
        shadow: s.boxShadow,
        height: Math.round(r.height),
        width: Math.round(r.width),
      };
    });
    const iconBtn = document.querySelector('.card__icon-btn');
    return {
      h1,
      sections,
      cardCount: document.querySelectorAll('.card').length,
      cards,
      hasIconBtn: !!iconBtn,
      iconBtn: iconBtn
        ? {
            color: getComputedStyle(iconBtn).color,
            padding: getComputedStyle(iconBtn).padding,
            radius: getComputedStyle(iconBtn).borderRadius,
          }
        : null,
    };
  });
  await page.screenshot({ path: join(OUT, 'ref-vp-light-top.png'), fullPage: false });
  await page.screenshot({ path: join(OUT, 'ref-vp-light-full.png'), fullPage: true });

  // Converted
  await page.goto('http://localhost:5178/components/cards', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  results.conv = await page.evaluate(() => {
    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : String(el.className || ''),
        text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
        bg: s.backgroundColor,
        color: s.color,
        border: s.border,
        borderTop: s.borderTop,
        radius: s.borderRadius,
        shadow: s.boxShadow,
        cursor: s.cursor,
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: s.padding,
        role: el.getAttribute?.('role'),
        tabIndex: el.tabIndex,
      };
    };
    const app = document.querySelector('demo-app');
    const pageEl =
      app?.shadowRoot?.querySelector('demo-cards-page') ||
      document.querySelector('demo-cards-page');
    const root = pageEl?.shadowRoot || pageEl;
    if (!root) return { error: 'no demo-cards-page' };

    const h1 = root.querySelector('h1')?.textContent?.trim();
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent.trim());
    const h3s = [...root.querySelectorAll('h3')].map((h) => h.textContent.trim());
    const nativeCards = [...root.querySelectorAll('article.card, a.card')].map(styleOf);
    const hybrids = [...root.querySelectorAll('harmony-card')].map((el) => ({
      ...styleOf(el),
      elevated: el.hasAttribute('elevated'),
      interactive: el.hasAttribute('interactive'),
      primary: el.hasAttribute('primary'),
      title: el.getAttribute('title'),
      subtitle: el.getAttribute('subtitle'),
      hasHeader: !!el.querySelector('.card__header'),
      hasBody: !!el.querySelector('.card__body'),
      hasFooter: !!el.querySelector('.card__footer'),
      headerActions: el.querySelectorAll('.card__header-actions button, [slot="header-actions"]').length,
    }));
    const interactiveCe = root.querySelector('harmony-card[interactive]');
    const ghostIcon = root.querySelector('button.btn--ghost.btn--icon-xs');
    const hasIconBtn = !!root.querySelector('.card__icon-btn');
    const footer = root.querySelector('.card__footer');

    return {
      h1,
      h2s,
      h3s,
      nativeCards,
      hybrids,
      interactiveCe: styleOf(interactiveCe),
      ghostIcon: styleOf(ghostIcon),
      hasIconBtn,
      footer: styleOf(footer),
      bodySnippet: (root.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 400),
    };
  });
  await page.screenshot({ path: join(OUT, 'conv-vp-light-top.png'), fullPage: false });
  await page.screenshot({ path: join(OUT, 'conv-vp-light-full.png'), fullPage: true });

  // Dark
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(300);
  results.convDark = await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const root = app?.shadowRoot?.querySelector('demo-cards-page')?.shadowRoot;
    const card = root?.querySelector('article.card, harmony-card');
    if (!card) return { error: 'no card' };
    const s = getComputedStyle(card);
    return {
      htmlDark: document.documentElement.classList.contains('dark'),
      bg: s.backgroundColor,
      border: s.border,
      shadow: s.boxShadow,
    };
  });
  await page.screenshot({ path: join(OUT, 'conv-vp-dark-top.png'), fullPage: false });

  // Forced colors
  await page.emulateMedia({ forcedColors: 'active', colorScheme: 'dark' });
  await page.waitForTimeout(300);
  results.convForcedColors = await page.evaluate(() => {
    const app = document.querySelector('demo-app');
    const root = app?.shadowRoot?.querySelector('demo-cards-page')?.shadowRoot;
    const card = root?.querySelector('article.card, harmony-card');
    const interactive = root?.querySelector('harmony-card[interactive], a.card--interactive');
    if (interactive) interactive.focus();
    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        color: s.color,
        border: s.border,
        outline: s.outline,
        shadow: s.boxShadow,
      };
    };
    return {
      card: styleOf(card),
      interactiveFocused: styleOf(interactive),
    };
  });
  await page.screenshot({ path: join(OUT, 'conv-forced-colors-top.png'), fullPage: false });

  // Interactive keyboard probe
  await page.emulateMedia({ forcedColors: null, colorScheme: 'light' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.goto('http://localhost:5178/components/cards', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  results.interactiveKeyboard = await page.evaluate(async () => {
    const app = document.querySelector('demo-app');
    const root = app?.shadowRoot?.querySelector('demo-cards-page')?.shadowRoot;
    const ce = root?.querySelector('harmony-card[interactive]');
    if (!ce) return { error: 'no interactive CE' };
    let clicks = 0;
    ce.addEventListener('click', () => {
      clicks += 1;
    });
    ce.focus();
    ce.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    ce.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    return {
      role: ce.getAttribute('role'),
      tabIndex: ce.tabIndex,
      className: ce.className,
      clicks,
    };
  });

  writeFileSync(join(OUT, 'capture-metrics.json'), JSON.stringify(results, null, 2));
  console.log('Wrote capture-metrics.json');
  console.log(JSON.stringify({
    refCards: results.ref?.cardCount,
    convNative: results.conv?.nativeCards?.length,
    convHybrid: results.conv?.hybrids?.length,
    interactive: results.interactiveKeyboard,
    hasIconBtn: results.conv?.hasIconBtn,
    error: results.conv?.error,
  }, null, 2));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
