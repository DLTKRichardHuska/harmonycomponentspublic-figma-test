# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Button` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T00:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 6 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 10 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/buttons` (HTTP 200, CP light + dark) |
| converted | Live `http://localhost:5178/components/buttons` (HTTP 200, pierce `demo-app` / `demo-buttons-page` shadow, product Costpoint) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/button-2/` (`ref-sec-*.png`, `conv-sec-*.png`, `clip-*.png`, `conv-cp-dark-*.png`, `conv-hc-*.png`) |
| metrics | `compare-metrics.json`, `clips-and-variants.json`, `dark-hc-focus.json`, `dark-destr-compare.json` |

Rendered evidence: Playwright browse of both routes (section clips + computed styles). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| Hybrid strategy (native defaults + `.btn` + optional `harmony-button`) | deferred | Approved plan; not a defect |
| Dela / dela-pill + Stars live examples | deferred | Yellow deferred callout on converted; accepted gap |
| Loading via private `.btn__spinner` (not catalog Spinner) | deferred | Accepted gap; spinner visible on loading demos |
| No `href` on `harmony-button` (use `a.btn`) | deferred | Documented; link demo present |
| Astro docs `stable` badge on title | deferred | Reference maturity chip only; not Button API / example fidelity |
| Different HTML / Custom Elements vs Astro | n/a | Not defects per VERIFIER.md |
| Forced-colors look vs Astro | n/a | No reference HC baseline; HC focus/state remain usable |
| Article-nav chips vs in-page `h2` sections | n/a | Equivalent section coverage; not a designer content gap |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Buttons + intro | present | Converted intro covers native / `.btn` / CE hybrid |
| Examples: Button Types (theme + page header) | present | CP primary `#2A78C6` / page-header navy match |
| Examples: Variants (6) | present | Primary/secondary/tertiary/outline/ghost/destructive |
| Examples: Dela Buttons | deferred | Callout present (approved) |
| Examples: Sizes xs–lg | present | Heights 24/32/40/48; white labels; weight 500 |
| Examples: With Icons | present | Add / Continue / **Download** / Edit / Share |
| Examples: Icon Only | present | Size squares + variant icon buttons |
| Examples: States | present | Default/disabled theme + page-header |
| Examples: Loading State | present | Native spinner + `harmony-button` loading |
| Examples: Full Width | present | White-on-blue primary bar |
| Examples: Vertical Orientation | present | Theme + page-header rows |
| Examples: Button Combinations | present | Save/Cancel, Delete/Cancel, **Confirm/Reject** |
| Section: Props / API | present | Hybrid API table + npm/static snippets |
| Section: Usage Guidelines | present | When to use types/variants + Do / Don't |
| Section: Accessibility | present | Native preference + icon-only `aria-label` + CE form note |
| Hybrid helper demo | present | Labeled Save / Add Item / Continue / Delete; icon-only Edit |
| Native defaults demo | present | Extra vs reference; expected for hybrid |
| `stable` badge | deferred | See approved deferred |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Theme primary fill (CP light) | Solid `rgb(42,120,198)`, white label, weight 500 | Same on unclassed + `.btn--primary` | present |
| Page-header primary | Solid `rgb(4,56,82)`, white label | Matches `.btn--page-header.btn--primary` | present |
| Secondary / tertiary / outline / ghost / destructive (light) | Blue stroke secondary; blue tertiary; gray outline/ghost; red destructive + white | Same rendered colors and weights | present |
| Label weight | Medium (500) | Native + CE compute 500 (chrome no longer forces inherit) | present |
| Sizes xs–lg | White-on-blue; 24/32/40/48 | Same heights/fonts/colors | present |
| With icons | Add / Continue / Download / Edit / Share | Same set; white-on-blue primaries | present |
| Icon-only | White glyphs on blue squares | Present and readable | present |
| Loading | Spinner + muted loading chrome | Private SVG spinner; same affordance (Processing low-contrast also on reference) | present |
| Full width | White-on-blue primary bar | White label on blue full-width | present |
| Vertical | Icon above label | Layout present | present |
| Combinations Confirm/Reject | Primary check + secondary Reject | Present and matching variants | present |
| Hybrid CE labels | n/a (conversion-added) | Save / Add Item / Continue / Delete show as labeled buttons | present |
| Dela | Live gradient buttons | Deferred callout only | deferred |
| Dark mode primary | Light blue `rgb(89,172,255)` + dark text | Matches (CP) | present |
| Dark mode destructive | Pink `rgb(244,98,134)` + dark text | Matches when product=CP | present |
| Forced-colors | n/a | Borders + focus outline; disabled distinguishable (non-color) | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Do **not** mark manifest `synced` until human confirms (AskQuestion). Deferred items above remain accepted gaps from plan. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** Unclassed / size / full-width primaries show white labels on theme-primary blue.
- **converted (iter 1):** Dark gray labels on blue via `demoChromeSheet` `button { color/font: inherit }` winning over `buttonSheet`.
- **converted (iter 2):** Unclassed Primary, sizes, Download, full-width compute `color: rgb(255,255,255)` and `font-weight: 500`. Clips: `clip-unclassed.png`, `clip-xs.png`, `clip-full.png`.
- **description:** Remediation confirmed — designer sees white-on-blue again on the demo shadow review surface.
- **evidence:** Live `:5178/components/buttons`; `compare-metrics.json` unclassed/sizes; section screenshots.

### DEF-002

- **status:** fixed
- **category:** visual
- **reference:** Label weight 500.
- **converted (iter 1):** Native `<button>` in shadow computed 400.
- **converted (iter 2):** Native demos compute 500 (same root cause fix as DEF-001).
- **evidence:** `compare-metrics.json`; `clips-and-variants.json`.

### DEF-003

- **status:** fixed
- **category:** structure
- **reference:** With Icons includes Download.
- **converted (iter 2):** Download present with `arrow-down-tray` icon; white-on-blue.
- **evidence:** `conv-sec-with-icons.png`, `clip-download.png`, `ref-sec-with-icons.png`.

### DEF-004

- **status:** fixed
- **category:** structure
- **reference:** Combinations Confirm / Reject row.
- **converted (iter 2):** Confirm (primary + check) and Reject (secondary + x) present.
- **evidence:** `conv-sec-combinations.png`, `ref-sec-combinations.png`.

### DEF-005

- **status:** fixed
- **category:** structure
- **reference:** Usage Guidelines (When to use + Do/Don't).
- **converted (iter 2):** Usage guidelines section present with type/variant guidance and Do/Don't lists. (`stable` badge remains deferred — see approved table.)
- **evidence:** `conv-sec-usage-guidelines.png`, `ref-sec-usage-guidelines.png`.

### DEF-006

- **status:** fixed
- **category:** behavior
- **reference:** Hybrid CE demos should show intended labels.
- **converted (iter 1):** Empty / icon-only collapsed CE instances.
- **converted (iter 2):** `harmony-button` Save (~67px labeled), Add Item, Continue, Delete render with light-DOM text; icon-only Edit intentional.
- **evidence:** `conv-sec-hybrid.png`, `clip-hybridSave.png`; hybrid inventory in `compare-metrics.json`.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Content inventory + three-column visual matrix completed from live browse + Playwright captures (DESIGNER_COMPARE / VISUAL_MATCH_GATE).
- Remediations verified: `demoChromeSheet` no longer resets button color/font; `buttonSheet` after chrome on DemoButtonsPage/DemoHeader; HarmonyButton preserves light-DOM labels; Download, Confirm/Reject, Usage guidelines added.
- Dark mode and forced-colors checked on CP; HC not failed for Astro palette differences.
- Focus: converted uses visible box-shadow focus treatment; keyboard focus affordance present.
- API / docs: `docs/components/Button.md`, `AGENTS.md`, `llms.txt`, CEM `harmony-button` present; demo shows npm + static consume snippets.
- Manifest must **not** be marked `synced` on this recommendation alone — human confirmation required.

**PASS** — zero open conversion defects (DEF-001–DEF-006 fixed; approved gaps remain deferred).
