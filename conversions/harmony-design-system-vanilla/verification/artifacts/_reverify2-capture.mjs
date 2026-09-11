import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = "c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/verification/artifacts";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const scopes = [
  { id: "progress-bar", ref: "http://localhost:4321/components/progress-bar", conv: "http://localhost:5178/components/progress-bar", pageTag: "demo-progress-bar-page", theme: "vp", out: "progress-bar-2" },
  { id: "badges", ref: "http://localhost:4321/components/badges", conv: "http://localhost:5178/components/badges", pageTag: "demo-badges-page", theme: "cp", out: "badge-2" },
  { id: "avatar", ref: "http://localhost:4321/components/avatar", conv: "http://localhost:5178/components/avatar", pageTag: "demo-avatar-page", theme: "cp", out: "avatar-2" },
  { id: "chips", ref: "http://localhost:4321/components/chips", conv: "http://localhost:5178/components/chips", pageTag: "demo-chips-page", theme: "cp", out: "chip-2" },
];

const all = {};

for (const s of scopes) {
  const outDir = join(root, s.out);
  mkdirSync(outDir, { recursive: true });
  const metrics = { scope: s.id, theme: s.theme };

  await page.goto(s.ref, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  await page.evaluate((theme) => {
    const html = document.documentElement;
    for (const c of [...html.classList]) if (c.startsWith("theme-")) html.classList.remove(c);
    html.classList.add("theme-" + theme);
    html.classList.remove("dark");
  }, s.theme);
  await page.waitForTimeout(400);

  metrics.ref = await page.evaluate(() => {
    const h1 = document.querySelector("h1")?.textContent?.trim();
    const h2 = [...document.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const h3 = [...document.querySelectorAll("h3")].map((h) => h.textContent.trim());
    const nav = [...document.querySelectorAll(".article-nav__link")].map((a) => a.textContent.trim());
    const badge = document.querySelector(".page-header .badge, h1 + .badge, .page-header__badges .badge")?.textContent?.trim();
    const hasProps = h2.some((h) => /Props/i.test(h)) || nav.some((n) => /Props/i.test(n));
    const hasA11y = h2.some((h) => /Accessibility/i.test(h)) || nav.some((n) => /Accessibility/i.test(n));
    const badges = [...document.querySelectorAll(".example-section .badge, .example .badge, main .badge")].map((el) => ({
      text: el.textContent.trim().replace(/\s+/g, " "),
      hasIcon: !!el.querySelector("svg, .icon, [class*=icon], img"),
      height: Math.round(el.getBoundingClientRect().height),
      bg: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      border: getComputedStyle(el).border,
      fontSize: getComputedStyle(el).fontSize,
    }));
    // fallback all badges in main
    const allBadges = badges.length ? badges : [...document.querySelectorAll("main .badge, .ds-page .badge, article .badge")].map((el) => ({
      text: el.textContent.trim().replace(/\s+/g, " "),
      hasIcon: !!el.querySelector("svg, .icon, [class*=icon], img"),
      height: Math.round(el.getBoundingClientRect().height),
      bg: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      border: getComputedStyle(el).border,
      fontSize: getComputedStyle(el).fontSize,
    }));
    const avatars = [...document.querySelectorAll(".avatar")].map((el) => ({
      className: el.className,
      h: Math.round(el.getBoundingClientRect().height),
      w: Math.round(el.getBoundingClientRect().width),
      bg: getComputedStyle(el).backgroundColor,
      radius: getComputedStyle(el).borderRadius,
      opacity: getComputedStyle(el).opacity,
    }));
    const chips = [...document.querySelectorAll(".chip")].map((el) => ({
      text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 40),
      h: Math.round(el.getBoundingClientRect().height),
      bg: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
      border: getComputedStyle(el).border,
      fontSize: getComputedStyle(el).fontSize,
      opacity: getComputedStyle(el).opacity,
    }));
    const progress = [...document.querySelectorAll(".progress")].map((el) => {
      const bar = el.querySelector(".progress__bar");
      const r = el.getBoundingClientRect();
      const br = bar?.getBoundingClientRect();
      return {
        h: Math.round(r.height),
        fillPct: br && r.width ? Math.round((br.width / r.width) * 100) : null,
        barBg: bar ? getComputedStyle(bar).backgroundColor : null,
        trackBg: getComputedStyle(el).backgroundColor,
      };
    });
    return { h1, h2, h3, nav, badge, hasProps, hasA11y, badges: allBadges, avatars, chips, progress, badgeCount: allBadges.length };
  });
  await page.screenshot({ path: join(outDir, "ref-light-top.png"), fullPage: false });
  await page.screenshot({ path: join(outDir, "ref-light-full.png"), fullPage: true });

  await page.goto(s.conv, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(700);
  await page.evaluate((theme) => {
    const html = document.documentElement;
    for (const c of [...html.classList]) if (c.startsWith("theme-")) html.classList.remove(c);
    html.classList.add("theme-" + theme);
    html.classList.remove("dark");
    const app = document.querySelector("demo-app");
    if (app) {
      app.setAttribute("product", theme);
      app.removeAttribute("mode");
    }
  }, s.theme);
  await page.evaluate((theme) => {
    const app = document.querySelector("demo-app");
    const hdr = app?.shadowRoot?.querySelector("demo-header");
    const sr = hdr?.shadowRoot;
    if (!sr) return;
    const select = sr.querySelector("select");
    if (select) {
      const opt = [...select.options].find((o) => o.value.toLowerCase() === theme || o.textContent.toLowerCase().includes(theme));
      if (opt) {
        select.value = opt.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    const buttons = [...sr.querySelectorAll("button")];
    const match = buttons.find((b) => (b.textContent || "").trim().toUpperCase() === theme.toUpperCase() || (b.getAttribute("data-product") || "") === theme);
    match?.click();
  }, s.theme);
  await page.waitForTimeout(500);

  metrics.conv = await page.evaluate((pageTag) => {
    const app = document.querySelector("demo-app");
    const pageEl = app?.shadowRoot?.querySelector(pageTag) || document.querySelector(pageTag);
    const root = pageEl?.shadowRoot;
    if (!root) return { error: "no page " + pageTag };
    const h1 = root.querySelector("h1")?.textContent?.trim();
    const h2 = [...root.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const hasApi = h2.some((h) => /^(API|Props)$/i.test(h));
    const hasA11y = h2.some((h) => /Accessibility/i.test(h));
    const tables = root.querySelectorAll("table").length;
    const a11yEl = [...root.querySelectorAll("h2")].find((h) => /Accessibility/i.test(h.textContent.trim()));
    const a11yText = a11yEl?.nextElementSibling?.textContent?.trim()?.slice(0, 400) || null;
    const apiEl = [...root.querySelectorAll("h2")].find((h) => /^(API|Props)$/i.test(h.textContent.trim()));
    const apiRows = apiEl ? [...(apiEl.nextElementSibling?.querySelectorAll("tbody tr") || [])].map((tr) => tr.textContent.trim().replace(/\s+/g, " ")) : [];

    const badges = [...root.querySelectorAll("harmony-badge")].map((el) => {
      const sr = el.shadowRoot;
      const host = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const icon = sr?.querySelector('[part="icon"], harmony-icon');
      return {
        text: el.textContent.trim().replace(/\s+/g, " "),
        variant: el.getAttribute("variant"),
        size: el.getAttribute("size"),
        iconAttr: el.getAttribute("icon"),
        hasIcon: !!icon,
        height: Math.round(r.height),
        bg: host.backgroundColor,
        color: host.color,
        border: host.border,
        fontSize: host.fontSize,
      };
    });

    const avatars = [...root.querySelectorAll("harmony-avatar")].map((el) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        size: el.getAttribute("size"),
        variant: el.getAttribute("variant"),
        interactive: el.hasAttribute("interactive"),
        disabled: el.hasAttribute("disabled"),
        h: Math.round(r.height),
        w: Math.round(r.width),
        bg: st.backgroundColor,
        radius: st.borderRadius,
        opacity: st.opacity,
      };
    });

    const chips = [...root.querySelectorAll("harmony-chip")].map((el) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 40),
        size: el.getAttribute("size"),
        variant: el.getAttribute("variant"),
        type: el.getAttribute("type"),
        selected: el.hasAttribute("selected"),
        removable: el.hasAttribute("removable"),
        disabled: el.hasAttribute("disabled"),
        icon: el.getAttribute("icon"),
        h: Math.round(r.height),
        bg: st.backgroundColor,
        color: st.color,
        border: st.border,
        opacity: st.opacity,
        fontSize: st.fontSize,
      };
    });

    const progress = [...root.querySelectorAll("harmony-progress")].map((el) => {
      const sr = el.shadowRoot;
      const track = sr?.querySelector('[part="track"]');
      const bar = sr?.querySelector('[part="bar"]');
      const label = sr?.querySelector('[part="label"]');
      const tr = track?.getBoundingClientRect();
      const br = bar?.getBoundingClientRect();
      return {
        value: el.getAttribute("value"),
        size: el.getAttribute("size"),
        variant: el.getAttribute("variant"),
        showLabel: el.hasAttribute("show-label"),
        h: tr ? Math.round(tr.height) : null,
        fillPct: br && tr?.width ? Math.round((br.width / tr.width) * 100) : null,
        barBg: bar ? getComputedStyle(bar).backgroundColor : null,
        trackBg: track ? getComputedStyle(track).backgroundColor : null,
        label: label && !label.hidden ? label.textContent.trim() : null,
      };
    });

    const iconSection = [...root.querySelectorAll("h2")].find((h) => /icon/i.test(h.textContent));
    let iconSectionTexts = [];
    if (iconSection) {
      const ex = iconSection.nextElementSibling;
      iconSectionTexts = [...(ex?.querySelectorAll("harmony-badge") || [])].map((b) => ({
        text: b.textContent.trim(),
        icon: b.getAttribute("icon"),
        size: b.getAttribute("size"),
        variant: b.getAttribute("variant"),
        height: Math.round(b.getBoundingClientRect().height),
      }));
    }

    return {
      h1,
      h2,
      hasApi,
      hasA11y,
      tables,
      apiRows,
      a11yText,
      badges,
      avatars,
      chips,
      progress,
      badgeCount: badges.length,
      iconSectionTexts,
      themeClass: document.documentElement.className,
    };
  }, s.pageTag);

  await page.screenshot({ path: join(outDir, "conv-light-top.png"), fullPage: false });
  await page.screenshot({ path: join(outDir, "conv-light-full.png"), fullPage: true });

  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
    const app = document.querySelector("demo-app");
    if (app) app.setAttribute("mode", "dark");
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, "conv-dark-top.png"), fullPage: false });

  const context2 = await browser.newContext({ forcedColors: "active", colorScheme: "dark", viewport: { width: 1280, height: 900 } });
  const p2 = await context2.newPage();
  await p2.goto(s.conv, { waitUntil: "networkidle", timeout: 60000 });
  await p2.waitForTimeout(600);
  await p2.screenshot({ path: join(outDir, "conv-forced-colors-top.png"), fullPage: false });
  await context2.close();

  writeFileSync(join(outDir, "capture-metrics.json"), JSON.stringify(metrics, null, 2));
  all[s.id] = {
    refH2: metrics.ref.h2,
    convH2: metrics.conv.h2,
    refHasProps: metrics.ref.hasProps,
    refHasA11y: metrics.ref.hasA11y,
    convHasApi: metrics.conv.hasApi,
    convHasA11y: metrics.conv.hasA11y,
    convTables: metrics.conv.tables,
    badgeCounts: { ref: metrics.ref.badgeCount, conv: metrics.conv.badgeCount },
    iconSection: metrics.conv.iconSectionTexts,
    progressSample: { ref: metrics.ref.progress?.slice(0, 4), conv: metrics.conv.progress?.slice(0, 4) },
    avatarSample: { ref: metrics.ref.avatars?.slice(0, 3), conv: metrics.conv.avatars?.slice(0, 3) },
    chipSample: { ref: metrics.ref.chips?.slice(0, 3), conv: metrics.conv.chips?.slice(0, 3) },
    a11yText: metrics.conv.a11yText,
    apiRows: metrics.conv.apiRows,
  };
  console.log("OK", s.id);
  console.log(JSON.stringify(all[s.id], null, 2));
}

writeFileSync(join(root, "reverify-2-summary.json"), JSON.stringify(all, null, 2));
await browser.close();
console.log("DONE");
