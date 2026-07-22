# Foundation conversion plan — harmony-design-system-shadcn

status: completed  
scope: foundation (colors, typography, spacing, elevations — **not** Dela)  
created: 2026-07-17  
approved: 2026-07-17  
updated: 2026-07-18 (human accepted foundation-2 PASS → synced)

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| foundation | `component` | CSS vars SSOT + one Tailwind preset + `HarmonyThemeProvider` |

## Approach & stack fit

### Locked approach (AI-first)

1. **Single token source:** `packages/ui/src/styles/tokens.css` (CSS custom properties; `[data-product]` + `.dark`).
2. **Tailwind:** One package preset maps utilities → those vars only.
3. **Provider:** `HarmonyThemeProvider` — consumers set `defaultProduct` once; demo may switch for review.
4. **No JSON token export** — demos teach `var(--…)` / Tailwind classes; resolved values via `getComputedStyle` when needed.
5. **Fonts:** Fontsource peers for Lexend / Figtree / JetBrains Mono.
6. **Demos:** `/foundation/colors|typography|spacing|elevations`. Dela stays PlaceholderPage.

Priority: best experience for AI systems using the npm package. Demo product-switching convenience is secondary.

### Stack leverage

- Matches stock shadcn bootstrap AI models know
- One Getting Started path for apps and demo

### Stack friction

| Item | Mitigation |
|------|------------|
| Multi-product blocks in one CSS file | Accepted cost for one AI-simple import + working demo picker |

## Blocking dependencies

None.

## Out of scope

- Dela foundation page
- Shell, components, shadcn registry.json
- Parallel token JSON API

## Execute checklist

- [x] Record strategy / gaps / userDecision
- [x] Rewrite `tokens.css` / `globals.css` + Tailwind preset
- [x] Four foundation demos (theme tokens only)
- [x] Drop JSON token package export
- [x] Getting Started / AGENTS / llms / CONSUMER_GUIDE
- [x] Human accept → `synced` + `compute_coverage --write`
