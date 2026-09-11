# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Dialog` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T20:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 2 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/dialogs` (CP light/dark) |
| converted | Live `http://localhost:5178/components/dialogs` (CP light/dark, forced-colors) |
| metrics | `verification/artifacts/dialog-1/capture-metrics.json` |
| probes | `verification/artifacts/dialog-1/` |

Rendered evidence: Playwright browse of Astro-parity examples (open panels) plus production extras. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No `window.openDialog` / `closeDialog` | deferred | Plan / manifest accepted |
| No `confirmCallbackName` globals | deferred | Plan accepted |
| No public `.dialog-overlay` recipe | deferred | CE-only; native `<dialog>` |
| `close-on-backdrop` / `dirty` / `confirm-unsaved` | n/a | Intentional production; after parity examples |
| Custom Element / Shadow vs Astro overlay div | n/a | Not a defect |
| Docs chrome `stable` vs conversion badge | deferred | Docs chrome only |
| Layout educational section omitted | deferred | Scroll proven in Long Content example |
| Forced-colors look vs Astro | n/a | No reference HC baseline |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Basic / Confirmation / Three buttons | present | |
| Right-aligned / Primary header / Combined | present | |
| Resizable / Long scrollable body | present | |
| Vanilla production (backdrop lock, unsaved) | present | After parity section |
| Props / API | present | |
| Accessibility | present | |

## Visual matrix (designer)

| Criterion | Reference | Converted | Status |
|-----------|-----------|-----------|--------|
| Panel width ~700px / tokens | yes | yes | match |
| Sticky header/footer, scroll body | yes | yes | match |
| Primary header inverse text | yes | yes | match |
| Footer left/right alignment | yes | yes | match |
| Resize grip | yes | yes | match |
| Dark CP panel | yes | yes | match |
| Forced-colors usable | n/a | yes | pass |

## Behavior

- `show()` / `close({ force })`; Escape; backdrop gated by `close-on-backdrop`
- Convenience confirm/cancel/tertiary events; cancelable `close-request`
- Nested unsaved confirm when `dirty` + `confirm-unsaved`

## Recommendation

**PASS** — ready for human visual acceptance → `synced`.
