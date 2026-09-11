/** Mirrors reference navigation + Getting Started before Changelog. */
export const demoNavigation = [
  {
    title: 'Getting Started',
    items: [{ title: 'Getting Started', href: '/getting-started', icon: 'book-open' }],
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
      { title: 'Spacing', href: '/foundation/spacing', icon: 'arrows-right-left' },
      { title: 'Elevations', href: '/foundation/elevations', icon: 'squares-2x2' },
      { title: 'Dela', href: '/foundation/dela', icon: 'sparkles' },
    ],
  },
  {
    title: 'Shell Layout',
    items: [
      { title: 'Shell Layout', href: '/shell/layout', icon: 'view-columns' },
      { title: 'Shell Header', href: '/shell/header', icon: 'bars-3' },
      { title: 'Company Picker', href: '/components/company-picker', icon: 'building-office' },
      { title: 'User Menu', href: '/components/user-menu', icon: 'user' },
      { title: 'Shell Footer', href: '/shell/footer', icon: 'bars-3' },
      { title: 'Page Header', href: '/shell/page-header', icon: 'document' },
      { title: 'Page Content', href: '/shell/page-content', icon: 'document' },
      { title: 'Left Sidebar', href: '/shell/left-sidebar', icon: 'bars-3-bottom-left' },
      { title: 'Right Sidebar', href: '/shell/right-sidebar', icon: 'bars-3-bottom-right' },
      { title: 'Shell Panel', href: '/shell/panel', icon: 'window' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Accordion', href: '/components/accordion', icon: 'chevron-down' },
      { title: 'Alerts', href: '/components/alerts', icon: 'exclamation-triangle' },
      { title: 'Avatar', href: '/components/avatar', icon: 'user' },
      { title: 'Badges', href: '/components/badges', icon: 'star' },
      { title: 'Button Groups', href: '/components/button-groups', icon: 'queue-list' },
      { title: 'Buttons', href: '/components/buttons', icon: 'cursor-arrow-rays' },
      { title: 'Cards', href: '/components/cards', icon: 'squares-2x2' },
      { title: 'Checkbox Groups', href: '/components/checkbox-groups', icon: 'check' },
      { title: 'Checkboxes', href: '/components/checkboxes', icon: 'check' },
      { title: 'Chips', href: '/components/chips', icon: 'tag' },
      { title: 'Date Picker', href: '/components/date-picker', icon: 'calendar' },
      { title: 'Dialogs', href: '/components/dialogs', icon: 'window' },
      { title: 'Dropdowns', href: '/components/dropdowns', icon: 'chevron-down' },
      { title: 'Icons', href: '/components/icons', icon: 'sparkles' },
      { title: 'Inputs', href: '/components/inputs', icon: 'pencil' },
      { title: 'Kanban', href: '/components/kanban', icon: 'view-columns' },
      { title: 'Labels', href: '/components/labels', icon: 'tag' },
      { title: 'Links', href: '/components/links', icon: 'link' },
      { title: 'List Menu', href: '/components/list-menu', icon: 'queue-list' },
      { title: 'Notification Badges', href: '/components/notification-badges', icon: 'bell' },
      { title: 'Progress Bar', href: '/components/progress-bar', icon: 'chart-bar' },
      { title: 'Radio Buttons', href: '/components/radio-buttons', icon: 'radio' },
      { title: 'Radio Groups', href: '/components/radio-groups', icon: 'queue-list' },
      { title: 'Scrollbar', href: '/components/scrollbar', icon: 'arrows-up-down' },
      { title: 'Specialty Inputs', href: '/components/specialty-inputs', icon: 'hashtag' },
      { title: 'Spinner', href: '/components/spinner', icon: 'arrow-path' },
      { title: 'Stepper', href: '/components/stepper', icon: 'queue-list' },
      { title: 'Tab Strip', href: '/components/tab-strip', icon: 'rectangle-group' },
      { title: 'Tables', href: '/components/tables', icon: 'table-cells' },
      { title: 'Toggle Switches', href: '/components/toggle-switches', icon: 'adjustments-horizontal' },
      { title: 'Tooltips', href: '/components/tooltips', icon: 'chat-bubble-left' },
    ],
  },
];

export function titleForHref(href) {
  for (const section of demoNavigation) {
    const item = section.items.find((i) => i.href === href);
    if (item) return item.title;
  }
  return href;
}

export function allHrefs() {
  return demoNavigation.flatMap((s) => s.items.map((i) => i.href));
}
