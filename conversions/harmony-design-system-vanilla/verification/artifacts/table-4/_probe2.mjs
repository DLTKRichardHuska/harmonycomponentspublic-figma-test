import { chromium } from "playwright";
import { setTimeout as delay } from "node:timers/promises";
const out = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

await page.goto("http://localhost:4321/components/tables", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
});
await delay(400);
const ref = await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2,h3")].find((el) => /Interactive Table/i.test(el.textContent || ""));
  h?.scrollIntoView({ block: "start" });
  const table = h?.parentElement?.querySelector("table") || document.querySelector("table");
  // find interactive by checkbox header
  const tables = [...document.querySelectorAll("table")];
  const it = tables.find((t) => t.querySelector('thead input[type=checkbox], thead .checkbox'));
  const ths = it ? [...it.querySelectorAll("thead th")].map((th) => th.textContent.trim()) : [];
  const avatars = it ? [...it.querySelectorAll(".avatar, [class*=avatar]")].map((a) => ({
    text: (a.textContent || "").trim().slice(0, 6),
    w: Math.round(a.getBoundingClientRect().width),
    h: Math.round(a.getBoundingClientRect().height),
    cls: a.className,
  })) : [];
  const stripedH = [...document.querySelectorAll("h2,h3")].find((el) => /Alternating Rows/i.test(el.textContent || ""));
  stripedH?.scrollIntoView({ block: "center" });
  const striped = document.querySelector("table.table--striped") || [...document.querySelectorAll("table")].find((t) => t.querySelector(".table-row--total"));
  const total = striped?.querySelector(".table-row--total");
  return {
    interactiveHeaders: ths,
    avatars,
    totalBg: total && getComputedStyle(total).backgroundColor,
    zebra: striped && [...striped.querySelectorAll("tbody tr")].map((tr) => ({
      cls: tr.className,
      bg: getComputedStyle(tr).backgroundColor,
      text: tr.innerText.replace(/\s+/g, " ").slice(0, 50),
    })),
  };
});
console.log("REF", JSON.stringify(ref, null, 2));
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2,h3")].find((el) => /Alternating Rows/i.test(el.textContent || ""));
  h?.scrollIntoView({ block: "start" });
});
await delay(200);
const box = await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2,h3")].find((el) => /Alternating Rows/i.test(el.textContent || ""));
  if (!h) return null;
  const r = h.getBoundingClientRect();
  let end = r.bottom + 400;
  const n = h.nextElementSibling;
  if (n) end = Math.max(end, n.getBoundingClientRect().bottom + 24);
  return { x: 8, y: Math.max(0, Math.floor(r.top - 8)), width: 1240, height: Math.min(640, Math.floor(end - r.top + 24)) };
});
if (box) await page.screenshot({ path: `${out}/ref-striped-total.png`, clip: box });

await page.goto("http://localhost:5178/components/tables", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("theme-cp");
  document.querySelector("demo-app")?.setAttribute("product", "cp");
});
await delay(800);
const conv = await page.evaluate(() => {
  const deep = (root, sel) => {
    const out = [];
    const walk = (n) => {
      if (!n?.querySelectorAll) return;
      out.push(...n.querySelectorAll(sel));
      for (const el of n.querySelectorAll("*")) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(root);
    return out;
  };
  const root = document.querySelector("demo-tables-page")?.shadowRoot || document;
  const av = deep(root, "harmony-avatar").slice(0, 3).map((a) => {
    const part = a.shadowRoot?.querySelector("[part=root], .avatar, span") || a;
    return {
      initials: a.getAttribute("initials"),
      text: (part.textContent || "").trim().slice(0, 8),
      bg: getComputedStyle(part).backgroundColor,
      w: Math.round(a.getBoundingClientRect().width),
      h: Math.round(a.getBoundingClientRect().height),
    };
  });
  return { av };
});
console.log("CONV av", JSON.stringify(conv, null, 2));
await browser.close();
