import { chromium } from "playwright";
import { join } from "node:path";
const OUT = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/alert-1";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });

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
// scroll to Enhanced with Actions
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

await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced with Progress"));
  el?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(200);
const refProg = await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced with Progress"));
  const section = el?.closest(".example-section, .example, section") || el?.parentElement;
  const r = section.getBoundingClientRect();
  return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(1100,r.width), height: Math.min(360,r.height) };
});
await page.screenshot({ path: join(OUT, "ref-sec-enhanced-with-progress.png"), clip: refProg });

await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced Variant"));
  el?.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(200);
const refEnh = await page.evaluate(() => {
  const el = [...document.querySelectorAll("h2,h3,.example-section__title,.example__title")].find(h => h.textContent.includes("Enhanced Variant") && !h.textContent.includes("Actions") && !h.textContent.includes("Progress"));
  const section = el?.closest(".example-section, .example, section") || el?.parentElement;
  const r = section.getBoundingClientRect();
  return { x: Math.max(0,r.x), y: Math.max(0,r.y), width: Math.min(1100,r.width), height: Math.min(320,r.height) };
});
await page.screenshot({ path: join(OUT, "ref-sec-enhanced-variant.png"), clip: refEnh });

await prepConv();
for (const title of ["Enhanced Variant", "Enhanced with Actions", "Enhanced with Progress"]) {
  const clip = await page.evaluate((t) => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
    const el = [...root.querySelectorAll("h2")].find(h => h.textContent.trim() === t || (t === "Enhanced Variant" && h.textContent.trim() === "Enhanced Variant"));
    if (!el) return null;
    el.scrollIntoView({ block: "start" });
    const demo = el.nextElementSibling;
    const r1 = el.getBoundingClientRect();
    const r2 = demo.getBoundingClientRect();
    return { x: Math.max(0, Math.min(r1.x,r2.x)), y: Math.max(0, Math.min(r1.y,r2.y)), width: Math.min(1100, Math.max(r1.width,r2.width)), height: Math.min(480, Math.max(r1.bottom,r2.bottom) - Math.min(r1.y,r2.y)) };
  }, title);
  await page.waitForTimeout(150);
  // recompute after scroll
  const clip2 = await page.evaluate((t) => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
    const el = [...root.querySelectorAll("h2")].find(h => h.textContent.trim() === t);
    if (!el) return null;
    const demo = el.nextElementSibling;
    const r1 = el.getBoundingClientRect();
    const r2 = demo.getBoundingClientRect();
    return { x: Math.max(0, Math.min(r1.x,r2.x)), y: Math.max(0, Math.min(r1.y,r2.y)), width: Math.min(1100, Math.max(r1.width,r2.width)), height: Math.min(480, Math.max(r1.bottom,r2.bottom) - Math.min(r1.y,r2.y)) };
  }, title);
  if (clip2) await page.screenshot({ path: join(OUT, `conv-sec-${title.toLowerCase().replace(/\s+/g,"-")}.png`), clip: clip2 });
}

// measure link text sizes in multi-action too
const linkSizes = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  return [...root.querySelectorAll("harmony-alert[enhanced]")].map(el => {
    const slot = el.shadowRoot.querySelector("slot[name=actions]");
    const links = (slot?.assignedElements({flatten:true})||[]).flatMap(n => n.tagName==="A"?[n]:[...(n.querySelectorAll?.("a")||[])]);
    return {
      title: el.getAttribute("title"),
      links: links.map(a => ({ text: a.textContent.trim(), fs: getComputedStyle(a).fontSize, lh: getComputedStyle(a).lineHeight, cls: a.className })),
    };
  }).filter(x => x.links.length);
});
console.log(JSON.stringify({ linkSizes }, null, 2));
await browser.close();
