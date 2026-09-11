import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const ref = await page.evaluate(() => {
  const dark = document.documentElement.classList.contains("dark");
  const theme = [...document.documentElement.classList].filter(c => c.startsWith("theme-"));
  const alerts = [...document.querySelectorAll(".alert")].map((el, i) => {
    const s = getComputedStyle(el);
    const icon = el.querySelector(".alert__icon");
    const border = el.querySelector(".alert__border");
    return {
      i, cls: el.className,
      bg: s.backgroundColor, borderColor: s.borderColor, radius: s.borderRadius, pad: s.padding,
      shadow: s.boxShadow, gap: s.gap, display: s.display,
      borderBg: border ? getComputedStyle(border).backgroundColor : null,
      borderW: border ? Math.round(border.getBoundingClientRect().width) : 0,
      iconColor: icon ? getComputedStyle(icon).color : null,
      h: Math.round(el.getBoundingClientRect().height),
    };
  });
  return { dark, theme, alerts };
});

await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const conv = await page.evaluate(() => {
  const dark = document.documentElement.classList.contains("dark");
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const product = app?.getAttribute?.("product") || app?.shadowRoot?.querySelector("[data-product]")?.getAttribute("data-product");
  // try find product from select
  const sel = app?.shadowRoot?.querySelector("select, demo-header") ;
  const alerts = [...(root?.querySelectorAll("harmony-alert") || [])].map((el, i) => {
    const s = getComputedStyle(el);
    const sr = el.shadowRoot;
    const icon = sr.querySelector("[part=icon]");
    const border = sr.querySelector("[part=border]");
    const msgSlot = sr.querySelector("[part=message] slot") || sr.querySelector("[part=message] > slot");
    const assigned = msgSlot?.assignedNodes?.({ flatten: true })?.map(n => (n.textContent||"").trim()).filter(Boolean).join(" ") || null;
    const title = sr.querySelector("[part=title]");
    return {
      i,
      bg: s.backgroundColor, borderColor: s.borderColor, radius: s.borderRadius, pad: s.padding,
      shadow: s.boxShadow, gap: s.gap, display: s.display,
      borderBg: border && getComputedStyle(border).display !== "none" ? getComputedStyle(border).backgroundColor : null,
      borderW: border && getComputedStyle(border).display !== "none" ? Math.round(border.getBoundingClientRect().width) : 0,
      iconColor: icon ? getComputedStyle(icon).color : null,
      h: Math.round(el.getBoundingClientRect().height),
      assignedMsg: assigned?.slice(0,70),
      titleVisible: title && !title.hidden ? title.textContent.trim() : null,
      enhanced: el.hasAttribute("enhanced"),
      variant: el.getAttribute("variant"),
    };
  });
  return { dark, product, alerts, hostBg0: alerts[0]?.bg };
});

// Also force CP theme on both if possible
await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "");
  document.documentElement.classList.add("theme-cp");
});
await page.waitForTimeout(300);
const refCp = await page.evaluate(() => {
  const el = document.querySelector(".alert.alert--info:not(.alert--enhanced)");
  const en = document.querySelector(".alert--enhanced.alert--success");
  const linkOnly = [...document.querySelectorAll(".alert--enhanced")].find(a => a.querySelector(".alert__actions a") && !a.querySelector(".alert__actions button, .alert__actions .btn"));
  const s = getComputedStyle(el);
  const se = getComputedStyle(en);
  const msg = linkOnly?.querySelector(".alert__message");
  const link = linkOnly?.querySelector(".alert__actions a");
  return {
    basic: { bg: s.backgroundColor, border: s.borderColor, icon: getComputedStyle(el.querySelector(".alert__icon")).color, radius: s.borderRadius, pad: s.padding },
    enhanced: { bg: se.backgroundColor, shadow: se.boxShadow !== "none", borderBg: getComputedStyle(en.querySelector(".alert__border")).backgroundColor, radius: se.borderRadius },
    linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
  };
});

await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
// switch product to CP if demo supports it
await page.evaluate(async () => {
  document.documentElement.classList.remove("dark");
  const app = document.querySelector("demo-app");
  const header = app?.shadowRoot?.querySelector("demo-header");
  const select = header?.shadowRoot?.querySelector("select") || app?.shadowRoot?.querySelector("select");
  if (select) {
    select.value = "cp";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
});
await page.waitForTimeout(500);
const convCp = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const el = root?.querySelector('harmony-alert[variant=info]:not([enhanced])');
  const en = root?.querySelector('harmony-alert[enhanced][variant=success]');
  const linkOnly = [...(root?.querySelectorAll("harmony-alert[enhanced]")||[])].find(a => {
    const slot = a.shadowRoot.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({flatten:true})||[];
    const hasLink = assigned.some(n => n.tagName==="A" || n.querySelector?.("a"));
    const hasBtn = assigned.some(n => n.tagName==="HARMONY-BUTTON" || n.querySelector?.("harmony-button,button"));
    return hasLink && !hasBtn;
  });
  const s = getComputedStyle(el);
  const se = getComputedStyle(en);
  const border = en.shadowRoot.querySelector("[part=border]");
  const icon = el.shadowRoot.querySelector("[part=icon]");
  const msg = linkOnly?.shadowRoot.querySelector("[part=message]");
  const slot = linkOnly?.shadowRoot.querySelector("slot[name=actions]");
  const link = (slot?.assignedElements({flatten:true})||[]).flatMap(n => n.tagName==="A"?[n]:[...(n.querySelectorAll?.("a")||[])])[0];
  return {
    basic: { bg: s.backgroundColor, border: s.borderColor, icon: getComputedStyle(icon).color, radius: s.borderRadius, pad: s.padding, shadow: s.boxShadow },
    enhanced: { bg: se.backgroundColor, shadow: se.boxShadow !== "none", borderBg: getComputedStyle(border).backgroundColor, radius: se.borderRadius, pad: se.padding },
    linkDelta: link && msg ? Math.round(link.getBoundingClientRect().left - msg.getBoundingClientRect().left) : null,
    msgAssigned: (() => {
      const sl = el.shadowRoot.querySelector("[part=message] slot, [part=message] > slot");
      return (sl?.assignedNodes({flatten:true})||[]).map(n=>n.textContent.trim()).filter(Boolean).join(" ").slice(0,80);
    })(),
  };
});

console.log(JSON.stringify({ ref, conv, refCp, convCp }, null, 2));
await browser.close();
