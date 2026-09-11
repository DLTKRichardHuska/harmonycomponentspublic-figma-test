import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const out = 'c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/tooltip-1';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:5178/components/tooltips', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.evaluate(() => {
  const app = document.querySelector('demo-app');
  app.product = 'cp';
  localStorage.setItem('harmony-demo-product', 'cp');
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-cp');
});
await page.waitForTimeout(500);

const a11y = await page.evaluate(async () => {
  const app = document.querySelector('demo-app');
  const root = app.shadowRoot.querySelector('demo-tooltips-page').shadowRoot;
  const tip = root.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const descs = [...root.querySelectorAll('[data-harmony-tooltip-desc]')].map((el) => ({
    id: el.id,
    text: el.textContent,
    hidden: el.hidden,
  }));
  const btn = tip.querySelector('harmony-button');
  const describedBy = btn.getAttribute('aria-describedby');
  const descEl = root.getElementById(describedBy);
  let ariaIds = null;
  try {
    ariaIds = btn.ariaDescribedByElements ? [...btn.ariaDescribedByElements].map((e) => e && e.id) : null;
  } catch (e) {
    ariaIds = String(e.message || e);
  }

  tip.removeAttribute('data-dismissed');
  btn.focus();
  await new Promise((r) => setTimeout(r, 450));
  const content = tip.shadowRoot.querySelector('[part="content"]');
  const onFocus = {
    opacity: getComputedStyle(content).opacity,
    visibility: getComputedStyle(content).visibility,
    activeTag: document.activeElement?.tagName,
  };

  tip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise((r) => setTimeout(r, 450));
  const afterEsc = {
    opacity: getComputedStyle(content).opacity,
    visibility: getComputedStyle(content).visibility,
    dismissed: tip.hasAttribute('data-dismissed'),
  };

  return {
    descsCount: descs.length,
    sampleDescs: descs.slice(0, 3),
    describedBy,
    descText: descEl?.textContent ?? null,
    descFound: !!descEl,
    ariaIds,
    tipText: tip.shadowRoot.querySelector('.tooltip__text')?.textContent,
    onFocus,
    afterEsc,
  };
});

await page.evaluate(() => {
  const root = document.querySelector('demo-app').shadowRoot.querySelector('demo-tooltips-page').shadowRoot;
  root.querySelector('harmony-tooltip[corner-variant="top"]').scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(250);
const cbox = await page.evaluate(() => {
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[corner-variant="top"]');
  const r = tip.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.move(cbox.x, cbox.y);
await page.waitForTimeout(450);
const corner = await page.evaluate(() => {
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[corner-variant="top"]');
  const c = tip.shadowRoot.querySelector('[part="content"]');
  const cs = getComputedStyle(c);
  const after = getComputedStyle(c, '::after');
  return {
    opacity: cs.opacity,
    visibility: cs.visibility,
    radii: [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius],
    arrowDisplay: after.display,
  };
});
await page.screenshot({ path: out + '/conv-hover-corner-top-scrolled.png' });

await page.evaluate(() => {
  document.documentElement.classList.add('dark');
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[text="This is a tooltip"]');
  tip.removeAttribute('data-dismissed');
  tip.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(350);
const bbox = await page.evaluate(() => {
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const btn = tip.querySelector('harmony-button');
  const r = btn.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.move(bbox.x, bbox.y);
await page.waitForTimeout(450);
const darkHover = await page.evaluate(() => {
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const c = tip.shadowRoot.querySelector('[part="content"]');
  const cs = getComputedStyle(c);
  return { color: cs.color, bg: cs.backgroundColor, opacity: cs.opacity, visibility: cs.visibility };
});
await page.screenshot({ path: out + '/conv-cp-dark-hover-basic-scrolled.png' });

await page.emulateMedia({ forcedColors: 'active' });
await page.evaluate(() => document.documentElement.classList.remove('dark'));
await page.waitForTimeout(350);
await page.mouse.move(bbox.x, bbox.y);
await page.waitForTimeout(450);
const fc = await page.evaluate(() => {
  const tip = document
    .querySelector('demo-app')
    .shadowRoot.querySelector('demo-tooltips-page')
    .shadowRoot.querySelector('harmony-tooltip[text="This is a tooltip"]');
  const c = tip.shadowRoot.querySelector('[part="content"]');
  const cs = getComputedStyle(c);
  return {
    color: cs.color,
    bg: cs.backgroundColor,
    border: cs.border,
    opacity: cs.opacity,
    visibility: cs.visibility,
    arrowTop: getComputedStyle(c, '::after').borderTopColor,
  };
});
await page.screenshot({ path: out + '/conv-forced-colors-hover-scrolled.png' });

const ref = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await ref.goto('http://localhost:4321/components/tooltips', { waitUntil: 'networkidle' });
await ref.evaluate(() => {
  document.documentElement.classList.remove('theme-vp', 'theme-ppm', 'theme-maconomy');
  document.documentElement.classList.add('theme-cp', 'dark');
});
await ref.waitForTimeout(400);
const rbox = await ref.evaluate(() => {
  const tip = document.querySelector('.tooltip');
  const btn = tip.querySelector('button');
  const r = btn.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await ref.mouse.move(rbox.x, rbox.y);
await ref.waitForTimeout(450);
const refDark = await ref.evaluate(() => {
  const c = document.querySelector('.tooltip__content');
  const cs = getComputedStyle(c);
  return { color: cs.color, bg: cs.backgroundColor, opacity: cs.opacity, fontSize: cs.fontSize, padding: cs.padding };
});
await ref.screenshot({ path: out + '/ref-cp-dark-hover-basic-scrolled.png' });

const payload = { a11y, corner, darkHover, fc, refDark };
writeFileSync(out + '/a11y-probe.json', JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload, null, 2));
await browser.close();
