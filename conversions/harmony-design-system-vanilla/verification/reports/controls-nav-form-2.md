# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Checkbox` + `RadioButton` + `TabStrip` (controls-nav-form-2; Toggle was PASS in form-1) |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T17:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| surfaces | Reference `http://localhost:4321` · Converted `http://localhost:5178` |
| prior | `controls-nav-form-1.md` (FAIL — DEF-001–004) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 8 |

**Result:** PASS

## Side-by-side visual summary (per element)

| Element | Verdict | Notes |
|---------|---------|-------|
| **Checkbox** | **PASS** | CE `.checkbox__box` now 18×18 `border-box` (was ~22×22). Usage Guidelines Do/Don't present. |
| **RadioButton** | **PASS** | sm/md/lg now 14/18/22 matching reference (was ~18/22/26). |
| **TabStrip** | **PASS** | Icons right: label then icon (`flex-direction: row`; `iconAfterLabel: true`). |
| **Toggle** | **PASS** | Carried from form-1; not re-failed. |

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321/components/checkboxes` · `…/radio-buttons` · `…/tab-strip` |
| converted | `http://localhost:5178/components/checkboxes` · `…/radio-buttons` · `…/tab-strip` |
| screenshots | `verification/artifacts/controls-nav-2/ref-*-cp-light-*.png`, `conv-*-cp-light-*.png`, `conv-checkboxes-usage.png`, `conv-tab-strip-icons-right.png`, `ref-tab-strip-icons-right.png` |
| probes | `verification/artifacts/controls-nav-2/reverify-probe.json` |

CP light applied on converted via `demo-app` product=`cp`.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Checkboxes: Basic / States / Without labels / Inline | present | Dual native + CE |
| Checkboxes: Usage Guidelines Do/Don't | present | Prior DEF-001 fixed |
| Checkboxes: Accessibility | present | Condensed vs a11y-cards (deferred) |
| Radio: Basic / Sizes / States / Inline / Warning&error | present | |
| TabStrip: Basic / icons L·R·top / disabled / Add / overflow / compact / pill | present | Icons-right visually correct on converted |
| CheckboxGroup / RadioGroup / Toggle CE-only / TabStrip panels | accepted | Approved gaps |
| Form-layout participation | accepted | Approved intentional extra |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Checkbox CE control | 18×18 blue/grey box | 18×18 CE `.checkbox__box`, `border-box` | present |
| Checkbox native | 18×18 | 18×18 | present |
| Checkbox Usage Do/Don't | Do/Don't cards under Usage Guidelines | Same Do/Don't bullets via demo section | present |
| Radio sm / md / lg | 14 / 18 / 22 px circles | 14 / 18 / 22 px CE circles | present |
| Radio checked | Blue ring + center dot | Same designer read | present |
| TabStrip icons right | Section titled Icons (Right); Astro still paints icon left via `row-reverse` + label→icon DOM | Converted: icon to the **right** of label (matches section intent / prior DEF-004 remediation) | present |
| TabStrip icons left / top | Icon left / stacked | Matching | present |
| TabStrip basic active | Blue label + thick blue underline | Matching | present |

**Visual gaps (open):** 0

### TabStrip icons-right note

Reference Astro `With Icons (Right)` still uses `flex-direction: row-reverse` with DOM order label→icon, which **visually** places the icon on the left (same as Icons Left). Converted removed `row-reverse` so label→icon reads as icon-on-right, matching the section title and the remediation requested after form-1. Counted as **present** against the intended Icons-right appearance (prior DEF-004), not as a conversion defect for diverging from the reference bug.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Ask before `synced` for Checkbox, RadioButton, TabStrip (and Toggle from form-1). Approved API gaps are not Fail reasons. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **scope:** Checkbox
- **reference:** Usage Guidelines with Do / Don't cards
- **converted (re-verify):** Usage Guidelines section with Do/Don't lists present (`#usage`)
- **evidence:** `conv-checkboxes-usage.png`; `reverify-probe.json` `convCb.h2` includes "Usage Guidelines"

### DEF-002

- **status:** fixed
- **category:** visual
- **scope:** Checkbox
- **reference:** Checkbox control box 18×18px
- **converted (re-verify):** `harmony-checkbox` `.checkbox__box` measures 18×18 with `box-sizing: border-box`
- **evidence:** `reverify-probe.json` `convCb.ceBoxes`; live `/components/checkboxes` CP light

### DEF-003

- **status:** fixed
- **category:** visual
- **scope:** RadioButton
- **reference:** Size variants ~14 / 18 / 22 px
- **converted (re-verify):** CE sizes 14 / 18 / 22 match reference `.radio__circle` metrics
- **evidence:** `reverify-probe.json` `convRadio.ce`; live `/components/radio-buttons` Sizes section

### DEF-004

- **status:** fixed
- **category:** visual
- **scope:** TabStrip
- **reference (intent):** Icons (Right) places glyph after the label
- **converted (re-verify):** `#tabs-icons-right` tabs show `iconAfterLabel: true`, `flex-direction: row`, DOM label→icon
- **evidence:** `conv-tab-strip-icons-right.png`; `reverify-probe.json` `convTabs.layout`

### DEF-005

- **status:** deferred
- **category:** structure
- **scope:** Checkbox / RadioButton
- **description:** Reference shows disabled warning/error rows; converted omits those combinations.

### DEF-006

- **status:** deferred
- **category:** other
- **scope:** demo chrome
- **description:** DocsLayout vs DemoShell — not component fidelity

### DEF-007

- **status:** deferred
- **category:** structure
- **scope:** a11y copy
- **description:** Converted uses condensed Accessibility blurb vs reference a11y-cards

### DEF-008

- **status:** deferred
- **category:** a11y
- **scope:** Checkbox / Radio / Toggle shadow sheets
- **description:** Local forced-colors blocks still thinner than TabStrip; HC outcome gate not failed solely on Astro look. Revisit if Windows Contrast Themes show invisible focus/state.

## Blocked items

None — both servers returned 200 for scoped routes.

## Verifier notes

- Compared rendered CP light on both surfaces; captures under `verification/artifacts/controls-nav-2/`.
- Three-column visual matrix completed; size probes support designer judgment only.
- All four open defects from form-1 are **fixed**. Recommend human confirm then sync Checkbox, RadioButton, TabStrip (Toggle already PASS).
