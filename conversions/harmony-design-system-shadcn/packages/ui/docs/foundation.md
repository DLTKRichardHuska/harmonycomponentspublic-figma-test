# Foundation

**Single token source:** CSS custom properties in `styles/tokens.css`, loaded via `styles/globals.css`.

- **Product:** set once with `HarmonyThemeProvider` `defaultProduct` (`cp` | `ppm` | `vp` | `maconomy`). Applies `data-product` on `<html>`.
- **Mode:** light/dark via `.dark` class (provider `defaultMode` / `setMode`).
- **Tailwind:** import `tailwind-preset` — colors, spacing, radii, shadows, fonts map to those CSS vars.
- **No JSON token package export** — do not invent a second token API.

### Dela

Brand surface tokens (CSS vars + Tailwind):

| Tailwind | CSS variable |
|----------|--------------|
| `bg-dela` | `--gradient-dela` |
| `text-dela-foreground` | `--dela-header-content-fg` |
| — | `--gradient-dela-hover-bg` (hover overlay) |

CTA: package `Button` with `variant="dela"` or `variant="dela-pill"` (not a separate component). Demo: `/foundation/dela`.
