# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Checkbox`, `CheckboxGroup`, `RadioButton`, `RadioGroup` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-14T22:30:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 7 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 9 |

**Result:** PASS (Checkbox, RadioButton, CheckboxGroup, RadioGroup) — groups unblocked after parent sync; human accepted 2026-07-14

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
| screenshots | `verification/artifacts/checkbox-radio-2/` (page/examples + section clips) |
| probe | `verification/artifacts/checkbox-radio-2/probe.json` |

Rendered evidence reviewed on both dev servers (CP product, light). Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live measurements.

## Content parity

### Checkbox (`/components/checkboxes`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Checkboxes + stable badge | present | |
| Page description | present | |
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
| A11y: Labels, Keyboard, Error States | present | |
| Catalog dependency Icon | present | `synced` |

### CheckboxGroup (`/components/checkbox-groups`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description + badge | present | |
| Examples: Basic, Inline, Component, Horizontal, Error, Warning | present | |
| Props table | present | |
| Extra: Harmony mapping | accepted | Target-specific |
| A11y: Fieldset and Legend | present | |
| A11y: Keyboard Navigation | present | |
| A11y: Error and Warning States | present | |
| A11y: Screen Reader Support | present | **Fixed** — DEF-004 |
| Catalog dependency Checkbox | present | `synced` |

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
| A11y: Group Association | present | **Fixed** — DEF-005 |
| A11y: Error and Warning States | present | |
| Catalog dependency RadioButton | present | `synced` |

**Content gaps (open):** 0

## Visual parity

CP light (primary).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Checkbox unchecked face | Light gray border `rgb(191, 198, 212)` on white 18×18 | Same light gray face color `rgb(191, 198, 212)` via divider | present |
| Checkbox checked face | Solid primary blue fill + white check, 18×18 | Same primary blue filled check, 18×18 | present |
| Checkbox disabled | 50% opacity face | Matching faded face | present |
| Checkbox warning unchecked | Orange border face | Orange face color | present |
| Checkbox warning checked | Blue fill **with orange outer ring** (1px) | Blue fill + orange `boxShadow` 1px on SvgIcon | present |
| Checkbox error unchecked | Red border face | Red face color | present |
| Checkbox error checked | Blue fill **with red outer ring** (2px) | Blue fill + red `boxShadow` 2px on SvgIcon | present |
| Helper text + icons | Secondary/validation text + icons | Same secondary text + icon colors | present |
| Labels (checkbox) | 14px primary text | 14px primary text | present |
| CheckboxGroup layout (vert/row) | Vertical stacks; horizontal wrap with legend | Matching FormGroup / FormGroup row | present |
| CheckboxGroup error legend | Red legend text | Red FormLabel | present |
| Radio unchecked face | Light gray circle border `rgb(191, 198, 212)` | Same divider gray circle | present |
| Radio checked face | Blue ring + blue center dot | Blue ring + blue center — reads equivalent | present |
| Radio sizes (circle) | 14 / 18 / 22px | 14 / 18 / 22px | present |
| Radio size label type | 12px / 14px / 16px with size | 12px / 14px / 16px — `MuiRadio-sizeSmall` + **`MuiRadio-sizeLarge` present** | present |
| Radio warning/error checked | Blue face + orange/red outer ring | Blue face + matching 1px / 2px outer rings | present |
| MUI hover / ripple | N/A (Astro) | Default MUI hover/ripple kept | accepted |
| DOM / markup | Astro checkbox/radio DOM | MUI Checkbox/Radio DOM | accepted |

**Visual gaps (open):** 0

### Radio `sizeLarge` note

`MuiRadio-sizeLarge` **is present** on converted `size="large"` radios (confirmed in live class list and probe). `:has(.MuiRadio-sizeLarge)` label scaling works — Large label measures **16px**; Small **12px**; Medium **14px**. Label scaling does **not** fail on this iteration. (Medium has no `MuiRadio-sizeMedium` class — MUI default — expected.)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | accepted |
| Confirmed by | user (complete-in-progress execute) |
| Notes | Visual match accepted 2026-07-14 for all four elements; Checkbox / RadioButton / CheckboxGroup / RadioGroup marked `synced` |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual / tokens
- **reference:** Unchecked faces use light border `rgb(191, 198, 212)`.
- **converted:** Unchecked Checkbox/Radio faces now `rgb(191, 198, 212)` via `palette.divider`.
- **description:** Designer would see matching light unchecked chrome vs iteration 1 darker gray.
- **evidence:** Browse basic examples; `probe.json` `basicUnchecked.color`; screenshots `conv-cb-basic.png` / `ref-cb-basic.png`.

### DEF-002

- **status:** fixed
- **category:** visual
- **reference:** Checked + warning/error shows primary face with orange (1px) / red (2px) outer ring.
- **converted:** Checked validation faces show matching rings via FormControl theme `boxShadow` on SvgIcon.
- **description:** Designer would see validation halos restored on Checkbox and Radio state variants.
- **evidence:** `probe.json` warnChecked/errChecked `boxShadow`; screenshots `conv-cb-state.png`, `conv-rb-state.png` vs ref state clips.

### DEF-003

- **status:** fixed
- **category:** visual
- **reference:** Radio size variants scale circle (14/18/22) and label (12/14/16).
- **converted:** Circles and labels both scale; `MuiRadio-sizeLarge` class present.
- **description:** Designer would see Small/Large radio labels matching reference typography.
- **evidence:** `probe.json` `sizeLabels` 12/14/16; `hasSizeLarge: true`; screenshot `conv-rb-size.png`.

### DEF-004

- **status:** fixed
- **category:** structure
- **reference:** Checkbox Groups Accessibility includes “Screen Reader Support”.
- **converted:** Screen Reader Support A11yCard present.
- **evidence:** Live text on `/components/checkbox-groups`; `conv-cbg-sr.png`.

### DEF-005

- **status:** fixed
- **category:** structure
- **reference:** Radio Groups Accessibility includes “Group Association”.
- **converted:** Group Association A11yCard present.
- **evidence:** Live text on `/components/radio-groups`; `conv-rbg-ga.png`.

### DEF-006

- **status:** fixed
- **category:** mapping
- **reference:** CheckboxGroup composite depends on catalog Checkbox.
- **converted:** Manifest `Checkbox` is `synced`.
- **description:** Dependency cleared; CheckboxGroup synced with parent.
- **evidence:** `conversion.manifest.json` — Checkbox + CheckboxGroup `synced` (complete-in-progress execute 2026-07-14).

### DEF-007

- **status:** fixed
- **category:** mapping
- **reference:** RadioGroup composite depends on catalog RadioButton.
- **converted:** Manifest `RadioButton` is `synced`.
- **description:** Dependency cleared; RadioGroup synced with parent.
- **evidence:** `conversion.manifest.json` — RadioButton + RadioGroup `synced` (complete-in-progress execute 2026-07-14).

### DEF-008

- **status:** accepted
- **category:** behavior
- **reference:** Astro has no MUI-style ripple / default hover opacity.
- **converted:** Default MUI Checkbox/Radio hover and ripple retained.
- **description:** Intentional per user decision — keep MUI hover/ripple.
- **evidence:** Custom instructions iteration 2; plan / `userDecision`.

### DEF-009

- **status:** accepted
- **category:** other
- **reference:** Astro DOM.
- **converted:** MUI DOM.
- **description:** Framework DOM difference — not a defect when appearance matches.
- **evidence:** Playbook acceptance.

## Blocked items

None — Checkbox / RadioButton human-accepted and synced; groups unblocked and synced.

## Side-by-side visual summary (routes)

| Route | Content | Visual | Recommendation |
|-------|---------|--------|----------------|
| `/components/checkboxes` | Complete | Unchecked divider; validation rings present | **PASS** (synced) |
| `/components/checkbox-groups` | Complete (Screen Reader present) | Control chrome matches parents | **PASS** (synced) |
| `/components/radio-buttons` | Complete | Unchecked divider; rings; size labels 12/14/16; `sizeLarge` class OK | **PASS** (synced) |
| `/components/radio-groups` | Complete (Group Association present) | Control chrome matches parents | **PASS** (synced) |

## Verifier notes

- Demo purity: demos import MUI primitives + `HarmonyIcon` directly; composition is inline JSX. Mapping sections are target extras (accepted).
- Icon dependency `synced` — helper icons OK.
- Hover/ripple intentionally accepted (unchanged).
- **Radio `MuiRadio-sizeLarge` is not missing** — class present; label scaling succeeds.
- Human accepted via complete-in-progress execute (2026-07-14); all four elements marked `synced`.
- Recommend human accept Checkbox + RadioButton → sync those first → then re-check / sync groups.
