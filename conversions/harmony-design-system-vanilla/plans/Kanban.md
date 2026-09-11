# Conversion plan — Kanban

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Kanban`, `KanbanCard`, `KanbanCardCostpoint` |
| status | `completed` |
| createdAt | `2026-09-11T01:34:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Do **not** convert the Kanban catalog family to vanilla. Human decision 2026-09-10.

## Open questions

- [x] Element strategy — **resolved:** `skip` for the family

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Kanban | `skip` | No package export |
| KanbanCard | `skip` | Follows board skip |
| KanbanCardCostpoint | `skip` | CP-only in reference; same family |

## Consumer API

Not applicable (`skip`). No `harmony-kanban` tag, native recipe, or card exports.

## Demo

Keep `/components/kanban` (and `/cp/kanban` if routed) as accepted-gap placeholders so navigation still matches the reference docs site. Do not implement live examples.

## Manifest

`status: gap`, `strategy: skip`, `userDecision` set so coverage counts the accepted skip.
