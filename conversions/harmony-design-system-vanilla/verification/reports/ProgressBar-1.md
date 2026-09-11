# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `ProgressBar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:25:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 2 |

**Result:** FAIL

## Side-by-side visual summary

| Area | Reference (`:4321`) | Converted (`:5178`) | Verdict |
|------|---------------------|---------------------|---------|
| Basic fills 25/50/75/100 | Pill track + primary fill at matching widths | Same fills, heights, colors (VP light/dark) | Match |
| Sizes sm/md/lg @ 60% | Heights 4 / 8 / 12px | Heights 4 / 8 / 12px | Match |
| Variants default/success/warning/error @ 75% | Blue / green / amber / red fills | Identical rendered colors in same mode | Match |
| With Label 42% | `42%` under track, secondary text | Same text, placement under track | Match (tighter gap — see notes) |
| Page chrome content | Props + Accessibility sections + stable badge | Examples + Consume snippets only | Gaps |

**PASS bar not met:** content inventory has open missing sections (Props/API, Accessibility). Visual example matrix for the four demo blocks is clean when product/mode aligned (VP × light and VP × dark).

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/progress-bar` |
| converted | Live `http://localhost:5178/components/progress-bar` |
| metrics | `conversions/harmony-design-system-vanilla/verification/artifacts/progress-bar-1/capture-metrics.json` |
| compare | `…/progress-bar-1/compare-notes.json` (0 light/dark color/height/fill mismatches at VP) |
| screenshots | `ref-vp-light-top2.png`, `ref-vp-dark-top.png`, `conv-vp-light-top.png`, `conv-vp-dark-top.png`, `conv-forced-colors-top.png`, section clips |

## Approved non-defects (plan / userDecision)

- No HTML `<progress>` (confirmed absent on both surfaces)
- No public document `.progress` recipe (CE-only; `progress.css` / `progressSheet` for shadow hosts)
- Shadow DOM / different markup vs Astro `.progress` — not a defect when appearance matches
- Forced-colors look ≠ Astro reference — HC is an a11y outcome gate; shadow-local track border + Highlight bar present; size ladder remains distinct (6/10/14 with HC border)

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Progress Bar | present | |
| Intro description | present | Wording differs; same intent |
| Badge `stable` | missing | Reference shows green stable pill |
| Article nav (Examples / Props / Accessibility) | different | Converted uses in-page `h2` only; no top chips |
| Examples: Basic Progress | present | 4 bars 25/50/75/100 |
| Examples: Sizes | present | sm/md/lg @ 60% |
| Examples: Variants | present | default/success/warning/error @ 75% |
| Examples: With Label | present | `42%` visible |
| Section: Props | missing | **DEF-001** — Button/Card/Icon demos include API tables |
| Section: Accessibility | missing | **DEF-002** — ARIA / SR / contrast / label guidance |
| Consume npm + static snippets | present | Conversion-required; reference N/A |

**Content gaps (open):** 2 (Props, Accessibility); badge noted under DEF-001 notes

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic Progress fills | Four pill bars at ~25/50/75/100%, primary blue on grey track | Same fill ratios, pill ends, primary on track | present |
| Size ladder | Thin / medium / thick at ~60% | 4px / 8px / 12px tracks, same fills | present |
| Variant colors (VP light) | Blue / green `#17A871` / amber / red fills | Identical computed bar colors | present |
| Variant colors (VP dark) | Brighter primary + semantic fills | Identical computed bar colors | present |
| With Label | `42%` under bar, secondary muted text | `42%` under bar; gap ~4px vs ref ~16px (Astro multi-root + `space-y-4`) | present |
| Dark mode track/bar | Dark track + light primary | Matches when `.dark` | present |
| Forced-colors | (no Astro HC baseline) | Track bordered CanvasText; bar Highlight; label CanvasText; sizes still distinct | present |

**Visual gaps (open):** 0

## Consumer API / mapping / a11y

| Check | Result |
|-------|--------|
| Tag `harmony-progress`, open Shadow DOM | present |
| Attrs `value`, `max`, `size`, `variant`, `show-label` | present (defaults size=md, variant=default) |
| Parts `track`, `bar`, `label` | present |
| ElementInternals `role=progressbar` | AX role progressbar on demo bars; code sets ariaValueNow/Min/Max |
| No events / no HTML progress / no public `.progress` | present |
| Forced-colors shadow-local | present in `progress.css` |
| Docs / CEM / AGENTS / llms | present (`ProgressBar.md`, CEM entry, catalog map) |

Note: CDP `Accessibility.getFullAXTree` omits `valuenow` for **both** reference `.progress` and `harmony-progress` in this environment; not treated as a conversion-only defect. Outcomes judged equivalent (role + valuemin/max present on both).

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Do not mark `elements.ProgressBar.status = synced`. AskQuestion after remediating DEF-001/002 (or before accepting those content gaps). |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Props section with table for `value`, `max`, `size`, `variant`, `showLabel`
- **converted:** No Props/API heading or attribute table on `/components/progress-bar` (API only in `docs/components/ProgressBar.md`)
- **description:** Designer would see a Props section on the reference Progress Bar page and nothing corresponding on the converted demo (unlike Button/Card/Icon demos which ship an API table).
- **evidence:** Live `:4321` h2 `Props`; converted h2 list is only Basic Progress, Sizes, Variants, With Label (`capture-metrics.json` ref.h2 vs conv.h2); `DemoProgressBarPage.js`
- **remediationHint:** Add an API table (attrs + parts) on `demo-progress-bar-page`, strategy-aware for web-component, consistent with `docs/components/ProgressBar.md`. Optional: restore `stable` badge near the title.

### DEF-002

- **status:** open
- **category:** structure
- **reference:** Accessibility section with cards: ARIA Attributes, Screen Reader Support, Color Contrast, Labels
- **converted:** No Accessibility heading or callouts on the demo page
- **description:** Designer would see Accessibility guidance on the reference page and an abrupt end into Consume snippets on the converted demo.
- **evidence:** Live `:4321` h2 `Accessibility` + h3 cards; converted page ends examples → `demo-consume-snippets`; compare peer pages `DemoButtonsPage` / `DemoCardsPage` / `DemoIconsPage`
- **remediationHint:** Add a short Accessibility section (role=progressbar / valuemin-max-now via ElementInternals; provide `aria-label` for what is progressing; forced-colors note) using `demo-callout`, aligned with `ProgressBar.md`.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Rendered evidence reviewed on live `:4321` and `:5178`; not source-only.
- Visual matrix uses three columns with designer-visible descriptions; color/height/fill closed from side-by-side browse plus `compare-notes.json` (0 mismatches at VP light and dark) — not from CSS-on-wrong-node alone.
- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
- Label gap: reference multi-root Astro output sits inside `space-y-4`, inflating track→label spacing; converted label uses component `--space-1`. Treated as present (equivalent label content/placement), not an open visual defect.
