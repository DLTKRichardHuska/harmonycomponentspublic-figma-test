# Conversion plan — CP skips (TableCostpointGrid, FloatingNav)

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `TableCostpointGrid`, `FloatingNav` |
| status | `completed` |
| createdAt | `2026-09-11T19:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Do **not** convert Costpoint-only `TableCostpointGrid` or `FloatingNav` to vanilla for now. Human decision 2026-09-11. Unblocks Table (shared tables demo) without requiring the CP grid.

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| TableCostpointGrid | `skip` | CP-only split datagrid; out of vanilla scope |
| FloatingNav | `skip` | CP-only chrome; out of vanilla scope |

## Consumer API

Not applicable (`skip`).

## Demo

- Tables demo: CP split-grid section = accepted-gap placeholder.
- FloatingNav route (if present) = accepted-gap placeholder.

## Manifest

`status: gap`, `strategy: skip`, `userDecision` recorded so coverage counts the accepted skip.
