import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const OUT = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function axProgress(page) {
  const client = await page.context().newCDPSession(page);
  const { nodes } = await client.send("Accessibility.getFullAXTree");
  return (nodes || [])
    .filter((n) => (n.role?.value || n.role) === "progressbar")
    .map((n) => ({
      role: n.role?.value,
      props: Object.fromEntries((n.properties || []).map((p) => [p.name, p.value?.value ?? p.value])),
    }));
}

// Reference: force light + try CP
await page.goto("http://localhost:4321/components/progress-bar", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  // try set product to vp to match demo default if control exists
  const html = document.documentElement;
  html.classList.remove("theme-cp","theme-vp","theme-ppm","theme-maconomy");
  html.classList.add("theme-vp");
});
await page.waitForTimeout(400);
const refLight = await page.evaluate(() => {
  const bars = [...document.querySelectorAll(".progress")].map((el) => {
    const bar = el.querySelector(".progress__bar");
    return {
      className: el.className,
      trackBg: getComputedStyle(el).backgroundColor,
      barBg: bar && getComputedStyle(bar).backgroundColor,
      h: Math.round(el.getBoundingClientRect().height),
      fill: Math.round((bar.getBoundingClientRect().width / el.getBoundingClientRect().width) * 100),
      ariaNow: el.getAttribute("aria-valuenow"),
      role: el.getAttribute("role"),
    };
  });
  const label = [...document.querySelectorAll("span")].find((el) => el.textContent.trim() === "42%");
  const ls = label && getComputedStyle(label);
  return {
    theme: document.documentElement.className,
    dark: document.documentElement.classList.contains("dark"),
    bars,
    label: label && { color: ls.color, fontSize: ls.fontSize, marginTop: ls.marginTop },
  };
});
await page.screenshot({ path: join(OUT, "ref-vp-light-top2.png"), fullPage: false });
await page.screenshot({ path: join(OUT, "ref-vp-light-full2.png"), fullPage: true });
// scroll to variants
await page.evaluate(() => document.querySelector("#examples")?.scrollIntoView());
const refAx = await axProgress(page);

// Reference dark VP
await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.waitForTimeout(300);
const refDark = await page.evaluate(() => {
  return [...document.querySelectorAll(".progress")].slice(0, 12).map((el) => {
    const bar = el.querySelector(".progress__bar");
    return {
      className: el.className,
      trackBg: getComputedStyle(el).backgroundColor,
      barBg: bar && getComputedStyle(bar).backgroundColor,
    };
  });
});
await page.screenshot({ path: join(OUT, "ref-vp-dark-top.png"), fullPage: false });

// Converted VP light (default)
await page.emulateMedia({ forcedColors: null });
await page.goto("http://localhost:5178/components/progress-bar", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.remove("dark"));
await page.waitForTimeout(400);
const convLight = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  return [...root.querySelectorAll("harmony-progress")].map((el) => {
    const track = el.shadowRoot.querySelector('[part="track"]');
    const bar = el.shadowRoot.querySelector('[part="bar"]');
    return {
      attrs: { value: el.getAttribute("value"), size: el.getAttribute("size"), variant: el.getAttribute("variant"), showLabel: el.hasAttribute("show-label") },
      trackBg: getComputedStyle(track).backgroundColor,
      barBg: getComputedStyle(bar).backgroundColor,
      h: Math.round(track.getBoundingClientRect().height),
      fill: Math.round((bar.getBoundingClientRect().width / track.getBoundingClientRect().width) * 100),
      roleAttr: el.getAttribute("role"),
      ariaNow: el.getAttribute("aria-valuenow"),
    };
  });
});
const convAx = await axProgress(page);

// Converted dark
await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.waitForTimeout(300);
const convDark = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  return [...root.querySelectorAll("harmony-progress")].map((el) => {
    const track = el.shadowRoot.querySelector('[part="track"]');
    const bar = el.shadowRoot.querySelector('[part="bar"]');
    return {
      attrs: { value: el.getAttribute("value"), variant: el.getAttribute("variant"), size: el.getAttribute("size") },
      trackBg: getComputedStyle(track).backgroundColor,
      barBg: getComputedStyle(bar).backgroundColor,
    };
  });
});

// Forced colors size heights
await page.emulateMedia({ forcedColors: "active", colorScheme: "dark" });
await page.waitForTimeout(300);
const forcedSizes = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-progress-bar-page")?.shadowRoot;
  return [...root.querySelectorAll("harmony-progress")].filter((el) => el.getAttribute("value") === "60").map((el) => {
    const track = el.shadowRoot.querySelector('[part="track"]');
    const r = track.getBoundingClientRect();
    return { size: el.getAttribute("size"), h: Math.round(r.height), border: getComputedStyle(track).border, boxSizing: getComputedStyle(track).boxSizing };
  });
});

const pair = (a, b) => a.map((x, i) => ({
  i,
  refTrack: x.trackBg,
  convTrack: b[i]?.trackBg,
  refBar: x.barBg,
  convBar: b[i]?.barBg,
  trackMatch: x.trackBg === b[i]?.trackBg,
  barMatch: x.barBg === b[i]?.barBg,
  refH: x.h,
  convH: b[i]?.h,
  refFill: x.fill,
  convFill: b[i]?.fill,
  cls: x.className || b[i]?.attrs,
}));

const out = {
  refTheme: refLight.theme,
  lightPairs: pair(refLight.bars, convLight),
  darkPairs: pair(refDark, convDark),
  refLabel: refLight.label,
  refAxSample: refAx.slice(0, 3),
  convAxSample: convAx.slice(0, 3),
  refAxHasNow: refAx.filter((x) => x.props.valuenow != null).length,
  convAxHasNow: convAx.filter((x) => x.props.valuenow != null).length,
  forcedSizes,
  mismatchesLight: pair(refLight.bars, convLight).filter((p) => !p.barMatch || !p.trackMatch || p.refH !== p.convH || p.refFill !== p.convFill),
  mismatchesDark: pair(refDark, convDark).filter((p) => !p.barMatch || !p.trackMatch),
};
writeFileSync(join(OUT, "compare-notes.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify({
  lightMismatchCount: out.mismatchesLight.length,
  darkMismatchCount: out.mismatchesDark.length,
  lightSample: out.lightPairs.slice(0, 3),
  variantLight: out.lightPairs.slice(7, 12),
  darkSample: out.darkPairs.slice(0, 3),
  variantDark: out.darkPairs.slice(7, 12),
  sizes: out.lightPairs.slice(4, 7).map((p) => ({ refH: p.refH, convH: p.convH, fill: [p.refFill, p.convFill] })),
  ax: { refHasNow: out.refAxHasNow, convHasNow: out.convAxHasNow, ref: out.refAxSample, conv: out.convAxSample },
  forcedSizes: out.forcedSizes,
  label: out.refLabel,
}, null, 2));
await browser.close();
