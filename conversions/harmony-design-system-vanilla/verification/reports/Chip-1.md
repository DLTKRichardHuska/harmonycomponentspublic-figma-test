# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Chip` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | 2026-09-10T18:30:00.000Z |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/chips` (CP light) |
| converted | Live `http://localhost:5178/components/chips` (CP light/dark, forced-colors) |
| screenshots | `verification/artifacts/chip-1/` (`ref-cp-light-*.png`, `conv-cp-light-*.png`, `conv-forced-colors-top.png`) |
| metrics | `verification/artifacts/chip-1/capture-metrics.json` |

Rendered evidence: Playwright browse of matching routes (CP light). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.chip` recipe | deferred | Manifest accepted gap |
| No Astro `state` attr — CSS `:hover` / `:focus-visible` / `:active` | deferred | Manifest accepted; hoverRules present in shadow sheet |
| Custom Element vs Astro `<span class="chip">` | n/a | Not a defect |
| Staged States Hover/Focused/Pressed demo columns | deferred | Covered by approved no-`state`-attr gap |
| `stable` maturity chip | deferred | Docs chrome |
| Forced-colors look vs Astro | n/a | Border + system colors; remove focus uses Highlight |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Chips + intro | present | CE events + controlled selected |
| Sizes sm/md/lg | present | Heights 16 / 24 / 32; type 10 / 14 / 16 |
| Variants Fill | present | CP primary `rgb(42,120,198)` white label |
| Variants Outline | present | Transparent fill, primary border/text |
| States Enabled/Hover/Focused/Pressed | deferred | Accepted — production pseudo-states |
| States Disabled | present | opacity 0.5 fill + outline |
| Types text / horiz-dots / vert-dots / overflow | present | Types section (md samples; overflow +12) |
| With Icons | present | tag + user |
| Removable | present | remove control; `remove` event |
| Legacy Selected | present | Selected demo + click toggle |
| All Variants Grid | deferred | Mostly restates state staging |
| Props / API | missing | Consume snippets only (DEF-001) |
| Accessibility | missing | Reference keyboard/focus/removable/SR cards (DEF-001) |

**Content gaps (open):** 1

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Size ladder | Blue fill chips 16/24/32, radius 4px | Same heights, colors, radius, font sizes | present |
| Fill variants | Primary fill + white text | Same | present |
| Outline variants | Transparent + primary border/text | Same | present |
| Disabled | 50% opacity fill/outline | opacity `0.5` | present |
| Removable / icons | Leading icons + trailing x | Same affordance | present |
| Dots / overflow | Horiz/vert ellipsis + `+N` | Present (md); overflow shows `+12` | present |
| Staged hover/focus/pressed | Dedicated state columns | Omitted (accepted) | deferred |
| Forced-colors | n/a | System colors + border; focus outline rules | present |

**Visual gaps (open):** 0

## Behavior

| Check | Result |
|-------|--------|
| Body click toggles controlled `selected` | PASS (`false` → `true`) |
| Remove control fires `remove` without body `click` | PASS (`removeEvents: 1`, `clicks: 0`) |
| `:hover` / `:focus-visible` in shadow CSS | present |
| Forced-colors boundaries | present |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Props table + Accessibility section (keyboard, focus, removable aria-label, SR support)
- **converted:** Consume snippets only; no Accessibility section on the demo page
- **description:** Designer would not find Props/Accessibility educational content that the reference Chips page provides (same FAIL class as Icon-1 before remediation).
- **evidence:** Live `:5178/components/chips`; reference examples list includes Accessibility cards; converted `h2` list ends at Types + consume
- **remediationHint:** Add Chip API table + Accessibility callouts (Tab/Enter/Space, focus ring, remove `aria-label`, icon-only labels) to `DemoChipsPage.js`

## Blocked items

None.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Visual/behavior look PASS including approved state-staging gap. FAIL on missing Accessibility/API page content. AskQuestion before sync. |

## Verifier notes

- CP light fill/outline metrics matched reference computed styles exactly for the sampled size rows.
- Approved Consumer API (attrs + click/`remove`) verified in behavior probe; CEM + `docs/components/Chip.md` present.
