import { themeComponentHrefs } from './demoThemeConfig';

export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Mirrors reference navigation + Getting Started before Changelog. */
export const demoNavigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [{ title: 'Getting Started', href: '/getting-started', icon: 'book' }],
  },
  {
    title: 'Changelog',
    items: [{ title: 'Changelog', href: '/changelog', icon: 'clock' }],
  },
  {
    title: 'Foundation',
    items: [
      { title: 'Colors', href: '/foundation/colors', icon: 'swatch' },
      { title: 'Typography', href: '/foundation/typography', icon: 'document' },
      { title: 'Spacing', href: '/foundation/spacing', icon: 'arrows' },
      { title: 'Elevations', href: '/foundation/elevations', icon: 'squares' },
      { title: 'Dela', href: '/foundation/dela', icon: 'sparkles' },
    ],
  },
  {
    title: 'Shell Layout',
    items: [
      { title: 'Shell Layout', href: '/shell/layout', icon: 'columns' },
      { title: 'Shell Header', href: '/shell/header', icon: 'bars' },
      { title: 'Shell Footer', href: '/shell/footer', icon: 'bars' },
      { title: 'Page Header', href: '/shell/page-header', icon: 'document' },
      { title: 'Page Content', href: '/shell/page-content', icon: 'document' },
      { title: 'Left Sidebar', href: '/shell/left-sidebar', icon: 'bars' },
      { title: 'Right Sidebar', href: '/shell/right-sidebar', icon: 'bars' },
      { title: 'Shell Panel', href: '/shell/panel', icon: 'window' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Accordion', href: '/components/accordion', icon: 'chevron' },
      { title: 'Alerts', href: '/components/alerts', icon: 'alert' },
      { title: 'Avatar', href: '/components/avatar', icon: 'user' },
      { title: 'Badges', href: '/components/badges', icon: 'star' },
      { title: 'Button Groups', href: '/components/button-groups', icon: 'queue' },
      { title: 'Buttons', href: '/components/buttons', icon: 'cursor' },
      { title: 'Cards', href: '/components/cards', icon: 'squares' },
      { title: 'Checkbox Groups', href: '/components/checkbox-groups', icon: 'check' },
      { title: 'Checkboxes', href: '/components/checkboxes', icon: 'check' },
      { title: 'Chips', href: '/components/chips', icon: 'tag' },
      { title: 'Date Picker', href: '/components/date-picker', icon: 'calendar' },
      { title: 'Dialogs', href: '/components/dialogs', icon: 'window' },
      { title: 'Dropdowns', href: '/components/dropdowns', icon: 'chevron' },
      { title: 'Icons', href: '/components/icons', icon: 'sparkles' },
      { title: 'Inputs', href: '/components/inputs', icon: 'pencil' },
      { title: 'Kanban', href: '/components/kanban', icon: 'columns' },
      { title: 'Labels', href: '/components/labels', icon: 'tag' },
      { title: 'Links', href: '/components/links', icon: 'link' },
      { title: 'List Menu', href: '/components/list-menu', icon: 'list' },
      { title: 'Notification Badges', href: '/components/notification-badges', icon: 'bell' },
      { title: 'Progress Bar', href: '/components/progress-bar', icon: 'chart' },
      { title: 'Radio Buttons', href: '/components/radio-buttons', icon: 'radio' },
      { title: 'Radio Groups', href: '/components/radio-groups', icon: 'list' },
      { title: 'Scrollbar', href: '/components/scrollbar', icon: 'arrows' },
      { title: 'Specialty Inputs', href: '/components/specialty-inputs', icon: 'hash' },
      { title: 'Spinner', href: '/components/spinner', icon: 'spinner' },
      { title: 'Stepper', href: '/components/stepper', icon: 'list' },
      { title: 'Tab Strip', href: '/components/tab-strip', icon: 'tabs' },
      { title: 'Tables', href: '/components/tables', icon: 'table' },
      { title: 'Toggle Switches', href: '/components/toggle-switches', icon: 'toggle' },
      { title: 'Tooltips', href: '/components/tooltips', icon: 'chat' },
    ],
  },
];

export const navSectionCount = demoNavigation.reduce((acc, section) => acc + section.items.length, 0);

export const componentDocPageCount =
  demoNavigation.find((section) => section.title === 'Components')?.items.length ?? 0;

export const EXPORTED_UI_COMPONENT_COUNT = 49;

export function normalizePath(path: string): string {
  const s = path.replace(/\/$/, '');
  return s === '' ? '/' : s;
}

export function isNavItemActive(itemHref: string, pathname: string): boolean {
  return normalizePath(pathname) === normalizePath(itemHref);
}

/** All doc routes except home. */
export function allDemoHrefs(): string[] {
  return demoNavigation.flatMap((s) => s.items.map((i) => i.href));
}

/**
 * Product-specific theme routes surfaced in the sidebar via the product-driven
 * "<Product> Components" section (mirrors the reference demo). Derived from
 * demoThemeConfig so the routed pages and the nav section share one source.
 */
export const extraThemeHrefs = themeComponentHrefs;

const EXTRA_ROUTE_TITLES: Record<string, string> = {
  '/cp/floating-nav': 'Floating Nav (CP)',
  '/cp/kanban': 'Kanban (CP)',
};

export function titleForHref(href: string): string {
  for (const section of demoNavigation) {
    const item = section.items.find((i) => i.href === href);
    if (item) return item.title;
  }
  return EXTRA_ROUTE_TITLES[href] ?? href;
}
