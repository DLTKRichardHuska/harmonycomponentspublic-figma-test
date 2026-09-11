import { chromium } from "playwright";
import { mkdirSync } from "fs";
const art = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
mkdirSync(art, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function setCpLight(page) {
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select");
    if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
    // mode light
    const btn = header?.shadowRoot?.querySelector("button");
    // try set attribute
    if (app) app.setAttribute("product", "cp");
    document.documentElement.classList.remove("dark");
    document.documentElement.setAttribute("data-mode", "light");
  });
  await page.waitForTimeout(900);
}

// ---- Shell header logo + colors ----
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle" });
  await setCpLight(page);
  const info = await page.evaluate(async () => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-shell-header-page");
    const header = pageEl.shadowRoot.querySelector("harmony-shell-header");
    const sr = header.shadowRoot;
    const logo = sr.querySelector(".header__logo, [part=logo]");
    const headerEl = sr.querySelector(".header, [part=header]");
    const title = sr.querySelector(".header__title");
    const iconSr = logo?.shadowRoot;
    const svg = iconSr?.querySelector("svg, img") || logo?.querySelector("svg, img");
    // wait for icon
    return {
      headerBg: headerEl ? getComputedStyle(headerEl).backgroundColor : null,
      titleColor: title ? getComputedStyle(title).color : null,
      logoTag: logo?.tagName,
      logoName: logo?.getAttribute("name"),
      logoSizeAttr: logo?.getAttribute("size"),
      logoRect: logo ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height } : null,
      iconShadowHTML: iconSr?.innerHTML?.slice(0, 400) || null,
      svgPresent: !!svg,
      svgBox: svg ? { w: svg.getBoundingClientRect().width, h: svg.getBoundingClientRect().height } : null,
      navBgVar: getComputedStyle(document.documentElement).getPropertyValue("--nav-bg").trim(),
    };
  });
  // crop brand only
  const brandBox = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-shell-header-page");
    const brand = pageEl.shadowRoot.querySelector("harmony-shell-header").shadowRoot.querySelector(".header__brand, [part=brand]");
    const r = brand.getBoundingClientRect();
    return { x: r.x, y: r.y, width: Math.max(r.width, 180), height: Math.max(r.height, 40) };
  });
  await page.screenshot({ path: `${art}/conv-shell-brand.png`, clip: brandBox });

  // avatar crop
  const avBox = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-shell-header-page");
    const um = pageEl.shadowRoot.querySelector("harmony-user-menu");
    // find avatar inside
    const root = um.shadowRoot;
    const av = root.querySelector(".avatar, [part=avatar], .user-menu__trigger .avatar, button .avatar") || root.querySelector("button");
    // prefer nested avatar
    const nested = root.querySelector(".avatar");
    const el = nested || av;
    const r = el.getBoundingClientRect();
    return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8, html: root.innerHTML.slice(0, 800) };
  });
  console.log("CONV_SHELL_DETAIL", JSON.stringify({ info, avHtml: avBox.html }, null, 2));
  await page.screenshot({ path: `${art}/conv-shell-avatar.png`, clip: { x: Math.max(0,avBox.x), y: Math.max(0,avBox.y), width: Math.max(avBox.width, 32), height: Math.max(avBox.height, 32) } });
  await page.close();
}

// ---- Ref shell brand + avatar ----
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  // force light if possible
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("theme-cp");
  });
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => {
    const demo = document.querySelector(".demo-header");
    const logo = demo.querySelector(".header__logo");
    const title = demo.querySelector(".header__title");
    const av = demo.querySelector(".avatar");
    return {
      headerBg: getComputedStyle(demo).backgroundColor,
      titleColor: getComputedStyle(title).color,
      logoSrc: logo?.src || logo?.getAttribute("src"),
      logoRect: logo ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height } : null,
      navBgVar: getComputedStyle(document.documentElement).getPropertyValue("--nav-bg").trim(),
      htmlDark: document.documentElement.className,
      av: {
        br: getComputedStyle(av).borderRadius,
        bg: getComputedStyle(av).backgroundColor,
        size: { w: av.getBoundingClientRect().width, h: av.getBoundingClientRect().height },
        html: av.innerHTML.slice(0, 200),
      },
    };
  });
  const brandBox = await page.evaluate(() => {
    const brand = document.querySelector(".demo-header .header__brand");
    const r = brand.getBoundingClientRect();
    return { x: r.x, y: r.y, width: Math.max(r.width, 180), height: Math.max(r.height, 40) };
  });
  await page.screenshot({ path: `${art}/ref-shell-brand.png`, clip: brandBox });
  const avBox = await page.evaluate(() => {
    const av = document.querySelector(".demo-header .avatar");
    const r = av.getBoundingClientRect();
    return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 };
  });
  await page.screenshot({ path: `${art}/ref-shell-avatar.png`, clip: avBox });
  console.log("REF_SHELL_DETAIL", JSON.stringify(info, null, 2));
  await page.close();
}

// ---- User menu page both variants ----
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:5178/components/user-menu", { waitUntil: "networkidle" });
  await setCpLight(page);
  const detail = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
    const ums = [...pageEl.shadowRoot.querySelectorAll("harmony-user-menu")];
    return ums.map((um, i) => {
      const sr = um.shadowRoot;
      const av = sr.querySelector(".avatar");
      const btn = sr.querySelector("button");
      const img = sr.querySelector("img");
      return {
        i,
        attrs: { name: um.getAttribute("name"), src: um.getAttribute("src") },
        shadowHTML: sr.innerHTML.slice(0, 1000),
        hasAvatarClass: !!av,
        avBg: av ? getComputedStyle(av).backgroundColor : null,
        avBr: av ? getComputedStyle(av).borderRadius : null,
        avSize: av ? { w: av.getBoundingClientRect().width, h: av.getBoundingClientRect().height } : null,
        avText: av?.textContent?.trim(),
        imgSrc: img?.getAttribute("src"),
        imgSize: img ? { w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height } : null,
        btnAria: btn?.getAttribute("aria-label") || btn?.getAttribute("title"),
      };
    });
  });
  console.log("CONV_UM_DETAIL", JSON.stringify(detail, null, 2));

  // crop both avatars
  for (let i = 0; i < 2; i++) {
    const box = await page.evaluate((idx) => {
      const app = document.querySelector("demo-app");
      const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
      const um = pageEl.shadowRoot.querySelectorAll("harmony-user-menu")[idx];
      const av = um.shadowRoot.querySelector(".avatar") || um.shadowRoot.querySelector("button");
      const r = av.getBoundingClientRect();
      return { x: r.x - 6, y: r.y - 6, width: r.width + 12, height: r.height + 12 };
    }, i);
    await page.screenshot({ path: `${art}/conv-um-av-${i}.png`, clip: { x: Math.max(0,box.x), y: Math.max(0,box.y), width: Math.max(box.width,40), height: Math.max(box.height,40) } });
  }

  // open menu
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
    const um = pageEl.shadowRoot.querySelector("harmony-user-menu");
    um.shadowRoot.querySelector("button")?.click();
  });
  await page.waitForTimeout(400);
  const menuInfo = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
    const um = pageEl.shadowRoot.querySelector("harmony-user-menu");
    const sr = um.shadowRoot;
    const menu = sr.querySelector(".user-menu__menu, [part=menu], .menu, [role=menu]");
    const items = menu ? [...menu.querySelectorAll("a, button, [role=menuitem]")].map(el => el.textContent.trim()) : [];
    // also slotted light DOM
    const slotted = [...um.querySelectorAll("a, button")].map(el => el.textContent.trim());
    return {
      menuDisplay: menu ? getComputedStyle(menu).display : null,
      menuVisibility: menu ? getComputedStyle(menu).visibility : null,
      items,
      slotted,
      openClass: menu?.className,
      shadowTail: sr.innerHTML.slice(-800),
    };
  });
  console.log("CONV_UM_MENU", JSON.stringify(menuInfo, null, 2));
  const mbox = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
    const um = pageEl.shadowRoot.querySelector("harmony-user-menu");
    const r = um.getBoundingClientRect();
    const menu = um.shadowRoot.querySelector(".user-menu__menu, [part=menu], .menu, [role=menu]");
    const mr = menu?.getBoundingClientRect();
    const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom + 140;
    return { x: Math.max(0, r.x - 160), y: Math.max(0, r.y - 10), width: 220, height: Math.min(bottom - r.y + 20, 220) };
  });
  await page.screenshot({ path: `${art}/conv-um-open.png`, clip: mbox });
  await page.close();
}

// ---- Ref user menu ----
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:4321/components/user-menu", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const detail = await page.evaluate(() => {
    const ums = [...document.querySelectorAll("article .user-menu")];
    return ums.map((um, i) => {
      const av = um.querySelector(".avatar");
      const img = um.querySelector("img");
      return {
        i,
        avBg: av ? getComputedStyle(av).backgroundColor : null,
        avBr: av ? getComputedStyle(av).borderRadius : null,
        avSize: av ? { w: av.getBoundingClientRect().width, h: av.getBoundingClientRect().height } : null,
        avText: av?.textContent?.trim(),
        hasImg: !!img,
        imgSize: img ? { w: img.getBoundingClientRect().width, h: img.getBoundingClientRect().height } : null,
      };
    });
  });
  console.log("REF_UM_DETAIL", JSON.stringify(detail, null, 2));
  for (let i = 0; i < Math.min(2, detail.length); i++) {
    const box = await page.evaluate((idx) => {
      const um = document.querySelectorAll("article .user-menu")[idx];
      const av = um.querySelector(".avatar");
      const r = av.getBoundingClientRect();
      return { x: r.x - 6, y: r.y - 6, width: r.width + 12, height: r.height + 12 };
    }, i);
    await page.screenshot({ path: `${art}/ref-um-av-${i}.png`, clip: box });
  }
  // open
  await page.evaluate(() => {
    document.querySelector("article .user-menu button, article .user-menu .avatar")?.click();
  });
  await page.waitForTimeout(400);
  const menuInfo = await page.evaluate(() => {
    const um = document.querySelector("article .user-menu");
    const menu = um?.querySelector(".user-menu__menu, [role=menu], .menu");
    const items = menu ? [...menu.querySelectorAll("a, button, [role=menuitem]")].map(el => el.textContent.trim()) : [];
    return { open: menu?.classList?.toString(), display: menu ? getComputedStyle(menu).display : null, items, html: um?.innerHTML?.slice(0, 600) };
  });
  console.log("REF_UM_MENU", JSON.stringify(menuInfo, null, 2));
  await page.close();
}

// ---- Company picker open both ----
{
  for (const [label, url, isConv] of [
    ["ref", "http://localhost:4321/components/company-picker", false],
    ["conv", "http://localhost:5178/components/company-picker", true],
  ]) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    if (isConv) await setCpLight(page);
    const info = await page.evaluate((conv) => {
      if (conv) {
        const app = document.querySelector("demo-app");
        const pageEl = app.shadowRoot.querySelector("demo-company-picker-page");
        const p = pageEl.shadowRoot.querySelector("harmony-company-picker");
        p.shadowRoot.querySelector("button")?.click();
        const menu = p.shadowRoot.querySelector(".company-picker__menu, [part=menu]");
        // options may be slotted
        const slot = p.shadowRoot.querySelector("slot");
        const assigned = slot ? slot.assignedElements() : [];
        const shadowOptions = menu ? [...menu.querySelectorAll("button, [role=option]")].map(o => ({ text: o.textContent.trim(), html: o.innerHTML.slice(0,120) })) : [];
        return {
          menuDisplay: menu ? getComputedStyle(menu).display : null,
          menuClass: menu?.className,
          shadowOptions,
          slotted: assigned.map(a => ({ tag: a.tagName, text: a.textContent.trim(), color: a.getAttribute("data-company-color") })),
          trigger: p.shadowRoot.querySelector("button")?.innerHTML?.slice(0, 300),
          shadowHTML: p.shadowRoot.innerHTML.slice(0, 1200),
        };
      } else {
        const p = document.querySelector("article .company-picker");
        p.querySelector("button")?.click();
        const menu = p.querySelector(".company-picker__menu");
        const opts = [...(menu?.querySelectorAll(".company-picker__option") || [])].map(o => ({
          text: o.textContent.trim(),
          indBg: (() => { const i=o.querySelector(".company-picker__option-indicator"); return i?getComputedStyle(i).backgroundColor:null; })(),
        }));
        return { menuOpen: menu?.classList.contains("company-picker__menu--open"), opts, count: opts.length };
      }
    }, isConv);
    console.log(label.toUpperCase()+"_CP_OPEN", JSON.stringify(info, null, 2));
    const box = await page.evaluate((conv) => {
      if (conv) {
        const app = document.querySelector("demo-app");
        const pageEl = app.shadowRoot.querySelector("demo-company-picker-page");
        const p = pageEl.shadowRoot.querySelector("harmony-company-picker");
        const menu = p.shadowRoot.querySelector(".company-picker__menu, [part=menu]");
        const r = p.getBoundingClientRect();
        const mr = menu?.getBoundingClientRect();
        const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom + 180;
        return { x: Math.max(0, r.right - 280), y: Math.max(0, r.y - 10), width: 300, height: Math.min(bottom - r.y + 20, 280) };
      } else {
        const p = document.querySelector("article .company-picker");
        const menu = p.querySelector(".company-picker__menu");
        const r = p.getBoundingClientRect();
        const mr = menu?.getBoundingClientRect();
        const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom + 180;
        return { x: Math.max(0, r.right - 280), y: Math.max(0, r.y - 10), width: 300, height: Math.min(bottom - r.y + 20, 280) };
      }
    }, isConv);
    await page.screenshot({ path: `${art}/${label}-cp-open2.png`, clip: box });
    await page.close();
  }
}

await browser.close();
