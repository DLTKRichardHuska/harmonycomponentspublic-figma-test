import { titleForHref } from './demoNavigation';

export type DemoRouteKind =
  | 'home'
  | 'getting-started'
  | 'changelog'
  | 'foundation'
  | 'shell'
  | 'component'
  | 'theme';

const STATUS_ROUTE_KINDS = new Set<DemoRouteKind>(['foundation', 'component', 'shell', 'theme']);

const FOUNDATION_SLUG_TO_SCOPE: Record<string, string> = {
  colors: 'Colors',
  typography: 'Typography',
  spacing: 'Spacing',
  elevations: 'Elevations',
  dela: 'Dela',
};

const SHELL_PATH_TO_SCOPE: Record<string, string> = {
  '/shell/layout': 'ShellLayout',
  '/shell/header': 'ShellHeader',
  '/shell/footer': 'ShellFooter',
  '/shell/page-header': 'ShellPageHeader',
  '/shell/page-content': 'PageContent',
  '/shell/left-sidebar': 'LeftSidebar',
  '/shell/right-sidebar': 'RightSidebar',
  '/shell/panel': 'ShellPanel',
};

/** URL segment → conversion.manifest element key (aligned with react-mui demoAppRoutes). */
const COMPONENT_SLUG_TO_SCOPE: Record<string, string> = {
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
};

function normalizePath(pathname: string): string {
  const s = pathname.replace(/\/$/, '');
  return s === '' ? '/' : s;
}

function slugToScope(segment: string): string {
  return COMPONENT_SLUG_TO_SCOPE[segment] ?? segment;
}

export function scopeFromPath(pathname: string): string {
  const path = normalizePath(pathname);
  if (path === '/') return 'home';
  if (path === '/getting-started') return 'getting-started';
  if (path === '/changelog') return 'changelog';
  if (path.startsWith('/foundation/')) {
    const slug = path.split('/').filter(Boolean).pop() ?? '';
    return FOUNDATION_SLUG_TO_SCOPE[slug] ?? titleForHref(path).replace(/\s+/g, '');
  }
  if (path.startsWith('/shell/')) {
    return SHELL_PATH_TO_SCOPE[path] ?? 'ShellLayout';
  }
  if (path === '/cp/floating-nav') return 'FloatingNav';
  if (path === '/cp/kanban') return 'Kanban';
  if (path.startsWith('/components/')) {
    const slug = path.split('/').filter(Boolean).pop() ?? '';
    return slugToScope(slug);
  }
  return titleForHref(path).replace(/\s+/g, '');
}

export function routeKindFromPath(pathname: string): DemoRouteKind {
  const path = normalizePath(pathname);
  if (path === '/') return 'home';
  if (path === '/getting-started') return 'getting-started';
  if (path === '/changelog') return 'changelog';
  if (path.startsWith('/foundation/')) return 'foundation';
  if (path.startsWith('/shell/')) return 'shell';
  if (path.startsWith('/cp/')) return 'theme';
  if (path.startsWith('/components/')) return 'component';
  return 'component';
}

/** Whether this route should show a conversion sync status badge. */
export function shouldShowConversionStatus(pathname: string): boolean {
  return STATUS_ROUTE_KINDS.has(routeKindFromPath(pathname));
}
