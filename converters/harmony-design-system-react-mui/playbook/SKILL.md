# Converter agent — harmony-design-system-react-mui



You are the **React + MUI engineer agent** — the expert for applying and organizing this conversion.



Converter id: `harmony-design-system-react-mui`  

Converter path: `converters/harmony-design-system-react-mui/`  

Conversion output: `conversions/harmony-design-system-react-mui/`  

npm package: `@dltkrichardhuska/harmony-design-system-react-mui`



**QA agent counterpart:** `playbook/VERIFIER.md` (**harmony-design-system-react-mui-verifier**). When output organization changes, update **both** this file and `VERIFIER.md`.



**conversion-agent** routes here for status, plan, execute, and human-directed tweaks.



## Adoption model

The MUI conversion exists so **existing MUI projects adopt Harmony without rewriting component usage**.

| Layer | What ships | Consumer uses |
|-------|------------|---------------|
| **Theme** | `createHarmonyTheme({ product })` — palette, typography, `components.Mui*` overrides | `ThemeProvider` + existing `@mui/material` imports |
| **Custom components** | `src/components/` exports only when MUI has **no** equivalent (`HarmonyIcon`, `DelaButton`, shell layouts) | Package export with MUI-native API |
| **Never** | Harmony-shaped wrappers that re-expose MUI with Harmony prop names | — |

Consumers keep `@mui/material/<Component>` APIs unchanged. Visual parity comes from the theme. Custom exports are built on the MUI stack (`styled`, `sx`, base MUI primitives) and are used alongside standard MUI components — not as replacements for them.

## Principles



- **MUI-native styling:** use `@mui/material`, `createHarmonyTheme`, `sx`, and `styled()` only. **Never** import reference Astro CSS (`layout.css`, `tokens.css`, `global.css`) or external icon stylesheets into the conversion.

- **Native-first mapping:** prefer MUI `variant`, `color`, `size`, and standard `palette` slots. Map Harmony features to logical MUI equivalents (e.g. Harmony `primary` → `variant="contained" color="primary"`). Add custom palette colors (e.g. `pageHeader`) or `components.Mui*` overrides only when no native prop exists.

- **No Harmony wrappers:** never add package exports that re-expose MUI with a Harmony-shaped prop API. Consumers use `@mui/material/<Component>` + Harmony theme, or a **custom** export when MUI has no equivalent (e.g. `DelaButton`, `HarmonyIcon`).

- **HarmonyIcon in MUI slots:** use `fontSize="inherit"` when passing `HarmonyIcon` to MUI icon slots (`Button` `startIcon`/`endIcon`, `Alert` `icon`, `IconButton` children, `ListItemIcon`). Use the Harmony `size` prop (`xs`–`xl`) for standalone or catalog-grid usage.

- **Hard dependencies (mandatory):** catalog components imported or composed in reference source or doc examples are **blocking**. A dependent element cannot be marked `synced` until every required dependency is `synced`. **Skipping dependency work is not allowed** — convert dependencies first, in order. The only exception is a documented **circular dependency** (see Step 4 § Circular dependencies).

- **Demos teach MUI composition:** converted demo pages (`src/demo/converted/<Scope>/`) import and render MUI components directly. Show the JSX consumers would write — `Alert`, `AlertTitle`, `Button`, `Link`, `LinearProgress`, etc. Harmony → MUI mapping tables belong in demo docs, not in a wrapper.
- **Foundation demos use the theme API only:** `/foundation/*` pages must read colors, typography, spacing, and elevations from `useTheme()` / package exports (`DelaButton`, `DELA_GRADIENT`, …). Never import `@/tokens` or Harmony palette helpers on the demo surface. If a value is not on the shipped theme or a documented package export, do not show it.

- **Demo UI library:** doc scaffolding for converted demos lives in `src/demo/ui/`. Component demo files (`src/demo/converted/<Scope>/*Demo.tsx`) must not define local React components. Import scaffolding from `@/demo/ui` and `@/demo/converted/foundation/`. The library is demo-site-only — never add to package `src/index.ts` exports.

- **Examples purity (no wrappers, no fidelity styling):** inside example demonstrations (the MUI instances users copy — typically `DemoExampleGroup` children), JSX must use `@mui/material`, `@mui/icons-material`, and documented package custom exports only. No file-local function components. No wrappers around MUI primitives (layout, sizing, or Harmony-shaped). **All visual fidelity** for **documented MUI props and slots** belongs in `src/theme/map*ToTheme.ts` via `defaultProps`, `styleOverrides`, and `variants` — **never** inline `sx`/`style`/`className` on example nodes to emulate Harmony props. **Never** invent non-MUI props on `@mui/material` components (module augmentation) under `existing-mui` — if MUI docs do not list the prop, **AskQuestion** for **skip** or **custom** export before implement.

- **Neutral layout sx vs fidelity sx (mandatory AskQuestion):** Neutral layout `sx` in examples is allowed **only** for docs-chrome density that does **not** stand in for a Harmony catalog prop — e.g. `maxWidth` on an example wrapper, `Stack` `spacing` / `gap` / `flexWrap` when arranging multiple independent demo instances. It is **forbidden** when `sx` / `style` / `className` (or a fake “composition” that only works via those) exists to reproduce a Harmony prop or visual variant that MUI does **not** expose as a documented prop/slot — classic fail case: `DialogActions sx={{ justifyContent: 'flex-end' }}` to emulate `buttonAlignment="right"`. **During plan:** if the only way to show a Harmony feature is such styling, **AskQuestion** (skip | custom) — do not write a plan that silently commits to example `sx`. **During remediate:** verifier FAIL for missing alignment/variant must **not** be fixed by adding fidelity `sx`; **AskQuestion** skip/custom (or theme on a **documented** MUI API) instead. Approving execute is not permission to add fidelity `sx` after the fact.

- **Static pseudo-state demos (banned staging):** do **not** stage hover/focus/pressed with docs-only `className` values (e.g. `*-demo-hover`, `*-demo-focus`, Astro-style `avatar--demo-*`) or theme `styleOverrides` that exist only to support those classes. When the reference shows static Hover/Focus **docs columns** and MUI exposes only CSS/MUI pseudo-states: omit those columns; show real interactive Default (+ Disabled when applicable); hover/focus are verified via real interaction. **Do not** use `UnsupportedEquivalentCallout` for this — docs presentation is not a functional skip. Real `:hover` / `:focus-visible` / `Mui-disabled` theme overrides remain allowed; staging-only hooks are not. Verifier FAIL for missing static columns must **not** be remediable by inventing staging classes — omit columns (or AskQuestion only if reconsidering).

- **No silent purity exceptions:** agents **must AskQuestion and wait for explicit user approval** before doing anything that bends or breaks a hard playbook rule (examples purity, no wrappers, no fidelity `sx`/`style`/`className`, no invented MUI props, no thin wrappers, no dependency callouts-as-sync, static pseudo-state staging, etc.). **Verifier FAIL does not authorize a purity violation.** Approving an execute plan is **not** blanket permission to violate purity while remediating. If prior `userDecision` / `gaps[]` already skipped a feature, do **not** reintroduce it to chase visual matrix parity without AskQuestion reversing that decision. Record any approved exception in manifest `userDecision` + `gaps[]` **before** implementing.

- **`UnsupportedEquivalentCallout` scope:** demo-only callout for **component functionality** the human **declined to convert** (no native/custom path for a Harmony prop/feature — e.g. skipped `size`, unsupported `state` values that are real API). **Never** use it for docs-only presentation limits (cannot freeze `:hover` / focus-visible on the page). **Never** use it to defer catalog dependency work — unresolved dependencies block completion; do not ship callouts in place of missing dependency implementations on a `synced` element.

- **Element strategy (mandatory user confirmation):** before converting any catalog element, **AskQuestion** to choose **Existing Component** (`existing-mui`), **Custom Component** (`custom`), or **Skip** (`skip`). Cannot proceed without answer. See Step 4 § Element strategies. Record `strategy`, `userDecision`, `propMappings`, `compositeEquivalents`, `skippedProps` in manifest.
- **Consumer public API (mandatory for package exports):** reference Astro is a visual demo — not a library API. **`existing-mui`** needs no Consumer API work (consumers keep `@mui/material`). **`custom`** exports and **custom sub-exports** (e.g. `DelaButton`) require a **Consumer API packet** AskQuestion before implement — align with the closest MUI analog (MUI MCP/docs). On version/resync updates, re-confirm only the **delta**. See Step 4 § Consumer API and [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Consumer public API.

- **Composite equivalents (demo-only):** when a Harmony feature has no MUI prop but can be achieved by composing MUI children (e.g. Harmony `progressValue` → `<LinearProgress>` inside `<Alert>`; Harmony `showLabel` → `<LinearProgress>` + `<Typography>`), confirm the pattern with the user, record in `compositeEquivalents`, and demonstrate **inline JSX** in the demo — structural composition of `@mui/material` + package custom exports only, **no fidelity styling** on composed nodes. Never a package export, file-local helper, or demo UI component that wraps MUI primitives for the demonstration. If “composition” only works by adding `sx`/`style`/`className` to fake a missing MUI API, it is **not** a valid composite — **AskQuestion** skip|custom instead (see Neutral layout sx vs fidelity sx).

- **Human decisions for sub-features:** for every reference feature without a **documented MUI prop or slot** within an `existing-mui` element, **AskQuestion** before implement — options include **skip** (demo `UnsupportedEquivalentCallout`), or **custom** sub-export (e.g. `DelaButton` under Button). Theme overrides apply only to **native MUI APIs** — do not add invented props via module augmentation on `@mui/material` components. **Never** implement via demo `sx`/`style`/`className`. Record in `gaps[]`, `skippedProps`, and `userDecision`. **Skip does not apply to catalog dependencies** — those must be converted first. See [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Conversion decisions.

- **Package vs demo boundary:** npm package ships `src/theme/`, `src/tokens/`, `src/components/`, `src/layouts/`, `dist/` only. Demo review app code lives under `src/demo/` and `src/pages/` — **not** in `package.json` `files` or `exports`. Docs-layout-specific sx belongs in `src/demo/demoLayoutSx.ts`, not in `createHarmonyTheme`.

- **Theme-first:** export `createHarmonyTheme({ product })` — MUI `Theme` with `colorSchemes` (light + dark). Implement colors + typography in the package theme **before** demo chrome.

- **Button color source:** standard button fills and foregrounds come from `themes.<product>.primary` (rendered as `var(--theme-primary)` in reference CSS). Use `colors.json` → `buttonRoleTokens` for disabled/hover role constants only — **not** the removed legacy `themeButton.primary.default` block. Page header buttons use `pageHeaderButton` → `--page-header-btn-*`.

- **Custom exports only** when no MUI equivalent exists (e.g. `./ShellHeader`).

- **Reference is discovery** — read `src/data/component-catalog.ts`, `src/data/navigation.ts`, Harmony `.astro` source.

- **MUI MCP required** for apply and remediate.

- **Cursor only** — agents run helpers via Shell; never instruct the user to run npm for conversion workflow.



## Product scope

The reference declares product scope in `src/data/component-catalog.ts` — `ALL_PRODUCTS` (`cp`, `vp`, `ppm`, `maconomy`), `componentProducts` (components exclusive to a product subset), and `componentVariantProducts` (variants that only apply under certain products). This is the source of truth; **discover it, do not duplicate the reference as a parallel registry**.

- **Runtime model, not per-product builds.** MUI expresses product as a runtime theme parameter — `createHarmonyTheme({ product })` + `ThemeProvider`, plus the demo product switcher. There is **one** package; consumers switch product at runtime. Do **not** add a per-product static build pipeline (`build-product`, `dist-products/`, per-product `AGENTS.md`/`llms.txt`) — that is the shadcn conversion's model, not MUI's.

- **Product-exclusive components** (reference `componentProducts`, e.g. `FloatingNav`, `KanbanCardCostpoint`, `TableCostpointGrid` → `['cp']`): record `"products": ["cp"]` on the element in `conversion.manifest.json`, and gate their demo nav entries by product. The demo mirrors the scope locally in `src/demo/demoThemeConfig.ts` (`productScopedComponents`) rather than importing the reference — matching the standalone-package convention.

- **Product-conditional variants** (reference `componentVariantProducts`, e.g. `TabStrip.pill → ['vp']`, `Kanban.costpoint → ['cp']`): record `"variantProducts": { "<variant>": ["<product>"] }` on the element. A product-only variant is still a real Harmony feature — converting it goes through the normal **element strategy AskQuestion** (`existing-mui` | `custom` | `skip`); when skipped, note the product scope in `gaps[]` / `skippedProps` (e.g. `variant pill (VP-only product variant)`).

- **Mirror, don't drift.** When the reference `componentProducts` / `componentVariantProducts` change, update the manifest metadata and `demoThemeConfig.ts` to match.



## Output organization



Documented here and in `VERIFIER.md` for QA equivalence.



| Area | Location | npm package? |
|------|----------|--------------|
| Theme API | `src/theme/` | **Yes** |
| Tokens (vendored JSON) | `src/tokens/` | **Yes** (theme input) |
| Custom components | `src/components/` | **Yes** |
| Shell layouts | `src/layouts/` | **Yes** |
| Review surface | `npm run dev` → **http://localhost:5176** | No (demo app) |
| Demo preferences | `src/demo/DemoPreferencesProvider.tsx` | No |
| Demo layout sx | `src/demo/demoLayoutSx.ts` | No |
| Demo nav | `src/demo/demoNavigation.ts` | No |
| Demo chrome | `src/demo/DemoShell.tsx` (+ subcomponents) | No |
| Demo app pages | `src/demo/pages/` (`/`, `/changelog`) | No |
| Demo changelog data | `src/demo/changelogData.ts` | No |
| Converted demos | `src/demo/converted/<Scope>/` | No |
| Demo UI (doc scaffolding) | `src/demo/ui/` | No |
| Router | `src/pages/App.tsx` | No |



Doc routes mirror reference `href` values (e.g. Button → `/components/buttons`).



## Planning and status



Invoked by **conversion-agent** (`status` or `plan` mode).



### Status (readonly)



1. Read reference: `src/data/navigation.ts`, `src/data/component-catalog.ts`, relevant `.astro` and doc pages.

2. Read `conversions/harmony-design-system-react-mui/conversion.manifest.json` (all element state).

3. Read conversion `src/` — theme, components, `src/demo/converted/`.

4. Compare reference vs conversion per scope; seed missing manifest keys from catalog.

5. **Do not modify** files.



### Plan (plan file only)



1. Perform status steps for scope (`foundation`, `Button`, etc.).

2. **Hard-dependency plan gate** — same stop/redirect rules as conversion-agent plan mode and [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Hard dependencies: inventory catalog deps first; if any required dep is not `synced`, report **Blocked**, do not write `plans/<dependent>.md`, do not AskQuestion strategy for the dependent; AskQuestion only whether to plan the blocker next. Forbidden: partial/skip-dep/callout workarounds.

3. **Only if the gate passes** — **AskQuestion — element strategy (mandatory):** Existing Component / Custom Component / Skip for each element in scope. Cannot write plan without answers.

4. If **existing-mui:** **AskQuestion** for prop mappings, skipped props, and composite equivalents (user sign-off required). Non-dependency feature skips only. **Mandatory:** for every Harmony prop/variant that has **no documented MUI prop/slot**, and that cannot be shown with structural composition alone (children/slots without fidelity `sx`/`style`/`className`), include **Skip** (or **custom**) in that AskQuestion — do **not** plan “demo `sx` / justifyContent / className” as the mapping. Classic trap: footer alignment, header color variants, resize grips.

5. If **custom** (or a custom sub-export under `existing-mui`): **AskQuestion — Consumer API packet** (see Step 4 § Consumer API). Wait for sign-off. On version/resync, re-present only for introduced/changed consumer surface.

6. Write `conversions/harmony-design-system-react-mui/plans/<scope>.md` (`status: draft`) with Element strategy, Prop mappings, Skipped props, Composite equivalents, **Consumer API (user confirmed)** (when applicable), and Blocking dependencies sections per [CONVERSION_PLAN.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_PLAN.md).

7. Do not implement until execute mode after approval.



## Step 0 — Version bump (first execute when reference semver changed)

When starting an update to a **new** reference semver (from root `package.json`) or when the repo effective version label changes:

1. Read `conversions/harmony-design-system-react-mui/conversion.manifest.json`.
2. Run: `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --conversion harmony-design-system-react-mui`
3. If the **bare semver** changed (new release train), reset all `elements.*.status` to `not-started` (preserve `notes`, `strategy`, `harmonySource`; clear stale `userDecision`).
4. Run: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion harmony-design-system-react-mui --write`
5. QA agent assesses existing code against the new reference — elements may move to `in-progress` quickly.
6. When re-applying **`custom`** exports or **custom sub-exports** whose **public consumer surface** changes (new/changed props, events, slots, polymorphism): **AskQuestion — Consumer API packet for the delta only** before implement. Visual-only remediations that do not change the TypeScript/React API do not require re-confirmation.

**Same version label with reference edits:** do not auto-reset coverage — scoped re-verify only. If a scoped update changes a custom export’s public API, run the Consumer API delta AskQuestion before apply.

## Step 0b — MUI MCP gate

1. Confirm `user-mui-mcp` (optional: `node converters/harmony-design-system-react-mui/scripts/check-mui-mcp.mjs`).

2. Call MCP `useMuiDocs` with the URL printed by `check-mui-mcp.mjs` (resolves latest v9 from npm — do not hardcode a patch version).

3. Stop if MCP unavailable.

### MUI version policy

- Converter `framework.muiVersionPolicy` declares the required MUI **major** (`9`) and `track: "latest"` (stay on newest v9 patch).
- Conversion `package.json` must pin `@mui/material` and `@mui/icons-material` to `^9.x` on the same major. `validate_conversion.mjs` **hard-fails** on major mismatch.
- Before execute, run `validate_conversion.mjs --conversion harmony-design-system-react-mui --check-latest` to warn if behind the newest v9 patch.



## Step 1 — Review surface bootstrap (first execute)



**Engineer agent responsibility** — stand up a demo that mirrors reference **`DocsLayout`** chrome and routes before per-scope content sync.



1. Read `src/data/navigation.ts`, `src/data/component-catalog.ts`, and reference `src/layouts/DocsLayout.astro`.

2. Ensure `src/demo/demoNavigation.ts` mirrors reference nav; update when reference nav changes.

3. Route every reference doc `href` in `src/pages/App.tsx`.

4. Implement **`DemoShell`** to match reference docs chrome — not a minimal MUI drawer:
   - Top **header:** Harmony branding (logo + product name), product theme switcher (CP/VP/PPM/Maconomy), light/dark mode toggle (localStorage), GitHub link, component search (⌘K)
   - **Sidebar:** Sectioned nav with icons; version/coverage footer; mobile close control
   - **Responsive:** Hamburger + overlay drawer below `1024px`; permanent sidebar at desktop
   - **Visual:** Use package theme palette/typography; docs-layout-specific sx in `src/demo/demoLayoutSx.ts` only — never merge into `createHarmonyTheme`

5. **Placeholder** unconverted **content** scopes via `PlaceholderPage` (scope name, manifest status, link to reference doc) — placeholders are OK for `/components/*`, `/foundation/*`, `/shell/*` until those elements sync.

6. `npm run dev` on port **5176** — full nav browsable immediately.



Replace placeholders with `src/demo/converted/<Scope>/` as elements sync.



## Step 2 — Foundation sync



1. `node converters/harmony-design-system-react-mui/scripts/sync-foundation.mjs`

2. In conversion folder: `npm install` (if needed), `npm run typecheck`, `npm run build:lib`.

3. Implement full `createHarmonyTheme` token mapping (replace stub).

4. Add foundation demo modules under `src/demo/converted/foundation/` when ready.

5. Set each foundation page key (`Colors`, `Typography`, `Spacing`, `Elevations`, `Dela`) to `synced` only after QA agent PASS **and human confirms** for that page; then run `compute_coverage.mjs --write`. Scope alias `foundation` means all five — not a manifest key.



## Step 3 — Shell sync



For each shell element in catalog (`ShellLayout`, `ShellHeader`, `ShellFooter`, `PageHeader`, `PageContent`, `LeftSidebar`, `RightSidebar`, `ShellPanel`):



1. Read manifest entry and Harmony `.astro` / layout source.

2. Classify: **layout-only** | **custom** (no MUI equivalent).

3. **AskQuestion** — confirm strategy.

4. On execute: add/update `src/layouts/<Name>.tsx`; export from `src/layouts/index.ts`.

5. Replace shell placeholder demo with `src/demo/converted/<Name>/`.

6. Update `VERIFIER.md` if file paths change.



## Step 4 — Per-component sync



When user names an element (e.g. `Button`, `ShellHeader`):



1. Read manifest entry and Harmony `.astro` source.

2. Use MUI MCP to find MUI equivalent(s).

3. **AskQuestion — element strategy (mandatory, cannot skip):**

   | User choice | Manifest `strategy` | Outcome |
   |-------------|---------------------|---------|
   | **Existing Component** | `existing-mui` | Theme `components.Mui*` overrides; consumer keeps `@mui/material` API |
   | **Custom Component** | `custom` | New export under `src/components/` built on MUI stack |
   | **Skip** | `skip` | No conversion; route stays placeholder or gap callout |

4. If **existing-mui** — inventory every reference prop/variant and **AskQuestion** for sign-off:

   1. **Prop mappings** — Harmony prop → **documented** MUI prop/slot/theme variant. Record in `propMappings[]`. When MUI docs list no equivalent prop, **AskQuestion** — **skip** or **custom** export only; do not invent props on `@mui/material` components.
   2. **Skipped props** — Harmony props with no MUI equivalent, user accepts skip. Record in `skippedProps[]` and `gaps[]`; demo uses `UnsupportedEquivalentCallout` for those sections.
   3. **Composite equivalents** — Harmony features achieved by composing MUI children (no new props). User confirms pattern; record in `compositeEquivalents[]` with `dependsOn` catalog elements. Demo shows **inline JSX** only — component trees with MUI/custom props, **no fidelity styling** on composed nodes; no demo-local helpers that accept Harmony catalog prop names.

5. **Dependency gate (hard — mandatory before execute):**

   1. Read reference `.astro` source and doc page (`src/pages/components/<slug>.astro`) for **catalog dependencies** — any component imported, rendered, or composed in examples (including nested usage like `ProgressBar` inside `Alert`).
   2. Merge with `compositeEquivalents[].dependsOn` and any `blockedBy` from prior plans.
   3. Check `conversion.manifest.json` — list each dependency and its status.
   4. **If any required dependency is not `synced`:** **stop** — do not mark the dependent element `synced`. **AskQuestion** the human with the blocking list and required order: *convert `<Dependency>` first, then `<Element>`*. Do **not** offer “skip dependency” or “partial complete” unless a **circular dependency** is documented (see below).
   5. Record `blockedBy: [<ElementKey>, …]` in manifest (structured array, not just `notes`) while the dependent stays `in-progress`.
   6. **Execution order:** sync all blocking dependencies first; only then implement and verify the dependent element to full reference parity.

   **Supporting MUI primitives (non-catalog):** when a Harmony pattern needs an MUI primitive with a catalog element (e.g. `LinearProgress` for Harmony `ProgressBar`), the **catalog element** (`ProgressBar`) must still be converted first — theme the primitive in that element’s scope, then the dependent uses it via direct MUI composition in the demo.

   **Circular dependencies (only exception to partial work):**

   - When A requires B and B requires A (or a cycle), document the cycle in the plan and manifest `notes` for both elements.
   - Partial implementation on **both** elements is allowed **only** to break the cycle — each stays `in-progress`.
   - **Neither** element in the cycle may be marked `synced` until **every** node in the cycle is fully converted and verified.
   - Verifier must confirm the cycle is genuine (not a avoidable ordering problem).

6. If **custom** (or a **custom sub-export** under `existing-mui`, e.g. `DelaButton`) — **AskQuestion — Consumer API packet** (mandatory; wait for sign-off). No Harmony prop wrappers. Build on MUI primitives with an API familiar to MUI developers.

   **Consumer API packet contents:**

   1. **Closest MUI analog** — e.g. `Button`, `Chip`, `SvgIcon` (cite MUI docs via MCP when available). If no analog, use usual MUI patterns (`sx`, event handlers, `component`, `...rest`).
   2. **Inherited props / events / slots** — what is forwarded or mirrored from the analog (prefer extending native MUI props).
   3. **Harmony-specific additions** — explicit list only.
   4. **Omissions / divergences** — intentional differences from the analog or from reference Astro props.
   5. **Docs impact** — demo, `docs/CONSUMER_GUIDE.md`, Getting Started.

   Record the approved packet in the plan’s **Consumer API (user confirmed)** section and in element `userDecision` (prose). On **version/resync updates**, re-present only the **delta** (introduced/changed consumer surface). Do **not** implement or expand the public TypeScript/React API without this sign-off.

7. If **skip** — record `userDecision`; leave route as placeholder. No implementation.

8. Update `conversion.manifest.json`: `strategy`, `recommendedTarget`, `propMappings`, `compositeEquivalents`, `skippedProps`, `gaps`, `userDecision` (include Consumer API sign-off for customs), `blockedBy`.

9. On execute: implement **full** reference doc parity (every example section) per strategy; demo module under `src/demo/converted/<Name>/` using **direct `@mui/material` imports** and **inline composite JSX**. Custom exports must match the approved Consumer API. Use `UnsupportedEquivalentCallout` **only** for human-declined skips — never for missing dependencies.



### Strategy outcomes



| Strategy | Label | Package change | Consumer uses | Demo shows |

|----------|-------|----------------|---------------|------------|

| `existing-mui` | Existing Component | Add/update `components.Mui*` in theme | `@mui/material/<Component>` + Harmony theme | Direct MUI imports + theme; inline composites |

| `custom` | Custom Component | Add `./<Name>` under `src/components/` | Package export (MUI-native API) | Direct custom import |

| `skip` | Skip | None | N/A | Placeholder or gap callout |

**Deprecated alias:** `theme-only` → treat as `existing-mui` when reading legacy manifests; write `existing-mui` for new work.



## Verification (QA agent)

Fidelity checks are **readonly** — delegate to **harmony-design-system-react-mui-verifier** (`playbook/VERIFIER.md`). Engineer agent handles **remediate** per `playbook/VERIFICATION.md`.

### Mark complete + recompute coverage

**`synced` means fully complete** — every reference doc example section and variant for that element is implemented, verified, and matches reference. Partial demos, dependency callouts, or missing sections **disqualify** `synced`.

**`synced` requires proof.** `validate_conversion.mjs` **hard-fails** if any element is `synced` without a `verificationReport` and `lastVerified`. An element stays `in-progress` until verifier PASS **and** all catalog dependencies are `synced`. Never set `synced` before dependencies are complete.

**Dependency check before `synced`:**

1. Re-run dependency inventory from reference source + doc page.
2. If any required dependency is not `synced` → **do not** set dependent to `synced`; keep `in-progress` and convert dependencies first.
3. Circular dependency exception: all nodes in the documented cycle must be `synced` together after full verification — never one without the others.

After human accepts a scope (verifier PASS, zero open defects, **all dependencies synced**, full content parity):

1. Engineering sets `elements.<scope>.status` to `synced` with `verificationReport` + `lastVerified`.
2. Run: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion harmony-design-system-react-mui --write`
3. Run: `node .cursor/skills/harmony-conversion/scripts/validate_conversion.mjs --conversion harmony-design-system-react-mui` — must PASS.
4. Demo sidebar reads package version and `coverage.percent` from manifest — verify footer updates.

When technology limits block equivalence (non-dependency), **AskQuestion** — record in `userDecision` and defect report. Technology limits **do not** include “dependency not converted yet.”



## Converter readiness



**Overall level:** `ready`  

**Last reviewed:** 2026-06-26



| Scope | Plan | Execute apply | Verify | Remediate |

|-------|------|---------------|--------|-----------|

| demo site (bootstrap) | yes | yes | yes | yes |

| foundation | yes | yes | yes | yes |

| shell | yes | yes | yes | yes |

| components (per name) | yes | yes | yes | yes |



### Safe to use now



- `/conversion-agent` readiness, status, plan, verify-only, execute (after approval)

- Engineer apply and QA verify for all documented scopes



---



## Anti-patterns



- Maintaining parallel registries instead of reading reference catalog/nav

- Marking an element `synced` while a catalog dependency is still `not-started` or `in-progress`

- Using `UnsupportedEquivalentCallout` to defer catalog dependency work on a demo page treated as complete

- Offering “partial complete” or “skip dependency” except for documented circular dependencies

- Shipping Harmony prop wrappers that delegate to MUI

- Demo pages that import a package adapter instead of `@mui/material`

- File-local React components in component demo files (`*Demo.tsx`) — use `@/demo/ui` and foundation demo modules

- Using inline `sx`/`style`/`className` in example demonstrations to emulate Harmony catalog props (sizes, variant colors, label typography) — use theme overrides for **documented MUI props** or **AskQuestion** for skip/custom export

- Staging hover/focus/pressed with docs-only `className` (e.g. `avatar-demo-hover`) or theme selectors that exist only for those classes — omit docs columns; use real interaction; **no** `UnsupportedEquivalentCallout` for presentation-only

- Using `UnsupportedEquivalentCallout` for docs presentation limits (cannot show staged hover/focus) — callouts are for skipped **component functionality** only

- Remediating verifier FAIL by inventing demo staging classes / fidelity `className` without AskQuestion — **No silent purity exceptions**

- Silently reversing a prior `userDecision` / `gaps[]` skip to chase visual parity — AskQuestion first

- Inventing non-MUI props on `@mui/material` components via module augmentation under `existing-mui` (e.g. `size` on `LinearProgress`) — **AskQuestion** for skip or custom export

- Wrappers around MUI primitives inside example demonstrations (layout, sizing, or Harmony-shaped) — use theme overrides or MUI/custom props only

- Demo-local components that accept Harmony catalog prop names not on the target MUI component (e.g. `progressValue` on a demo helper) — use inline JSX for composite patterns

- Using `thin-wrapper` strategy — wrappers are never valid for this converter

- Sync/conversion without MUI MCP

- Telling the user to run npm for conversion workflow

- Importing reference Astro CSS for styling

- Putting docs-layout chrome overrides in `createHarmonyTheme` (use `demoLayoutSx.ts`)

- Shipping demo code in npm package exports


