# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Tooltip` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T20:03:55.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 5 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/tooltips` (CP light/dark) |
| converted | Live `http://localhost:5178/components/tooltips` (CP light/dark, forced-colors) |
| capture | `verification/artifacts/tooltip-1/capture.mjs` |
| metrics | `verification/artifacts/tooltip-1/compare-notes.json`, `a11y-probe.json` |
| screenshots | `verification/artifacts/tooltip-1/` (`ref-hover-*`, `conv-hover-*`, dark, forced-colors) |

Rendered evidence: Playwright browse of matching routes. Demo server was restarted once during verify (Vite had stale resolve for unrelated `dialogCss`); afterward both routes rendered.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.tooltip` CSS recipe | deferred | Plan / manifest accepted; CE-only |
| No `title`-attribute tooltip API | deferred | Plan accepted |
| No show delay / click-to-pin / touch / Popover | deferred | Plan accepted |
| `content` slot (rich HTML) as production addition | deferred | Plan intentional; visual OK |
| Custom Element / open Shadow DOM vs Astro span | n/a | Not a defect |
| Focus-within + Escape (beyond Astro CSS hover-only) | n/a | Approved AA addition |
| `stable` maturity chip on reference title | deferred | Docs chrome |
| Forced-colors look vs Astro | n/a | No reference HC baseline; shadow-local rules present |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Tooltips + intro | present | Converted intro is CE-oriented (expected) |
| Section: Examples | present | |
| Basic Tooltip | present | Hover me + tip text match |
| Positions (top/bottom/left/right) | present | |
| On Different Elements (icon + dotted help text) | present | |
| Corner Variants (four) | present | |
| Props / API table | present | Named API; attrs match Consumer API |
| Accessibility guidance | present | Condensed single card; covers role, association, focus, Escape, critical-info warning |
| npm + static consume snippets | present | |
| Rich content slot demo | deferred | Intentional addition (not on reference) |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tip (CP light) | Dark charcoal bubble, white "This is a tooltip", 12px, 8x12 pad, 6px radius, arrow down, centered above outline button | Same measured colors/size/padding/radii/relTop (-42); matches | present |
| Position bottom | Tip below trigger, upward arrow, same charcoal/white | Same opacity/colors; relTop +48 matches | present |
| Position left | Tip left of trigger, arrow pointing right | Same size/colors; relLeft -114 matches | present |
| Corner top | Sharp top-left radius 0; other corners 6px; CSS arrow hidden | Same radii; `::after` display none | present |
| Icon trigger tip | Dark tip above info icon | Same treatment | present |
| Dark mode tip | Light gray bubble `rgb(233,236,239)`, dark text `rgb(31,37,46)` | Identical measured colors | present |
| Forced-colors | (no Astro baseline) | Canvas/CanvasText tip + 1px border + visible arrow; usable | present |
| Rich content tip | n/a (intentional add) | Dark tip shows "More detail in the tip" on hover | present (visual) |

**Visual gaps (open):** 0

## Behavior / a11y / API

| Check | Result |
|-------|--------|
| Hover show / hide | present |
| Focus-within show | present |
| Escape dismiss (`data-dismissed` -> hidden) | present |
| `role="tooltip"` on bubble; `aria-hidden` on visual bubble | present |
| `aria-describedby` / `ariaDescribedByElements` for **text** tips | present (desc text matches) |
| Description node for **content** slot tips | **FAIL** — see DEF-001 |
| Forced-colors shadow-local sheet | present |
| Docs / CEM / AGENTS / llms | present |
| Consumer API attrs `text`, `position`, `corner-variant`; slots; part `content` | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends FAIL until DEF-001 fixed (or human accepts). AskQuestion before sync. |

## Defects

### DEF-001

- **status:** open
- **category:** a11y
- **reference:** n/a for rich slot (intentional production addition); approved Consumer API requires trigger association with tip text for SR users
- **converted:** Rich `content` slot tip renders visually ("More detail in the tip"), but the light-DOM `[data-harmony-tooltip-desc]` node stays **empty** while `aria-describedby` still points at it
- **description:** Designer/SR outcome: a keyboard or AT user focusing a rich-content tooltip hears no tip text (blank description), even though sighted users see the slotted HTML on hover/focus.
- **evidence:** Live evaluate on `/components/tooltips` — tip with `slot="content"` has assigned text "More detail in the tip" but `descText: ""`; text-attr tips sync correctly. Likely cause: `#descriptionText()` uses `innerText` while the bubble is `visibility: hidden`, so slotted `innerText` is empty at sync time and never refreshed when shown.
- **remediationHint:** Prefer `textContent` (or sync description on show / after layout) when reading the content slot for the description node; re-sync on `slotchange`.

## Blocked items

None (after demo restart). Earlier blank page was Vite failing to resolve `dialogCss.js` (stale module graph); not a Tooltip visual defect.

## Verifier notes

- Content + three-column visual matrices completed from rendered evidence (not source-only).
- Visual tip chrome (color, type, padding, position, corners, dark, HC) matches reference for text-attr examples.
- FAIL solely on approved a11y contract for the intentional `content` slot path (DEF-001).
- Do not mark manifest `synced` on this report.
