import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const art = "conversions/harmony-design-system-shadcn/verification/artifacts/date-input-2";
mkdirSync(art, { recursive: true });

async function setup(page) {
  await page.evaluate(() => {
    const html = document.documentElement;
    html.classList.remove("dark");
    html.className = (html.className || "").replace(/theme-\w+/g, "") + " theme-cp";
  });
  await page.waitForTimeout(300);
}

async function capturePage(url, outBase, options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await setup(page);
  if (options.scrollTo) {
    const el = page.locator(options.scrollTo).first();
    if (await el.count()) await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
  }
  writeFileSync(join(art, outBase + ".png"), await page.screenshot({ type: "png", fullPage: !!options.fullPage }));
  if (options.html) {
    writeFileSync(join(art, outBase + ".html"), await page.content(), "utf8");
  }
  // content inventory snippet
  const inventory = await page.evaluate(() => {
    const nav = [...document.querySelectorAll("nav a, aside a, [class*='article'] a")].map((a) => ({
      text: (a.textContent || "").trim(),
      href: a.getAttribute("href"),
    }));
    const headings = [...document.querySelectorAll("h1,h2,h3")].map((h) => ({
      tag: h.tagName,
      id: h.id || h.closest("[id]")?.id || null,
      text: (h.textContent || "").trim().slice(0, 100),
    }));
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id).filter(Boolean);
    return { nav, headings, ids };
  });
  writeFileSync(join(art, outBase + "-inventory.json"), JSON.stringify(inventory, null, 2));
  await browser.close();
  console.log("page", outBase);
}

async function captureOpen(url, outPrefix, clickSelector) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await setup(page);
  const trigger = page.locator(clickSelector).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click({ force: true });
  await page.waitForTimeout(700);
  writeFileSync(join(art, outPrefix + "-open.png"), await page.screenshot({ type: "png" }));
  const selectors = [
    "[data-radix-popper-content-wrapper]",
    "[role=dialog]",
    ".rdp-root",
    ".rdp",
  ];
  let captured = false;
  for (const sel of selectors) {
    const panel = page.locator(sel).first();
    if (await panel.count()) {
      try {
        writeFileSync(join(art, outPrefix + "-panel.png"), await panel.screenshot({ type: "png" }));
        captured = true;
        break;
      } catch (e) {
        console.log("panel fail", outPrefix, sel, e.message);
      }
    }
  }
  // Visible panel text for chrome compare
  const panelText = await page.evaluate(() => {
    const pop =
      document.querySelector("[data-radix-popper-content-wrapper]") ||
      document.querySelector("[role=dialog]") ||
      document.querySelector(".rdp-root") ||
      document.querySelector(".rdp");
    return pop ? (pop.innerText || "").slice(0, 1500) : "";
  });
  writeFileSync(join(art, outPrefix + "-panel-text.txt"), panelText, "utf8");
  await browser.close();
  console.log("open", outPrefix, captured ? "panel" : "no-panel");
}

await capturePage("http://localhost:4321/components/date-picker", "ref-date-picker-top", { html: true });
await capturePage("http://localhost:5177/components/date-picker", "conv-date-picker-top", { html: true });
await capturePage("http://localhost:4321/components/date-picker", "ref-viewport-examples", { scrollTo: "#examples" });
await capturePage("http://localhost:5177/components/date-picker", "conv-viewport-examples", { scrollTo: "#examples" });
await capturePage("http://localhost:4321/components/date-picker", "ref-accessibility", { scrollTo: "#accessibility" });
await capturePage("http://localhost:5177/components/date-picker", "conv-accessibility", { scrollTo: "#accessibility" });
await capturePage("http://localhost:4321/components/date-picker", "ref-props", { scrollTo: "#props" });
await capturePage("http://localhost:5177/components/date-picker", "conv-props", { scrollTo: "#props" });
await capturePage("http://localhost:4321/components/specialty-inputs", "ref-specialty-datetime", {
  scrollTo: "text=Date and Time",
});
await capturePage("http://localhost:5177/components/specialty-inputs", "conv-specialty-datetime", {
  scrollTo: "text=Date and Time",
});
await capturePage("http://localhost:4321/components/specialty-inputs", "ref-specialty-props", { scrollTo: "#props" });
await capturePage("http://localhost:5177/components/specialty-inputs", "conv-specialty-props", { scrollTo: "#props" });

await captureOpen("http://localhost:4321/components/date-picker", "ref-date", "#date-basic");
await captureOpen("http://localhost:5177/components/date-picker", "conv-date", "#date-basic");
await captureOpen("http://localhost:4321/components/date-picker", "ref-time", "#time-basic");
await captureOpen("http://localhost:5177/components/date-picker", "conv-time", "#time-basic");
await captureOpen("http://localhost:4321/components/date-picker", "ref-time12", "#time-12h");
await captureOpen("http://localhost:5177/components/date-picker", "conv-time12", "#time-12h");
await captureOpen("http://localhost:4321/components/date-picker", "ref-month", "#month-basic");
await captureOpen("http://localhost:5177/components/date-picker", "conv-month", "#month-basic");
await captureOpen("http://localhost:4321/components/date-picker", "ref-week", "#week-basic");
await captureOpen("http://localhost:5177/components/date-picker", "conv-week", "#week-basic");
await captureOpen("http://localhost:4321/components/date-picker", "ref-datetime", "#datetime-basic");
await captureOpen("http://localhost:5177/components/date-picker", "conv-datetime", "#datetime-basic");

console.log("ALL DONE");
