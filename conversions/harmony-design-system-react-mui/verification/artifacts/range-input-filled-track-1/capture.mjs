import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const art = "conversions/harmony-design-system-react-mui/verification/artifacts/range-input-filled-track-1";
mkdirSync(art, { recursive: true });

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("colorTheme", "cp");
    document.documentElement.classList.remove("dark", "theme-cp", "theme-vp", "theme-ppm", "theme-maconomy");
    document.documentElement.classList.add("theme-cp");
  });
}

async function findSection(page, titleRe) {
  return page.evaluateHandle((reSource) => {
    const re = new RegExp(reSource, "i");
    const hs = [...document.querySelectorAll("h2, h3, h4, .section__title, [class*='title']")];
    const h = hs.find((el) => re.test((el.textContent || "").trim()));
    if (!h) return null;
    let n = h;
    for (let i = 0; i < 8; i++) {
      if (!n.parentElement) break;
      n = n.parentElement;
      const t = n.textContent || "";
      if (/Volume/i.test(t) && (n.querySelector("input[type=range], .MuiSlider-root, .range"))) return n;
    }
    return h.closest("section, article, .demo-example-group, [class*='Example']") || h.parentElement;
  }, titleRe.source);
}

async function captureSide(url, prefix) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: "networkidle" });
  await applyCpLight(page);
  await page.waitForTimeout(800);

  // Scroll to Range Input examples
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("h2,h3,h4,.section__title")].find((n) => /Range Input/i.test(n.textContent || ""));
    el?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(400);

  const rangeSec = await findSection(page, /Range Input(?! With)/);
  const rangeEl = rangeSec.asElement();
  if (rangeEl) {
    writeFileSync(join(art, `${prefix}-range-input.png`), await rangeEl.screenshot({ type: "png" }));
    console.log(prefix, "range-input section ok");
  } else {
    writeFileSync(join(art, `${prefix}-range-input-fallback.png`), await page.screenshot({ type: "png", fullPage: false }));
    console.log(prefix, "range-input section MISSING — fallback page shot");
  }

  const labelSec = await findSection(page, /Range Input With Label/);
  const labelEl = labelSec.asElement();
  if (labelEl) {
    writeFileSync(join(art, `${prefix}-range-with-label.png`), await labelEl.screenshot({ type: "png" }));
    console.log(prefix, "with-label section ok");
  }

  const colors = await page.evaluate(() => {
    function sampleCssBg(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, opacity: cs.opacity, width: el.getBoundingClientRect().width };
    }
    const out = { themePrimary: null, border: null, ranges: [] };
    const root = getComputedStyle(document.documentElement);
    out.themePrimary = root.getPropertyValue("--theme-primary").trim() || root.getPropertyValue("--mui-palette-primary-main").trim();
    out.border = root.getPropertyValue("--border-color").trim() || root.getPropertyValue("--mui-palette-divider").trim();

    document.querySelectorAll("input.range, input[type=range].range").forEach((input, i) => {
      const cs = getComputedStyle(input);
      // WebKit track pseudo not accessible; read CSS vars on input
      out.ranges.push({
        kind: "astro-range",
        i,
        value: input.value,
        fillPercent: input.style.getPropertyValue("--range-fill-percent") || cs.getPropertyValue("--range-fill-percent"),
        thumbColor: cs.getPropertyValue("--thumb-color").trim(),
        trackColor: cs.getPropertyValue("--track-color").trim(),
        // sample mid-left of control for filled look via canvas? skip — screenshots are source of truth
        rect: (() => { const r = input.getBoundingClientRect(); return { w: r.width, h: r.height }; })(),
      });
    });

    document.querySelectorAll(".MuiSlider-root").forEach((rootEl, i) => {
      const track = rootEl.querySelector(".MuiSlider-track");
      const rail = rootEl.querySelector(".MuiSlider-rail");
      const thumb = rootEl.querySelector(".MuiSlider-thumb");
      out.ranges.push({
        kind: "mui-slider",
        i,
        track: sampleCssBg(track),
        rail: sampleCssBg(rail),
        thumb: sampleCssBg(thumb),
      });
    });
    return out;
  });

  // Pixel sample filled vs remaining for first slider/range
  const pixelSamples = await page.evaluate(async () => {
    const samples = [];
    const targets = [
      ...document.querySelectorAll("input.range"),
      ...document.querySelectorAll(".MuiSlider-root"),
    ].slice(0, 3);

    for (const el of targets) {
      const r = el.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(r.width));
      canvas.height = Math.max(1, Math.floor(r.height));
      // Use html2canvas? not available. Instead use elementFromPoint via screenshot approach — skip.
      // Sample via getImageData not possible without draw.
      // Approximate: for MUI, use computed; for Astro, vars already known.
      samples.push({
        tag: el.className,
        leftX: Math.floor(r.left + r.width * 0.15),
        midX: Math.floor(r.left + r.width * 0.5),
        rightX: Math.floor(r.left + r.width * 0.9),
        y: Math.floor(r.top + r.height / 2),
      });
    }
    return samples;
  });

  writeFileSync(join(art, `${prefix}-probe.json`), JSON.stringify({ colors, pixelSamples }, null, 2));
  console.log(prefix, "probe", JSON.stringify(colors, null, 2));
  await browser.close();
}

await captureSide("http://localhost:4321/components/specialty-inputs", "ref");
await captureSide("http://localhost:5176/components/specialty-inputs", "conv");
console.log("done");
