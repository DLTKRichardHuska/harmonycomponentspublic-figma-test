# Adding or changing Harmony UI components

Use this checklist whenever you add, remove, rename, or export a component in this repo. Goal: keep implementation, catalog, docs site, and consumer docs aligned.

## Source of truth

| What | Path |
|------|------|
| Implementation | `src/components/ui/<Name>.astro` |
| Package exports | `src/components/ui/index.ts` |
| Categorized catalog + doc mapping | `src/data/component-catalog.ts` |
| Docs nav | `src/data/navigation.ts` |
| Doc pages | `src/pages/components/*.astro`, `src/pages/shell/*.astro` |
| Previews (optional) | `src/pages/preview/*.astro` |
| Consumer-facing list | `docs/customization/CONSUMER_GUIDE.md` → **Complete Component List** |
| Skill snapshot | `.cursor/skills/harmony/reference/COMPONENT_LIST.md` |
| Package readme | `README.md` → **Available Components** |

Run **`npm run validate:catalog`** after catalog changes. It verifies `component-catalog.ts` matches `index.ts`.

Run **`npm run docs:check`** when you also changed doc props tables (requires `@astrojs/compiler` in devDependencies).

---

## New exported component

1. **Implement** `src/components/ui/<Name>.astro` (+ styles in `src/styles/components.css` if needed).
2. **Export** from `src/components/ui/index.ts`.
3. **Catalog** — in `src/data/component-catalog.ts`:
   - Add to the correct `componentCategories` group.
   - Set `componentDocMapping` (doc slug under `/components/`, or `null` if grouped on an existing page).
   - If grouped, add `componentDocPropsVar` when the doc page uses a non-default props array name.
   - Update `EXPORTED_UI_COMPONENT_COUNT` if the export count changed.
4. **Document** — add or extend a page under `src/pages/components/` (kebab-case filename).
5. **Navigate** — add an item to the **Components** section in `src/data/navigation.ts` (unless intentionally grouped only).
6. **Preview** (optional) — `src/pages/preview/<name>.astro`.
7. **Consumer docs** — add the name under **Complete Component List** in `docs/customization/CONSUMER_GUIDE.md`.
8. **Readme + skill snapshot** — add to categorized lists in `README.md` and `.cursor/skills/harmony/reference/COMPONENT_LIST.md`.
9. **Validate** — `npm run validate:catalog` (and `npm run docs:check` if props tables were added).
10. **Pattern** (optional) — if the component represents a reusable UX pattern, run `/create-pattern` or `create_pattern.py` and register in `reference/registry.md`.

---

## Internal / building-block component (not exported)

Examples: `DateRangePicker`, `TableDataRegion`, `CommandCenterPanel`.

1. Implement under `src/components/ui/`.
2. **Do not** add to `index.ts`.
3. Add to `internalComponents` in `component-catalog.ts`.
4. Document on an existing grouped doc page (e.g. date pickers on `date-picker.astro`, tables on `tables.astro`).
5. No nav entry required unless it warrants its own doc page.

---

## Group multiple components on one doc page

Common for inputs, pickers, stepper (`Step` + `Stepper`), kanban (`Kanban` + `KanbanCard` + `KanbanCardCostpoint`).

1. One doc file under `src/pages/components/`.
2. One nav item in `navigation.ts`.
3. In `component-catalog.ts`, map each exported component to the **same** doc slug; use `componentDocPropsVar` for separate props arrays.

---

## Remove or rename a component

1. Remove/rename the `.astro` file and update all imports.
2. Remove/update export in `index.ts`.
3. Update `component-catalog.ts` (categories, mapping, count).
4. Remove or redirect doc page and nav item.
5. Update CONSUMER_GUIDE, README, COMPONENT_LIST.md.
6. Run `npm run validate:catalog`.

---

## Shell subcomponents

Shell pieces (`ShellHeader`, `LeftSidebar`, etc.) are exported from `index.ts` and documented under `src/pages/shell/`. They appear in `componentCategories.layout` and `shellSubcomponents` in the catalog. Doc mapping is `null` in `componentDocMapping` — shell nav lives in the **Shell Layout** section of `navigation.ts`, not **Components**.

---

## What agents should run before finishing

```bash
npm run validate:catalog
```

If doc props were touched and dependencies are installed:

```bash
npm run docs:check
```
