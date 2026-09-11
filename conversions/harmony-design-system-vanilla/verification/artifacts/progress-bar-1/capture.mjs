import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const results = {};

await page.goto("http://localhost:4321/components/progress-bar", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
results.ref = await page.evaluate(() => {
  const bars = [...document.querySelectorAll(".progress")].map((el) => {
    const bar = el.querySelector(".progress__bar");
    const s = getComputedStyle(el);
    const bs = bar ? getComputedStyle(bar) : null;
    const r = el.getBoundingClientRect();
    const br = bar?.getBoundingClientRect();
    return {
      className: el.className,
      role: el.getAttribute("role"),
      valueNow: el.getAttribute("aria-valuenow"),
      valueMin: el.getAttribute("aria-valuemin"),
      valueMax: el.getAttribute("aria-valuemax"),
      trackH: Math.round(r.height),
      trackW: Math.round(r.width),
      trackBg: s.backgroundColor,
      trackRadius: s.borderRadius,
      barW: br ? Math.round(br.width) : null,
      barBg: bs?.backgroundColor,
      barRadius: bs?.borderRadius,
      fillPct: br && r.width ? Math.round((br.width / r.width) * 100) : null,
    };
  });
  const labelNear = [...document.querySelectorAll("span")].filter((el) => /^\d+%$/.test(el.textContent.trim())).map((el) => {
    const s = getComputedStyle(el);
    return { text: el.textContent.trim(), color: s.color, fontSize: s.fontSize, marginTop: s.marginTop };
  });
  return {
    h1: document.querySelector("h1")?.textContent?.trim(),
    description: document.querySelector(".page-header__description")?.textContent?.trim(),
    badge: document.querySelector(".badge")?.textContent?.trim(),
    h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    h3: [...document.querySelectorAll("h3")].map((h) => h.textContent.trim()),
    exampleTitles: [...document.querySelectorAll(".example-section__title, .example__title, h3")].map((h) => h.textContent.trim()),
    navLinks: [...document.querySelectorAll(".article-nav__link")].map((a) => a.textContent.trim()),
    bars,
    labelNear,
    htmlProgress: document.querySelectorAll("progress").length,
  };
});
await page.screenshot({ path: join(OUT, "ref-vp-light-top.png"), fullPage: false });
await page.screenshot({ path: join(OUT, "ref-vp-light-full.png"), fullPage: true });

for (const title of ["Basic Progress", "Sizes", "Variants", "With Label"]) {
  const box = await page.evaluate((t) => {
    const headings = [...document.querySelectorAll("h2, h3, .example-section__title, .example__title")];
    const el = headings.find((h) => h.textContent.trim().includes(t));
    if (!el) return null;
    let section = el.closest(".example-section") || el.parentElement;
    const r = section.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 400) };
  }, title);
  if (box && box.width > 0 && box.height > 0) {
    await page.screenshot({
      path: join(OUT, `ref-sec-${title.toLowerCase().replace(/\s+/g, "-")}.png`),
      clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(1100, box.width), height: box.height },
    }).catch(() => {});
  }
}

await page.goto("http://localhost:5178/components/progress-bar", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
results.conv = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const pageEl = app?.shadowRoot?.querySelector("demo-progress-bar-page") || document.querySelector("demo-progress-bar-page");
  const root = pageEl?.shadowRoot || pageEl;
  if (!root) return { error: "no demo-progress-bar-page" };

  const progressEls = [...root.querySelectorAll("harmony-progress")];
  const bars = progressEls.map((el) => {
    const sr = el.shadowRoot;
    const track = sr?.querySelector('[part="track"]');
    const bar = sr?.querySelector('[part="bar"]');
    const label = sr?.querySelector('[part="label"]');
    const ts = track ? getComputedStyle(track) : null;
    const bs = bar ? getComputedStyle(bar) : null;
    const ls = label && !label.hidden ? getComputedStyle(label) : null;
    const tr = track?.getBoundingClientRect();
    const br = bar?.getBoundingClientRect();
    return {
      attrs: {
        value: el.getAttribute("value"),
        max: el.getAttribute("max"),
        size: el.getAttribute("size"),
        variant: el.getAttribute("variant"),
        showLabel: el.hasAttribute("show-label"),
      },
      roleAttr: el.getAttribute("role"),
      ariaNow: el.getAttribute("aria-valuenow"),
      ariaMin: el.getAttribute("aria-valuemin"),
      ariaMax: el.getAttribute("aria-valuemax"),
      trackH: tr ? Math.round(tr.height) : null,
      trackW: tr ? Math.round(tr.width) : null,
      trackBg: ts?.backgroundColor,
      trackRadius: ts?.borderRadius,
      trackBorder: ts?.border,
      barW: br ? Math.round(br.width) : null,
      barBg: bs?.backgroundColor,
      barRadius: bs?.borderRadius,
      fillPct: br && tr?.width ? Math.round((br.width / tr.width) * 100) : null,
      cssVar: getComputedStyle(el).getPropertyValue("--harmony-progress").trim(),
      labelText: label && !label.hidden ? label.textContent.trim() : null,
      labelColor: ls?.color,
      labelFontSize: ls?.fontSize,
      labelMarginTop: ls?.marginTop,
      hasHtmlProgress: !!sr?.querySelector("progress"),
      openShadow: sr?.mode || (sr ? "open-ish" : null),
    };
  });

  return {
    h1: root.querySelector("h1")?.textContent?.trim(),
    description: root.querySelector("p")?.textContent?.trim(),
    h2: [...root.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    hasConsume: !!root.querySelector("demo-consume-snippets"),
    bars,
    htmlProgressCount: root.querySelectorAll("progress").length,
    publicProgressClass: !!document.querySelector(".progress"),
  };
});

results.convProgressbars = [];
try {
  const client = await page.context().newCDPSession(page);
  const { nodes } = await client.send("Accessibility.getFullAXTree");
  results.convProgressbars = (nodes || [])
    .filter((n) => (n.role?.value || n.role) === "progressbar")
    .map((n) => ({
      role: n.role?.value || n.role,
      name: n.name?.value || n.name,
      properties: (n.properties || []).map((p) => ({ name: p.name, value: p.value?.value ?? p.value })),
    }));
} catch (e) {
  results.convAxError = String(e);
}

await page.screenshot({ path: join(OUT, "conv-vp-light-top.png"), fullPage: false });
await page.screenshot({ path: join(OUT, "conv-vp-light-full.png"), fullPage: true });

for (const title of ["Basic Progress", "Sizes", "Variants", "With Label"]) {
  const box = await page.evaluate((t) => {
    const app = document.querySelector("demo-app");
    const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
    const h2 = [...(root?.querySelectorAll("h2") || [])].find((h) => h.textContent.trim() === t);
    if (!h2) return null;
    const example = h2.nextElementSibling;
    const r1 = h2.getBoundingClientRect();
    const r2 = example?.getBoundingClientRect() || r1;
    const top = Math.min(r1.top, r2.top);
    const bottom = Math.max(r1.bottom, r2.bottom);
    const left = Math.min(r1.left, r2.left);
    const right = Math.max(r1.right, r2.right);
    return { x: left, y: top, width: right - left, height: bottom - top };
  }, title);
  if (box && box.width > 0 && box.height > 0) {
    await page.screenshot({
      path: join(OUT, `conv-sec-${title.toLowerCase().replace(/\s+/g, "-")}.png`),
      clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(1100, box.width + 8), height: Math.min(500, box.height + 8) },
    }).catch(() => {});
  }
}

await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.waitForTimeout(300);
results.convDark = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  const els = [...(root?.querySelectorAll("harmony-progress") || [])];
  return els.slice(0, 8).map((el) => {
    const track = el.shadowRoot?.querySelector('[part="track"]');
    const bar = el.shadowRoot?.querySelector('[part="bar"]');
    return {
      attrs: { value: el.getAttribute("value"), size: el.getAttribute("size"), variant: el.getAttribute("variant") },
      trackBg: track && getComputedStyle(track).backgroundColor,
      barBg: bar && getComputedStyle(bar).backgroundColor,
    };
  });
});
await page.screenshot({ path: join(OUT, "conv-vp-dark-top.png"), fullPage: false });

await page.emulateMedia({ forcedColors: "active", colorScheme: "dark" });
await page.waitForTimeout(300);
results.convForced = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  return [...(root?.querySelectorAll("harmony-progress") || [])].slice(0, 8).map((el) => {
    const track = el.shadowRoot?.querySelector('[part="track"]');
    const bar = el.shadowRoot?.querySelector('[part="bar"]');
    const label = el.shadowRoot?.querySelector('[part="label"]');
    const ts = track && getComputedStyle(track);
    const bs = bar && getComputedStyle(bar);
    return {
      size: el.getAttribute("size"),
      variant: el.getAttribute("variant"),
      showLabel: el.hasAttribute("show-label"),
      trackBg: ts?.backgroundColor,
      trackBorder: ts?.border,
      barBg: bs?.backgroundColor,
      labelColor: label && !label.hidden ? getComputedStyle(label).color : null,
    };
  });
});
await page.screenshot({ path: join(OUT, "conv-forced-colors-top.png"), fullPage: false });

// also capture variants section under forced colors
const forcedBox = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  const h2 = [...(root?.querySelectorAll("h2") || [])].find((h) => h.textContent.trim() === "Variants");
  if (!h2) return null;
  const example = h2.nextElementSibling;
  const r1 = h2.getBoundingClientRect();
  const r2 = example?.getBoundingClientRect() || r1;
  return {
    x: Math.min(r1.left, r2.left),
    y: Math.min(r1.top, r2.top),
    width: Math.max(r1.right, r2.right) - Math.min(r1.left, r2.left),
    height: Math.max(r1.bottom, r2.bottom) - Math.min(r1.top, r2.top),
  };
});
if (forcedBox) {
  await page.screenshot({
    path: join(OUT, "conv-forced-colors-variants.png"),
    clip: { x: Math.max(0, forcedBox.x), y: Math.max(0, forcedBox.y), width: Math.min(1100, forcedBox.width + 8), height: Math.min(400, forcedBox.height + 8) },
  }).catch(() => {});
}

writeFileSync(join(OUT, "capture-metrics.json"), JSON.stringify({
  ref: results.ref,
  conv: results.conv,
  convProgressbars: results.convProgressbars,
  convDark: results.convDark,
  convForced: results.convForced,
}, null, 2));

console.log(JSON.stringify({
  refH2: results.ref?.h2,
  convH2: results.conv?.h2,
  refBars: results.ref?.bars?.length,
  convBars: results.conv?.bars?.length,
  refHeights: results.ref?.bars?.map((b) => ({ c: b.className, h: b.trackH, fill: b.fillPct, bg: b.barBg })),
  convHeights: results.conv?.bars?.map((b) => ({ a: b.attrs, h: b.trackH, fill: b.fillPct, bg: b.barBg, label: b.labelText })),
  axCount: results.convProgressbars?.length,
  axSample: results.convProgressbars?.slice(0, 3),
  dark: results.convDark?.slice(0, 4),
  forced: results.convForced?.slice(0, 5),
  htmlProgress: { ref: results.ref?.htmlProgress, conv: results.conv?.htmlProgressCount },
  publicProgress: results.conv?.publicProgressClass,
}, null, 2));

await browser.close();
