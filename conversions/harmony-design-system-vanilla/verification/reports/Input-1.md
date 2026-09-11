# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Label` + `Input` + `Textarea` (joint cycle) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T21:30:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/labels-inputs.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 2 |

**Result:** PASS (pending human visual acceptance) — DEF-001 remediated with Usage Guidelines Do/Don't on Inputs demo.

## Side-by-side visual summary

| Area | Reference (`:4321`) | Converted (`:5178`) | Verdict |
|------|---------------------|---------------------|---------|
| Labels — basic / required `*` / helper | Stacked label + field; red `*`; muted `(optional)` | Same native `.label` / `.label--required` / `.label__helper` | Match |
| Inputs — Basic / Types | Stacked labels; VP ~40×16px / 8px radius | Same via `<harmony-input>` | Match |
| CP compact | ~20×12px / 4px radius | Same when product=Costpoint | Match |
| With Icon / trailing / slot | Leading + trailing icons; eye ghost action | Same adornments + trailing slot | Match |
| States | Default / grey disabled / red error + message | Same colors and message text | Match |
| Textarea | Multi-line + placeholder | `<harmony-textarea>` equivalent | Match |
| Label stacked / inline / textarea inline | Stacked attr label; sibling inline wrappers | Same (no `label-variant`; approved) | Match |
| Form Example (+ inline labels) | Contact card, 2-col names, envelope email, textarea, full-width Send | Same layout and button chrome | Match |
| Form layout stacked/inline | n/a (conversion-only) | Present; aligned label columns + required `*` | Extra OK (plan) |
| Native dual path | n/a | Unclassed input/textarea pick up Harmony look | Extra OK (plan) |
| Usage Guidelines Do/Don't | Present | Present (remediated Input-1) | Match |
| Forced-colors | n/a (Astro not required match) | Focus outline + system borders usable | Pass |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/labels`, `http://localhost:4321/components/inputs` |
| converted | Live `http://localhost:5178/components/labels`, `http://localhost:5178/components/inputs` |
| metrics | `verification/artifacts/inputs-1/capture-metrics.json` |
| screenshots | `verification/artifacts/inputs-1/*` |

## Approved non-defects (plan / Consumer API)

| Item | Notes |
|------|-------|
| No `harmony-label` | Native `.label` recipe |
| No `label-variant` on fields | Layout via sibling wrappers / `harmony-form-layout` |
| No Astro auto-id | Consumer supplies `id` |
| Dual path CE + native CSS | Documented + demo “Native dual path” |
| Conversion-only `harmony-form-layout` | Extra Inputs sections after reference parity |
| Specialty inputs | Out of scope |
| Props → Classes on Labels | Native surface documents classes |
| `stable` / article-nav chrome | Demo chrome differs (same pattern as other vanilla scopes) |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Inputs page **Usage Guidelines** with Do / Don't guideline cards
- **converted:** Added Do/Don't cards to `DemoInputsPage` before API section
- **description:** Was missing; remapped from reference `#usage`
- **evidence:** Live Inputs demo heading inventory after remediate
- **remediationHint:** n/a

### DEF-002

- **status:** deferred
- **category:** structure
- **reference:** Green `stable` badge + article-nav chips
- **converted:** Orange `in progress` scope badge; in-page `h2`s without top article-nav chips
- **description:** Demo chrome differs from DocsLayout — consistent with other vanilla component demos; not component fidelity.
- **evidence:** `ref-*-top.png` vs `conv-*-top.png`
- **remediationHint:** None for this cycle

## Verifier notes

- Joint cycle report for Label + Input + Textarea.
- Capture metrics: VP/CP heights, borders, radii, and label samples align; converted reports 2× `harmony-form-layout`.
- **Recommendation after DEF-001 fix:** PASS pending human visual acceptance before joint `synced`.
