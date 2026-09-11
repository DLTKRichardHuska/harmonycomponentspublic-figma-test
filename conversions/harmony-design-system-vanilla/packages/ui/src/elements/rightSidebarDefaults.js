/**
 * Default right-sidebar sections per product.
 * Product builds rewrite PRODUCT_RIGHT_SIDEBAR_ID (parallel to left sidebar).
 * Dela uses Harmony custom icon names (RS_DelaDefault / RS_Dela_Active) — no host SVG copy required.
 */

/**
 * @typedef {{
 *   id?: string;
 *   icon?: string;
 *   label: string;
 *   href?: string;
 *   active?: boolean;
 *   isCustom?: boolean;
 *   customSrc?: string;
 *   customSrcActive?: string;
 *   panelTitle?: string;
 *   panelIcon?: string;
 *   panelContentId?: string;
 *   useGradientHeader?: boolean;
 * }} SidebarItem
 * @typedef {{ items: SidebarItem[] }} SidebarSection
 */

/** Baked product id for single-product kits. */
export const PRODUCT_RIGHT_SIDEBAR_ID = 'cp';

/** @type {SidebarItem} */
const delaItem = {
  label: 'Dela AI',
  isCustom: true,
  customSrc: 'RS_DelaDefault',
  customSrcActive: 'RS_Dela_Active',
  useGradientHeader: true,
};

/** @type {SidebarSection[]} */
const cpSections = [
  {
    items: [
      { ...delaItem },
      { icon: 'bell', label: 'Notifications' },
      { icon: 'arrow-up-tray', label: 'Files' },
    ],
  },
  {
    items: [
      { icon: 'printer', label: 'Print' },
      { icon: 'view-columns', label: 'Layout Options' },
    ],
  },
  {
    items: [
      { icon: 'mic-slash', label: 'Microphone' },
      { icon: 'signal-slash', label: 'Offline' },
      { icon: 'command-line', label: 'Keyboard Shortcuts' },
      { icon: 'question-mark-circle', label: 'Help' },
    ],
  },
];

/** @type {SidebarSection[]} */
const standardSections = [
  {
    items: [
      { ...delaItem },
      { icon: 'pencil-square', label: 'Edit' },
      { icon: 'magnifying-glass', label: 'Search' },
      { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
      { icon: 'related', label: 'Related' },
      { icon: 'template', label: 'Templates' },
      { icon: 'cloud-arrow-up', label: 'Upload' },
      { icon: 'cloud-arrow-down', label: 'Download' },
    ],
  },
  {
    items: [
      { icon: 'bell', label: 'Notifications' },
      { icon: 'question-mark-circle', label: 'Help' },
      { icon: 'share', label: 'Share' },
    ],
  },
  {
    items: [
      { icon: 'globe-alt', label: 'Accessibility' },
      { icon: 'language', label: 'Language' },
      { icon: 'moon', label: 'Dark Mode' },
    ],
  },
];

/** @type {Record<string, SidebarSection[]>} */
export const RIGHT_SIDEBAR_DEFAULTS_BY_PRODUCT = {
  cp: cpSections,
  vp: standardSections,
  ppm: standardSections,
  maconomy: standardSections,
};

/**
 * Resolve product id for sidebar defaults (demo stylesheet or baked kit id).
 * @returns {string}
 */
export function resolveProductRightSidebarId() {
  if (typeof document !== 'undefined') {
    const link = document.getElementById('harmony-product-styles');
    const href = link?.getAttribute?.('href') || '';
    for (const id of Object.keys(RIGHT_SIDEBAR_DEFAULTS_BY_PRODUCT)) {
      if (href.includes(`/${id}/`) || href.includes(`-${id}`) || href.includes(`${id}/styles`)) {
        return id;
      }
    }
  }
  return PRODUCT_RIGHT_SIDEBAR_ID;
}

/**
 * @returns {SidebarSection[]}
 */
export function getRightSidebarDefaults() {
  const id = resolveProductRightSidebarId();
  return RIGHT_SIDEBAR_DEFAULTS_BY_PRODUCT[id] || RIGHT_SIDEBAR_DEFAULTS_BY_PRODUCT.cp;
}

/**
 * Stable item id (optional explicit id, else positional).
 * @param {SidebarItem} item
 * @param {number} sectionIndex
 * @param {number} index
 */
export function rightSidebarItemId(item, sectionIndex, index) {
  if (item.id) return item.id;
  return `right-sidebar-item-${sectionIndex}-${index}`;
}

/**
 * True when customSrc is a Harmony icon name (not a URL/path).
 * @param {string | undefined} src
 */
export function isHarmonyIconName(src) {
  if (!src) return false;
  return !/[./:]/.test(src);
}
