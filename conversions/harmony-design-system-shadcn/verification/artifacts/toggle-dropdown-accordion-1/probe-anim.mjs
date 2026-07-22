import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:5177/components/accordion', {
  waitUntil: 'networkidle',
  timeout: 60000,
});

const info = await page.evaluate(() => {
  const sampleRules = [];
  let foundKeyframes = false;
  let foundUtility = false;
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const rule of rules) {
      const text = rule.cssText || '';
      if (text.includes('accordion-down') || text.includes('accordion-up')) {
        sampleRules.push(text.slice(0, 240));
        if (text.includes('@keyframes')) foundKeyframes = true;
        if (text.includes('animate-accordion')) foundUtility = true;
      }
    }
  }
  const els = [...document.querySelectorAll('[class*="animate-accordion"]')]
    .slice(0, 3)
    .map((el) => el.className);
  return { foundKeyframes, foundUtility, sampleRules: sampleRules.slice(0, 10), els };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
