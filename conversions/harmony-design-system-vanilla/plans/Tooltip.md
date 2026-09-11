# Conversion plan — Tooltip

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Tooltip` |
| status | `completed` |
| createdAt | `2026-09-10T19:43:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `22% (12/55)` |

## Summary

Ship Tooltip as a **web-component** `<harmony-tooltip>`. Open Shadow DOM; hover + focus-within show; Escape hides; `text` attr or `content` slot; position and corner-variant attrs. Port Astro absolute CSS into the shadow sheet (not Popover/anchor).

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Content — **resolved:** `text` attr + `content` slot (slot wins)
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Tooltip | `web-component` | Tag `harmony-tooltip`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Open Shadow DOM on `HarmonyElement`
- Absolute positioning CSS ported from reference `.tooltip*` (not Popover/anchor)
- Default slot = trigger; `content` slot for rich HTML (wins over `text`)
- Show on `:host(:hover)` and `:host(:focus-within)`; Escape dismisses (WCAG 1.4.13)
- A11y: `role="tooltip"` on bubble; `ariaDescribedByElements` + light-DOM description node
- Forced-colors: shadow-local
- No public `.tooltip` recipe (CE-only)

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Public `.tooltip` CSS recipe | **Skip** — CE-only |
| `title`-attribute tooltip as product API | **Skip** |
| Show delay / click-to-pin / touch | **Skip** |
| Popover / CSS anchor API | **Skip** this version |
| Focus + `aria-describedby` (docs claim; Astro CSS hover-only) | **Include** — vanilla AA |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-tooltip` |
| Attrs | `text`; `position` top\|bottom\|left\|right (default top); `corner-variant` optional top\|bottom\|left\|right |
| Slots | **default** = trigger; **`content`** = rich HTML (wins over `text`) |
| Events | none |
| Parts | `content` |
| Form | none |
| A11y | `role="tooltip"`; associate trigger; Escape hides; forced-colors shadow-local |
| Omissions | No public CSS recipe; no delay/touch/Popover |
| Docs | `docs/components/Tooltip.md`, CEM, AGENTS, llms |

## Blocking dependencies

None. Button and Icon are `synced` (demo triggers).

## Phases

### Phase 1 — Apply

- Port tooltip CSS into shadow sheet + `HarmonyTooltip`; CEM; register
- Demo `/components/tooltips`
- Docs / AGENTS / llms; flatten

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Tooltip-2; execute 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy + Consumer API (with content slot) |
| User | 2026-09-10 | Explicitly requested implement plan |
| Verifier | 2026-09-10 | Tooltip-2 PASS |
