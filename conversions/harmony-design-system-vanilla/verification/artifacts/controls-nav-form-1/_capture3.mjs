import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

async function setConvProduct(page, product = "cp") {
  await page.addInitScript((product) => {
    localStorage.setItem("harmony-demo-product", product);
  }, product);
  await page.evaluate((product) => {
    localStorage.setItem("harmony-demo-product", product);
    const app = document.querySelector("demo-app");
    if (app) app.setAttribute("product", product);
    const header = document.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("#product-select");
    if (select) {
      select.value = product;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, product);
  await delay(700);
}

async function scrollAndClip(page, role, name, headingText, fileSuffix) {
  const box = await page.evaluate((headingText) => {
    function findHeading(root) {
      for (const h of root.querySelectorAll("h2")) {
        if ((h.textContent || "").toLowerCase().includes(headingText.toLowerCase())) return h;
      }
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const found = findHeading(el.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    }
    const h = findHeading(document);
    if (!h) return null;
    h.scrollIntoView({ block: "start" });
    const next = h.nextElementSibling;
    const r1 = h.getBoundingClientRect();
    const r2 = next ? next.getBoundingClientRect() : r1;
    const top = Math.min(r1.top, r2.top);
    const bottom = Math.max(r1.bottom, r2.bottom);
    const left = Math.min(r1.left, r2.left);
    const right = Math.max(r1.right, r2.right);
    return {
      x: Math.max(0, left - 8),
      y: Math.max(0, top - 8),
      width: Math.min(right - left + 16, window.innerWidth - 16),
      height: Math.min(bottom - top + 16, 800),
    };
  }, headingText);
  await delay(200);
  if (!box || box.width < 20 || box.height < 20) {
    console.log("NOCLIP", role, name, fileSuffix);
    return;
  }
  // Re-read after scroll
  const box2 = await page.evaluate((headingText) => {
    function findHeading(root) {
      for (const h of root.querySelectorAll("h2")) {
        if ((h.textContent || "").toLowerCase().includes(headingText.toLowerCase())) return h;
      }
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const found = findHeading(el.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    }
    const h = findHeading(document);
    const next = h?.nextElementSibling;
    const r1 = h.getBoundingClientRect();
    const r2 = next ? next.getBoundingClientRect() : r1;
    const top = Math.min(r1.top, r2.top);
    const bottom = Math.max(r1.bottom, r2.bottom);
    const left = Math.min(r1.left, r2.left);
    const right = Math.max(r1.right, r2.right);
    return {
      x: Math.max(0, left - 8),
      y: Math.max(0, top - 8),
      width: Math.min(right - left + 16, window.innerWidth - 16),
      height: Math.min(Math.max(bottom - top + 16, 40), window.innerHeight - Math.max(0, top) - 8),
    };
  }, headingText);
  try {
    await page.screenshot({ path: `${outDir}/${role}-${name}-${fileSuffix}.png`, clip: box2 });
    console.log("CLIP", role, name, fileSuffix, box2);
  } catch (e) {
    console.log("CLIPFAIL", role, name, fileSuffix, e.message, box2);
  }
}

const jobs = [
  ["checkboxes", "http://localhost:4321/components/checkboxes", "http://localhost:5178/components/checkboxes", [
    ["State Variants", "Warning"],
    ["Basic Checkbox", "Basic"],
    ["States", "States"],
  ]],
  ["radio-buttons", "http://localhost:4321/components/radio-buttons", "http://localhost:5178/components/radio-buttons", [
    ["Size Variants", "Sizes"],
    ["State Variants", "Warning"],
  ]],
  ["toggle-switches", "http://localhost:4321/components/toggle-switches", "http://localhost:5178/components/toggle-switches", [
    ["Segmented toggle", "Segmented"],
    ["Basic Toggle", "Basic"],
    ["States", "States"],
  ]],
  ["tab-strip", "http://localhost:4321/components/tab-strip", "http://localhost:5178/components/tab-strip", [
    ["Basic Tabs", "Basic tabs"],
    ["With Overflow Handling", "Overflow"],
    ["Per-tab actions", "Per-tab actions"],
    ["Compact Variant", "Compact"],
  ]],
];

for (const [name, refUrl, convUrl, sections] of jobs) {
  const page = await context.newPage();
  await page.goto(refUrl, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem("colorTheme", "cp");
    document.documentElement.classList.remove("theme-vp", "theme-ppm", "theme-maconomy", "dark");
    document.documentElement.classList.add("theme-cp");
  });
  await delay(400);
  await page.screenshot({ path: `${outDir}/ref-${name}-cp-light-top.png`, fullPage: false });
  await page.screenshot({ path: `${outDir}/ref-${name}-cp-light-full.png`, fullPage: true });
  for (const [refH, _] of sections) {
    await scrollAndClip(page, "ref", name, refH, "sec-" + refH.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24));
  }
  // metrics
  const refMetrics = await page.evaluate(() => {
    const on = document.querySelector(".toggle__input:checked + .toggle__track:not(.toggle__track--segmented)");
    const off = document.querySelector(".toggle__input:not(:checked) + .toggle__track:not(.toggle__track--segmented)");
    const seg = document.querySelector(".toggle__track--segmented");
    const thumb = document.querySelector(".toggle__input:checked + .toggle__track--segmented .toggle__thumb--segmented") || document.querySelector(".toggle__thumb--segmented");
    const st = (el) => el ? { bg: getComputedStyle(el).backgroundColor, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;
    return { on: st(on), off: st(off), seg: st(seg), thumb: st(thumb), action: getComputedStyle(document.documentElement).getPropertyValue("--color-action").trim() };
  });
  writeFileSync(`${outDir}/ref-${name}-metrics.json`, JSON.stringify(refMetrics, null, 2));
  console.log("OK ref", name);
  await page.close();

  const page2 = await context.newPage();
  await page2.addInitScript(() => localStorage.setItem("harmony-demo-product", "cp"));
  await page2.goto(convUrl, { waitUntil: "networkidle", timeout: 60000 });
  await setConvProduct(page2, "cp");
  const productInfo = await page2.evaluate(() => ({
    app: document.querySelector("demo-app")?.getAttribute("product"),
    select: document.querySelector("demo-header")?.shadowRoot?.querySelector("#product-select")?.value,
    href: document.getElementById("harmony-product-styles")?.href,
  }));
  writeFileSync(`${outDir}/conv-${name}-product.json`, JSON.stringify(productInfo, null, 2));
  await page2.screenshot({ path: `${outDir}/conv-${name}-cp-light-top.png`, fullPage: false });
  await page2.screenshot({ path: `${outDir}/conv-${name}-cp-light-full.png`, fullPage: true });
  for (const [_, convH] of sections) {
    await scrollAndClip(page2, "conv", name, convH, "sec-" + convH.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24));
  }
  const convMetrics = await page2.evaluate(() => {
    function deep(sel) {
      const walk = (root) => {
        const hit = root.querySelector(sel);
        if (hit) return hit;
        for (const el of root.querySelectorAll("*")) {
          if (el.shadowRoot) {
            const n = walk(el.shadowRoot);
            if (n) return n;
          }
        }
        return null;
      };
      return walk(document);
    }
    const on = deep(".toggle__input:checked + .toggle__track:not(.toggle__track--segmented)");
    const off = deep(".toggle__input:not(:checked) + .toggle__track:not(.toggle__track--segmented)");
    const seg = deep(".toggle__track--segmented");
    const thumb = deep(".toggle__thumb--segmented");
    const st = (el) => el ? { bg: getComputedStyle(el).backgroundColor, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) } : null;
    // checkbox box via harmony-checkbox
    const cb = document.querySelector("harmony-checkbox[checked]");
    let cbBox = null;
    if (cb?.shadowRoot) {
      const input = cb.shadowRoot.querySelector("input");
      cbBox = input ? { w: Math.round(input.getBoundingClientRect().width), h: Math.round(input.getBoundingClientRect().height) } : null;
    }
    return { on: st(on), off: st(off), seg: st(seg), thumb: st(thumb), cbBox, action: getComputedStyle(document.documentElement).getPropertyValue("--color-action").trim() };
  });
  writeFileSync(`${outDir}/conv-${name}-metrics.json`, JSON.stringify(convMetrics, null, 2));
  console.log("OK conv", name, productInfo);
  await page2.close();
}

// Behavior
{
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("harmony-demo-product", "cp"));
  await page.goto("http://localhost:5178/components/toggle-switches", { waitUntil: "networkidle" });
  await setConvProduct(page, "cp");
  const tog = await page.evaluate(() => {
    const pageEl = document.querySelector("demo-toggle-switches-page");
    const t = pageEl?.shadowRoot?.querySelector("harmony-toggle");
    const before = t?.checked ?? t?.hasAttribute("checked");
    t?.click();
    return { before, after: t?.checked ?? t?.hasAttribute("checked"), role: t?.shadowRoot?.querySelector("[role=switch]")?.getAttribute("role") || t?.getAttribute("role") };
  });
  writeFileSync(`${outDir}/behavior-toggle.json`, JSON.stringify(tog, null, 2));
  await page.close();
}
{
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("harmony-demo-product", "cp"));
  await page.goto("http://localhost:5178/components/tab-strip", { waitUntil: "networkidle" });
  await setConvProduct(page, "cp");
  await delay(400);
  const tabBeh = await page.evaluate(() => {
    const pageEl = document.querySelector("demo-tab-strip-page");
    const s = pageEl?.shadowRoot?.querySelector("#tabs-basic");
    const tabs = s?.shadowRoot?.querySelectorAll('[role="tab"]');
    const before = [...(tabs||[])].findIndex(t => t.getAttribute("aria-selected") === "true");
    tabs?.[1]?.click();
    const after = [...(tabs||[])].findIndex(t => t.getAttribute("aria-selected") === "true");
    return { tabCount: tabs?.length ?? 0, before, after, labels: [...(tabs||[])].map(t => t.textContent.trim()) };
  });
  writeFileSync(`${outDir}/behavior-tabstrip.json`, JSON.stringify(tabBeh, null, 2));
  await page.close();
}

await browser.close();
console.log("done");
