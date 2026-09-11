import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync } from "node:fs";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/accordion-table-2";
const browser = await chromium.launch({ headless: true });

async function deepScrollCapture(url, role, theme = "cp") {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  await page.addInitScript((t) => localStorage.setItem("harmony-demo-product", t), theme);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate((t) => {
    document.documentElement.classList.remove("dark");
    [...document.documentElement.classList].forEach((c) => { if (c.startsWith("theme-")) document.documentElement.classList.remove(c); });
    document.documentElement.classList.add("theme-" + t);
    document.querySelector("demo-app")?.setAttribute("product", t);
  }, theme);
  await delay(1000);

  const meta = await page.evaluate(() => {
    const find = (root, sel) => {
      const hit = root.querySelector(sel);
      if (hit) return hit;
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const n = find(el.shadowRoot, sel);
          if (n) return n;
        }
      }
      return null;
    };
    const pageEl = find(document, "demo-accordion-page, demo-tables-page, article, .page-content, main");
    const scrollParent = (() => {
      let n = pageEl;
      while (n) {
        const s = getComputedStyle(n);
        if ((s.overflowY === "auto" || s.overflowY === "scroll") && n.scrollHeight > n.clientHeight + 20) return n;
        n = n.parentElement || (n.getRootNode?.() instanceof ShadowRoot ? n.getRootNode().host : null);
      }
      // demo-app main scroll
      const app = document.querySelector("demo-app");
      const main = app?.shadowRoot?.querySelector("[part=main], main, .demo-main, .content, .main");
      return main || document.scrollingElement;
    })();

    const sections = [];
    const collectH = (root) => {
      root.querySelectorAll?.("h1,h2,h3")?.forEach((h) => {
        const r = h.getBoundingClientRect();
        sections.push({ tag: h.tagName, text: (h.textContent || "").trim(), top: Math.round(r.top), h: Math.round(r.height) });
      });
      root.querySelectorAll?.("*")?.forEach((el) => { if (el.shadowRoot) collectH(el.shadowRoot); });
    };
    collectH(document);

    const pageRect = pageEl?.getBoundingClientRect();
    return {
      pageTag: pageEl?.tagName || null,
      pageDisplay: pageEl ? getComputedStyle(pageEl).display : null,
      pageH: pageRect ? Math.round(pageRect.height) : null,
      pageW: pageRect ? Math.round(pageRect.width) : null,
      scrollTag: scrollParent?.tagName || null,
      scrollClass: scrollParent?.className?.toString?.()?.slice?.(0, 80) || null,
      scrollH: scrollParent ? scrollParent.scrollHeight : null,
      clientH: scrollParent ? scrollParent.clientHeight : null,
      sections: sections.filter((s) => s.text && !["Getting Started","Changelog","Foundation","Shell Layout","Components"].includes(s.text)),
    };
  });

  writeFileSync(`${outDir}/${role}-scroll-meta.json`, JSON.stringify(meta, null, 2));
  console.log(role, "page", meta.pageTag, meta.pageDisplay, meta.pageW, "x", meta.pageH, "scroll", meta.scrollTag, meta.scrollH, meta.clientH);

  // Capture each section by scrolling heading into view
  for (const s of meta.sections.slice(0, 20)) {
    const safe = s.text.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 40);
    await page.evaluate((text) => {
      const findH = (root) => {
        for (const h of root.querySelectorAll?.("h1,h2,h3") || []) {
          if ((h.textContent || "").trim() === text) return h;
        }
        for (const el of root.querySelectorAll?.("*") || []) {
          if (el.shadowRoot) {
            const n = findH(el.shadowRoot);
            if (n) return n;
          }
        }
        return null;
      };
      const h = findH(document);
      h?.scrollIntoView({ block: "start" });
    }, s.text);
    await delay(300);
    await page.screenshot({ path: `${outDir}/${role}-sec-${safe}.png`, fullPage: false });
  }

  // Detailed table/accordion visual samples
  const detail = await page.evaluate(() => {
    const findAll = (root, sel, out = []) => {
      root.querySelectorAll?.(sel)?.forEach((el) => out.push(el));
      root.querySelectorAll?.("*")?.forEach((el) => { if (el.shadowRoot) findAll(el.shadowRoot, sel, out); });
      return out;
    };
    const tables = findAll(document, "table").map((t, i) => {
      const r = t.getBoundingClientRect();
      const chips = [...t.querySelectorAll(".chip, harmony-chip")].map((c) => ({
        text: (c.textContent || "").trim(),
        w: Math.round(c.getBoundingClientRect().width),
        h: Math.round(c.getBoundingClientRect().height),
        display: getComputedStyle(c).display,
      }));
      // also chips in light DOM assigned?
      return {
        i,
        w: Math.round(r.width),
        h: Math.round(r.height),
        rows: t.rows?.length,
        headers: [...t.querySelectorAll("th")].map((th) => (th.textContent || "").trim()),
        sampleCell: (t.querySelector("td")?.textContent || "").trim().slice(0, 40),
        chips,
        hasStriped: t.className.includes("striped") || t.closest(".table--striped") != null || !!t.classList.contains("table--striped"),
        className: t.className,
      };
    });

    const items = findAll(document, "harmony-accordion-item").map((el, i) => {
      const r = el.getBoundingClientRect();
      const sr = el.shadowRoot;
      const header = sr?.querySelector("button, [part=header], .accordion-item__header");
      const chevron = sr?.querySelector("svg, [part=chevron], .chevron, harmony-icon");
      const open = el.hasAttribute("open");
      const disabled = el.hasAttribute("disabled");
      const hs = header ? getComputedStyle(header) : null;
      return {
        i,
        title: el.getAttribute("title") || header?.textContent?.trim()?.slice(0, 60),
        open,
        disabled,
        w: Math.round(r.width),
        h: Math.round(r.height),
        borderBottom: hs?.borderBottom || null,
        pad: hs?.padding || null,
        chevron: !!chevron,
      };
    });

    const a11y = findAll(document, "h2,h3").find((h) => /Accessibility/i.test(h.textContent || ""));
    const api = findAll(document, "h2,h3").find((h) => /^(API|Props)$/i.test((h.textContent || "").trim()));

    return { tables, items: items.slice(0, 20), hasA11yHeading: !!a11y, hasApiHeading: !!api };
  });
  writeFileSync(`${outDir}/${role}-detail.json`, JSON.stringify(detail, null, 2));
  console.log(role, "tables", detail.tables.length, "items", detail.items.length, "a11y", detail.hasA11yHeading, "api", detail.hasApiHeading);
  console.log(role, "table sizes", detail.tables.map((t) => `${t.w}x${t.h} r${t.rows} chips${t.chips.length}`).join(" | "));
  await page.close();
}

await deepScrollCapture("http://localhost:5178/components/accordion", "conv-accordion");
await deepScrollCapture("http://localhost:4321/components/accordion", "ref-accordion");
await deepScrollCapture("http://localhost:5178/components/tables", "conv-tables");
await deepScrollCapture("http://localhost:4321/components/tables", "ref-tables");
await browser.close();
console.log("done");
