import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
import { writeFileSync, mkdirSync } from "node:fs";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/accordion-table-2";
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function inventory(url, role, theme = "cp") {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  await page.addInitScript((t) => {
    localStorage.setItem("harmony-demo-product", t);
  }, theme);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate((t) => {
    const html = document.documentElement;
    [...html.classList].forEach((c) => {
      if (c.startsWith("theme-") || c === "dark") html.classList.remove(c);
    });
    html.classList.add("theme-" + t);
    const app = document.querySelector("demo-app");
    if (app) app.setAttribute("product", t);
  }, theme);
  await delay(900);

  const data = await page.evaluate(() => {
    const headings = [];
    let accordionItems = 0;
    let accordionHosts = 0;
    const tables = [];
    let fullText = "";

    const collect = (root) => {
      root.querySelectorAll?.("h1,h2,h3")?.forEach((h) => {
        headings.push({ tag: h.tagName, text: (h.textContent || "").trim() });
      });
      root.querySelectorAll?.("harmony-accordion")?.forEach(() => accordionHosts++);
      root.querySelectorAll?.("harmony-accordion-item")?.forEach(() => accordionItems++);
      root.querySelectorAll?.("table")?.forEach((t) => {
        const r = t.getBoundingClientRect();
        tables.push({
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          rows: t.rows?.length ?? 0,
          headers: [...t.querySelectorAll("th")].map((th) => (th.textContent || "").trim()),
        });
      });
      root.querySelectorAll?.("*")?.forEach((el) => {
        if (el.shadowRoot) collect(el.shadowRoot);
      });
    };
    collect(document);

    const texts = [];
    const twalk = (node) => {
      if (!node) return;
      if (node.nodeType === 3) {
        const t = node.textContent?.trim();
        if (t) texts.push(t);
      } else if (node.nodeType === 1) {
        if (node.shadowRoot) twalk(node.shadowRoot);
        for (const c of node.childNodes) twalk(c);
      }
    };
    twalk(document.documentElement);
    fullText = texts.join("\n");

    const pageEl = document.querySelector("demo-accordion-page, demo-tables-page");
    const pageRect = pageEl?.getBoundingClientRect();

    return {
      title: document.title,
      productClass: [...document.documentElement.classList].filter((c) => c.startsWith("theme-")),
      headings,
      accordionHosts,
      accordionItems,
      tables,
      pageDisplay: pageEl ? getComputedStyle(pageEl).display : null,
      pageH: pageRect ? Math.round(pageRect.height) : null,
      pageW: pageRect ? Math.round(pageRect.width) : null,
      bodyScroll: document.documentElement.scrollHeight,
      hasA11y: /Accessibility/i.test(fullText),
      hasApi: /\bAPI\b/.test(fullText) || /Props/i.test(fullText),
      hasCostpointNote: /TableCostpointGrid/i.test(fullText),
      hasDisabled: /Disabled/i.test(fullText),
      hasAllowMultiple: /Allow Multiple|allow-multiple/i.test(fullText),
      hasDefaultOpen: /Default Open|default open/i.test(fullText),
      hasFocus: /\bFocus\b/i.test(fullText),
      hasWithLabel: /With [Ll]abel|Account preferences/i.test(fullText),
      textHead: fullText.slice(0, 4000),
      textTail: fullText.slice(-2500),
    };
  });

  writeFileSync(outDir + "/" + role + "-inventory.json", JSON.stringify(data, null, 2));
  await page.screenshot({ path: outDir + "/" + role + "-top.png", fullPage: false });
  await page.evaluate(() => window.scrollBy(0, 1100));
  await delay(250);
  await page.screenshot({ path: outDir + "/" + role + "-mid.png", fullPage: false });
  await page.evaluate(() => window.scrollBy(0, 1100));
  await delay(250);
  await page.screenshot({ path: outDir + "/" + role + "-mid2.png", fullPage: false });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await delay(250);
  await page.screenshot({ path: outDir + "/" + role + "-bottom.png", fullPage: false });

  console.log(role, JSON.stringify({
    headings: data.headings,
    pageH: data.pageH,
    pageW: data.pageW,
    pageDisplay: data.pageDisplay,
    bodyScroll: data.bodyScroll,
    accordionHosts: data.accordionHosts,
    accordionItems: data.accordionItems,
    tableCount: data.tables.length,
    tables: data.tables.map((t) => ({ w: t.w, h: t.h, rows: t.rows, headers: t.headers })),
    flags: {
      hasA11y: data.hasA11y,
      hasApi: data.hasApi,
      hasCostpointNote: data.hasCostpointNote,
      hasDisabled: data.hasDisabled,
      hasAllowMultiple: data.hasAllowMultiple,
      hasDefaultOpen: data.hasDefaultOpen,
      hasFocus: data.hasFocus,
      hasWithLabel: data.hasWithLabel,
    },
    productClass: data.productClass,
  }, null, 2));
  await page.close();
}

await inventory("http://localhost:4321/components/accordion", "ref-accordion");
await inventory("http://localhost:5178/components/accordion", "conv-accordion");
await inventory("http://localhost:4321/components/tables", "ref-tables");
await inventory("http://localhost:5178/components/tables", "conv-tables");
await browser.close();
console.log("done");
