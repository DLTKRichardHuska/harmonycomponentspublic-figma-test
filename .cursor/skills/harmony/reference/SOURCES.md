# Harmony Design System — Source of Truth (Skills)

Use this document when resolving where to read Harmony components, layouts, docs, and tokens. **Do not use `mcp-data/` or any MCP tools** (e.g. get_specs, build_component) for skill behavior.

## Resolve Harmony root

1. If `.cursor/harmony.json` exists, use its `harmonyRoot` value.
2. Else:
   - **Harmony repo**: workspace root (this repo).
   - **Consumer project**: `node_modules/@dltkrichardhuska/harmony-design-system` or the path where components were copied (e.g. `src/harmony`).

All paths below are relative to `{harmonyRoot}`.

## Allowed sources only

| Category | Path | Purpose |
|----------|------|---------|
| **Components** | `src/components/ui/*.astro`, `src/components/ui/index.ts` | Component implementations and export list. |
| **Component catalog** | `src/data/component-catalog.ts` | Categorized export list, doc-page mapping; validated by `npm run validate:catalog`. |
| **Add/change checklist** | `.cursor/skills/harmony/reference/ADD_COMPONENT_CHECKLIST.md` | Steps to keep catalog, docs, nav, and consumer lists aligned. |
| **Layouts / templates** | `src/layouts/*.astro` | ShellLayout and app-shell pattern (composes ShellHeader, ShellFooter, LeftSidebar, RightSidebar, FloatingNav, ShellPageHeader, ShellPanel). |
| **Docs (components)** | `src/pages/components/*.astro` | Props tables, examples, accessibility sections. |
| **Docs (shell)** | `src/pages/shell/*.astro` | Shell layout, header, footer, left-sidebar, right-sidebar, page-header, page-content, panel. |
| **Docs (markdown)** | `docs/*.md` | CONSUMER_GUIDE.md especially (install, customization, theme/mode). |
| **Tokens** | `src/tokens/*.json`, `src/styles/tokens.css` | Colors (themes, palette light/dark), spacing, typography, elevations. |
| **Component CSS** | `src/styles/components.css` | Class names and visual patterns for components. |
| **Patterns** | `.cursor/skills/design-patterns/reference/` | Pattern registry and anatomy docs. |

## Theme, mode, variants, props

- **Theme** (product): `cp`, `vp`, `ppm`, `maconomy`. In `src/tokens/colors.json` under `themes.cp`, etc. Applied via `html` class (e.g. `theme-cp`). Custom themes: CONSUMER_GUIDE Tier 0 with `html.theme-myproject`.
- **Mode** (color): `light` | `dark`. In `colors.json` per theme as `palette.light`, `palette.dark`. Applied via `html.dark`. CSS variables in `tokens.css` are theme- and mode-specific.
- **Variants / props**: Read from each component's `Props` interface in `src/components/ui/*.astro` and from props tables in `src/pages/components/*.astro` and `src/pages/shell/*.astro`. Use actual prop names, types, defaults, and allowed values (e.g. variant, size, buttonType)—not a generic list.

## Do not use

- `mcp-data/` (any directory or files under it).
- MCP tools or generated spec JSON for skill behavior.
- `archive/` for authoritative component or token reads.
