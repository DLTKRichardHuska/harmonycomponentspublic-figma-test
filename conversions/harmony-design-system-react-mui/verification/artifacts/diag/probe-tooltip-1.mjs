import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const outDir = "C:/Workspaces/harmonycomponentspublic/conversions/harmony-design-system-react-mui/verification/artifacts/diag";
mkdirSync(outDir, { recursive: true });

async function applyTheme(page, theme = "cp", mode = "light") {
  await page.evaluate(({ theme, mode }) => {
    localStorage.setItem("theme", mode);
    localStorage.setItem("colorTheme", theme);
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add("theme-" + theme);
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    window.dispatchEvent(new Event("storage"));
  }, { theme, mode });
  await page.waitForTimeout(350);
}

function gapMetrics(tip, trigger, placement) {
  if (!tip || !trigger) return null;
  if (placement === "top") return trigger.top - tip.bottom;
  if (placement === "bottom") return tip.top - trigger.bottom;
  if (placement === "left") return trigger.left - tip.right;
  if (placement === "right") return tip.left - trigger.right;
  return null;
}

async function visibleRefTip(page) {
  return page.evaluate(() => {
    const tips = [...document.querySelectorAll(".tooltip__content")];
    const v = tips.find((t) => getComputedStyle(t).visibility === "visible" && parseFloat(getComputedStyle(t).opacity) > 0.5);
    if (!v) return null;
    const cs = getComputedStyle(v);
    const after = getComputedStyle(v, "::after");
    const r = v.getBoundingClientRect();
    const trigger = v.parentElement && v.parentElement.querySelector("button, span, a");
    const tr = trigger && trigger.getBoundingClientRect();
    return {
      text: v.textContent, bg: cs.backgroundColor, color: cs.color, fontSize: cs.fontSize, fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, padding: cs.padding, borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow, whiteSpace: cs.whiteSpace, afterBorderTop: after.borderTopColor, afterDisplay: after.display,
      tipRect: { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height },
      triggerRect: tr ? { top: tr.top, left: tr.left, bottom: tr.bottom, right: tr.right, width: tr.width, height: tr.height } : null,
    };
  });
}

async function visibleConvTip(page) {
  return page.evaluate(() => {
    const v = document.querySelector(".MuiTooltip-tooltip");
    if (!v) return null;
    const cs = getComputedStyle(v);
    const r = v.getBoundingClientRect();
    const arrow = document.querySelector(".MuiTooltip-arrow");
    const acs = arrow && getComputedStyle(arrow);
    return {
      text: v.textContent, bg: cs.backgroundColor, color: cs.color, fontSize: cs.fontSize, fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, padding: cs.padding, borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow, whiteSpace: cs.whiteSpace, maxWidth: cs.maxWidth,
      tipRect: { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height },
      hasArrow: !!arrow, arrowColor: acs && acs.color, placementClass: v.className,
    };
  });
}

async function probeRef(page) {
  await page.goto("http://localhost:4321/components/tooltips", { waitUntil: "networkidle" });
  await applyTheme(page);
  const btn = page.locator("#examples button", { hasText: "Hover me" }).first();
  await btn.hover();
  await page.waitForTimeout(250);
  const styles = await visibleRefTip(page);
  const btnRect = await btn.evaluate((el) => el.getBoundingClientRect().toJSON());
  await page.screenshot({ path: join(outDir, "tooltip-ref-basic-cp-light.png") });

  const positions = {};
  for (const label of ["Top", "Bottom", "Left", "Right"]) {
    const b = page.locator("#examples button", { hasText: new RegExp("^" + label + "$") }).first();
    await b.hover();
    await page.waitForTimeout(200);
    const visible = await visibleRefTip(page);
    positions[label] = { ...visible, gap: gapMetrics(visible && visible.tipRect, visible && visible.triggerRect, label.toLowerCase()) };
  }

  // Icon in On Different Elements — first icon-btn inside examples article section
  const iconBtn = page.locator("#examples .tooltip .icon-btn").first();
  await iconBtn.hover();
  await page.waitForTimeout(200);
  const iconTip = await visibleRefTip(page);

  const textSpan = page.locator("#examples").getByText("Hover for info").first();
  await textSpan.hover();
  await page.waitForTimeout(200);
  const textTip = await visibleRefTip(page);

  const structure = await page.evaluate(() => ({
    h1: document.querySelector("h1") && document.querySelector("h1").textContent.trim(),
    badge: document.querySelector(".badge") && document.querySelector(".badge").textContent.trim(),
    desc: document.querySelector(".page-header__description") && document.querySelector(".page-header__description").textContent.trim(),
    sections: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    exampleTitles: [...document.querySelectorAll("#examples .example-section__title, #examples h3")].map((h) => h.textContent.trim()),
    a11yCards: [...document.querySelectorAll(".a11y-card__title")].map((h) => h.textContent.trim()),
    navLinks: [...document.querySelectorAll(".article-nav__link")].map((a) => a.textContent.trim()),
    cornerButtons: [...document.querySelectorAll("#examples button")].filter((b) => /Corner/.test(b.textContent || "")).length,
  }));

  await page.screenshot({ path: join(outDir, "tooltip-ref-page-cp-light.png"), fullPage: true });

  await applyTheme(page, "cp", "dark");
  await page.locator("#examples button", { hasText: "Hover me" }).first().hover();
  await page.waitForTimeout(250);
  const darkStyles = await visibleRefTip(page);
  await page.screenshot({ path: join(outDir, "tooltip-ref-basic-cp-dark.png") });
  return { styles, btnRect, positions, iconTip, textTip, structure, darkStyles };
}

async function probeConv(page) {
  await page.goto("http://localhost:5176/components/tooltips", { waitUntil: "networkidle" });
  await applyTheme(page);
  await page.waitForTimeout(500);
  const btn = page.locator("button", { hasText: "Hover me" }).first();
  await btn.hover();
  await page.waitForTimeout(450);
  await page.locator(".MuiTooltip-tooltip").first().waitFor({ state: "visible", timeout: 4000 });
  const styles = await visibleConvTip(page);
  const btnRect = await btn.evaluate((el) => el.getBoundingClientRect().toJSON());
  await page.screenshot({ path: join(outDir, "tooltip-conv-basic-cp-light.png") });

  const positions = {};
  for (const label of ["Top", "Bottom", "Left", "Right"]) {
    const b = page.locator("button", { hasText: new RegExp("^" + label + "$") }).first();
    await b.hover();
    await page.waitForTimeout(400);
    const visible = await visibleConvTip(page);
    const tr = await b.evaluate((el) => el.getBoundingClientRect().toJSON());
    positions[label] = { ...visible, triggerRect: tr, gap: gapMetrics(visible && visible.tipRect, tr, label.toLowerCase()) };
  }

  const iconBtn = page.locator('button[aria-label="Information"]').first();
  await iconBtn.hover();
  await page.waitForTimeout(400);
  const iconTip = await visibleConvTip(page);

  const textSpan = page.locator("text=Hover for info").first();
  await textSpan.hover();
  await page.waitForTimeout(400);
  const textTip = await visibleConvTip(page);

  const structure = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return {
      h1: document.querySelector("h1") && document.querySelector("h1").textContent.trim(),
      sections: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
      exampleTitles: [...document.querySelectorAll("h3")].map((h) => h.textContent.trim()),
      hasCornerCallout: bodyText.includes("cornerVariant") && bodyText.toLowerCase().includes("not supported"),
      hasCornerButtons: [...document.querySelectorAll("button")].some((b) => /Corner/.test(b.textContent || "")),
      hasStable: bodyText.includes("stable"),
      descMatch: bodyText.includes("Tooltips display informative text when users hover over an element."),
      a11yPresent: ["ARIA Attributes", "Keyboard Access", "Screen Reader Support", "Important Information"].every((t) => bodyText.includes(t)),
    };
  });

  await page.screenshot({ path: join(outDir, "tooltip-conv-page-cp-light.png"), fullPage: true });

  await applyTheme(page, "cp", "dark");
  await page.waitForTimeout(400);
  await page.locator("button", { hasText: "Hover me" }).first().hover();
  await page.waitForTimeout(450);
  const darkStyles = await visibleConvTip(page);
  await page.screenshot({ path: join(outDir, "tooltip-conv-basic-cp-dark.png") });

  await applyTheme(page, "cp", "light");
  await page.waitForTimeout(300);
  await page.locator("button", { hasText: "Hover me" }).first().focus();
  await page.waitForTimeout(450);
  const focusTip = await visibleConvTip(page);

  return { styles, btnRect, positions, iconTip, textTip, structure, darkStyles, focusTip };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const ref = await probeRef(page);
const conv = await probeConv(page);
await browser.close();
const report = { ref, conv };
writeFileSync(join(outDir, "tooltip-probe-1.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

