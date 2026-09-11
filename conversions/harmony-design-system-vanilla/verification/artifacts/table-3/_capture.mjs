import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 1000 } });

async function applyCpLight(page, isConv) {
  await page.evaluate(() => {
    const html = document.documentElement;
    [...html.classList].forEach((c) => {
      if (c.startsWith('theme-') || c === 'dark') html.classList.remove(c);
    });
    html.classList.add('theme-cp');
  });
  if (isConv) {
    await page.evaluate(() => {
      const app = document.querySelector('demo-app');
      if (app) app.setAttribute('product', 'cp');
      localStorage.setItem('harmony-demo-product', 'cp');
    });
  }
  await delay(400);
}

function deepQueryAll(root, sel) {
  const out = [];
  const walk = (node) => {
    if (!node) return;
    if (node.querySelectorAll) {
      out.push(...node.querySelectorAll(sel));
      for (const el of node.querySelectorAll('*')) {
        if (el.shadowRoot) walk(el.shadowRoot);
      }
    }
  };
  walk(root);
  return out;
}

async function inventory(page, role) {
  return page.evaluate(({ role }) => {
    const deepQueryAll = (root, sel) => {
      const out = [];
      const walk = (node) => {
        if (!node) return;
        if (node.querySelectorAll) {
          out.push(...node.querySelectorAll(sel));
          for (const el of node.querySelectorAll('*')) {
            if (el.shadowRoot) walk(el.shadowRoot);
          }
        }
      };
      walk(root);
      return out;
    };

    const pageHost =
      document.querySelector('demo-tables-page') ||
      document.querySelector('article') ||
      document.body;
    const root = pageHost.shadowRoot || pageHost;

    const h1 = (deepQueryAll(document, 'h1')[0]?.textContent || '').trim();
    const headings = deepQueryAll(root, 'h2, h3, .example-section__title, .example__title').map((h) =>
      (h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
    );

    const tables = deepQueryAll(root, 'table, harmony-table').map((el, i) => {
      const r = el.getBoundingClientRect();
      const tag = el.tagName.toLowerCase();
      let nestedTable = tag === 'harmony-table' ? el.querySelector('table') : el;
      const thead = nestedTable?.querySelector('thead');
      const tbody = nestedTable?.querySelector('tbody');
      const rows = tbody ? [...tbody.querySelectorAll(':scope > tr')] : [];
      const headers = thead
        ? [...thead.querySelectorAll('th')].map((th) => (th.textContent || '').trim().slice(0, 40))
        : [];
      // chips / badges in cells
      const chips = nestedTable
        ? [...nestedTable.querySelectorAll('harmony-chip, .badge, .chip, [class*="badge"]')].map((c) =>
            (c.textContent || '').trim().slice(0, 30),
          )
        : [];
      const textSample = (nestedTable?.innerText || el.innerText || '').replace(/\s+/g, ' ').slice(0, 220);
      const hasStub =
        /COLUMN|Table body content/i.test(textSample) ||
        /COLUMN|Table body content/i.test(el.innerHTML || '');
      const checkboxes = nestedTable
        ? nestedTable.querySelectorAll('harmony-checkbox, input[type=checkbox], .checkbox').length
        : 0;
      const grips = nestedTable
        ? nestedTable.querySelectorAll('.table__grip, [class*="grip"], button[aria-label*="Reorder" i]').length
        : el.querySelectorAll('.table__grip, [class*="grip"]').length;
      const expanders = nestedTable
        ? nestedTable.querySelectorAll('[data-has-children], .table__expand, button[aria-expanded]').length
        : 0;
      const classes = (nestedTable || el).className?.toString?.() || '';
      const attrs =
        tag === 'harmony-table'
          ? {
              reorderable: el.hasAttribute('reorderable'),
              grouped: el.hasAttribute('grouped'),
              striped: el.hasAttribute('striped'),
              variant: el.getAttribute('variant'),
              columns: !!el.getAttribute('columns'),
            }
          : null;
      return {
        i,
        tag,
        w: Math.round(r.width),
        h: Math.round(r.height),
        visible: r.width > 20 && r.height > 20,
        rowCount: rows.length,
        headers,
        chips,
        checkboxes,
        grips,
        expanders,
        hasStub,
        classes: classes.slice(0, 80),
        attrs,
        textSample,
        hasThead: !!thead,
        hasTbody: !!tbody,
        nestedTable: !!nestedTable && tag === 'harmony-table',
      };
    });

    const bodyText = (root.innerText || '').replace(/\s+/g, ' ');
    const hasCostpointCallout = /TableCostpointGrid|Costpoint/i.test(bodyText);
    const hasAccessibility = /Accessibility/i.test(bodyText);
    const hasUsage = /Usage Guidelines|Best Practices/i.test(bodyText);
    const stubMentions = (bodyText.match(/COLUMN|Table body content/gi) || []).length;

    const main =
      document.querySelector('main') ||
      document.querySelector('[part="main"]') ||
      document.body;
    const mainR = main.getBoundingClientRect();

    return {
      role,
      href: location.href,
      h1,
      headings,
      scrollHeight: document.documentElement.scrollHeight,
      mainH: Math.round(mainR.height),
      tableCount: tables.length,
      tables,
      hasCostpointCallout,
      hasAccessibility,
      hasUsage,
      stubMentions,
      textLen: bodyText.length,
    };
  }, { role });
}

async function captureRole(role, url, isConv) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyCpLight(page, isConv);
  await delay(800);

  const inv = await inventory(page, role);
  writeFileSync(`${outDir}/${role}-inventory.json`, JSON.stringify(inv, null, 2));

  await page.screenshot({ path: `${outDir}/${role}-full.png`, fullPage: true });
  await page.screenshot({ path: `${outDir}/${role}-top.png`, fullPage: false });

  // Section screenshots by h2 text
  const sectionLabels = await page.evaluate(() => {
    const deepQueryAll = (root, sel) => {
      const out = [];
      const walk = (node) => {
        if (!node) return;
        if (node.querySelectorAll) {
          out.push(...node.querySelectorAll(sel));
          for (const el of node.querySelectorAll('*')) {
            if (el.shadowRoot) walk(el.shadowRoot);
          }
        }
      };
      walk(root);
      return out;
    };
    const pageHost = document.querySelector('demo-tables-page') || document.querySelector('article') || document.body;
    const root = pageHost.shadowRoot || pageHost;
    return deepQueryAll(root, 'h2').map((h) => (h.textContent || '').trim().slice(0, 80));
  });

  const shotSections = [
    /native.*gray|Default Table with Gray/i,
    /striped|white header|Alternating/i,
    /Interactive|selection|Actions/i,
    /Reorderable/i,
    /Grouped/i,
    /Sortable/i,
    /Filter|Title Bar|Action Bar/i,
    /Command Center/i,
    /Accessibility|Usage/i,
  ];

  for (const re of shotSections) {
    const label = sectionLabels.find((t) => re.test(t));
    if (!label) continue;
    const safe = label.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 50);
    await page.evaluate((text) => {
      const deepQueryAll = (root, sel) => {
        const out = [];
        const walk = (node) => {
          if (!node) return;
          if (node.querySelectorAll) {
            out.push(...node.querySelectorAll(sel));
            for (const el of node.querySelectorAll('*')) {
              if (el.shadowRoot) walk(el.shadowRoot);
            }
          }
        };
        walk(root);
        return out;
      };
      const pageHost = document.querySelector('demo-tables-page') || document.querySelector('article') || document.body;
      const root = pageHost.shadowRoot || pageHost;
      const h = deepQueryAll(root, 'h2').find((el) => (el.textContent || '').trim() === text);
      h?.scrollIntoView({ block: 'start' });
    }, label);
    await delay(350);
    await page.screenshot({ path: `${outDir}/${role}-sec-${safe}.png`, fullPage: false });
  }

  // Capture HTML of main content
  const html = await page.evaluate(() => {
    const pageHost = document.querySelector('demo-tables-page') || document.querySelector('article') || document.body;
    const root = pageHost.shadowRoot || pageHost;
    return root.innerHTML?.slice(0, 200000) || '';
  });
  writeFileSync(`${outDir}/${role}-fragment.html`, `<!DOCTYPE html><html><body>${html}</body></html>`, 'utf8');

  console.log(JSON.stringify({ role, headings: inv.headings.length, tables: inv.tableCount, stubs: inv.stubMentions, a11y: inv.hasAccessibility }, null, 2));
  await page.close();
  return inv;
}

const ref = await captureRole('ref', 'http://localhost:4321/components/tables', false);
const conv = await captureRole('conv', 'http://localhost:5178/components/tables', true);

writeFileSync(`${outDir}/compare-summary.json`, JSON.stringify({
  generatedAt: new Date().toISOString(),
  ref: {
    headings: ref.headings,
    tableCount: ref.tableCount,
    stubMentions: ref.stubMentions,
    hasAccessibility: ref.hasAccessibility,
    hasUsage: ref.hasUsage,
    tables: ref.tables.map((t) => ({
      i: t.i, tag: t.tag, rows: t.rowCount, chips: t.chips, hasStub: t.hasStub, headers: t.headers, checkboxes: t.checkboxes, visible: t.visible, h: t.h, w: t.w, nestedTable: t.nestedTable, attrs: t.attrs,
    })),
  },
  conv: {
    headings: conv.headings,
    tableCount: conv.tableCount,
    stubMentions: conv.stubMentions,
    hasAccessibility: conv.hasAccessibility,
    hasUsage: conv.hasUsage,
    hasCostpointCallout: conv.hasCostpointCallout,
    tables: conv.tables.map((t) => ({
      i: t.i, tag: t.tag, rows: t.rowCount, chips: t.chips, hasStub: t.hasStub, headers: t.headers, checkboxes: t.checkboxes, grips: t.grips, expanders: t.expanders, visible: t.visible, h: t.h, w: t.w, nestedTable: t.nestedTable, attrs: t.attrs, textSample: t.textSample,
    })),
  },
}, null, 2));

await browser.close();
console.log('done');
