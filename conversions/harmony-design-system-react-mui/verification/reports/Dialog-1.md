# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Dialog` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-20T20:40:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 5 |

**Result:** FAIL

In-scope examples compared live on `:4321` vs `:5176` (CP × light). Accepted skips honored for `headerVariant="primary"` / Combined Variants and `resizable`. Open visual/behavior gaps block PASS — most critically right-aligned footer actions render left-aligned.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/dialogs` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/dialogs` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/dialog-1/ref-page-top.png` |
| screenshot | `verification/artifacts/dialog-1/conv-page-top.png` |
| screenshot | `verification/artifacts/dialog-1/ref-basic-panel.png` / `conv-basic-panel.png` |
| screenshot | `verification/artifacts/dialog-1/ref-confirm-panel.png` / `conv-confirm-panel.png` |
| screenshot | `verification/artifacts/dialog-1/ref-three-panel.png` / `conv-three-panel.png` |
| screenshot | `verification/artifacts/dialog-1/ref-right-panel.png` / `conv-right-panel.png` |
| screenshot | `verification/artifacts/dialog-1/ref-long-panel.png` / `conv-long-panel.png` |
| screenshot | `verification/artifacts/dialog-1/ref-*-page.png` / `conv-*-page.png` (open-dialog page context) |
| probe | `verification/artifacts/dialog-1/ref-probe.json` |
| probe | `verification/artifacts/dialog-1/conv-probe.json` |
| inventory | `verification/artifacts/dialog-1/ref-inventory.json` / `conv-inventory.json` |
| capture script | `verification/artifacts/dialog-1/capture.mjs` |

## Content parity

Scoped to Dialog doc page. Accepted skips documented via `UnsupportedEquivalentCallout` (do not fail).

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Dialogs / sticky header-footer / 600–700px |
| Article nav (Examples, Layout, Props, Accessibility) | present | Converted also adds Harmony mapping (OK) |
| Examples: Basic Dialog | present | |
| Examples: Confirmation Dialog | present | |
| Examples: Three buttons (Yes, No, Cancel) | present | |
| Examples: Right-Aligned Buttons | present | Opens; alignment wrong — see visual DEF-001 |
| Examples: Long Content (Scrollable Body) | present | Opens; scroll behavior wrong — see DEF-002 |
| Examples: Primary Header Variant | accepted | `UnsupportedEquivalentCallout` for `headerVariant="primary"` |
| Examples: Combined Variants | accepted | Covered by same primary-header skip / userDecision |
| Examples: Resizable Dialog | accepted | `UnsupportedEquivalentCallout` for `resizable` |
| Section: Layout | present | |
| Section: Props | present | MUI-oriented props table (expected for existing-mui) |
| Section: Accessibility — ARIA Roles | present | |
| Section: Accessibility — Keyboard Navigation | present | |
| Section: Accessibility — Focus Management | present | |
| Section: Accessibility — Screen Reader Support | missing | Reference has fourth a11y card; converted omits it |
| Trigger buttons (Open Dialog, Delete Item, etc.) | present | Primary / destructive colors match intent |

**Content gaps (open):** 1 (Screen Reader Support)

## Visual parity

CP × light. In-scope open dialogs only. Resize grip on reference default dialogs noted as accepted skip (do not fail).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic — paper size / radius / shadow | ~700px wide, 12px radius, soft XL shadow, paper surface | Same 700px / 12px / matching shadow / paper surface | present |
| Basic — title + close | Bold Lexend title left; gray X right; header bottom divider | Same title/close rhythm and divider | present |
| Basic — body text | Secondary gray copy, padded | Matching secondary copy and padding | present |
| Basic — footer actions | Confirm (filled primary) then Cancel (outline) **left-aligned**; footer top divider | Same button styles and left alignment | present |
| Confirmation — destructive primary | Red Delete + blue outline Cancel, left-aligned | Same red Delete + outline Cancel, left-aligned | present |
| Three buttons — hierarchy | Yes filled, No outline, Cancel text/tertiary, left-aligned | Same three-button hierarchy and left alignment | present |
| Three buttons — short-label width | Yes/No/Cancel sized to label (narrower) | Each action forced to ~120px min-width (wider short labels) | different |
| Right-aligned — footer actions | Cancel then Confirm clustered at **footer right** | Cancel then Confirm clustered at **footer left** (large empty space on right) | different |
| Long scrollable — sticky chrome | Header + footer fixed; body overflows (~664 vs 600) and scrolls | Header + footer fixed; body content fits (~576 == 576) — **no scroll** | different |
| Backdrop | Dimmed overlay behind panel | Matching dimmed overlay | present |
| Resize grip (reference default) | Visible bottom-right grip on in-scope panels | Absent | accepted |
| Primary / Combined header examples | Live primary-blue headers on reference | Callouts only (skipped) | accepted |

**Visual gaps (open):** 3 (right align, long scroll, footer min-width)

## Side-by-side visual summary

| Example | Designer takeaway |
|---------|-------------------|
| Basic | Looks equivalent — title, close, body, left Confirm/Cancel |
| Confirmation | Looks equivalent — red Delete + outline Cancel |
| Three buttons | Hierarchy matches; short labels look wider on converted |
| Right-aligned | **Fails** — reference actions sit on the right; converted still left |
| Long scrollable | **Fails** — reference body scrolls under sticky chrome; converted shows all content without scroll |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **FAIL**. Accepted skips for primary header / resizable already recorded in manifest `userDecision` — not re-opened. Do not mark Dialog `synced`. |

**conversion-agent** must **AskQuestion** before any manifest status change when Status is `pending`.

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Right-Aligned Buttons — Cancel + Confirm sit at the **right** edge of the footer
- **converted:** Same example — Cancel + Confirm sit at the **left** edge; large empty footer on the right
- **description:** Designer would open Right-Aligned Buttons and see left-aligned actions on conversion while reference clearly right-aligns them. Composition `Stack width=100% justifyContent=flex-end` inside `DialogActions` does not stretch (measured Stack ~246px vs Actions 700px), so `flex-end` has no effect.
- **evidence:** Live `:4321` / `:5176` Right-Aligned example; `ref-right-panel.png` vs `conv-right-panel.png`; probes `ref-probe.json` / `conv-probe.json` (`right.footer.justifyContent` flex-end vs flex-start; firstBtnLeft ~859 vs ~394)
- **remediationHint:** Ensure the right-align composition fills DialogActions width (e.g. `sx={{ width: '100%' }}` that actually applies, or `DialogActions sx={{ justifyContent: 'flex-end' }}` for that instance) so buttons sit on the right like reference

### DEF-002

- **status:** open
- **category:** behavior
- **reference:** Long Content — body overflows max height; only body scrolls; header/footer stay fixed
- **converted:** Long Content — body content fits without overflow (`scrollHeight === clientHeight`); designer cannot scroll the body
- **description:** Designer would open Scrollable Body and expect a scrolling middle region under sticky chrome (as on reference). On conversion the panel shows all paragraphs without a scrollable overflow, so the example does not demonstrate the sticky scroll behavior.
- **evidence:** `ref-long-panel.png` vs `conv-long-panel.png`; probes long.body scrollHeight/clientHeight (664/600 vs 576/576); live re-check `canScroll: false` on `:5176`
- **remediationHint:** Match reference body rhythm/spacing so content overflows `maxHeight: 600px` (e.g. paragraph spacing closer to reference `space-y-4`), or otherwise ensure the demo body scrolls while title/actions remain fixed

### DEF-003

- **status:** open
- **category:** visual
- **reference:** Footer actions size to label width on desktop (Yes/No/Cancel relatively compact)
- **converted:** Footer `MuiButton` min-width ~120px always — short labels appear as equal wide pills
- **description:** Designer would notice wider Yes/No/Cancel (and other short footer labels) on conversion versus compact reference buttons at desktop width. Reference applies `--dialog-footer-btn-min-width` mainly in the small-screen footer rule; converted theme always sets minWidth on DialogActions buttons.
- **evidence:** Three-buttons panels `ref-three-panel.png` / `conv-three-panel.png`; probe button widths (~57–82 ref vs 120 conv); live computed minWidth auto vs 120px
- **remediationHint:** Align footer button min-width with reference breakpoint behavior (content-sized at desktop; min-width when stacking on small screens) unless human accepts always-on min-width

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Accessibility includes Screen Reader Support card
- **converted:** Accessibility shows ARIA Roles, Keyboard Navigation, Focus Management only
- **description:** Designer reading Accessibility would miss the Screen Reader Support guidance present on the reference Dialogs page.
- **evidence:** Reference `dialogs.astro` a11y section; converted `DialogsDemo.tsx` Accessibility stack; live page browse
- **remediationHint:** Add matching Screen Reader Support `A11yCard` (or accept omission via human decision)

### DEF-005

- **status:** accepted
- **category:** api
- **reference:** Primary Header / Combined Variants / Resizable live examples
- **converted:** `UnsupportedEquivalentCallout` for `headerVariant="primary"` (incl. Combined) and `resizable`
- **description:** Skipped per custom instructions and manifest `userDecision` / `skippedProps` — not fail conditions for this iteration.
- **evidence:** `conv-page-top.png` callouts; manifest Dialog `skippedProps` / `gaps`
- **remediationHint:** —

## Blocked items

_None._ Both review surfaces reachable. Catalog dependencies Icon + Button are `synced`.

## Dependencies

| Dependency | Manifest status | Notes |
|------------|-----------------|-------|
| Button | synced | Footer actions |
| Icon | synced | Close `HarmonyIcon` x-mark |

## Verifier notes

- Designer compare completed from live browse + panel screenshots (not source-only).
- Visual matrix uses three rendered columns; right-align and long-scroll rows judged from on-screen appearance (probes only as supporting evidence).
- Examples purity: demo uses inline MUI + `HarmonyIcon` — no file-local wrapper components in example zones.
- Do **not** mark Dialog `synced`. Do **not** remediate in this verify pass.
- **Recommendation: FAIL** — remediate DEF-001 (required) and preferably DEF-002–004 before re-verify.

