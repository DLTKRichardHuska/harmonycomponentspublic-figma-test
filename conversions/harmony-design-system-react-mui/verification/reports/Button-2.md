# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Button` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-06T19:35:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 6 |
| blocked | 0 |
| deferred | 0 |
| accepted | 5 |
| **total** | 11 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/buttons` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/buttons` (HTTP 200) |
| style probe | Playwright `getComputedStyle` — `probe-button.mjs`, `probe-button2.mjs`, iteration-2 inline probe (2026-07-06) |
| prior report | `verification/reports/Button-1.md` (6 open defects remediated) |

Rendered evidence reviewed on both dev servers. Source-only review not used for PASS.

## Content parity

Inventory of reference `buttons.astro` doc page vs converted `ButtonsDemo.tsx` at `/components/buttons`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | accepted | Converted adds MUI mapping note — acceptable target framing |
| Article nav: Examples, Props, Usage, Accessibility | accepted | Converted links lack reference icons; href targets match |
| Section: Button Types (theme + pageHeader rows) | present | Sub-headings use Typography subtitle2 instead of h4 — equivalent content |
| Section: Variants (6 variants) | present | |
| Section: Dela Buttons (Ask Dela, Try AI) | accepted | Converted adds extra DelaButton loading example — demonstrates loading capability |
| Section: Sizes (xs, sm, md, lg) | accepted | xs omitted with `UnsupportedEquivalentCallout` per manifest `userDecision` |
| Section: With Icons (5 examples) | present | |
| Section: Icon Only (xs–lg + variant row) | accepted | xs icon-only row omitted — covered by xs gap acceptance |
| Section: States (theme + pageHeader disabled rows) | present | Reference helper text about hover/pressed/focus on interaction not duplicated — states still interactive on both |
| Section: Loading State (3 buttons) | present | Labels match reference loadingText values |
| Section: Full Width | present | |
| Section: Vertical Orientation | accepted | `UnsupportedEquivalentCallout` present per manifest |
| Section: Button Combinations | present | |
| Section: Props table | present | MUI-native props table — expected mapping |
| Section: Usage Guidelines — When to Use Each Button Type | present | Added in iteration 2 |
| Section: Usage Guidelines — When to Use Each Variant | present | Added in iteration 2 |
| Usage Do / Don't cards | present | Five bullets each — matches reference |
| Section: Accessibility — Keyboard Navigation | present | Plain text vs reference `<kbd>` styling — equivalent meaning |
| Section: Accessibility — Icon-Only Buttons | present | |
| Section: Accessibility — Focus States | present | Added in iteration 2 |
| Section: Accessibility — Disabled State | present | Added in iteration 2 |
| Extra: Harmony → MUI mapping table | accepted | Target-specific addition — not a gap |

**Content gaps (open):** 0

## Visual parity

Rendered appearance matrix — CP product, light mode (primary review surface). Theme/mode switching not re-tested; core variant colors probed via `getComputedStyle`.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Theme Primary fill | `rgb(42, 120, 198)` | `rgb(42, 120, 198)` | present |
| Theme Primary label weight | 500 | 500 | present |
| Page Header Primary fill | `rgb(4, 56, 82)` | `rgb(4, 56, 82)` | present |
| Theme Secondary border | solid `rgb(42, 120, 198)` | solid `rgb(42, 120, 198)` | present |
| Theme Secondary fill/text | white card bg + blue text | matches | present |
| Tertiary / Ghost / Destructive colors | probed — match | matches | present |
| Disabled primary (theme) | bg `rgb(224,228,235)`, fg `rgb(191,198,212)` | matches | present |
| Dela Ask Dela gradient | `linear-gradient(119deg, rgb(138, 51, 194) 17.59%, rgb(66, 63, 226) 77.78%)` | same | present |
| Dela pill radius | full round | full round | present |
| Dela stars icon | white 20px Stars.svg | white 20px Stars.svg | present |
| Sizes sm/md/lg scale | three heights | three heights | present |
| Icon-only sm/md/lg | three sizes | three sizes | present |
| Loading spinner + text | Loading… / Processing / Saving… | matches | present |
| xs size row | XSmall button shown | callout only | accepted |
| Vertical orientation demos | 8 vertical buttons | callout only | accepted |

**Visual gaps (open):** 0

## Defects

### DEF-001 (from Button-1)

- **status:** fixed
- **category:** visual
- **reference:** Designer would see Dela buttons with two-stop purple→indigo gradient (`119deg`, `#8A33C2` → `#423FE2`).
- **converted:** Now matches reference `--gradient-dela` token on Ask Dela button.
- **description:** Dela button brand gradient corrected in iteration 2.
- **evidence:** `getComputedStyle` backgroundImage — ref and conv both `linear-gradient(119deg, rgb(138, 51, 194) 17.59%, rgb(66, 63, 226) 77.78%)`; `buttonTokens.ts` `DELA_GRADIENT`

### DEF-002 (from Button-1)

- **status:** fixed
- **category:** behavior
- **reference:** Loading examples display `loadingText` values: "Loading...", "Processing", "Saving...".
- **converted:** Loading examples now show same visible copy beside spinner.
- **description:** Loading state content matches reference.
- **evidence:** Playwright text probe on Loading State section — both servers return Loading… / Processing / Saving…

### DEF-003 (from Button-1)

- **status:** fixed
- **category:** structure
- **reference:** Accessibility section includes four cards: Keyboard Navigation, Icon-Only Buttons, Focus States, Disabled State.
- **converted:** All four cards present.
- **description:** Missing accessibility educational cards restored.
- **evidence:** Live probe `a11yCards` array — both ref and conv list all four titles

### DEF-004 (from Button-1)

- **status:** fixed
- **category:** structure
- **reference:** Usage Guidelines includes "When to Use Each Button Type" and "When to Use Each Variant" subsections with bullet lists.
- **converted:** Both subsections present with equivalent bullet content (18 list items total).
- **description:** Reference usage guidance content restored on converted demo page.
- **evidence:** Live DOM inventory under `#usage`; `ButtonsDemo.tsx` lines 513–551

### DEF-005 (from Button-1)

- **status:** fixed
- **category:** visual
- **reference:** Button labels render at font-weight 500.
- **converted:** Button labels now render at font-weight 500.
- **description:** Label weight aligned to Harmony medium token.
- **evidence:** `getComputedStyle` fontWeight on Primary buttons — ref `500`, conv `500`; `mapButtonToTheme.ts` uses `typography.fontWeights.medium.value`

### DEF-006 (from Button-1)

- **status:** fixed
- **category:** visual
- **reference:** Theme secondary (outlined primary) button shows solid blue border `rgb(42, 120, 198)`.
- **converted:** Same solid border color.
- **description:** Outlined primary border no longer semi-transparent.
- **evidence:** `getComputedStyle` borderColor on Theme Secondary row, CP light mode — both `rgb(42, 120, 198)`

## Accepted items (manifest / userDecision)

| Item | Status | Notes |
|------|--------|-------|
| `size="xs"` | accepted | `UnsupportedEquivalentCallout` in Sizes section; manifest gap documented |
| `orientation="vertical"` | accepted | `UnsupportedEquivalentCallout` in Vertical Orientation section |
| Icon-only xs row | accepted | Follows xs skip decision |
| Harmony → MUI mapping section | accepted | Target-specific consumer documentation |
| Extra Dela loading example | accepted | Additional demo row; does not remove reference examples |

## Blocked items

None — both review servers reachable.

## Verifier notes

- Designer compare completed per `VERIFIER.md` Button component scope: content inventory + visual matrix on live `:4321` and `:5176` routes.
- All six open defects from `Button-1.md` verified fixed via live Playwright probes (2026-07-06).
- Intentional gaps (xs, vertical) correctly surfaced with callouts; not counted as open defects.
- Minor doc-page differences remain (article-nav icons, States hover helper micro-copy, `<kbd>` styling in Keyboard card) — do not change designer-perceived button component fidelity.
- Recommend human sign-off before marking manifest `Button` element `synced`.
