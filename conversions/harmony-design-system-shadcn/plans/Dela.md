# Dela foundation conversion plan — harmony-design-system-shadcn

status: approved  
scope: Dela  
created: 2026-07-18  
approved: 2026-07-18 (chat plan: Shadcn Foundation Dela)

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| Dela | `component` | CSS vars SSOT already in `tokens.css`; Tailwind preset dela utilities; foundation demo; CTA via existing Button `dela` / `dela-pill` |

## Approach & stack fit

1. **Single token source:** Dela brand vars remain in `packages/ui/src/styles/tokens.css` (`--gradient-dela*`, `--dela-header-content-fg`, panel/bubble vars for later shell).
2. **Tailwind:** Preset maps `bg-dela` → `var(--gradient-dela)`, `text-dela-foreground` → `var(--dela-header-content-fg)`.
3. **CTA:** Package `Button` `variant="dela" | "dela-pill"` (already approved Consumer API) — no separate `DelaButton`.
4. **Demo:** `/foundation/dela` — brand guide, assets, token table + swatch; shell panel sections deferred.
5. **No JSON token export.**

## Consumer API

No new package component export. Consumers use:

- CSS vars / Tailwind: `bg-dela`, `text-dela-foreground`, `var(--gradient-dela)`, `var(--gradient-dela-hover-bg)`, `var(--dela-header-content-fg)`
- CTA: `<Button variant="dela">` / `dela-pill` (existing API; no delta)

## Blocking dependencies

None for brand scope (`Button` and `Icon` are `synced`).

## Deferred / gaps

Live Demo, Panel Usage, AI Guidelines, Accessibility sections that require `RightSidebar` + `ShellPanel` — deferred until those elements convert.

## Out of scope

- `RightSidebar` / `ShellPanel` / live Ask Dela panel
- Extracting `DelaButton`
- Changing Button public API
- Re-opening other foundation pages

## Execute checklist

- [x] Record strategy / gaps / userDecision
- [x] Tailwind dela utilities + docs
- [x] Refactor Button dela classes onto preset utilities
- [x] DelaDemo + route
- [x] VERIFIER.md inventory + verify + human accept → `synced` + coverage
