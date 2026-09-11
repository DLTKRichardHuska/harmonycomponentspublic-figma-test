import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync } from "node:fs";

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => localStorage.setItem("harmony-demo-product", "cp"));

async function gotoConv(path) {
  await page.goto("http://localhost:5178" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    document.querySelector("demo-app")?.setAttribute("product", "cp");
  });
  await delay(1000);
}

await gotoConv("/components/tab-strip");
const tabInfo = await page.evaluate(() => {
  const pageEl = document.querySelector("demo-tab-strip-page");
  if (!pageEl?.shadowRoot) {
    return {
      err: "no page",
      demoTags: [...document.querySelectorAll("*")]
        .filter((e) => e.localName.startsWith("demo-"))
        .map((e) => e.localName),
    };
  }
  const root = pageEl.shadowRoot;
  const basic = root.querySelector("#tabs-basic");
  const overflow = root.querySelector("#tabs-overflow");
  const tabs = [...(basic?.shadowRoot?.querySelectorAll("[role=tab]") || [])];
  const before = tabs.map((t) => t.getAttribute("aria-selected"));
  tabs[1]?.click();
  const after = tabs.map((t) => t.getAttribute("aria-selected"));
  const more = [...(overflow?.shadowRoot?.querySelectorAll("button") || [])]
    .map((b) => b.textContent.trim())
    .filter((t) => /more|add/i.test(t));
  const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
  const cs = active && getComputedStyle(active);
  const demo = root.querySelector("[data-tab-demo]");
  const panels = [...(demo?.querySelectorAll("[data-panel]") || [])].map((p) => ({
    id: p.dataset.panel,
    active: p.classList.contains("is-active"),
  }));
  return {
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
  const pageEl = document.querySelector("demo-checkboxes-page");
  const host = pageEl?.shadowRoot?.querySelector('harmony-checkbox[name="basic-1"]');
  if (!host) {
    return {
      err: "no host",
      names: [...(pageEl?.shadowRoot?.querySelectorAll("harmony-checkbox") || [])].map((h) =>
        h.getAttribute("name"),
      ),
    };
  }
  const before = host.checked;
  host.click();
  const after = host.checked;
  const checked = pageEl.shadowRoot.querySelector("harmony-checkbox[checked]:not([disabled])");
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

await page.goto("http://localhost:4321/components/checkboxes", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.add("theme-cp");
  document.documentElement.classList.remove("dark");
});
await delay(400);
const refCb = await page.evaluate(() => {
  const label = [...document.querySelectorAll("label")].find((l) =>
    l.textContent.includes("Option 2 (checked)"),
  );
  const all = [...(label?.querySelectorAll("*") || [])];
  const boxes = all
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: String(el.className?.toString?.() || ""),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        bg: cs.backgroundColor,
        border: cs.borderTopColor,
      };
    })
    .filter((b) => b.w >= 14 && b.w <= 24 && b.h >= 14 && b.h <= 24);
  return { boxes, labelText: label?.textContent?.trim() };
});
writeFileSync(outDir + "/probe-ref-cb-boxes.json", JSON.stringify(refCb, null, 2));
console.log("ref cb", JSON.stringify(refCb));

await page.goto("http://localhost:4321/components/tab-strip", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.add("theme-cp");
});
await delay(400);
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
  const mores = [...document.querySelectorAll("button")]
    .filter((b) => /more/i.test(b.textContent || ""))
    .map((b) => b.textContent.trim());
  return { tabs, mores };
});
writeFileSync(outDir + "/probe-ref-tabs2.json", JSON.stringify(refTabs, null, 2));
console.log("ref tabs", JSON.stringify(refTabs));

await page.emulateMedia({ forcedColors: "active" });
for (const [path, name] of [
  ["/components/checkboxes", "checkboxes"],
  ["/components/radio-buttons", "radio"],
  ["/components/toggle-switches", "toggle"],
  ["/components/tab-strip", "tabstrip"],
]) {
  await gotoConv(path);
  await page.screenshot({
    path: outDir + "/conv-" + name + "-forced-colors-top.png",
    fullPage: false,
  });
  console.log("fc", name);
}

await browser.close();
console.log("done");
