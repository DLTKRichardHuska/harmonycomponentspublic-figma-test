import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });

async function setRefTheme(page, product = "cp", mode = "light") {
  await page.evaluate(({ product, mode }) => {
    localStorage.setItem("theme", mode);
    localStorage.setItem("colorTheme", product);
    const html = document.documentElement;
    [...html.classList].forEach((c) => {
      if (c.startsWith("theme-") || c === "dark") html.classList.remove(c);
    });
    html.classList.add(`theme-${product}`);
    if (mode === "dark") html.classList.add("dark");
  }, { product, mode });
}

async function setConvProduct(page, product = "cp", mode = "light") {
  await page.evaluate(({ product, mode }) => {
    localStorage.setItem("harmony-demo-product", product);
    const html = document.documentElement;
    if (mode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }, { product, mode });
  // Set product via demo-app attribute / select in shadow
  await page.evaluate((product) => {
    const app = document.querySelector("demo-app");
    if (app) app.setAttribute("product", product);
  }, product);
  // Also try select in demo-header shadow
  const header = page.locator("demo-header");
  if (await header.count()) {
    await page.evaluate((product) => {
      const header = document.querySelector("demo-header");
      const select = header?.shadowRoot?.querySelector("#product-select");
      if (select) {
        select.value = product;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, product);
  }
  await delay(600);
}

async function clipSection(page, role, name, headingText, fileSuffix) {
  // Find h2 by text in light or shadow
  const box = await page.evaluate((headingText) => {
    function findInRoot(root) {
      const headings = [...root.querySelectorAll("h2, h3, .example-section__title")];
      for (const h of headings) {
        if ((h.textContent || "").trim().toLowerCase().includes(headingText.toLowerCase())) {
          // climb to example container
          let el = h.closest(".example-section, section, demo-example") || h.parentElement;
          // for demo, include following demo-example
          if (el && el.tagName?.toLowerCase() === "h2") {
            const next = el.nextElementSibling;
            if (next) {
              const wrap = document.createElement("div");
              // get bounding of h2 + next
              const r1 = el.getBoundingClientRect();
              const r2 = next.getBoundingClientRect();
              return {
                x: Math.min(r1.x, r2.x),
                y: Math.min(r1.y, r2.y),
                width: Math.max(r1.right, r2.right) - Math.min(r1.x, r2.x),
                height: Math.max(r1.bottom, r2.bottom) - Math.min(r1.y, r2.y),
              };
            }
          }
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }
      }
      // search shadow roots
      for (const host of root.querySelectorAll("*")) {
        if (host.shadowRoot) {
          const found = findInRoot(host.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    }
    return findInRoot(document);
  }, headingText);
  if (!box || box.width < 10) {
    console.log(`NOCLIP ${role} ${name} ${fileSuffix}`);
    return;
  }
  await page.screenshot({
    path: `${outDir}/${role}-${name}-${fileSuffix}.png`,
    clip: {
      x: Math.max(0, box.x - 8),
      y: Math.max(0, box.y - 8),
      width: Math.min(box.width + 16, 1200),
      height: Math.min(box.height + 16, 900),
    },
  });
  console.log(`CLIP ${role} ${name} ${fileSuffix}`);
}

const pages = [
  ["checkboxes", "http://localhost:4321/components/checkboxes", "http://localhost:5178/components/checkboxes"],
  ["radio-buttons", "http://localhost:4321/components/radio-buttons", "http://localhost:5178/components/radio-buttons"],
  ["toggle-switches", "http://localhost:4321/components/toggle-switches", "http://localhost:5178/components/toggle-switches"],
  ["tab-strip", "http://localhost:4321/components/tab-strip", "http://localhost:5178/components/tab-strip"],
];

for (const [name, refUrl, convUrl] of pages) {
  // REF CP light
  {
    const page = await context.newPage();
    await page.goto(refUrl, { waitUntil: "networkidle", timeout: 60000 });
    await setRefTheme(page, "cp", "light");
    await delay(400);
    await page.screenshot({ path: `${outDir}/ref-${name}-cp-light-full.png`, fullPage: true });
    await page.screenshot({ path: `${outDir}/ref-${name}-cp-light-top.png`, fullPage: false });
    if (name === "toggle-switches") await clipSection(page, "ref", name, "Segmented", "sec-segmented");
    if (name === "checkboxes") await clipSection(page, "ref", name, "State Variants", "sec-state-variants");
    if (name === "tab-strip") {
      await clipSection(page, "ref", name, "Basic Tabs", "sec-basic");
      await clipSection(page, "ref", name, "With Overflow", "sec-overflow");
      await clipSection(page, "ref", name, "Per-tab actions", "sec-actions");
    }
    // metrics sample
    const metrics = await page.evaluate(() => {
      const cb = document.querySelector('input[type=checkbox]:checked') || document.querySelector('.checkbox input:checked');
      const radio = document.querySelector('input[type=radio]:checked');
      const toggle = document.querySelector('.toggle__track, [class*=toggle]');
      function style(el) {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, border: cs.borderColor, color: cs.color };
      }
      // find toggle track
      let track = document.querySelector(".toggle__track");
      let checkedTrack = null;
      const checkedInput = document.querySelector(".toggle__input:checked");
      if (checkedInput) checkedTrack = checkedInput.nextElementSibling;
      // segmented
      const seg = document.querySelector(".toggle__track--segmented, .toggle--segmented .toggle__track");
      const segThumb = document.querySelector(".toggle__thumb--segmented");
      return {
        checkboxChecked: style(document.querySelector("input[type=checkbox]:checked")?.closest("label")?.querySelector("span, .checkbox__box") || document.querySelector("input[type=checkbox]:checked")),
        radioChecked: style(radio),
        toggleTrackOff: style(document.querySelector(".toggle__input:not(:checked) + .toggle__track")),
        toggleTrackOn: style(checkedTrack),
        segTrack: style(seg),
        segThumb: style(segThumb),
        primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      };
    });
    writeFileSync(`${outDir}/ref-${name}-metrics.json`, JSON.stringify(metrics, null, 2));
    console.log("OK ref", name);
    await page.close();
  }
  // CONV CP light
  {
    const page = await context.newPage();
    await page.goto(convUrl, { waitUntil: "networkidle", timeout: 60000 });
    await setConvProduct(page, "cp", "light");
    await delay(800);
    const productShown = await page.evaluate(() => {
      const app = document.querySelector("demo-app");
      const header = document.querySelector("demo-header");
      const select = header?.shadowRoot?.querySelector("#product-select");
      return { appProduct: app?.getAttribute("product"), select: select?.value, linkHref: document.getElementById("harmony-product-styles")?.getAttribute("href") };
    });
    writeFileSync(`${outDir}/conv-${name}-product.json`, JSON.stringify(productShown, null, 2));
    await page.screenshot({ path: `${outDir}/conv-${name}-cp-light-full.png`, fullPage: true });
    await page.screenshot({ path: `${outDir}/conv-${name}-cp-light-top.png`, fullPage: false });
    if (name === "toggle-switches") await clipSection(page, "conv", name, "Segmented", "sec-segmented");
    if (name === "checkboxes") await clipSection(page, "conv", name, "Warning", "sec-state-variants");
    if (name === "tab-strip") {
      await clipSection(page, "conv", name, "Basic tabs", "sec-basic");
      await clipSection(page, "conv", name, "Overflow", "sec-overflow");
      await clipSection(page, "conv", name, "Per-tab actions", "sec-actions");
    }
    const metrics = await page.evaluate(() => {
      function deepQuery(sel) {
        const direct = document.querySelector(sel);
        if (direct) return direct;
        const walk = (root) => {
          for (const el of root.querySelectorAll("*")) {
            if (el.shadowRoot) {
              const hit = el.shadowRoot.querySelector(sel);
              if (hit) return hit;
              const nested = walk(el.shadowRoot);
              if (nested) return nested;
            }
          }
          return null;
        };
        return walk(document);
      }
      function style(el) {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, border: cs.borderColor, color: cs.color };
      }
      const checkedTrack = deepQuery(".toggle__input:checked + .toggle__track");
      const offTrack = deepQuery(".toggle__input:not(:checked) + .toggle__track:not(.toggle__track--segmented)");
      const seg = deepQuery(".toggle__track--segmented");
      const segThumb = deepQuery(".toggle__thumb--segmented");
      const cbHost = document.querySelector("harmony-checkbox[checked]");
      const cbBox = cbHost?.shadowRoot?.querySelector(".checkbox__box, input, .box, [part]");
      return {
        productLink: document.getElementById("harmony-product-styles")?.href,
        toggleTrackOff: style(offTrack),
        toggleTrackOn: style(checkedTrack),
        segTrack: style(seg),
        segThumb: style(segThumb),
        primary: getComputedStyle(document.documentElement).getPropertyValue("--color-action").trim() || getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      };
    });
    writeFileSync(`${outDir}/conv-${name}-metrics.json`, JSON.stringify(metrics, null, 2));
    console.log("OK conv", name, productShown);
    await page.close();
  }
}

// Behavior smoke: toggle checkbox/radio/tab keyboard
{
  const page = await context.newPage();
  await page.goto("http://localhost:5178/components/checkboxes", { waitUntil: "networkidle" });
  await setConvProduct(page, "cp", "light");
  const behavior = await page.evaluate(async () => {
    const host = document.querySelector("harmony-checkbox[name=basic-1]");
    const before = host.hasAttribute("checked");
    host.focus();
    host.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    // click instead
    host.click();
    await new Promise((r) => setTimeout(r, 50));
    return { before, after: host.hasAttribute("checked") || host.checked };
  });
  writeFileSync(`${outDir}/behavior-checkbox.json`, JSON.stringify(behavior, null, 2));
  await page.close();
}

{
  const page = await context.newPage();
  await page.goto("http://localhost:5178/components/tab-strip", { waitUntil: "networkidle" });
  await setConvProduct(page, "cp", "light");
  await delay(500);
  const tabBeh = await page.evaluate(() => {
    const strip = document.querySelector("#tabs-basic") || document.querySelector("harmony-tab-strip");
    // find inside page shadow
    const pageEl = document.querySelector("demo-tab-strip-page");
    const s = pageEl?.shadowRoot?.querySelector("#tabs-basic");
    const selectedBefore = s?.getAttribute("selected") || s?.selected;
    const tabs = s?.shadowRoot?.querySelectorAll('[role=tab]');
    tabs?.[1]?.click();
    return {
      tabCount: tabs?.length ?? 0,
      selectedBefore,
      selectedAfter: s?.getAttribute("selected") || s?.selected,
      labels: [...(tabs || [])].map((t) => t.textContent.trim()).slice(0, 4),
    };
  });
  writeFileSync(`${outDir}/behavior-tabstrip.json`, JSON.stringify(tabBeh, null, 2));
  await page.close();
}

await browser.close();
console.log("done");
