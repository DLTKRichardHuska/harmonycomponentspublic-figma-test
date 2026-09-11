# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `controls-nav-hybrid` (ButtonGroup, ListMenu, NotificationBadge) |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T17:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| routes | `/components/button-groups`, `/components/list-menu`, `/components/notification-badges` |
| prior | `controls-nav-hybrid-1.md` (FAIL — NotificationBadge DEF-001/002) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 2 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 5 |

**Result:** PASS

### Per-element recommendation

| Element | Verdict | Notes |
|---------|---------|-------|
| **ButtonGroup** | **PASS** | Unchanged; sizes 42/50/58, active blue, outline/native+CE still match |
| **ListMenu** | **PASS** | Unchanged; active `rgb(42,120,198)`, h≈46 |
| **NotificationBadge** | **PASS** | Prior DEF-001/002 fixed — number sizes match; shadow-local forced-colors readable |

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/button-groups` · `list-menu` · `notification-badges` (CP light) |
| converted | Live `http://localhost:5178/components/button-groups` · `list-menu` · `notification-badges` (CP light + forced-colors) |
| screenshots | `verification/artifacts/controls-nav-2/ref-notification-badges-cp-light-top.png`, `conv-notification-badges-cp-light-top.png`, `conv-notification-badges-forced-colors.png`, `conv-button-groups-cp-light-top.png`, `conv-list-menu-cp-light-top.png` |
| probes | `verification/artifacts/controls-nav-2/reverify-probe.json` |

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
| Title + intro + example sections | present | Same coverage as iteration 1 |
| Sizes / orientation / disabled / outline | present | |
| Props / API / Accessibility / consume | present | |

### ListMenu

| Reference item | Status | Notes |
|----------------|--------|-------|
| Basic / without icons / no borders | present | |
| Helper compose path | present | |
| Props / API / Accessibility | present | |

### NotificationBadge

| Reference item | Status | Notes |
|----------------|--------|-------|
| Dot / Number / Overflow examples | present | |
| Wrap-on-target examples | present | Approved extra |
| Props / API / Accessibility | present | |
| Number non-border size (prior gap) | present | Now matches reference |

**Content gaps (open):** 0

## Visual parity

### ButtonGroup

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Size ladder | sm 42 / md 50 / lg 58 group height | Same 42 / 50 / 58 | present |
| Selected fill | Blue cluster | Same `rgb(42,120,198)` active | present |

### ListMenu

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Active row | Blue fill, white label, h≈46 | Same `rgb(42,120,198)` / white / h=46 | present |

### NotificationBadge

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Number no-border sm/md | Tight ~15×15 circle with digit | Same 15×15, `box-sizing: border-box` | present |
| Number + border | 20×16 / 20×20 / 32×24 | Same | present |
| Overflow | Wide pills with "99+" | Same | present |
| Dot primary/error | Small circles | Same | present |
| Forced-colors numbers | n/a (outcome gate) | Digits "1"/"5"/"99+" readable; LinkText/CanvasText mapping; `forced-color-adjust: none` | present |

**Visual gaps (open):** 0

## Behavior / a11y / API

| Check | ButtonGroup | ListMenu | NotificationBadge |
|-------|-------------|----------|-------------------|
| Hybrid / CE strategy per manifest | present | present | present (wrap CE) |
| Docs + AGENTS + CEM | present | present | present |
| Forced-colors focus/state | Focus outline on buttons | Focus outline on items | Shadow-local `@media (forced-colors: active)` present; digits legible |
| Dark mode smoke | present (prior) | present (prior) | present (prior) |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS for ButtonGroup, ListMenu, and NotificationBadge. Ask before `synced`. Deferred API gaps remain documented. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **scope:** NotificationBadge
- **reference:** Standalone number badges without border (sm/md) read as tight ~15×15 circles.
- **converted (re-verify):** Same badges measure 15×15 with `box-sizing: border-box` — matches reference.
- **description:** Prior content-box inflation (~23×15 pills) is gone after remediation.
- **evidence:** `controls-nav-2/reverify-probe.json` (`refNb.numbers` vs `convNb.badges`); live `/components/notification-badges` CP light.

### DEF-002

- **status:** fixed
- **category:** a11y
- **scope:** NotificationBadge
- **reference:** n/a (outcome gate)
- **converted (re-verify):** Shadow sheet includes `@media (forced-colors: active)`; under DevTools forced-colors, number/overflow glyphs remain readable (white digits on system colors), not thin white zeros.
- **description:** Shadow-local forced-colors contract satisfied; count readability restored.
- **evidence:** `conv-notification-badges-forced-colors.png`; `reverify-probe.json` `fcNb`; `packages/ui/src/styles/notification-badge.css` lines 153–173.

## Blocked items

None — both review servers returned 200.

## Verifier notes

- Re-verified after remediations claimed for NotificationBadge box-sizing + shadow-local forced-colors.
- ButtonGroup and ListMenu smoke-checked; no regressions vs controls-nav-hybrid-1 PASS portions.
- Three-column visual matrix completed from live browse + screenshots; size metrics support designer judgment only.
- Recommend human confirm then sync ButtonGroup, ListMenu, NotificationBadge.
