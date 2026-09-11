# Forced-colors plan — harmony-design-system-vanilla

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | cross-cutting a11y (`forced-colors: active` / Windows High Contrast) |
| status | `done` |
| createdAt | `2026-09-04T21:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship a **CSS-only**, OS-driven High Contrast layer for the Vanilla conversion. When `@media (forced-colors: active)` matches (Windows Contrast Themes, etc.), product `styles.css` remaps semantic tokens to CSS system colors. No new JavaScript or consumer API. **Vanilla-only** — the Astro reference has no forced-colors baseline and is out of scope.

## Element strategy

| Scope | Strategy | Notes |
|-------|----------|-------|
| Product stylesheet | CSS `@media (forced-colors: active)` | Dedicated `forced-colors.css`, concatenated after flatten |
| Catalog elements | N/A (cross-cutting) | Future `web-component` sheets must include local HC fallbacks |
| Demo chrome | Shadow-local `@media` | Document CSS cannot pierce Shadow DOM |

## Approach & stack fit

- OS drives `forced-colors`; Theme JS / `.dark` unchanged.
- Prefer system colors: `Canvas`, `CanvasText`, `ButtonFace`, `ButtonText`, `Highlight`, `HighlightText`, `LinkText`, `GrayText`.
- Default `forced-color-adjust: auto`; avoid blanket `forced-color-adjust: none`.
- Preserve state with borders, outlines, text, and icons — not color alone.
- Shadows and gradients collapse to borders / solid fills under HC.

## Consumer API

| Field | Value |
|-------|-------|
| New exports | **None** |
| Behavior | Selected product `styles.css` responds automatically |
| Host responsibility | Do not override HC with hard-coded colors; keep non-color state cues |

## Production gaps

| Gap vs Astro | Decision |
|--------------|----------|
| Reference has no forced-colors | Accepted — Vanilla-only enhancement |
| Automated HC capture scripts | Out of scope — manual Windows Contrast Themes |

## Blocking dependencies

None.

## Execute checklist

- [x] `packages/ui/src/styles/forced-colors.css` + `build-product.mjs` concat
- [x] Demo Shadow DOM / document HC fallbacks
- [x] Playbook + consumer docs
- [x] Rebuild products/static; manual verify; report `forced-colors-1.md` (build PASS; OS Contrast Themes matrix pending human)
