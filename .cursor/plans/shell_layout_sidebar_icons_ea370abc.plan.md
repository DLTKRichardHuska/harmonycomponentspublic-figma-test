# Shell Layout Sidebar Icons – Why Only Some Missing

## Why only some icons vs all?

Icons come from **two resolution paths**. In another project, only the ones that still resolve show up; the rest are missing.

### 1. Resolution split (main reason)

**Icon.astro** resolves in order: Heroicons → Tabler → `public/{name}.svg`. Names and sources are mixed:

| Source | Where it resolves | In consuming project |
|--------|-------------------|------------------------|
| **Heroicons/Tabler** (kebab-case names) | `node_modules/heroicons` or `@tabler/icons` | Work **only if** the app installs `heroicons` and `@tabler/icons` (peer deps). |
| **Design-system `public/`** (custom names or customSrc) | `public/Risk Shield.svg`, `public/Report.svg`, `public/Resource.svg`, `public/related.svg`, `public/template.svg`, `/logos/DelaD.svg` | Work **only if** the app copies those files into its own `public/`. |

**LeftSidebar:**

- **CP variant:** All kebab-case (`home`, `squares-2x2`, `star`, `clock`, `magnifying-glass`, etc.) → resolve from Heroicons/Tabler when peers are installed.
- **PPM/VP/Maconomy:** Mix of kebab-case (`rectangle-group`, `book-open`, `briefcase`, `calendar-days`, `wallet`, `cog-6-tooth`, `plus`) and **custom names** (`Risk Shield`, `Report`, `Resource`). Heroicons/Tabler use kebab-case filenames and do not have `Risk Shield.svg`, `Report.svg`, `Resource.svg`; those only exist in this repo’s `public/`. So in another project:
  - Kebab names → work if peers installed.
  - `Risk Shield`, `Report`, `Resource` → fall through to `public/` and **fail** unless the app has copied `public/Risk Shield.svg`, `Report.svg`, `Resource.svg`.

**RightSidebar:**

- First item in every variant: **customSrc** `'/logos/DelaD.svg'` → always loaded from the **app’s** `/logos/DelaD.svg`. Missing unless the app copies `public/logos/DelaD.svg`.
- Other items: kebab names (`bell`, `printer`, `mic-slash`, `related`, `template`, etc.). Some exist in Heroicons/Tabler; `related` and `template` do not exist in Heroicons (checked), so they resolve from `public/related.svg`, `public/template.svg` in this repo and **fail** in another project if `public/` wasn’t copied.

So **“only some missing”** = icons that resolve from **node_modules** (Heroicons/Tabler) work when peers are installed; icons that resolve only from **public/** or **customSrc** fail unless the app copies the design-system assets. Import paths in the components are correct; the split is **which resolution path each icon uses**, not wrong paths.

### 2. JSON missing default section data (secondary)

The **MCP/recipe JSON does not list** the default sidebar section items (icon names, labels, customSrc).

- [mcp-data/layouts/shelllayout.json](mcp-data/layouts/shelllayout.json) – has `leftSidebarVariant` / `rightSidebarVariant` and layout regions (`leftSidebar`, `rightSidebar`) but **no** `sections` arrays with `{ icon, label }` or `{ customSrc, label }`.
- [mcp-data/components/leftsidebar.json](mcp-data/components/leftsidebar.json) and [rightsidebar.json](mcp-data/components/rightsidebar.json) – describe structure (nav → section → item → Tooltip → `span.left-sidebar__icon`) but the icon span has `children: []`; they **do not** enumerate the default CP/PPM/VP/Maconomy items or icon names.
- [mcp-data/recipes/layouts/shell-layout-standard.json](mcp-data/recipes/layouts/shell-layout-standard.json) – lists LeftSidebar/RightSidebar with generic props (`collapsible: true`), **no** `sections` or icon/asset list.

So:

- **Code paths are correct** – LeftSidebar/RightSidebar and Icon.astro use the right logic and paths; the default sections live only in the `.astro` source (e.g. `cpSections`, `ppmSections` in LeftSidebar.astro).
- **JSON does not contain** the list of icon names or required public assets. Any tooling or AI that “brings the template” from JSON cannot see which icons or files are required, so it can’t suggest “install heroicons + tabler and copy these N files from public/.” That doesn’t break imports; it **reinforces “only some”** because consumers may copy only what they stumble on (e.g. only DelaD.svg) and miss `Risk Shield.svg`, `Report.svg`, `Resource.svg`, `related.svg`, `template.svg`, etc.

## Summary

| Question | Answer |
|----------|--------|
| Why only some vs all? | Some icons resolve from Heroicons/Tabler (work if peers installed); others resolve only from `public/` or `customSrc` (fail unless app copies those assets). |
| Is it missing from the JSON? | Yes – the default section items (icon names, customSrc) are **not** in the layout/component/recipe JSON, so tooling can’t discover the full icon/asset list. |
| Are import paths wrong? | No – component and Icon resolution paths are correct; the issue is **which** path each icon uses (node_modules vs public) and whether the consuming app has those deps/assets. |

## Recommended changes (unchanged from original plan)

1. **Document in FOR_CONSUMING_PROJECTS.md** – Require peer deps (heroicons, @tabler/icons) and copying required `public/` assets (logos + custom SVGs like Risk Shield, Report, Resource, related, template) for shell layout / default sidebars.
2. **README** – In the Shell Layout section, state that default sidebars need peer icon libs and copying `public/logos/` (and other required SVGs) into the app’s `public/`.
3. **Optional: Enrich JSON** – Add to shell layout and/or sidebar component MCP data a **defaultSections** or **requiredIconAssets** list (per variant) so tooling/AI can suggest the exact icon names and public files to copy when bringing the template into another project.
