# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Checkbox`, `CheckboxGroup`, `RadioButton`, `RadioGroup` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-14T22:20:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 5 |
| fixed | 0 |
| blocked | 2 |
| deferred | 0 |
| accepted | 2 |
| **total** | 9 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/checkboxes` (HTTP 200) |
| reference | Live review `http://localhost:4321/components/checkbox-groups` (HTTP 200) |
| reference | Live review `http://localhost:4321/components/radio-buttons` (HTTP 200) |
| reference | Live review `http://localhost:4321/components/radio-groups` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/checkboxes` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/checkbox-groups` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/radio-buttons` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/radio-groups` (HTTP 200) |
| screenshots | `verification/artifacts/checkbox-radio-1/` (`ref-` / `conv-` light + dark page/examples; state-variants; sizes; cbg-error) |
| probe | `verification/artifacts/checkbox-radio-1/probe.json`, `probe-faces.json` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS/FAIL. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live measurements.

## Content parity

### Checkbox (`/components/checkboxes`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Checkboxes + stable badge | present | |
| Page description | present | Same lead copy |
| Article nav: Examples, Props, Usage, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Basic Checkbox | present | |
| Example: States | present | |
| Example: Without Labels | present | |
| Example: In a Form Group | present | |
| Example: Inline Layout | present | |
| Example: State Variants (warning/error) | present | |
| Props table | present | |
| Extra: Harmony mapping | accepted | Target-specific |
| Usage Do / Don't | present | Condensed into A11yCards — same guidance |
| A11y: Labels, Keyboard, Error States | present | MUI-framed copy |
| Catalog dependency Icon | present | `synced` — helper icons use `HarmonyIcon` |

### CheckboxGroup (`/components/checkbox-groups`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description + badge | present | |
| Examples: Basic, Inline, Component, Horizontal, Error, Warning | present | Component demo titled FormControl+FormGroup — equivalent |
| Props table | present | |
| Extra: Harmony mapping | accepted | Target-specific |
| A11y: Fieldset and Legend | present | |
| A11y: Keyboard Navigation | present | |
| A11y: Error and Warning States | present | |
| A11y: Screen Reader Support | missing | Reference has fourth a11y card |
| Catalog dependency Checkbox | blocked | Manifest `Checkbox` is `in-progress` — dependent cannot PASS |

### RadioButton (`/components/radio-buttons`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description + badge | present | |
| Examples: Basic, Size Variants, States, Inline, State Variants | present | |
| Props table (incl. size) | present | |
| Extra: Harmony mapping | accepted | Target-specific |
| A11y: Labels, Keyboard, Group Association, Error States | present | |
| Catalog dependency Icon | present | `synced` |

### RadioGroup (`/components/radio-groups`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description + badge | present | |
| Examples: Basic, Inline, Component, Horizontal, Error, Warning | present | |
| Props table | present | |
| Extra: Harmony mapping | accepted | Target-specific |
| A11y: Fieldset and Legend | present | |
| A11y: Keyboard Navigation | present | |
| A11y: Group Association | missing | Reference has Group Association card |
| A11y: Error and Warning States | present | |
| Catalog dependency RadioButton | blocked | Manifest `RadioButton` is `in-progress` — dependent cannot PASS |

**Content gaps (open):** 2 (Screen Reader Support; Group Association)

## Visual parity

CP light (primary). Dark spot-checked for unchecked faces.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Checkbox unchecked face | Light gray 2px border (`rgb(191,198,212)`) on white 18×18 square | Darker gray outline SVG (`rgb(82,89,105)`) | different |
| Checkbox checked face | Solid primary blue fill + white check, 18×18 | Same primary blue filled check, 18×18 | present |
| Checkbox disabled | 50% opacity face | Matching faded face via theme opacity | present |
| Checkbox warning unchecked | Orange border face | Orange face color (same orange) | present |
| Checkbox warning checked | Blue fill **with orange outer ring** (1px) | Blue fill only — **no orange ring** | different |
| Checkbox error unchecked | Red border face | Red face color | present |
| Checkbox error checked | Blue fill **with red outer ring** (2px) | Blue fill only — **no red ring** | different |
| Helper text + icons | Secondary gray text; orange/red icons | Same secondary text + icon colors | present |
| Labels | 14px primary text | 14px primary text | present |
| CheckboxGroup layout (vert/row) | Vertical stacks; horizontal wrap with legend | Matching FormGroup / FormGroup row | present |
| CheckboxGroup error legend | Red legend text | Red FormLabel | present |
| Radio unchecked face | Light gray circle border | Darker gray circle outline | different |
| Radio checked face | Blue ring + blue center dot on white | Blue ring + blue center fill (MUI) — reads equivalent | present |
| Radio sizes (circle) | 14 / 18 / 22px | 14 / 18 / 22px | present |
| Radio size label type | 12px / 14px / 16px with size | All labels stay 14px | different |
| Radio warning/error checked | Blue face + orange/red outer ring | Blue face only — no validation ring | different |
| MUI hover / ripple | N/A (Astro) | Default MUI hover/ripple kept | accepted |
| DOM / markup | Astro checkbox/radio DOM | MUI Checkbox/Radio DOM | accepted |

**Visual gaps (open):** 4 designer-visible deltas (unchecked color; checked validation rings; radio label size scaling — rings counted once across checkbox+radio)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Intentional MUI hover/ripple already accepted by user in plan. Unchecked border color and checked validation rings need human accept-or-remediate. Do not mark `synced`. |

## Defects

### DEF-001

- **status:** open
- **category:** visual / tokens
- **reference:** Unchecked checkbox and radio faces use a light border (`rgb(191, 198, 212)` on light) on white input background.
- **converted:** Unchecked faces render as darker gray MUI action/outline color (`rgb(82, 89, 105)` light; `rgb(182, 182, 196)` dark).
- **description:** Designer would see unchecked controls as heavier/darker than Harmony — especially in checkbox and radio basic/states examples.
- **evidence:** Browse `:4321` vs `:5176` basic examples; `probe-faces.json` unchecked rows; screenshots `ref-*-light-examples.png` / `conv-*-light-examples.png`.
- **remediationHint:** Theme `MuiCheckbox` / `MuiRadio` unchecked `color` toward Harmony `--border-color` (and dark mode border), not default action/secondary gray.

### DEF-002

- **status:** open
- **category:** visual
- **reference:** Checked + warning shows primary blue face with orange outer ring; checked + error shows blue face with red outer ring (CSS box-shadow).
- **converted:** Checked warning/error faces are primary blue only — identical to normal checked aside from helper icons.
- **description:** Designer would lose the validation halo on checked warning/error controls on Checkbox, RadioButton, and group error/warning demos.
- **evidence:** Reference `ref-checkboxes-state-variants.png`; `probe-faces.json` warnC/errC `boxShadow` present on ref, `none` on conv.
- **remediationHint:** Extend `mapSelectionControlChromeToTheme` (or control theme) so checked controls inside `FormControl` error/warning keep a 1px warning / 2px error outer ring matching reference.

### DEF-003

- **status:** open
- **category:** visual
- **reference:** Radio size variants scale both circle (14/18/22) and label font (12/14/16).
- **converted:** Circles match sizes; labels stay 14px for small/medium/large.
- **description:** Designer would see Small/Large radios with mismatched label typography vs reference Size Variants section.
- **evidence:** Live measure — ref labels 12/14/16; conv all 14px; screenshots size sections.
- **remediationHint:** Theme `MuiFormControlLabel` variants keyed by Radio `size`, or document/skip if human accepts flat MUI labels.

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Checkbox Groups Accessibility includes “Screen Reader Support” card.
- **converted:** Three a11y cards only — Screen Reader Support missing.
- **description:** Designer would miss the Screen Reader Support guidance block on the checkbox-groups page.
- **evidence:** Reference `checkbox-groups.astro` vs `CheckboxGroupsDemo.tsx`.

### DEF-005

- **status:** open
- **category:** structure
- **reference:** Radio Groups Accessibility includes “Group Association” card.
- **converted:** Fieldset / Keyboard / Error-Warning only — Group Association missing.
- **description:** Designer would miss Group Association guidance on the radio-groups page.
- **evidence:** Reference `radio-groups.astro` vs `RadioGroupsDemo.tsx`.

### DEF-006

- **status:** blocked
- **category:** mapping
- **reference:** CheckboxGroup composite depends on catalog Checkbox.
- **converted:** Manifest `Checkbox` is `in-progress` (not `synced`).
- **description:** Per playbook hard dependency check, CheckboxGroup cannot PASS until Checkbox is synced.
- **evidence:** `conversion.manifest.json` `elements.CheckboxGroup.compositeEquivalents[].dependsOn`.

### DEF-007

- **status:** blocked
- **category:** mapping
- **reference:** RadioGroup composite depends on catalog RadioButton.
- **converted:** Manifest `RadioButton` is `in-progress` (not `synced`).
- **description:** RadioGroup cannot PASS until RadioButton is synced.
- **evidence:** `conversion.manifest.json` `elements.RadioGroup.compositeEquivalents[].dependsOn`.

### DEF-008

- **status:** accepted
- **category:** behavior
- **reference:** Astro has no MUI-style ripple / default hover opacity.
- **converted:** Default MUI Checkbox/Radio hover and ripple retained.
- **description:** Intentional per user decision (2026-07-14) — keep MUI hover/ripple.
- **evidence:** Plan / `userDecision` on Checkbox and RadioButton; theme comments in `mapCheckboxToTheme.ts` / `mapRadioToTheme.ts`.

### DEF-009

- **status:** accepted
- **category:** other
- **reference:** Astro DOM (`.checkbox__box`, `.radio__circle`).
- **converted:** MUI DOM (`MuiCheckbox`, `MuiRadio`, FormControl composition).
- **description:** Framework DOM difference — not a defect when appearance matches. Appearance gaps filed separately above.
- **evidence:** Playbook acceptance — intentional MUI DOM differ.

## Blocked items

- **DEF-006 / DEF-007** — dependent group elements blocked for PASS until Checkbox / RadioButton are human-accepted and synced (after visual defects remediated).

## Side-by-side visual summary (routes)

| Route | Content | Visual | Recommendation |
|-------|---------|--------|----------------|
| `/components/checkboxes` | Complete | Unchecked darker; checked warning/error missing rings | **FAIL** |
| `/components/checkbox-groups` | Missing Screen Reader a11y; dep on Checkbox | Same control face / ring issues | **FAIL** (also dependency-blocked) |
| `/components/radio-buttons` | Complete | Unchecked darker; no validation rings; size labels flat | **FAIL** |
| `/components/radio-groups` | Missing Group Association a11y; dep on RadioButton | Same radio face / ring issues | **FAIL** (also dependency-blocked) |

## Verifier notes

- Demo purity: demos import MUI primitives + `HarmonyIcon` directly; no file-local wrappers; composition is inline JSX. Mapping sections are target extras (accepted).
- Icon dependency `synced` — helper icons OK for Checkbox / RadioButton.
- Hover/ripple intentionally accepted; unchecked color and validation rings were **not** accepted in plan — filed open.
- Do **not** mark manifest `synced`. Human confirmation required after remediate or explicit accept of open visual gaps.
- Recommend remediate DEF-001–003 (theme), DEF-004–005 (demo a11y cards), then re-verify; sync Checkbox/RadioButton before marking groups synced.
