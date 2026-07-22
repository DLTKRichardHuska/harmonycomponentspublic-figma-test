# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Button` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-06T18:35:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 6 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 4 |
| **total** | 10 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/buttons` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/buttons` (HTTP 200) |
| reference screenshot | `verification/artifacts/diag/ref-button-light.png` |
| converted screenshot | `verification/artifacts/diag/conv-button-light.png` |
| capture pair | `verification/artifacts/reference-Button.html`, `verification/artifacts/Button.html` |
| style probe | Playwright `getComputedStyle` on CP light mode (2026-07-06) |

Rendered evidence reviewed on both dev servers. Source-only review not used for PASS.

## Content parity

Inventory of reference `buttons.astro` doc page vs converted `ButtonsDemo.tsx` at `/components/buttons`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | different | Converted adds MUI mapping note — acceptable target framing |
| Article nav: Examples, Props, Usage, Accessibility | different | Converted adds Harmony mapping link; nav links lack reference icons |
| Section: Button Types (theme + pageHeader rows) | present | Sub-headings use Typography subtitle2 instead of h4 — equivalent content |
| Section: Variants (6 variants) | present | |
| Section: Dela Buttons (Ask Dela, Try AI) | different | Converted adds extra DelaButton loading example not on reference |
| Section: Sizes (xs, sm, md, lg) | accepted | xs omitted with `UnsupportedEquivalentCallout` per manifest `userDecision` |
| Section: With Icons (5 examples) | present | |
| Section: Icon Only (xs–lg + variant row) | accepted | xs icon-only row omitted — covered by xs gap acceptance |
| Section: States (theme + pageHeader disabled rows) | present | Missing helper text about hover/pressed/focus on interaction |
| Section: Loading State (3 buttons) | different | Labels differ when loading — see DEF-002 |
| Section: Full Width | present | |
| Section: Vertical Orientation | accepted | `UnsupportedEquivalentCallout` present per manifest |
| Section: Button Combinations | present | |
| Section: Props table | present | MUI-native props table — expected mapping |
| Section: Usage Guidelines — When to Use Each Button Type | missing | Reference bullet list absent on converted |
| Section: Usage Guidelines — When to Use Each Variant | missing | Reference bullet list absent on converted |
| Usage Do / Don't cards | different | Converted missing one Do and one Don't bullet each |
| Section: Accessibility — Keyboard Navigation | present | |
| Section: Accessibility — Icon-Only Buttons | present | |
| Section: Accessibility — Focus States | missing | |
| Section: Accessibility — Disabled State | missing | |
| Extra: Harmony → MUI mapping table | present | Target-specific addition — not a gap |

**Content gaps (open):** 4 (Usage subsections, 2 Accessibility cards, Usage list items — grouped in defects below)

## Visual parity

Rendered appearance matrix — CP product, light mode (primary review surface). Theme/mode switching not re-tested; core variant colors probed via `getComputedStyle`.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Theme Primary fill | `rgb(42, 120, 198)` | `rgb(42, 120, 198)` | present |
| Theme Primary label weight | 500 | 600 | different |
| Page Header Primary fill | `rgb(4, 56, 82)` | `rgb(4, 56, 82)` | present |
| Theme Secondary border | solid `rgb(42, 120, 198)` | `rgba(42, 120, 198, 0.5)` | different |
| Theme Secondary fill/text | white card bg + blue text | matches | present |
| Tertiary / Ghost / Destructive colors | probed — ghost/destructive match | matches | present |
| Disabled primary (theme) | bg `rgb(224,228,235)`, fg `rgb(191,198,212)` | matches | present |
| Disabled secondary opacity | 0.5 | 0.5 on outlined; primary disabled opacity differs on loading Dela | present |
| Dela Ask Dela gradient | `linear-gradient(119deg, #8A33C2 17.59%, #423FE2 77.78%)` | `linear-gradient(136deg, #00BBC6…, #7133FF…, #CD21FF…)` | different |
| Dela pill radius | full round | full round | present |
| Dela stars icon | white 20px Stars.svg | white 20px Stars.svg | present |
| Sizes sm/md/lg scale | three heights | three heights | present |
| Icon-only sm/md/lg | three sizes | three sizes | present |
| Loading spinner visible | yes, with loadingText | yes, keeps Submit/Process/Save labels | different |
| xs size row | XSmall button shown | callout only | accepted |
| Vertical orientation demos | 8 vertical buttons | callout only | accepted |

**Visual gaps (open):** 3 (font-weight, secondary border, Dela gradient)

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Designer would see Dela buttons (Ask Dela, Try AI) with a two-stop purple→indigo gradient (`119deg`, `#8A33C2` → `#423FE2`).
- **converted:** Designer would see a three-stop cyan→violet→magenta gradient (`136deg`, teal/purple/pink stops) on DelaButton.
- **description:** Dela button brand gradient does not match reference `--gradient-dela` token as rendered on the buttons doc page. Manifest requires DelaButton to visually match reference when using custom export.
- **evidence:** `getComputedStyle` backgroundImage on Ask Dela — ref vs conv probe 2026-07-06; `src/styles/tokens.css` `--gradient-dela` vs `src/theme/buttonTokens.ts` `DELA_GRADIENT`
- **remediationHint:** Source `DELA_GRADIENT` from vendored `--gradient-dela` token (`linear-gradient(119deg, #8A33C2 17.59%, #423FE2 77.78%)`).

### DEF-002

- **status:** open
- **category:** behavior
- **reference:** Loading examples display `loadingText` values: "Loading...", "Processing", "Saving..." (button label hidden while loading).
- **converted:** Loading examples still show original labels "Submit", "Process", "Save" beside the spinner.
- **description:** Loading state content differs from reference — designer sees different text during loading.
- **evidence:** Loading State section, Playwright text probe on `/components/buttons`; reference `Button.astro` replaces slot with `loadingText` when `loading` is true
- **remediationHint:** Map Harmony `loadingText` to MUI v9 loading label behavior or demo props so visible loading copy matches reference examples.

### DEF-003

- **status:** open
- **category:** structure
- **reference:** Accessibility section includes four cards: Keyboard Navigation, Icon-Only Buttons, Focus States, Disabled State.
- **converted:** Accessibility section includes only Keyboard Navigation and Icon-Only Buttons.
- **description:** Missing two educational accessibility cards that reference documents for Button.
- **evidence:** `/components/buttons` — scroll to Accessibility; `ButtonsDemo.tsx` lines 543–567

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Usage Guidelines includes "When to Use Each Button Type" and "When to Use Each Variant" subsections with bullet lists.
- **converted:** Usage Guidelines shows only Do/Don't cards; detailed when-to-use lists absent.
- **description:** Reference usage guidance content is incomplete on converted demo page.
- **evidence:** `buttons.astro` Usage section vs `ButtonsDemo.tsx` Usage block

### DEF-005

- **status:** open
- **category:** visual
- **reference:** Button labels render at font-weight 500 (`var(--font-medium)`).
- **converted:** MUI Button labels render at font-weight 600 across theme, pageHeader, and variant rows.
- **description:** Designer would notice slightly bolder button labels on converted page vs reference at same size.
- **evidence:** `getComputedStyle` fontWeight on Primary buttons — ref `500`, conv `600`; `mapButtonToTheme.ts` sets `fontWeight: 600`
- **remediationHint:** Align `MuiButton` theme override to `fontWeight: 500` or Harmony token equivalent.

### DEF-006

- **status:** open
- **category:** visual
- **reference:** Theme secondary (outlined primary) button shows solid blue border `rgb(42, 120, 198)`.
- **converted:** Same button shows semi-transparent border `rgba(42, 120, 198, 0.5)`.
- **description:** Secondary/outlined theme button border reads lighter on converted than reference in side-by-side review.
- **evidence:** `getComputedStyle` borderColor on Theme Secondary row, CP light mode
- **remediationHint:** Override MUI outlined primary border to solid Harmony stroke token.

## Accepted items (manifest / userDecision)

| Item | Status | Notes |
|------|--------|-------|
| `size="xs"` | accepted | `UnsupportedEquivalentCallout` in Sizes section; manifest gap documented |
| `orientation="vertical"` | accepted | `UnsupportedEquivalentCallout` in Vertical Orientation section |
| Icon-only xs row | accepted | Follows xs skip decision |
| Harmony → MUI mapping section | accepted | Target-specific consumer documentation |

## Blocked items

None — both review servers reachable.

## Verifier notes

- Designer compare completed per `VERIFIER.md` Button component scope: content inventory + visual matrix on live `:4321` and `:5176` routes.
- Intentional gaps (xs, vertical) correctly surfaced with callouts; not counted as open defects.
- Dela custom component is in scope for visual match per manifest `userDecision` — gradient mismatch is an open defect, not deferrable.
- Core theme/pageHeader/disabled/destructive fills match reference tokens on CP light. Dela gradient, loading copy, doc-page educational content, and label weight prevent PASS.
- Did not overwrite `verification/latest-defect-report.md` (foundation verifier ownership).
