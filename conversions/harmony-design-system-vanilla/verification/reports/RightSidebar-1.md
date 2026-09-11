# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `RightSidebar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T23:25:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 5 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/shell/right-sidebar` (HTTP 200; CP light + dark) |
| converted | Live `http://localhost:5178/shell/right-sidebar` (HTTP 200; pierce `demo-app` / `demo-right-sidebar-page`; product Costpoint + Vantagepoint) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/right-sidebar-1/` |
| metrics | `verification/artifacts/right-sidebar-1/visual-metrics.json`, `expand-dela-a11y.json`, `compare-inventory.json` |

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No consumer `variant` / multi-theme simultaneous DOM | deferred | Approved gap |
| No Astro ShellPanel DOM mutation (event-only) | deferred | Approved gap |
| No Astro `class` prop passthrough | deferred | Approved gap |
| Educational Behavior / Theme Variants / Styling / Accessibility cards | n/a | Peer shell pattern |
| Dela icon names `RS_DelaDefault` / `RS_Dela_Active` | n/a | Approved |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Right Sidebar | present | |
| Live Demo CP rail | present | |
| Expand on hover / labels | present | Width — DEF-001 |
| VP/PPM/Maconomy sets via product | present | |
| API + consume snippets | present | |
| Custom / expanded / panel-open demos | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| CP light section chrome | Off-white panels; 12px left radius; XL shadow | Same | present |
| CP dark section chrome | Charcoal panels | Same | present |
| Collapsed width | 52px | 52px | present |
| Expanded / hover width | 220px | ~186px | different (DEF-001) |
| CP item set | 9 labels / 3 sections | Same | present |
| Top section height | ~146px | ~158px | different (DEF-002) |
| Dela glyph | Taller logo mark | 24×24 in 36 wrap | different (DEF-002) |
| panel-open active Dela | Gradient tile | Gradient + RS_Dela_Active | present |

**Visual gaps (open):** 2

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | FAIL — do not sync until remediate + AskQuestion |

## Defects

### DEF-001
- **status:** fixed
- **category:** visual
- **description:** Designer would see narrower expanded right rail (~186px vs 220px) on converted docs.
- **remediationHint:** Absolute inline/demo positioning like reference, or `flex-shrink: 0` / `min-width: 220px` on `:host([inline])`.
- **fix:** RightSidebar-2 — `:host([inline])` absolute; expand 220px

### DEF-002
- **status:** fixed
- **category:** visual
- **description:** Designer would see smaller Dela glyph and slightly taller top section.
- **remediationHint:** Make Dela `harmony-icon` fill 36×36 tile.
- **fix:** RightSidebar-2 — `--harmony-icon-size: 36px` on dela logo

### DEF-003 / DEF-004 / DEF-005
- **status:** deferred — approved gaps (variant, ShellPanel mutation, class passthrough)

## Verifier notes
Readonly designer compare; fixed non-inline host is 220px — FAIL is docs `inline` surface parity.
