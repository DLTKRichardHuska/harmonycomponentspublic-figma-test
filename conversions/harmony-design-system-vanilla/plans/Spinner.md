# Conversion plan — Spinner

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Spinner` |
| status | `completed` |
| createdAt | `2026-09-11T19:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship Spinner as a **web-component** `<harmony-spinner>` with open Shadow DOM. CSS border spinner in shadow; no public `.spinner` recipe.

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Spinner | `web-component` | Tag `harmony-spinner`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Open Shadow DOM on `HarmonyElement`
- Port `.spinner*` visual into shadow sheet
- `role="status"` + label; forced-colors shadow-local
- No public document `.spinner` recipe

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Public `.spinner` recipe | **Skip** — CE-only |
| Events / determinate progress | **Skip** — use ProgressBar |
| Custom label | **Include** — `label` attr (default Loading) |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-spinner` |
| Attrs | `size` sm\|md\|lg (md); `label` (default Loading) |
| Events | none |
| Slots / parts | none / `spinner` |
| Form | none |
| A11y | status live region; `aria-label` from `label`; forced-colors shadow-local |
| Docs | `docs/components/Spinner.md`, CEM, AGENTS, llms |

## Blocking dependencies

None.

## Phases

### Phase 1 — Apply

- Shadow sheet + `HarmonySpinner`; CEM; register
- Demo `/components/spinner`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`
