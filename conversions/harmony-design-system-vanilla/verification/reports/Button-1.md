# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Button` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T00:35:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 6 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 9 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/buttons` (HTTP 200, CP light + dark) |
| converted | Live `http://localhost:5178/components/buttons` (HTTP 200, pierce `demo-app` / `demo-buttons-page` shadow, product Costpoint) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/button-1/` (`ref-sec-*.png`, `conv-sec-*.png`, `clip-xs.png`, `clip-unclassed2.png`, `conv-hc-top2.png`, `conv-forced-colors-*.png`) |
| metrics | `ref-deep.json`, `conv-deep.json`, `token-probe.json`, `shadow-vs-classes.json`, `compare-notes.json` |

Rendered evidence: Playwright browse of both routes. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| Hybrid strategy (native defaults + `.btn` + optional `harmony-button`) | deferred | Approved plan; not a defect |
| Dela / dela-pill + Stars live examples | deferred | Callout present on converted; no live Dela controls |
| Loading via private `.btn__spinner` (not catalog Spinner) | deferred | Accepted gap; spinner visible on loading demos |
| No `href` on `harmony-button` (use `a.btn`) | deferred | Documented; link demo present |
| Different HTML / Custom Elements vs Astro | n/a | Not defects per VERIFIER.md |
| Forced-colors look vs Astro | n/a | No reference HC baseline; HC focus/state remain usable |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Buttons + intro | present | Converted intro covers native / `.btn` / CE hybrid |
| Article nav (Examples / Props / Usage / Accessibility) | different | Converted uses in-page `h2` sections without top article-nav chips |
| Examples: Button Types (theme + page header) | present | Colors match CP primary / page-header navy when `.btn--primary` is set |
| Examples: Variants (6) | present | Primary/secondary/tertiary/outline/ghost/destructive |
| Examples: Dela Buttons | deferred | Yellow deferred callout (approved) |
| Examples: Sizes xs–lg | present | Heights 24/32/40/48 match reference; **label color wrong** on size row (see DEF-001) |
| Examples: With Icons | different | Missing **Download**; Edit/Share variants OK |
| Examples: Icon Only (sizes + variant row) | present | Four size squares + five variant icon buttons |
| Examples: States (theme + page header) | present | Default/disabled pairs |
| Examples: Loading State | present | Native spinner + `harmony-button` loading |
| Examples: Full Width | present | Primary + outline full width |
| Examples: Vertical Orientation | present | Theme + page-header rows |
| Examples: Button Combinations | different | Missing Confirm / Reject row |
| Section: Props / API | present | Hybrid API table (strategy-appropriate) |
| Section: Usage Guidelines (When to use + Do/Don't) | missing | Not on converted page |
| Section: Accessibility | present | Condensed guidance; icon-only `aria-label` called out |
| npm + static consume snippets | present | Both snippets shown |
| Native defaults demo (strategy) | present | Extra vs reference; expected for hybrid |
| Hybrid helper demo | different | CE examples lose labels (DEF-006) |
| `stable` badge | missing | Reference shows green stable badge |

**Content gaps (open):** 4 (Download; Confirm/Reject; Usage Guidelines; Hybrid labels) — badge treated under visual/structure notes in defects as lower priority folded into DEF-005 notes

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Theme primary fill (CP) | Solid `#2A78C6` / `rgb(42,120,198)`, white label | Same fill on `.btn--primary`; **unclassed / size-only `<button>` show dark gray label on blue** | different |
| Page-header primary | Solid `#043852` / `rgb(4,56,82)`, white label | Matches when `.btn--page-header.btn--primary` | present |
| Secondary / tertiary / outline / ghost / destructive | Blue stroke secondary; blue tertiary text; gray outline; gray ghost; red destructive | Same rendered colors on classed variants | present |
| Label weight | Medium (500) Figtree | Native `<button>` in demo shadow renders Regular (400); `a.btn` / `harmony-button` stay 500 | different |
| Sizes xs–lg | White labels; heights 24/32/40/48; fonts 12/14/16/18 | Heights/fonts match; **dark labels on blue** for `.btn--xs`…`lg` without `.btn--primary` | different |
| With icons row | Add / Continue / Download / Edit / Share | Add / Continue / Edit / Share — no Download; Add/Continue dark-on-blue | different |
| Icon-only primaries | White glyphs on blue squares | Squares present; computed label color inherited dark (icons may still read) | different |
| Loading | Spinner + muted loading chrome | Private SVG spinner; loading affordance present | present |
| Full width | White-on-blue primary bar | Blue bar with **dark** label text | different |
| Vertical | Icon above label, theme + page-header | Layout present | present |
| Dela | Gradient + Stars live buttons | Deferred callout only | deferred |
| Dark mode primary | Inverse-appropriate contrast | Product dark tokens apply; unclassed still inherits host text color (DEF-001) | different |
| Forced-colors | n/a | Controls remain bounded; focus outline visible; disabled distinguishable | present |

**Visual gaps (open):** 5 (inverse text on default buttons; weight; sizes/icons/full-width knock-ons; with-icons completeness covered under structure)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Do not mark manifest `synced`. AskQuestion before accepting any open visual/structure items. |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Unclassed primary and size-scaled primary buttons show **white** labels on solid theme-primary blue.
- **converted:** On the demo review surface (`demo-buttons-page` shadow), unclassed `<button>`, `.btn--xs`…`lg`, `.btn--full`, icon-only defaults, and other native buttons **without** `.btn--primary` show **dark gray** labels (`rgb(55,63,78)`) on the same blue fill. Clip evidence: `clip-xs.png`, `clip-unclassed2.png`. Light-DOM injection against product `styles.css` is correct (white + weight 500) — failure is on the Shadow/`buttonSheet` review path.
- **description:** Designer would see primary-looking buttons with low-contrast dark text on blue instead of white-on-blue, including Native defaults, Sizes, With icons (Add/Continue), Full width, and default state samples.
- **evidence:** Live `:5178/components/buttons` (CP light); `shadow-vs-classes.json`; `token-probe.json` (light DOM OK vs shadow broken); `--text-inverse` resolves to `#FFFFFF` but computed `color` stays inherited.
- **remediationHint:** `demoChromeSheet` in `apps/demo/src/demo/elements/shared.js` applies `button, select { font: inherit; color: inherit; }` **after** `buttonSheet`, overriding inverse text and medium weight. Scope the reset away from Harmony buttons (or drop color/font resets once `buttonSheet` is adopted).

### DEF-002

- **status:** open
- **category:** visual
- **reference:** Button labels use medium weight (computed `font-weight: 500`).
- **converted:** Native `<button>` examples in the demo shadow compute `font-weight: 400` even with `.btn--primary`. Anchors with `.btn` and `<harmony-button>` remain 500.
- **description:** Designer would see slightly lighter label type on native button demos vs reference.
- **evidence:** `ref-deep.json` vs `conv-deep.json`; same root cause as DEF-001 (`font: inherit` in `demoChromeSheet`).
- **remediationHint:** Same as DEF-001 — stop inheriting font onto styled Harmony buttons in demo chrome.

### DEF-003

- **status:** open
- **category:** structure
- **reference:** With Icons includes **Download** (`arrow-down-tray`) between Continue and Edit.
- **converted:** With icons row has Add Item, Continue, Edit, Share only — Download missing.
- **description:** Designer would notice a missing Download example in the icon+label set.
- **evidence:** Reference `buttons.astro` With Icons; converted `DemoButtonsPage.js`; `ref-sec-with-icons.png` vs `conv-sec-with-icons.png`.
- **remediationHint:** Add a Download primary button with `harmony-icon` name `arrow-down-tray`.

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Button Combinations includes a third row: Confirm (primary + check) and Reject (secondary + x-mark).
- **converted:** Combinations only show Save/Cancel and Delete/Cancel.
- **description:** Designer would miss the Confirm/Reject pattern pair present on reference.
- **evidence:** Reference combinations section; `DemoButtonsPage.js` Combinations block; `conv-sec-combinations.png`.
- **remediationHint:** Add Confirm/Reject row matching reference variants/icons.

### DEF-005

- **status:** open
- **category:** structure
- **reference:** Usage Guidelines with “When to Use…” lists plus Do / Don't guideline cards; green `stable` badge on title.
- **converted:** No Usage Guidelines / Do-Don't section; no `stable` badge.
- **description:** Designer would miss the usage guidance block that teaches when to use theme vs page-header and each variant.
- **evidence:** Reference `#usage` section; converted page headings inventory in `conv-deep.json` (`hasUsage: false`).
- **remediationHint:** Port Usage Guidelines content (or explicitly defer with human acceptance if educational-only is out of scope).

### DEF-006

- **status:** open
- **category:** behavior
- **reference:** n/a (hybrid CE is conversion-added); expected labeled CE demos per page markup: Save, Add Item, Continue, Delete.
- **converted:** Hybrid helper `<harmony-button>` instances with light-DOM labels render as **empty / icon-only** controls (e.g. `variant=primary` width ~32px with no “Save” text; Add Item / Continue / Delete collapse to `btn--icon-md`). Loading CE with `loading-text` works.
- **description:** Designer would see a broken hybrid helper gallery — icon squares instead of labeled hybrid buttons — undermining the documented CE path.
- **evidence:** `conv-sec-hybrid.png`; runtime attrs show missing textContent and icon-only classes; live `:5178` Hybrid helper section.
- **remediationHint:** Fix `HarmonyButton` light-DOM text / slot timing when constructed via host `innerHTML`, and/or set labels so CE demos show the intended labeled variants.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Content inventory + three-column visual matrix completed from live browse + Playwright captures (DESIGNER_COMPARE / VISUAL_MATCH_GATE).
- Product CSS in the document (light DOM probe) matches reference primary inverse text and weight; **demo Shadow review surface does not** because `demoChromeSheet` overrides `buttonSheet`.
- Forced-colors: focus outline and non-color disabled cues present; not failed solely for HC palette differences.
- WCAG: DEF-001 is also an AA contrast concern (dark gray on `#2A78C6`).
- Manifest must **not** be marked `synced` on this recommendation.

**FAIL** — open conversion defects remain (DEF-001–DEF-006).
