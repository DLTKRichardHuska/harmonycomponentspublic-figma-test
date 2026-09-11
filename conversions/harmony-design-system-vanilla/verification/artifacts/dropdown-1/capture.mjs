import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function fieldMetrics(page, label) {
  const data = await page.evaluate(() => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    const fields = [];
    walk(document, (root) => {
      root.querySelectorAll("select, .dropdown__trigger, input.input, harmony-select, harmony-input").forEach((el) => {
        fields.push(el);
      });
    });
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return null;
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || el.getAttribute("name") || "",
        text: (el.textContent || el.value || "").replace(/\s+/g, " ").trim().slice(0, 70),
        className: String(el.className?.baseVal ?? el.className ?? "").slice(0, 80),
        bg: cs.backgroundColor,
        color: cs.color,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        radius: cs.borderRadius,
        fontSize: cs.fontSize,
        height: Math.round(r.height),
        width: Math.round(r.width),
        padding: cs.padding,
        appearance: cs.appearance,
        bgImage: cs.backgroundImage === "none" ? "none" : "image",
        opacity: cs.opacity,
        disabled: !!el.disabled,
      };
    };
    const interesting = fields.map(styleOf).filter(Boolean).filter((s) => s.height >= 16 && s.height <= 160).slice(0, 50);
    const headings = [];
    walk(document, (root) => {
      root.querySelectorAll("h1,h2").forEach((h) => {
        headings.push(`${h.tagName}:${(h.textContent || "").trim().slice(0, 90)}`);
      });
    });
    return {
      htmlClass: [...document.documentElement.classList],
      sheets: [...document.querySelectorAll("link[rel=stylesheet]")].map((l) => l.href),
      headings,
      fields: interesting,
    };
  });
  writeFileSync(join(outDir, `${label}-metrics.json`), JSON.stringify(data, null, 2));
  return data;
}

async function setRefTheme(page, product, mode) {
  await page.evaluate(({ product, mode }) => {
    localStorage.setItem("theme", mode);
    localStorage.setItem("colorTheme", product);
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add(`theme-${product}`);
    if (mode === "dark") document.documentElement.classList.add("dark");
  }, { product, mode });
  await delay(400);
}

async function setDemo(page, product, mode) {
  await page.evaluate(({ product, mode }) => {
    const app = document.querySelector("demo-app");
    if (app) {
      app.product = product;
      localStorage.setItem("harmony-vanilla-demo-product", product);
    }
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add(`theme-${product}`);
    if (mode === "dark") document.documentElement.classList.add("dark");
  }, { product, mode });
  await delay(700);
}

async function shotMain(page, name) {
  const box = await page.evaluate(() => {
    const main = document.querySelector("demo-app")?.shadowRoot?.querySelector("main");
    if (!main) return null;
    const r = main.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.max(1, r.width), height: Math.min(r.height, 920) };
  });
  if (!box) {
    await page.screenshot({ path: join(outDir, name) });
    return;
  }
  await page.screenshot({ path: join(outDir, name), clip: box });
}

async function scrollConvHeading(page, text) {
  return page.evaluate((text) => {
    const app = document.querySelector("demo-app");
    const main = app?.shadowRoot?.querySelector("main");
    const pageHost = app?.shadowRoot?.querySelector("demo-dropdowns-page, demo-inputs-page");
    const root = pageHost?.shadowRoot;
    if (!root || !main) return false;
    const hs = [...root.querySelectorAll("h2,h3")];
    const h = hs.find((el) => (el.textContent || "").trim().toLowerCase().includes(text.toLowerCase()));
    if (!h) return false;
    const mainRect = main.getBoundingClientRect();
    const hRect = h.getBoundingClientRect();
    main.scrollTop += hRect.top - mainRect.top - 12;
    return true;
  }, text);
}

async function captureRef() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:4321/components/dropdowns", { waitUntil: "networkidle", timeout: 60000 });
  await setRefTheme(page, "cp", "light");
  const metrics = await fieldMetrics(page, "ref-cp-light");
  await page.screenshot({ path: join(outDir, "ref-cp-light-full.png"), fullPage: true });
  for (const name of ["Basic Dropdown", "With Label (Stacked)", "With Label (Inline)", "With Pre-selected Value", "Disabled"]) {
    const loc = page.getByRole("heading", { name, exact: true }).first();
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded();
      await delay(120);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await page.screenshot({ path: join(outDir, `ref-cp-light-${slug}.png`) });
    } else console.log("REF missing", name);
  }
  await setRefTheme(page, "cp", "dark");
  await page.screenshot({ path: join(outDir, "ref-cp-dark-full.png"), fullPage: true });
  const dark = await fieldMetrics(page, "ref-cp-dark");
  await setRefTheme(page, "vp", "light");
  await page.getByRole("heading", { name: "With Label (Stacked)", exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(outDir, "ref-vp-light-stacked.png") });
  await page.getByRole("heading", { name: "With Label (Inline)", exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(outDir, "ref-vp-light-inline.png") });
  console.log("REF headings", metrics.headings.join(" | "));
  console.log("REF fields", JSON.stringify(metrics.fields.slice(0, 6)));
  console.log("REF dark fields", JSON.stringify(dark.fields.slice(0, 3)));
  await page.close();
}

async function captureConvDropdowns() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:5178/components/dropdowns", { waitUntil: "networkidle", timeout: 60000 });
  await delay(600);
  await setDemo(page, "cp", "light");
  const metrics = await fieldMetrics(page, "conv-cp-light");
  await shotMain(page, "conv-cp-light-top.png");
  const sections = ["Basic Dropdown", "With Label (Stacked)", "With Label (Inline)", "With Pre-selected Value", "Disabled", "Error", "Multiple", "Native select", "Form layout"];
  for (const name of sections) {
    const ok = await scrollConvHeading(page, name);
    console.log("CONV scroll", name, ok);
    await delay(200);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await shotMain(page, `conv-cp-light-${slug}.png`);
  }
  await setDemo(page, "cp", "dark");
  await scrollConvHeading(page, "Basic Dropdown");
  await delay(200);
  await shotMain(page, "conv-cp-dark-basic.png");
  await scrollConvHeading(page, "Error");
  await delay(150);
  await shotMain(page, "conv-cp-dark-error.png");
  await scrollConvHeading(page, "Form layout");
  await delay(150);
  await shotMain(page, "conv-cp-dark-form.png");
  const dark = await fieldMetrics(page, "conv-cp-dark");
  await setDemo(page, "vp", "light");
  await scrollConvHeading(page, "With Label (Stacked)");
  await delay(200);
  await shotMain(page, "conv-vp-light-stacked.png");
  await scrollConvHeading(page, "With Label (Inline)");
  await delay(150);
  await shotMain(page, "conv-vp-light-inline.png");
  console.log("CONV headings", metrics.headings.join(" | "));
  console.log("CONV fields", JSON.stringify(metrics.fields.slice(0, 12)));
  console.log("CONV dark fields", JSON.stringify(dark.fields.slice(0, 4)));
  await page.close();
}

async function captureInputs() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://localhost:5178/components/inputs", { waitUntil: "networkidle", timeout: 60000 });
  await delay(600);
  await setDemo(page, "cp", "light");
  for (const name of ["Form Example", "Form layout", "Contact", "Inline labels", "Stacked"]) {
    const ok = await scrollConvHeading(page, name);
    console.log("INPUTS scroll", name, ok);
    await delay(200);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await shotMain(page, `inputs-cp-light-${slug}.png`);
  }
  const align = await page.evaluate(() => {
    function walk(root, visit) {
      visit(root);
      root.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot, visit);
      });
    }
    const hosts = [];
    walk(document, (root) => {
      root.querySelectorAll("harmony-input, harmony-select, harmony-textarea").forEach((el) => hosts.push(el));
    });
    return hosts.map((el) => {
      const r = el.getBoundingClientRect();
      const label = el.shadowRoot?.querySelector("label, [part=label]");
      const control = el.shadowRoot?.querySelector("input, select, textarea, [part=control]");
      const lr = label?.getBoundingClientRect();
      const cr = control?.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id,
        host: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        label: lr ? { x: Math.round(lr.x), y: Math.round(lr.y), w: Math.round(lr.width), h: Math.round(lr.height), text: (label.textContent || "").trim().slice(0, 40) } : null,
        control: cr ? { x: Math.round(cr.x), y: Math.round(cr.y), w: Math.round(cr.width), h: Math.round(cr.height) } : null,
      };
    }).filter((s) => s.host.w > 20 && s.host.y > 0 && s.host.y < 1100);
  });
  writeFileSync(join(outDir, "inputs-align.json"), JSON.stringify(align, null, 2));
  await page.close();
}

async function captureForcedColors() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: "active" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:5178/components/dropdowns", { waitUntil: "networkidle", timeout: 60000 });
  await delay(600);
  await setDemo(page, "cp", "light");
  await shotMain(page, "conv-forced-colors-top.png");
  const hc = await page.evaluate(() => {
    const pageHost = document.querySelector("demo-app")?.shadowRoot?.querySelector("demo-dropdowns-page");
    const root = pageHost?.shadowRoot;
    const selects = [];
    function walk(node) {
      node.querySelectorAll("select").forEach((el) => selects.push(el));
      node.querySelectorAll("*").forEach((el) => {
        if (el.shadowRoot) walk(el.shadowRoot);
      });
    }
    if (root) walk(root);
    const styleOf = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        multiple: el.multiple,
        disabled: el.disabled,
        bg: cs.backgroundColor,
        color: cs.color,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        appearance: cs.appearance,
        bgImage: cs.backgroundImage === "none" ? "none" : "image",
        outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
      };
    };
    const basic = selects.find((s) => !s.multiple && !s.disabled);
    basic?.focus();
    const errorHost = root?.querySelector("harmony-select[error]");
    return {
      forced: matchMedia("(forced-colors: active)").matches,
      focused: styleOf(basic),
      disabled: styleOf(selects.find((s) => s.disabled)),
      multi: styleOf(selects.find((s) => s.multiple)),
      error: styleOf(errorHost?.shadowRoot?.querySelector("select")),
      count: selects.length,
    };
  });
  writeFileSync(join(outDir, "conv-forced-colors-metrics.json"), JSON.stringify(hc, null, 2));
  await page.screenshot({ path: join(outDir, "conv-forced-colors-focus.png") });
  await scrollConvHeading(page, "Error");
  await delay(200);
  await shotMain(page, "conv-forced-colors-error.png");
  await scrollConvHeading(page, "Disabled");
  await delay(150);
  await shotMain(page, "conv-forced-colors-disabled.png");
  console.log("HC", JSON.stringify(hc));
  await ctx.close();
}

await captureRef();
await captureConvDropdowns();
await captureInputs();
await captureForcedColors();
await browser.close();
console.log("ALL DONE");
