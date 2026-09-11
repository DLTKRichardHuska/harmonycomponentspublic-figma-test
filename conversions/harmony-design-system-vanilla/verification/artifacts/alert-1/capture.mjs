import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/alert-1";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function setRefCpLight() {
  await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();
    document.documentElement.classList.add("theme-cp");
  });
  await page.waitForTimeout(300);
}

async function setConvCpLight() {
  await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
  });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select") || app?.shadowRoot?.querySelector("select");
    if (select) {
      const opt = [...select.options].find(o => /cp/i.test(o.value) || /cp/i.test(o.text));
      if (opt) {
        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        select.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  });
  await page.waitForTimeout(500);
}

await setRefCpLight();
await page.screenshot({ path: join(OUT, "ref-cp-light-top.png"), fullPage: false });
await page.screenshot({ path: join(OUT, "ref-cp-light-full.png"), fullPage: true });

// section clips by scrolling to examples
for (const title of ["Variants", "Dismissible", "Without Title", "Enhanced Variant", "Enhanced with Actions", "Enhanced with Progress"]) {
  const box = await page.evaluate((t) => {
    const headings = [...document.querySelectorAll("h2, h3, .example-section__title, .example__title, .example__header")];
    // ExampleSection may use different structure
    let el = headings.find(h => h.textContent.trim().includes(t));
    if (!el) {
      // try example cards
      const cards = [...document.querySelectorAll(".example, .example-section")];
      const card = cards.find(c => c.textContent.includes(t));
      if (card) {
        const r = card.getBoundingClientRect();
        return { x: r.x, y: r.y + window.scrollY, width: r.width, height: Math.min(r.height, 480), abs: true };
      }
      return null;
    }
    const section = el.closest(".example-section, .example, section") || el.parentElement;
    const r = section.getBoundingClientRect();
    return { x: r.x, y: r.y + window.scrollY, width: r.width, height: Math.min(r.height, 480), abs: true };
  }, title);
  if (box) {
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 80)), box.y);
    await page.waitForTimeout(150);
    const clip = await page.evaluate((t) => {
      const headings = [...document.querySelectorAll("h2, h3, .example-section__title, .example__title")];
      let el = headings.find(h => h.textContent.trim().includes(t));
      if (!el) return null;
      const section = el.closest(".example-section, .example, section") || el.parentElement;
      const r = section.getBoundingClientRect();
      return { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(1100, r.width), height: Math.min(520, r.height) };
    }, title);
    if (clip && clip.height > 20) {
      await page.screenshot({ path: join(OUT, `ref-sec-${title.toLowerCase().replace(/\s+/g,"-")}.png`), clip }).catch(()=>{});
    }
  }
}

const refMetrics = await page.evaluate(() => {
  const alerts = [...document.querySelectorAll(".alert")].map(el => Math.round(el.getBoundingClientRect().height));
  const linkOnly = [...document.querySelectorAll(".alert--enhanced")].find(a => {
    const acts = a.querySelector(".alert__actions");
    return acts && acts.querySelector("a") && !acts.querySelector("button, .btn");
  });
  const msg = linkOnly?.querySelector(".alert__message");
  const link = linkOnly?.querySelector(".alert__actions a");
  return {
    heights: alerts,
    linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
    linkOnlyH: linkOnly ? Math.round(linkOnly.getBoundingClientRect().height) : null,
  };
});

await setConvCpLight();
await page.screenshot({ path: join(OUT, "conv-cp-light-top.png"), fullPage: false });
await page.screenshot({ path: join(OUT, "conv-cp-light-full.png"), fullPage: true });

for (const title of ["Variants", "Dismissible", "Without Title", "Enhanced Variant", "Enhanced with Actions", "Enhanced with Progress", "API", "Accessibility"]) {
  const clip = await page.evaluate((t) => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
    if (!root) return null;
    const el = [...root.querySelectorAll("h2")].find(h => h.textContent.trim().includes(t));
    if (!el) return null;
    const demo = el.nextElementSibling;
    const r1 = el.getBoundingClientRect();
    const r2 = demo?.getBoundingClientRect() || r1;
    const top = Math.min(r1.y, r2.y);
    const bottom = Math.max(r1.bottom, r2.bottom);
    return { x: Math.max(0, Math.min(r1.x, r2.x)), y: Math.max(0, top), width: Math.min(1100, Math.max(r1.width, r2.width)), height: Math.min(560, bottom - top) };
  }, title);
  if (clip && clip.height > 20) {
    await page.screenshot({ path: join(OUT, `conv-sec-${title.toLowerCase().replace(/\s+/g,"-")}.png`), clip }).catch(()=>{});
  }
}

// dark
await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.waitForTimeout(300);
await page.screenshot({ path: join(OUT, "conv-cp-dark-top.png"), fullPage: false });
const convDark = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const el = root?.querySelector("harmony-alert[variant=info]:not([enhanced])");
  const en = root?.querySelector("harmony-alert[enhanced][variant=success]");
  return {
    basicBg: getComputedStyle(el).backgroundColor,
    enhancedBg: getComputedStyle(en).backgroundColor,
    borderBg: getComputedStyle(en.shadowRoot.querySelector("[part=border]")).backgroundColor,
  };
});

await page.evaluate(() => document.documentElement.classList.remove("dark"));
const client = await page.context().newCDPSession(page);
await client.send("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "active" }] });
await page.waitForTimeout(300);
await page.screenshot({ path: join(OUT, "conv-forced-colors-top.png"), fullPage: false });
const fc = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const el = root?.querySelector("harmony-alert");
  const en = root?.querySelector("harmony-alert[enhanced]");
  const probe = (t) => {
    if (!t) return null;
    const s = getComputedStyle(t);
    const border = t.shadowRoot.querySelector("[part=border]");
    return {
      bg: s.backgroundColor, border: s.border, color: s.color,
      borderPart: border ? { display: getComputedStyle(border).display, bg: getComputedStyle(border).backgroundColor } : null,
      title: getComputedStyle(t.shadowRoot.querySelector("[part=title]")).color,
      msg: getComputedStyle(t.shadowRoot.querySelector("[part=message]")).color,
    };
  };
  return { basic: probe(el), enhanced: probe(en) };
});

// AX role
let axAlert = [];
try {
  const { nodes } = await client.send("Accessibility.getFullAXTree");
  axAlert = (nodes||[]).filter(n => (n.role?.value||n.role)==="alert").map(n => ({
    name: n.name?.value || n.name,
    role: n.role?.value || n.role,
  }));
} catch(e) { axAlert = [{ error: String(e) }]; }

const convMetrics = await page.evaluate(() => {
  // turn off FC for height compare - already on FC; re-read after disabling? skip
  return null;
});

// disable FC and remeasure heights
await client.send("Emulation.setEmulatedMedia", { features: [{ name: "forced-colors", value: "none" }] });
await page.waitForTimeout(200);
const convHeights = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const alerts = [...root.querySelectorAll("harmony-alert")];
  const linkOnly = alerts.find(a => {
    const slot = a.shadowRoot.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({flatten:true})||[];
    const hasLink = assigned.some(n => n.tagName==="A" || n.querySelector?.("a"));
    const hasBtn = assigned.some(n => n.tagName==="HARMONY-BUTTON" || n.querySelector?.("harmony-button,button"));
    return hasLink && !hasBtn;
  });
  const msg = linkOnly?.shadowRoot.querySelector("[part=message]");
  const slot = linkOnly?.shadowRoot.querySelector("slot[name=actions]");
  const link = (slot?.assignedElements({flatten:true})||[]).flatMap(n => n.tagName==="A"?[n]:[...(n.querySelectorAll?.("a")||[])])[0];
  return {
    heights: alerts.map(el => Math.round(el.getBoundingClientRect().height)),
    linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
    linkOnlyH: linkOnly ? Math.round(linkOnly.getBoundingClientRect().height) : null,
  };
});

const summary = { refMetrics, convHeights, convDark, fc, axAlert };
writeFileSync(join(OUT, "capture-metrics.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();
