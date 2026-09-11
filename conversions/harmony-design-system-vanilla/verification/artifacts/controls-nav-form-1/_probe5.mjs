import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync } from "node:fs";

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem("harmony-demo-product", "cp");
  localStorage.setItem("harmony-color-scheme", "light");
});

function deepQuery(sel) {
  return page.evaluate((sel) => {
    const walk = (root) => {
      const hit = root.querySelector(sel);
      if (hit) return true;
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot && walk(el.shadowRoot)) return true;
      }
      return false;
    };
    return walk(document);
  }, sel);
}

async function gotoConv(path) {
  await page.goto("http://localhost:5178" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    document.querySelector("demo-app")?.setAttribute("product", "cp");
    document.documentElement.classList.remove("dark");
  });
  await delay(1200);
}

await gotoConv("/components/tab-strip");
const tabInfo = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const basic = walkFind(document, "#tabs-basic");
  const overflow = walkFind(document, "#tabs-overflow");
  const tabs = [...(basic?.shadowRoot?.querySelectorAll("[role=tab]") || [])];
  const before = tabs.map((t) => t.getAttribute("aria-selected"));
  tabs[1]?.click();
  const after = tabs.map((t) => t.getAttribute("aria-selected"));
  const more = [...(overflow?.shadowRoot?.querySelectorAll("button") || [])]
    .map((b) => b.textContent.trim())
    .filter((t) => /more|add/i.test(t));
  const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
  const cs = active && getComputedStyle(active);
  // panels near basic
  let panels = [];
  let node = basic;
  while (node && node !== document) {
    if (node.querySelectorAll) {
      const ps = [...node.querySelectorAll("[data-panel]")];
      if (ps.length) {
        panels = ps.map((p) => ({ id: p.dataset.panel, active: p.classList.contains("is-active") }));
        break;
      }
    }
    node = node.getRootNode()?.host || node.parentElement;
  }
  return {
    foundBasic: !!basic,
    tabCount: tabs.length,
    before,
    after,
    labels: tabs.map((t) => t.textContent.trim()),
    more,
    panels,
    active: cs && {
      color: cs.color,
      fw: cs.fontWeight,
      h: Math.round(active.getBoundingClientRect().height),
      borderBottomColor: cs.borderBottomColor,
      borderBottomWidth: cs.borderBottomWidth,
    },
  };
});
writeFileSync(outDir + "/behavior-tabstrip.json", JSON.stringify(tabInfo, null, 2));
console.log("tabs", JSON.stringify(tabInfo));

await gotoConv("/components/checkboxes");
const cbInfo = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const host = walkFind(document, 'harmony-checkbox[name="basic-1"]');
  if (!host) return { err: "no host" };
  const before = host.checked;
  host.click();
  const after = host.checked;
  const checked = walkFind(document, "harmony-checkbox[name='state-checked']") || walkFind(document, "harmony-checkbox[checked]");
  const all = [...(checked?.shadowRoot?.querySelectorAll("*") || [])];
  const boxes = all
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: String(el.className || ""),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        bg: cs.backgroundColor,
        border: cs.borderTopColor,
      };
    })
    .filter((b) => b.w >= 14 && b.w <= 24 && b.h >= 14 && b.h <= 24);
  return { before, after, boxes };
});
writeFileSync(outDir + "/behavior-checkbox.json", JSON.stringify(cbInfo, null, 2));
console.log("cb", JSON.stringify(cbInfo));

await gotoConv("/components/toggle-switches");
const togInfo = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const t = walkFind(document, "harmony-toggle");
  const before = t?.checked;
  t?.click();
  const after = t?.checked;
  const switchEl = t?.shadowRoot?.querySelector("[role=switch], .toggle__input, input");
  return {
    before,
    after,
    role: switchEl?.getAttribute("role") || switchEl?.type,
    ariaChecked: switchEl?.getAttribute("aria-checked"),
  };
});
writeFileSync(outDir + "/behavior-toggle.json", JSON.stringify(togInfo, null, 2));
console.log("tog", JSON.stringify(togInfo));

// Reference light mode tabs
await page.goto("http://localhost:4321/components/tab-strip", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem("theme", "light");
  localStorage.setItem("colorTheme", "cp");
  document.documentElement.classList.remove("dark", "theme-vp", "theme-ppm", "theme-maconomy");
  document.documentElement.classList.add("theme-cp");
});
await delay(500);
const refTabs = await page.evaluate(() => {
  const tabs = [...document.querySelectorAll("[role=tab]")].slice(0, 4).map((t) => {
    const cs = getComputedStyle(t);
    return {
      text: t.textContent.trim(),
      selected: t.getAttribute("aria-selected"),
      color: cs.color,
      h: Math.round(t.getBoundingClientRect().height),
      borderBottomWidth: cs.borderBottomWidth,
      borderBottomColor: cs.borderBottomColor,
      fw: cs.fontWeight,
    };
  });
  return { htmlClass: document.documentElement.className, tabs };
});
writeFileSync(outDir + "/probe-ref-tabs-light.json", JSON.stringify(refTabs, null, 2));
console.log("ref tabs light", JSON.stringify(refTabs));

// HC visibility check: sampled computed styles under forced-colors
await page.emulateMedia({ forcedColors: "active" });
await gotoConv("/components/checkboxes");
const hcCb = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const checked = walkFind(document, "harmony-checkbox[checked]");
  const box = checked?.shadowRoot?.querySelector(".checkbox__box");
  const input = checked?.shadowRoot?.querySelector("input");
  const target = box || input;
  const cs = target && getComputedStyle(target);
  const label = checked?.shadowRoot?.querySelector(".checkbox__label, label, [part=label]");
  const lcs = label && getComputedStyle(label);
  return {
    box: cs && { bg: cs.backgroundColor, border: cs.borderTopColor, color: cs.color, outline: cs.outline },
    label: lcs && { color: lcs.color },
  };
});
writeFileSync(outDir + "/probe-hc-checkbox.json", JSON.stringify(hcCb, null, 2));
console.log("hc cb", JSON.stringify(hcCb));

await gotoConv("/components/toggle-switches");
const hcTog = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const t = walkFind(document, "harmony-toggle[checked]") || walkFind(document, "harmony-toggle");
  const track = t?.shadowRoot?.querySelector(".toggle__track");
  const cs = track && getComputedStyle(track);
  return { track: cs && { bg: cs.backgroundColor, border: cs.borderTopColor, outline: cs.outline } };
});
writeFileSync(outDir + "/probe-hc-toggle.json", JSON.stringify(hcTog, null, 2));
console.log("hc tog", JSON.stringify(hcTog));

await browser.close();
console.log("done");
