# Conversion plan — RightSidebar

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `RightSidebar` |
| status | `completed` |
| createdAt | `2026-09-11T23:20:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship catalog **web-component** `harmony-right-sidebar`: product-kit default sections (Dela AI first), hover-expand right rail, controlled `active-id` / `panel-open` / `expanded` / `inline`, `sections` override, `right-sidebar-item-select` event (no ShellPanel DOM mutation).

## Element strategy (user confirmed)

| Element | Strategy | Tag |
|---------|----------|-----|
| RightSidebar | `web-component` | `harmony-right-sidebar` |

## Consumer API (user confirmed)

- Attrs: `active-id`, `expanded`, `panel-open`, `inline`
- Property: `sections` (item shape includes `customSrc` / `customSrcActive`)
- Event: `right-sidebar-item-select`
- Parts: `nav`, `section`, `item`, `icon`, `label`
- Gaps: no consumer `variant`; defer ShellPanel DOM mutation; no Astro `class` prop passthrough

## Blocking dependencies

Icon, Tooltip — synced.

## Approval

**Status: completed** — plan execute approved 2026-09-11; verifier PASS `RightSidebar-2`.
