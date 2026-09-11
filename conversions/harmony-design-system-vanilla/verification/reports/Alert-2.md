# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Alert` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T19:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Alert-1.md` (FAIL; DEF-001 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 2 |

**Result:** PASS

**PASS: zero conversion defects.**

## Side-by-side visual summary

| Area | Reference (`:4321`, CP light) | Converted (`:5178`, CP light) | Verdict |
|------|-------------------------------|-------------------------------|---------|
| Variants info/success/warning/error | Tinted fills, soft borders, icons, title+message | Same (heights 83) | Match |
| Dismissible / Without Title | Close X; message-only 55px | Same | Match |
| Enhanced (no actions) | Card + 8px accent + shadow, 66px | Same | Match |
| Enhanced + buttons + link | xs buttons + 12px link; align under message | Same; `text-xs` links (12px) | Match (remediated) |
| Enhanced link-only | 12px link, height 98px | 12px `text-xs`, height 100px | Match (designer-equivalent; 2px LH token residual) |
| Enhanced + progress | sm bars 75%/45%, height 86 | Same via `harmony-progress` | Match |
| API / a11y / consume | Props + Role | API table + a11y + snippets | Match |
| Forced-colors | n/a | Shadow-local usable (iter 1) | Pass |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/alerts` (CP light) |
| converted | Live `http://localhost:5178/components/alerts` (CP light) |
| metrics | `verification/artifacts/alert-2/capture-metrics.json` |
| screenshots | `ref-cp-light-top.png`, `conv-cp-light-top.png`, `ref-sec-enhanced-with-actions.png`, `conv-sec-enhanced-with-actions.png` |

Rendered evidence: Playwright re-browse after remediation. Not source-only.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| Actions via `actions` slot | accepted | Approved Consumer API |
| `dismiss` event vs Astro auto-remove | accepted | |
| Boolean `enhanced` | accepted | |
| No public `.alert` recipe | accepted | |
| `stable` badge | deferred | Docs chrome |
| Action link line-height 18px (`text-xs`) vs Astro `.alert__link` 16px | n/a | Approved composition uses Harmony typography; font-size matches; 2px not designer-visible as DEF-001 was |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Alerts | present | |
| Intro | present | |
| Badge `stable` | deferred | |
| Variants / Dismissible / Without Title | present | |
| Enhanced Variant / Actions / Progress | present | |
| API + Accessibility | present | |
| Consume snippets | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Variants tinted banners | Pale semantic fills + icons | Same on CP light | present |
| Dismissible / without title | Close X; shorter rows | Same | present |
| Enhanced card + accent | Soft card, 8px bar, shadow | Same | present |
| Enhanced action buttons | xs primary + secondary | Same | present |
| Enhanced action links | Compact 12px “Link Text” / “Learn more” | Compact 12px via `class="text-xs"` | present |
| Link ↔ message alignment | Left edges align (delta 0) | Left edges align (delta 0) | present |
| Progress examples | Thin sm 75% / 45% | Same | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Alert-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Bare `<a>` at 16px; link-only 106px vs 98px | **fixed** — demo links use `class="text-xs"` (12px); multi-row height 106=106; link-only 100≈98 |

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** Compact 12px `.alert__link`
- **converted:** `text-xs` anchors at 12px in Enhanced with Actions
- **description:** Designer no longer sees oversized action links.
- **evidence:** `verification/artifacts/alert-2/capture-metrics.json`; section PNGs; live CP-light compare

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS; human confirm before manifest `synced` |

## Defects

None open.

## Blocked items

None.

## Consumer API / mapping / a11y

| Check | Result |
|-------|--------|
| Approved web-component API | pass (unchanged from Alert-1) |
| progress-value → harmony-progress sm | pass |
| dismiss bubbles/composed, no auto-remove | pass |
| Docs / AGENTS / llms / CEM | pass |
| No public `.alert` recipe | pass |

## Verifier notes

- Content + three-column visual matrices completed from live browse after remediation.
- DEF-001 closed by demo composition (`text-xs`), not CE API change — correct for slot-based actions.
- Residual 2px link-only height (text-xs inherited LH ~18 vs Astro alert__link LH 16) is not filed open; font-size and perceived compactness match.
- Recommend human accept → `synced`.

**PASS: zero conversion defects.**
