import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);
const info = await page.evaluate(() => {
  const all = [...document.querySelectorAll("*")].slice(0, 80).map(el => el.tagName.toLowerCase());
  const customs = [...document.querySelectorAll("*")].filter(el => el.tagName.includes("-")).map(el => el.tagName.toLowerCase());
  const uniq = [...new Set(customs)];
  const app = document.querySelector("demo-app") || document.querySelector("demo-shell") || document.body.firstElementChild;
  function walk(el, depth=0, acc=[]) {
    if (!el || depth > 6) return acc;
    const tag = el.tagName?.toLowerCase();
    const childTags = [...(el.children||[])].map(c => c.tagName.toLowerCase());
    let shadowChildren = [];
    if (el.shadowRoot) shadowChildren = [...el.shadowRoot.children].map(c => c.tagName.toLowerCase());
    acc.push({ tag, depth, childTags, shadowChildren });
    if (el.shadowRoot) {
      for (const c of el.shadowRoot.children) walk(c, depth+1, acc);
    }
    for (const c of el.children || []) walk(c, depth+1, acc);
    return acc;
  }
  return { uniqCustoms: uniq, tree: walk(document.body).slice(0, 60), htmlPreview: document.body.innerHTML.slice(0, 1500) };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
