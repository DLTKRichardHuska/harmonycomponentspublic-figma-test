import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/alert-2";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function prepRef() {
  await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();
    document.documentElement.classList.add("theme-cp");
  });
  await page.waitForTimeout(300);
}
async function prepConv() {
  await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select") || app?.shadowRoot?.querySelector("select");
    if (select) {
      const opt = [...select.options].find(o => /cp/i.test(o.value) || /cp/i.test(o.text));
      if (opt) { select.value = opt.value; select.dispatchEvent(new Event("change", { bubbles: true })); }
    }
  });
  await page.waitForTimeout(500);
}

await prepRef();
const ref = await page.evaluate(() => {
  const alerts = [...document.querySelectorAll(".alert")].map(el => Math.round(el.getBoundingClientRect().height));
  const linkOnly = [...document.querySelectorAll(".alert--enhanced")].find(a => {
    const acts = a.querySelector(".alert__actions");
    return acts && acts.querySelector("a") && !acts.querySelector("button, .btn");
  });
  const multi = [...document.querySelectorAll(".alert--enhanced")].find(a => {
    const acts = a.querySelector(".alert__actions");
    return acts && acts.querySelector("a") && acts.querySelector("button, .btn");
  });
  const measure = (el) => {
    if (!el) return null;
    const msg = el.querySelector(".alert__message");
    const link = el.querySelector(".alert__actions a");
    return {
      h: Math.round(el.getBoundingClientRect().height),
      linkFS: link ? getComputedStyle(link).fontSize : null,
      linkLH: link ? getComputedStyle(link).lineHeight : null,
      linkH: link ? Math.round(link.getBoundingClientRect().height) : null,
      linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
      linkText: link?.textContent.trim(),
    };
  };
  return { heights: alerts, linkOnly: measure(linkOnly), multi: measure(multi) };
});
await page.screenshot({ path: join(OUT, "ref-cp-light-top.png"), fullPage: false });
await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced with Actions"));
  el?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(200);
const refClip = await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced with Actions"));
  const section = el?.closest(".example-section, .example, section") || el?.parentElement;
  const r = section.getBoundingClientRect();
  return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(1100,r.width), height: Math.min(420,r.height) };
});
await page.screenshot({ path: join(OUT, "ref-sec-enhanced-with-actions.png"), clip: refClip });

await prepConv();
const conv = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  if (!root) return { error: "missing" };
  const alerts = [...root.querySelectorAll("harmony-alert")];
  const measure = (el) => {
    if (!el) return null;
    const sr = el.shadowRoot;
    const msg = sr.querySelector("[part=message]");
    const slot = sr.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({ flatten: true }) || [];
    const link = assigned.flatMap(n => n.tagName === "A" ? [n] : [...(n.querySelectorAll?.("a") || [])])[0];
    return {
      h: Math.round(el.getBoundingClientRect().height),
      linkFS: link ? getComputedStyle(link).fontSize : null,
      linkLH: link ? getComputedStyle(link).lineHeight : null,
      linkH: link ? Math.round(link.getBoundingClientRect().height) : null,
      linkCls: link?.className || null,
      linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
      linkText: link?.textContent.trim(),
    };
  };
  const linkOnly = alerts.find(a => {
    const slot = a.shadowRoot.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({ flatten: true }) || [];
    const hasLink = assigned.some(n => n.tagName === "A" || n.querySelector?.("a"));
    const hasBtn = assigned.some(n => n.tagName === "HARMONY-BUTTON" || n.querySelector?.("harmony-button,button"));
    return hasLink && !hasBtn;
  });
  const multi = alerts.find(a => {
    const slot = a.shadowRoot.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({ flatten: true }) || [];
    const hasLink = assigned.some(n => n.tagName === "A" || n.querySelector?.("a"));
    const hasBtn = assigned.some(n => n.tagName === "HARMONY-BUTTON" || n.querySelector?.("harmony-button,button"));
    return hasLink && hasBtn;
  });
  return {
    heights: alerts.map(el => Math.round(el.getBoundingClientRect().height)),
    linkOnly: measure(linkOnly),
    multi: measure(multi),
  };
});
await page.screenshot({ path: join(OUT, "conv-cp-light-top.png"), fullPage: false });
await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const el = [...root.querySelectorAll("h2")].find(h => h.textContent.trim() === "Enhanced with Actions");
  el?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(200);
const convClip = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const el = [...root.querySelectorAll("h2")].find(h => h.textContent.trim() === "Enhanced with Actions");
  const demo = el.nextElementSibling;
  const r1 = el.getBoundingClientRect();
  const r2 = demo.getBoundingClientRect();
  return { x: Math.max(0, Math.min(r1.x, r2.x)), y: Math.max(0, Math.min(r1.y, r2.y)), width: Math.min(1100, Math.max(r1.width, r2.width)), height: Math.min(480, Math.max(r1.bottom, r2.bottom) - Math.min(r1.y, r2.y)) };
});
await page.screenshot({ path: join(OUT, "conv-sec-enhanced-with-actions.png"), clip: convClip });

const summary = { ref, conv, match: {
  linkOnlyFS: ref.linkOnly?.linkFS === conv.linkOnly?.linkFS,
  linkOnlyH: ref.linkOnly?.h === conv.linkOnly?.h,
  linkOnlyDelta: ref.linkOnly?.linkDelta === 0 && conv.linkOnly?.linkDelta === 0,
  heightsEqual: JSON.stringify(ref.heights) === JSON.stringify(conv.heights),
}};
writeFileSync(join(OUT, "capture-metrics.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
