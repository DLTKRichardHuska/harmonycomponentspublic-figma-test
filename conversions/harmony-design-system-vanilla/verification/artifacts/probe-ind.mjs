import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:4321/components/company-picker", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.remove("dark"));
await page.click("article .company-picker button");
await page.waitForTimeout(300);
const ref = await page.evaluate(() => {
  const ind = document.querySelector(".company-picker__option-indicator");
  const r = ind.getBoundingClientRect();
  return { w: r.width, h: r.height, bg: getComputedStyle(ind).backgroundColor };
});
console.log("REF_OPT_IND", ref);

await page.goto("http://localhost:5178/components/company-picker", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const select = app.shadowRoot.querySelector("demo-header").shadowRoot.querySelector("select");
  select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true }));
});
await page.waitForTimeout(900);
const conv = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
  p.shadowRoot.querySelector("button").click();
  const slot = p.shadowRoot.querySelector("slot");
  const opt = slot.assignedElements()[0];
  const ind = opt.querySelector("[data-option-indicator]");
  const r = ind?.getBoundingClientRect();
  return { exists: !!ind, w: r?.width, h: r?.height, bg: ind ? getComputedStyle(ind).backgroundColor : null, inline: ind?.style.cssText };
});
console.log("CONV_OPT_IND", conv);
await browser.close();
