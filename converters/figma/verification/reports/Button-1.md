# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Button` |
| product | `vp` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-22T01:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 6 |
| fixed | 0 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 7 |

**Result:** FAIL

> **Expected for this iteration.** Button was TEST-RUN `synced` to prove the converter E2E loop (apply → needs-publish → publish → Code Connect → synced) with quality intentionally deferred. Capture + compare path is proven; remediating fidelity is a follow-up session. Do **not** treat this FAIL as a capture/tooling failure.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `converters/figma/verification/artifacts/reference-Button.png` (Astro `/preview` via `capture-reference.mjs --scope Button --theme vp`) |
| converted | `converters/figma/verification/artifacts/vp-Button.png` (Figma MCP `get_screenshot` node `6:2` file `qPVWATAnhiYb6eboWa9LoD`) |
| resolve helper | `node converters/figma/scripts/resolve-capture-target.mjs --product vp --scope Button` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Variant grid (primary…destructive, dela) | present | Figma has 8 variants × 4 sizes |
| Size ladder xs–lg | present | |
| Icon + label examples | missing | No `icon` / `iconPosition` / orientation in Figma set |
| Disabled example | missing | `disabled` deferred / not on set |
| Loading example | missing | `loading` / `loadingText` deferred |
| Vertical / icon-above layout | missing | `orientation` deferred |

**Content gaps (open):** 4

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Primary / secondary / outline / ghost / destructive | Distinct paints | Present in grid | present |
| Dela / dela-pill | Gradient dela + dela-foreground | Solid `primary` fill (bound to Color/`primary`) | different |
| Icon buttons / leading-trailing icons | Present on preview | Absent | missing |
| Disabled / loading | Present on preview | Absent | missing |
| Variant × size readability | Preview sections | Confirmed X=`variant` Y=`size` grid + dashed purple outline | present |

**Visual gaps (open):** 3

## Token binding

| Check | Status | Notes |
|-------|--------|-------|
| Label text uses Color vars | present | |
| Dela fill = CSS-equivalent token | different | Bound to `primary` — should use Dela gradient / `dela-foreground` |
| Unbound solids | none found on sample | |

## Consumer API + wiring

| Prop (shadcn docs) | Figma | Status |
|--------------------|-------|--------|
| `variant` | VARIANT (wired) | present |
| `size` | VARIANT (wired) | present |
| `label` / children | TEXT `label` wired | present |
| `buttonType` | absent | missing (deferred in state) |
| `orientation` | absent | missing (deferred) |
| `disabled` | absent | missing (deferred) |
| `loading` / `loadingText` | absent | missing (deferred) |
| `icon` / `iconPosition` | absent | missing (deferred) |
| `fullWidth` | absent | missing (deferred) |
| HTML `state` | absent | deferred (Figma-only; confirm before add) |
| Orphan props | none | publish-ready for **shipped** inventory |

## HTML states

| Check | Status |
|-------|--------|
| Confirmed `state` VARIANT | deferred — not in TEST-RUN inventory |
| While Hovering → hover | n/a |

## Defects

| ID | Severity | Category | Status | Summary |
|----|----------|----------|--------|---------|
| DEF-001 | high | structure | open | Incomplete Consumer API vs shadcn Button docs (missing buttonType, orientation, disabled, loading, loadingText, icon, iconPosition, fullWidth) |
| DEF-002 | high | visual / tokens | open | `dela` / `dela-pill` use solid `primary` instead of Dela gradient / dela-foreground |
| DEF-003 | medium | visual | open | No icon / iconPosition / vertical orientation examples vs reference preview |
| DEF-004 | medium | visual | open | No disabled / loading appearances vs reference |
| DEF-005 | medium | structure | open | HTML interaction `state` not authored (hover/focus) — deferred pending confirmation |
| DEF-006 | low | process | open | Element marked `synced` during TEST-RUN despite open fidelity defects — verify should have blocked sync |
| DEF-007 | info | deferred | deferred | Figma-only `state` + remaining props intentionally deferred to quality session |

## Recommendation

**FAIL** — capture path works; Button is not fidelity-complete. Remediating deferred to a dedicated session. Keep `synced` only as documented TEST-RUN sign-off; do not use as a template for normal acceptance.

## Human confirmation

N/A for PASS. User acknowledged expected FAIL while completing converter E2E / verifier capture wiring.
