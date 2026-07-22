# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Spinner` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-14T20:03:46.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 3 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/spinner` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/spinner` (HTTP 200) |
| screenshots | `verification/artifacts/spinner-1/` (`ref-` / `conv-` light + dark page + examples) |
| probe / inventory | `verification/artifacts/spinner-1/probe.json`, `inventory.json`, `compare-meta.json` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

## Content parity

Inventory of reference `spinner.astro` vs converted `SpinnersDemo.tsx` at `/components/spinner`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | different | Ref: “Spinners indicate that content is loading or an action is being processed.” Conv: “Loading spinner components for indicating progress.” (DEF-001) |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Sizes (sm, md, lg) | present | |
| Example: In Context (inline + card) | present | Same “Loading…” / “Loading content…” copy |
| Props table | present | Lists Harmony `size` enum (mirrors reference); Mapping section documents MUI numeric size/thickness |
| Accessibility: ARIA Attributes | present | MUI-framed copy (aria-label on CircularProgress) — equivalent topic |
| Accessibility: Screen Reader Support | present | |
| Accessibility: Animation Preferences | missing | Reference card on `prefers-reduced-motion` absent on converted (DEF-002) |
| Extra: Harmony → MUI mapping | accepted | Target-specific addition — not a gap |

**Content gaps (open):** 2

## Visual parity

Rendered appearance — CP product; light (primary) and dark confirmed.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Sizes row — three rings, ascending | Small / medium / large CSS border rings; primary arc on gray track | Same hierarchy via CircularProgress; primary arc on gray track | present |
| Spinner active color (light) | Primary blue `rgb(42, 120, 198)` | Primary blue `rgb(42, 120, 198)` | present |
| Spinner track / rest ring (light) | Border gray `rgb(191, 198, 212)` | Track `rgb(191, 198, 212)` via enableTrackSlot | present |
| Approximate outer sizes (light) | ~20 / ~29 / ~49 px | ~21 / ~31 / ~52 px | present |
| Stroke weight grows with size | sm thinner, lg thicker (2/3/4px borders) | sm/md/lg thickness 2.5 / 3.5 / 4 | present |
| Inline “Loading…” row | sm spinner left of secondary text | Same layout and copy | present |
| Card “Loading content…” | lg spinner centered above secondary caption in outlined card | Same composition | present |
| Dark mode primary + track | Primary blue on muted gray track | Same reading | present |
| Indeterminate motion character | CSS full-ring rotate (~0.8s) | MUI CircularProgress arc animation | present |

**Visual gaps (open):** 0

Motion engines differ (CSS border spin vs MUI arc) but both read as indeterminate loading with track + primary accent — intentional for `existing-mui` CircularProgress; not filed as open defect.

## Examples purity / mapping checks

| Check | Status |
|-------|--------|
| Direct `@mui/material/CircularProgress` in examples | PASS |
| No file-local React components wrapping MUI | PASS |
| No invented Harmony-shaped props on CircularProgress | PASS — uses documented `size` / `thickness` |
| No fidelity `sx` for Harmony size/color | PASS — layout-only sx on Paper/Stack/Box |
| Manifest `propMappings` cover Harmony `size` | PASS |
| Catalog dependencies | none — N/A |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Required before manifest `synced` even after remediate + re-verify PASS |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Page intro reads “Spinners indicate that content is loading or an action is being processed.”
- **converted:** Page intro reads “Loading spinner components for indicating progress.”
- **description:** Designer would see a different lead sentence under the Spinner title — converted used the DocsLayout meta blurb instead of the visible page-header description.
- **evidence:** Live browse light pages; `compare-meta.json` (`refDesc.desc` vs `convDesc.texts[1]`); `ref-light-page.png` / `conv-light-page.png`
- **remediationHint:** Set `DemoPageHeader` `description` to match `spinner.astro` `.page-header__description` copy.

### DEF-002

- **status:** open
- **category:** structure
- **reference:** Accessibility section includes a third card “Animation Preferences” describing `prefers-reduced-motion`.
- **converted:** Accessibility has ARIA Attributes + Screen Reader Support only — Animation Preferences missing.
- **description:** Designer would miss the reduced-motion guidance card that appears on the reference Spinner doc.
- **evidence:** Live browse; `inventory.json` (`animationPrefs` / headings); `spinner.astro` lines 88–96 vs `SpinnersDemo.tsx` Accessibility section
- **remediationHint:** Add an `A11yCard` for Animation Preferences (MUI-framed: CircularProgress / CSS animation respects `prefers-reduced-motion` where applicable).

### DEF-003

- **status:** accepted
- **category:** structure
- **reference:** Article nav links Examples, Props, Accessibility
- **converted:** Also includes Harmony mapping
- **description:** Extra mapping nav/section is target-specific documentation — not a designer gap for the Spinner examples themselves.
- **evidence:** Prior component verifies (ButtonGroup, ProgressBar) treat mapping as accepted addition

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Strategy `existing-mui` → `@mui/material/CircularProgress` + `mapSpinnerToTheme.ts` (theme defaults: indeterminate, primary, size 24, thickness 3.5, `enableTrackSlot`, track = divider).
- Hard dependency check: Spinner has no catalog `dependsOn` — not blocked.
- A11y role differs (`role="status"` on reference vs MUI `progressbar`) — equivalent labeled loading affordance for this strategy; not filed as open.
- Reference a11y card claims reduced-motion respect; `.spinner` CSS does not currently special-case `prefers-reduced-motion` — still file DEF-002 for **content** parity with the reference doc page.
- Recommend re-verify after DEF-001 and DEF-002 remediate.
