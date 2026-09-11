# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `controls-nav-hybrid` (ButtonGroup, ListMenu, NotificationBadge) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T17:07:36.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| routes | `/components/button-groups`, `/components/list-menu`, `/components/notification-badges` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 5 |

**Result:** FAIL

1. VISUAL: Standalone number badges without border look wider/pill-like on conversion (~23×15) vs tight near-circles on reference (~15×15) for sm/md in CP light.
2. A11Y: `harmony-notification-badge` Shadow sheet has no `@media (forced-colors: active)`; under forced-colors, number/overflow glyphs read as thin white slits instead of clear digits.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/button-groups` / `list-menu` / `notification-badges` (CP light) |
| converted | Live `http://localhost:5178/components/button-groups` / `list-menu` / `notification-badges` (CP light/dark, forced-colors) |
| screenshots + inventory | `verification/artifacts/controls-nav-1/` |
| metrics | `inventory.json`, `number-badge-probe.json`, `forced-colors-badges.json` |

Rendered evidence reviewed on both servers. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| ButtonGroup hybrid: native `.btn-group` + `harmony-button-group` | deferred | Approved Consumer API |
| ListMenu hybrid: compose `a`/`button`, no `items[]` JSON | deferred | Approved; demo documents compose path |
| NotificationBadge wrap API (Tooltip-like) vs Astro standalone-only | deferred | Approved intentional include |
| Demo chrome / maturity badge (stable vs in progress) | n/a | Demo chrome, not component fidelity |
| Forced-colors look vs Astro palette | n/a | HC is outcome gate, not Astro parity |

## Content parity

### ButtonGroup

| Reference item | Status | Notes |
|----------------|--------|-------|
| Title Button Groups + intro | present | |
| Default bordered container | present | Native recipe demo |
| Toggle Day/Week/Month | present | CE helper |
| Sizes sm/md/lg | present | Heights 42/50/58 match |
| Orientation horizontal/vertical | present | Vertical h=130, gap 0 |
| Disabled | present | |
| Multiple counts 2/5/10 | present | |
| Icons + text (+ sizes) | present | |
| Icon-only | present | |
| Outline connected | present | Native + helper |
| Props / API | present | Hybrid attrs + classes |
| npm + static consume | present | |
| Accessibility | present | |

### ListMenu

| Reference item | Status | Notes |
|----------------|--------|-------|
| Title List Menu + intro | present | |
| Basic with icons + active | present | Native `nav.list-menu` |
| Without icons | present | |
| With links | present | Via helper section (composed `a`) |
| No borders | present | `variant=no-borders` |
| Props / API | present | Compose surface; `items[]` omitted (approved) |
| npm + static consume | present | |
| Accessibility | present | |

### NotificationBadge

| Reference item | Status | Notes |
|----------------|--------|-------|
| Title Notification Badges + intro | present | |
| Dot primary/error ± border | present | 6×6 / 10×10 match |
| Number primary/error ± border | different | Non-border sm/md width wrong (DEF-001) |
| Overflow primary/error ± border | present | Widths match reference |
| Wrap-on-target examples | present | Approved extra vs Astro |
| Props / API | present | Includes `position` |
| Accessibility | present | |
| npm + static consume | present | |

**Content gaps (open):** 1 (number badge visual in inventory above)

## Visual parity

### ButtonGroup

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Default bordered cluster | White container, 1px gray border, 8px gap, selected blue fill | Same container, gap, selected blue `rgb(42,120,198)` | present |
| Size ladder | sm 42 / md 50 / lg 58 group height | Same 42 / 50 / 58 | present |
| Vertical stack | Column, gap 0, h≈130 | Same | present |
| Outline connected | No container border, joined outline buttons | Native + helper match | present |
| Disabled | Dimmed selected + outlines | Same affordance | present |

### ListMenu

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Active row | Blue fill `rgb(42,120,198)`, white label/icon | Same | present |
| Item padding / height | 12×16 pad, h≈46, separator 1px gray | Same | present |
| No-borders | Flat list, no separators, active still blue | Same | present |
| Icons | Leading outline icons | Same | present |

### NotificationBadge

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Dot sm/md/lg | 6×6 primary/error circles | Same | present |
| Dot + border | 10×10 with white ring | Same | present |
| Number no-border sm/md | Tight ~15×15 circle with "1"/"5" | Wider ~23×15 pill (content-box) | different |
| Number + border | 20×16 / 20×20 / 32×24 | Same | present |
| Overflow | 26–38 wide pills with "99+" | Same | present |
| Wrap on button | n/a on Astro | Badge at top-end on bell button | deferred |
| Forced-colors numbers | n/a | Glyphs collapse to thin white slits; no shadow-local HC sheet | different |

**Visual gaps (open):** 2

## Behavior / a11y / API

| Check | ButtonGroup | ListMenu | NotificationBadge |
|-------|-------------|----------|-------------------|
| Hybrid / CE strategy per manifest | present | present | present (wrap CE) |
| Docs + AGENTS + CEM | present | present | present |
| Forced-colors focus/state | Focus outline on buttons | Focus outline on items | Missing shadow-local HC (DEF-002) |
| Dark mode smoke | present | present | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends FAIL. Remediate NotificationBadge box-sizing + forced-colors, then re-verify. Do not sync any of the three until open defects are fixed or human accepts. |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Standalone number badges without border (sm/md) read as tight ~15×15 circles with centered digit.
- **converted:** Same badges read as wider ~23×15 pills; digit sits in a stretched capsule.
- **description:** Designer would see non-border number badges as noticeably wider ovals on conversion vs compact circles on reference (CP light). Overflow and bordered number sizes match; dots match.
- **evidence:** `controls-nav-1/number-badge-probe.json` (ref `box-sizing: border-box` w=15; conv `content-box` w=23); `inventory.json`; live `/components/notification-badges` Number section.
- **remediationHint:** Adopt document reset `box-sizing: border-box` on `.notification-badge` (or adopt typography/reset sheet in the CE). Reference inherits border-box from global reset; Shadow DOM does not.

### DEF-002

- **status:** open
- **category:** a11y
- **reference:** n/a (no forced-colors baseline); playbook requires Shadow-local HC for web components.
- **converted:** `notification-badge.css` / generated sheet has no `@media (forced-colors: active)`. Under DevTools forced-colors, number/overflow counts appear as thin white slits rather than readable digits; docs claim shadow-local HC.
- **description:** Designer/a11y reviewer would not trust notification count readability in Windows High Contrast — glyphs look clipped, and the Shadow sheet lacks the required forced-colors contract.
- **evidence:** `controls-nav-1/conv-notification-badges-forced-colors.png`, `conv-nb-forced-colors-numbers.png`, `forced-colors-badges.json`; `packages/ui/src/styles/notification-badge.css` (no forced-colors block); docs `NotificationBadge.md` states Forced-colors: shadow-local.
- **remediationHint:** Add shadow-local `@media (forced-colors: active)` mapping badge face/text/border to system colors (see Chip/Badge sheets) and ensure `line-height`/padding keep digits legible under HC.

## Blocked items

None — both review servers reachable.

## Verifier notes

- ButtonGroup and ListMenu: content + visual matrices clean at designer bar for CP light; hybrid dual-path demos and consume snippets present. Metrics for group sizes, list active colors, and separators matched reference.
- NotificationBadge wrap examples are intentional (approved) and not counted as defects.
- Overall scope **FAIL** solely on NotificationBadge DEF-001 and DEF-002. Re-verify NotificationBadge (or this hybrid batch) after remediation before recommending PASS / sync.
