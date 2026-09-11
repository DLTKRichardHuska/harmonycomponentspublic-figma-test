import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

const art =
  "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
mkdirSync(art, { recursive: true });
const browser = await chromium.launch({ headless: true });

function pierce(page, selectors) {
  return page.evaluate((sels) => {
    let node = document;
    for (const sel of sels) {
      const root = node.shadowRoot || node;
      node = root.querySelector(sel);
      if (!node) return null;
    }
    return true;
  }, selectors);
}

async function setProductCp(page) {
  // try demo chrome product select
  await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const header = app?.shadowRoot?.querySelector("demo-header");
    const select = header?.shadowRoot?.querySelector("select");
    if (select) {
      select.value = "cp";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);
}

async function deepQuery(page, path) {
  return page.evaluate((parts) => {
    let el = document;
    for (const p of parts) {
      const root = el.shadowRoot ?? el;
      el = root.querySelector(p);
      if (!el) return { ok: false, failedAt: p };
    }
    return { ok: true };
  }, path);
}

async function probeShell() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:5178/shell/header", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  await setProductCp(page);

  const findings = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app?.shadowRoot?.querySelector("demo-shell-header-page");
    const root = pageEl?.shadowRoot;
    const header = root?.querySelector("harmony-shell-header");
    const sr = header?.shadowRoot;
    const logo = sr?.querySelector("img, [part~=logo], .header__logo, svg");
    const title = sr?.querySelector("[part~=title], .header__title, .title");
    const brand = sr?.querySelector("[part~=brand], .header__brand");
    const gradient = sr?.querySelector("[part~=gradient], .header__gradient");
    const gStyle = gradient ? getComputedStyle(gradient) : null;
    const picker = root?.querySelector("#demo-company-picker, harmony-company-picker");
    const psr = picker?.shadowRoot;
    const ind = psr?.querySelector(".company-picker__indicator, [part~=indicator]");
    const um = root?.querySelector("harmony-user-menu");
    const usr = um?.shadowRoot;
    const av = usr?.querySelector("button, .avatar, [part~=trigger]");
    const ar = av?.getBoundingClientRect();

    // open picker
    const pbtn = psr?.querySelector("button");
    pbtn?.click();
    const menuOpen = !!psr?.querySelector(".company-picker__menu--open, [part~=menu].open, [aria-expanded=true]");
    const menu = psr?.querySelector(".company-picker__menu, [part~=menu], [role=listbox], .menu");
    const options = menu ? [...menu.querySelectorAll("button, [role=option], .company-picker__option")].map(o => o.textContent.trim()) : [];

    return {
      product: app?.getAttribute("product"),
      hasPage: !!pageEl,
      h2s: root ? [...root.querySelectorAll("h2")].map(h => h.textContent.trim()) : [],
      shell: {
        logoTag: logo?.tagName || null,
        logoSrc: logo?.getAttribute?.("src") || null,
        logoOuter: logo?.outerHTML?.slice(0, 220) || null,
        logoSize: logo ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height } : null,
        titleText: title?.textContent?.trim() || null,
        brandText: brand?.textContent?.trim()?.slice(0, 80) || null,
        brandHTML: brand?.innerHTML?.slice(0, 350) || null,
        headerHTML: sr?.innerHTML?.slice(0, 600) || null,
        gradientH: gradient ? gradient.getBoundingClientRect().height : null,
        gradientBg: gStyle?.backgroundImage || null,
        headerH: header ? header.getBoundingClientRect().height : null,
      },
      picker: {
        name: picker?.getAttribute("company-name"),
        color: picker?.getAttribute("company-color"),
        indBg: ind ? getComputedStyle(ind).backgroundColor : null,
        indSize: ind ? { w: ind.getBoundingClientRect().width, h: ind.getBoundingClientRect().height } : null,
        triggerHTML: pbtn?.innerHTML?.slice(0, 280),
        menuOpen,
        options,
        menuDisplay: menu ? getComputedStyle(menu).display : null,
      },
      userMenu: {
        name: um?.getAttribute("name"),
        text: av?.textContent?.trim()?.slice(0, 40),
        br: av ? getComputedStyle(av).borderRadius : null,
        size: ar ? { w: ar.width, h: ar.height } : null,
        bg: av ? getComputedStyle(av).backgroundColor : null,
        hasImg: !!usr?.querySelector("img"),
      },
    };
  });

  // crop first header example
  const box = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app?.shadowRoot?.querySelector("demo-shell-header-page");
    const header = pageEl?.shadowRoot?.querySelector("harmony-shell-header");
    if (!header) return null;
    const r = header.getBoundingClientRect();
    return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
  });
  if (box) {
    await page.screenshot({
      path: `${art}/conv-shell-header-crop.png`,
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(box.width, 1300),
        height: Math.min(box.height, 120),
      },
    });
  }

  // picker open crop
  const pbox = await page.evaluate(() => {
    const app = document.querySelector("demo-app");
    const pageEl = app?.shadowRoot?.querySelector("demo-shell-header-page");
    const picker = pageEl?.shadowRoot?.querySelector("harmony-company-picker");
    const menu = picker?.shadowRoot?.querySelector(".company-picker__menu, [part~=menu], [role=listbox]");
    const host = picker;
    if (!host) return null;
    const r = host.getBoundingClientRect();
    const mr = menu?.getBoundingClientRect();
    const bottom = mr ? mr.bottom : r.bottom;
    return { x: r.x - 20, y: r.y - 10, width: Math.max(r.width, mr?.width || 0) + 40, height: bottom - r.y + 20 };
  });
  if (pbox && pbox.height > 20) {
    await page.screenshot({
      path: `${art}/conv-shell-picker-open.png`,
      clip: {
        x: Math.max(0, pbox.x),
        y: Math.max(0, pbox.y),
        width: Math.min(Math.max(pbox.width, 200), 500),
        height: Math.min(pbox.height, 320),
      },
    });
  }

  console.log("CONV_SHELL", JSON.stringify(findings, null, 2));
  await page.close();
}

async function probeRefShell() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto("http://localhost:4321/shell/header", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  const findings = await page.evaluate(() => {
    const demo = document.querySelector(".demo-header");
    const logo = demo?.querySelector(".header__logo, img");
    const title = demo?.querySelector(".header__title");
    const gradient = demo?.querySelector(".header__gradient");
    const avatar = demo?.querySelector(".avatar");
    const picker = demo?.querySelector(".company-picker");
    const ind = picker?.querySelector(".company-picker__indicator");
    const btn = picker?.querySelector("button");
    btn?.click();
    const menu = picker?.querySelector(".company-picker__menu");
    const options = menu ? [...menu.querySelectorAll(".company-picker__option")].map(o => o.textContent.trim()) : [];
    return {
      h1: document.querySelector("article h1, .page-header__title")?.textContent?.trim(),
      h2s: [...document.querySelectorAll("article h2, .section__title")].map(h => h.textContent.trim()),
      shell: {
        logoSrc: logo?.getAttribute("src"),
        logoSize: logo ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height } : null,
        titleText: title?.textContent?.trim(),
        headerH: demo ? demo.getBoundingClientRect().height : null,
        gradientH: gradient ? gradient.getBoundingClientRect().height : null,
        gradientBg: gradient ? getComputedStyle(gradient).backgroundImage : null,
        avatarBr: avatar ? getComputedStyle(avatar).borderRadius : null,
        avatarSize: avatar ? { w: avatar.getBoundingClientRect().width, h: avatar.getBoundingClientRect().height } : null,
        avatarBg: avatar ? getComputedStyle(avatar).backgroundColor : null,
        avatarHTML: avatar?.innerHTML?.slice(0, 160),
        pickerName: picker?.querySelector(".company-picker__name")?.textContent?.trim(),
        indBg: ind ? getComputedStyle(ind).backgroundColor : null,
        indSize: ind ? { w: ind.getBoundingClientRect().width, h: ind.getBoundingClientRect().height } : null,
        options,
        menuOpen: menu?.classList.contains("company-picker__menu--open"),
      },
    };
  });

  const box = await page.evaluate(() => {
    const demo = document.querySelector(".demo-header");
    if (!demo) return null;
    const r = demo.getBoundingClientRect();
    return { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 };
  });
  if (box) {
    await page.screenshot({
      path: `${art}/ref-shell-header-crop.png`,
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(box.width, 1300),
        height: Math.min(box.height, 120),
      },
    });
  }

  const pbox = await page.evaluate(() => {
    const picker = document.querySelector(".demo-header .company-picker");
    const menu = picker?.querySelector(".company-picker__menu");
    if (!picker) return null;
    const r = picker.getBoundingClientRect();
    const mr = menu?.getBoundingClientRect();
    const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom;
    return { x: r.x - 20, y: r.y - 10, width: Math.max(r.width, mr?.width || 0) + 40, height: bottom - r.y + 20 };
  });
  if (pbox) {
    await page.screenshot({
      path: `${art}/ref-shell-picker-open.png`,
      clip: {
        x: Math.max(0, pbox.x),
        y: Math.max(0, pbox.y),
        width: Math.min(Math.max(pbox.width, 200), 500),
        height: Math.min(Math.max(pbox.height, 40), 320),
      },
    });
  }

  console.log("REF_SHELL", JSON.stringify(findings, null, 2));
  await page.close();
}

async function probeComponents() {
  for (const [label, refUrl, convUrl, convTag] of [
    ["cp", "http://localhost:4321/components/company-picker", "http://localhost:5178/components/company-picker", "demo-company-picker-page"],
    ["um", "http://localhost:4321/components/user-menu", "http://localhost:5178/components/user-menu", "demo-user-menu-page"],
  ]) {
    // reference
    const rp = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await rp.goto(refUrl, { waitUntil: "networkidle", timeout: 60000 });
    await rp.waitForTimeout(700);
    const ref = await rp.evaluate(() => {
      const article = document.querySelector("article");
      const pickers = [...document.querySelectorAll("article .company-picker")];
      const ums = [...document.querySelectorAll("article .user-menu")];
      const avatars = [...document.querySelectorAll("article .avatar")];
      return {
        h1: document.querySelector("article h1, .page-header__title")?.textContent?.trim(),
        desc: document.querySelector(".page-header__description")?.textContent?.trim()?.slice(0, 200),
        h2s: [...document.querySelectorAll("article h2")].map(h => h.textContent.trim()),
        exampleTitles: [...document.querySelectorAll(".example-section__title, .example-section h3, .example-section header")].map(h => h.textContent.trim()).slice(0, 10),
        pickers: pickers.map(p => ({
          name: p.querySelector(".company-picker__name")?.textContent?.trim(),
          indBg: (() => { const i=p.querySelector(".company-picker__indicator"); return i?getComputedStyle(i).backgroundColor:null; })(),
          indSize: (() => { const i=p.querySelector(".company-picker__indicator"); if(!i)return null; const r=i.getBoundingClientRect(); return {w:r.width,h:r.height}; })(),
        })),
        ums: ums.length,
        avatars: avatars.map(a => ({
          br: getComputedStyle(a).borderRadius,
          size: { w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height },
          bg: getComputedStyle(a).backgroundColor,
          text: a.textContent?.trim()?.slice(0, 20),
          hasImg: !!a.querySelector("img"),
        })),
      };
    });
    // crop first example
    const rbox = await rp.evaluate(() => {
      const ex = document.querySelector(".example-section");
      if (!ex) return null;
      const r = ex.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 220) };
    });
    if (rbox) await rp.screenshot({ path: `${art}/ref-${label}-example.png`, clip: { x: Math.max(0,rbox.x), y: Math.max(0,rbox.y), width: Math.min(rbox.width,1200), height: rbox.height } });
    console.log("REF_"+label, JSON.stringify(ref, null, 2));
    await rp.close();

    // converted
    const cp = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await cp.goto(convUrl, { waitUntil: "networkidle", timeout: 60000 });
    await cp.waitForTimeout(700);
    await setProductCp(cp);
    const conv = await cp.evaluate((tag) => {
      const app = document.querySelector("demo-app");
      const pageEl = app?.shadowRoot?.querySelector(tag);
      const root = pageEl?.shadowRoot;
      const pickers = root ? [...root.querySelectorAll("harmony-company-picker")] : [];
      const ums = root ? [...root.querySelectorAll("harmony-user-menu")] : [];
      return {
        product: app?.getAttribute("product"),
        h2s: root ? [...root.querySelectorAll("h2")].map(h => h.textContent.trim()) : [],
        pickers: pickers.map(p => {
          const sr = p.shadowRoot;
          const ind = sr?.querySelector(".company-picker__indicator, [part~=indicator]");
          return {
            name: p.getAttribute("company-name"),
            color: p.getAttribute("company-color"),
            indBg: ind ? getComputedStyle(ind).backgroundColor : null,
            indSize: ind ? { w: ind.getBoundingClientRect().width, h: ind.getBoundingClientRect().height } : null,
            triggerHTML: sr?.querySelector("button")?.innerHTML?.slice(0, 200),
          };
        }),
        ums: ums.map(um => {
          const sr = um.shadowRoot;
          const av = sr?.querySelector("button, .avatar, [part~=trigger]");
          return {
            name: um.getAttribute("name"),
            src: um.getAttribute("src"),
            text: av?.textContent?.trim()?.slice(0, 20),
            br: av ? getComputedStyle(av).borderRadius : null,
            size: av ? { w: av.getBoundingClientRect().width, h: av.getBoundingClientRect().height } : null,
            bg: av ? getComputedStyle(av).backgroundColor : null,
            hasImg: !!sr?.querySelector("img"),
          };
        }),
      };
    }, convTag);

    // open user menu on um page
    if (label === "um") {
      await cp.evaluate((tag) => {
        const app = document.querySelector("demo-app");
        const pageEl = app?.shadowRoot?.querySelector(tag);
        const um = pageEl?.shadowRoot?.querySelector("harmony-user-menu");
        um?.shadowRoot?.querySelector("button")?.click();
      }, convTag);
      await cp.waitForTimeout(300);
    }
    if (label === "cp") {
      await cp.evaluate((tag) => {
        const app = document.querySelector("demo-app");
        const pageEl = app?.shadowRoot?.querySelector(tag);
        const p = pageEl?.shadowRoot?.querySelector("harmony-company-picker");
        p?.shadowRoot?.querySelector("button")?.click();
      }, convTag);
      await cp.waitForTimeout(300);
      const openBox = await cp.evaluate((tag) => {
        const app = document.querySelector("demo-app");
        const pageEl = app?.shadowRoot?.querySelector(tag);
        const p = pageEl?.shadowRoot?.querySelector("harmony-company-picker");
        const menu = p?.shadowRoot?.querySelector(".company-picker__menu, [part~=menu]");
        const host = p;
        if (!host) return null;
        const r = host.getBoundingClientRect();
        const mr = menu?.getBoundingClientRect();
        const bottom = mr && mr.height > 0 ? mr.bottom : r.bottom + 160;
        return { x: Math.max(0, r.x - 40), y: Math.max(0, r.y - 20), width: 320, height: Math.min(bottom - r.y + 40, 280) };
      }, convTag);
      if (openBox) await cp.screenshot({ path: `${art}/conv-cp-open.png`, clip: openBox });
    }

    const cbox = await cp.evaluate((tag) => {
      const app = document.querySelector("demo-app");
      const pageEl = app?.shadowRoot?.querySelector(tag);
      const ex = pageEl?.shadowRoot?.querySelector("demo-example");
      if (!ex) return null;
      const r = ex.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 220) };
    }, convTag);
    if (cbox) await cp.screenshot({ path: `${art}/conv-${label}-example.png`, clip: { x: Math.max(0,cbox.x), y: Math.max(0,cbox.y), width: Math.min(cbox.width,1200), height: cbox.height } });

    console.log("CONV_"+label, JSON.stringify(conv, null, 2));
    await cp.close();
  }
}

await probeRefShell();
await probeShell();
await probeComponents();
await browser.close();
