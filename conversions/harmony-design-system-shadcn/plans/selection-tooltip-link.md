# Selection controls + Tooltip + Link — harmony-design-system-shadcn

status: synced (human accepted visual match 2026-07-20)  
scope: Tooltip, Link, Checkbox, CheckboxGroup, RadioButton, RadioGroup  
strategy: `component` (all)  
created: 2026-07-20  
approved: 2026-07-20  
updated: 2026-07-20 (selection-tooltip-link-3 → synced)

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| Checkbox | component | `@radix-ui/react-checkbox` + cva + Icon `check` |
| CheckboxGroup | component | fieldset shell; children = Checkbox |
| RadioButton | component | Radix Radio item + cva sizes; CSS dot |
| RadioGroup | component | `@radix-ui/react-radio-group` + fieldset chrome |
| Tooltip | component | `@radix-ui/react-tooltip` / shadcn Tooltip |
| Link | component | cva `<a>` + Icon when `external` |

## Approach & stack fit (locked)

- **Leverage:** Radix Checkbox / Radio Group / Tooltip; Label/Field; package Icon; Tailwind tokens for selection chrome.
- **Friction:** CheckboxGroup is fieldset-only (no Radix). Link is cva-only. Tooltip `cornerVariant` and Link responsive default size skipped.
- **Label pattern (Hybrid C):** bare controls have no `label` prop; compose Label/Field; CheckboxField / RadioField convenience.

## Consumer API (user confirmed)

### Shared selection chrome
- Per-control and group `error` / `warning` + messages with Icon + `aria-describedby`.
- Export `*Variants` where cva is used.

### Checkbox
- Bare Radix API + validation props; no `label`. Indicator: Icon `check`.
- **CheckboxField:** `label`, `labelVariant` (`stacked` | `inline`), helper, required + Checkbox props.

### CheckboxGroup
- `legend`, `orientation`, group validation, children. Author owns child name/value/checked.

### RadioButton
- RadioGroup item: `value`, `size` sm|md|lg, validation; no `label`. CSS dot.
- **RadioField:** label + Radio item via Label/Field.

### RadioGroup
- Radix root: `name`, value/onValueChange, legend, orientation, validation. Radix propagates name.

### Tooltip
- Compound Provider/Root/Trigger/Content. `text` convenience; `position` → `side`. Skip `cornerVariant`.

### Link
- cva `<a>`: href, size, muted, external (+ Icon), asChild. Skip responsive default size &lt;768px.

## Blocking dependencies

- Icon — synced
- Button — synced
- Label — synced
- Checkbox / RadioButton — same batch before groups

## Out of scope

- Toggle, shell Tooltip usages, Kanban tooltips, Accordion, Dropdown

## Execute order

1. Checkbox + CheckboxField → `/components/checkboxes`
2. CheckboxGroup → `/components/checkbox-groups`
3. RadioButton + RadioField + RadioGroup → radio demos
4. Link → `/components/links`
5. Tooltip → `/components/tooltips`
6. Verify → human accept → synced
