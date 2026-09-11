import { writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const pages = [
  ["checkboxes", "http://localhost:4321/components/checkboxes", "http://localhost:5178/components/checkboxes"],
  ["radio-buttons", "http://localhost:4321/components/radio-buttons", "http://localhost:5178/components/radio-buttons"],
  ["toggle-switches", "http://localhost:4321/components/toggle-switches", "http://localhost:5178/components/toggle-switches"],
  ["tab-strip", "http://localhost:4321/components/tab-strip", "http://localhost:5178/components/tab-strip"],
];

async function theme(page, product="cp", mode="light") {
  await page.evaluate(({ product, mode }) => {
    const html = document.documentElement;
    for (const c of [...html.classList]) {
      if (c.startsWith("theme-") || c === "dark") html.classList.remove(c);
    }
    html.classList.add(`theme-${product}`);
    if (mode === "dark") html.classList.add("dark");
    // demo app product switch if present
    const sel = document.querySelector("[data-product], select[name=product], demo-header, demo-app");
    window.dispatchEvent(new CustomEvent("harmony-capture-theme", { detail: { product, mode } }));
  }, { product, mode });
  // Try common demo chrome controls
  try {
    const productBtn = page.locator('button:has-text("CP"), [aria-label*="product" i], select').first();
  } catch {}
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1600 } });

for (const [name, refUrl, convUrl] of pages) {
  for (const [role, url] of [["ref", refUrl], ["conv", convUrl]]) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await delay(800);
    // Apply CP light via known controls
    await page.evaluate(() => {
      const html = document.documentElement;
      [...html.classList].forEach(c => { if (c.startsWith("theme-") || c === "dark") html.classList.remove(c); });
      html.classList.add("theme-cp");
    });
    // Converted demo: click CP if product switch exists
    const cp = page.locator('button, [role=option], a').filter({ hasText: /^CP$/i }).first();
    if (await cp.count()) { try { await cp.click({ timeout: 1000 }); } catch {} }
    await delay(400);
    const full = `${outDir}/${role}-${name}-cp-light-full.png`;
    await page.screenshot({ path: full, fullPage: true });
    // Top viewport
    const top = `${outDir}/${role}-${name}-cp-light-top.png`;
    await page.screenshot({ path: top, fullPage: false });
    // Capture main content metrics / headings
    const meta = await page.evaluate(() => {
      const h1 = document.querySelector("h1")?.textContent?.trim();
      const h2s = [...document.querySelectorAll("h2")].map(h => h.textContent.trim());
      const sections = [...document.querySelectorAll("h2, h3, .example-section__title, demo-example")].slice(0, 40).map(el => ({
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").trim().slice(0, 80)
      }));
      return { title: document.title, h1, h2s, href: location.href };
    });
    writeFileSync(`${outDir}/${role}-${name}-meta.json`, JSON.stringify(meta, null, 2));
    console.log(`OK ${role} ${name}`);
    await page.close();
  }
}

// Dark mode top captures for each
for (const [name, refUrl, convUrl] of pages) {
  for (const [role, url] of [["ref", refUrl], ["conv", convUrl]]) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => {
      const html = document.documentElement;
      [...html.classList].forEach(c => { if (c.startsWith("theme-") || c === "dark") html.classList.remove(c); });
      html.classList.add("theme-cp", "dark");
    });
    const darkBtn = page.locator('button').filter({ hasText: /dark|mode/i }).first();
    if (await darkBtn.count()) { try { await darkBtn.click({ timeout: 1000 }); } catch {} }
    await delay(500);
    await page.screenshot({ path: `${outDir}/${role}-${name}-cp-dark-top.png`, fullPage: false });
    console.log(`OK dark ${role} ${name}`);
    await page.close();
  }
}

await browser.close();
console.log("done");
