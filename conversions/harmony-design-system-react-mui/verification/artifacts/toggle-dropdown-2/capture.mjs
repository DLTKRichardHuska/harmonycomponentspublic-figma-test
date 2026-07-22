import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

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

async function ensureCpLightUi(page) {
  const buttons = page.locator("button, [role='button'], select");
  const count = await buttons.count();
  for (let i = 0; i < Math.min(count, 40); i++) {
    const t = ((await buttons.nth(i).textContent().catch(() => "")) || "").trim();
    if (/^CP$/i.test(t)) {
      await buttons.nth(i).click().catch(() => {});
      break;
    }
  }
  await page.waitForTimeout(200);
}

async function inventory(page) {
  return page.evaluate(() => {
    const main = document.querySelector("article") || document.querySelector("main") || document.body;
    const h1 = main.querySelector("h1")?.textContent?.trim() || "";
    const h2s = [...main.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const h3s = [...main.querySelectorAll("h3")].map((h) => h.textContent.trim());
    const a11yRoot = main.querySelector("#accessibility");
    const a11yTitles = a11yRoot
      ? [...a11yRoot.querySelectorAll("h3, h4")].map((h) => h.textContent.trim())
      : [];
    const alerts = [...main.querySelectorAll("[role='alert'], .MuiAlert-root")].map((a) =>
      a.textContent?.trim().replace(/\s+/g, " ").slice(0, 200)
    );
    return { h1, h2s, h3s, a11yTitles, alerts };
  });
}

async function probeToggle(page) {
  return page.evaluate(() => {
    const roots = [...document.querySelectorAll(".MuiSwitch-root, .toggle, [class*='switch']")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 20 && r.width < 80 && r.height > 10 && r.height < 40;
    });
    const samples = roots.slice(0, 6).map((root) => {
      const track = root.querySelector(".MuiSwitch-track") || root.querySelector(".toggle__track") || root;
      const thumb = root.querySelector(".MuiSwitch-thumb") || root.querySelector(".toggle__thumb");
      const r = root.getBoundingClientRect();
      const tcs = getComputedStyle(track);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        trackBg: tcs.backgroundColor,
        trackW: Math.round(track.getBoundingClientRect().width),
        trackH: Math.round(track.getBoundingClientRect().height),
        thumbW: thumb ? Math.round(thumb.getBoundingClientRect().width) : null,
      };
    });
    const a11yRoot = document.querySelector("#accessibility");
    const a11yCardTitles = a11yRoot
      ? [...a11yRoot.querySelectorAll("h3, h4")].map((h) => h.textContent.trim())
      : [];
    return { switchCount: roots.length, samples, a11yCardTitles };
  });
}

async function probeDropdownClosed(page, isConverted) {
  return page.evaluate((converted) => {
    if (converted) {
      const select = document.querySelector("#country-basic") || document.querySelector(".MuiSelect-select");
      if (!select) return { found: false };
      const field = select.closest(".MuiOutlinedInput-root") || select.closest(".MuiInputBase-root") || select;
      const fcs = getComputedStyle(field);
      const scs = getComputedStyle(select);
      const fr = field.getBoundingClientRect();
      return {
        found: true,
        text: select.textContent?.trim(),
        field: {
          w: Math.round(fr.width),
          h: Math.round(fr.height),
          bg: fcs.backgroundColor,
          borderColor: fcs.borderColor,
          borderWidth: fcs.borderWidth,
          color: scs.color,
          radius: fcs.borderRadius,
          fontSize: scs.fontSize,
        },
      };
    }
    const trigger = document.querySelector(".dropdown__trigger");
    if (!trigger) return { found: false };
    const cs = getComputedStyle(trigger);
    const r = trigger.getBoundingClientRect();
    return {
      found: true,
      text: trigger.textContent?.trim().replace(/\s+/g, " "),
      field: {
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: cs.backgroundColor,
        borderColor: cs.borderColor,
        borderWidth: cs.borderWidth,
        color: cs.color,
        radius: cs.borderRadius,
        fontSize: cs.fontSize,
      },
    };
  }, isConverted);
}

async function openDropdown(page, isConverted) {
  if (isConverted) {
    const sel = page.locator("#country-basic").first();
    if (await sel.count()) {
      await sel.click({ force: true });
    } else {
      await page.locator(".MuiSelect-select").first().click({ timeout: 5000 });
    }
  } else {
    await page.locator(".dropdown__trigger").first().click({ timeout: 5000 });
  }
  await page.waitForTimeout(400);
}

async function probeDropdownOpen(page, isConverted) {
  return page.evaluate((converted) => {
    const list = converted
      ? document.querySelector(".MuiMenu-paper") || document.querySelector('[role="listbox"]')
      : document.querySelector(".dropdown.is-open .dropdown__menu") ||
        document.querySelector(".dropdown__menu");
    if (!list) return { found: false };
    const itemSel = converted ? '[role="option"], .MuiMenuItem-root' : ".dropdown__item, [role='option']";
    const items = [...list.querySelectorAll(itemSel)].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        text: el.textContent?.trim().replace(/\s+/g, " "),
        h: Math.round(r.height),
        color: cs.color,
        bg: cs.backgroundColor,
        fontStyle: cs.fontStyle,
      };
    });
    const cs = getComputedStyle(list);
    const r = list.getBoundingClientRect();
    return {
      found: true,
      w: Math.round(r.width),
      h: Math.round(r.height),
      bg: cs.backgroundColor,
      shadow: cs.boxShadow,
      radius: cs.borderRadius,
      items,
    };
  }, isConverted);
}

async function captureSide(label, urlBase) {
  const isConverted = label === "conv";
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // --- Toggle ---
  await page.goto(`${urlBase}/components/toggle-switches`, { waitUntil: "networkidle", timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: "networkidle" });
  await applyCpLight(page);
  await ensureCpLightUi(page);
  await page.waitForTimeout(400);

  await page.screenshot({ path: join(art, `${label}-toggle-page-top.png`), fullPage: false });
  await page.screenshot({ path: join(art, `${label}-toggle-full.png`), fullPage: true });

  await page.locator("#accessibility").scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(200);
  const a11y = page.locator("#accessibility").first();
  if (await a11y.count()) await a11y.screenshot({ path: join(art, `${label}-toggle-a11y.png`) });

  for (const title of ["Basic Toggle", "States", "Sizes", "Without Label"]) {
    const h = page.locator(`h3:has-text("${title}")`).first();
    if (await h.count()) {
      await h.scrollIntoViewIfNeeded();
      const parent = h.locator("xpath=..");
      await parent.screenshot({ path: join(art, `${label}-toggle-${title.toLowerCase().replace(/\s+/g, "-")}.png`) }).catch(() => {});
    }
  }

  const toggleInv = await inventory(page);
  const toggleProbe = await probeToggle(page);
  writeFileSync(join(art, `${label}-toggle-inventory.json`), JSON.stringify(toggleInv, null, 2));
  writeFileSync(join(art, `${label}-toggle-probe.json`), JSON.stringify(toggleProbe, null, 2));

  // --- Dropdown ---
  await page.goto(`${urlBase}/components/dropdowns`, { waitUntil: "networkidle", timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: "networkidle" });
  await applyCpLight(page);
  await ensureCpLightUi(page);
  await page.waitForTimeout(400);

  await page.screenshot({ path: join(art, `${label}-dropdown-page-top.png`), fullPage: false });
  await page.screenshot({ path: join(art, `${label}-dropdown-full.png`), fullPage: true });

  for (const title of [
    "Basic Dropdown",
    "With Label (Stacked)",
    "With Label (Inline)",
    "With Pre-selected Value",
    "Disabled",
  ]) {
    const h = page.locator(`h3:has-text("${title}")`).first();
    if (await h.count()) {
      await h.scrollIntoViewIfNeeded();
      const parent = h.locator("xpath=..");
      await parent
        .screenshot({
          path: join(art, `${label}-dropdown-${title.toLowerCase().replace(/[()]/g, "").replace(/\s+/g, "-")}.png`),
        })
        .catch(() => {});
    }
  }

  const dropInv = await inventory(page);
  const closed = await probeDropdownClosed(page, isConverted);
  await openDropdown(page, isConverted);
  const open = await probeDropdownOpen(page, isConverted);
  await page.screenshot({ path: join(art, `${label}-dropdown-menu-open.png`), fullPage: false });
  const menu = isConverted
    ? page.locator(".MuiMenu-paper").first()
    : page.locator(".dropdown.is-open .dropdown__menu, .dropdown__menu").first();
  if (await menu.isVisible().catch(() => false)) {
    await menu.screenshot({ path: join(art, `${label}-menu-open-tight.png`) });
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);

  const dropProbe = { closed, open };
  writeFileSync(join(art, `${label}-dropdown-inventory.json`), JSON.stringify(dropInv, null, 2));
  writeFileSync(join(art, `${label}-dropdown-probe.json`), JSON.stringify(dropProbe, null, 2));

  await browser.close();
  return { toggleInv, toggleProbe, dropInv, dropProbe };
}

const ref = await captureSide("ref", "http://localhost:4321");
const conv = await captureSide("conv", "http://localhost:5176");
const summary = {
  generatedAt: new Date().toISOString(),
  refToggleA11y: ref.toggleProbe.a11yCardTitles,
  convToggleA11y: conv.toggleProbe.a11yCardTitles,
  refMenuItems: ref.dropProbe.open?.items?.map((i) => i.text) || null,
  convMenuItems: conv.dropProbe.open?.items?.map((i) => i.text) || null,
  refClosed: ref.dropProbe.closed,
  convClosed: conv.dropProbe.closed,
};
writeFileSync(join(art, "summary.json"), JSON.stringify(summary, null, 2));
console.log("DONE", JSON.stringify(summary, null, 2));
