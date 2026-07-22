/**
 * Canonical Harmony UI component catalog.
 * Exported components must match `src/components/ui/index.ts`.
 * Validated by: `node scripts/validate-component-catalog.js`
 */

export const EXPORTED_UI_COMPONENT_COUNT = 49;

export const componentCategories = {
  formControls: [
    'Button',
    'ButtonGroup',
    'Input',
    'Textarea',
    'NumberInput',
    'RangeInput',
    'Checkbox',
    'CheckboxGroup',
    'RadioButton',
    'RadioGroup',
    'Toggle',
    'DateInput',
    'Label',
  ],
  display: [
    'Avatar',
    'Card',
    'Badge',
    'NotificationBadge',
    'Chip',
    'Alert',
    'Tooltip',
    'Spinner',
    'ProgressBar',
    'Table',
    'TableCostpointGrid',
    'Icon',
  ],
  navigation: ['TabStrip', 'Stepper', 'Step', 'FloatingNav', 'Link'],
  layout: [
    'LeftSidebar',
    'RightSidebar',
    'ShellPageHeader',
    'ShellPanel',
    'ShellFooter',
    'ShellHeader',
  ],
  interactive: [
    'Dialog',
    'Dropdown',
    'Accordion',
    'Kanban',
    'KanbanCard',
    'KanbanCardCostpoint',
  ],
  pickers: [
    'DatePicker',
    'DateTimePicker',
    'MonthPicker',
    'WeekPicker',
    'TimePicker',
    'PickerPopup',
  ],
  other: ['ListMenu'],
} as const;

/** Implemented in `src/components/ui/` but not re-exported from `index.ts`. */
export const internalComponents = [
  'CommandCenterPanel',
  'CommandCenterPanelSection',
  'DateRangePicker',
  'DateRangePickerExpanded',
  'TableDataRegion',
] as const;

export const layouts = ['ShellLayout', 'DocsLayout'] as const;

/** Shell pieces composed by ShellLayout (also exported individually from `index.ts`). */
export const shellSubcomponents = [
  'ShellHeader',
  'ShellFooter',
  'LeftSidebar',
  'RightSidebar',
  'FloatingNav',
  'ShellPageHeader',
  'ShellPanel',
] as const;

export type ExportedComponentName =
  (typeof componentCategories)[keyof typeof componentCategories][number];

export function getAllExportedComponents(): ExportedComponentName[] {
  return Object.values(componentCategories).flat() as ExportedComponentName[];
}

/* ============================================================
   Product scope (machine-readable)
   ------------------------------------------------------------
   The four Harmony products. Used to drive:
   - the docs demo's product-scoped visibility (CP-only sections),
   - per-product conversion builds (include/exclude components),
   - per-product docs/AGENTS/llms generation.
   These maps are ADDITIVE — a component absent from `componentProducts`
   is available in ALL products (the common case).
   ============================================================ */

export const ALL_PRODUCTS = ['cp', 'vp', 'ppm', 'maconomy'] as const;
export type Product = (typeof ALL_PRODUCTS)[number];

/**
 * Components exclusive to a subset of products. Omit a component to mean
 * "available in all products". Source of truth for product exclusivity.
 */
export const componentProducts: Partial<Record<string, Product[]>> = {
  FloatingNav: ['cp'],
  KanbanCardCostpoint: ['cp'],
  TableCostpointGrid: ['cp'],
};

/**
 * Product-conditional variants on otherwise-shared components. The component
 * ships in every product, but the listed variant only applies (or only renders
 * its distinct styling) under the given products. Drives docs callouts.
 */
export const componentVariantProducts: Record<string, Partial<Record<string, Product[]>>> = {
  TabStrip: { pill: ['vp'] },
  Kanban: { costpoint: ['cp'] },
};

/** Products a component is available in (defaults to all four). */
export function getComponentProducts(name: string): Product[] {
  return componentProducts[name] ?? [...ALL_PRODUCTS];
}

/** Whether a component is available in the given product. */
export function isComponentInProduct(name: string, product: Product): boolean {
  return getComponentProducts(name).includes(product);
}

/** Doc page slug under `/components/` (grouped pages cover multiple components). */
export const componentDocMapping: Record<string, string | null> = {
  Accordion: 'accordion',
  Alert: 'alerts',
  Avatar: 'avatar',
  Badge: 'badges',
  NotificationBadge: 'notification-badges',
  Button: 'buttons',
  ButtonGroup: 'button-groups',
  Card: 'cards',
  Checkbox: 'checkboxes',
  CheckboxGroup: 'checkbox-groups',
  Chip: 'chips',
  DateInput: 'date-picker',
  DatePicker: 'date-picker',
  DateTimePicker: 'specialty-inputs',
  Dialog: 'dialogs',
  Dropdown: 'dropdowns',
  Icon: 'icons',
  Input: 'inputs',
  Kanban: 'kanban',
  KanbanCard: 'kanban',
  KanbanCardCostpoint: 'kanban',
  Label: 'labels',
  Link: 'links',
  ListMenu: 'list-menu',
  MonthPicker: 'specialty-inputs',
  NumberInput: 'specialty-inputs',
  PickerPopup: null,
  ProgressBar: 'progress-bar',
  RadioButton: 'radio-buttons',
  RadioGroup: 'radio-groups',
  RangeInput: 'specialty-inputs',
  Spinner: 'spinner',
  Step: 'stepper',
  Stepper: 'stepper',
  Table: 'tables',
  TableCostpointGrid: 'tables',
  TabStrip: 'tab-strip',
  Textarea: 'inputs',
  TimePicker: 'specialty-inputs',
  Toggle: 'toggle-switches',
  Tooltip: 'tooltips',
  WeekPicker: 'specialty-inputs',
  FloatingNav: null,
  LeftSidebar: null,
  RightSidebar: null,
  ShellFooter: null,
  ShellHeader: null,
  ShellPageHeader: null,
  ShellPanel: null,
};

/** Props array variable names on grouped doc pages. */
export const componentDocPropsVar: Record<string, string> = {
  Textarea: 'textareaProps',
  DatePicker: 'datePickerProps',
  DateInput: 'dateInputProps',
  NumberInput: 'numberInputProps',
  RangeInput: 'rangeInputProps',
  TimePicker: 'timePickerProps',
  MonthPicker: 'monthPickerProps',
  WeekPicker: 'weekPickerProps',
  DateTimePicker: 'dateTimePickerProps',
  Kanban: 'kanbanProps',
  KanbanCard: 'kanbanCardProps',
  Step: 'stepProps',
  Stepper: 'stepperProps',
};
