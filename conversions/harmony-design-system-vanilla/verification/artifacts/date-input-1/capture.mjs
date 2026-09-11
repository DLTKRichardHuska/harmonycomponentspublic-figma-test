import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { join } from "node:path";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/date-input-1";
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

function findScript() {
  return `(() => {
    function walk(root, pred) {
      const hit = [...root.querySelectorAll("*")].find(pred);
      if (hit) return hit;
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const nested = walk(el.shadowRoot, pred);
          if (nested) return nested;
        }
      }
      return null;
    }
    window.__find = walk;
    return true;
  })()`;
}

async function installFind(page) {
  await page.addInitScript(findScript());
  await page.evaluate(findScript());
}

async function queryHandle(page, predSource) {
  const handle = await page.evaluateHandle((src) => {
    const pred = new Function("el", "return (" + src + ");");
    return window.__find(document, pred);
  }, predSource);
  const el = handle.asElement();
  if (!el) throw new Error("not found: " + predSource);
  return el;
}

async function shot(page, predSource, file, pad = 12) {
  const el = await queryHandle(page, predSource);
  await el.scrollIntoViewIfNeeded();
  await delay(200);
  const box = await el.boundingBox();
  if (!box) throw new Error("no box " + file);
  await page.screenshot({
    path: join(outDir, file),
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(1280, box.width + pad * 2),
      height: box.height + pad * 2,
    },
  });
  return box;
}

async function setTheme(page, { theme = "cp", mode = "light" } = {}) {
  await page.evaluate(({ theme, mode }) => {
    localStorage.setItem("theme", mode);
    localStorage.setItem("colorTheme", theme);
    localStorage.setItem("harmony-demo-product", theme);
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add("theme-" + theme);
    if (mode === "dark") document.documentElement.classList.add("dark");
    const app = document.querySelector("demo-app");
    if (app) app.product = theme;
  }, { theme, mode });
  await delay(600);
}

const errors = [];
const conv = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
conv.on("pageerror", (err) => errors.push(String(err)));
await installFind(conv);
await conv.goto("http://localhost:5178/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(conv, { theme: "cp", mode: "light" });
await delay(500);

const probe = await conv.evaluate(async () => {
  const page = document.querySelector("demo-app")?.shadowRoot?.querySelector("demo-date-picker-page");
  const root = page?.shadowRoot;
  const field = rootGet(root, "field-date");
  const input = field?.shadowRoot?.querySelector("[part=field]");
  const icon = field?.shadowRoot?.querySelector("[part=icon]");
  const popup = field?.shadowRoot?.querySelector("harmony-picker-popup");
  const widget = popup?.querySelector("harmony-date-picker");
  const form = rootGet(root, "field-form");
  const start = rootGet(root, "field-start");
  const name = rootGet(root, "field-name");
  const startLabel = form?.querySelector("label[for='field-start']");
  const nameLabel = form?.querySelector("label[for='field-name']");
  const startCs = start ? getComputedStyle(start.shadowRoot.querySelector("[part=field]")) : null;
  const nameCs = name ? getComputedStyle(name.shadowRoot.querySelector("[part=control]")) : null;
  const startBox = start?.getBoundingClientRect();
  const nameBox = name?.getBoundingClientRect();
  const fired = [];
  field?.addEventListener("change", (event) => fired.push(event.detail));
  input?.click();
  await new Promise((r) => setTimeout(r, 250));
  const day = widget?.shadowRoot?.querySelector(".date-picker__day:not(:disabled)");
  const picked = day?.getAttribute("data-date") || null;
  day?.click();
  await new Promise((r) => setTimeout(r, 200));
  const closed = !popup?.matches(":popover-open");
  input?.click();
  await new Promise((r) => setTimeout(r, 200));
  const iconBtn = start?.shadowRoot?.querySelector("[part=icon]");
  const fieldCs = input ? getComputedStyle(input) : null;
  const iconCs = icon ? getComputedStyle(icon) : null;
  return {
    placeholder: input?.placeholder || null,
    displayAfterSelect: input?.value || null,
    machine: field?.getAttribute("value") || null,
    changeDetail: fired[0] || null,
    closedAfterSelect: closed,
    reopened: popup?.matches(":popover-open") || false,
    popupFor: popup?.getAttribute("for") || null,
    fieldId: input?.id || null,
    timeDisplay: rootGet(root, "field-time")?.shadowRoot?.querySelector("[part=field]")?.value || null,
    timeFormat: rootGet(root, "field-time-12")?.shadowRoot?.querySelector("harmony-time-picker")?.getAttribute("format") || null,
    dtDisplay: rootGet(root, "field-datetime")?.shadowRoot?.querySelector("[part=field]")?.value || null,
    monthDisplay: rootGet(root, "field-month")?.shadowRoot?.querySelector("[part=field]")?.value || null,
    weekDisplay: rootGet(root, "field-week")?.shadowRoot?.querySelector("[part=field]")?.value || null,
    disabledDisplay: rootGet(root, "field-disabled")?.shadowRoot?.querySelector("[part=field]")?.value || null,
    formLabel: startLabel?.textContent || null,
    required: startLabel?.classList.contains("label--required") || false,
    shadowLabelDisplay: start ? getComputedStyle(start.shadowRoot.querySelector("[part=label]")).display : null,
    alignTopDelta: startBox && nameBox ? Math.round(startBox.top - nameBox.top) : null,
    heightDelta: startBox && nameBox ? Math.round(startBox.height - nameBox.height) : null,
    fieldHeight: fieldCs?.height || null,
    nameHeight: nameCs?.height || null,
    fieldRadius: fieldCs?.borderRadius || null,
    iconRight: iconCs?.right || null,
  };

  function rootGet(root, id) {
    return root?.getElementById(id) || null;
  }
});

writeFileSync(join(outDir, "probe.json"), JSON.stringify({ probe, errors }, null, 2));

await shot(conv, `el.id === "field-date"`, "conv-cp-light-date.png", 16);
await shot(conv, `el.id === "field-time"`, "conv-cp-light-time.png", 16);
await shot(conv, `el.id === "field-datetime"`, "conv-cp-light-datetime.png", 16);
await shot(conv, `el.id === "field-month"`, "conv-cp-light-month.png", 16);
await shot(conv, `el.id === "field-week"`, "conv-cp-light-week.png", 16);
await shot(conv, `el.id === "field-disabled"`, "conv-cp-light-disabled.png", 16);
await shot(conv, `el.id === "field-stacked"`, "conv-cp-light-stacked.png", 16);
await shot(conv, `el.id === "field-inline"`, "conv-cp-light-inline.png", 16);
await shot(conv, `el.id === "field-form"`, "conv-cp-light-form.png", 20);

const dateField = await queryHandle(conv, `el.id === "field-date"`);
await dateField.scrollIntoViewIfNeeded();
await delay(200);
const fieldBox = await dateField.boundingBox();
const popupBox = await conv.evaluate(() => {
  const page = document.querySelector("demo-app").shadowRoot.querySelector("demo-date-picker-page");
  const popup = page.shadowRoot.getElementById("field-date").shadowRoot.querySelector("harmony-picker-popup");
  if (!popup.matches(":popover-open")) popup.show();
  const box = popup.getBoundingClientRect();
  return { x: box.x, y: box.y, width: box.width, height: box.height, open: popup.matches(":popover-open") };
});
const union = {
  x: Math.max(0, Math.min(fieldBox.x, popupBox.x) - 16),
  y: Math.max(0, Math.min(fieldBox.y, popupBox.y) - 16),
  width: Math.max(fieldBox.x + fieldBox.width, popupBox.x + popupBox.width) - Math.min(fieldBox.x, popupBox.x) + 32,
  height: Math.max(fieldBox.y + fieldBox.height, popupBox.y + popupBox.height) - Math.min(fieldBox.y, popupBox.y) + 32,
};
await conv.screenshot({
  path: join(outDir, "conv-cp-light-popup.png"),
  clip: {
    x: union.x,
    y: union.y,
    width: Math.min(1280, union.width),
    height: Math.min(1400, union.height),
  },
});

await setTheme(conv, { theme: "cp", mode: "dark" });
await delay(400);
await shot(conv, `el.id === "field-date"`, "conv-cp-dark-date.png", 16);
await shot(conv, `el.id === "field-form"`, "conv-cp-dark-form.png", 20);
await shot(conv, `el.id === "field-disabled"`, "conv-cp-dark-disabled.png", 16);

await conv.emulateMedia({ forcedColors: "active" });
await delay(400);
await shot(conv, `el.id === "field-date"`, "conv-forced-colors-date.png", 16);
await shot(conv, `el.id === "field-disabled"`, "conv-forced-colors-disabled.png", 16);
await shot(conv, `el.id === "field-form"`, "conv-forced-colors-form.png", 20);
const focusProbe = await conv.evaluate(() => {
  const page = document.querySelector("demo-app").shadowRoot.querySelector("demo-date-picker-page");
  const input = page.shadowRoot.getElementById("field-date").shadowRoot.querySelector("[part=field]");
  input.focus();
  const cs = getComputedStyle(input);
  const disabled = page.shadowRoot.getElementById("field-disabled").shadowRoot.querySelector("[part=field]");
  const dcs = getComputedStyle(disabled);
  const icon = page.shadowRoot.getElementById("field-disabled").shadowRoot.querySelector("[part=icon]");
  const ics = getComputedStyle(icon);
  return {
    outline: cs.outline,
    outlineColor: cs.outlineColor,
    boxShadow: cs.boxShadow,
    disabledColor: dcs.color,
    disabledBorder: dcs.borderColor,
    iconColor: ics.color,
    iconBorder: ics.borderColor,
  };
});
writeFileSync(join(outDir, "forced-colors.json"), JSON.stringify(focusProbe, null, 2));
const focused = await queryHandle(conv, `el.id === "field-date"`);
await focused.scrollIntoViewIfNeeded();
await delay(150);
const focusBox = await focused.boundingBox();
await conv.screenshot({
  path: join(outDir, "conv-forced-colors-focus.png"),
  clip: {
    x: Math.max(0, focusBox.x - 16),
    y: Math.max(0, focusBox.y - 16),
    width: Math.min(1280, focusBox.width + 32),
    height: focusBox.height + 32,
  },
});
await conv.close();

const ref = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await installFind(ref);
await ref.goto("http://localhost:4321/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(ref, { theme: "cp", mode: "light" });
await ref.reload({ waitUntil: "networkidle" });
await delay(700);

async function shotLocator(page, selector, file, pad = 16) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await delay(200);
  const box = await el.boundingBox();
  if (!box) throw new Error("no box " + file);
  await page.screenshot({
    path: join(outDir, file),
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(1280, box.width + pad * 2),
      height: box.height + pad * 2,
    },
  });
  return box;
}

await shotLocator(ref, "#date-basic", "ref-cp-light-date.png");
await shotLocator(ref, "#time-basic", "ref-cp-light-time.png");
await shotLocator(ref, "#datetime-basic", "ref-cp-light-datetime.png");
await shotLocator(ref, "#date-disabled", "ref-cp-light-disabled.png");
await shotLocator(ref, "#month-basic", "ref-cp-light-month.png");
await shotLocator(ref, "#week-basic", "ref-cp-light-week.png");

const refDate = ref.locator("#date-basic");
await refDate.scrollIntoViewIfNeeded();
await refDate.click();
await delay(400);
const refPopupOpen = await ref.locator(".picker-popup.is-open, [data-picker-popup].is-open").count();
await ref.screenshot({ path: join(outDir, "ref-cp-light-popup.png"), fullPage: false });
const refMetrics = await ref.evaluate(() => {
  const el = document.querySelector("#date-basic");
  const cs = el ? getComputedStyle(el) : null;
  return {
    height: cs?.height || null,
    radius: cs?.borderRadius || null,
    fontSize: cs?.fontSize || null,
    placeholder: el?.getAttribute("placeholder") || null,
    popupOpen: Boolean(document.querySelector(".date-input-popup.is-open, [data-picker-popup].is-open")),
  };
});
writeFileSync(join(outDir, "ref-metrics.json"), JSON.stringify({ refMetrics, refPopupOpen, popupBox }, null, 2));

await browser.close();
console.log("capture done");
console.log(JSON.stringify({ probe, focusProbe, errors }, null, 2));
