import { chromium } from "playwright";
import { mkdirSync } from "fs";
const art = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
mkdirSync(art, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function setCp(page) {
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select");
    if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
  });
  await page.waitForTimeout(900);
}

{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle" });
  await setCp(page);
  const logoInfo = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const sr = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header").shadowRoot;
    const icon = sr.querySelector("harmony-icon.header__logo");
    const link = sr.querySelector(".header__brand-link");
    const cs = getComputedStyle(icon);
    const lcs = getComputedStyle(link);
    const svg = icon.shadowRoot.querySelector("svg");
    return {
      icon: {
        display: cs.display, visibility: cs.visibility, opacity: cs.opacity, color: cs.color,
        width: cs.width, height: cs.height, overflow: cs.overflow,
        rect: icon.getBoundingClientRect(),
      },
      link: { display: lcs.display, gap: lcs.gap, align: lcs.alignItems },
      svgRect: svg.getBoundingClientRect(),
      // sample pixels via canvas from svg? 
    };
  });
  console.log("LOGO_CSS", JSON.stringify(logoInfo, null, 2));
  // wide brand crop including left padding
  const box = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header");
    const brand = header.shadowRoot.querySelector(".header__brand");
    const r = brand.getBoundingClientRect();
    // also full header left portion
    const hr = header.getBoundingClientRect();
    return { x: hr.x, y: hr.y, width: 280, height: hr.height };
  });
  await page.screenshot({ path: `${art}/conv-shell-left.png`, clip: box });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const box = await page.evaluate(() => {
    const h = document.querySelector(".demo-header");
    const r = h.getBoundingClientRect();
    return { x: r.x, y: r.y, width: 280, height: r.height };
  });
  await page.screenshot({ path: `${art}/ref-shell-left.png`, clip: box });
  await page.close();
}

// Check if company picker styles ::slotted indicators
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/components/company-picker", { waitUntil: "networkidle" });
  await setCp(page);
  // open and screenshot menu with enough width
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
    p.shadowRoot.querySelector("button").click();
  });
  await page.waitForTimeout(400);
  // inspect computed ::before on options?
  const optVisual = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
    const slot = p.shadowRoot.querySelector("slot");
    const opts = slot.assignedElements();
    return opts.map(o => {
      const before = getComputedStyle(o, "::before");
      const after = getComputedStyle(o, "::after");
      return {
        text: o.textContent.trim(),
        color: o.getAttribute("data-company-color"),
        beforeContent: before.content,
        beforeW: before.width,
        beforeH: before.height,
        beforeBg: before.backgroundColor,
        afterContent: after.content,
        display: getComputedStyle(o).display,
        gap: getComputedStyle(o).gap,
        fontSize: getComputedStyle(o).fontSize,
        colorText: getComputedStyle(o).color,
        padding: getComputedStyle(o).padding,
        minHeight: getComputedStyle(o).minHeight,
        className: o.className,
      };
    });
  });
  console.log("OPT_PSEUDO", JSON.stringify(optVisual, null, 2));
  const box = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
    const menu = p.shadowRoot.querySelector(".company-picker__menu");
    const r = menu.getBoundingClientRect();
    return { x: Math.max(0,r.x-8), y: Math.max(0,r.y-40), width: Math.max(r.width+16, 280), height: r.height + 50 };
  });
  await page.screenshot({ path: `${art}/conv-cp-menu.png`, clip: box });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:4321/components/company-picker", { waitUntil: "networkidle" });
  await page.click("article .company-picker button");
  await page.waitForTimeout(300);
  const box = await page.evaluate(() => {
    const menu = document.querySelector("article .company-picker__menu");
    const r = menu.getBoundingClientRect();
    return { x: Math.max(0,r.x-8), y: Math.max(0,r.y-40), width: Math.max(r.width+16, 280), height: r.height + 50 };
  });
  await page.screenshot({ path: `${art}/ref-cp-menu.png`, clip: box });
  await page.close();
}

// Avatar colors for UM
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/components/user-menu", { waitUntil: "networkidle" });
  await setCp(page);
  const colors = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const ums = [...app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelectorAll("harmony-user-menu")];
    return ums.map(um => {
      const av = um.shadowRoot.querySelector("harmony-avatar");
      const host = getComputedStyle(av);
      const inner = av.shadowRoot.querySelector("[part=initials], img, span");
      // :host styles apply to av element
      return {
        bg: host.backgroundColor,
        color: host.color,
        br: host.borderRadius,
        w: host.width,
        h: host.height,
        variant: av.getAttribute("variant"),
      };
    });
  });
  console.log("CONV_AV_COLORS", colors);

  // ref
  await page.goto("http://localhost:4321/components/user-menu", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const refColors = await page.evaluate(() => {
    return [...document.querySelectorAll("article .user-menu .avatar")].map(av => ({
      bg: getComputedStyle(av).backgroundColor,
      color: getComputedStyle(av).color,
      br: getComputedStyle(av).borderRadius,
      w: getComputedStyle(av).width,
      h: getComputedStyle(av).height,
      text: av.textContent.trim(),
      hasImg: !!av.querySelector("img"),
    }));
  });
  console.log("REF_AV_COLORS", refColors);
  await page.close();
}

await browser.close();
