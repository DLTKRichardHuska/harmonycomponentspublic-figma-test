import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const outDir = dirname(fileURLToPath(import.meta.url));

async function setConvMode(page, mode) {
  // Click the demo mode toggle via React state: set localStorage then reload
  await page.evaluate((mode) => {
    localStorage.setItem("theme", mode);
    localStorage.setItem("colorTheme", "cp");
  }, mode);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const htmlClass = await page.evaluate(() => ({
    className: document.documentElement.className,
    dataset: { ...document.documentElement.dataset },
    modeStorage: localStorage.getItem("theme"),
    muiMode: document.body.getAttribute("data-mui-color-scheme") || document.documentElement.getAttribute("data-mui-color-scheme"),
  }));
  return htmlClass;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:5176/components/tooltips", { waitUntil: "networkidle" });
const lightMeta = await setConvMode(page, "light");
await page.locator("button", { hasText: "Hover me" }).first().hover();
await page.waitForTimeout(400);
const lightTip = await page.evaluate(() => {
  const v = document.querySelector(".MuiTooltip-tooltip");
  if (!v) return null;
  const cs = getComputedStyle(v);
  return { bg: cs.backgroundColor, color: cs.color, textPrimary: getComputedStyle(document.body).color };
});
const lightPalette = await page.evaluate(() => {
  // read CSS vars if any
  const s = getComputedStyle(document.documentElement);
  return {
    bodyBg: getComputedStyle(document.body).backgroundColor,
    htmlClass: document.documentElement.className,
  };
});

const darkMeta = await setConvMode(page, "dark");
await page.locator("button", { hasText: "Hover me" }).first().hover();
await page.waitForTimeout(400);
const darkTip = await page.evaluate(() => {
  const v = document.querySelector(".MuiTooltip-tooltip");
  if (!v) return null;
  const cs = getComputedStyle(v);
  return { bg: cs.backgroundColor, color: cs.color };
});
const darkPage = await page.evaluate(() => ({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  htmlClass: document.documentElement.className,
  muiScheme: document.documentElement.getAttribute("data-mui-color-scheme"),
}));
await page.screenshot({ path: join(outDir, "tooltip-conv-dark-reload.png") });

// Reference dark for comparison
await page.goto("http://localhost:4321/components/tooltips", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem("theme", "dark");
  localStorage.setItem("colorTheme", "cp");
  document.documentElement.classList.add("dark", "theme-cp");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.locator("#examples button", { hasText: "Hover me" }).first().hover();
await page.waitForTimeout(250);
const refDark = await page.evaluate(() => {
  const tips = [...document.querySelectorAll(".tooltip__content")];
  const v = tips.find((t) => getComputedStyle(t).visibility === "visible" && parseFloat(getComputedStyle(t).opacity) > 0.5);
  if (!v) return null;
  const cs = getComputedStyle(v);
  return { bg: cs.backgroundColor, color: cs.color, htmlClass: document.documentElement.className };
});
await page.screenshot({ path: join(outDir, "tooltip-ref-dark-reload.png") });

await browser.close();
const out = { lightMeta, lightTip, lightPalette, darkMeta, darkTip, darkPage, refDark };
writeFileSync(join(outDir, "tooltip-dark-check.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
