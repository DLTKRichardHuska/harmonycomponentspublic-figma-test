import { chromium } from "playwright";
import { mkdirSync } from "fs";
const art = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
mkdirSync(art, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function forceRefLight(page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    try { localStorage.setItem("harmony-color-scheme", "light"); } catch {}
    try { localStorage.setItem("theme", "light"); } catch {}
  });
  // click any visible dark-mode toggle to light
  for (let i = 0; i < 3; i++) {
    const changed = await page.evaluate(() => {
      if (!document.documentElement.classList.contains("dark")) return "already-light";
      const candidates = [...document.querySelectorAll("button, [role=button], a")];
      const btn = candidates.find(el => {
        const t = `${el.getAttribute("aria-label")||""} ${el.title||""} ${el.textContent||""}`.toLowerCase();
        return /dark|light|mode|theme|moon|sun/.test(t);
      });
      if (btn) { btn.click(); return "clicked"; }
      document.documentElement.classList.remove("dark");
      return "forced-remove";
    });
    await page.waitForTimeout(400);
    const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    if (!dark) return changed;
  }
}

async function setConvCpLight(page) {
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select");
    if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
    document.documentElement.classList.remove("dark");
    // mode button
    const btn = [...(header?.shadowRoot?.querySelectorAll("button") || [])].find(b => /mode|dark|light|sun|moon/i.test(b.textContent||""));
    if (btn && /dark/i.test(btn.textContent||"")) btn.click();
  });
  await page.waitForTimeout(900);
}

// Side-by-side light metrics
const metrics = {};
for (const [key, url, conv] of [
  ["shell", "http://localhost:4321/shell/header", false],
  ["shell", "http://localhost:5178/shell/header", true],
  ["um", "http://localhost:4321/components/user-menu", false],
  ["um", "http://localhost:5178/components/user-menu", true],
  ["cp", "http://localhost:4321/components/company-picker", false],
  ["cp", "http://localhost:5178/components/company-picker", true],
]) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  if (conv) await setConvCpLight(page); else await forceRefLight(page);
  const m = await page.evaluate((conv) => {
    const out = {
      dark: document.documentElement.classList.contains("dark"),
      themePrimary: getComputedStyle(document.documentElement).getPropertyValue("--theme-primary").trim(),
      navBg: getComputedStyle(document.documentElement).getPropertyValue("--nav-bg").trim(),
    };
    if (conv) {
      const app = document.querySelector("demo-app");
      out.product = app.getAttribute("product");
      if (location.pathname.includes("shell")) {
        const pageEl = app.shadowRoot.querySelector("demo-shell-header-page");
        const host = pageEl.shadowRoot.querySelector("harmony-shell-header");
        const sr = host.shadowRoot;
        const icon = sr.querySelector("harmony-icon.header__logo");
        out.hostBg = getComputedStyle(host).backgroundColor;
        out.title = sr.querySelector(".header__title")?.textContent.trim();
        out.logoRect = icon.getBoundingClientRect();
        const um = pageEl.shadowRoot.querySelector("harmony-user-menu");
        const av = um.shadowRoot.querySelector("harmony-avatar");
        out.avatar = { bg: getComputedStyle(av).backgroundColor, text: av.getAttribute("initials") || av.getAttribute("variant"), br: getComputedStyle(av).borderRadius, size: {w:av.getBoundingClientRect().width,h:av.getBoundingClientRect().height} };
        const picker = pageEl.shadowRoot.querySelector("harmony-company-picker");
        const ind = picker.shadowRoot.querySelector("[data-company-indicator]");
        out.picker = { name: picker.getAttribute("company-name"), indBg: getComputedStyle(ind).backgroundColor, indSize: {w:ind.getBoundingClientRect().width,h:ind.getBoundingClientRect().height} };
        const grad = sr.querySelector("[part=gradient], .header__gradient");
        out.grad = { h: grad.getBoundingClientRect().height, bg: getComputedStyle(grad).backgroundImage.slice(0,120) };
        out.h2s = [...pageEl.shadowRoot.querySelectorAll("h2")].map(h => h.textContent.trim());
      }
      if (location.pathname.includes("user-menu")) {
        const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
        out.h2s = [...pageEl.shadowRoot.querySelectorAll("h2")].map(h => h.textContent.trim());
        out.avatars = [...pageEl.shadowRoot.querySelectorAll("harmony-user-menu")].map(um => {
          const av = um.shadowRoot.querySelector("harmony-avatar");
          return { bg: getComputedStyle(av).backgroundColor, variant: av.getAttribute("variant"), br: getComputedStyle(av).borderRadius, hasImg: !!av.shadowRoot.querySelector("img") };
        });
      }
      if (location.pathname.includes("company-picker")) {
        const pageEl = app.shadowRoot.querySelector("demo-company-picker-page");
        const p = pageEl.shadowRoot.querySelector("harmony-company-picker");
        const ind = p.shadowRoot.querySelector("[data-company-indicator]");
        out.picker = { name: p.getAttribute("company-name"), indBg: getComputedStyle(ind).backgroundColor };
        out.h2s = [...pageEl.shadowRoot.querySelectorAll("h2")].map(h => h.textContent.trim());
      }
    } else {
      if (location.pathname.includes("shell")) {
        const demo = document.querySelector(".demo-header");
        out.hostBg = getComputedStyle(demo).backgroundColor;
        out.title = demo.querySelector(".header__title")?.textContent.trim();
        const logo = demo.querySelector(".header__logo");
        out.logoVisible = !!logo && logo.getBoundingClientRect().width > 0;
        out.logoSrc = logo?.getAttribute("src");
        const av = demo.querySelector(".avatar");
        out.avatar = { bg: getComputedStyle(av).backgroundColor, br: getComputedStyle(av).borderRadius, size: {w:av.getBoundingClientRect().width,h:av.getBoundingClientRect().height}, hasIcon: !!av.querySelector("svg") };
        const ind = demo.querySelector(".company-picker__indicator");
        out.picker = { name: demo.querySelector(".company-picker__name")?.textContent.trim(), indBg: getComputedStyle(ind).backgroundColor, indSize: {w:ind.getBoundingClientRect().width,h:ind.getBoundingClientRect().height} };
        const grad = demo.querySelector(".header__gradient");
        out.grad = { h: grad.getBoundingClientRect().height, bg: getComputedStyle(grad).backgroundImage.slice(0,120) };
        out.h1 = document.querySelector(".page-header__title")?.textContent.trim();
        out.h2s = [...document.querySelectorAll("article h2")].map(h => h.textContent.trim());
      }
      if (location.pathname.includes("user-menu")) {
        out.h1 = document.querySelector(".page-header__title")?.textContent.trim();
        out.h2s = [...document.querySelectorAll("article h2")].map(h => h.textContent.trim());
        out.exampleTitles = [...document.querySelectorAll(".example-section__title, .example-section h3")].map(t => t.textContent.trim());
        // example section titles might be in header
        out.sectionLabels = [...document.querySelectorAll(".example-section")].map(s => s.querySelector("h3, .example-section__title, header")?.textContent?.trim());
        out.avatars = [...document.querySelectorAll("article .user-menu .avatar")].map(av => ({
          bg: getComputedStyle(av).backgroundColor, br: getComputedStyle(av).borderRadius, hasImg: !!av.querySelector("img"), text: av.textContent.trim()
        }));
      }
      if (location.pathname.includes("company-picker")) {
        out.h1 = document.querySelector(".page-header__title")?.textContent.trim();
        out.h2s = [...document.querySelectorAll("article h2")].map(h => h.textContent.trim());
        const ind = document.querySelector("article .company-picker__indicator");
        out.picker = { name: document.querySelector("article .company-picker__name")?.textContent.trim(), indBg: ind?getComputedStyle(ind).backgroundColor:null };
      }
    }
    return out;
  }, conv);
  const side = conv ? "conv" : "ref";
  metrics[`${side}-${key}`] = m;
  await page.close();
}
console.log(JSON.stringify(metrics, null, 2));
await browser.close();
