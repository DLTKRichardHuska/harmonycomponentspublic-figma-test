import { writeFileSync, readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = dirname(fileURLToPath(import.meta.url));
const prev = JSON.parse(readFileSync(join(outDir, "capture-metrics.json"), "utf8"));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

await page.goto("http://localhost:4321/components/dialogs", { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => {
  localStorage.setItem("theme", "light");
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
});
await delay(400);

const dialogIds = [
  "basic-dialog",
  "confirm-dialog",
  "three-btn-dialog",
  "right-align-dialog",
  "primary-header-dialog",
  "combined-dialog",
  "resizable-dialog",
  "long-content-dialog",
];

const openMetrics = {};
for (const id of dialogIds) {
  await page.evaluate((id) => window.openDialog(id), id);
  await delay(400);
  const shot = id.replace(/-dialog$/, "");
  const overlay = page.locator(`#${id}-overlay.is-open, #${id}-overlay`);
  await page.locator(`#${id}-overlay`).screenshot({ path: join(outDir, `ref-open-${shot}.png`) });
  openMetrics[id] = await page.evaluate((id) => {
    const overlay = document.getElementById(id + "-overlay");
    const panel = overlay?.querySelector(".dialog") || document.querySelector(`#${id}-overlay .dialog`);
    if (!panel) {
      return {
        missing: true,
        overlayExists: !!overlay,
        overlayClass: overlay?.className,
        children: overlay ? [...overlay.children].map((c) => c.className) : [],
      };
    }
    const cs = getComputedStyle(panel);
    const r = panel.getBoundingClientRect();
    const header = panel.querySelector(".dialog__header");
    const title = panel.querySelector(".dialog__title");
    const body = panel.querySelector(".dialog__body");
    const footer = panel.querySelector(".dialog__footer");
    const close = panel.querySelector(".dialog__close, [data-dialog-close]");
    const grip = panel.querySelector(".dialog__resize-handle, .dialog__grip, [class*=resize]");
    const footerBtns = [...(footer?.querySelectorAll("button, .btn") || [])].map((b) =>
      (b.textContent || "").replace(/\s+/g, " ").trim(),
    );
    const hcs = header ? getComputedStyle(header) : null;
    const tcs = title ? getComputedStyle(title) : null;
    const fcs = footer ? getComputedStyle(footer) : null;
    const bcs = body ? getComputedStyle(body) : null;
    const ocs = overlay ? getComputedStyle(overlay) : null;
    return {
      open: overlay?.classList.contains("is-open"),
      w: Math.round(r.width),
      h: Math.round(r.height),
      bg: cs.backgroundColor,
      radius: cs.borderRadius,
      shadow: cs.boxShadow !== "none",
      headerBg: hcs?.backgroundColor,
      titleColor: tcs?.color,
      titleSize: tcs?.fontSize,
      titleWeight: tcs?.fontWeight,
      titleFont: tcs?.fontFamily,
      bodyColor: bcs?.color,
      bodyPad: bcs?.padding,
      footerBg: fcs?.backgroundColor,
      footerJustify: fcs?.justifyContent,
      footerGap: fcs?.gap,
      footerBtns,
      closeAria: close?.getAttribute("aria-label"),
      grip: !!grip,
      gripClass: grip?.className || null,
      overlayBg: ocs?.backgroundColor,
      role: panel.getAttribute("role"),
      ariaModal: panel.getAttribute("aria-modal"),
      labelledby: panel.getAttribute("aria-labelledby"),
      headerPad: hcs?.padding,
      footerPad: fcs?.padding,
      bodyOverflow: bcs?.overflowY,
      bodyMaxH: bcs?.maxHeight,
      headerClasses: header?.className,
      footerClasses: footer?.className,
    };
  }, id);
  await page.evaluate((id) => window.closeDialog(id), id);
  await delay(200);
}

await page.evaluate(() => document.documentElement.classList.add("dark"));
await delay(300);
await page.evaluate(() => window.openDialog("basic-dialog"));
await delay(300);
await page.locator("#basic-dialog-overlay").screenshot({ path: join(outDir, "ref-cp-dark-basic.png") });
const darkBasic = await page.evaluate(() => {
  const panel = document.querySelector("#basic-dialog-overlay .dialog");
  const header = panel?.querySelector(".dialog__header");
  const title = panel?.querySelector(".dialog__title");
  return {
    panelBg: panel ? getComputedStyle(panel).backgroundColor : null,
    headerBg: header ? getComputedStyle(header).backgroundColor : null,
    titleColor: title ? getComputedStyle(title).color : null,
  };
});
await page.evaluate(() => window.closeDialog("basic-dialog"));

// tertiary behavior on reference three-btn
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  window.openDialog("three-btn-dialog");
});
await delay(300);
const threeRef = await page.evaluate(() => {
  const overlay = document.getElementById("three-btn-dialog-overlay");
  const footer = overlay.querySelector(".dialog__footer");
  const btns = [...footer.querySelectorAll("button, .btn")].map((b) => (b.textContent || "").trim());
  const cancel = [...footer.querySelectorAll("button, .btn")].find((b) => (b.textContent || "").includes("Cancel"));
  cancel?.click();
  return { btns, stillOpen: overlay.classList.contains("is-open") };
});

prev.ref.openMetrics = openMetrics;
prev.ref.darkBasic = darkBasic;
prev.ref.threeTertiary = threeRef;
writeFileSync(join(outDir, "capture-metrics.json"), JSON.stringify(prev, null, 2));
console.log(JSON.stringify({
  basic: openMetrics["basic-dialog"],
  confirm: openMetrics["confirm-dialog"],
  three: openMetrics["three-btn-dialog"],
  right: openMetrics["right-align-dialog"],
  primary: openMetrics["primary-header-dialog"],
  combined: openMetrics["combined-dialog"],
  resizable: openMetrics["resizable-dialog"],
  long: openMetrics["long-content-dialog"],
  darkBasic,
  threeRef,
  convCompare: {
    basic: prev.conv.openMetrics.basic,
    primary: prev.conv.openMetrics.primary,
    right: prev.conv.openMetrics.right,
    three: prev.conv.openMetrics.three,
    long: prev.conv.openMetrics.long,
    confirm: prev.conv.openMetrics.confirm,
  },
}, null, 2));
await browser.close();
