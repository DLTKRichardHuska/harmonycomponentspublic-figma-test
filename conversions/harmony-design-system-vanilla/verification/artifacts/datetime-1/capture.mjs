import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { join } from "node:path";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/datetime-1";
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
  await delay(500);
}

const errors = [];
const conv = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
conv.on("pageerror", (err) => errors.push(String(err)));
await installFind(conv);
await conv.goto("http://localhost:5178/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(conv, { theme: "cp", mode: "light" });
await delay(700);

const probe = await conv.evaluate(() => {
  const host = document.querySelector("demo-app")?.shadowRoot?.querySelector("demo-date-picker-page");
  const root = host?.shadowRoot;
  const filled = root?.getElementById("dt-value");
  const empty = root?.getElementById("dt-empty");
  const twelve = root?.getElementById("dt-12");
  const disabled = [...(root?.querySelectorAll("harmony-datetime-picker") || [])].find((el) => el.hasAttribute("disabled"));
  const date = filled?.shadowRoot?.querySelector("harmony-date-picker");
  const time = filled?.shadowRoot?.querySelector("harmony-time-picker");
  const section = filled?.shadowRoot?.querySelector(".datetime-picker__date-section");
  const sectionCs = section ? getComputedStyle(section) : null;
  const twelveTime = twelve?.shadowRoot?.querySelector("harmony-time-picker");
  return {
    filledValue: filled?.getAttribute("value") || null,
    dateValue: date?.getAttribute("value") || null,
    timeValue: time?.getAttribute("value") || null,
    timeFormat: twelveTime?.getAttribute("format") || null,
    disabledDate: disabled?.shadowRoot?.querySelector("harmony-date-picker")?.hasAttribute("disabled") || false,
    disabledTime: disabled?.shadowRoot?.querySelector("harmony-time-picker")?.hasAttribute("disabled") || false,
    emptyChildren: Boolean(empty?.shadowRoot?.querySelector("harmony-date-picker") && empty?.shadowRoot?.querySelector("harmony-time-picker")),
    divider: sectionCs
      ? {
          borderBottom: sectionCs.borderBottom,
          marginBottom: sectionCs.marginBottom,
          paddingBottom: sectionCs.paddingBottom,
        }
      : null,
    periodText: twelve?.shadowRoot?.querySelector("harmony-time-picker")?.shadowRoot?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80) || null,
  };
});

const events = await conv.evaluate(async () => {
  const host = document.querySelector("demo-app").shadowRoot.querySelector("demo-date-picker-page");
  const picker = host.shadowRoot.getElementById("dt-value");
  const date = picker.shadowRoot.querySelector("harmony-date-picker");
  const fired = [];
  picker.addEventListener("datetime-select", (event) => fired.push(event.detail.datetime));
  const day = date.shadowRoot.querySelector('.date-picker__day[data-date="2024-01-16"]:not(:disabled)');
  day?.click();
  await new Promise((r) => setTimeout(r, 50));
  const timeOnly = [];
  const empty = host.shadowRoot.getElementById("dt-empty");
  empty.addEventListener("datetime-select", (event) => timeOnly.push(event.detail.datetime));
  const emptyDate = empty.shadowRoot.querySelector("harmony-date-picker");
  const firstDay = emptyDate.shadowRoot.querySelector(".date-picker__day:not(:disabled)");
  firstDay?.click();
  await new Promise((r) => setTimeout(r, 50));
  return {
    afterDateChange: fired,
    hostValue: picker.getAttribute("value"),
    emptyEmitted: timeOnly,
  };
});

writeFileSync(join(outDir, "probe.json"), JSON.stringify({ probe, events, errors }, null, 2));

await shot(conv, `el.id === "dt-value"`, "conv-cp-light-filled.png", 16);
await shot(conv, `el.id === "dt-12"`, "conv-cp-light-12h.png", 16);
await shot(conv, `el.tagName === "HARMONY-DATETIME-PICKER" && el.hasAttribute("disabled")`, "conv-cp-light-disabled.png", 16);
await shot(conv, `el.id === "dt-empty"`, "conv-cp-light-empty.png", 16);

await setTheme(conv, { theme: "cp", mode: "dark" });
await delay(600);
await shot(conv, `el.id === "dt-value"`, "conv-cp-dark-filled.png", 16);

await conv.emulateMedia({ forcedColors: "active" });
await delay(500);
await shot(conv, `el.id === "dt-value"`, "conv-forced-colors-filled.png", 16);
await conv.close();

const ref = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await installFind(ref);
await ref.goto("http://localhost:4321/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(ref, { theme: "cp", mode: "light" });
await ref.reload({ waitUntil: "networkidle" });
await delay(800);
const icon = ref.locator('[data-date-input-icon="datetime-basic"]');
await icon.scrollIntoViewIfNeeded();
await icon.click();
await delay(500);
const popup = ref.locator("[data-datetime-picker]").first();
await popup.waitFor({ state: "visible", timeout: 10000 });
await popup.screenshot({ path: join(outDir, "ref-cp-light-popup.png") });
const refMetrics = await ref.evaluate(() => {
  const el = document.querySelector("[data-datetime-picker]");
  const section = el?.querySelector(".datetime-picker__date-section");
  const cs = section ? getComputedStyle(section) : null;
  return {
    open: Boolean(el),
    divider: cs
      ? {
          borderBottom: cs.borderBottom,
          marginBottom: cs.marginBottom,
          paddingBottom: cs.paddingBottom,
          width: getComputedStyle(el).width,
        }
      : null,
  };
});
writeFileSync(join(outDir, "ref-metrics.json"), JSON.stringify(refMetrics, null, 2));

await browser.close();
console.log("capture done");
console.log(JSON.stringify({ probe, events, errors }, null, 2));
