# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Checkbox`, `CheckboxGroup`, `RadioButton`, `RadioGroup`, `Link`, `Tooltip` |
| iteration | `2` |
| artifactType | `png` + `json` |
| generatedAt | `2026-07-20T21:45:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 6 |

**Result:** FAIL

**FAIL: Usage Guidelines Do/Don't list text is smashed (no bullets/line breaks). DEF-001/002/003 remediations otherwise verified.**

Prior report: `verification/reports/selection-tooltip-link-1.md`

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/checkboxes`, `…/radio-buttons` (+ prior routes from iter 1) |
| converted (live) | `http://localhost:5177/components/checkboxes`, `…/radio-buttons` |
| artifacts dir | `conversions/harmony-design-system-shadcn/verification/artifacts/selection-tooltip-link-1/` |
| iter-2 inventories | `ref2-*-inventory.json`, `conv2-*-inventory.json` |
| iter-2 face probes | `ref2-checkbox-face-probe.json`, `conv2-checkbox-face-probe.json`, `ref2-radio-face-probe.json`, `conv2-radio-face-probe.json` |
| iter-2 crops | `*-cb-states.png`, `*-cb-usage.png`, `conv2-cb-usage-tight.png`, `*-rb-states.png`, `*-rb-inline.png`, `*-rb-sizes.png`, `*-rb-variants.png` |
| usage probe | `conv2-cb-usage-probe.json` |
| capture script | `capture-iter2.mjs` |

## Content parity

### Checkbox

| Reference item | Status | Notes |
|----------------|--------|-------|
| Examples / Props / Accessibility | present | |
| Usage Guidelines + Do / Don't | different | Section + nav present, but Do/Don't body renders as concatenated strings (see DEF-006) |
| Basic / States / Without Labels / Form Group / Inline / State Variants | present | |

**Content gaps (open):** 0 structure missing; 1 visual/content render defect on Usage

### RadioButton

| Reference item | Status | Notes |
|----------------|--------|-------|
| Basic / Sizes (one group) / States incl. Checked & Disabled | present | Remediated |
| Inline Layout (Red / Green / Blue) | present | Remediated |
| State Variants incl. disabled warning/error | present | Remediated |
| Without Labels | present | Additive |

**Content gaps (open):** 0

### CheckboxGroup / RadioGroup / Link / Tooltip

Unchanged from iter 1 — present; Link responsive size + Tooltip `cornerVariant` remain **accepted**.

### Docs / import / Consumer API

| Check | Status |
|-------|--------|
| ImportSnippet + Hybrid C API docs | PASS (unchanged) |
| Approved skips documented | PASS |

### Stack elegance

PASS (unchanged) — Radix selection / Tooltip, Link cva, package Icon.

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Unchecked checkbox border | 2px gray | **2px** gray (was 1px) | present |
| Unchecked radio border | 2px gray | **2px** gray (was 1px) | present |
| Checkbox states incl. checked-disabled | Four-state stack | Matching | present |
| Radio states incl. checked-disabled | Four-state stack | Matching | present |
| Radio inline Red/Green/Blue | Horizontal labeled | Matching | present |
| Radio sizes sm/md/lg one group | Size ladder | Matching | present |
| Radio warning/error + disabled rows | Full variant set | Matching | present |
| Checkbox Usage Do/Don't cards | Green/red cards with bulleted lists | Two-column cards, but items **run together** with no bullets/spaces | different |
| Link / Tooltip (iter 1) | Color ladder / dark tip | Matching; approved skips | present / accepted |

**Visual gaps (open):** 1 (Usage Guidelines list formatting)

## Side-by-side visual / behavior summary

**Matches (after remediation)**

- Selection-control border weight now matches Harmony 2px standard
- Radio Buttons demo content parity restored (inline, checked-disabled, disabled validation rows, sizes in one group)
- Checkbox/radio checked fills, validation chrome, groups, Link, Tooltip still match

**Differs (open defect)**

- Checkboxes Usage Guidelines: `DemoDoDont` is passed `string[]` props; React concatenates strings → designer sees unreadable smashed lines instead of bulleted Do/Don't lists (reference and Button demo use `<ul><li>…`)

**Accepted (unchanged)**

- Tooltip `cornerVariant`, Link responsive default size

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Fix DEF-006 then re-verify / AskQuestion before `synced` |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** 2px selection borders
- **converted:** Now `border-2 border-solid` — probes `conv2-*-face-probe.json` show `borderW: "2px"` matching reference
- **description:** Border-width mismatch resolved.
- **evidence:** `conv2-checkbox-face-probe.json`, `conv2-radio-face-probe.json`, `conv2-cb-states.png`, `conv2-rb-states.png`

### DEF-002

- **status:** fixed
- **category:** structure
- **reference:** Radio Inline Layout + Checked & Disabled + disabled warning/error
- **converted:** All present on `/components/radio-buttons`
- **description:** Radio Buttons demo content restored.
- **evidence:** `conv2-radio-buttons-inventory.json`, `conv2-rb-states.png`, `conv2-rb-inline.png`, `conv2-rb-variants.png`

### DEF-003

- **status:** fixed
- **category:** structure
- **reference:** Usage Guidelines section + nav
- **converted:** `#usage` section + Usage article nav link present
- **description:** Structural gap closed; **render quality tracked as DEF-006**.
- **evidence:** `conv2-checkboxes-inventory.json` (`Usage Guidelines`, Do/Don't h3)

### DEF-004

- **status:** accepted
- **category:** other
- **description:** Tooltip `cornerVariant` skipped with callout (unchanged)

### DEF-005

- **status:** accepted
- **category:** other
- **description:** Link responsive default size skipped with callout (unchanged)

### DEF-006

- **status:** open
- **category:** visual
- **reference:** Usage Guidelines Do/Don't as readable bulleted lists in tinted cards
- **converted:** Do/Don't headings present, but item text concatenates (`DoUse for multiple selectionsProvide clear…`) with no list bullets or line breaks
- **description:** Designer cannot scan usage guidance — copy is smashed into continuous runs.
- **evidence:** Live `/components/checkboxes#usage`; `conv2-cb-usage-tight.png`; `conv2-cb-usage-probe.json` (`textSample` / empty `lis`); contrast `ref2-cb-usage.png` and Button demo `DemoDoDont` usage
- **remediationHint:** Pass JSX `<ul className="space-y-1 text-sm …"><li>…</li></ul>` into `doItems`/`dontItems` (as in `ButtonsDemo.tsx`), not bare `string[]` — `DemoDoDont` types are `ReactNode`

## Blocked items

None.

## Verifier notes

- Re-verified remediations on rendered CP light via Playwright iter-2 captures.
- DEF-001/002 closed; DEF-003 structure closed; new open visual DEF-006 on Usage list formatting.
- Did **not** mark manifest `synced`.
