import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:4321/components/alerts", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const ref = await page.evaluate(() => {
  const alerts = [...document.querySelectorAll(".alert")].map((el, i) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const title = el.querySelector(".alert__title");
    const msg = el.querySelector(".alert__message");
    const actions = el.querySelector(".alert__actions");
    const border = el.querySelector(".alert__border");
    const progress = el.querySelector(".progress");
    const close = el.querySelector(".alert__close");
    const icon = el.querySelector(".alert__icon");
    const as = actions ? getComputedStyle(actions) : null;
    const mr = msg?.getBoundingClientRect();
    const link = actions?.querySelector("a");
    const lr = link?.getBoundingClientRect();
    const btn = actions?.querySelector("button, .btn");
    const br = btn?.getBoundingClientRect();
    return {
      i, className: el.className, role: el.getAttribute("role"),
      h: Math.round(r.height), bg: s.backgroundColor, radius: s.borderRadius,
      pad: s.padding, shadow: s.boxShadow !== "none",
      borderEl: !!border,
      borderW: border ? Math.round(border.getBoundingClientRect().width) : 0,
      borderBg: border ? getComputedStyle(border).backgroundColor : null,
      title: title?.textContent?.trim() || null,
      msg: (msg?.textContent || "").trim().slice(0, 60),
      actions: !!actions && actions.children.length > 0,
      actionsPadL: as?.paddingLeft, actionsMT: as?.marginTop, actionsGap: as?.gap,
      linkDelta: lr && mr ? Math.round(lr.left - mr.left) : null,
      btnDelta: br && mr ? Math.round(br.left - mr.left) : null,
      progress: !!progress,
      progressH: progress ? Math.round(progress.getBoundingClientRect().height) : null,
      close: !!close,
      iconColor: icon ? getComputedStyle(icon).color : null,
    };
  });
  return {
    h1: document.querySelector("h1")?.textContent?.trim(),
    desc: document.querySelector(".page-header__description")?.textContent?.trim(),
    badge: document.querySelector(".badge")?.textContent?.trim(),
    h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    examples: [...document.querySelectorAll(".example-section__title, .example__title")].map((h) => h.textContent.trim()),
    nav: [...document.querySelectorAll(".article-nav__link")].map((a) => a.textContent.trim()),
    a11y: document.querySelector("#accessibility")?.innerText?.slice(0, 200),
    alerts,
  };
});

await page.goto("http://localhost:5178/components/alerts", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const conv = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const pageEl = app?.shadowRoot?.querySelector("demo-alerts-page") || document.querySelector("demo-alerts-page");
  const root = pageEl?.shadowRoot;
  if (!root) return { error: "missing page" };
  const alerts = [...root.querySelectorAll("harmony-alert")].map((el, i) => {
    const sr = el.shadowRoot;
    const body = sr?.querySelector(".alert__body");
    const s = getComputedStyle(body || el);
    const r = el.getBoundingClientRect();
    const border = sr?.querySelector('[part="border"]');
    const title = sr?.querySelector('[part="title"]');
    const msg = sr?.querySelector('[part="message"]');
    const actions = sr?.querySelector('[part="actions"]');
    const progress = sr?.querySelector('[part="progress"]');
    const close = sr?.querySelector('[part="close"]');
    const icon = sr?.querySelector('[part="icon"]');
    const as = actions ? getComputedStyle(actions) : null;
    const mr = msg?.getBoundingClientRect();
    const slot = sr?.querySelector('slot[name="actions"]');
    const assigned = slot?.assignedElements?.({ flatten: true }) || [];
    const link = assigned.flatMap((n) => (n.tagName === "A" ? [n] : [...(n.querySelectorAll?.("a") || [])]))[0];
    const btn = assigned.flatMap((n) =>
      n.tagName === "HARMONY-BUTTON" ? [n] : [...(n.querySelectorAll?.("harmony-button,button,.btn") || [])],
    )[0];
    const lr = link?.getBoundingClientRect();
    const br = btn?.getBoundingClientRect();
    const bar = progress?.querySelector("harmony-progress");
    const bs = border ? getComputedStyle(border) : null;
    return {
      i,
      attrs: Object.fromEntries(["variant", "enhanced", "title", "dismissible", "progress-value", "icon"].map((a) => [a, el.getAttribute(a)])),
      h: Math.round(r.height),
      bg: s.backgroundColor,
      radius: s.borderRadius,
      pad: s.padding,
      shadow: s.boxShadow !== "none",
      hostDisplay: getComputedStyle(el).display,
      borderEl: !!border && bs?.display !== "none",
      borderW: border ? Math.round(border.getBoundingClientRect().width) : 0,
      borderBg: bs?.backgroundColor || null,
      title: title && !title.hidden ? title.textContent.trim() : null,
      msg: (msg?.textContent || "").trim().slice(0, 60),
      actions: actions && !actions.hasAttribute("data-empty"),
      actionsPadL: as?.paddingLeft,
      actionsMT: as?.marginTop,
      actionsGap: as?.gap,
      linkDelta: lr && mr ? Math.round(lr.left - mr.left) : null,
      btnDelta: br && mr ? Math.round(br.left - mr.left) : null,
      progress: progress && !progress.hidden,
      progressH: bar ? Math.round(bar.getBoundingClientRect().height) : null,
      progressAttrs: bar
        ? { value: bar.getAttribute("value"), size: bar.getAttribute("size"), variant: bar.getAttribute("variant") }
        : null,
      close: close && !close.hidden,
      closeAria: close?.getAttribute("aria-label"),
      iconName: icon?.getAttribute("name"),
      roleHost: el.getAttribute("role"),
    };
  });

  const test = document.createElement("harmony-alert");
  test.setAttribute("variant", "info");
  test.setAttribute("title", "T");
  test.setAttribute("dismissible", "");
  test.textContent = "x";
  document.body.appendChild(test);
  let fired = false,
    composed = false,
    bubbles = false;
  test.addEventListener("dismiss", (e) => {
    fired = true;
    composed = e.composed;
    bubbles = e.bubbles;
  });
  test.shadowRoot.querySelector('[part="close"]')?.click();
  const stillThere = document.body.contains(test);
  test.remove();

  return {
    h1: root.querySelector("h1")?.textContent?.trim(),
    desc: root.querySelector("p")?.textContent?.trim(),
    h2: [...root.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    hasConsume: !!root.querySelector("demo-consume-snippets"),
    apiTable: [...root.querySelectorAll("table tbody tr")].map((tr) => tr.innerText.replace(/\s+/g, " ").trim()),
    a11y: [...root.querySelectorAll("h2")]
      .find((h) => h.textContent.includes("Accessibility"))
      ?.nextElementSibling?.innerText?.slice(0, 300),
    alerts,
    dismiss: { fired, composed, bubbles, stillThere },
    publicAlertClass: !!document.querySelector(".alert"),
  };
});

await page.evaluate(() => document.documentElement.classList.remove("dark"));
const client = await page.context().newCDPSession(page);
await client.send("Emulation.setEmulatedMedia", {
  features: [{ name: "forced-colors", value: "active" }],
});
await page.waitForTimeout(300);
const fc = await page.evaluate(() => {
  const app = document.querySelector("demo-app");
  const root = app?.shadowRoot?.querySelector("demo-alerts-page")?.shadowRoot;
  const els = [...(root?.querySelectorAll("harmony-alert") || [])];
  const probe = (target) => {
    if (!target) return null;
    const sr = target.shadowRoot;
    const body = sr.querySelector(".alert__body");
    const border = sr.querySelector('[part="border"]');
    const close = sr.querySelector('[part="close"]');
    const title = sr.querySelector('[part="title"]');
    const msg = sr.querySelector('[part="message"]');
    return {
      bodyBorder: getComputedStyle(body).border,
      bodyBg: getComputedStyle(body).backgroundColor,
      titleColor: title ? getComputedStyle(title).color : null,
      msgColor: msg ? getComputedStyle(msg).color : null,
      borderDisplay: border ? getComputedStyle(border).display : null,
      borderBg: border ? getComputedStyle(border).backgroundColor : null,
      closeVisible: close && !close.hidden ? getComputedStyle(close).visibility : null,
    };
  };
  return {
    basic: probe(els[0]),
    enhanced: probe(els.find((e) => e.hasAttribute("enhanced"))),
  };
});

console.log(JSON.stringify({ ref, conv, fc }, null, 2));
await browser.close();
