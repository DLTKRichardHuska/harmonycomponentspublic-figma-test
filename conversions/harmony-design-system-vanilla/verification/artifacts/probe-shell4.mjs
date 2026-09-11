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
    document.documentElement.classList.remove("dark");
  });
  await page.waitForTimeout(900);
}

// Logo color compare
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle" });
  await setCp(page);
  const convLogo = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header").shadowRoot;
    const icon = header.querySelector("harmony-icon.header__logo");
    const svg = icon.shadowRoot.querySelector("svg");
    const path = svg?.querySelector("path");
    return {
      iconColor: getComputedStyle(icon).color,
      svgFill: path ? getComputedStyle(path).fill : null,
      pathAttr: path?.getAttribute("fill"),
    };
  });
  console.log("CONV_LOGO", convLogo);
  await page.close();
}
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const refLogo = await page.evaluate(() => {
    const img = document.querySelector(".demo-header .header__logo");
    // draw to canvas to sample? or just report
    return { src: img.src, w: img.naturalWidth, complete: img.complete };
  });
  console.log("REF_LOGO", refLogo);
  await page.close();
}

// User menu avatar pierce + open + image
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:5178/components/user-menu", { waitUntil: "networkidle" });
  await setCp(page);
  const detail = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app.shadowRoot.querySelector("demo-user-menu-page");
    return [...pageEl.shadowRoot.querySelectorAll("harmony-user-menu")].map((um, i) => {
      const av = um.shadowRoot.querySelector("harmony-avatar");
      const asr = av?.shadowRoot;
      const root = asr?.querySelector(".avatar, [part=avatar], *");
      const img = asr?.querySelector("img");
      const initials = asr?.querySelector(".avatar__initials, [part=initials]");
      const box = av?.getBoundingClientRect();
      return {
        i,
        variant: av?.getAttribute("variant"),
        srcAttr: av?.getAttribute("src"),
        initialsAttr: av?.getAttribute("initials"),
        avBg: root ? getComputedStyle(root).backgroundColor : (av ? getComputedStyle(av).backgroundColor : null),
        avBr: av ? getComputedStyle(av).borderRadius : null,
        // check inner
        innerBg: asr ? (() => { const el = asr.querySelector(".avatar") || asr.firstElementChild; return el ? getComputedStyle(el).backgroundColor : null; })() : null,
        innerBr: asr ? (() => { const el = asr.querySelector(".avatar") || asr.firstElementChild; return el ? getComputedStyle(el).borderRadius : null; })() : null,
        size: box ? { w: box.width, h: box.height } : null,
        hasImg: !!img,
        imgNatural: img ? { w: img.naturalWidth, h: img.naturalHeight, complete: img.complete } : null,
        initialsText: initials?.textContent?.trim() || asr?.textContent?.trim()?.slice(0, 10),
        shadow: asr?.innerHTML?.slice(0, 500),
      };
    });
  });
  console.log("CONV_UM_AV", JSON.stringify(detail, null, 2));
  for (let i = 0; i < 2; i++) {
    const box = await page.evaluate((idx) => {
      const app = document.querySelector("demo-app");
      const um = app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelectorAll("harmony-user-menu")[idx];
      const av = um.shadowRoot.querySelector("harmony-avatar");
      const r = av.getBoundingClientRect();
      return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
    }, i);
    await page.screenshot({ path: `${art}/conv-um-av-${i}.png`, clip: box });
  }
  // open menu by clicking avatar
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const um = app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelector("harmony-user-menu");
    um.shadowRoot.querySelector("harmony-avatar")?.click();
  });
  await page.waitForTimeout(500);
  const menu = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const um = app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelector("harmony-user-menu");
    const m = um.shadowRoot.querySelector("[data-user-menu-menu], [part=menu]");
    const slotted = [...um.querySelectorAll("a, button")].map(el => ({
      text: el.textContent.trim(),
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
    }));
    return {
      hidden: m?.hasAttribute("hidden"),
      display: m ? getComputedStyle(m).display : null,
      className: m?.className,
      rect: m ? { w: m.getBoundingClientRect().width, h: m.getBoundingClientRect().height } : null,
      slotted,
    };
  });
  console.log("CONV_UM_OPEN", JSON.stringify(menu, null, 2));
  if (menu.rect && menu.rect.h > 0) {
    const box = await page.evaluate(() => {
      const app = document.querySelector("demo-app");
      const um = app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelector("harmony-user-menu");
      const m = um.shadowRoot.querySelector("[data-user-menu-menu]");
      const trigger = um.shadowRoot.querySelector("harmony-avatar");
      const tr = trigger.getBoundingClientRect();
      const mr = m.getBoundingClientRect();
      return { x: Math.min(tr.x, mr.x) - 10, y: tr.y - 10, width: 240, height: Math.max(mr.bottom, tr.bottom) - tr.y + 20 };
    });
    await page.screenshot({ path: `${art}/conv-um-open.png`, clip: { x: Math.max(0,box.x), y: Math.max(0,box.y), width: box.width, height: Math.min(box.height, 240) } });
  }
  await page.close();
}

// Ref UM open
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:4321/components/user-menu", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  for (let i = 0; i < 2; i++) {
    const box = await page.evaluate((idx) => {
      const um = document.querySelectorAll("article .user-menu")[idx];
      const av = um.querySelector(".avatar");
      const r = av.getBoundingClientRect();
      return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
    }, i);
    await page.screenshot({ path: `${art}/ref-um-av-${i}.png`, clip: box });
  }
  await page.click("article .user-menu .avatar, article .user-menu button");
  await page.waitForTimeout(400);
  const menu = await page.evaluate(() => {
    const um = document.querySelector("article .user-menu");
    const m = um.querySelector(".user-menu__menu, [role=menu]");
    const items = m ? [...m.querySelectorAll("a, button")].map(el => el.textContent.trim()) : [];
    return {
      className: m?.className,
      display: m ? getComputedStyle(m).display : null,
      rect: m ? { w: m.getBoundingClientRect().width, h: m.getBoundingClientRect().height } : null,
      items,
    };
  });
  console.log("REF_UM_OPEN", JSON.stringify(menu, null, 2));
  await page.close();
}

// Company picker open options with indicators
{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:5178/components/company-picker", { waitUntil: "networkidle" });
  await setCp(page);
  const info = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
    p.shadowRoot.querySelector("button")?.click();
    const menu = p.shadowRoot.querySelector("[part=menu], .company-picker__menu, [data-company-menu]");
    // look for rendered options in shadow after slot projection
    const allBtns = menu ? [...menu.querySelectorAll("button, [data-company-option], ::slotted(*)")] : [];
    const slot = menu?.querySelector("slot") || p.shadowRoot.querySelector("slot");
    const assigned = slot ? slot.assignedElements({ flatten: true }) : [];
    return {
      menuHidden: menu?.hasAttribute("hidden"),
      menuDisplay: menu ? getComputedStyle(menu).display : null,
      menuClass: menu?.className,
      menuRect: menu ? { w: menu.getBoundingClientRect().width, h: menu.getBoundingClientRect().height } : null,
      assigned: assigned.map(a => {
        const ind = a.querySelector?.(".company-picker__option-indicator") || null;
        // for raw buttons, color from attr
        return {
          text: a.textContent.trim(),
          tag: a.tagName,
          color: a.getAttribute("data-company-color"),
          // computed styles on slotted (light DOM)
          display: getComputedStyle(a).display,
          padding: getComputedStyle(a).padding,
          bg: getComputedStyle(a).backgroundColor,
        };
      }),
      shadowHTML: p.shadowRoot.innerHTML.slice(0, 1500),
    };
  });
  console.log("CONV_CP_OPEN", JSON.stringify(info, null, 2));
  const box = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const p = app.shadowRoot.querySelector("demo-company-picker-page").shadowRoot.querySelector("harmony-company-picker");
    const menu = p.shadowRoot.querySelector("[part=menu], .company-picker__menu, [data-company-menu]");
    const r = p.getBoundingClientRect();
    const mr = menu?.getBoundingClientRect();
    const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom + 200;
    return { x: Math.max(0, r.right - 300), y: Math.max(0, r.y - 8), width: 320, height: Math.min(bottom - r.y + 16, 300) };
  });
  await page.screenshot({ path: `${art}/conv-cp-open-final.png`, clip: box });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:4321/components/company-picker", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click("article .company-picker__btn, article .company-picker button");
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    const menu = document.querySelector("article .company-picker__menu");
    const opts = [...(menu?.querySelectorAll(".company-picker__option") || [])].map(o => ({
      text: o.querySelector(".company-picker__option-name")?.textContent?.trim(),
      indBg: (() => { const i = o.querySelector(".company-picker__option-indicator"); return i ? getComputedStyle(i).backgroundColor : null; })(),
    }));
    return { open: menu?.classList.contains("company-picker__menu--open"), h: menu?.getBoundingClientRect().height, opts };
  });
  console.log("REF_CP_OPEN", JSON.stringify(info, null, 2));
  const box = await page.evaluate(() => {
    const p = document.querySelector("article .company-picker");
    const menu = p.querySelector(".company-picker__menu");
    const r = p.getBoundingClientRect();
    const mr = menu.getBoundingClientRect();
    return { x: Math.max(0, r.right - 300), y: Math.max(0, r.y - 8), width: 320, height: Math.min(mr.bottom - r.y + 16, 300) };
  });
  await page.screenshot({ path: `${art}/ref-cp-open-final.png`, clip: box });
  await page.close();
}

await browser.close();
