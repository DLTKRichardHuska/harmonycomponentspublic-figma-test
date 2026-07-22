# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `RangeInput` (filled track resync) |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-20T18:56:00.000Z` |
| referenceVersion | `0.9.0` |
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

**Result:** PASS

Scoped resync verify for RangeInput filled track (theme mapper `mapSliderToTheme.ts`). Zero open visual defects for acceptance criteria. Prior iteration-2 “uniform gray track” guidance is obsolete and was not applied as a fail condition.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/specialty-inputs` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/specialty-inputs` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/range-input-filled-track-1/ref-range-input.png` |
| screenshot | `verification/artifacts/range-input-filled-track-1/conv-range-input.png` |
| screenshot | `verification/artifacts/range-input-filled-track-1/ref-range-with-label.png` |
| screenshot | `verification/artifacts/range-input-filled-track-1/conv-range-with-label.png` |
| probe | `verification/artifacts/range-input-filled-track-1/ref-probe.json` |
| probe | `verification/artifacts/range-input-filled-track-1/conv-probe.json` |

## Content parity

Scoped to Range Input examples on `/components/specialty-inputs` (NumberInput / Date / Toggle not re-litigated).

| Reference item | Status | Notes |
|----------------|--------|-------|
| Section: Range Input | present | Volume + Price Range examples |
| Example: Volume % | present | value 75% |
| Example: Price $ | present | value $100 |
| Section: Range Input With Label | present | inline Volume + 75% |
| Values / labels readable | present | |

**Content gaps (open):** 0

## Visual parity

CP × light. Designer-visible track fill resync only.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Volume — filled segment (min → thumb) | Medium theme-primary blue fill to ~75% | Medium theme-primary blue fill to ~75% (`rgb(42, 120, 198)`) | present |
| Volume — remaining rail | Light border/divider gray after thumb | Light divider gray rail (`rgb(191, 198, 212)`) | present |
| Volume — thumb | Circular theme-primary blue | Circular theme-primary blue | present |
| Price Range — filled segment | Primary blue fill to mid (~50% / $100) | Primary blue fill to mid | present |
| Price Range — remaining rail | Light gray after thumb | Light gray rail | present |
| Price Range — thumb | Primary blue circle | Primary blue circle | present |
| Range Input With Label — track fill | Primary blue to ~75%, gray remainder, blue thumb; inline Volume label | Same primary fill / gray rail / blue thumb; inline Volume label | present |

**Visual gaps (open):** 0

**Acceptance criteria check**

| Criterion | Verdict |
|-----------|---------|
| Filled segment is theme primary on both | Met |
| Remaining rail is border/divider gray on both | Met |
| Thumb is primary on both | Met |
| Do not FAIL for primary filled track (prior DEF-002 obsolete) | Honored — primary fill treated as correct |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS for filled-track resync. Manifest already `synced` for RangeInput; no remediations. Human should confirm acceptance before treating this report as the new sync evidence superseding `input-form-controls-2` track notes. |

**conversion-agent** must **AskQuestion** before any manifest rewrite of RangeInput notes / `lastVerified` when Status is `pending`.

## Defects

_None._

## Blocked items

_None._ Both review surfaces reachable.

## Dependencies

| Dependency | Manifest status | Notes |
|------------|-----------------|-------|
| Label | `synced` | Composite label examples present; does not block this track-color resync |

## Verifier notes

- Readonly designer compare of rendered specialty-inputs Range Input examples (CP × light).
- Screenshots + side-by-side browse; probe JSON is supporting evidence only — visual rows judged from rendered appearance, not CSS-only closure.
- Reference CSS uses `--thumb-color: var(--theme-primary)` fill via linear-gradient / moz-range-progress; converted `MuiSlider` track uses `var(--mui-palette-primary-main)`, rail `var(--mui-palette-divider)`, thumb primary — both surfaces read equivalently.
- Prior `input-form-controls-2` DEF-002 (“uniform gray track”) is obsolete relative to current Astro reference; this resync PASS supersedes that visual expectation for track fill.
- Scope fence: NumberInput / Date / Toggle not re-verified.
