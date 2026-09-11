# Conversion plan — ProgressBar

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `ProgressBar` |
| status | `completed` |
| createdAt | `2026-09-10T18:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship ProgressBar as a **web-component**: `<harmony-progress>` with open Shadow DOM. Unblocks Alert (enhanced `progressValue`). No public `.progress` CSS recipe; no HTML `<progress>`.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| ProgressBar | `web-component` | Tag `harmony-progress`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Open Shadow DOM on `HarmonyElement`
- Fill width computed in shadow (no consumer inline style)
- `ElementInternals` role=progressbar + aria-valuenow/min/max
- Label is percentage text (`show-label`), not a slot
- Forced-colors: shadow-local
- Sheets: `progressCss` / `progressSheet` for other shadow hosts

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| HTML `<progress>` | **Skip** — unreliable cross-browser for Harmony radii/tokens |
| Public `.progress` recipe | **Skip** — CE-only surface |
| Events | **None** — determinate display only |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-progress` |
| Attrs | `value` (0), `max` (100), `size` sm\|md\|lg (md), `variant` default\|success\|warning\|error, `show-label` |
| Events | none |
| Parts | `track`, `bar`, `label` |
| Form | none |
| A11y | ElementInternals progressbar; forced-colors shadow-local |
| Docs | `docs/components/ProgressBar.md`, CEM, AGENTS, llms |

## Blocking dependencies

None.

## Phases

### Phase 1 — Apply

- Port progress CSS into shadow sheet + generated module
- `HarmonyProgress`; CEM; register
- Demo `/components/progress-bar`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS ProgressBar-2; plan execute approval 2026-09-10.
