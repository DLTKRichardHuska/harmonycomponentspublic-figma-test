# Conversion plan — Chip

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Chip` |
| status | `completed` |
| createdAt | `2026-09-10T18:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship Chip as a **web-component**: `<harmony-chip>` with open Shadow DOM. Body `click` for select/filter; `remove` CustomEvent on the remove control (remove does not bubble chip `click`). No public `.chip` recipe required.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Consumer API — **resolved:** see below (click + remove)

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Chip | `web-component` | Tag `harmony-chip`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Dots/overflow built in shadow
- `selected` is controlled (consumer sets attr)
- Production hover/focus/pressed via `:hover`/`:focus-visible`/`:active` (no `state` attr)
- Forced-colors: shadow-local

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Public `.chip` recipe | **Skip** — CE-only |
| Astro `state` attr | **Skip** — CSS pseudo-states |
| Controlled selected | **Include** — consumer toggles |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-chip` |
| Attrs | `size` sm\|md\|lg; `variant` fill\|outline; `type` chip\|horiz-dots\|vert-dots\|overflow; `overflow-count`; `selected`; `removable`; `icon`; `disabled` |
| Slots | default = label |
| Events | `click` (body); `remove` CustomEvent bubbles+composed (remove control stops chip click) |
| Parts | `icon`, `remove`, `dots` |
| Form | none |
| Docs | `docs/components/Chip.md`, CEM, AGENTS, llms |

## Blocking dependencies

Icon is `synced`.

## Phases

### Phase 1 — Apply

- Shadow sheet + `HarmonyChip`; CEM; register
- Demo `/components/chips`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Chip-2; plan execute approval 2026-09-10.
