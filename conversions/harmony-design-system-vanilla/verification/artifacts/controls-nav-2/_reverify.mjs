import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem("harmony-demo-product", "cp");
  localStorage.setItem("harmony-color-scheme", "light");
});

const walkFindSrc = `function walkFind(root, sel) {
  const hit = root.querySelector(sel);
  if (hit) return hit;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const n = walkFind(el.shadowRoot, sel);
      if (n) return n;
    }
  }
  return null;
}`;

async function setCpLight(conv = true) {
  await page.evaluate((isConv) => {
    document.documentElement.classList.add("theme-cp");
    document.documentElement.classList.remove("dark");
    if (isConv) {
      const app = document.querySelector("demo-app");
      if (app) {
        app.setAttribute("product", "cp");
        app.product = "cp";
      }
    }
  }, conv);
  await delay(600);
}

async function gotoRef(path) {
  await page.goto("http://localhost:4321" + path, { waitUntil: "networkidle", timeout: 60000 });
  await setCpLight(false);
}

async function gotoConv(path) {
  await page.goto("http://localhost:5178" + path, { waitUntil: "networkidle", timeout: 60000 });
  await setCpLight(true);
}

const results = {};

// ---- Notification badges ----
await gotoRef("/components/notification-badges");
await page.screenshot({ path: join(outDir, "ref-notification-badges-cp-light-top.png") });
const refNb = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
  const numbers = [...document.querySelectorAll(".notification-badge--number")].slice(0, 12).map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      className: el.className,
      text: el.textContent.trim(),
      w: Math.round(r.width),
      h: Math.round(r.height),
      boxSizing: s.boxSizing,
      border: el.classList.contains("notification-badge--border"),
    };
  });
  return { h2, numbers };
});
results.refNb = refNb;

await gotoConv("/components/notification-badges");
await page.screenshot({ path: join(outDir, "conv-notification-badges-cp-light-top.png") });
const convNb = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-notification-badges-page") || document.querySelector("demo-notification-badges-page");
  const root = pageEl?.shadowRoot || pageEl;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const badges = [...(root?.querySelectorAll("harmony-notification-badge") || [])]
    .filter((el) => el.getAttribute("type") === "number")
    .map((el) => {
      const assigned = el.shadowRoot?.querySelector("slot:not([name])")?.assignedElements?.({ flatten: true }) || [];
      if (assigned.length) return null;
      const part = el.shadowRoot?.querySelector("[part=badge]") || el.shadowRoot?.querySelector("span");
      const s = getComputedStyle(part);
      const r = part.getBoundingClientRect();
      return {
        size: el.getAttribute("size"),
        border: el.hasAttribute("border"),
        variant: el.getAttribute("variant"),
        text: part.textContent.trim(),
        w: Math.round(r.width),
        h: Math.round(r.height),
        boxSizing: s.boxSizing,
      };
    })
    .filter(Boolean)
    .slice(0, 12);
  // forced-colors CSS presence
  const sheets = [...(document.querySelector("harmony-notification-badge")?.shadowRoot?.styleSheets || [])];
  let hasForcedColors = false;
  let fcSnippet = "";
  try {
    const styleEl = document.querySelector("harmony-notification-badge")?.shadowRoot?.querySelector("style");
    const css = styleEl?.textContent || "";
    hasForcedColors = /forced-colors/i.test(css);
    const m = css.match(/@media\s*\(\s*forced-colors\s*:\s*active\s*\)\s*\{[\s\S]{0,400}/);
    fcSnippet = m ? m[0] : "";
  } catch {}
  return { h2, badges, hasForcedColors, fcSnippet: fcSnippet.slice(0, 350) };
});
results.convNb = convNb;

// forced-colors emulated
const client = await page.context().newCDPSession(page);
await client.send("Emulation.setEmulatedMedia", {
  features: [{ name: "forced-colors", value: "active" }],
});
await delay(400);
await page.screenshot({ path: join(outDir, "conv-notification-badges-forced-colors.png") });
const fcNb = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-notification-badges-page");
  const root = pageEl?.shadowRoot;
  return [...(root?.querySelectorAll("harmony-notification-badge") || [])]
    .filter((el) => el.getAttribute("type") === "number" || el.getAttribute("type") === "overflow")
    .slice(0, 8)
    .map((el) => {
      const assigned = el.shadowRoot?.querySelector("slot:not([name])")?.assignedElements?.({ flatten: true }) || [];
      if (assigned.length && el.getAttribute("type") !== "number") {
        /* wrap ok */
      }
      const part = el.shadowRoot?.querySelector("[part=badge]") || el.shadowRoot?.querySelector("span");
      if (!part) return null;
      const s = getComputedStyle(part);
      const r = part.getBoundingClientRect();
      return {
        type: el.getAttribute("type"),
        size: el.getAttribute("size"),
        text: part.textContent.trim(),
        color: s.color,
        bg: s.backgroundColor,
        borderColor: s.borderColor,
        w: Math.round(r.width),
        h: Math.round(r.height),
        forcedColorAdjust: s.forcedColorAdjust,
      };
    })
    .filter(Boolean);
});
results.fcNb = fcNb;
await client.send("Emulation.setEmulatedMedia", {
  features: [{ name: "forced-colors", value: "none" }],
});

// ---- Checkboxes ----
await gotoRef("/components/checkboxes");
await page.screenshot({ path: join(outDir, "ref-checkboxes-cp-light-top.png") });
const refCb = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
  const usage = !!document.querySelector("#usage") || h2.some((t) => /usage/i.test(t));
  const boxes = [...document.querySelectorAll('input[type=checkbox]')].slice(0, 6).map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), boxSizing: s.boxSizing, checked: el.checked };
  });
  const doDont = [...document.querySelectorAll(".guidelines, demo-guidelines, .do-dont, [class*=guideline]")]
    .map((el) => el.tagName + ":" + (el.textContent || "").trim().slice(0, 40));
  const usageText = document.querySelector("#usage")?.innerText?.slice(0, 200) ||
    [...document.querySelectorAll("h2")].find((h) => /usage/i.test(h.textContent))?.parentElement?.innerText?.slice(0, 200);
  return { h2, usage, boxes, doDont, usageText };
});
results.refCb = refCb;

await gotoConv("/components/checkboxes");
await page.screenshot({ path: join(outDir, "conv-checkboxes-cp-light-top.png") });
const convCb = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-checkboxes-page");
  const root = pageEl?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const usage = h2.some((t) => /usage/i.test(t)) || !!root?.querySelector("#usage, demo-guidelines");
  const guidelines = root?.querySelector("demo-guidelines");
  const guidelinesText = guidelines?.shadowRoot?.textContent?.trim()?.slice(0, 300) || guidelines?.textContent?.trim()?.slice(0, 300) || null;
  const native = [...(root?.querySelectorAll('input[type=checkbox]') || [])].slice(0, 4).map((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return { w: Math.round(r.width), h: Math.round(r.height), boxSizing: s.boxSizing, path: "native" };
  });
  const ceBoxes = [...(root?.querySelectorAll("harmony-checkbox") || [])].slice(0, 6).map((el) => {
    const box = el.shadowRoot?.querySelector(".checkbox__box");
    if (!box) return { error: "no box", label: el.getAttribute("label") };
    const s = getComputedStyle(box);
    const r = box.getBoundingClientRect();
    return {
      label: el.getAttribute("label"),
      w: Math.round(r.width),
      h: Math.round(r.height),
      boxSizing: s.boxSizing,
      border: s.borderWidth,
      path: "ce",
    };
  });
  return { h2, usage, guidelinesText, native, ceBoxes };
});
results.convCb = convCb;

// scroll to usage and screenshot
await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-checkboxes-page");
  const root = pageEl?.shadowRoot;
  const h = [...(root?.querySelectorAll("h2") || [])].find((x) => /usage/i.test(x.textContent));
  h?.scrollIntoView({ block: "start" });
});
await delay(300);
await page.screenshot({ path: join(outDir, "conv-checkboxes-usage.png") });

// ---- Radio ----
await gotoRef("/components/radio-buttons");
await page.screenshot({ path: join(outDir, "ref-radio-buttons-cp-light-top.png") });
const refRadio = await page.evaluate(() => {
  const radios = [...document.querySelectorAll('input[type=radio]')].slice(0, 9).map((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      boxSizing: s.boxSizing,
      sizeClass: el.className,
    };
  });
  return { h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()), radios };
});
results.refRadio = refRadio;

await gotoConv("/components/radio-buttons");
await page.screenshot({ path: join(outDir, "conv-radio-buttons-cp-light-top.png") });
const convRadio = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-radio-buttons-page");
  const root = pageEl?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const native = [...(root?.querySelectorAll('input[type=radio]') || [])].slice(0, 6).map((el) => {
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), boxSizing: getComputedStyle(el).boxSizing, path: "native", cls: el.className };
  });
  const ce = [...(root?.querySelectorAll("harmony-radio") || [])].slice(0, 9).map((el) => {
    const circle = el.shadowRoot?.querySelector(".radio__circle");
    if (!circle) return { error: "no circle", size: el.getAttribute("size") };
    const s = getComputedStyle(circle);
    const r = circle.getBoundingClientRect();
    return {
      size: el.getAttribute("size") || "md",
      label: el.getAttribute("label"),
      w: Math.round(r.width),
      h: Math.round(r.height),
      boxSizing: s.boxSizing,
      path: "ce",
    };
  });
  return { h2, native, ce };
});
results.convRadio = convRadio;

// ---- TabStrip icons right ----
await gotoRef("/components/tab-strip");
await page.screenshot({ path: join(outDir, "ref-tab-strip-cp-light-top.png") });
const refTabs = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
  // find icons right section
  const section = [...document.querySelectorAll("h2, h3, .example-section__title")].find((h) => /icons?\s*\(?\s*right/i.test(h.textContent));
  let ir = null;
  if (section) {
    let el = section.parentElement;
    const tabs = [...(el?.querySelectorAll('[role=tab], .tab, button') || [])].slice(0, 4);
    // try tab-strip
    const strip = el?.querySelector(".tab-strip, [class*=tab]");
  }
  // probe tabs with icon-right class
  const rightTabs = [...document.querySelectorAll(".tab--icon-right, [class*=icon-right]")].slice(0, 4);
  const layout = rightTabs.map((t) => {
    const icon = t.querySelector("svg, .icon, [class*=icon], i, harmony-icon");
    const label = t.querySelector(".tab__label, .tab-strip__label, span") || t;
    const ir = icon?.getBoundingClientRect();
    const lr = label?.getBoundingClientRect();
    return {
      text: t.textContent.trim().slice(0, 40),
      iconLeft: ir ? +ir.left.toFixed(1) : null,
      labelLeft: lr ? +lr.left.toFixed(1) : null,
      iconAfterLabel: ir && lr ? ir.left > lr.left : null,
      flexDir: getComputedStyle(t).flexDirection,
    };
  });
  return { h2, layout, rightCount: rightTabs.length };
});
results.refTabs = refTabs;

await gotoConv("/components/tab-strip");
await page.screenshot({ path: join(outDir, "conv-tab-strip-cp-light-top.png") });
const convTabs = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-tab-strip-page");
  const root = pageEl?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const iconsRight = walkFind(document, "#tabs-icons-right");
  const irTabs = [...(iconsRight?.shadowRoot?.querySelectorAll("[role=tab]") || [])];
  const layout = irTabs.map((t) => {
    const icon = t.querySelector("harmony-icon, svg, .tab-strip__icon, [class*=icon]");
    const label = t.querySelector(".tab-strip__label, .tab__label, span:not([class*=icon])");
    const ir = icon?.getBoundingClientRect();
    const lr = label?.getBoundingClientRect();
    return {
      text: t.textContent.trim().slice(0, 40),
      className: String(t.className),
      iconLeft: ir ? +ir.left.toFixed(1) : null,
      labelLeft: lr ? +lr.left.toFixed(1) : null,
      iconAfterLabel: ir && lr ? ir.left > lr.left : null,
      flexDir: getComputedStyle(t).flexDirection,
      html: t.innerHTML.slice(0, 180),
    };
  });
  // scroll icons right into view
  iconsRight?.scrollIntoView?.({ block: "center" });
  return { h2, layout };
});
results.convTabs = convTabs;
await delay(300);
await page.screenshot({ path: join(outDir, "conv-tab-strip-icons-right.png") });

// also clip icons-right on ref if possible
await gotoRef("/components/tab-strip");
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2, h3, .example-section__title")].find((x) => /right/i.test(x.textContent) && /icon/i.test(x.textContent));
  h?.scrollIntoView({ block: "center" });
});
await delay(300);
await page.screenshot({ path: join(outDir, "ref-tab-strip-icons-right.png") });

// ---- ButtonGroup + ListMenu smoke ----
await gotoConv("/components/button-groups");
const convBg = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-button-groups-page");
  const root = pageEl?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const groups = [...(root?.querySelectorAll(".btn-group, harmony-button-group") || [])].length;
  const sizes = [...(root?.querySelectorAll(".btn-group") || [])].slice(0, 5).map((g) => Math.round(g.getBoundingClientRect().height));
  return { h2, groups, sizes };
});
results.convBg = convBg;
await page.screenshot({ path: join(outDir, "conv-button-groups-cp-light-top.png") });

await gotoRef("/components/button-groups");
const refBg = await page.evaluate(() => ({
  h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
  sizes: [...document.querySelectorAll(".btn-group")].slice(0, 5).map((g) => Math.round(g.getBoundingClientRect().height)),
}));
results.refBg = refBg;

await gotoConv("/components/list-menu");
const convLm = await page.evaluate(() => {
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
  const pageEl = walkFind(document, "demo-list-menu-page");
  const root = pageEl?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].map((h) => h.textContent.trim());
  const active = walkFind(root || document, ".list-menu__item.is-active, .list-menu__item[aria-current], a.is-active, button.is-active");
  let activeStyle = null;
  if (active) {
    const s = getComputedStyle(active);
    activeStyle = { bg: s.backgroundColor, color: s.color, h: Math.round(active.getBoundingClientRect().height) };
  }
  return { h2, activeStyle, menus: (root?.querySelectorAll(".list-menu, harmony-list-menu") || []).length };
});
results.convLm = convLm;
await page.screenshot({ path: join(outDir, "conv-list-menu-cp-light-top.png") });

await gotoRef("/components/list-menu");
const refLm = await page.evaluate(() => {
  const active = document.querySelector(".list-menu__item.is-active, .list-menu a.is-active");
  const s = active ? getComputedStyle(active) : null;
  return {
    h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    activeStyle: s ? { bg: s.backgroundColor, color: s.color, h: Math.round(active.getBoundingClientRect().height) } : null,
  };
});
results.refLm = refLm;

writeFileSync(join(outDir, "reverify-probe.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
