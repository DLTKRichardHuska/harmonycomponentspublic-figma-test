# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Checkbox` + `RadioButton` + `Toggle` + `TabStrip` (controls-nav-form-1) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | 2026-09-11T17:14:08.000Z |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| surfaces | Reference `http://localhost:4321` · Converted `http://localhost:5178` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 8 |

**Result:** FAIL

## Side-by-side visual summary (per element)

| Element | Verdict | Notes |
|---------|---------|-------|
| **Checkbox** | **FAIL** | Native path size/color match; CE `.checkbox__box` renders ~22×22 vs reference 18×18 (`content-box` + 2px border). Usage Guidelines Do/Don't missing. Warning/error look correct. |
| **RadioButton** | **FAIL** | Same box-sizing inflation: sm/md/lg measure ~18/22/26 vs reference 14/18/22. Otherwise states, warning/error, inline layout match. |
| **Toggle** | **PASS** | Default + segmented tracks match reference metrics (on `rgb(42,120,198)` 44×24; segmented track 176×28, white thumb). States/sizes/segmented look equivalent. Form-layout extra OK. |
| **TabStrip** | **FAIL** | Basic underline, overflow `More (8)`, add-tab, compact look good. **Icons (Right)** shows icons on the left (DOM is label→icon **and** `flex-direction: row-reverse`). |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321/components/checkboxes` · `…/radio-buttons` · `…/toggle-switches` · `…/tab-strip` |
| converted | `http://localhost:5178/components/checkboxes` · `…/radio-buttons` · `…/toggle-switches` · `…/tab-strip` |
| screenshots | `verification/artifacts/controls-nav-form-1/ref-*-cp-light-*.png`, `conv-*-cp-light-*.png`, section clips, forced-colors tops |
| probes | `probe-*-*.json`, `behavior-*.json`, `probe-cb-boxsizing.json`, `probe-radio-sizes.json`, `probe-tab-active.json` |

CP light applied on converted via `demo-app` product=`cp` (Costpoint stylesheet).

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Checkboxes: Basic / States / Without labels / Inline | present | Dual native + CE demos on converted |
| Checkboxes: In a Form Group (Notification Preferences) | accepted | Replaced by `harmony-form-layout` — approved intentional extra |
| Checkboxes: State Variants (warning/error) | present | Disabled warning/error rows omitted on converted (see deferred) |
| Checkboxes: Usage Guidelines Do/Don't | **missing** | DEF-001 |
| Checkboxes: Accessibility | present | Condensed vs a11y-cards |
| Radio: Basic / Sizes / States / Inline / Warning&error | present | Disabled warning/error rows omitted (deferred) |
| Radio: RadioGroup | accepted | Out of scope (approved) |
| Toggle: Basic / States / Sizes / Without label / Segmented | present | Extra List/Board OK |
| Toggle: CE-only (no native switch) | accepted | Approved gap |
| TabStrip: Basic / icons L·R·top / disabled / Add / actions / overflow / manual / compact / pill / icon-position | present | Icons-right **visually wrong** (DEF-004) |
| TabStrip: named slots / public CSS recipe / panels in CE | accepted | Approved gaps; panels consumer-owned |
| CheckboxGroup | accepted | Approved out of scope |
| No Astro auto-id | accepted | Approved |
| Form-layout participation | accepted | Approved intentional extra |
| Demo chrome / stable vs in-progress badge | deferred | Demo harness, not component fidelity |

**Content gaps (open):** 1 (Usage Guidelines)

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Checkbox native unchecked/checked | 18×18 grey border / blue fill + white check | Same 18×18 native path | present |
| Checkbox CE control | 18×18 blue/grey box | ~22×22 CE `.checkbox__box` (noticeably larger) | **different** |
| Checkbox warning/error | Amber/red border + icon message | Amber/red border + icon message | present |
| Radio sm / md / lg | 14 / 18 / 22 px circles | ~18 / 22 / 26 px circles | **different** |
| Radio checked / disabled / warning | Blue ring+dot; muted disabled; amber/red messages | Same designer read | present |
| Toggle on/off | Blue / grey pill, white thumb | Matching size and color | present |
| Toggle segmented | Grey track, white sliding thumb, bold active label | Matching | present |
| TabStrip basic active | Blue label + thick blue underline | Matching | present |
| TabStrip overflow | Narrow box → More(N) | More (8) with Add Tab | present |
| TabStrip icons right | Icon to the **right** of label | Icon to the **left** of label | **different** |
| TabStrip icons left / top | Icon left / stacked | Matching | present |
| Forced-colors (HC) | N/A (no Astro baseline) | Controls remain bounded; checked uses Highlight; usable | present (a11y gate) |

**Visual gaps (open):** 3

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Ask before `synced` for any of the four elements. Approved API gaps listed above are not Fail reasons. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **scope:** Checkbox
- **reference:** Usage Guidelines with Do / Don't cards
- **converted:** No Usage Guidelines section
- **description:** Designer would miss the Do/Don't guidance present on the reference Checkboxes page (Inputs demo already ports this pattern via `demo-guidelines`).
- **evidence:** Content inventory; `DemoCheckboxesPage.js` vs `src/pages/components/checkboxes.astro` `#usage`
- **remediationHint:** Port Do/Don't with `demo-guidelines` like `DemoInputsPage.js`

### DEF-002

- **status:** open
- **category:** visual
- **scope:** Checkbox
- **reference:** Checkbox control box reads as 18×18px
- **converted:** `harmony-checkbox` `.checkbox__box` measures ~22×22px (`box-sizing: content-box` + 2px border on 18px width)
- **description:** Designer would see CE checkboxes larger than reference (and larger than the native dual-path demos on the same page).
- **evidence:** `probe-cb-boxsizing.json`, `probe-cb-sizes.json`, `probe-ref-cb-boxes.json`; CP light browse
- **remediationHint:** Ensure shadow checkbox/radio boxes use `box-sizing: border-box` (or match reference computed size); keep icon from expanding the box

### DEF-003

- **status:** open
- **category:** visual
- **scope:** RadioButton
- **reference:** Size variants ~14 / 18 / 22 px
- **converted:** Size variants ~18 / 22 / 26 px
- **description:** Designer would see all radio sizes one step larger than reference.
- **evidence:** `probe-radio-sizes.json`; live `/components/radio-buttons` CP light
- **remediationHint:** Same border-box fix as DEF-002 on `.radio__circle` / size modifiers

### DEF-004

- **status:** open
- **category:** visual
- **scope:** TabStrip
- **reference:** Icons (Right) places glyph after the label
- **converted:** Icons (Right) still shows glyph before the label
- **description:** Designer would see the Icons right example matching Icons left. Markup is label→icon with class `tab--icon-right`, but CSS `flex-direction: row-reverse` undoes the intended order.
- **evidence:** `conv-tabs-icons-right.png`; live probe className `tab--icon-right` + iconLeft < labelLeft
- **remediationHint:** Use either DOM order **or** `row-reverse`, not both

### DEF-005

- **status:** deferred
- **category:** structure
- **scope:** Checkbox / RadioButton
- **description:** Reference shows disabled warning/error rows; converted omits those combinations.
- **notes:** Non-blocking vs size/icons defects; human may accept or ask to add

### DEF-006

- **status:** deferred
- **category:** other
- **scope:** demo chrome
- **description:** DocsLayout vs DemoShell (badge stable vs in-progress, article-nav) — not component fidelity

### DEF-007

- **status:** deferred
- **category:** structure
- **scope:** a11y copy
- **description:** Converted uses condensed Accessibility blurb vs reference a11y-cards; outcomes still covered at high level

### DEF-008

- **status:** deferred
- **category:** a11y
- **scope:** Checkbox / Radio / Toggle shadow sheets
- **description:** Component CSS files lack local `@media (forced-colors)` blocks (unlike TabStrip). Under Playwright `forced-colors: active`, controls remained visible via token/system mapping. Not failed solely on HC look vs Astro; revisit if Windows Contrast Themes show invisible focus/state in CE shadow.

## Blocked items

None — both servers returned 200 for all four routes.

## Verifier notes

- Compared rendered CP light on both surfaces; captures under `verification/artifacts/controls-nav-form-1/`.
- Three-column visual matrix completed; no PASS from CSS-property probes alone (sizes used as supporting evidence for designer-visible deltas).
- Approved Consumer API gaps (CheckboxGroup/RadioGroup, Toggle CE-only, TabStrip panels/slots/CSS recipe, no Astro auto-id, form-layout extra) were **not** counted as Fail.
- **Toggle** is visually ready; batch Fail is driven by Checkbox/Radio sizing and TabStrip icons-right, plus Checkbox Usage Guidelines.
- Recommendation: **FAIL** — remediate DEF-001–004, then re-verify before human sync.

**FAIL: open conversion defects (DEF-001–004).**
