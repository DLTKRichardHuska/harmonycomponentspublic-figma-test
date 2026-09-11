# Conversion plan — LeftSidebar

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `LeftSidebar` |
| status | `completed` |
| createdAt | `2026-09-11T22:49:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship catalog **web-component** `harmony-left-sidebar`: product-kit default sections, hover-expand rail, controlled `active-id` / `panel-open` / `expanded`, `sections` override, `left-sidebar-item-select` event (no ShellPanel DOM mutation).

## Element strategy (user confirmed)

| Element | Strategy | Tag |
|---------|----------|-----|
| LeftSidebar | `web-component` | `harmony-left-sidebar` |

## Consumer API (user confirmed)

- Attrs: `active-id`, `expanded`, `panel-open`, `inline` (docs embed)
- Property: `sections`
- Event: `left-sidebar-item-select`
- Parts: `nav`, `section`, `item`, `icon`, `label`
- Gaps: no consumer `variant`; defer ShellPanel DOM mutation

## Blocking dependencies

Icon, Tooltip — synced.

## Approval

**Status: completed** — plan execute approved 2026-09-11; verifier PASS `LeftSidebar-2`.
