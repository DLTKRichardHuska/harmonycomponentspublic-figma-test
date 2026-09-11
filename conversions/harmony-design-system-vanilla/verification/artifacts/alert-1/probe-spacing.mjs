import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();
  document.documentElement.classList.add("theme-cp");
});
await page.waitForTimeout(300);
const client = await page.context().newCDPSession(page);
const { nodes } = await client.send("Accessibility.getFullAXTree");
const alerts = (nodes||[]).filter(n => (n.role?.value||n.role)==="alert").map(n => ({
  name: typeof n.name === "object" ? (n.name?.value ?? "") : n.name,
}));
console.log(JSON.stringify({ refAlertNames: alerts }, null, 2));

// compare link-only spacing details
await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
await page.evaluate(() => document.documentElement.classList.remove("dark"));
await page.waitForTimeout(200);
await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const header = app?.shadowRoot?.querySelector("demo-header");
  const select = header?.shadowRoot?.querySelector("select") || app?.shadowRoot?.querySelector("select");
  if (select) {
    const opt = [...select.options].find(o => /cp/i.test(o.value) || /cp/i.test(o.text));
    if (opt) { select.value = opt.value; select.dispatchEvent(new Event("change", { bubbles: true })); }
  }
});
await page.waitForTimeout(400);

const spacing = await page.evaluate(() => {
  function measure(label, el, isConv) {
    if (!el) return { label, missing: true };
    if (isConv) {
      const sr = el.shadowRoot;
      const msg = sr.querySelector("[part=message]");
      const actions = sr.querySelector("[part=actions]");
      const title = sr.querySelector("[part=title]");
      const main = sr.querySelector(".alert__main");
      const body = sr.querySelector(".alert__body");
      const slot = sr.querySelector("slot[name=actions]");
      const link = (slot?.assignedElements({flatten:true})||[]).flatMap(n => n.tagName==="A"?[n]:[...(n.querySelectorAll?.("a")||[])])[0];
      return {
        label,
        h: Math.round(el.getBoundingClientRect().height),
        bodyPad: getComputedStyle(body).padding,
        bodyGap: getComputedStyle(body).gap,
        actionsPad: getComputedStyle(actions).padding,
        actionsMT: getComputedStyle(actions).marginTop,
        actionsPT: getComputedStyle(actions).paddingTop,
        actionsDisplay: getComputedStyle(actions).display,
        titleMB: getComputedStyle(title).marginBottom,
        msgLH: getComputedStyle(msg).lineHeight,
        msgFS: getComputedStyle(msg).fontSize,
        linkFS: link ? getComputedStyle(link).fontSize : null,
        linkLH: link ? getComputedStyle(link).lineHeight : null,
        linkH: link ? Math.round(link.getBoundingClientRect().height) : null,
        actionsH: Math.round(actions.getBoundingClientRect().height),
        mainH: Math.round(main.getBoundingClientRect().height),
      };
    }
    const msg = el.querySelector(".alert__message");
    const actions = el.querySelector(".alert__actions");
    const title = el.querySelector(".alert__title");
    const content = el.querySelector(".alert__content");
    const link = actions?.querySelector("a");
    return {
      label,
      h: Math.round(el.getBoundingClientRect().height),
      contentPad: getComputedStyle(content).padding,
      contentGap: getComputedStyle(content).gap,
      actionsPad: getComputedStyle(actions).padding,
      actionsPT: getComputedStyle(actions).paddingTop,
      titleMB: getComputedStyle(title).marginBottom,
      msgLH: getComputedStyle(msg).lineHeight,
      msgFS: getComputedStyle(msg).fontSize,
      linkFS: link ? getComputedStyle(link).fontSize : null,
      linkLH: link ? getComputedStyle(link).lineHeight : null,
      linkH: link ? Math.round(link.getBoundingClientRect().height) : null,
      actionsH: Math.round(actions.getBoundingClientRect().height),
    };
  }

  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const conv = [...root.querySelectorAll("harmony-alert[enhanced]")].find(a => {
    const slot = a.shadowRoot.querySelector("slot[name=actions]");
    const assigned = slot?.assignedElements({flatten:true})||[];
    const hasLink = assigned.some(n => n.tagName==="A" || n.querySelector?.("a"));
    const hasBtn = assigned.some(n => n.tagName==="HARMONY-BUTTON" || n.querySelector?.("harmony-button,button"));
    return hasLink && !hasBtn;
  });
  return { conv: measure("conv-link-only", conv, true) };
});
console.log(JSON.stringify(spacing, null, 2));

await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.classList.remove("dark");
  document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, "").trim();
  document.documentElement.classList.add("theme-cp");
});
await page.waitForTimeout(300);
const refSp = await page.evaluate(() => {
  const linkOnly = [...document.querySelectorAll(".alert--enhanced")].find(a => {
    const acts = a.querySelector(".alert__actions");
    return acts && acts.querySelector("a") && !acts.querySelector("button, .btn");
  });
  const msg = linkOnly.querySelector(".alert__message");
  const actions = linkOnly.querySelector(".alert__actions");
  const title = linkOnly.querySelector(".alert__title");
  const content = linkOnly.querySelector(".alert__content");
  const link = actions.querySelector("a");
  const inner = linkOnly.querySelector(".alert__inner");
  return {
    h: Math.round(linkOnly.getBoundingClientRect().height),
    contentPad: getComputedStyle(content).padding,
    contentGap: getComputedStyle(content).gap,
    actionsPad: getComputedStyle(actions).padding,
    actionsPT: getComputedStyle(actions).paddingTop,
    titleMB: getComputedStyle(title).marginBottom,
    msgLH: getComputedStyle(msg).lineHeight,
    msgFS: getComputedStyle(msg).fontSize,
    linkFS: getComputedStyle(link).fontSize,
    linkLH: getComputedStyle(link).lineHeight,
    linkH: Math.round(link.getBoundingClientRect().height),
    actionsH: Math.round(actions.getBoundingClientRect().height),
    innerH: Math.round(inner.getBoundingClientRect().height),
    linkClass: link.className,
  };
});
console.log(JSON.stringify({ refLinkOnly: refSp }, null, 2));
await browser.close();
