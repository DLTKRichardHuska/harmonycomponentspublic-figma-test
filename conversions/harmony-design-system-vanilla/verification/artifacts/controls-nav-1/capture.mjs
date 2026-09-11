import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = dirname(fileURLToPath(import.meta.url));
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function setRefTheme(p, product = 'cp', dark = false) {
  await p.evaluate(({ product, dark }) => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('colorTheme', product);
    document.documentElement.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-' + product);
    if (dark) document.documentElement.classList.add('dark');
  }, { product, dark });
  await delay(400);
}

async function setConvTheme(p, product = 'cp', dark = false) {
  await p.evaluate(({ product, dark }) => {
    const app = document.querySelector('demo-app');
    if (app) {
      app.product = product;
      localStorage.setItem('harmony-demo-product', product);
    }
    document.documentElement.classList.remove('dark', 'theme-cp', 'theme-vp', 'theme-ppm', 'theme-maconomy');
    document.documentElement.classList.add('theme-' + product);
    document.documentElement.classList.toggle('dark', dark);
  }, { product, dark });
  await delay(500);
}

async function inventoryRef() {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const desc = document.querySelector('.page-header__description')?.textContent?.trim();
    const h2 = [...document.querySelectorAll('h2')].map((h) => h.textContent.trim());
    const examples = [...document.querySelectorAll('.example-section__title, .example__title')].map((h) =>
      h.textContent.trim(),
    );
    const nav = [...document.querySelectorAll('.article-nav__link')].map((a) => a.textContent.trim());
    const groups = [...document.querySelectorAll('.btn-group')].map((el, i) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const btns = [...el.querySelectorAll('button, .btn')];
      return {
        i,
        className: el.className,
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: s.display,
        flexDir: s.flexDirection,
        gap: s.gap,
        pad: s.padding,
        border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        bg: s.backgroundColor,
        btnCount: btns.length,
        firstBtn: btns[0]
          ? {
              h: Math.round(btns[0].getBoundingClientRect().height),
              bg: getComputedStyle(btns[0]).backgroundColor,
              color: getComputedStyle(btns[0]).color,
              fw: getComputedStyle(btns[0]).fontWeight,
              fs: getComputedStyle(btns[0]).fontSize,
            }
          : null,
      };
    });
    const menus = [...document.querySelectorAll('.list-menu')].map((el, i) => {
      const items = [...el.querySelectorAll('.list-menu__item')];
      const active = items.find((it) => it.classList.contains('is-active'));
      return {
        i,
        className: el.className,
        itemCount: items.length,
        hasBorders: !el.classList.contains('list-menu--no-borders'),
        activeBg: active ? getComputedStyle(active).backgroundColor : null,
        activeColor: active ? getComputedStyle(active).color : null,
        itemH: items[0] ? Math.round(items[0].getBoundingClientRect().height) : null,
        itemPad: items[0] ? getComputedStyle(items[0]).padding : null,
        borderBottom: items[0] ? getComputedStyle(items[0]).borderBottom : null,
        iconCount: el.querySelectorAll('.list-menu__item-icon, svg, [class*="icon"]').length,
      };
    });
    // Astro NotificationBadge may render as span.notification-badge
    const badgeNodes = [
      ...document.querySelectorAll('.notification-badge'),
      ...document.querySelectorAll('[class*="notification-badge"]'),
    ];
    const uniq = [...new Set(badgeNodes)];
    const badges = uniq.map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        className: el.className,
        text: (el.textContent || '').trim(),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: s.backgroundColor,
        color: s.color,
        border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        radius: s.borderRadius,
      };
    });
    return {
      h1,
      desc,
      h2,
      examples,
      nav,
      hasProps: !!document.querySelector('#props'),
      hasA11y: !!document.querySelector('#accessibility'),
      groups,
      menus,
      badges,
      badgeCount: badges.length,
    };
  });
}

async function inventoryConv(pageTag) {
  return page.evaluate((pageTag) => {
    const app = document.querySelector('demo-app');
    const pageEl = app?.shadowRoot?.querySelector(pageTag) || document.querySelector(pageTag);
    const root = pageEl?.shadowRoot;
    if (!root) return { error: 'missing ' + pageTag };

    let h1 = root.querySelector('h1')?.textContent?.trim();
    const hdr = root.querySelector('demo-page-header');
    if (!h1 && hdr?.shadowRoot) h1 = hdr.shadowRoot.querySelector('h1')?.textContent?.trim();
    const desc = (hdr?.shadowRoot?.querySelector('p') || root.querySelector('p'))?.textContent?.trim()?.slice(0, 320);
    const h2 = [...root.querySelectorAll('h2')].map((h) => h.textContent.trim());
    const hasConsume = !!root.querySelector('demo-consume-snippets');
    const hasApi = h2.some((t) => /api|props/i.test(t));
    const hasA11y = h2.some((t) => /accessibility/i.test(t));

    const groups = [];
    root.querySelectorAll('.btn-group, harmony-button-group').forEach((el, i) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const btns = [...el.querySelectorAll(':scope > button, :scope > .btn, :scope > harmony-button')];
      groups.push({
        i,
        tag: el.tagName.toLowerCase(),
        className: el.getAttribute('class') || '',
        attrs: {
          variant: el.getAttribute('variant'),
          size: el.getAttribute('size'),
          orientation: el.getAttribute('orientation'),
          role: el.getAttribute('role'),
        },
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: s.display,
        flexDir: s.flexDirection,
        gap: s.gap,
        pad: s.padding,
        border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        bg: s.backgroundColor,
        btnCount: btns.length,
        firstBtn: btns[0]
          ? {
              h: Math.round(btns[0].getBoundingClientRect().height),
              bg: getComputedStyle(btns[0]).backgroundColor,
              color: getComputedStyle(btns[0]).color,
              fw: getComputedStyle(btns[0]).fontWeight,
              fs: getComputedStyle(btns[0]).fontSize,
            }
          : null,
      });
    });

    const menus = [];
    root.querySelectorAll('nav.list-menu, .list-menu, harmony-list-menu').forEach((el, i) => {
      const itemEls = [...el.querySelectorAll(':scope > .list-menu__item, :scope > a, :scope > button')];
      const active = itemEls.find((it) => it.classList.contains('is-active'));
      menus.push({
        i,
        tag: el.tagName.toLowerCase(),
        className: el.getAttribute('class') || '',
        variant: el.getAttribute('variant'),
        itemCount: itemEls.length,
        hasBorders: !el.classList.contains('list-menu--no-borders') && el.getAttribute('variant') !== 'no-borders',
        activeBg: active ? getComputedStyle(active).backgroundColor : null,
        activeColor: active ? getComputedStyle(active).color : null,
        itemH: itemEls[0] ? Math.round(itemEls[0].getBoundingClientRect().height) : null,
        itemPad: itemEls[0] ? getComputedStyle(itemEls[0]).padding : null,
        borderBottom: itemEls[0] ? getComputedStyle(itemEls[0]).borderBottom : null,
        itemClasses: itemEls.slice(0, 4).map((n) => n.className),
      });
    });

    const badges = [];
    root.querySelectorAll('harmony-notification-badge').forEach((el) => {
      const part =
        el.shadowRoot?.querySelector('[part="badge"]') ||
        el.shadowRoot?.querySelector('.notification-badge') ||
        el.shadowRoot?.querySelector('span');
      const target = part || el;
      const s = getComputedStyle(target);
      const r = target.getBoundingClientRect();
      const slot = el.shadowRoot?.querySelector('slot:not([name])');
      const assigned = slot?.assignedElements?.({ flatten: true }) || [];
      badges.push({
        type: el.getAttribute('type'),
        size: el.getAttribute('size'),
        variant: el.getAttribute('variant'),
        value: el.getAttribute('value'),
        border: el.hasAttribute('border'),
        wrapped: assigned.length > 0,
        text: (part?.textContent || '').trim(),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: s.backgroundColor,
        color: s.color,
        borderCss: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
        radius: s.borderRadius,
        hostW: Math.round(el.getBoundingClientRect().width),
        hostH: Math.round(el.getBoundingClientRect().height),
      });
    });

    return {
      h1,
      desc,
      h2,
      hasConsume,
      hasApi,
      hasA11y,
      groups,
      menus,
      badges,
      badgeCount: badges.length,
      apiRows: [...root.querySelectorAll('table tbody tr')].map((tr) =>
        tr.innerText.replace(/\s+/g, ' ').trim(),
      ),
    };
  }, pageTag);
}

async function shotViewport(name) {
  await page.screenshot({ path: join(outDir, name), fullPage: false });
}

async function scrollToHeading(isConv, pageTag, headingText) {
  return page.evaluate(
    ({ isConv, pageTag, headingText }) => {
      let root = document;
      if (isConv) {
        const app = document.querySelector('demo-app');
        const pageEl = app?.shadowRoot?.querySelector(pageTag) || document.querySelector(pageTag);
        root = pageEl?.shadowRoot || document;
      }
      const h = [...root.querySelectorAll(isConv ? 'h2' : 'h2, .example-section__title, .example__title')].find((el) =>
        (el.textContent || '').toLowerCase().includes(headingText.toLowerCase()),
      );
      if (!h) return false;
      h.scrollIntoView({ block: 'start' });
      return true;
    },
    { isConv, pageTag, headingText },
  );
}

const routes = [
  {
    key: 'button-groups',
    ref: '/components/button-groups',
    conv: '/components/button-groups',
    pageTag: 'demo-button-groups-page',
    sections: ['Default variant', 'Sizes', 'Orientation', 'Disabled', 'Multiple', 'icons and text', 'Icon only', 'Outline', 'API', 'Accessibility'],
  },
  {
    key: 'list-menu',
    ref: '/components/list-menu',
    conv: '/components/list-menu',
    pageTag: 'demo-list-menu-page',
    sections: ['Basic', 'Without icons', 'Helper', 'No borders', 'API', 'Accessibility'],
  },
  {
    key: 'notification-badges',
    ref: '/components/notification-badges',
    conv: '/components/notification-badges',
    pageTag: 'demo-notification-badges-page',
    sections: ['Dot', 'Number', 'Overflow', 'Wrapped', 'API', 'Accessibility'],
  },
];

const report = {};

for (const r of routes) {
  await page.goto('http://localhost:4321' + r.ref, { waitUntil: 'networkidle', timeout: 60000 });
  await setRefTheme(page, 'cp', false);
  await delay(300);
  const refInv = await inventoryRef();
  await shotViewport(`ref-${r.key}-top.png`);
  // scroll mid/bottom
  await page.evaluate(() => window.scrollBy(0, 700));
  await delay(150);
  await shotViewport(`ref-${r.key}-mid.png`);
  await page.evaluate(() => window.scrollBy(0, 900));
  await delay(150);
  await shotViewport(`ref-${r.key}-bottom.png`);
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const sec of r.sections.slice(0, 5)) {
    const ok = await scrollToHeading(false, null, sec);
    await delay(200);
    if (ok) await shotViewport(`ref-${r.key}-sec-${sec.replace(/\s+/g, '-').toLowerCase()}.png`);
  }

  await page.goto('http://localhost:5178' + r.conv, { waitUntil: 'networkidle', timeout: 60000 });
  await setConvTheme(page, 'cp', false);
  await delay(600);
  const convInv = await inventoryConv(r.pageTag);
  await shotViewport(`conv-${r.key}-top.png`);
  await page.evaluate(() => window.scrollBy(0, 700));
  await delay(150);
  await shotViewport(`conv-${r.key}-mid.png`);
  await page.evaluate(() => window.scrollBy(0, 900));
  await delay(150);
  await shotViewport(`conv-${r.key}-lower.png`);
  await page.evaluate(() => window.scrollBy(0, 900));
  await delay(150);
  await shotViewport(`conv-${r.key}-bottom.png`);
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const sec of r.sections) {
    const ok = await scrollToHeading(true, r.pageTag, sec);
    await delay(200);
    if (ok) await shotViewport(`conv-${r.key}-sec-${sec.replace(/\s+/g, '-').toLowerCase()}.png`);
  }

  await setConvTheme(page, 'cp', true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(300);
  await shotViewport(`conv-${r.key}-dark-top.png`);

  await setConvTheme(page, 'cp', false);
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value: 'active' }],
  });
  await delay(400);
  const fc = await page.evaluate((pageTag) => {
    const app = document.querySelector('demo-app');
    const root = app?.shadowRoot?.querySelector(pageTag)?.shadowRoot;
    if (!root) return { error: 'no root' };
    const sample =
      root.querySelector('harmony-button-group button, .btn-group button, .list-menu__item, harmony-notification-badge') ||
      root.querySelector('button, a');
    if (!sample) return { error: 'no sample' };
    sample.focus?.();
    const s = getComputedStyle(sample);
    let badge = null;
    if (sample.tagName === 'HARMONY-NOTIFICATION-BADGE') {
      badge = sample.shadowRoot?.querySelector('[part="badge"], span');
    } else {
      const nb = root.querySelector('harmony-notification-badge');
      badge = nb?.shadowRoot?.querySelector('[part="badge"], span');
    }
    return {
      focusedTag: sample.tagName,
      outline: s.outline,
      outlineWidth: s.outlineWidth,
      outlineColor: s.outlineColor,
      border: `${s.borderWidth} ${s.borderStyle} ${s.borderColor}`,
      color: s.color,
      bg: s.backgroundColor,
      badgeBg: badge ? getComputedStyle(badge).backgroundColor : null,
      badgeBorder: badge ? getComputedStyle(badge).border : null,
      badgeColor: badge ? getComputedStyle(badge).color : null,
    };
  }, r.pageTag);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shotViewport(`conv-${r.key}-forced-colors.png`);
  await client.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value: 'none' }],
  });

  report[r.key] = { ref: refInv, conv: convInv, forcedColors: fc };
}

writeFileSync(join(outDir, 'inventory.json'), JSON.stringify(report, null, 2));
console.log('OK', outDir);
for (const [k, v] of Object.entries(report)) {
  console.log('\n===', k, '===');
  console.log('ref h1:', v.ref.h1, '| conv h1:', v.conv.h1);
  console.log('ref examples:', v.ref.examples);
  console.log('conv h2:', v.conv.h2);
  console.log('groups ref/conv:', v.ref.groups?.length, v.conv.groups?.length);
  console.log('menus ref/conv:', v.ref.menus?.length, v.conv.menus?.length);
  console.log('badges ref/conv:', v.ref.badgeCount, v.conv.badgeCount);
  console.log('api/a11y/consume:', v.conv.hasApi, v.conv.hasA11y, v.conv.hasConsume);
  if (v.ref.groups?.[0]) console.log('ref g0', JSON.stringify(v.ref.groups[0]));
  if (v.conv.groups?.[0]) console.log('conv g0', JSON.stringify(v.conv.groups[0]));
  if (v.ref.menus?.[0]) console.log('ref m0', JSON.stringify(v.ref.menus[0]));
  if (v.conv.menus?.[0]) console.log('conv m0', JSON.stringify(v.conv.menus[0]));
  if (v.ref.badges?.[0]) console.log('ref b0', JSON.stringify(v.ref.badges[0]));
  if (v.conv.badges?.[0]) console.log('conv b0', JSON.stringify(v.conv.badges[0]));
  console.log('fc', JSON.stringify(v.forcedColors));
}
await browser.close();
