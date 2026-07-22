# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Stepper` (with `Step`) |
| iteration | 2 |
| artifactType | `image` |
| generatedAt | 2026-07-21T00:20:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| priorReport | `verification/reports/stepper-tabstrip-1.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 2 |
| blocked | 0 |
| deferred | 0 |
| accepted | 4 |
| **total** | 7 |

**Result:** PASS-recommended (Stepper) pending human confirmation — the two iteration‑1 blocking defects are resolved; one minor cosmetic residual (DEF‑003) is left for human accept/decline. `accepted > 0`, so conversion-agent must AskQuestion before marking `synced`.

Per-element recommendation:

| Element | Recommendation | Reason |
|---------|----------------|--------|
| **Stepper** (with Step) | **PASS (pending human confirmation)** | DEF‑001 (hollow ring) and the active‑label color are both fixed and render equivalent to the reference. DEF‑002 (error triangle) is now an accepted gap in the manifest. Remaining delta is a minor idle‑number shade/ring‑stroke nuance (DEF‑003, low severity). |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (Stepper) | http://localhost:4321/components/stepper |
| converted (Stepper) | http://localhost:5176/components/stepper |
| screenshots | `verification/artifacts/stepper-2/{ref,conv}-stepper-full.png`, `{ref,conv}-stepper-examples.png`, `{ref,conv}-firstrow.png` (CP light) |
| probes (evidence only) | `verification/artifacts/stepper-2/{ref,conv}-stepper-probe.json` |
| capture scripts | `verification/artifacts/stepper-2/capture.mjs`, `zoom.mjs` (evidence only — not pass/fail gates) |

Rendered evidence reviewed side-by-side on both dev servers (CP / light). Servers already running; not restarted.

---

## Stepper (with Step)

### Content parity — Stepper

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Converted description shorter; success/warning wording dropped (state skipped, accepted) |
| Article nav | present | Converted swaps `Usage` for `Harmony mapping` (converted-demo convention) |
| Example: Default linear stepper | present | |
| Example: Step states (completed/active/error) | present | Converted "States: completed, active, error"; warning/success skipped (accepted) |
| Example: Linear stepper with multiple steps | present | |
| Example: Non-linear stepper | present | |
| Example: Non-linear stepper with icons (sections) | present | |
| Example: Stepper with descriptions | present | |
| Example: Stepper with disabled steps | present | |
| Props tables (Stepper + Step) | present | |
| Accessibility section | present | |

**Content gaps (open):** 0

### Visual parity — Stepper

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Active step indicator | Solid blue disc, white number | Solid blue disc, white number | present |
| Inactive / future step indicator | Hollow ring — transparent fill, thin grey border, grey number | Hollow ring — transparent fill, thin grey border, grey number | **fixed (DEF-001)** |
| Active step label | Near-black, semibold | Near-black (rgb 55,63,78), semibold | **fixed** |
| Error step indicator | Filled red circle with white error glyph | Red warning triangle (MUI default) | accepted (DEF-002, manifest gap) |
| Completed step indicator | Green filled disc, white check (uses `success`) | Blue filled disc, white check | accepted (success → completed) |
| Connector line (completed run) | Green line | Blue line | accepted (follows success skip) |
| Connector line (active/inactive) | Thin grey line | Thin grey line | present |
| Labels below indicator (alternativeLabel) | Centered under indicator | Centered under indicator | present |
| Idle step number color / ring stroke | Lighter grey number (~rgb 107,114,128), 2px ring | Slightly darker number (text.secondary rgb 82,89,105), 1px ring | **different (DEF-003, minor)** |
| Disabled step (label + indicator) | Greyed label, muted ring, muted description | Greyed label, muted ring, muted description | present |
| Icon steps (StepButton icon) | Icon in place of number, active affordance | Icon in place of number, active affordance | present |
| Step description (optional slot) | Muted caption under label | Muted caption under label | present |
| Overall spacing / rhythm | Even distribution, comfortable card padding | Even distribution, comfortable card padding | present |

**Visual gaps (open):** 1 (DEF-003, minor)

---

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Iteration‑1 blockers DEF‑001 (hollow ring) and the active‑label color are fixed. DEF‑002 (error triangle) is now an accepted gap (manifest, user‑accepted 2026‑07‑20). Accepted status skips (success→completed blue, warning→completed) remain. One new minor residual (DEF‑003) — verifier recommends accept as a token nuance; conversion-agent must AskQuestion before `synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **element:** Stepper / Step
- **reference:** Inactive and future steps render as a hollow ring — transparent fill, thin grey border, grey number inside.
- **converted (was):** Inactive/future steps rendered as a solid filled light-grey disc.
- **converted (now):** Inactive/future steps render as a hollow ring — transparent SVG fill, 1px `divider` border, number in `text.secondary`. Matches the reference open-circle appearance on every example (Default linear steps 2–4, Multiple-steps 4–5, Descriptions 3–4, Non-linear, Disabled). Active/completed/error correctly fill the circle.
- **evidence:** `ref-firstrow.png` vs `conv-firstrow.png`; `ref-stepper-examples.png` vs `conv-stepper-examples.png`; probe `conv-stepper-probe.json` idle icons `fill: rgba(0,0,0,0)`, `border: 1px solid rgb(191,198,212)`.
- **resolvedBy:** `mapStepperToTheme.ts` `MuiStepIcon` idle `color: transparent` + `border`, number in `text.secondary`; active/completed/error set `borderColor: transparent` and fill.

### DEF-ACTIVE-LABEL (folded from DEF-001 note)

- **status:** fixed
- **category:** visual
- **element:** StepLabel
- **reference:** Active step label is near-black and bold.
- **converted (was):** Active step label rendered primary-blue.
- **converted (now):** Active step label renders `text.primary` (rgb 55,63,78) semibold (probe `activeLabels`). Matches reference.
- **evidence:** `conv-firstrow.png` "Step 1" label; `conv-stepper-probe.json` `activeLabels[].color = rgb(55,63,78)`, `fontWeight 600`.

### DEF-003 (new — minor)

- **status:** open
- **category:** visual
- **element:** Step (idle indicator)
- **reference:** Idle-step number is a lighter grey (~rgb 107,114,128) inside a 2px grey ring.
- **converted:** Idle-step number is slightly darker (`text.secondary`, rgb 82,89,105) inside a 1px grey ring.
- **description:** In a close side-by-side, the conversion's idle step numbers read marginally darker/heavier than the reference's, and the ring stroke is 1px vs the reference 2px. Low severity — both read clearly as "outlined open circle with grey number"; this does not reintroduce the solid-disc problem. Offered for human accept as a token nuance rather than a blocking gap.
- **evidence:** `ref-firstrow.png` vs `conv-firstrow.png` (numbers 2/3/4); probes.
- **remediationHint (optional):** If the human wants exact parity, lighten the idle number toward the reference grey and/or widen the idle ring border to 2px in `mapStepperToTheme.ts` `MuiStepIcon` idle overrides.

### Accepted items (no action — recorded in manifest)

| Ref | Element | Accepted difference | Basis |
|-----|---------|---------------------|-------|
| ACC-01 | Step | Completed steps render as blue check instead of reference green check | `success` status skipped → mapped to `completed`; manifest gaps |
| ACC-02 | Step | Warning status renders as completed/blue (no distinct amber state) | manifest gaps (MUI Step = completed + error only) |
| DEF-002 | Step | Error step uses MUI's native red warning-triangle shape instead of reference red circle glyph | manifest gap; user-accepted 2026-07-20 (existing-mui divergence) |

## Blocked items

None — both review surfaces reachable.

## Verifier notes

Content inventory and the three-column visual matrix were completed from side-by-side rendered review of `:4321` and `:5176` (CP / light). No visual row was marked from CSS/probe output alone — probes only supplemented the rendered screenshots. DEF-001 (hollow ring) and the active-label color are confirmed **resolved** on-screen. DEF-002 (error triangle) is confirmed as the accepted manifest gap, not a defect. The only remaining delta is DEF-003, a minor idle-number-shade / ring-stroke nuance offered for human decision. Final acceptance and manifest `synced` are human decisions per FIDELITY_PRINCIPLES / VISUAL_MATCH_GATE (Stepper and Step must sync together).
