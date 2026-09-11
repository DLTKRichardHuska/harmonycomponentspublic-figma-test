/**
 * Default left-sidebar sections per product.
 * Product builds rewrite PRODUCT_LEFT_SIDEBAR_ID (parallel to PRODUCT_LOGO_ICON).
 */

/** @typedef {{ id?: string; icon?: string; label: string; href?: string; active?: boolean; isCustom?: boolean; customSrc?: string; panelTitle?: string; panelIcon?: string; panelContentId?: string; useGradientHeader?: boolean }} SidebarItem */
/** @typedef {{ items: SidebarItem[] }} SidebarSection */

/** Baked product id for single-product kits. */
export const PRODUCT_LEFT_SIDEBAR_ID = 'cp';

/** @type {SidebarSection[]} */
const cpSections = [
  {
    items: [
      { icon: 'home', label: 'Welcome screen' },
      { icon: 'squares-2x2', label: 'Dashboard' },
      { icon: 'star', label: 'My menu' },
      { icon: 'clock', label: 'Recent' },
    ],
  },
  {
    items: [
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'squares-plus', label: 'Command Center' },
      { icon: 'calculator', label: 'Accounting' },
      { icon: 'chart-bar', label: 'Planning' },
      { icon: 'document-arrow-down', label: 'Capture & contracts' },
      { icon: 'clipboard-document-list', label: 'Projects' },
      { icon: 'cube', label: 'Materials' },
      { icon: 'clock', label: 'Time & expense' },
      { icon: 'users', label: 'People' },
      { icon: 'document-chart-bar', label: 'Reports' },
      { icon: 'cog-6-tooth', label: 'Admin' },
    ],
  },
];

/** @type {SidebarSection[]} */
const standardSections = [
  {
    items: [
      { icon: 'rectangle-group', label: 'Command Center', active: true },
      { icon: 'book-open', label: 'Programs' },
      { icon: 'briefcase', label: 'Portfolios' },
      { icon: 'building-office', label: 'Projects' },
      { icon: 'Risk Shield', label: 'Risk' },
      { icon: 'Report', label: 'Reports' },
      { icon: 'calendar-days', label: 'Calendars' },
      { icon: 'document', label: 'Codes' },
      { icon: 'wallet', label: 'Rates' },
      { icon: 'Resource', label: 'Resources' },
      { icon: 'cog-6-tooth', label: 'Settings' },
      { icon: 'plus', label: 'Add Menu' },
    ],
  },
];

/** @type {Record<string, SidebarSection[]>} */
export const LEFT_SIDEBAR_DEFAULTS_BY_PRODUCT = {
  cp: cpSections,
  vp: standardSections,
  ppm: standardSections,
  maconomy: standardSections,
};

/**
 * Resolve product id for sidebar defaults (demo stylesheet or baked kit id).
 * @returns {string}
 */
export function resolveProductLeftSidebarId() {
  if (typeof document !== 'undefined') {
    const link = document.getElementById('harmony-product-styles');
    const href = link?.getAttribute?.('href') || '';
    for (const id of Object.keys(LEFT_SIDEBAR_DEFAULTS_BY_PRODUCT)) {
      if (href.includes(`/${id}/`) || href.includes(`-${id}`) || href.includes(`${id}/styles`)) {
        return id;
      }
    }
  }
  return PRODUCT_LEFT_SIDEBAR_ID;
}

/**
 * @returns {SidebarSection[]}
 */
export function getLeftSidebarDefaults() {
  const id = resolveProductLeftSidebarId();
  return LEFT_SIDEBAR_DEFAULTS_BY_PRODUCT[id] || LEFT_SIDEBAR_DEFAULTS_BY_PRODUCT.cp;
}

/**
 * Stable item id (optional explicit id, else positional).
 * @param {SidebarItem} item
 * @param {number} sectionIndex
 * @param {number} index
 */
export function sidebarItemId(item, sectionIndex, index) {
  if (item.id) return item.id;
  return `left-sidebar-item-${sectionIndex}-${index}`;
}
