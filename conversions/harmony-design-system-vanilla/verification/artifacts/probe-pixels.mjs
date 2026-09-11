import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });

async function sample(page, box) {
  const buf = await page.screenshot({ clip: box, type: "png" });
  // decode via sharp if available, else use canvas in page
  return buf.length;
}

async function pixelSample(url, isConv, findFn) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  if (isConv) {
    await page.evaluate(() => {
      const app = document.querySelector("demo-app");
      const header = app?.shadowRoot?.querySelector("demo-header");
      const select = header?.shadowRoot?.querySelector("select");
      if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
    });
    await page.waitForTimeout(900);
  }
  const result = await page.evaluate(findFn);
  // sample center pixel of element via screenshot + canvas
  if (result?.box) {
    const shot = await page.screenshot({ clip: result.box, type: "png" });
    // use page to read - inject image
    const colors = await page.evaluate(async (b64) => {
      const img = new Image();
      const p = new Promise((res) => { img.onload = () => res(); });
      img.src = "data:image/png;base64," + b64;
      await p;
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pts = [
        [Math.floor(img.width/2), Math.floor(img.height/2)],
        [2, 2],
        [Math.floor(img.width/2), 2],
      ];
      return pts.map(([x,y]) => {
        const d = ctx.getImageData(x,y,1,1).data;
        return `rgba(${d[0]},${d[1]},${d[2]},${(d[3]/255).toFixed(2)})`;
      });
    }, shot.toString("base64"));
    result.pixels = colors;
  }
  console.log(JSON.stringify(result, null, 2));
  await page.close();
}

await pixelSample("http://localhost:5178/shell/header", true, () => {
  const app = document.querySelector("demo-app");
  const sr = app.shadowRoot.querySelector("demo-shell-header-page").shadowRoot.querySelector("harmony-shell-header").shadowRoot;
  const icon = sr.querySelector("harmony-icon.header__logo");
  const title = sr.querySelector(".header__title");
  const header = sr.querySelector(".header");
  const r = icon.getBoundingClientRect();
  return {
    label: "conv-logo",
    title: title.textContent.trim(),
    headerBg: getComputedStyle(header).backgroundColor,
    titleColor: getComputedStyle(title).color,
    logoColor: getComputedStyle(icon).color,
    box: { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) },
  };
});

await pixelSample("http://localhost:4321/shell/header", false, () => {
  const demo = document.querySelector(".demo-header");
  const logo = demo.querySelector(".header__logo");
  const title = demo.querySelector(".header__title");
  const r = logo.getBoundingClientRect();
  return {
    label: "ref-logo",
    title: title.textContent.trim(),
    headerBg: getComputedStyle(demo).backgroundColor,
    titleColor: getComputedStyle(title).color,
    box: { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) },
  };
});

await pixelSample("http://localhost:5178/components/user-menu", true, () => {
  const app = document.querySelector("demo-app");
  const av = app.shadowRoot.querySelector("demo-user-menu-page").shadowRoot.querySelector("harmony-user-menu").shadowRoot.querySelector("harmony-avatar");
  const r = av.getBoundingClientRect();
  return {
    label: "conv-um-initials",
    bg: getComputedStyle(av).backgroundColor,
    box: { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) },
  };
});

await pixelSample("http://localhost:4321/components/user-menu", false, () => {
  const av = document.querySelector("article .user-menu .avatar");
  const r = av.getBoundingClientRect();
  return {
    label: "ref-um-initials",
    bg: getComputedStyle(av).backgroundColor,
    box: { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) },
  };
});

// theme primary tokens
for (const [label, url, conv] of [["ref","http://localhost:4321/components/user-menu",false],["conv","http://localhost:5178/components/user-menu",true]]) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  if (conv) {
    await page.evaluate(() => {
      const app = document.querySelector("demo-app");
      const header = app?.shadowRoot?.querySelector("demo-header");
      const select = header?.shadowRoot?.querySelector("select");
      if (select) { select.value = "cp"; select.dispatchEvent(new Event("change", { bubbles: true })); }
    });
    await page.waitForTimeout(800);
  }
  const toks = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      themePrimary: s.getPropertyValue("--theme-primary").trim(),
      avatarBg: s.getPropertyValue("--avatar-bg").trim(),
      colorPrimary: s.getPropertyValue("--color-primary").trim(),
      primary: s.getPropertyValue("--primary").trim(),
      brand: s.getPropertyValue("--brand-primary").trim(),
    };
  });
  console.log(label+"_TOKENS", toks);
  await page.close();
}

await browser.close();
