import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { dirname, join } from "node:path";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/date-pickers-2";
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
    function all(root, pred, acc = []) {
      for (const el of root.querySelectorAll("*")) {
        if (pred(el)) acc.push(el);
        if (el.shadowRoot) all(el.shadowRoot, pred, acc);
      }
      return acc;
    }
    window.__find = walk;
    window.__all = all;
    return true;
  })()`;
}

async function installFind(page) {
  await page.addInitScript(findScript());
  await page.evaluate(findScript());
}

async function queryHandle(page, predSource) {
  const handle = await page.evaluateHandle((src) => {
    const pred = new Function("el", "return (" + src + ")(el);");
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

async function styles(page) {
  return page.evaluate(() => {
    function styleOf(el) {
      const cs = getComputedStyle(el);
      const range = el.querySelector(".week-picker__week-range");
      const num = el.querySelector(".week-picker__week-number");
      return {
        text: (el.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 90),
        className: String(el.className || "").slice(0, 140),
        ariaSelected: el.getAttribute("aria-selected"),
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
        fontWeight: cs.fontWeight,
        rangeColor: range ? getComputedStyle(range).color : null,
        numColor: num ? getComputedStyle(num).color : null,
      };
    }
    const weeks = window.__all(document, (el) => el.classList && el.classList.contains("week-picker__week"));
    const months = window.__all(document, (el) => el.classList && el.classList.contains("month-picker__month"));
    const days = window.__all(document, (el) => el.classList && el.classList.contains("date-picker__day"));
    const periods = window.__all(document, (el) => el.classList && el.classList.contains("time-picker__period-btn"));
    return {
      theme: [...document.documentElement.classList],
      selectedWeeks: weeks.filter((w) => w.classList.contains("week-picker__week--selected") || w.getAttribute("aria-selected") === "true").map(styleOf),
      neighborWeek: weeks.filter((w) => !w.classList.contains("week-picker__week--selected")).slice(0, 1).map(styleOf),
      selectedMonths: months.filter((m) => m.classList.contains("month-picker__month--selected") || m.getAttribute("aria-selected") === "true").map(styleOf),
      today: days.filter((d) => d.classList.contains("date-picker__day--today")).slice(0, 2).map(styleOf),
      selectedDays: days.filter((d) => d.classList.contains("date-picker__day--selected")).slice(0, 2).map(styleOf),
      periods: periods.map(styleOf),
    };
  });
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

const conv = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await installFind(conv);
await conv.goto("http://localhost:5178/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(conv, { theme: "cp", mode: "light" });
await delay(700);
writeFileSync(join(outDir, "conv-light-metrics.json"), JSON.stringify(await styles(conv), null, 2));
await shot(conv, `el.id === "week-basic"`, "conv-cp-light-week.png", 16);
await shot(conv, `el.classList && el.classList.contains("week-picker__week--selected")`, "conv-cp-light-week3.png", 20);
await shot(conv, `el.id === "month-basic"`, "conv-cp-light-month.png", 16);
await shot(conv, `el.id === "date-basic"`, "conv-cp-light-calendar.png", 16);
await shot(conv, `el.id === "time-12"`, "conv-cp-light-time12.png", 16);
await shot(conv, `el.tagName === "HARMONY-DATE-PICKER" && el.hasAttribute("disabled")`, "conv-cp-light-disabled.png", 16);

const openBtn = await queryHandle(conv, `el.id === "open-date"`);
await openBtn.click();
await delay(400);
await shot(conv, `el.id === "date-popup"`, "conv-cp-light-popup.png", 16);
await conv.keyboard.press("Escape");

await setTheme(conv, { theme: "cp", mode: "dark" });
await delay(600);
writeFileSync(join(outDir, "conv-dark-metrics.json"), JSON.stringify(await styles(conv), null, 2));
await shot(conv, `el.id === "week-basic"`, "conv-cp-dark-week.png", 16);
await shot(conv, `el.classList && el.classList.contains("week-picker__week--selected")`, "conv-cp-dark-week3.png", 20);

await conv.emulateMedia({ forcedColors: "active" });
await delay(500);
writeFileSync(join(outDir, "conv-forced-colors-metrics.json"), JSON.stringify(await styles(conv), null, 2));
await shot(conv, `el.id === "week-basic"`, "conv-forced-colors-week.png", 16);
await shot(conv, `el.classList && el.classList.contains("week-picker__week--selected")`, "conv-forced-colors-week3.png", 20);
await conv.close();

const ref = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await installFind(ref);
await ref.goto("http://localhost:4321/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await setTheme(ref, { theme: "cp", mode: "light" });
await ref.reload({ waitUntil: "networkidle" });
await delay(800);

async function openRef(page, id) {
  const input = page.locator("#" + id);
  await input.scrollIntoViewIfNeeded();
  await input.click();
  await delay(450);
}

await openRef(ref, "week-basic");
const weekOpen = ref.locator("[data-week-picker]").first();
await weekOpen.waitFor({ state: "visible", timeout: 10000 });
await weekOpen.screenshot({ path: join(outDir, "ref-week-open.png") });
await ref.locator(".week-picker__week").nth(2).click();
await delay(400);
await openRef(ref, "week-basic");
await ref.locator(".week-picker__week--selected").waitFor({ state: "visible", timeout: 10000 });
await shot(ref, `el.classList && el.classList.contains("week-picker__week--selected")`, "ref-cp-light-selected-week.png", 20);
await ref.locator("[data-week-picker]").first().screenshot({ path: join(outDir, "ref-cp-light-week-popup.png") });
writeFileSync(join(outDir, "ref-week-selected-metrics.json"), JSON.stringify(await styles(ref), null, 2));
await ref.keyboard.press("Escape");
await delay(200);

await openRef(ref, "month-basic");
await ref.locator(".month-picker__month").nth(5).click();
await delay(350);
await openRef(ref, "month-basic");
await ref.locator(".month-picker__month--selected").waitFor({ state: "visible", timeout: 10000 });
await shot(ref, `el.classList && el.classList.contains("month-picker__month--selected")`, "ref-cp-light-selected-month.png", 16);
writeFileSync(join(outDir, "ref-month-selected-metrics.json"), JSON.stringify(await styles(ref), null, 2));

await browser.close();
console.log("capture done");
