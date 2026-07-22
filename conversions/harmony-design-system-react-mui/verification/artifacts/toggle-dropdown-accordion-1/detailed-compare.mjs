import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const art = "conversions/harmony-design-system-react-mui/verification/artifacts/toggle-dropdown-accordion-1";
mkdirSync(art, { recursive: true });

async function cp(page) {
  await page.evaluate(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("colorTheme", "cp");
    localStorage.setItem("harmony-theme", "cp");
    localStorage.setItem("harmony-mode", "light");
    const html = document.documentElement;
    html.classList.remove("dark");
    html.className = (html.className || "").replace(/theme-\w+/g, "") + " theme-cp";
  });
}

function pick(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    tag: el.tagName,
    cls: String(el.className || "").slice(0, 80),
    w: Math.round(r.width),
    h: Math.round(r.height),
    bg: cs.backgroundColor,
    border: cs.borderTopWidth + " " + cs.borderTopColor,
    radius: cs.borderRadius,
    fontSize: cs.fontSize,
    color: cs.color,
    padding: cs.padding,
  };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const result = {};

  for (const [key, url] of [
    ["ref", "http://localhost:4321/components/dropdowns"],
    ["conv", "http://localhost:5176/components/dropdowns"],
  ]) {
    await page.goto(url, { waitUntil: "networkidle" });
    await cp(page);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    result[key] = await page.evaluate(() => {
      const pickLocal = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName,
          cls: String(el.className || "").slice(0, 80),
          w: Math.round(r.width),
          h: Math.round(r.height),
          bg: cs.backgroundColor,
          border: cs.borderTopWidth + " " + cs.borderTopColor,
          radius: cs.borderRadius,
          fontSize: cs.fontSize,
          color: cs.color,
          padding: cs.padding,
        };
      };
      const a11y = [...document.querySelectorAll("#accessibility h3, #accessibility .a11y-card__title")].map((h) =>
        h.textContent.trim().replace(/\s+/g, " "),
      );
      const root =
        document.querySelector("#examples .dropdown") ||
        document.querySelector("#examples .MuiOutlinedInput-root") ||
        document.querySelector(".dropdown") ||
        document.querySelector(".MuiOutlinedInput-root");
      const select =
        document.querySelector("#examples .dropdown__trigger, #examples [role=combobox], #examples .MuiSelect-select") ||
        document.querySelector(".MuiSelect-select, .dropdown__trigger, [role=combobox]");
      const outline = document.querySelector("#examples .MuiOutlinedInput-notchedOutline");
      return {
        a11y,
        root: pickLocal(root),
        select: pickLocal(select),
        outline: pickLocal(outline),
        callout: document.body.innerText.includes("Not supported in this conversion"),
      };
    });
  }

  for (const [key, url] of [
    ["refA", "http://localhost:4321/components/accordion"],
    ["convA", "http://localhost:5176/components/accordion"],
  ]) {
    await page.goto(url, { waitUntil: "networkidle" });
    await cp(page);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    result[key] = await page.evaluate(() => {
      const pickLocal = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          bg: cs.backgroundColor,
          borderTop: cs.borderTopWidth + " " + cs.borderTopColor,
          borderBottom: cs.borderBottomWidth + " " + cs.borderBottomColor,
          color: cs.color,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          padding: cs.padding,
          radius: cs.borderRadius,
        };
      };
      const headers = [
        ...document.querySelectorAll(
          ".accordion-item__button, .accordion-item button, .accordion button[aria-expanded], .MuiAccordionSummary-root",
        ),
      ];
      const items = headers.slice(0, 3).map((h) => ({
        text: h.textContent.trim().replace(/\s+/g, " ").slice(0, 50),
        ...pickLocal(h),
      }));
      const locked = headers.find((h) => /Locked/i.test(h.textContent || ""));
      const a11y = [...document.querySelectorAll("#accessibility h3, #accessibility .a11y-card__title")].map((h) =>
        h.textContent.trim().replace(/\s+/g, " "),
      );
      const firstExpanded = document.querySelector(
        ".accordion-item__content, .accordion-panel, [aria-hidden=false].accordion-item__panel, .MuiAccordionDetails-root",
      );
      return {
        a11y,
        items,
        locked: locked ? pickLocal(locked) : null,
        details: pickLocal(firstExpanded),
        headerCount: headers.length,
      };
    });
    const dis = page.getByText("Disabled Sections", { exact: true }).first();
    if (await dis.count()) {
      await dis.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      writeFileSync(join(art, key + "-disabled-page.png"), await page.screenshot({ type: "png", fullPage: false }));
    }
  }

  for (const [key, url] of [
    ["refT", "http://localhost:4321/components/toggle-switches"],
    ["convT", "http://localhost:5176/components/toggle-switches"],
  ]) {
    await page.goto(url, { waitUntil: "networkidle" });
    await cp(page);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    result[key] = await page.evaluate(() => {
      const pickSw = (el) => {
        if (!el) return null;
        const track = el.querySelector(".MuiSwitch-track, .toggle__track");
        const thumb = el.querySelector(".MuiSwitch-thumb, .toggle__thumb");
        return {
          root: { w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) },
          track: track && {
            w: Math.round(track.getBoundingClientRect().width),
            h: Math.round(track.getBoundingClientRect().height),
            bg: getComputedStyle(track).backgroundColor,
            opacity: getComputedStyle(track).opacity,
          },
          thumb: thumb && {
            w: Math.round(thumb.getBoundingClientRect().width),
            h: Math.round(thumb.getBoundingClientRect().height),
            bg: getComputedStyle(thumb).backgroundColor,
          },
        };
      };
      const byLabel = (text) => {
        const lab = [...document.querySelectorAll("label, .MuiFormControlLabel-root")].find(
          (l) => (l.textContent || "").trim() === text,
        );
        return lab ? lab.querySelector(".MuiSwitch-root, .toggle") : null;
      };
      const a11y = [...document.querySelectorAll("#accessibility h3, #accessibility .a11y-card__title")].map((h) =>
        h.textContent.trim().replace(/\s+/g, " "),
      );
      return {
        a11y,
        small: pickSw(byLabel("Small")),
        medium: pickSw(byLabel("Medium")),
        callout: document.body.innerText.includes("Not supported in this conversion"),
        segmentedSection: !!document.body.innerText.match(/Segmented toggle/),
      };
    });
  }

  writeFileSync(join(art, "detailed-compare.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

await run();
