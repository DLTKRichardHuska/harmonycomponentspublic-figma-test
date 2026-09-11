# Foundation conversion plan — harmony-design-system-vanilla

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `foundation` (Colors, Typography, Spacing, Elevations; Dela deferred) |
| status | `approved` |
| createdAt | `2026-09-04T01:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `0% (0/55)` |

## Summary

Ship foundation as CSS custom properties via product-once flatten (`styles.css`). Demo consumes flattened product stylesheets only (swap `<link>` on product change; never `data-product`). Theme JS bootstraps from `prefers-color-scheme` when no saved preference. Dela stays `not-started` (placeholder).

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Colors | CSS tokens (not Custom Element) | Flattened `styles.css` + CSS vars |
| Typography | CSS tokens | Same |
| Spacing | CSS tokens | Same |
| Elevations | CSS tokens | Same |
| Dela | leave `not-started` | Explicitly **not** `skip`; placeholder remains |

## Approach & stack fit (user confirmed)

- Author multi-product `packages/ui/src/styles/tokens.css` (`html[data-product]` + `.dark`) for flatten.
- Published kits: single-product `:root` / `.dark` only. No consumer `setProduct`, no `theme-*`.
- **Demo (hard):** flattened product CSS only; swap stylesheet href. Never set `html[data-product]`.
- Foundation demos are `demo-*` Custom Elements reading computed CSS variables.
- Decorative Icons: inline SVG until Icon syncs.
- Fonts: Figtree, Lexend, JetBrains Mono in demo; document app responsibility.
- **Color scheme:** class `.dark` is SSOT in CSS. Theme JS uses `matchMedia('(prefers-color-scheme: dark)')` on first load when no saved preference; explicit override wins.

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Styles | npm `@pkg/<product>/styles.css`; static kit `styles.css` |
| Tokens | CSS custom properties on `:root` / `.dark` — `var(--…)` |
| Theme JS | `setColorScheme` / `getColorScheme` / `toggleColorScheme` / `initColorScheme` (prefers-color-scheme bootstrap + persist explicit overrides) |
| Omissions | No JS/JSON token modules, no ThemeProvider, no runtime product API, no foundation tags |
| Docs | `docs/CONSUMER.md`, Getting Started, `packages/ui/docs/foundation/*.md`, AGENTS.md / llms.txt |

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `src/tokens/*.ts` JSON/JS objects | Skip — CSS vars only |
| One page showing all product palettes at once | Demo: switch flattened stylesheet; consumer: one product |
| Dela page | Out of scope; remain `not-started` |
| Reference `Icon` in Colors/Typography | Inline SVG in demo |
| `prefers-color-scheme` | Include as first-load bootstrap + follow-OS until override — not CSS `@media` token blocks |

## Blocking dependencies

None.

## Scope

| In scope | Out of scope |
|----------|--------------|
| Colors, Typography, Spacing, Elevations | Dela, shell, components, Icon |
| Token sync + product flatten | JS token modules |
| Demo flattened stylesheet swap | CSS `@media (prefers-color-scheme)` token values |
| Theme JS initColorScheme | |

## Execute checklist

- [x] Record strategy / gaps / userDecision on four keys; Dela stays not-started
- [x] Sync tokens + rebuild products/static
- [x] Demo stylesheet swap (no data-product) + fonts
- [x] Theme JS prefers-color-scheme bootstrap
- [x] Four foundation demo pages + import snippets
- [x] docs/foundation + AGENTS / llms / CONSUMER / Getting Started
- [x] Verify (foundation-1 FAIL → remediate → foundation-2 PASS) → synced + compute_coverage
