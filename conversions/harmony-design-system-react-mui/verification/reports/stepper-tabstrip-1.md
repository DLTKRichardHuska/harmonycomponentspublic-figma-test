# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Stepper` (with `Step`) + `TabStrip` |
| iteration | 1 |
| artifactType | `image` |
| generatedAt | 2026-07-21T00:03:22Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 5 |
| **total** | 7 |

**Result:** FAIL (Stepper) · PASS-recommended pending human confirmation (TabStrip)

Per-element recommendation:

| Element | Recommendation | Reason |
|---------|----------------|--------|
| **Stepper** (with Step) | **FAIL** | Inactive/future step indicator renders as a solid filled grey disc vs reference's hollow outlined ring — designer-visible on every example (DEF-001). Error state uses a red triangle vs reference red circle glyph (DEF-002). |
| **TabStrip** | **PASS (pending human confirmation)** | All in-scope examples visually equivalent; accepted gaps shown as `UnsupportedEquivalentCallout`; overflow via `variant="scrollable"` is the accepted equivalent. `accepted > 0`, so AskQuestion required before sync. |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (Stepper) | http://localhost:4321/components/stepper |
| converted (Stepper) | http://localhost:5176/components/stepper |
| reference (TabStrip) | http://localhost:4321/components/tab-strip |
| converted (TabStrip) | http://localhost:5176/components/tab-strip |
| screenshots | `verification/artifacts/stepper-tabstrip-1/*.png` (ref/conv full + per-example, CP light) |
| capture scripts | `verification/artifacts/stepper-tabstrip-1/capture.mjs`, `capture2.mjs` (evidence only) |

Rendered evidence reviewed side-by-side on both dev servers (CP / light). Servers already running; not restarted.

---

## Stepper (with Step)

### Content parity — Stepper

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Converted description shorter; success/warning wording dropped (state skipped) |
| Article nav | present | Reference has `Usage`; converted swaps to `Harmony mapping` (converted-demo convention) |
| Example: Default linear stepper | present | |
| Example: Alternative Label / step states | present | Converted titled "States: completed, active, error"; warning/success statuses skipped (accepted) |
| Example: Linear stepper with multiple steps | present | |
| Example: Linear vs Non-linear (explanatory) | different | Converted demonstrates non-linear as its own example; the reference explanatory prose card is not reproduced (educational text) |
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
| Inactive / future step indicator | Hollow ring — white fill, thin grey border, grey number | Solid filled light-grey disc with number | **different (DEF-001)** |
| Error step indicator | Filled red circle with white error glyph | Red warning triangle (MUI default), no circle | **different (DEF-002)** |
| Completed step indicator | Green filled disc, white check (uses `success`) | Blue filled disc, white check | accepted (success status skipped → completed) |
| Connector line (completed run) | Green line | Blue line | accepted (follows success skip) |
| Connector line (active/inactive) | Thin grey line | Thin grey line | present |
| Labels below indicator (alternativeLabel) | Present, centered under indicator | Present, centered under indicator | present |
| Active step label color | Near-black, bold | Primary blue | different (minor — folded into DEF-001 remediation note) |
| Disabled step (label + indicator) | Greyed label, muted ring, description muted | Greyed label, muted disc, description muted | present |
| Icon steps (StepButton icon) | Icon in place of number, underline/active affordance | Icon in place of number, active affordance | present |
| Step description (optional slot) | Muted caption under label | Muted caption under label | present |
| Overall spacing / rhythm | Even distribution, comfortable padding in card | Even distribution, comfortable padding in card | present |

**Visual gaps (open):** 2 (DEF-001, DEF-002)

---

## TabStrip

### Content parity — TabStrip

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| Article nav | present | Reference `Examples/Props/Accessibility`; converted adds `Harmony mapping` |
| Example: Basic Tabs | present | |
| Example: With Icons (Left) | present | |
| Example: With Icons (Right) | present | |
| Example: With Icons (Centered Over Text) | present | |
| Example: Disabled Tab | present | |
| Example: Enforced Icon Position | present | |
| Example: With Add Tab Button | accepted | Skipped — `UnsupportedEquivalentCallout` (no MUI equivalent) |
| Example: Per-tab actions (open/close/⋮) | accepted | Skipped — callout |
| Example: With Overflow Handling ("More(N)") | accepted | Replaced by "Scrollable overflow" (`variant="scrollable"`) — accepted equivalent |
| Example: Manual Overflow Control | accepted | Skipped — part of overflow-menu callout |
| Example: Compact Variant | accepted | Skipped — callout |
| Example: VP Pill Variant | accepted | Skipped — callout (also VP-only) |
| Props tables | present | Converted documents MUI Tabs/Tab API (approved existing-mui surface) |
| Accessibility section | present | |

**Content gaps (open):** 0

### Visual parity — TabStrip

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tabs — selected tab | Blue label + blue underline indicator | Blue label + blue underline indicator | present |
| Basic tabs — inactive tabs | Grey labels, no underline | Grey labels, no underline | present |
| Tab strip bottom divider | Full-width thin divider under row | Full-width thin divider under row | present |
| Icons left (start) | Icon before label, inline | Icon before label, inline | present |
| Icons right (end) | Icon after label, inline | Icon after label, inline | present |
| Icons centered/top | Icon stacked above label, centered | Icon stacked above label, centered | present |
| Disabled tab | Muted/greyed label, not selectable | Muted/greyed label, not selectable | present |
| Enforced icon position | Consistent top icons across tabs | Consistent top icons across tabs | present |
| Overflow behaviour | Harmony "More(N)" dropdown | MUI scrollable strip with scroll chevron in bordered box | accepted (MUI-native equivalent) |
| Label typography / weight | Sans, medium, comfortable padding | Sans, medium, comfortable padding | present |

**Visual gaps (open):** 0

---

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Both elements carry accepted gaps (Stepper success/warning skip; TabStrip add/close/⋮/More + compact/pill skips). conversion-agent must AskQuestion before marking either element `synced`. Stepper additionally has 2 open visual defects that are not covered by any accepted gap. |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **element:** Stepper / Step
- **reference:** Inactive and future steps show a hollow ring indicator — white fill, thin grey border, grey number inside.
- **converted:** Inactive and future steps show a solid filled light-grey disc with the number inside.
- **description:** A Harmony designer would see every not-yet-reached step as an outlined open circle on the reference, but as a filled grey "pill/coin" on the conversion. This differs on every stepper example (Default linear steps 2–4, States "Complete setup", Multiple-steps steps 4–5, Descriptions steps 3–4, Disabled steps). The active-step label also renders primary-blue on the conversion vs near-black on the reference. Not covered by any accepted gap.
- **evidence:** `ref-stepper-full.png` vs `conv-stepper-full.png`; `ref-st-descriptions.png` vs `conv-st-descriptions.png`; `ref-stepper-examples.png` vs `conv-stepper-examples.png`
- **remediationHint:** In `mapStepperToTheme.ts` `MuiStepIcon`, render the idle/inactive indicator as an outlined ring (transparent fill + border in `divider`/disabled color, number in `text.secondary`) instead of `color: action.disabledBackground` (which paints a solid fill); align the active-label color treatment with reference.

### DEF-002

- **status:** open
- **category:** visual
- **element:** Step
- **reference:** The error step is a filled red circle with a white error glyph (matching the circular indicator shape of the other steps).
- **converted:** The error step is MUI's default red warning triangle with no surrounding circle, breaking the circular indicator rhythm of the row.
- **description:** Error is an in-scope supported state (not a skipped status). A designer would see a consistent red circle on reference but a triangle that visually differs in shape/silhouette on the conversion.
- **evidence:** `ref-stepper-full.png` (States row "Fix errors") vs `conv-stepper-full.png` (States row "Fix errors")
- **remediationHint:** Override `MuiStepIcon` error rendering to keep the circular indicator with an error glyph/fill in `error.main`, rather than the default triangle icon.

### Accepted items (no action — human to confirm)

| Ref | Element | Accepted difference | Basis |
|-----|---------|---------------------|-------|
| ACC-01 | Step | Completed steps render as blue check instead of reference green check | `success` status skipped → mapped to `completed`; manifest gaps + user brief |
| ACC-02 | Step | Warning status renders as completed/blue (no distinct amber state) | manifest gaps (MUI Step = completed + error only) |
| ACC-03 | TabStrip | `showAddTab`, per-tab actions (open/close/⋮), "More" overflow dropdown omitted (callout) | manifest gaps + user brief |
| ACC-04 | TabStrip | Overflow shown via `variant="scrollable"` instead of Harmony More menu | manifest userDecision |
| ACC-05 | TabStrip | `variant="compact"` / `variant="pill"` omitted (callout) | manifest gaps + user brief |

## Blocked items

None — both review surfaces reachable.

## Verifier notes

Content inventory and three-column visual matrices completed from side-by-side rendered review of `:4321` and `:5176` (CP / light). No visual row was marked `present` from CSS/probe output — all judgments are from rendered screenshots. Accepted gaps match `conversion.manifest.json` (`TabStrip`, `Stepper`, `Step` elements, all `in-progress`) and the demo `UnsupportedEquivalentCallout`s. Stepper FAIL is driven by DEF-001/DEF-002, which are outside the accepted-gap set; final acceptance is a human decision per FIDELITY_PRINCIPLES / VISUAL_MATCH_GATE.
