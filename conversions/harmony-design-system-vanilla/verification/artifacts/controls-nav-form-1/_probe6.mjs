import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync } from "node:fs";

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.addInitScript(() => {
  localStorage.setItem("harmony-demo-product", "cp");
  localStorage.setItem("harmony-color-scheme", "light");
});

const walkFindSrc = `const walkFind = (root, sel) => {
  const hit = root.querySelector(sel);
  if (hit) return hit;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const n = walkFind(el.shadowRoot, sel);
      if (n) return n;
    }
  }
  return null;
};`;

async function gotoConv(path) {
  await page.goto("http://localhost:5178" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    document.querySelector("demo-app")?.setAttribute("product", "cp");
    document.documentElement.classList.remove("dark");
  });
  await delay(1000);
}

await gotoConv("/components/tab-strip");
const tabProbe = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const basic = walkFind(document, "#tabs-basic");
  const iconsRight = walkFind(document, "#tabs-icons-right");
  const tabs = [...(basic?.shadowRoot?.querySelectorAll("[role=tab]") || [])];
  const measureTab = (t) => {
    const cs = getComputedStyle(t);
    const r = t.getBoundingClientRect();
    // look for underline child
    const kids = [...t.querySelectorAll("*")].map((el) => {
      const kcs = getComputedStyle(el);
      const kr = el.getBoundingClientRect();
      return {
        cls: String(el.className || ""),
        h: +kr.height.toFixed(1),
        w: +kr.width.toFixed(1),
        bg: kcs.backgroundColor,
        borderBottom: kcs.borderBottom,
        borderBottomColor: kcs.borderBottomColor,
        borderBottomWidth: kcs.borderBottomWidth,
      };
    });
    return {
      text: t.textContent.trim(),
      selected: t.getAttribute("aria-selected"),
      color: cs.color,
      h: Math.round(r.height),
      borderBottomWidth: cs.borderBottomWidth,
      borderBottomColor: cs.borderBottomColor,
      boxShadow: cs.boxShadow,
      kids: kids.filter((k) => k.h <= 6 || /active|indicator|underline|bar/i.test(k.cls) || k.borderBottomWidth !== "0px"),
    };
  };
  // select Features and measure both
  const overview = measureTab(tabs[0]);
  tabs[1].click();
  const afterClick = tabs.map(measureTab);

  // icons right layout
  const irTabs = [...(iconsRight?.shadowRoot?.querySelectorAll("[role=tab]") || [])];
  const irLayout = irTabs.map((t) => {
    const icon = t.querySelector("harmony-icon, svg, .tab-strip__icon, [class*=icon]");
    const label = t.querySelector(".tab-strip__label, span, .label") || t;
    const ir = icon?.getBoundingClientRect();
    const lr = label?.getBoundingClientRect();
    return {
      text: t.textContent.trim(),
      iconLeft: ir ? +ir.left.toFixed(1) : null,
      labelLeft: lr ? +lr.left.toFixed(1) : null,
      iconBeforeLabel: ir && lr ? ir.left < lr.left : null,
    };
  });

  return { overviewBeforeClick: overview, afterClick, irLayout, tabHtml: tabs[0]?.outerHTML?.slice(0, 500) };
});
writeFileSync(outDir + "/probe-tab-active.json", JSON.stringify(tabProbe, null, 2));
console.log(JSON.stringify(tabProbe, null, 2));

// clip icons right/left for visual
const clipIcon = async (id, name) => {
  const box = await page.evaluate((id) => {
    const walkFind = (root, sel) => {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const n = walkFind(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    };
    const el = walkFind(document, id);
    if (!el) return null;
    // scroll host section
    let host = el;
    while (host && !host.getBoundingClientRect) host = host.host;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    // include heading above approximately
    return {
      x: Math.max(0, r.x - 16),
      y: Math.max(0, r.y - 48),
      width: Math.min(r.width + 32, 1000),
      height: Math.min(r.height + 80, 300),
    };
  }, id);
  await delay(200);
  if (box) {
    await page.screenshot({ path: outDir + "/conv-" + name + ".png", clip: box });
    console.log("clip", name, box);
  } else console.log("noclip", name);
};
await clipIcon("#tabs-icons-left", "tabs-icons-left");
await clipIcon("#tabs-icons-right", "tabs-icons-right");
await clipIcon("#tabs-basic", "tabs-basic-active");

// checkbox sizes native vs CE vs ref
await gotoConv("/components/checkboxes");
const sizes = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const walkAll = (root, sel) => {
    const out = [...root.querySelectorAll(sel)];
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) out.push(...walkAll(el.shadowRoot, sel));
    }
    return out;
  };
  const native = walkAll(document, "input[type=checkbox]").find((i) => !i.className.includes("checkbox"));
  const nr = native?.getBoundingClientRect();
  const ncs = native && getComputedStyle(native);
  const ceBox = walkFind(document, "harmony-checkbox[checked]")?.shadowRoot?.querySelector(".checkbox__box");
  const cr = ceBox?.getBoundingClientRect();
  const ccs = ceBox && getComputedStyle(ceBox);
  return {
    native: nr && { w: +nr.width.toFixed(1), h: +nr.height.toFixed(1), bg: ncs.backgroundColor, appearance: ncs.appearance },
    ceBox: cr && { w: +cr.width.toFixed(1), h: +cr.height.toFixed(1), bg: ccs.backgroundColor, border: ccs.borderTopColor },
  };
});
writeFileSync(outDir + "/probe-cb-sizes.json", JSON.stringify(sizes, null, 2));
console.log("sizes", sizes);

await page.goto("http://localhost:4321/components/checkboxes", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem("theme", "light");
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
});
await delay(400);
const refSize = await page.evaluate(() => {
  const box = document.querySelector(".checkbox__box");
  const r = box.getBoundingClientRect();
  const cs = getComputedStyle(box);
  return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), bg: cs.backgroundColor, border: cs.borderTopColor };
});
writeFileSync(outDir + "/probe-ref-cb-size.json", JSON.stringify(refSize, null, 2));
console.log("ref size", refSize);

// radio sizes
await gotoConv("/components/radio-buttons");
const radioSizes = await page.evaluate(() => {
  const walkFind = (root, sel) => {
    const hit = root.querySelector(sel);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const n = walkFind(el.shadowRoot, sel);
        if (n) return n;
      }
    }
    return null;
  };
  const measure = (host) => {
    const box = host?.shadowRoot?.querySelector(".radio__circle, .radio__box, span");
    if (!box) return null;
    const r = box.getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), label: host.getAttribute("label"), size: host.getAttribute("size") };
  };
  return {
    sm: measure(walkFind(document, 'harmony-radio[size="small"]')),
    md: measure(walkFind(document, 'harmony-radio[size="medium"]')),
    lg: measure(walkFind(document, 'harmony-radio[size="large"]')),
  };
});
await page.goto("http://localhost:4321/components/radio-buttons", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
});
await delay(400);
const refRadio = await page.evaluate(() => {
  const measure = (labelText) => {
    const lab = [...document.querySelectorAll("label")].find((l) => l.textContent.trim().startsWith(labelText));
    const box = lab?.querySelector(".radio__circle, .radio__box, span");
    if (!box) return null;
    const r = box.getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), text: lab.textContent.trim() };
  };
  return { sm: measure("Small"), md: measure("Medium"), lg: measure("Large") };
});
writeFileSync(outDir + "/probe-radio-sizes.json", JSON.stringify({ conv: radioSizes, ref: refRadio }, null, 2));
console.log("radio", { conv: radioSizes, ref: refRadio });

await browser.close();
