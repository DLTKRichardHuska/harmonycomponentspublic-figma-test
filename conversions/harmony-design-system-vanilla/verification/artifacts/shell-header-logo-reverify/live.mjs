import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
const outDir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const failed = [];
page.on("response", (r) => { if (r.status() >= 400) failed.push({ s: r.status(), u: r.url() }); });
await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle", timeout: 60000 });
await delay(1500);
await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  if (app) app.product = "cp";
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
  localStorage.setItem("harmony-demo-product", "cp");
  localStorage.setItem("harmony-color-scheme", "light");
});
await delay(1000);
const info = await page.evaluate(() => {
  function walk(root, fn){ fn(root); root.querySelectorAll("*").forEach(el=>{ if(el.shadowRoot) walk(el.shadowRoot, fn); }); }
  let svg=null, name=null;
  walk(document, (root)=>{
    root.querySelectorAll("harmony-shell-header").forEach(el=>{
      if(!svg) svg = el.shadowRoot?.querySelector("svg");
      if(!name) name = el.shadowRoot?.querySelector(".header__title")?.textContent;
    });
  });
  return {
    text: document.body.innerText.slice(0,300),
    hasHeader: !!document.body.innerText.includes("Shell Header"),
    name,
    hasSvg: !!svg,
    clip: svg?.querySelector("clipPath rect")?.outerHTML || null,
    fillBlue: svg ? [...svg.querySelectorAll("[fill=\"#4C92D9\"]")].length : 0,
  };
});
console.log(JSON.stringify({ failed: failed.slice(0,5), info }, null, 2));
await page.screenshot({ path: join(outDir, "van-live.png") });
// also screenshot ref brand
const page2 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page2.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle", timeout: 60000 });
await page2.evaluate(() => { document.documentElement.classList.add("theme-cp"); document.documentElement.classList.remove("dark"); });
await delay(500);
await page2.screenshot({ path: join(outDir, "ref-live.png"), clip: { x: 300, y: 430, width: 520, height: 80 } });
await browser.close();
