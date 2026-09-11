import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle" });
await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const header = app?.shadowRoot?.querySelector("demo-header");
  const select = header?.shadowRoot?.querySelector("select");
  if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
});
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const sr = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header").shadowRoot;
  const icon = sr.querySelector("harmony-icon.header__logo");
  const isr = icon.shadowRoot;
  const svg = isr.querySelector("svg");
  const paths = [...svg.querySelectorAll("path, circle, g")].map(el => ({
    tag: el.tagName,
    fill: el.getAttribute("fill"),
    csFill: getComputedStyle(el).fill,
    opacity: getComputedStyle(el).opacity,
    display: getComputedStyle(el).display,
    visibility: getComputedStyle(el).visibility,
    box: (() => { const r = el.getBoundingClientRect(); return {w:r.width,h:r.height,x:r.x,y:r.y}; })(),
  }));
  return {
    iconCS: {
      color: getComputedStyle(icon).color,
      opacity: getComputedStyle(icon).opacity,
      display: getComputedStyle(icon).display,
      visibility: getComputedStyle(icon).visibility,
      zIndex: getComputedStyle(icon).zIndex,
      position: getComputedStyle(icon).position,
    },
    svgCS: {
      width: getComputedStyle(svg).width,
      height: getComputedStyle(svg).height,
      opacity: getComputedStyle(svg).opacity,
      overflow: getComputedStyle(svg).overflow,
      color: getComputedStyle(svg).color,
      fill: getComputedStyle(svg).fill,
    },
    svgHTML: svg.outerHTML.slice(0, 800),
    paths: paths.slice(0, 8),
    hostBg: getComputedStyle(sr.querySelector(".header")).backgroundColor,
    // check if header has bg from var
    headerVars: getComputedStyle(sr.querySelector(".header")).getPropertyValue("background-color"),
  };
});
console.log(JSON.stringify(info, null, 2));

// screenshot logo with DPR 1 and also larger padded area
const box = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const icon = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header").shadowRoot.querySelector("harmony-icon.header__logo");
  const r = icon.getBoundingClientRect();
  return { x: r.x - 5, y: r.y - 5, width: r.width + 10, height: r.height + 10 };
});
await page.screenshot({ path: "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts/conv-logo-pad.png", clip: box });

// Also force light on reference and compare header
const page2 = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
await page2.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle" });
await page2.evaluate(() => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("theme-mode", "light");
  // click mode toggle if dark
  const isDark = document.documentElement.classList.contains("dark") || getComputedStyle(document.querySelector(".demo-header")).backgroundColor.includes("51");
  return { className: document.documentElement.className, isDark };
});
// try clicking sun/moon
const toggled = await page2.evaluate(() => {
  const btn = [...document.querySelectorAll("button, [role=button]")].find(b => /dark|light|mode|moon|sun/i.test(b.getAttribute("aria-label")||b.title||b.textContent||""));
  // docs mode toggle
  const modeBtn = document.querySelector("[data-mode-toggle], .mode-toggle, button[aria-label*=mode i], button[aria-label*=theme i]");
  if (modeBtn) { modeBtn.click(); return "clicked modeBtn"; }
  // try known docs control
  const moon = document.querySelector("button[aria-label*=Dark i], button[aria-label*=Light i]");
  if (moon) { moon.click(); return "clicked moon"; }
  return "none";
});
await page2.waitForTimeout(500);
const refState = await page2.evaluate(() => ({
  htmlClass: document.documentElement.className,
  headerBg: getComputedStyle(document.querySelector(".demo-header")).backgroundColor,
  titleColor: getComputedStyle(document.querySelector(".demo-header .header__title")).color,
  themePrimary: getComputedStyle(document.documentElement).getPropertyValue("--theme-primary").trim(),
  toggled,
}));
console.log("REF_STATE", refState);
await browser.close();
