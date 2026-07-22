import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const art = __dirname;
mkdirSync(art, { recursive: true });

async function applyCpLight(page) {
  await page.evaluate(() => {
    localStorage.setItem("theme", "light");
    localStorage.setItem("colorTheme", "cp");
    localStorage.setItem("harmony-theme", "cp");
    localStorage.setItem("harmony-mode", "light");
    document.documentElement.classList.remove(
      "dark",
      "theme-cp",
      "theme-vp",
      "theme-ppm",
      "theme-maconomy",
    );
    document.documentElement.classList.add("theme-cp");
    document.documentElement.dataset.theme = "cp";
    document.documentElement.dataset.mode = "light";
  });
}

async function ensureCpLightUi(page) {
  const buttons = page.locator("button, [role='button'], select");
  const count = await buttons.count();
  for (let i = 0; i < Math.min(count, 40); i++) {
    const t = ((await buttons.nth(i).textContent().catch(() => "")) || "").trim();
    if (/^CP$/i.test(t)) {
      await buttons.nth(i).click().catch(() => {});
      break;
    }
  }
  await page.waitForTimeout(200);
}

async function inventory(page) {
  return page.evaluate(() => {
    const main = document.querySelector("article") || document.querySelector("main") || document.body;
    const h1 = main.querySelector("h1")?.textContent?.trim() || "";
    const h2s = [...main.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const h3s = [...main.querySelectorAll("h3")].map((h) => h.textContent.trim());
    const a11yRoot = main.querySelector("#accessibility");
    const a11yTitles = a11yRoot
      ? [...a11yRoot.querySelectorAll("h3, h4")].map((h) => h.textContent.trim())
      : [];
    return { h1, h2s, h3s, a11yTitles };
  });
}

async function probeListMenu(page) {
  return page.evaluate(() => {
    const lists = [...document.querySelectorAll(".list-menu, .MuiList-root")].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 80 && r.height > 40;
    });
    const samples = lists.slice(0, 4).map((list) => {
      const cs = getComputedStyle(list);
      const items = [
        ...list.querySelectorAll(".list-menu__item, .MuiListItemButton-root"),
      ];
      const first = items[0];
      const firstCs = first ? getComputedStyle(first) : null;
      const selected = items.find(
        (i) =>
          i.classList.contains("is-active") ||
          i.classList.contains("Mui-selected"),
      );
      const selectedCs = selected ? getComputedStyle(selected) : null;
      return {
        w: Math.round(list.getBoundingClientRect().width),
        h: Math.round(list.getBoundingClientRect().height),
        border: cs.border,
        radius: cs.borderRadius,
        bg: cs.backgroundColor,
        itemCount: items.length,
        firstPad: firstCs
          ? `${firstCs.paddingTop} ${firstCs.paddingRight} ${firstCs.paddingBottom} ${firstCs.paddingLeft}`
          : null,
        firstFont: firstCs?.fontSize || null,
        selectedBg: selectedCs?.backgroundColor || null,
        selectedColor: selectedCs?.color || null,
      };
    });
    return { listCount: lists.length, samples };
  });
}

async function captureSide(label, url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await applyCpLight(page);
  await page.reload({ waitUntil: "networkidle" });
  await applyCpLight(page);
  await ensureCpLightUi(page);
  await page.waitForTimeout(400);

  writeFileSync(join(art, `${label}-page-top.png`), await page.screenshot({ type: "png" }));
  writeFileSync(join(art, `${label}-inventory.json`), JSON.stringify(await inventory(page), null, 2));
  writeFileSync(join(art, `${label}-probe.json`), JSON.stringify(await probeListMenu(page), null, 2));

  const groups = page.locator(
    ".example-section, [class*='DemoExampleGroup'], section:has(h3)",
  );
  const groupCount = await groups.count();
  const titles = [];
  for (let i = 0; i < Math.min(groupCount, 8); i++) {
    const g = groups.nth(i);
    const title =
      (
        (await g.locator("h3, h4").first().textContent().catch(() => "")) || ""
      ).trim() || `group-${i}`;
    titles.push(title);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    await g.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(150);
    try {
      writeFileSync(
        join(art, `${label}-${slug || i}.png`),
        await g.screenshot({ type: "png", animations: "disabled" }),
      );
    } catch (e) {
      console.log("group shot fail", label, title, e.message.split("\n")[0]);
    }
  }
  writeFileSync(join(art, `${label}-group-titles.json`), JSON.stringify(titles, null, 2));

  await browser.close();
  console.log("done", label, "groups", titles.length);
}

await captureSide("ref", "http://localhost:4321/components/list-menu");
await captureSide("conv", "http://localhost:5176/components/list-menu");
console.log("artifacts", art);
