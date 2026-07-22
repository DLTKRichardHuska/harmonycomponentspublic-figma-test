# Harmony Design System — agent context

This repository has **three parts**:

1. **Reference Harmony Design System** — canonical Astro implementation (source of truth)
2. **Converters** — expert agents per conversion target (playbooks under `converters/<id>/`)
3. **Conversions** — output of converter work (projects under `conversions/<id>/` or external hosts)

## First steps for the human

1. `npm install` then `npm run dev` (Astro docs/preview site).
2. Read **[README.md](README.md)** for install, customization, and repository layout.
3. Cursor skills and commands: **[.cursor/HARMONY_GUIDE.md](.cursor/HARMONY_GUIDE.md)**.

## Scope (do not assume)

- **Astro only** in the reference repo — components are `.astro` files under `src/components/ui/`.
- **Single source of truth** — when changing shared Harmony components (props, DOM, or styles), edit Astro source and global styles here.
- **Conversions** — use **`/conversion-agent`**; see [CONVERTER_VS_CONVERSION.md](.cursor/skills/harmony-conversion/reference/CONVERTER_VS_CONVERSION.md).
- **Pattern library** — design patterns live in `.cursor/skills/design-patterns/reference/`.

## Where things live

| Area | Path |
|------|------|
| **Reference** | |
| Components | `src/components/ui/` |
| Component catalog | `src/data/component-catalog.ts` |
| Docs nav | `src/data/navigation.ts` |
| Layouts | `src/layouts/` |
| Tokens | `src/tokens/`, `src/styles/tokens.css` |
| Docs site | `src/pages/components/`, `src/pages/shell/`, `src/pages/preview/` |
| Reference skills | `.cursor/skills/harmony/`, `design-patterns/`, etc. |
| **Converters** | |
| Converter agents | `converters/<id>/playbook/` |
| Readiness | `converters/<id>/converter.manifest.json` |
| **Conversions** | |
| Output projects | `conversions/<id>/` |
| Sync state | `conversions/<id>/conversion.manifest.json` |
| Consumer docs | `docs/customization/CONSUMER_GUIDE.md`, `docs/RULES.md` |
| Archived kits | `archive/designer-starter/`, `archive/integration-kit/` |

## VP-only doc demos

Wrap the example in `class="ds-demo-only-theme-vp"` (see `src/styles/utilities.css`). That hides the block unless `html` has `theme-vp`, so readers on CP/PPM/Maconomy do not see the demo.
