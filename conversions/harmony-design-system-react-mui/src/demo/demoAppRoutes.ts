export type DemoRouteKind =
  | 'home'
  | 'getting-started'
  | 'changelog'
  | 'foundation'
  | 'shell'
  | 'component'
  | 'theme'
  | 'placeholder';

export interface DemoAppRoute {
  path: string;
  title: string;
  kind: DemoRouteKind;
  /** Manifest element key for status lookup. */
  scope: string;
}

function slugToScope(segment: string): string {
  const map: Record<string, string> = {
    accordion: 'Accordion',
    alerts: 'Alert',
    avatar: 'Avatar',
    badges: 'Badge',
    'button-groups': 'ButtonGroup',
    buttons: 'Button',
    cards: 'Card',
    'checkbox-groups': 'CheckboxGroup',
    checkboxes: 'Checkbox',
    chips: 'Chip',
    'date-picker': 'DateInput',
    dialogs: 'Dialog',
    dropdowns: 'Dropdown',
    icons: 'Icon',
    inputs: 'Input',
    kanban: 'Kanban',
    labels: 'Label',
    links: 'Link',
    'list-menu': 'ListMenu',
    'notification-badges': 'NotificationBadge',
    'progress-bar': 'ProgressBar',
    'radio-buttons': 'RadioButton',
    'radio-groups': 'RadioGroup',
    scrollbar: 'Scrollbar',
    'specialty-inputs': 'NumberInput',
    spinner: 'Spinner',
    stepper: 'Stepper',
    'tab-strip': 'TabStrip',
    tables: 'Table',
    'toggle-switches': 'Toggle',
    tooltips: 'Tooltip',
    'floating-nav': 'FloatingNav',
    layout: 'ShellLayout',
    header: 'ShellHeader',
    footer: 'ShellFooter',
    'page-header': 'ShellPageHeader',
    'page-content': 'PageContent',
    'left-sidebar': 'LeftSidebar',
    'right-sidebar': 'RightSidebar',
    panel: 'ShellPanel',
    colors: 'Colors',
    typography: 'Typography',
    spacing: 'Spacing',
    elevations: 'Elevations',
    dela: 'Dela',
  };
  return map[segment] ?? segment;
}

const foundationPaths = [
  '/foundation/colors',
  '/foundation/typography',
  '/foundation/spacing',
  '/foundation/elevations',
  '/foundation/dela',
];

const shellPaths = [
  '/shell/layout',
  '/shell/header',
  '/shell/footer',
  '/shell/page-header',
  '/shell/page-content',
  '/shell/left-sidebar',
  '/shell/right-sidebar',
  '/shell/panel',
];

const componentPaths = [
  '/components/accordion',
  '/components/alerts',
  '/components/avatar',
  '/components/badges',
  '/components/button-groups',
  '/components/buttons',
  '/components/cards',
  '/components/checkbox-groups',
  '/components/checkboxes',
  '/components/chips',
  '/components/date-picker',
  '/components/dialogs',
  '/components/dropdowns',
  '/components/icons',
  '/components/inputs',
  '/components/kanban',
  '/components/labels',
  '/components/links',
  '/components/list-menu',
  '/components/notification-badges',
  '/components/progress-bar',
  '/components/radio-buttons',
  '/components/radio-groups',
  '/components/scrollbar',
  '/components/specialty-inputs',
  '/components/spinner',
  '/components/stepper',
  '/components/tab-strip',
  '/components/tables',
  '/components/toggle-switches',
  '/components/tooltips',
];

const themePaths = ['/cp/floating-nav', '/cp/kanban'];

function pathToRoute(path: string, kind: DemoRouteKind): DemoAppRoute {
  const segment = path.split('/').filter(Boolean).pop() ?? '';
  const title = segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    path,
    title,
    kind,
    scope: slugToScope(segment),
  };
}

export const demoAppRoutes: DemoAppRoute[] = [
  { path: '/', title: 'Overview', kind: 'home', scope: 'home' },
  {
    path: '/getting-started',
    title: 'Getting Started',
    kind: 'getting-started',
    scope: 'getting-started',
  },
  { path: '/changelog', title: 'Changelog', kind: 'changelog', scope: 'changelog' },
  ...foundationPaths.map((p) => pathToRoute(p, 'foundation')),
  ...shellPaths.map((p) => pathToRoute(p, 'shell')),
  ...componentPaths.map((p) => pathToRoute(p, 'component')),
  ...themePaths.map((p) => pathToRoute(p, 'theme')),
];

export function findRoute(pathname: string): DemoAppRoute | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return demoAppRoutes.find((r) => r.path === normalized);
}
