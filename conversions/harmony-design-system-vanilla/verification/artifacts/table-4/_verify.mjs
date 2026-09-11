import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function setup(page, url, isConv) {
  await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    [...document.documentElement.classList].forEach(c => { if (c.startsWith('theme-')) document.documentElement.classList.remove(c); });
    document.documentElement.classList.add('theme-cp');
    document.querySelector('demo-app')?.setAttribute('product', 'cp');
  });
  await delay(900);
}

function deepAll(root, sel) {
  const out = [];
  const walk = (node) => {
    if (!node?.querySelectorAll) return;
    out.push(...node.querySelectorAll(sel));
    for (const el of node.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
  };
  walk(root);
  return out;
}

async function inventory(page, isConv) {
  return page.evaluate(({ isConv }) => {
    const deepAll = (root, sel) => {
      const out = [];
      const walk = (node) => {
        if (!node?.querySelectorAll) return;
        out.push(...node.querySelectorAll(sel));
        for (const el of node.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
      };
      walk(root);
      return out;
    };
    const host = isConv ? document.querySelector('demo-tables-page') : document;
    const root = isConv ? (host?.shadowRoot || document) : document;
    const h1 = (isConv ? root.querySelector('demo-page-header')?.getAttribute('title') : document.querySelector('h1')?.textContent?.trim()) || document.querySelector('h1')?.textContent?.trim();
    const h2s = deepAll(root, 'h2').map(h => (h.textContent || '').trim());
    const h3s = deepAll(root, 'h3').map(h => (h.textContent || '').trim());

    // Native first table badges
    const tables = deepAll(root, 'table');
    const firstTable = tables[0];
    const badges = [...(firstTable?.querySelectorAll('harmony-badge, .badge') || [])].map((b) => {
      const r = b.getBoundingClientRect();
      const part = b.shadowRoot?.querySelector('[part="root"], .badge') || b;
      const s = getComputedStyle(part);
      return {
        tag: b.tagName,
        text: (b.textContent || '').trim(),
        variant: b.getAttribute('variant') || [...b.classList].find(c => c.startsWith('badge--')) || null,
        w: Math.round(r.width), h: Math.round(r.height),
        bg: s.backgroundColor, color: s.color, radius: s.borderRadius,
      };
    });

    // Striped total row
    const striped = deepAll(root, 'table.table--striped')[0] || tables.find(t => t.classList.contains('table--striped'));
    let totalRow = null;
    if (striped) {
      const tr = striped.querySelector('tr.table-row--total');
      if (tr) {
        const s = getComputedStyle(tr);
        const expected = getComputedStyle(document.documentElement).getPropertyValue('--table-total-bg').trim();
        totalRow = {
          text: tr.innerText.replace(/\s+/g, ' ').slice(0, 80),
          bg: s.backgroundColor,
          expectedVar: expected,
          fontWeight: s.fontWeight,
        };
      }
    }

    // Interactive: find table with Actions header or avatars
    let interactive = null;
    for (const t of tables) {
      const ths = [...t.querySelectorAll('thead th')].map(th => (th.textContent || '').trim());
      if (ths.some(t => /Actions|Employee/i.test(t)) || t.querySelector('harmony-avatar, .avatar')) {
        const avatars = [...t.querySelectorAll('harmony-avatar, .avatar')].map(a => ({
          initials: a.getAttribute('initials') || (a.textContent || '').trim().slice(0, 4),
          w: Math.round(a.getBoundingClientRect().width),
          h: Math.round(a.getBoundingClientRect().height),
        }));
        const emails = [...t.querySelectorAll('td')].map(td => td.innerText).filter(x => /@/.test(x));
        const actionBtns = [...t.querySelectorAll('button[aria-label*="Actions"], .btn--ghost')].length;
        interactive = {
          headers: ths,
          rowCount: t.querySelectorAll('tbody tr').length,
          avatars,
          emails: emails.slice(0, 5),
          hasActionsCol: ths.some(h => /Actions/i.test(h)),
          actionBtns,
        };
        break;
      }
    }

    // Usage / a11y
    const usageH = h2s.find(h => /Usage/i.test(h));
    const bestPractices = h3s.some(h => /Best practice/i.test(h));
    const a11y = h2s.some(h => /Accessibility/i.test(h)) || h3s.some(h => /Accessibility/i.test(h));
    let usageSnippet = null;
    if (usageH) {
      const el = deepAll(root, 'h2').find(h => /Usage/i.test(h.textContent || ''));
      const next = el?.nextElementSibling;
      usageSnippet = (next?.innerText || '').slice(0, 500);
    }

    // Costpoint callout
    const callouts = deepAll(root, 'demo-callout, .callout').map(c => (c.innerText || '').slice(0, 120));

    return {
      title: document.title,
      h1,
      h2s,
      h3s,
      badges,
      totalRow,
      interactive,
      usage: { heading: !!usageH, bestPractices, a11y, snippet: usageSnippet },
      callouts,
      tableCount: tables.length,
      scrollH: document.documentElement.scrollHeight,
    };
  }, { isConv });
}

async function clipByHeading(page, isConv, headingRe, outPath) {
  const box = await page.evaluate(({ isConv, headingRe }) => {
    const deepAll = (root, sel) => {
      const out = [];
      const walk = (node) => {
        if (!node?.querySelectorAll) return;
        out.push(...node.querySelectorAll(sel));
        for (const el of node.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
      };
      walk(root);
      return out;
    };
    const host = isConv ? document.querySelector('demo-tables-page') : document;
    const root = isConv ? (host?.shadowRoot || document) : document;
    const re = new RegExp(headingRe, 'i');
    const h = deepAll(root, 'h2, h3').find(el => re.test(el.textContent || ''));
    if (!h) return null;
    h.scrollIntoView({ block: 'start' });
    const r = h.getBoundingClientRect();
    // include following example
    let end = r.bottom + 420;
    let n = h.nextElementSibling;
    if (n) {
      const nr = n.getBoundingClientRect();
      end = Math.max(end, nr.bottom + 24);
    }
    return {
      x: Math.max(0, Math.floor(r.left - 8)),
      y: Math.max(0, Math.floor(r.top - 8)),
      width: Math.min(1200, Math.floor(Math.max(r.width, 900))),
      height: Math.min(900, Math.floor(end - r.top + 16)),
    };
  }, { isConv, headingRe });
  await delay(200);
  if (box && box.height > 40) {
    // recompute after scroll
    const box2 = await page.evaluate(({ isConv, headingRe }) => {
      const deepAll = (root, sel) => {
        const out = [];
        const walk = (node) => {
          if (!node?.querySelectorAll) return;
          out.push(...node.querySelectorAll(sel));
          for (const el of node.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
        };
        walk(root);
        return out;
      };
      const host = isConv ? document.querySelector('demo-tables-page') : document;
      const root = isConv ? (host?.shadowRoot || document) : document;
      const re = new RegExp(headingRe, 'i');
      const h = deepAll(root, 'h2, h3').find(el => re.test(el.textContent || ''));
      if (!h) return null;
      const r = h.getBoundingClientRect();
      let end = r.bottom + 420;
      let n = h.nextElementSibling;
      if (n) end = Math.max(end, n.getBoundingClientRect().bottom + 24);
      return {
        x: Math.max(0, Math.floor(8)),
        y: Math.max(0, Math.floor(r.top - 8)),
        width: 1240,
        height: Math.min(880, Math.floor(end - r.top + 24)),
      };
    }, { isConv, headingRe });
    if (box2) await page.screenshot({ path: outPath, clip: box2 });
    else await page.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath });
  }
}

const results = {};

for (const [role, url, isConv] of [
  ['ref', 'http://localhost:4321/components/tables', false],
  ['conv', 'http://localhost:5178/components/tables', true],
]) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await setup(page, url, isConv);
  await page.screenshot({ path: `${outDir}/${role}-top.png`, fullPage: false });
  await page.screenshot({ path: `${outDir}/${role}-full.png`, fullPage: true });
  results[role] = await inventory(page, isConv);
  for (const [name, re] of [
    ['native-gray', 'Native.*gray|Default.*Gray|gray header'],
    ['striped', 'striped|white header|Striped'],
    ['interactive', 'Interactive'],
    ['usage', 'Usage'],
  ]) {
    await clipByHeading(page, isConv, re, `${outDir}/${role}-${name}.png`);
  }
  await page.close();
  console.log('OK', role, JSON.stringify({
    h2: results[role].h2s,
    badges: results[role].badges?.length,
    total: results[role].totalRow,
    interactive: results[role].interactive,
    usage: results[role].usage,
  }));
}

writeFileSync(`${outDir}/compare.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log('done');
