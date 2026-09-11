# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Tooltip` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T20:06:30.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Tooltip-1.md` (FAIL; DEF-001 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 5 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/tooltips` (CP light) |
| converted | Live `http://localhost:5178/components/tooltips` (CP light/dark, forced-colors) |
| reverify | `verification/artifacts/tooltip-2/reverify.json` |
| screenshots | `verification/artifacts/tooltip-2/` (`ref-hover-basic.png`, `conv-hover-basic.png`, `conv-hover-rich.png`, dark, forced-colors) |

Rendered evidence: Playwright browse after DEF-001 remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.tooltip` CSS recipe | deferred | Plan / manifest accepted; CE-only |
| No `title`-attribute tooltip API | deferred | Plan accepted |
| No show delay / click-to-pin / touch / Popover | deferred | Plan accepted |
| `content` slot (rich HTML) as production addition | deferred | Plan intentional |
| Custom Element / open Shadow DOM vs Astro span | n/a | Not a defect |
| Focus-within + Escape (beyond Astro CSS hover-only) | n/a | Approved AA addition |
| `stable` maturity chip on reference title | deferred | Docs chrome |
| Forced-colors look vs Astro | n/a | No reference HC baseline |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Tooltips + intro | present | |
| Examples: Basic / Positions / Different elements / Corners | present | |
| Props / API table | present | |
| Accessibility guidance | present | |
| npm + static consume | present | |
| Rich content slot demo | deferred | Intentional addition |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tip (CP light) | Charcoal bubble, white "This is a tooltip", visible on hover | Same colors (`rgb(55,63,78)` / white), 105x34 visible | present |
| Rich content tip | n/a (intentional add) | Dark tip shows slotted "More detail in the tip" (136x34) | present |
| Dark mode tip | Light gray bubble, dark text | `rgb(233,236,239)` / `rgb(31,37,46)` | present |
| Forced-colors tip | (no Astro baseline) | Canvas/CanvasText + usable border | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Tooltip-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Rich `content` slot left light-DOM description node empty | **fixed** — `descText` = "More detail in the tip"; all 12 tips `match` + non-empty |

## Behavior / a11y / API

| Check | Result |
|-------|--------|
| Hover show / hide | present |
| Focus-within show | present |
| Escape dismiss | present (`opacity:0`, `visibility:hidden`, `data-dismissed`) |
| Text-attr tips → description node | present (all match) |
| Rich `content` slot → description node | present (**fixed**) — assigned text copied into `[data-harmony-tooltip-desc]` |
| `aria-describedby` / `ariaDescribedByElements` | present |
| Forced-colors shadow-local | present |
| Docs / CEM / Consumer API surface | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS. AskQuestion before `elements.Tooltip.status = synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** a11y
- **description:** Rich content-slot description now uses `textContent`, re-associates on `slotchange`, and microtask re-sync after connect. Description node text matches slotted content.
- **evidence:** `tooltip-2/reverify.json` — `richDescText: "More detail in the tip"`, `richMatch: true`, `allDescNonEmpty: true`, `allMatch: true`

## Blocked items

None.

## Verifier notes

- Re-verified DEF-001 specifically plus spot-check of basic hover, dark, forced-colors, focus/Escape.
- Content + three-column visual matrices complete from rendered evidence.
- Do not mark manifest `synced` without human confirmation.
