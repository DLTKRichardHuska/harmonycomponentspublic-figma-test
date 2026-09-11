# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Alert` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T19:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 2 |

**Result:** FAIL

## Side-by-side visual summary

| Area | Reference (`:4321`, CP light) | Converted (`:5178`, CP light) | Verdict |
|------|-------------------------------|-------------------------------|---------|
| Variants info/success/warning/error | Tinted fills, soft borders, md icons, title+message | Same tints/borders/icons/heights (83px) | Match |
| Dismissible | X close on info alert | Same close affordance; `dismiss` event | Match |
| Without Title | Message-only 55px rows | Same | Match |
| Enhanced (no actions) | Card bg, 8px accent bar, shadow, 66px | Same structure/colors/heights | Match |
| Enhanced + buttons + link | Primary/secondary xs + link; link aligns with message | Same buttons + alignment (`linkDelta`/`btnDelta` 0) | Mostly match — link type larger (see DEF-001) |
| Enhanced link-only | 12px `.alert__link`, height 98px | Body 16px bare `<a>`, height 106px | **Gap** |
| Enhanced + progress 75%/45% | sm progress, indented under message | `harmony-progress` size=sm, same heights 86px | Match |
| API / Accessibility / Consume | Props + Role card | API table + a11y + npm/static snippets | Match |
| Forced-colors | n/a baseline | Host border + CanvasText; accent Highlight; usable | Pass (HC outcome) |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/alerts` (CP light) |
| converted | Live `http://localhost:5178/components/alerts` (CP light) |
| metrics | `verification/artifacts/alert-1/capture-metrics.json` |
| screenshots | `ref-cp-light-top/full.png`, `conv-cp-light-top/full.png`, `conv-cp-dark-top.png`, `conv-forced-colors-top.png`, section clips `ref-sec-*` / `conv-sec-*` |

Rendered evidence: Playwright browse of matching routes (product/mode aligned to CP light). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| Actions via `actions` slot (no primaryButton/linkText attrs) | accepted | User-approved Consumer API |
| `dismiss` event vs Astro auto-remove | accepted | CE does not remove host; demo listens and removes |
| Boolean `enhanced` vs Astro `style="enhanced"` | accepted | Approved |
| No public `.alert` CSS recipe | accepted | CE-only |
| Shadow DOM vs Astro `.alert` markup | n/a | Appearance compared |
| `stable` maturity badge | deferred | Docs chrome only (same as prior scopes) |
| Forced-colors look ≠ Astro | n/a | HC outcome gate; shadow-local rules present |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Alerts | present | |
| Intro description | present | CE-focused wording; same intent |
| Badge `stable` | deferred | Docs chrome |
| Article nav Examples/Props/Accessibility | present | Converted uses in-page h2s (API/Accessibility) |
| Examples: Variants | present | |
| Examples: Dismissible | present | |
| Examples: Without Title | present | |
| Examples: Enhanced Variant | present | |
| Examples: Enhanced with Actions | present | Slot composition |
| Examples: Enhanced with Progress | present | |
| Section: Props / API | present | Attribute table + slots/events/parts note |
| Section: Accessibility | present | role=alert, Dismiss, dismiss event, forced-colors |
| Consume npm + static snippets | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Variants tinted banners | Pale blue/green/amber/red fills, matching icon colors, 16px pad, 8px radius | Same on CP light | present |
| Dismissible close | X on trailing edge | Same | present |
| Without title | Shorter message-only rows | Same heights | present |
| Enhanced card | Soft card surface, 8px left accent, shadow | Same | present |
| Enhanced actions buttons | xs primary + secondary aligned under message | Same | present |
| Enhanced action links | Compact 12px link (“Link Text” / “Learn more”) | Body 16px / 24px line-height bare anchors | **different** |
| Link-only row height | 98px | 106px | **different** |
| Learn more ↔ message alignment | Left edges align (delta 0) | Left edges align (delta 0) | present |
| Progress examples | Thin sm bars at 75% / 45% | Same fills via `harmony-progress` | present |
| Dark mode enhanced | Card dark + bright accents | Matches when `.dark` | present |
| Forced-colors | n/a | Usable Canvas/CanvasText + host border | present |

**Visual gaps (open):** 2 (same root cause — DEF-001)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | FAIL has open visual defect; human decide remediate vs accept composition gap |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Enhanced action links render as compact 12px text (`.alert__link`); link-only alert height ~98px
- **converted:** Demo `actions` slot uses unclassed `<a>` at body 16px / 24px line-height; link-only alert height ~106px; “Learn more” / “Link Text” read larger than reference
- **description:** Designer would see oversized action links in Enhanced with Actions vs the reference’s smaller alert links, especially on the link-only example.
- **evidence:** Live CP-light compare; `verification/artifacts/alert-1/ref-sec-enhanced-with-actions.png` vs `conv-sec-enhanced-with-actions.png`; spacing probe (ref linkFS 12px / linkH 16 vs conv 16px / 24); heights 98 vs 106
- **remediationHint:** On demo (and docs examples), compose links with Harmony typography e.g. `class="text-xs"` per Link.md; optionally document that alert action links should use `text-xs`. Do not require Astro `.alert__link` class.

## Blocked items

None — both review servers reachable.

## Consumer API / mapping / a11y

| Check | Result |
|-------|--------|
| Tag `harmony-alert`, open Shadow DOM | pass |
| Attrs variant / enhanced / title / dismissible / icon / progress-value | pass (demo + docs + CEM) |
| Slots default + `actions` | pass |
| Event `dismiss` bubbles+composed; host not auto-removed | pass (isolated probe) |
| Parts border/icon/title/message/close/actions/progress | pass |
| progress-value → `harmony-progress` size=sm; info→default variant map | pass (success/warning attrs observed) |
| No public `.alert` recipe | pass (`publicAlertClass: false`) |
| `role="alert"` via ElementInternals | pass (AX tree) |
| Close `aria-label="Dismiss"` | pass |
| Forced-colors shadow-local | pass |
| Docs / AGENTS / llms / CEM | pass |
| Unapproved extras | none observed |

## Verifier notes

- Compared **CP × light** on both surfaces (reference defaulted dark+CP; demo defaulted light+VP — product/mode must be aligned before visual judgment).
- Content inventory + three-column visual matrix completed from live browse + PNGs.
- DEF-001 is review-surface composition (demo/docs), not a missing CE API. Heights/colors for non-link examples matched when product/mode aligned.
- Recommend FAIL until action links match reference scale, or human **accepts** larger body links as intentional slot composition.

**FAIL:** open visual defect DEF-001 (enhanced action link typography/size).
