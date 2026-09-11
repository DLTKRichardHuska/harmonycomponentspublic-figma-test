import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

const outDir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto("http://localhost:5178/components/dialogs", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
});
await delay(500);

// slotted footer labels accuracy + tertiary variant + close on primary
const details = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app.shadowRoot.querySelector("demo-dialogs-page").shadowRoot;

  function probe(id) {
    const host = root.querySelector("#" + id);
    const sr = host.shadowRoot;
    const dlg = sr.querySelector('dialog[part="dialog"]');
    host.show();
    const footerSlot = sr.querySelector('slot[name="footer"]');
    const assigned = footerSlot?.assignedElements({ flatten: true }) || [];
    const slottedLabels = assigned.flatMap((n) =>
      [...n.querySelectorAll("harmony-button")].map((b) => ({
        text: (b.textContent || "").trim(),
        variant: b.getAttribute("variant"),
      })),
    );
    const convenience = [...sr.querySelectorAll('[part="footer"] > .dialog__footer-actions harmony-button, [part="footer"] > harmony-button')].map((b) => ({
      text: (b.textContent || "").trim(),
      variant: b.getAttribute("variant"),
      hidden: b.hidden || b.closest("[hidden]") != null,
    }));
    const footerActions = sr.querySelector('[part="footer"] .dialog__footer-actions');
    const convenienceHidden = footerActions?.hasAttribute("hidden") || footerActions?.hidden;
    const close = sr.querySelector('[part="close"]');
    const closeBtn = close?.shadowRoot?.querySelector("button") || close;
    const closeCs = closeBtn ? getComputedStyle(closeBtn) : null;
    const header = sr.querySelector('[part="header"]');
    const title = sr.querySelector('[part="title"]');
    return {
      slottedLabels,
      convenience,
      convenienceHidden,
      footerJustify: getComputedStyle(sr.querySelector('[part="footer"]')).justifyContent,
      titleColor: getComputedStyle(title).color,
      headerBg: getComputedStyle(header).backgroundColor,
      closeColor: closeCs?.color,
      closeBg: closeCs?.backgroundColor,
      closeBorder: closeCs ? `${closeCs.borderTopWidth} ${closeCs.borderTopStyle} ${closeCs.borderTopColor}` : null,
      ariaModal: dlg.getAttribute("aria-modal"),
      labelledby: dlg.getAttribute("aria-labelledby"),
      titleId: title?.id,
    };
  }

  const confirm = probe("confirm");
  hostClose("confirm");
  const right = probe("right");
  hostClose("right");
  const three = probe("three");
  hostClose("three");
  const primary = probe("primary");
  hostClose("primary");

  function hostClose(id) {
    root.querySelector("#" + id)?.close({ force: true });
  }

  // public .dialog in document?
  const sheets = [...document.styleSheets];
  let publicDialogRules = 0;
  for (const sheet of sheets) {
    let rules;
    try { rules = [...sheet.cssRules]; } catch { continue; }
    for (const r of rules) {
      if (r.selectorText && (r.selectorText.includes(".dialog") || r.selectorText.includes("dialog-overlay"))) {
        publicDialogRules++;
      }
    }
  }

  return { confirm, right, three, primary, publicDialogRules };
});

// fix probe - I messed up hostClose before defining. Re-run cleaner:
const details2 = await page.evaluate(async () => {
  const app = document.querySelector("demo-app");
  const root = app.shadowRoot.querySelector("demo-dialogs-page").shadowRoot;
  const out = {};
  for (const id of ["confirm", "right", "three", "primary", "long"]) {
    const host = root.querySelector("#" + id);
    const sr = host.shadowRoot;
    host.show();
    await new Promise((r) => setTimeout(r, 50));
    const footerSlot = sr.querySelector('slot[name="footer"]');
    const assigned = footerSlot?.assignedElements({ flatten: true }) || [];
    const slottedLabels = assigned.flatMap((n) =>
      [...n.querySelectorAll("harmony-button")].map((b) => ({
        text: (b.textContent || "").trim(),
        variant: b.getAttribute("variant"),
      })),
    );
    const convWrap = sr.querySelector('[part="footer"] .dialog__footer-actions');
    const convenienceBtns = convWrap
      ? [...convWrap.querySelectorAll("harmony-button")].map((b) => (b.textContent || "").trim())
      : [];
    const closeHost = sr.querySelector('[part="close"]');
    const closeBtn = closeHost?.shadowRoot?.querySelector("button") || closeHost;
    const cs = closeBtn ? getComputedStyle(closeBtn) : null;
    out[id] = {
      slottedLabels,
      convenienceHidden: !!(convWrap?.hidden || convWrap?.hasAttribute("hidden")),
      convenienceBtns,
      footerJustify: getComputedStyle(sr.querySelector('[part="footer"]')).justifyContent,
      titleColor: getComputedStyle(sr.querySelector('[part="title"]')).color,
      headerBg: getComputedStyle(sr.querySelector('[part="header"]')).backgroundColor,
      closeColor: cs?.color,
      closeBg: cs?.backgroundColor,
      bodyScrollHeight: sr.querySelector('[part="body"]')?.scrollHeight,
      bodyClientHeight: sr.querySelector('[part="body"]')?.clientHeight,
    };
    host.close({ force: true });
    await new Promise((r) => setTimeout(r, 50));
  }
  return out;
});

writeFileSync(join(outDir, "footer-probe.json"), JSON.stringify({ details2 }, null, 2));
console.log(JSON.stringify(details2, null, 2));
await browser.close();
