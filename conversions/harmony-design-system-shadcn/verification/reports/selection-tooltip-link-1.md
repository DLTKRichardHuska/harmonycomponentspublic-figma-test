# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Checkbox`, `CheckboxGroup`, `RadioButton`, `RadioGroup`, `Link`, `Tooltip` |
| iteration | `1` |
| artifactType | `png` + `json` |
| generatedAt | `2026-07-20T21:30:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 5 |

**Result:** FAIL

**FAIL: selection-control borders read thinner than reference (1px vs 2px); Radio Buttons demo missing several reference examples.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/checkboxes`, `…/checkbox-groups`, `…/radio-buttons`, `…/radio-groups`, `…/links`, `…/tooltips` |
| converted (live) | `http://localhost:5177/components/checkboxes`, `…/checkbox-groups`, `…/radio-buttons`, `…/radio-groups`, `…/links`, `…/tooltips` |
| artifacts dir | `conversions/harmony-design-system-shadcn/verification/artifacts/selection-tooltip-link-1/` |
| page tops / fulls | `ref-*-top.png`, `conv-*-top.png`, `ref-*-full.png`, `conv-*-full.png` |
| section crops | `*-cb-states.png`, `*-cb-variants.png`, `*-cg-*.png`, `*-rb-*.png`, `*-rg-*.png`, `*-link-*.png`, `*-tip-*.png` |
| tooltip open | `ref-tooltip-open-fixed.png`, `conv-tooltip-open.png`, `conv-tooltip-panel-fixed.png` |
| probes / inventories | `*-inventory.json`, `*-checkbox-face-probe.json`, `*-radio-face-probe.json`, `*-link-styles.json`, `conv-tip-probe-fixed.json` |
| capture scripts | `capture.mjs`, `capture-sections.mjs` |

## Content parity

### Checkbox (`/components/checkboxes`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Converted badge in-progress (expected pre-sync) |
| Examples / Props / Accessibility | present | |
| Usage Guidelines (Do / Don't) | missing | Reference h2 Usage Guidelines not on demo |
| Basic / States / Without Labels / Form Group / Inline / State Variants | present | Hybrid C CheckboxField + bare Checkbox |
| Props table + ImportSnippet | present | Package name imports |
| A11y cards | present | Labels + Keyboard (vs ref Labels / Keyboard / Error States — outcomes covered) |

**Content gaps (open):** 1 (Usage Guidelines)

### CheckboxGroup (`/components/checkbox-groups`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Vertical / Horizontal / Error / Warning | present | Titles differ slightly (Vertical Group vs Basic Group) |
| “Using CheckboxGroup Component” educational block | different | Converted leads with package CheckboxGroup only (acceptable consolidation) |
| Props + A11y | present | |
| ImportSnippet | present | |

**Content gaps (open):** 0

### RadioButton (`/components/radio-buttons`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Basic / Sizes / States | different | States omit **Checked & Disabled** |
| Inline Layout (labeled horizontal) | missing | Only bare “Without Labels” row |
| State Variants warning/error | different | Omits disabled warning + disabled error rows |
| Props + A11y + ImportSnippet | present | |

**Content gaps (open):** 2 (Inline Layout; incomplete States / State Variants)

### RadioGroup (`/components/radio-groups`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Vertical / Horizontal / Error / Warning | present | |
| Educational “Using RadioGroup” block | different | Consolidated into package demos |
| Props + A11y + ImportSnippet | present | |

**Content gaps (open):** 0

### Link (`/components/links`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Basic / Sizes / Muted / External | present | Size demo vertical vs ref middot row — same size ladder |
| Responsive default size &lt;768px | accepted | UnsupportedEquivalentCallout + plan/manifest gap |
| Props + A11y + ImportSnippet | present | Includes `asChild` |

**Content gaps (open):** 0 (1 accepted)

### Tooltip (`/components/tooltips`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| On Button / Positions / On icon / On text | present | |
| Corner Variants | accepted | UnsupportedEquivalentCallout + plan/manifest `skippedProps` |
| Props + A11y + ImportSnippet | present | Focus/hover via Radix noted |
| Open tooltip behavior | present | Hover/focus shows tip |

**Content gaps (open):** 0 (1 accepted)

### Docs / import / Consumer API

| Check | Status |
|-------|--------|
| Element-specific ImportSnippet (package name) | PASS |
| No duplicated Getting Started global setup | PASS |
| `docs/components/Checkbox.md` Hybrid C + CheckboxField | PASS |
| `docs/components/CheckboxGroup.md` | PASS |
| `docs/components/RadioButton.md` + RadioGroup.md | PASS |
| `docs/components/Link.md` (skip responsive noted) | PASS |
| `docs/components/Tooltip.md` (skip cornerVariant noted) | PASS |
| `AGENTS.md` selection / Link / Tooltip sections | PASS |
| Approved Hybrid C + skipped props match plan | PASS |

### Stack elegance

| Check | Status |
|-------|--------|
| Radix Checkbox / Radio Group / Tooltip | PASS |
| CheckboxGroup fieldset shell | PASS |
| Link cva `<a>` + Icon external | PASS |
| Package Icon for check / external (no Lucide call sites) | PASS |
| Documented gaps only (cornerVariant, Link responsive) | PASS |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Checkbox face size ~18×18, radius-sm, white fill | 18px square, light gray border | Matching size/radius/fill | present |
| Unchecked checkbox border weight | **2px** gray (`--border-width-standard`) | **1px** Tailwind `border` — visibly thinner | different |
| Checked fill + white check | Theme blue fill, white check | Matching blue + Icon check | present |
| Disabled / checked-disabled | Faded face + muted label | Matching muted treatment | present |
| Warning/error faces + message icons | Orange/red border + icon + message | Matching chrome and messages | present |
| CheckboxGroup error: red legend, red child borders, message | Red group chrome | Matching | present |
| Radio face sizes sm/md/lg + blue selected ring/dot | Size ladder + CSS dot | Matching sizes and selected look | present |
| Unchecked radio border weight | **2px** gray | **1px** — thinner ring | different |
| Radio warning/error borders + messages | Orange/red rings + helpers | Matching for shown rows | present |
| Link color / sizes 12/14/16 / muted gray / external icon | `rgb(0,91,179)` ladder | Matching color, sizes, muted, external Icon | present |
| Tooltip open: dark charcoal panel, white text, arrow | `--text-primary` bg, inverse text, caret | Matching (Radix arrow) | present |
| Tooltip corner variants | Sharp-corner demos | Omitted with callout | accepted |
| Link responsive default size | sm below 768 when unset | Always explicit size (default md) | accepted |

**Visual gaps (open):** 1 (selection-control border width — checkbox and radio)

## Side-by-side visual / behavior summary

**Matches**

- Checkbox / radio checked fill, indicators, disabled fade, warning/error messaging
- Group legend error/warning propagation and horizontal layouts
- Link color, size ladder, muted, external icon
- Tooltip dark panel + arrow on hover/focus; positions demos
- Hybrid C demos and package ImportSnippets; approved skips documented with callouts

**Differs (defects)**

- Unchecked (and default) checkbox/radio borders are thinner than Harmony’s 2px standard — noticeable in side-by-side review
- Radio Buttons page missing Inline Layout and several state rows (Checked & Disabled; disabled warning/error)
- Checkboxes page missing Usage Guidelines Do/Don’t

**Differs (not defects)**

- ImportSnippet / coverage % / in-progress badge
- Radix markup vs Astro native inputs
- Link size examples stacked vs middot row
- Tooltip `cornerVariant` and Link responsive default size (accepted gaps)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Remediate open defects (or accept with AskQuestion) before `synced` |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Unchecked checkbox and radio faces use a **2px** gray border (`--border-width-standard`)
- **converted:** Same faces use a **1px** border (Tailwind `border` utility) — rings look thinner at equal 18px size
- **description:** Designer would notice thinner selection-control outlines on both Checkbox and RadioButton versus reference CP light.
- **evidence:** `ref-checkbox-face-probe.json` / `conv-checkbox-face-probe.json` (2px vs 1px); `ref-radio-face-probe.json` / `conv-radio-face-probe.json`; live `/components/checkboxes` and `/components/radio-buttons` Basic sections; crops `*-cb-states.png`, `*-rb-basic.png`
- **remediationHint:** Use `border-[length:var(--border-width-standard)]` (or equivalent) instead of `border` on Checkbox and RadioButton `cva` roots

### DEF-002

- **status:** open
- **category:** structure
- **reference:** Radio Buttons examples include Inline Layout (labeled Red/Green/Blue), States with Checked & Disabled, and State Variants with disabled warning/error
- **converted:** No labeled Inline Layout; States stop at Disabled; State Variants omit disabled warning/error
- **description:** Designer reviewing the Radio Buttons doc page would find fewer state/layout examples than on reference.
- **evidence:** Inventories `ref-radio-buttons-inventory.json` vs `conv-radio-buttons-inventory.json`; reference `/components/radio-buttons` vs demo; `RadioButtonsDemo.tsx` vs `src/pages/components/radio-buttons.astro`

### DEF-003

- **status:** open
- **category:** structure
- **reference:** Checkboxes page includes Usage Guidelines with Do / Don't cards
- **converted:** No Usage Guidelines section
- **description:** Designer would miss the usage guidance block present on the reference Checkboxes page.
- **evidence:** `ref-checkboxes-inventory.json` (Usage Guidelines / Do / Don't); live reference vs `CheckboxesDemo.tsx`

### DEF-004

- **status:** accepted
- **category:** other
- **reference:** Tooltip Corner Variants (sharp corners)
- **converted:** UnsupportedEquivalentCallout; plan/manifest skip `cornerVariant`
- **description:** Approved Hybrid C / plan gap — not an open defect.
- **evidence:** `plans/selection-tooltip-link.md`; demo callout on `/components/tooltips`

### DEF-005

- **status:** accepted
- **category:** other
- **reference:** Link responsive default size below 768px when no size class
- **converted:** Always explicit size (default md) with callout
- **description:** Approved plan/manifest gap — not an open defect.
- **evidence:** `plans/selection-tooltip-link.md`; demo callout on `/components/links`

## Blocked items

None — both review surfaces responded (`:4321`, `:5177`).

## Verifier notes

- Designer compare on rendered CP light screenshots + live routes; content inventories from Playwright.
- Three-column visual matrix completed; probes used only as supporting evidence for the border-width finding (confirmed in screenshots).
- Did **not** mark manifest `synced`.
- Recommend remediating DEF-001 before re-verify; DEF-002/003 are content completeness for human accept.
