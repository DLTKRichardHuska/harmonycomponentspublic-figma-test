---
name: harmony
description: Hub and source-of-truth for the Harmony design system. Explains when to use Harmony, where to find components and layouts (including ShellLayout), docs and previews, theme/mode (theme-* and .dark), allowed sources, and lists Harmony slash commands. Use when the user mentions Harmony design system, Harmony components, or asks how to use Harmony in Cursor.
disable-model-invocation: false
---

# Harmony Design System (hub)

When the user is working with or asking about the **Harmony design system**, use this skill to orient them.

**First:** Use the **harmony-usage-rules** skill for design rules (accessibility, component usage, layout). Use the **harmony-ux-principles** skill for cognitive load analysis, progressive disclosure guidance, and general usability principles.

## Slash commands

Point the user to these when they want a specific action:

| Command | Use when |
|--------|----------|
| `/create-pattern` | Create a new pattern doc from an Astro component. |
| `/search-patterns` | Search the design-patterns registry. |
| `/harmony-critique` | Critique design/implementation against Harmony patterns. |
| `/ux-review` | Standalone UX review (framework-agnostic). |
| `/conversion-agent` | Readiness, status, plan, approve, execute (primary). |
| `/conversion-agent converter` | Audit converter playbook implementation before converting. |
| `/create-converter` | Scaffold a new converter (and conversion for component-library). |
| `/verify-converter` | Validate converter/conversion structure. |
| `/sync-target` | Advanced one-shot apply. |
| `/conversion-loop` | Advanced execute loop (usually via conversion-agent). |

Commands live in `.cursor/commands/`.

## Conversion

For cross-framework conversion, load **conversion-agent**. Use `/conversion-agent converter <id>` before planning if unsure whether a converter is ready.

---

# Source of truth

This section defines where to read Harmony components, layouts, docs, and tokens. All Harmony commands should use these rules.

## Resolve Harmony root

1. If `.cursor/harmony.json` exists, use its `harmonyRoot` value.
2. Else: **Harmony repo** = workspace root (`@dltkrichardhuska/harmony-design-system` in this monorepo); **Consumer project** = `node_modules/@dltkrichardhuska/harmony-design-system` or the path where components were copied (e.g. `src/harmony`).

All paths below are relative to `{harmonyRoot}`.

## Allowed sources only

- **Components:** `src/components/ui/*.astro`, `src/components/ui/index.ts`
- **Component catalog:** `src/data/component-catalog.ts` (categories, doc mapping; validated by `npm run validate:catalog`)
- **Layouts:** `src/layouts/*.astro` (ShellLayout and app-shell pattern)
- **Docs:** `src/pages/components/*.astro`, `src/pages/shell/*.astro`, `docs/*.md` (especially CONSUMER_GUIDE.md)
- **Preview:** `src/pages/preview/*.astro`
- **Tokens:** `src/tokens/*.json`, `src/styles/tokens.css`, `src/styles/components.css` for class names
- **Patterns:** `.cursor/skills/design-patterns/reference/` and `registry.md`

## Theme, mode, variants, props

- **Theme:** `cp`, `vp`, `ppm`, `maconomy`. In `src/tokens/colors.json`; applied via `html` class (e.g. `theme-cp`).
- **Mode:** `light` | `dark`. In `colors.json` per theme (`palette.light`, `palette.dark`); applied via `html.dark`.
- **Variants / props:** From each component's `Props` interface and doc page props tables. Use actual prop names, types, defaults, and allowed values.

## Do not use

- `mcp-data/` (any directory or files under it)
- MCP tools or generated spec JSON for skill behavior
- `archive/` folders for live component or token edits

## Reference docs

- **Full source-of-truth rules:** [reference/SOURCES.md](reference/SOURCES.md)
- **Component and layout list:** [reference/COMPONENT_LIST.md](reference/COMPONENT_LIST.md) (snapshot; canonical catalog: `src/data/component-catalog.ts`)
- **Add/change component checklist:** [reference/ADD_COMPONENT_CHECKLIST.md](reference/ADD_COMPONENT_CHECKLIST.md)

## Adding or changing components

When the user adds, removes, renames, or exports a UI component, follow [reference/ADD_COMPONENT_CHECKLIST.md](reference/ADD_COMPONENT_CHECKLIST.md).

Minimum sync steps:

1. `src/components/ui/index.ts` — export list
2. `src/data/component-catalog.ts` — category, doc mapping, count
3. Doc page + `src/data/navigation.ts` (or grouped page mapping)
4. `docs/customization/CONSUMER_GUIDE.md`, `README.md`, and `COMPONENT_LIST.md` — categorized lists
5. Run **`npm run validate:catalog`** before considering the task done

For pattern-library work after a new component exists, use **design-patterns** / `/create-pattern` — that documents UX patterns, not the export catalog.
