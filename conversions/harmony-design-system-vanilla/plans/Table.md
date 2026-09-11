# Conversion plan — Table

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Table` |
| status | `completed` |
| createdAt | `2026-09-11T19:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship Table as **hybrid**: unclassed native `table` / cell elements get base Harmony visuals in product CSS; modifier classes only for variants; optional light-DOM `<harmony-table>` maps attrs and wires sort/reorder/grouped/selection/CC behaviors. TableCostpointGrid is skipped separately.

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Table | `hybrid` | Native CSS recipe + light-DOM `harmony-table` |

## Approach & stack fit (user confirmed)

- Base look on bare `table` / `thead` / `th` / `tbody` / `tr` / `td` (no `.table` required)
- Modifiers: `.table--header-white|none`, `.table--striped`, `.table--reorderable`, `.table--grouped`, `.table--command-center`, structural `.table-wrapper` / bars, row state classes
- Reset `table` stays minimal; chrome in `table.css`
- CE: `shadowRootInit = null`; attr→class map; both paths documented equal
- Forced-colors via document CSS (light DOM)

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Core chrome, sort header, reorder, grouped, selection events | **Include** |
| CC styling + toolbar/aside slots + filter-click | **Include** |
| Filter popovers / sort&filter algorithms | **Skip** — host |
| Title-bar window chrome behavior | **Skip** — demo only |
| TableCostpointGrid | **Skip** (element skip) |
| Keyboard reorder | **Defer** |
| CommandCenterPanel inside Table | **Skip** — compose in `aside` slot |

## Consumer API (user confirmed)

### Native recipe

| Field | Value |
|-------|-------|
| Analog | `table`, `thead`, `th`, `tbody`, `tr`, `td` |
| Base | Unclassed `table` = default gray-header Harmony table |
| Modifiers | `.table--header-white`, `.table--header-none`, `.table--striped`, `.table--reorderable`, `.table--grouped`, `.table--command-center` |
| Structure | Optional `.table-wrapper`, `.table__filter-bar`, `.table__title-bar`, `.table__action-bar`, row classes |
| A11y | Real table semantics; forced-colors via document CSS |

### Hybrid CE

| Field | Value |
|-------|-------|
| Tag | `harmony-table` |
| Light DOM | yes (`shadowRootInit = null`) |
| Attrs | `header-variant`; `variant`; `striped`; `reorderable`; `grouped`; `grouped-default-expanded`; `sort-column`; `sort-direction`; `columns` (JSON); optional `selected-row-ids` |
| Slots | `filter-bar`, `title-bar-content`, `title-bar-icons`, `action-bar`, `command-center-toolbar`, `command-center-aside`, `header`, `body` |
| Events | `table-reorder`, `sort-change`, `filter-click`, `expand-change`, `selection-change`, `row-select` |
| Methods | `expandAll`, `collapseAll`, `setExpanded`, `getExpanded`, `getSelected`, `getOrder` |
| Docs | `docs/components/Table.md`, CEM (CE only), AGENTS, llms |

## Blocking dependencies

TableCostpointGrid skipped. Button, Checkbox, Chip, Dropdown, Icon synced for demos.

## Phases

### Phase 1 — Apply

- `table.css` + product bundle import; `HarmonyTable` light-DOM CE; CEM; register
- Demo `/components/tables` (CP grid = gap placeholder)
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`
