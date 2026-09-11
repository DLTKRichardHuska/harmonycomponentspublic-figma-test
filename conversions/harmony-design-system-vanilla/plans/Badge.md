# Conversion plan — Badge

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Badge` |
| status | `completed` |
| createdAt | `2026-09-10T18:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship Badge as a **web-component**: `<harmony-badge>` with open Shadow DOM. NotificationBadge out of scope. No public `.badge` recipe required.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Badge | `web-component` | Tag `harmony-badge`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Open Shadow DOM; optional `icon` → inner `harmony-icon`
- Default slot = label
- `disabled` is visual variant only
- Forced-colors: shadow-local
- Demo “stable” markers → `<harmony-badge variant="success">`

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Public `.badge` recipe | **Skip** — CE-only |
| NotificationBadge | **Out of scope** |
| Events | **None** |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-badge` |
| Attrs | `variant` default\|primary\|success\|warning\|error\|info\|orange\|pink\|disabled; `size` small\|medium\|large (default large); optional `icon` |
| Slots | default = label |
| Parts | `icon` |
| Events | none |
| Form | none |
| Docs | `docs/components/Badge.md`, CEM, AGENTS, llms |

## Blocking dependencies

Icon is `synced`.

## Phases

### Phase 1 — Apply

- Shadow sheet + `HarmonyBadge`; CEM; register
- Demo `/components/badges`; dogfood stable markers where practical
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Badge-2; plan execute approval 2026-09-10.
