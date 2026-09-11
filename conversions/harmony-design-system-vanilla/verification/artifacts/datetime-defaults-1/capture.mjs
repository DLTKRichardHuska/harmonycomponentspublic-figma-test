import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const outDir = "conversions/harmony-design-system-vanilla/verification/artifacts/datetime-defaults-1";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:5178/components/date-picker", { waitUntil: "networkidle", timeout: 60000 });
await delay(800);

const result = await page.evaluate(async () => {
  const { setDateTimeDefaults, getDateValue, setDateValue, getDateTimeDefaults } = await import(
    "/@fs/C:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/packages/ui/src/datetime/index.js"
  );
  function walk(root, pred) {
    const hit = [...root.querySelectorAll("*")].find(pred);
    if (hit) return hit;
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) {
        const nested = walk(el.shadowRoot, pred);
        if (nested) return nested;
      }
    }
    return null;
  }

  const field = walk(document, (el) => el.id === "field-as-date");
  const datePicker = walk(document, (el) => el.id === "date-basic");
  const timePicker = walk(document, (el) => el.id === "time-24");
  const pageTag = document.querySelector("demo-app")?.shadowRoot?.querySelector("demo-date-picker-page")?.tagName || null;

  const before = {
    defaults: getDateTimeDefaults(),
    fieldValue: field?.value || null,
    found: { field: Boolean(field), datePicker: Boolean(datePicker), timePicker: Boolean(timePicker), pageTag },
  };

  if (field) {
    field.valueAsDate = new Date(2024, 0, 15);
  }
  const afterSet = {
    machine: field?.value || null,
    asDate: field?.valueAsDate?.toISOString?.() || null,
    helper: getDateValue(field)?.toISOString?.() || null,
  };

  if (datePicker) setDateValue(datePicker, new Date(2024, 5, 1));
  if (timePicker) setDateValue(timePicker, new Date(1970, 0, 1, 9, 45));

  setDateTimeDefaults({ locale: "fr-FR", timeFormat: "12" });
  await new Promise((r) => setTimeout(r, 50));

  return {
    before,
    afterSet,
    pickerDate: datePicker?.value || null,
    pickerTime: timePicker?.value || null,
    defaultsAfter: getDateTimeDefaults(),
    timeFormatResolved: timePicker?.format || null,
    fieldLocale: field?.locale || null,
  };
});
writeFileSync(join(outDir, "probe.json"), JSON.stringify({ result, errors }, null, 2));
await browser.close();
console.log(JSON.stringify({ result, errors }, null, 2));
