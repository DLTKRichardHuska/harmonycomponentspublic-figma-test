# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Checkbox`, `CheckboxGroup`, `RadioButton`, `RadioGroup`, `Link`, `Tooltip` |
| iteration | `3` |
| artifactType | `png` + `json` |
| generatedAt | `2026-07-20T21:50:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 6 |

**Result:** PASS

**PASS: zero open defects.** DEF-006 Usage Do/Don't now renders as bulleted lists. Prior remediations (borders, Radio demo content, Usage section) remain closed. Approved Link/Tooltip gaps unchanged.

Prior reports: `selection-tooltip-link-1.md`, `selection-tooltip-link-2.md`

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| converted Usage | `http://localhost:5177/components/checkboxes#usage` |
| reference Usage | `http://localhost:4321/components/checkboxes` (Usage Guidelines) |
| iter-3 crops | `conv3-cb-usage.png`, `ref3-cb-usage.png` |
| iter-3 probe | `conv3-cb-usage-probe.json` (`liCount: 13`, `smashed: false`) |
| prior evidence | `selection-tooltip-link-1/` iter-1/2 captures (borders, radio content, etc.) |
| capture script | `capture-iter3.mjs` |

## Content parity

| Scope | Status | Notes |
|-------|--------|-------|
| Checkbox examples + Usage Guidelines | present | Do/Don't bulleted lists readable |
| CheckboxGroup / RadioGroup | present | Unchanged from iter 2 |
| RadioButton (inline, states, variants) | present | Unchanged from iter 2 |
| Link / Tooltip | present | Approved skips with callouts |

**Content gaps (open):** 0

### Docs / import / Consumer API / stack

PASS — unchanged from iter 1/2 (Hybrid C API, ImportSnippets, Radix/cva, documented gaps).

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Usage Do/Don't lists | Bulleted guidance in paired cards | Bulleted `<ul>/<li>` lists (7 Do + 6 Don't); no smash | present |
| Selection borders 2px | 2px faces | 2px (`border-2`) — fixed iter 2 | present |
| Radio demo completeness | Inline + full states/variants | Matching — fixed iter 2 | present |
| Link / Tooltip | Color ladder / dark tip | Matching; cornerVariant + responsive size accepted | present / accepted |

**Visual gaps (open):** 0

## Side-by-side visual / behavior summary

**Matches**

- Checkbox Usage Guidelines now scan as proper Do/Don't bullets (probe: 13 `li`, `smashed: false`)
- Selection control borders, radio demo content, groups, Link, Tooltip from prior iterations

**Accepted (not defects)**

- Tooltip `cornerVariant`, Link responsive default size (&lt;768px)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS; **AskQuestion** / human accept before `synced` |

## Defects

### DEF-001 — fixed (iter 2)
Checkbox/Radio borders 2px.

### DEF-002 — fixed (iter 2)
Radio Buttons demo content restored.

### DEF-003 — fixed (iter 2)
Checkboxes Usage section + nav.

### DEF-004 — accepted
Tooltip `cornerVariant` skipped with callout.

### DEF-005 — accepted
Link responsive default size skipped with callout.

### DEF-006 — fixed (iter 3)

- **status:** fixed
- **category:** visual
- **reference:** Readable bulleted Do/Don't lists
- **converted:** `DemoDoDont` now receives `<ul>/<li>` ReactNodes; lists render with line breaks and bullets
- **description:** Smashed Usage text resolved.
- **evidence:** `conv3-cb-usage.png`, `conv3-cb-usage-probe.json` (`smashed: false`, 13 list items)

## Blocked items

None.

## Verifier notes

- Quick re-check focused on Usage Guidelines render after DEF-006 fix; prior iter-2 visual/content closures trusted with probe confirmation.
- Did **not** mark manifest `synced` — human acceptance required.
