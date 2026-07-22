import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:5177/components/accordion', {
  waitUntil: 'networkidle',
  timeout: 60000,
});

const before = await page.evaluate(() => {
  const trigger = document.querySelector('[data-radix-collection-item], button[data-state]');
  const icon = trigger?.querySelector('[data-icon], svg, span');
  const cs = icon ? getComputedStyle(icon) : null;
  return {
    triggerState: trigger?.getAttribute('data-state'),
    triggerClass: trigger?.className?.slice?.(0, 120),
    iconTag: icon?.tagName,
    iconClass: icon?.className?.toString?.()?.slice?.(0, 200),
    iconDataIcon: icon?.getAttribute?.('data-icon'),
    transform: cs?.transform,
    transition: cs?.transition,
    hasGroup: trigger?.classList?.contains('group'),
  };
});

await page.locator('button[data-state]').first().click();
await page.waitForTimeout(400);

const after = await page.evaluate(() => {
  const trigger = document.querySelector('button[data-state="open"]') || document.querySelector('button[data-state]');
  const iconWrap = trigger?.querySelector('[data-icon]') || trigger?.querySelector('span');
  const svg = trigger?.querySelector('svg');
  const wrapCs = iconWrap ? getComputedStyle(iconWrap) : null;
  const svgCs = svg ? getComputedStyle(svg) : null;
  // check if rotate utility exists in stylesheets
  let rotateRule = null;
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = [...sheet.cssRules]; } catch { continue; }
    for (const rule of rules) {
      const t = rule.cssText || '';
      if (t.includes('group-data-[state=open]:rotate-180') || t.includes('group-data-\\[state\\=open\\]\\:rotate-180')) {
        rotateRule = t.slice(0, 300);
        break;
      }
    }
    if (rotateRule) break;
  }
  return {
    triggerState: trigger?.getAttribute('data-state'),
    wrapTag: iconWrap?.tagName,
    wrapClass: iconWrap?.className?.toString?.()?.slice?.(0, 250),
    wrapTransform: wrapCs?.transform,
    wrapTransition: wrapCs?.transition,
    svgTransform: svgCs?.transform,
    rotateRule,
  };
});

console.log(JSON.stringify({ before, after }, null, 2));
await browser.close();
