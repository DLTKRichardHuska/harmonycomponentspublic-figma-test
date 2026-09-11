import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

function panelMetrics(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    w: Math.round(r.width),
    h: Math.round(r.height),
    bg: cs.backgroundColor,
    radius: cs.borderRadius,
    shadow: cs.boxShadow !== "none",
    font: cs.fontFamily,
  };
}

async function captureReference(page) {
  await page.goto("http://localhost:4321/components/dialogs", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.evaluate(() => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("theme-cp");
  });
  await delay(400);

  const inventory = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    desc: document.querySelector(".page-header__description")?.textContent?.trim(),
    badge: document.querySelector(".badge")?.textContent?.trim(),
    nav: [...document.querySelectorAll(".article-nav__link")].map((a) => a.textContent.trim()),
    h2: [...document.querySelectorAll("h2.section__title, h2")].map((h) => h.textContent.trim()),
    examples: [...document.querySelectorAll(".example-section__title, .example__title, h3")].map((h) =>
      h.textContent.trim(),
    ),
  }));

  await page.screenshot({ path: join(outDir, "ref-cp-light-top.png"), fullPage: false });

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
    await page.evaluate((id) => {
      if (typeof window.openDialog === "function") window.openDialog(id);
      else {
        const overlay = document.getElementById(id + "-overlay");
        overlay?.classList.add("is-open");
      }
    }, id);
    await delay(350);
    const shot = id.replace(/-dialog$/, "");
    const overlay = page.locator(`#${id}-overlay`);
    if (await overlay.count()) {
      await overlay.screenshot({ path: join(outDir, `ref-open-${shot}.png`) }).catch(async () => {
        await page.screenshot({ path: join(outDir, `ref-open-${shot}.png`) });
      });
    } else {
      await page.screenshot({ path: join(outDir, `ref-open-${shot}.png`) });
    }
    openMetrics[id] = await page.evaluate((id) => {
      const panel = document.getElementById(id);
      if (!panel) return { missing: true };
      const cs = getComputedStyle(panel);
      const r = panel.getBoundingClientRect();
      const header = panel.querySelector(".dialog__header");
      const title = panel.querySelector(".dialog__title");
      const body = panel.querySelector(".dialog__body");
      const footer = panel.querySelector(".dialog__footer");
      const close = panel.querySelector(".dialog__close, [data-dialog-close]");
      const grip = panel.querySelector(".dialog__resize-handle, .dialog__grip");
      const footerBtns = [...(footer?.querySelectorAll("button, .btn, a.btn") || [])].map((b) =>
        (b.textContent || "").replace(/\s+/g, " ").trim(),
      );
      const hcs = header ? getComputedStyle(header) : null;
      const tcs = title ? getComputedStyle(title) : null;
      const fcs = footer ? getComputedStyle(footer) : null;
      const bcs = body ? getComputedStyle(body) : null;
      const overlay = document.getElementById(id + "-overlay");
      const ocs = overlay ? getComputedStyle(overlay) : null;
      return {
        open: overlay?.classList.contains("is-open") || panel.getAttribute("aria-hidden") !== "true",
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
        overlayBg: ocs?.backgroundColor,
        role: panel.getAttribute("role"),
        ariaModal: panel.getAttribute("aria-modal"),
        labelledby: panel.getAttribute("aria-labelledby"),
        headerPad: hcs?.padding,
        footerPad: fcs?.padding,
        bodyOverflow: bcs?.overflowY,
        bodyMaxH: bcs?.maxHeight,
      };
    }, id);
    await page.evaluate((id) => {
      if (typeof window.closeDialog === "function") window.closeDialog(id);
      else document.getElementById(id + "-overlay")?.classList.remove("is-open");
    }, id);
    await delay(200);
  }

  // dark mode basic
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await delay(300);
  await page.evaluate(() => window.openDialog("basic-dialog"));
  await delay(300);
  await page.locator("#basic-dialog-overlay").screenshot({ path: join(outDir, "ref-cp-dark-basic.png") }).catch(async () => {
    await page.screenshot({ path: join(outDir, "ref-cp-dark-basic.png") });
  });
  const darkBasic = await page.evaluate(() => {
    const panel = document.getElementById("basic-dialog");
    const header = panel?.querySelector(".dialog__header");
    return {
      panelBg: panel ? getComputedStyle(panel).backgroundColor : null,
      headerBg: header ? getComputedStyle(header).backgroundColor : null,
      titleColor: panel ? getComputedStyle(panel.querySelector(".dialog__title")).color : null,
    };
  });
  await page.evaluate(() => window.closeDialog("basic-dialog"));
  await page.evaluate(() => document.documentElement.classList.remove("dark"));

  return { inventory, openMetrics, darkBasic };
}

async function captureConverted(page) {
  await page.goto("http://localhost:5178/components/dialogs", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    if (app) {
      app.product = "cp";
      localStorage.setItem("harmony-demo-product", "cp");
    }
    document.documentElement.classList.remove("theme-cp", "theme-vp", "theme-ppm", "theme-maconomy", "dark");
    document.documentElement.classList.add("theme-cp");
  });
  await delay(700);

  const inventory = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    if (!root) return { error: "missing page" };
    return {
      h1: root.querySelector("h1, demo-page-header")?.shadowRoot?.querySelector("h1")?.textContent?.trim()
        || root.querySelector("demo-page-header")?.getAttribute("title")
        || [...root.querySelectorAll("*")].find((el) => el.shadowRoot?.querySelector("h1"))?.shadowRoot?.querySelector("h1")?.textContent?.trim(),
      titleAttr: root.querySelector("demo-page-header")?.getAttribute("title"),
      desc: root.querySelector("demo-page-header")?.textContent?.trim()?.slice(0, 200)
        || root.querySelector("p")?.textContent?.trim()?.slice(0, 200),
      h2: [...root.querySelectorAll("h2")].map((h) => h.textContent.trim()),
      h3: [...root.querySelectorAll("h3")].map((h) => h.textContent.trim()),
      hasConsume: !!root.querySelector("demo-consume-snippets"),
      apiRows: [...root.querySelectorAll("table tbody tr")].map((tr) => tr.innerText.replace(/\s+/g, " ").trim()),
      dialogCount: root.querySelectorAll("harmony-dialog").length,
    };
  });

  // resolve page header title better
  inventory.pageTitle = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const hdr = root?.querySelector("demo-page-header");
    if (!hdr) return null;
    const h1 = hdr.shadowRoot?.querySelector("h1");
    return h1?.textContent?.trim() || hdr.getAttribute("title");
  });

  await page.screenshot({ path: join(outDir, "conv-cp-light-top.png"), fullPage: false });

  const dialogIds = ["basic", "confirm", "three", "right", "primary", "combined", "resizable", "long", "no-backdrop", "form"];
  const openMetrics = {};

  async function openDialog(id) {
    await page.evaluate((id) => {
      const app = document.querySelector("demo-app");
      const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
      root?.querySelector(`#${id}`)?.show();
    }, id);
    await delay(400);
  }
  async function closeDialog(id, force = true) {
    await page.evaluate(({ id, force }) => {
      const app = document.querySelector("demo-app");
      const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
      root?.querySelector(`#${id}`)?.close({ force });
    }, { id, force });
    await delay(250);
  }

  for (const id of dialogIds) {
    await openDialog(id);
    await page.screenshot({ path: join(outDir, `conv-open-${id}.png`) });
    openMetrics[id] = await page.evaluate((id) => {
      const app = document.querySelector("demo-app");
      const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
      const host = root?.querySelector(`#${id}`);
      if (!host?.shadowRoot) return { missing: true };
      const dlg = host.shadowRoot.querySelector('dialog[part="dialog"]');
      if (!dlg) return { missingDialog: true };
      const cs = getComputedStyle(dlg);
      const r = dlg.getBoundingClientRect();
      const header = host.shadowRoot.querySelector('[part="header"]');
      const title = host.shadowRoot.querySelector('[part="title"]');
      const body = host.shadowRoot.querySelector('[part="body"]');
      const footer = host.shadowRoot.querySelector('[part="footer"]');
      const close = host.shadowRoot.querySelector('[part="close"]');
      const grip = host.shadowRoot.querySelector('[part="grip"]');
      const footerBtns = [...(footer?.querySelectorAll("harmony-button, button") || [])].map((b) =>
        (b.textContent || "").replace(/\s+/g, " ").trim(),
      );
      // also slotted footer
      const footerSlot = host.shadowRoot.querySelector('slot[name="footer"]');
      const slotted = footerSlot?.assignedElements?.({ flatten: true }) || [];
      const slottedBtns = slotted.flatMap((n) =>
        [...(n.querySelectorAll?.("harmony-button, button") || []), ...(n.matches?.("harmony-button,button") ? [n] : [])],
      ).map((b) => (b.textContent || "").replace(/\s+/g, " ").trim());
      const hcs = header ? getComputedStyle(header) : null;
      const tcs = title ? getComputedStyle(title) : null;
      const fcs = footer ? getComputedStyle(footer) : null;
      const bcs = body ? getComputedStyle(body) : null;
      let backdrop = null;
      try {
        // approximate via page overlay not available; note dialog open
      } catch {}
      return {
        open: dlg.open,
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
        footerBtns: footerBtns.length ? footerBtns : slottedBtns,
        closeAria: close?.getAttribute("aria-label") || close?.shadowRoot?.querySelector("button")?.getAttribute("aria-label"),
        grip: !!grip && getComputedStyle(grip).display !== "none",
        role: dlg.getAttribute("role") || dlg.tagName,
        ariaModal: dlg.getAttribute("aria-modal"),
        labelledby: dlg.getAttribute("aria-labelledby"),
        headerPad: hcs?.padding,
        footerPad: fcs?.padding,
        bodyOverflow: bcs?.overflowY,
        bodyMaxH: bcs?.maxHeight,
        headerVariant: host.getAttribute("header-variant"),
        buttonAlignment: host.getAttribute("button-alignment"),
      };
    }, id);
    await closeDialog(id);
  }

  // dark basic
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await delay(400);
  await openDialog("basic");
  await page.screenshot({ path: join(outDir, "conv-cp-dark-basic.png") });
  const darkBasic = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#basic");
    const dlg = host?.shadowRoot?.querySelector('dialog[part="dialog"]');
    const header = host?.shadowRoot?.querySelector('[part="header"]');
    const title = host?.shadowRoot?.querySelector('[part="title"]');
    return {
      panelBg: dlg ? getComputedStyle(dlg).backgroundColor : null,
      headerBg: header ? getComputedStyle(header).backgroundColor : null,
      titleColor: title ? getComputedStyle(title).color : null,
    };
  });
  await closeDialog("basic");
  await page.evaluate(() => document.documentElement.classList.remove("dark"));

  // behavior: three-btn tertiary keep open; confirm closes
  await openDialog("three");
  const threeBehavior = await page.evaluate(async () => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#three");
    const dlg = host.shadowRoot.querySelector('dialog[part="dialog"]');
    const btns = [...host.shadowRoot.querySelectorAll('[part="footer"] harmony-button, [part="footer"] button')];
    const labels = btns.map((b) => (b.textContent || "").trim());
    // click Cancel (tertiary) — should stay open per plan (emit only; tertiary doesn't auto-close)
    const tertiary = btns.find((b) => (b.textContent || "").includes("Cancel"));
    let stayedAfterTertiary = null;
    if (tertiary) {
      tertiary.click();
      await new Promise((r) => setTimeout(r, 200));
      stayedAfterTertiary = dlg.open;
    }
    return { labels, stayedAfterTertiary, open: dlg.open };
  });
  await closeDialog("three");

  // backdrop close default
  await openDialog("basic");
  const backdropDefault = await page.evaluate(async () => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#basic");
    const dlg = host.shadowRoot.querySelector('dialog[part="dialog"]');
    // click backdrop via dialog click with target=dialog
    dlg.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    // native dialog backdrop click: simulate by clicking at dialog element itself when target is dialog
    const rect = dlg.getBoundingClientRect();
    return { openBefore: true, attrs: { closeOnBackdrop: host.getAttribute("close-on-backdrop"), open: dlg.open, w: rect.width } };
  });
  // use real mouse click outside panel
  await page.mouse.click(10, 10);
  await delay(300);
  const afterBackdrop = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#basic");
    return host?.shadowRoot?.querySelector('dialog[part="dialog"]')?.open;
  });
  await closeDialog("basic");

  // no-backdrop should stay open
  await openDialog("no-backdrop");
  await page.mouse.click(10, 10);
  await delay(300);
  const noBackdropStay = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    return root?.querySelector("#no-backdrop")?.shadowRoot?.querySelector('dialog[part="dialog"]')?.open;
  });
  await closeDialog("no-backdrop");

  // dirty + confirm-unsaved
  await openDialog("form");
  const unsaved = await page.evaluate(async () => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#form");
    const input = root.querySelector('#edit-form input[name="name"]');
    if (input) {
      input.value = "Changed";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await new Promise((r) => setTimeout(r, 100));
    const dirty = host.dirty;
    // try close via X
    host.shadowRoot.querySelector('[part="close"]')?.click();
    await new Promise((r) => setTimeout(r, 300));
    const mainOpen = host.shadowRoot.querySelector('dialog[part="dialog"]')?.open;
    const unsavedOpen = host.shadowRoot.querySelector('dialog[part="unsaved"]')?.open;
    return { dirty, mainOpen, unsavedOpen };
  });
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    root?.querySelector("#form")?.close({ force: true });
    const u = root?.querySelector("#form")?.shadowRoot?.querySelector('dialog[part="unsaved"]');
    if (u?.open) u.close();
  });
  await delay(200);

  // forced colors
  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "forced-colors", value: "active" }],
  });
  await delay(300);
  await openDialog("basic");
  await page.screenshot({ path: join(outDir, "conv-forced-colors-basic.png") });
  const fc = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-dialogs-page")?.shadowRoot;
    const host = root?.querySelector("#basic");
    const dlg = host?.shadowRoot?.querySelector('dialog[part="dialog"]');
    const header = host?.shadowRoot?.querySelector('[part="header"]');
    const title = host?.shadowRoot?.querySelector('[part="title"]');
    const close = host?.shadowRoot?.querySelector('[part="close"]');
    const footer = host?.shadowRoot?.querySelector('[part="footer"]');
    return {
      dlgBorder: dlg ? getComputedStyle(dlg).border : null,
      dlgOutline: dlg ? getComputedStyle(dlg).outline : null,
      titleColor: title ? getComputedStyle(title).color : null,
      headerBorder: header ? getComputedStyle(header).borderBottom : null,
      footerBorder: footer ? getComputedStyle(footer).borderTop : null,
      closeVisible: close ? getComputedStyle(close).visibility : null,
    };
  });
  await closeDialog("basic");
  await openDialog("primary");
  await page.screenshot({ path: join(outDir, "conv-forced-colors-primary.png") });
  await closeDialog("primary");

  return {
    inventory,
    openMetrics,
    darkBasic,
    threeBehavior,
    backdrop: { afterBackdropClick: afterBackdrop, backdropDefault },
    noBackdropStay,
    unsaved,
    fc,
  };
}

const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const ref = await captureReference(page);
const conv = await captureConverted(page);
writeFileSync(join(outDir, "capture-metrics.json"), JSON.stringify({ ref, conv }, null, 2));
console.log(JSON.stringify({
  refExamples: ref.inventory.examples,
  convH3: conv.inventory.h3,
  refBasic: ref.openMetrics["basic-dialog"],
  convBasic: conv.openMetrics.basic,
  refPrimary: ref.openMetrics["primary-header-dialog"],
  convPrimary: conv.openMetrics.primary,
  refRight: ref.openMetrics["right-align-dialog"],
  convRight: conv.openMetrics.right,
  refThree: ref.openMetrics["three-btn-dialog"],
  convThree: conv.openMetrics.three,
  dark: { ref: ref.darkBasic, conv: conv.darkBasic },
  behavior: {
    three: conv.threeBehavior,
    backdrop: conv.backdrop,
    noBackdrop: conv.noBackdropStay,
    unsaved: conv.unsaved,
  },
  fc: conv.fc,
}, null, 2));
await browser.close();
