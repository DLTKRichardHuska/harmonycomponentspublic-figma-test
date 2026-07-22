import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

const EXAMPLES = [
  { key: "basic", button: /Open Dialog/i, title: /Dialog Title/i },
  { key: "confirm", button: /Delete Item/i, title: /Delete Item\?/i },
  { key: "three", button: /Open Save Changes Dialog/i, title: /Save changes\?/i },
  { key: "right", button: /Open Right-Aligned Dialog/i, title: /Right-Aligned Buttons/i },
  { key: "long", button: /Open Scrollable Body Dialog/i, title: /Scrollable Body/i },
];

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("colorTheme", "cp");
    localStorage.setItem("harmony-theme", "cp");
    localStorage.setItem("harmony-mode", "light");
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add("theme-cp");
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "cp";
    document.documentElement.dataset.mode = "light";
  });
}

async function closeOpenDialog(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(250);
  // Click close if still open
  const close = page.locator('[aria-label="Close"], [data-dialog-close]').first();
  if (await close.isVisible().catch(() => false)) {
    await close.click().catch(() => {});
    await page.waitForTimeout(250);
  }
}

async function dialogPanel(page) {
  // Prefer open overlay dialog / MUI paper
  const mui = page.locator('.MuiDialog-paper:visible, [role="dialog"]:visible').first();
  if (await mui.count()) return mui;
  return page.locator('.dialog-overlay.is-open .dialog, .dialog-overlay[style*="display"] .dialog, .dialog').first();
}

async function probeDialog(page) {
  return page.evaluate(() => {
    const dialog =
      document.querySelector(".MuiDialog-paper") ||
      document.querySelector('.dialog-overlay.is-open .dialog') ||
      document.querySelector('[role="dialog"]');
    if (!dialog) return { found: false };

    const cs = getComputedStyle(dialog);
    const rect = dialog.getBoundingClientRect();
    const header =
      dialog.querySelector(".MuiDialogTitle-root") ||
      dialog.querySelector(".dialog__header");
    const body =
      dialog.querySelector(".MuiDialogContent-root") ||
      dialog.querySelector(".dialog__body");
    const footer =
      dialog.querySelector(".MuiDialogActions-root") ||
      dialog.querySelector(".dialog__footer");
    const title =
      dialog.querySelector(".MuiDialogTitle-root, .dialog__title, h2")?.textContent?.trim() || "";
    const buttons = [...(footer?.querySelectorAll("button, .btn, .MuiButton-root") || [])].map((b) => ({
      text: (b.textContent || "").trim().replace(/\s+/g, " "),
      variantHint:
        b.className ||
        "",
      rect: (() => {
        const r = b.getBoundingClientRect();
        return { left: Math.round(r.left), top: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      bg: getComputedStyle(b).backgroundColor,
      color: getComputedStyle(b).color,
      border: getComputedStyle(b).borderColor,
    }));

    const hcs = header ? getComputedStyle(header) : null;
    const bcs = body ? getComputedStyle(body) : null;
    const fcs = footer ? getComputedStyle(footer) : null;

    return {
      found: true,
      title,
      paper: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        minWidth: cs.minWidth,
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        bg: cs.backgroundColor,
        display: cs.display,
        flexDirection: cs.flexDirection,
      },
      header: hcs
        ? {
            padding: hcs.padding,
            borderBottom: hcs.borderBottom,
            bg: hcs.backgroundColor,
            fontSize: hcs.fontSize,
            fontWeight: hcs.fontWeight,
            color: hcs.color,
            justifyContent: hcs.justifyContent,
          }
        : null,
      body: bcs
        ? {
            padding: bcs.padding,
            color: bcs.color,
            overflowY: bcs.overflowY,
            maxHeight: bcs.maxHeight,
            scrollHeight: body.scrollHeight,
            clientHeight: body.clientHeight,
          }
        : null,
      footer: fcs
        ? {
            padding: fcs.padding,
            borderTop: fcs.borderTop,
            justifyContent: fcs.justifyContent,
            gap: fcs.gap,
            bg: fcs.backgroundColor,
          }
        : null,
      buttons,
      footerLeft: footer ? Math.round(footer.getBoundingClientRect().left) : null,
      firstBtnLeft: buttons[0]?.rect?.left ?? null,
      lastBtnLeft: buttons[buttons.length - 1]?.rect?.left ?? null,
    };
  });
}

async function inventory(page) {
  return page.evaluate(() => {
    const headings = [...document.querySelectorAll("h1,h2,h3,.section__title")].map((el) =>
      (el.textContent || "").trim().replace(/\s+/g, " "),
    );
    const exampleTitles = [...document.querySelectorAll("h3, h4, .example-section__title, [class*='ExampleGroup'] h3, [class*='example'] h3")].map((el) =>
      (el.textContent || "").trim().replace(/\s+/g, " "),
    );
    const callouts = [...document.querySelectorAll("[class*='Unsupported'], [class*='callout']")].map((el) =>
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 160),
    );
    return { headings, exampleTitles, callouts: callouts.slice(0, 10) };
  });
}

async function captureSide(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: "networkidle" });
  await applyCpLight(page);
  await page.waitForTimeout(600);

  // Page overview
  writeFileSync(join(art, `${prefix}-page-top.png`), await page.screenshot({ type: "png", fullPage: false }));
  const inv = await inventory(page);
  writeFileSync(join(art, `${prefix}-inventory.json`), JSON.stringify(inv, null, 2));

  const probes = {};

  for (const ex of EXAMPLES) {
    await closeOpenDialog(page);
    // Find button by text within examples
    const btn = page.getByRole("button", { name: ex.button }).first();
    await btn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await btn.click();
    await page.waitForTimeout(500);

    // Wait for dialog
    await page.waitForSelector('[role="dialog"], .MuiDialog-paper, .dialog-overlay.is-open .dialog', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(300);

    // Full page with open dialog
    writeFileSync(join(art, `${prefix}-${ex.key}-page.png`), await page.screenshot({ type: "png", fullPage: false }));

    const panel = await dialogPanel(page);
    if (await panel.count()) {
      writeFileSync(join(art, `${prefix}-${ex.key}-panel.png`), await panel.screenshot({ type: "png" }));
    } else {
      console.log(prefix, ex.key, "PANEL MISSING");
    }

    probes[ex.key] = await probeDialog(page);
    console.log(prefix, ex.key, probes[ex.key].found ? `ok w=${probes[ex.key].paper?.width}` : "NOT FOUND");

    await closeOpenDialog(page);
    await page.waitForTimeout(200);
  }

  writeFileSync(join(art, `${prefix}-probe.json`), JSON.stringify(probes, null, 2));
  await browser.close();
}

const ref = "http://localhost:4321/components/dialogs";
const conv = "http://localhost:5176/components/dialogs";
await captureSide(ref, "ref");
await captureSide(conv, "conv");
console.log("done");
