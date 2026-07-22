import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
for (const mode of ["light", "dark"]) {
  await page.goto("http://localhost:5176/components/tooltips", { waitUntil: "networkidle" });
  await page.evaluate((mode) => { localStorage.setItem("theme", mode); localStorage.setItem("colorTheme", "cp"); }, mode);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  // inject a probe element using MUI CSS vars
  const vars = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const pick = (n) => root.getPropertyValue(n).trim();
    return {
      modeClass: document.documentElement.className,
      textPrimary: pick("--mui-palette-text-primary"),
      textSecondary: pick("--mui-palette-text-secondary"),
      bgDefault: pick("--mui-palette-background-default"),
      // also check computed on a dummy
    };
  });
  await page.locator("button", { hasText: "Hover me" }).first().hover();
  await page.waitForTimeout(350);
  const tip = await page.evaluate(() => {
    const v = document.querySelector(".MuiTooltip-tooltip");
    if (!v) return null;
    const cs = getComputedStyle(v);
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      bgRaw: v.style.backgroundColor,
      className: v.className,
      // computed CSS variable usage from stylesheet
      cssBg: (() => {
        // walk matching rules
        return null;
      })(),
    };
  });
  console.log(mode, JSON.stringify({ vars, tip }, null, 2));
}
await browser.close();
