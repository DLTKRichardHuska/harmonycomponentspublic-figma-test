# Defect report format

Every conversion target's **readonly verify** phase must produce a defect report in this shape. The **conversion-fidelity-verifier** agent validates structure; targets fill content via `playbook/VERIFICATION.md`.

Compare criteria: [FIDELITY_PRINCIPLES.md](FIDELITY_PRINCIPLES.md), [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md), and [DESIGNER_COMPARE.md](../conversion-verify/reference/DESIGNER_COMPARE.md) — **designer-perceived** look, content, and act; not DOM/HTML parity across frameworks.

## File location

```
conversions/<conversion-id>/verification/reports/<scope>-<iteration>.md
conversions/<conversion-id>/verification/latest-defect-report.md
```

Optional machine-readable sidecar (same basename):

```
verification/reports/<scope>-<iteration>.json
```

JSON Schema: [`converters/schema/defect-report.schema.json`](../../../../converters/schema/defect-report.schema.json)

## Markdown template

```markdown
# Conversion defect report

| Field | Value |
|-------|-------|
| target | `<target-id>` |
| scope | `<foundation \| shell \| components \| ComponentName \| demo \| all>` |
| iteration | `<number>` |
| artifactType | `html` \| `image` \| `json` \| `other` |
| generatedAt | `<ISO-8601>` |
| referenceVersion | `<from conversion.manifest.json>` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 0 |

**Result:** PASS | FAIL | BLOCKED

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review URL (e.g. `http://localhost:4321/foundation/colors`) or screenshot path |
| converted | Live review URL (e.g. `http://localhost:5176/foundation/colors`) or screenshot path |

Record **rendered evidence** — source paths alone are insufficient for PASS.

## Content parity

Inventory reference page content vs converted. Mark each row: `present` | `missing` | `different` | `deferred` | `accepted`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title | present | |
| Section: Semi-Light Palette | present | |
| … | | |

**Content gaps (open):** 0

## Visual parity

Rendered appearance matrix for designer-visible items (not JSON string equality, not CSS property match on mismatched elements).

**Required format — three columns only:**

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Swatch: Table Total (CP light) | pale blue tint | solid blue | different |
| Alert: Learn more link alignment | aligns with message text | indented right of message | different |
| … | | | |

**Forbidden:** collapsed two-column matrix (`Item | Status`) without Reference/Converted rendered descriptions.

**Forbidden:** marking **present** because a probe returned matching CSS values — describe what the designer **sees**.

**Visual gaps (open):** 0

## Human confirmation

Required when `Summary.accepted > 0`, any defect is `deferred`/`accepted`, or before **conversion-agent** updates manifest `synced`.

| Field | Value |
|-------|-------|
| Status | pending \| confirmed |
| Confirmed by | human (via AskQuestion) \| explicit user instruction |
| Notes | … |

**conversion-agent** must **AskQuestion** before sync when Status is `pending`.

## Defects

### DEF-001

- **status:** open | fixed | blocked | deferred | accepted
- **category:** structure | visual | a11y | tokens | behavior | mapping | api | other
- **reference:** what the designer sees on reference
- **converted:** what the designer sees on conversion
- **description:** Designer would see … (plain language)
- **evidence:** browse URL + section, screenshot path, swatch-audit or alignment-audit artifact — **not** raw CSS values alone
- **remediationHint:** optional — target-owned suggestion (verifier may omit)

## Blocked items

List defects marked `blocked` with reason review surfaces or MCP were unavailable.

## Verifier notes

Readonly notes only — confirm content + visual matrices were completed per DESIGNER_COMPARE.md and VISUAL_MATCH_GATE.md (three-column visual matrix; no CSS-only closure).
```

## Defect phrasing

Write defects for **designers**, not engineers:

| Prefer | Avoid |
|--------|-------|
| "Designer would see Table Total as a solid blue on conversion but a pale tint on reference in CP light mode." | "mapColorsToPalette uses wrong key" |
| "Missing Accessibility section on Colors page — reference has Contrast Ratios and Color Blindness cards." | "ColorsDemo.tsx missing a11y-card component" |

Implementation details belong in `remediationHint` only when they help engineering fix a **visible** gap.

## PASS criteria

Verifier **recommends PASS** only when **all** are true:

1. Rendered evidence reviewed (live URLs or screenshots in Artifacts captured)
2. **Content parity:** no open `missing` or `different` rows (or all documented as deferred/accepted)
3. **Visual parity:** no open rendered deltas (or all documented as deferred/accepted with Human confirmation **confirmed**)
4. No visual row marked **present** from CSS/probe evidence alone
5. `Summary.open == 0`
6. `Result: PASS`

**Not sufficient for PASS:** theme mapper exists, JSON tokens match, routes wired, source-only review, CSS property match on different elements, collapsed visual matrix, ad-hoc diag probes as verdict.

**Final acceptance** is **converter playbook + human** — record human sign-off in `elements.<scope>.userDecision` when accepting with known gaps.

Zero open defects → output exactly: **PASS: zero conversion defects.**

## FAIL criteria

Any open defect in content parity, visual parity, or Defects list → **FAIL**:

```
1. VISUAL: Designer would see Table Total swatch as opaque blue on conversion vs transparent tint on reference (CP light).
2. STRUCTURE: Reference Colors page includes Accessibility section — missing on conversion demo.
3. TOKENS: Semi-dark palette shows wrong hover color when VP dark mode selected.
```

## BLOCKED criteria

Review surfaces unreachable or MCP capture failed → **BLOCKED** — do not substitute PASS from source review.

## Status transitions (remediate phase)

| From | To | When |
|------|-----|------|
| open | fixed | Remediate changed target; re-verify will confirm |
| open | blocked | Target playbook declares cannot fix (document reason) |
| open | deferred | User or playbook defers to later iteration |
| open | accepted | Human accepts known gap — good enough for this scope |
| fixed | open | Re-verify shows defect still present |

Remediate updates the same report file or writes `<scope>-<iteration>-remediated.md` with updated statuses.

## Related

- [DESIGNER_COMPARE.md](../conversion-verify/reference/DESIGNER_COMPARE.md)
- [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md)
- [FIDELITY_PRINCIPLES.md](FIDELITY_PRINCIPLES.md)
