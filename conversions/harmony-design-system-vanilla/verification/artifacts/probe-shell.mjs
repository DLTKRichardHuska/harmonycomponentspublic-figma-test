import { chromium } from "playwright";
import { mkdirSync } from "fs";

const art =
  "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
mkdirSync(art, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function probe(label, url, isConv) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  const data = await page.evaluate((conv) => {
    const out = { findings: {} };
    if (conv) {
      const pageEl = document.querySelector(
        "demo-shell-header-page, demo-company-picker-page, demo-user-menu-page",
      );
      const root = pageEl?.shadowRoot;
      out.findings.hasDemoPage = !!pageEl;
      const header = root?.querySelector("harmony-shell-header");
      if (header) {
        const sr = header.shadowRoot;
        const logo = sr?.querySelector("img, [part=logo], .header__logo, svg");
        const title = sr?.querySelector("[part=title], .header__title");
        const brand = sr?.querySelector("[part=brand], .header__brand");
        const gradient = sr?.querySelector("[part=gradient], .header__gradient");
        const gStyle = gradient ? getComputedStyle(gradient) : null;
        out.findings.shell = {
          logoTag: logo?.tagName || null,
          logoSrc: logo?.getAttribute?.("src") || null,
          logoOuter: logo?.outerHTML?.slice(0, 180) || null,
          logoDisplay: logo ? getComputedStyle(logo).display : null,
          logoSize: logo
            ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height }
            : null,
          titleText: title?.textContent?.trim(),
          brandHTML: brand?.innerHTML?.slice(0, 400),
          gradientH: gradient ? gradient.getBoundingClientRect().height : null,
          gradientBg: gStyle?.backgroundImage || gStyle?.background || null,
        };
        const picker = root.querySelector("harmony-company-picker");
        if (picker) {
          const psr = picker.shadowRoot;
          const ind =
            psr?.querySelector("[part=indicator], .company-picker__indicator") ||
            psr?.querySelector("span");
          out.findings.picker = {
            name: picker.getAttribute("company-name"),
            color: picker.getAttribute("company-color"),
            indicatorBg: ind ? getComputedStyle(ind).backgroundColor : null,
            triggerHTML: psr?.querySelector("button")?.innerHTML?.slice(0, 250),
          };
        }
        const um = root.querySelector("harmony-user-menu");
        if (um) {
          const usr = um.shadowRoot;
          const av = usr?.querySelector("button, .avatar, [part=trigger]");
          const r = av?.getBoundingClientRect();
          out.findings.userMenu = {
            name: um.getAttribute("name"),
            triggerText: av?.textContent?.trim()?.slice(0, 40),
            borderRadius: av ? getComputedStyle(av).borderRadius : null,
            size: r ? { w: r.width, h: r.height } : null,
            bg: av ? getComputedStyle(av).backgroundColor : null,
            hasImg: !!usr?.querySelector("img"),
          };
        }
        out.findings.h2s = [...root.querySelectorAll("h2")].map((h) => h.textContent.trim());
      }
      const cpp = document.querySelector("demo-company-picker-page");
      if (cpp?.shadowRoot) {
        const p = cpp.shadowRoot.querySelector("harmony-company-picker");
        const psr = p?.shadowRoot;
        const ind =
          psr?.querySelector(".company-picker__indicator, [part=indicator]") ||
          psr?.querySelector("button span");
        out.findings.cpPage = {
          name: p?.getAttribute("company-name"),
          indBg: ind ? getComputedStyle(ind).backgroundColor : null,
          indSize: ind
            ? { w: ind.getBoundingClientRect().width, h: ind.getBoundingClientRect().height }
            : null,
          triggerHTML: psr?.querySelector("button")?.innerHTML?.slice(0, 250),
        };
        out.findings.h2s = [...cpp.shadowRoot.querySelectorAll("h2")].map((h) =>
          h.textContent.trim(),
        );
      }
      const ump = document.querySelector("demo-user-menu-page");
      if (ump?.shadowRoot) {
        const menus = [...ump.shadowRoot.querySelectorAll("harmony-user-menu")];
        out.findings.umPage = menus.map((um) => {
          const usr = um.shadowRoot;
          const av = usr?.querySelector("button, .avatar, [part=trigger]");
          const r = av?.getBoundingClientRect();
          return {
            name: um.getAttribute("name"),
            src: um.getAttribute("src"),
            text: av?.textContent?.trim()?.slice(0, 20),
            br: av ? getComputedStyle(av).borderRadius : null,
            size: r ? { w: r.width, h: r.height } : null,
            bg: av ? getComputedStyle(av).backgroundColor : null,
            hasImg: !!usr?.querySelector("img"),
          };
        });
        out.findings.h2s = [...ump.shadowRoot.querySelectorAll("h2")].map((h) =>
          h.textContent.trim(),
        );
      }
    } else {
      const header = document.querySelector(".demo-header, header.header");
      if (header) {
        const logo = header.querySelector(".header__logo, img");
        const title = header.querySelector(".header__title");
        const gradient = header.querySelector(".header__gradient");
        const avatar = header.querySelector(".avatar, [class*=avatar]");
        const picker = header.querySelector(".company-picker");
        const ind = picker?.querySelector(".company-picker__indicator");
        out.findings.shell = {
          logoTag: logo?.tagName,
          logoSrc: logo?.getAttribute("src"),
          logoSize: logo
            ? { w: logo.getBoundingClientRect().width, h: logo.getBoundingClientRect().height }
            : null,
          titleText: title?.textContent?.trim(),
          gradientH: gradient ? gradient.getBoundingClientRect().height : null,
          gradientBg: gradient ? getComputedStyle(gradient).backgroundImage : null,
          avatarBr: avatar ? getComputedStyle(avatar).borderRadius : null,
          avatarSize: avatar
            ? { w: avatar.getBoundingClientRect().width, h: avatar.getBoundingClientRect().height }
            : null,
          avatarBg: avatar ? getComputedStyle(avatar).backgroundColor : null,
          avatarHTML: avatar?.innerHTML?.slice(0, 180),
          pickerName: picker?.querySelector(".company-picker__name")?.textContent?.trim(),
          indBg: ind ? getComputedStyle(ind).backgroundColor : null,
        };
      }
      const allPickers = [...document.querySelectorAll(".company-picker")];
      out.findings.cpCount = allPickers.length;
      if (allPickers[0]) {
        const ind = allPickers[0].querySelector(".company-picker__indicator");
        out.findings.cpPage = {
          name: allPickers[0].querySelector(".company-picker__name")?.textContent?.trim(),
          indBg: ind ? getComputedStyle(ind).backgroundColor : null,
          indSize: ind
            ? { w: ind.getBoundingClientRect().width, h: ind.getBoundingClientRect().height }
            : null,
        };
      }
      const avatars = [...document.querySelectorAll("article .avatar")];
      out.findings.umAvatars = avatars.slice(0, 4).map((a) => ({
        br: getComputedStyle(a).borderRadius,
        size: { w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height },
        bg: getComputedStyle(a).backgroundColor,
        text: a.textContent?.trim()?.slice(0, 20),
        hasImg: !!a.querySelector("img"),
        html: a.innerHTML.slice(0, 140),
      }));
      out.findings.h1 = document.querySelector("h1")?.textContent?.trim();
      out.findings.h2s = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
    }
    return out;
  }, isConv);

  const box = await page.evaluate((conv) => {
    if (conv) {
      const pe = document.querySelector(
        "demo-shell-header-page, demo-company-picker-page, demo-user-menu-page",
      );
      const ex = pe?.shadowRoot?.querySelector("demo-example");
      if (!ex) return null;
      const r = ex.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 240) };
    }
    const header = document.querySelector(".demo-header, header.header");
    const parent =
      header?.closest(".example-section, section, .card") ||
      document.querySelector(".example-section");
    const target = parent || header;
    if (!target) return null;
    const r = target.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 280) };
  }, isConv);

  if (box && box.width > 10 && box.height > 10) {
    await page.screenshot({
      path: `${art}/${label}-example.png`,
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(box.width, 1200),
        height: box.height,
      },
    });
  }

  console.log(JSON.stringify({ label, ...data }, null, 2));
  await page.close();
}

await probe("ref-shell", "http://localhost:4321/shell/header", false);
await probe("conv-shell", "http://localhost:5178/shell/header", true);
await probe("ref-cp", "http://localhost:4321/components/company-picker", false);
await probe("conv-cp", "http://localhost:5178/components/company-picker", true);
await probe("ref-um", "http://localhost:4321/components/user-menu", false);
await probe("conv-um", "http://localhost:5178/components/user-menu", true);
await browser.close();
