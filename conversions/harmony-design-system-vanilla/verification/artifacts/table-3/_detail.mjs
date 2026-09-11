import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';

const outDir = process.argv[2];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

await page.addInitScript(() => localStorage.setItem('harmony-demo-product', 'cp'));
await page.goto('http://localhost:5178/components/tables', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-cp');
  document.querySelector('demo-app')?.setAttribute('product', 'cp');
});
await delay(800);

const detail = await page.evaluate(() => {
  const deep = (root, sel) => {
    const out = [];
    const walk = (node) => {
      if (!node?.querySelectorAll) return;
      out.push(...node.querySelectorAll(sel));
      for (const el of node.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(root);
    return out;
  };
  const host = document.querySelector('demo-tables-page');
  const root = host?.shadowRoot || document;
  const callout = deep(root, 'demo-callout')[0];
  const a11yH = deep(root, 'h2').find((h) => /Accessibility/i.test(h.textContent || ''));
  const a11yText = a11yH ? (a11yH.nextElementSibling?.innerText || '').slice(0, 400) : null;

  // Visual probe: native first table chips rendered size/colors
  const firstTable = deep(root, 'table')[0];
  const chips = [...(firstTable?.querySelectorAll('harmony-chip') || [])].map((c) => {
    const r = c.getBoundingClientRect();
    const s = getComputedStyle(c);
    const inner = c.shadowRoot?.querySelector('[part="root"], .chip, span') || c;
    const is = getComputedStyle(inner);
    return {
      text: (c.textContent || '').trim(),
      w: Math.round(r.width),
      h: Math.round(r.height),
      bg: is.backgroundColor || s.backgroundColor,
      color: is.color || s.color,
      radius: is.borderRadius || s.borderRadius,
      border: is.borderColor || s.borderColor,
    };
  });

  const striped = deep(root, 'table.table--striped')[0];
  const stripedRows = striped
    ? [...striped.querySelectorAll('tbody > tr')].map((tr) => ({
        bg: getComputedStyle(tr).backgroundColor,
        cls: tr.className,
        text: tr.innerText.replace(/\s+/g, ' ').slice(0, 60),
      }))
    : [];

  // Interactive selection: checkboxes visible?
  const selTable = deep(root, 'harmony-table')[0];
  const cbs = [...(selTable?.querySelectorAll('harmony-checkbox') || [])].map((c) => {
    const r = c.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), visible: r.height > 0 };
  });

  // Reorder grips
  const reorder = deep(root, 'harmony-table[reorderable]')[0];
  const grips = [...(reorder?.querySelectorAll('.table__grip, [class*="grip"]') || [])].map((g) => {
    const r = g.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), aria: g.getAttribute('aria-label') };
  });

  // Grouped expand
  const grouped = deep(root, 'harmony-table[grouped]')[0];
  const groupInfo = grouped
    ? {
        rows: [...grouped.querySelectorAll('tbody > tr')].map((tr) => ({
          id: tr.getAttribute('data-row-id'),
          parent: tr.getAttribute('data-parent-id'),
          hasChildren: tr.hasAttribute('data-has-children'),
          depth: tr.getAttribute('data-depth'),
          hidden: tr.hidden || getComputedStyle(tr).display === 'none',
          text: tr.innerText.replace(/\s+/g, ' ').slice(0, 50),
        })),
        expandBtns: grouped.querySelectorAll('button[aria-expanded], .table__expand-button, [part="expand"]').length,
      }
    : null;

  // Sortable header buttons
  const sortable = deep(root, 'harmony-table[columns]')[0] || deep(root, 'harmony-table').find((t) => t.hasAttribute('columns'));
  const sortHeaders = sortable
    ? [...sortable.querySelectorAll('thead th, thead button, [aria-sort]')].map((el) => ({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
        ariaSort: el.getAttribute('aria-sort'),
      }))
    : [];

  // Filter bar / title / action
  const filterHt = deep(root, 'harmony-table').find((t) => t.querySelector('[slot="filter-bar"]'));
  const filterInfo = filterHt
    ? {
        filterBar: !!filterHt.querySelector('[slot="filter-bar"]'),
        title: filterHt.querySelector('[slot="title-bar-content"]')?.innerText?.trim(),
        action: filterHt.querySelector('[slot="action-bar"]')?.innerText?.trim(),
        chips: [...filterHt.querySelectorAll('harmony-chip')].map((c) => c.textContent.trim()),
        tableRows: filterHt.querySelectorAll('tbody > tr').length,
      }
    : null;

  // CC
  const cc = deep(root, 'harmony-table[variant="commandCenter"]')[0];
  const ccInfo = cc
    ? {
        toolbar: cc.querySelector('[slot="command-center-toolbar"]')?.innerText?.trim(),
        aside: cc.querySelector('[slot="command-center-aside"]')?.innerText?.trim()?.slice(0, 120),
        rows: cc.querySelectorAll('tbody > tr').length,
        headers: [...(cc.querySelectorAll('thead th') || [])].map((th) => th.textContent.trim()),
        cls: cc.querySelector('table')?.className,
      }
    : null;

  // Stub literal check (not columns attr)
  const html = root.innerHTML || '';
  const literalStub = html.includes('Table body content') || />(\s*)COLUMN(\s*)</.test(html) || html.includes('>COLUMN<');

  return {
    calloutText: callout?.innerText?.slice(0, 200) || null,
    a11yPresent: !!a11yH,
    a11yText,
    chips,
    stripedRows,
    cbs,
    grips: grips.slice(0, 6),
    groupInfo,
    sortHeaders,
    filterInfo,
    ccInfo,
    literalStub,
    pageScroll: document.documentElement.scrollHeight,
    hostH: Math.round(host?.getBoundingClientRect().height || 0),
  };
});

writeFileSync(`${outDir}/conv-detail.json`, JSON.stringify(detail, null, 2));
console.log(JSON.stringify(detail, null, 2));

// Capture clipped section around first native table
await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const h = host?.shadowRoot?.querySelector('h2');
  h?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-native-gray.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Interactive/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-interactive.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Reorderable/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-reorderable.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Grouped/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-grouped.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Sortable/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-sortable.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Filter/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-filter.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Command Center/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-cc.png` });

await page.evaluate(() => {
  const host = document.querySelector('demo-tables-page');
  const hs = [...(host?.shadowRoot?.querySelectorAll('h2') || [])];
  hs.find((h) => /Accessibility/i.test(h.textContent || ''))?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/conv-a11y.png` });

// Reference counterparts
await page.goto('http://localhost:4321/components/tables', { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('theme-cp');
});
await delay(600);

const refDetail = await page.evaluate(() => {
  const first = document.querySelector('table');
  const badges = [...(first?.querySelectorAll('.badge, .chip') || [])].map((b) => {
    const r = b.getBoundingClientRect();
    const s = getComputedStyle(b);
    return { text: b.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, color: s.color, radius: s.borderRadius };
  });
  return { badges, h1: document.querySelector('h1')?.textContent?.trim() };
});
writeFileSync(`${outDir}/ref-detail.json`, JSON.stringify(refDetail, null, 2));

await page.evaluate(() => {
  document.querySelector('.example-section__title, h3')?.scrollIntoView({ block: 'start' });
  const t = [...document.querySelectorAll('.example-section__title, h3')].find((el) => /Gray Header/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-native-gray.png` });

await page.evaluate(() => {
  const t = [...document.querySelectorAll('.example-section__title, h2, h3')].find((el) => /Interactive Table/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-interactive.png` });

await page.evaluate(() => {
  const t = [...document.querySelectorAll('.example-section__title, h2, h3')].find((el) => /Reorderable/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-reorderable.png` });

await page.evaluate(() => {
  const t = [...document.querySelectorAll('.example-section__title, h2, h3')].find((el) => /Grouped Rows/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-grouped.png` });

await page.evaluate(() => {
  const t = [...document.querySelectorAll('.example-section__title, h2, h3')].find((el) => /Command Center table/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-cc.png` });

await page.evaluate(() => {
  const t = [...document.querySelectorAll('h2, h3')].find((el) => /Usage Guidelines|Accessibility/i.test(el.textContent || ''));
  t?.scrollIntoView({ block: 'start' });
});
await delay(300);
await page.screenshot({ path: `${outDir}/ref-a11y.png` });

await browser.close();
console.log('detail done');
