# Harmony components and layouts (quick reference)

**Authoritative export list:** `src/components/ui/index.ts` (49 components)  
**Canonical catalog (categories + doc mapping):** `src/data/component-catalog.ts`  
**Validate alignment:** `npm run validate:catalog`

## Layouts

- **ShellLayout** — App-shell template; composes header, footer, left/right sidebars, floating nav, page header, ShellPanel, main content. File: `src/layouts/ShellLayout.astro`.
- **DocsLayout** — Documentation site layout only. File: `src/layouts/DocsLayout.astro`.

## Shell subcomponents (exported; used inside ShellLayout)

ShellHeader, ShellFooter, LeftSidebar, RightSidebar, FloatingNav, ShellPageHeader, ShellPanel.

Shell docs: `src/pages/shell/*.astro`.

## Exported UI components (49)

Grouped by category (matches Consumer Guide and README).

**Form controls:** Button, ButtonGroup, Input, Textarea, NumberInput, RangeInput, Checkbox, CheckboxGroup, RadioButton, RadioGroup, Toggle, DateInput, Label

**Display:** Avatar, Card, Badge, NotificationBadge, Chip, Alert, Tooltip, Spinner, ProgressBar, Table, TableCostpointGrid, Icon

**Navigation:** TabStrip, Stepper, Step, FloatingNav, Link

**Layout (shell):** LeftSidebar, RightSidebar, ShellPageHeader, ShellPanel, ShellFooter, ShellHeader

**Interactive:** Dialog, Dropdown, Accordion, Kanban, KanbanCard, KanbanCardCostpoint

**Pickers:** DatePicker, DateTimePicker, MonthPicker, WeekPicker, TimePicker, PickerPopup

**Other:** ListMenu

## Internal UI components (not exported from index.ts)

Used by doc examples or as building blocks: CommandCenterPanel, CommandCenterPanelSection, DateRangePicker, DateRangePickerExpanded, TableDataRegion.

## Documentation pages

- **Component docs:** 32 pages under `src/pages/components/` (grouped; e.g. `inputs.astro` covers Input + Textarea, `date-picker.astro` covers DateInput + date range pickers).
- **Shell docs:** 8 pages under `src/pages/shell/`.
- **Navigation source:** `src/data/navigation.ts`.
