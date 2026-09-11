# Table

Tables are **native-first**. Product `styles.css` styles unclassed `table` / `thead` / `th` / `tbody` / `tr` / `td` with the default gray header. Modifier classes opt into variants. Optional light-DOM `<harmony-table>` maps attributes, wraps slot chrome, and wires sort / reorder / grouped / selection / Command Center behaviors.

## Native recipe

**Base:** unclassed `<table>` (no `.table` class required).

| Class | Role |
|-------|------|
| `.table--header-white` | White header background |
| `.table--header-none` | Transparent header |
| `.table--striped` | Zebra body rows |
| `.table--reorderable` | Grip column + drag affordances |
| `.table--grouped` | Expand column / CC inline expand |
| `.table--command-center` | Command Center grid chrome |
| `.table-wrapper` | Optional outer chrome host |
| `.table__filter-bar` / `.table__title-bar` / `.table__action-bar` | Optional bars above the table |
| `.table-row--selected` | Checkbox selection highlight |
| `.table-row--command-center-selected` | CC row selection |

Totals: use native `<tfoot>` (styled automatically). Legacy `tbody tr.table-row--total` still works.

```html
<table class="table--striped">
  <thead>
    <tr>
      <th>Name</th>
      <th class="text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Alpha</td><td class="text-right">$10</td></tr>
    <tr><td>Beta</td><td class="text-right">$20</td></tr>
  </tbody>
  <tfoot>
    <tr><td>Total</td><td class="text-right">$30</td></tr>
  </tfoot>
</table>
```

## Hybrid helper — `<harmony-table>`

Light-DOM Custom Element. The host **is** `.table-wrapper`. Prefer nesting a real `<table>` (thead/tbody) as a child so the HTML parser keeps rows intact. Optional bar slots wrap chrome around that table. Document CSS styles it; Shadow hosts must adopt `tableSheet`.

| Attribute | Values | Default |
|-----------|--------|---------|
| `header-variant` | gray \| white \| none | gray |
| `variant` | default \| commandCenter | default |
| `striped` | boolean (`false` string disables) | false; **true** by default for `commandCenter` |
| `reorderable` | boolean | false |
| `grouped` | boolean | false |
| `grouped-default-expanded` | space/comma-separated `data-row-id`s | — |
| `columns` | JSON array of `{key,label,align?,sortable?,filterable?}` | — |
| `sort-column` / `sort-direction` | string / asc\|desc | — |
| `selected-row-ids` | space/comma-separated ids | — |

### Slots / composition

| Slot / child | Maps to |
|--------------|---------|
| Nested `<table>` | Inner table (required for row data) |
| `filter-bar` | `.table__filter-bar` |
| `title-bar-content` / `title-bar-icons` | `.table__title-bar` |
| `action-bar` | `.table__action-bar` |
| `command-center-toolbar` / `command-center-aside` | CC toolbar + docked canvas when aside present |

Do **not** put bare `<tr>` as direct children of `<harmony-table>` — the HTML parser will not keep them as table rows.

### Events

| Event | Detail |
|-------|--------|
| `sort-change` | `{ key, direction }` |
| `filter-click` | `{ key }` |
| `table-reorder` | `{ fromIndex, toIndex }` |
| `expand-change` | `{ expandedIds }` |
| `selection-change` | `{ selectedIds }` |
| `row-select` | `{ rowId, row }` |

### Methods

`expandAll()`, `collapseAll()`, `setExpanded(ids)`, `getExpanded()`, `getSelected()`, `getOrder()`

```html
<harmony-table striped reorderable>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr data-row-id="a"><td>Alpha</td><td class="text-right">$10</td></tr>
      <tr data-row-id="b"><td>Beta</td><td class="text-right">$20</td></tr>
    </tbody>
  </table>
</harmony-table>
```

## Gaps

- Filter popovers / sort & filter algorithms — host-owned
- Title-bar window chrome behavior — skipped
- Keyboard reorder — deferred
- TableCostpointGrid — skipped (separate catalog element)
- CommandCenterPanel — compose in `command-center-aside` when converted

## Accessibility

Real table semantics; `aria-sort` on active sort columns; labeled expand/grip controls. Forced-colors via document `table.css`.

## Docs / AI

`docs/components/Table.md`, CEM (`harmony-table`), AGENTS, llms. Adopt `tableSheet` inside Shadow DOM hosts.
