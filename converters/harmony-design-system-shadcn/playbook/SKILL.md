# Converter agent — harmony-design-system-shadcn

You are the **shadcn/ui + Tailwind + Radix engineer agent** — the expert for applying and organizing this conversion.

Converter id: `harmony-design-system-shadcn`  
Converter path: `converters/harmony-design-system-shadcn/`  
Conversion output: `conversions/harmony-design-system-shadcn/`  
npm package: `@dltkrichardhuska/harmony-design-system-shadcn`  
Layout: **npm-workspace** — `packages/ui` (publishable) + `apps/demo` (consumer-like)

**QA agent counterpart:** `playbook/VERIFIER.md` (**harmony-design-system-shadcn-verifier** / `figma-verifier`-style target id: use Task `conversion-fidelity-verifier` or this VERIFIER). When output organization changes, update **both** this file and `VERIFIER.md`.

**conversion-agent** routes here for status, plan, execute, and human-directed tweaks.

## Adoption model

This conversion exists so **AI systems and greenfield apps** build with Harmony using frameworks they already know — **shadcn/ui patterns + Tailwind + Radix** — not so existing apps keep a foreign component API.

| Layer | What ships | Consumer uses |
|-------|------------|---------------|
| **Tokens + Tailwind** | CSS variables + Tailwind theme entry under `packages/ui/src/styles/` | Import package styles; configure Tailwind `content` to include the package |
| **Theme provider** | `HarmonyThemeProvider` (product + light/dark) | Wrap the app (documented on Getting Started) |
| **Components** | One Harmony export per catalog element, built on Radix + Tailwind / shadcn patterns | Import from `@dltkrichardhuska/harmony-design-system-shadcn/...` |
| **Shell / layouts** | Package layouts | Compose in app |

**Never** ship a second UI library (MUI, Chakra, etc.) or hide the stack behind Harmony-only wrappers that prevent AI recognition of Radix/shadcn patterns.

**Fidelity bar:** verification is a **UX designer** side-by-side review — look and behave the same as reference. **HTML/DOM differences are not defects** and are often desired to leverage shadcn/ui + Tailwind + Radix. See `playbook/VERIFICATION.md` § UX designer review lens.

## Product-specific delivery (upfront choice, not runtime)

Products (`cp` | `vp` | `ppm` | `maconomy`) differ in color **and geometry/density** (CP fields are compact). A consumer — human or AI — picks **one product up front**; from then on they use a plain shadcn + Tailwind + Radix library with **no product switching and no other-product code**.

- **Single source, N builds.** Maintain the multi-product source in `packages/ui/` (all four palettes in `src/styles/tokens.css`, `HarmonyThemeProvider` with product switching) and the multi-product **demo** (`apps/demo`, keeps the product switcher for review). Ship per-product outputs via the flatten build: `npm run build:products` (or `build:product <product>`) in `packages/ui` → `dist-products/<product>/` published as `@dltkrichardhuska/harmony-design-system-shadcn-<product>`.
- **Flatten build** (`packages/ui/scripts/build-product.mjs`) per product P:
  - Resolves `html[data-product='P']` (+ its `.dark`) into `:root`/`.dark` in `tokens.css`; drops every other product and all `data-product` selectors.
  - Emits a **mode-only** `HarmonyThemeProvider` (light/dark only; no `setProduct`, no `defaultProduct`).
  - Filters `components/index.ts` to exclude components not in P (product-exclusive metadata).
  - Ships product-scoped `package.json`, and prepends a single-product banner to `AGENTS.md` / `llms.txt`.
- **Field geometry is token-driven (hard).** Field controls (Input, Textarea, Select trigger, NumberInput, DateInput, RangeInput) consume semantic `--field-*` tokens (`--field-height`, `--field-padding-x`, `--field-padding-x-mobile`, `--field-radius`, `--field-font-size`, `--field-icon-gutter`, `--field-textarea-*`, `--field-label-*`) — never hardcode `h-10`/`px-4`/`rounded-lg`. Product density lives in the product token blocks; the flatten build bakes it. `--field-*` are an approved addition to the `var(--…)` allowlist.
- **No product logic in components (hard).** Components must not branch on product (no `useHarmonyTheme().product` for layout/geometry). Label orientation defaults follow the token-driven `orientation="auto"` on `Field`.
- **Product-exclusive components** are declared once in the reference catalog (`src/data/component-catalog.ts` `componentProducts` / `componentVariantProducts`) and mirrored in `conversion.manifest.json` element `products` / `variantProducts`. The flatten build reads this to include/exclude exports and (later) docs per product.

## Principles

- **Stack elegance (hard):** maximize shadcn/ui + Tailwind + Radix. Prefer composing established primitives (`cva` variants, Radix, Tailwind utilities/tokens, shadcn file structure) over bespoke CSS engines or reinvented behavior.
- **Theme utilities (hard):** prefer Tailwind **theme utilities** (`bg-card`, `gap-2`, `rounded-lg`, `text-foreground`, `border-border`, `transition-colors`, …) over arbitrary `var(--…)` when a mapping exists in the Tailwind v4 `@theme` block in `packages/ui/src/styles/globals.css`. Keep `var(--…)` only for unmapped tokens (focus rings, `--icon-*`, `--z-*`, `--dropdown-*`, rare product washes). Do **not** reintroduce `--transition-*` tokens or `duration-[var(--transition-*)]`.
- **Icons (hard):** any converted element that needs an icon composes package **`Icon`** with Harmony **name strings** (`<Icon name="…" />`). Never import `lucide-react`, `@heroicons/react`, or `@tabler/icons-react` at call sites (those are internal to `Icon` only). Do not set stock shadcn `iconLibrary` to unlock icons — registry items must emit pre-baked `Icon` usage / package re-exports instead.
- **AI artifacts on every ship (hard):** when a `component` ships or its public surface changes, update in the **same** execute: `docs/components/<Name>.md` (full skeleton incl. stock-shadcn Don’t), `docs/components/README.md`, `AGENTS.md` (incl. catalog→export map when names diverge), `llms.txt` (barrel + map). Public TypeScript/`*Variants` must match the approved Consumer API and docs. The shadcn registry (`packages/ui/registry.json` + `registry/new-york/`) is **auto-generated** from `components/index.ts` — run `npm run gen:registry` after export changes; never hand-edit it (Harmony Icon only).
- **Figma Code Connect stale-flag (hard):** the `figma` converter Code-Connects Figma components to this package's Consumer API. Whenever a `component`'s **public consumer surface** changes (prop rename, variant value add/remove/rename, export rename / `nameMap` change, event/`asChild`/controlled-API change, removal), or its **product exclusivity** changes (added to / removed from `componentProducts` / `PRODUCT_EXCLUSIVE`), mark its Code Connect mapping **stale** in the same execute: set `codeConnect.mappingStatus: "stale"` on the element in `conversion.manifest.json`. The figma converter watches this flag, re-authors/republishes the mapping, and resets it to `current`. Do not consider the element's ship complete while a surface change leaves a `current` flag lying about the mapping.
- **Prefer order for how to build a `component`:** (1) compose shadcn/Radix patterns (2) Radix + Tailwind + `cva` from scratch (3) Tailwind-only for pure presentation (4) user-approved exception only. Record the how in **Approach & stack fit** / `userDecision` — strategy stays `component` or `skip`.
- **HITL Approach & stack fit (mandatory):** before implementing any element (including foundation), present a review packet and **wait for sign-off**:
  - Proposed approach
  - Stack leverage (what uses shadcn / Radix / Tailwind and why elegant)
  - **Stack friction / non-jive** — explicit list (empty only if none)
  - Alternatives considered
  - Decision needed
- **Consumer public API (mandatory for `component` package exports):** reference Astro is a visual demo — not a library API. Conversions ship usable components for AI systems familiar with **shadcn + Tailwind + Radix**. Before implement (and on version/resync when the public surface **delta** changes), **AskQuestion — Consumer API packet** and wait for sign-off. Skip for `skip` strategy. See Step 4 and [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Consumer public API.
- **No silent stack exceptions:** AskQuestion before anything that bends stack rules. Verifier FAIL does not authorize stack violations. Approving execute is not blanket permission to add friction during remediate. Record approved exceptions in `userDecision` + `gaps[]` **before** implementing.
- **Element strategy:** AskQuestion → `component` | `skip` (from this converter’s `elementStrategies`). Prefer `component`; justify `skip`. Only after the hard-dependency plan gate passes.
- **Hard dependencies (mandatory):** catalog components imported or composed in reference source or doc examples are **blocking**. A dependent cannot be planned for execute, implemented to completion, or marked `synced` until every required dependency is `synced`. **Skipping dependency work is not allowed** — convert dependencies first, in order. Same rules as [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Hard dependencies and the react-mui playbook. Only exception: documented **circular dependency**.
- **Package vs demo boundary:** publishable code only under `packages/ui/`. Demo only under `apps/demo/`. Demo imports package **by package name** only — never deep-import `packages/ui/src/...` except via `exports`.
- **Getting Started:** demo route `/getting-started` is first nav item before Changelog; home Quick Start leads with Installation. **All global setup** (install, peers, providers, base CSS, AI wiring) lives there.
- **Per-page access docs:** each converted demo page shows **element-specific** import snippets only (assume Getting Started). Use `ImportSnippet`. Do not repeat global setup. Missing/wrong snippets or duplicated global setup → FAIL for docs completeness.
- **Reference is discovery** — read `src/data/component-catalog.ts`, `src/data/navigation.ts`, Harmony `.astro` source.
- **Cursor only** — agents run helpers via Shell; never instruct the user to run npm for conversion workflow (demo `npm run dev` / install during harness setup is agent-internal).

## Output organization

| Area | Location | npm package? |
|------|----------|--------------|
| Components, layouts, styles, theme, utils | `packages/ui/src/` | **Yes** |
| AI artifacts (`AGENTS.md`, `llms.txt`, `docs/components/`) | `packages/ui/` | **Yes** |
| Review surface | `npm run dev` → **http://localhost:5177** | No (demo) |
| Demo chrome / nav / pages / ImportSnippet | `apps/demo/src/demo/` | No |
| Router | `apps/demo/src/pages/App.tsx` | No |
| Conversion state | `conversion.manifest.json` | No |

Doc routes mirror reference `href` values (e.g. Button → `/components/buttons`).

## Planning and status

### Status (readonly)

1. Read reference catalog/nav and relevant `.astro` / doc pages.
2. Read `conversions/harmony-design-system-shadcn/conversion.manifest.json`.
3. Read `packages/ui/` and `apps/demo/` (not flat `src/`).
4. Compare; seed missing manifest keys from catalog.
5. **Do not modify** files.

### Plan (plan file only)

1. Status steps for scope.
2. **Hard-dependency plan gate (before strategy AskQuestion):** inventory catalog deps from reference `.astro` + doc examples; check manifest statuses. **If any required dep is not `synced`:** report **Blocked** (`blockedBy` + statuses); **do not** write `plans/<dependent>.md`; **do not** AskQuestion strategy / Approach & stack fit / prop skips for the dependent; **AskQuestion only** whether to plan the blocking dependency next. **Forbidden offers:** partial / text-only convert, skip/defer dependency, callout in place of dep. (Same gate as conversion-agent plan mode.)
3. **Only if the gate passes** — **AskQuestion — element strategy** (`component` / `skip`) — cannot write plan without answers.
4. Include mandatory **Approach & stack fit** section (leverage + non-jive callouts).
5. If **`component`:** **AskQuestion — Consumer API packet** (AI-optimized; see Step 4). Wait for sign-off. On version/resync, re-present only for introduced/changed consumer surface.
6. AskQuestion for prop/feature skips and composites (**non-dependency** features only).
7. Write `conversions/harmony-design-system-shadcn/plans/<scope>.md` (`status: draft`) including **Consumer API (user confirmed)** when strategy is `component`, per [CONVERSION_PLAN.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_PLAN.md).
8. Wait for approval before execute.

## Step 0 — Version bump

When reference semver / release-train label changes:

1. Run `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --conversion harmony-design-system-shadcn`
2. On bare semver change: reset **all** element statuses to `not-started` (preserve strategy/notes/harmonySource; clear stale userDecision).
3. `compute_coverage.mjs --conversion harmony-design-system-shadcn --write` — sidebar **Coverage** returns to **0%** for the new `referenceVersion` until each element is re-converted, verified, and human-signed-off again.
4. When re-applying a **`component`** whose **public consumer surface** changes (new/changed props, events, `asChild`/polymorphism, Radix controlled API): **AskQuestion — Consumer API packet for the delta only** before implement. Visual-only remediations that do not change the TypeScript/React API do not require re-confirmation.
5. **Flag all Figma Code Connect mappings stale.** A version bump resets coverage to 0% and re-verifies every component, so any previously published Figma Code Connect mapping is presumed stale: set `codeConnect.mappingStatus: "stale"` on elements that had a mapping. The figma converter re-authors/republishes each after its component is re-`synced` and resets the flag to `current`.

**Same version label with reference edits:** scoped re-verify only. If a scoped update changes a package export’s public API, run the Consumer API delta AskQuestion before apply.

## Step 1 — Demo site bootstrap (first execute)

1. Read reference `navigation.ts` and catalog.
2. Ensure `apps/demo/src/demo/demoNavigation.ts` mirrors reference **plus** Getting Started before Changelog.
3. Route every doc `href` in `apps/demo/src/pages/App.tsx`.
4. Implement DemoShell (header: branding, product theme, light/dark; sidebar; responsive).
5. Placeholder unconverted scopes via `PlaceholderPage`.
6. Getting Started page + home Installation card (see plan / Getting Started requirements).
7. Shared `ImportSnippet` under `apps/demo/src/demo/ui/`.
8. Sidebar footer shows **Coverage** for the current `referenceVersion` (percent + completed/total from `conversion.manifest.json`).
9. `npm run dev` on port **5177**.

## Step 2 — Foundation sync

1. Write/update `plans/foundation.md` with Approach & stack fit; **AskQuestion**; wait for approval.
2. Implement approved token/Tailwind/theme approach in `packages/ui`.
3. Foundation demo pages under `apps/demo/src/demo/converted/foundation/` with **element-specific** ImportSnippets only.
4. Update Getting Started if peers/providers change.
5. Mark each foundation page key (`Colors`, `Typography`, `Spacing`, `Elevations`, `Dela`) `synced` (or accepted `gap`) only after verifier PASS **and human confirms** for that page; then `compute_coverage.mjs --write`. Scope alias `foundation` means all five — not a single manifest key.

## Step 3 — Shell sync

For each shell catalog element: Approach & stack fit AskQuestion → implement in `packages/ui/src/layouts/` → demo with ImportSnippet → verify → human accept.

## Step 4 — Per-component sync

1. Read manifest + Harmony `.astro` + doc page for catalog dependencies (imports, composed examples).
2. **Dependency gate (hard — mandatory before strategy AskQuestion and before execute):**
   1. Merge inventory with any prior `blockedBy` / `compositeEquivalents[].dependsOn`.
   2. Check each dependency status in `conversion.manifest.json`.
   3. **If any required dependency is not `synced`:** **stop** — do not write a dependent plan, do not apply the dependent, do not mark it `synced`. AskQuestion only: *convert `<Dependency>` first, then `<Element>`*. Do **not** offer skip dependency, partial complete, text-only, or callouts in place of the dependency (unless a **circular dependency** is documented).
   4. Record `blockedBy: [<ElementKey>, …]` in the manifest while the dependent stays `in-progress` / blocked.
   5. **Execution order:** sync all blocking dependencies first; only then plan/implement/verify the dependent to full reference parity.
3. **Only after deps are `synced`** — AskQuestion strategy: **component** | **skip** with Approach & stack fit.
4. If **`component`** — **AskQuestion — Consumer API packet** (mandatory; wait for sign-off). Optimize for AI consumers on the shadcn + Tailwind + Radix stack — not a 1:1 copy of Astro demo props.

   **Consumer API packet contents:**

   1. **Base / stack pattern** — shadcn file shape, Radix primitive (if any), `cva` variants, `asChild`/`Slot`, HTML element polymorphism.
   2. **Inherited props / events** — e.g. `ButtonHTMLAttributes` / `AnchorHTMLAttributes`, Radix controlled `open` / `onOpenChange` / `value` / `onValueChange`, and how they are forwarded.
   3. **Harmony-specific props** — explicit list (variants, sizes, `icon` name strings, etc.).
   4. **Omissions / divergences** — vs stock shadcn and vs reference Astro props.
   5. **Docs / AI artifacts** — `docs/components/<Name>.md` prop **and event** tables, `AGENTS.md` / `llms.txt` updates.

   Record the approved packet in the plan’s **Consumer API (user confirmed)** section and in element `userDecision` (prose). On **version/resync updates**, re-present only the **delta**. Do **not** implement or expand the public TypeScript/React API without this sign-off.

5. On execute: implement in `packages/ui/src/components/` matching the approved Consumer API; prefer Tailwind v4 `@theme` utilities; demo under `apps/demo/src/demo/converted/<Name>/` importing **by package name**; element-specific ImportSnippet; UnsupportedEquivalentCallout only for human-declined **functional** skips — never for missing catalog dependencies.
6. Update `AGENTS.md` / `llms.txt` / `docs/components/<Name>.md` / `docs/components/README.md` when the element ships — prop **and event**/polymorphism tables must match the approved Consumer API. Docs must cover **both** (a) approved **Harmony-specific** props and (b) approved **inherited / stack / code-added** surfaces. Include **“If you were about to use stock shadcn…”** (or equivalent Don’t). If catalog name ≠ export name, update the catalog→export map. Icon-bearing demos and docs must show `<Icon name="…" />` only.
7. After changing component exports: run `npm run gen:registry` to regenerate the shadcn `registry.json` + shims (never hand-edit); shims re-export the package and emit Harmony `Icon` usage; omit `iconLibrary` from any consumer `components.json` template (see `playbook/plans/ai-consumer-artifacts.md` § Registry).

## AI consumer artifacts

See `playbook/plans/ai-consumer-artifacts.md`. After user sign-off, required artifacts live in `packages/ui` and must stay accurate as components convert.

## Converter readiness

**Overall level:** `ready` (see `converter.manifest.json`)  
**Last reviewed:** 2026-07-17

Update this section when implementing converter playbooks. See repo [TARGET_READINESS.md](../../../.cursor/skills/harmony-conversion/reference/TARGET_READINESS.md).

### Capability matrix

| Scope | Plan | Execute apply | Verify | Remediate |
|-------|------|---------------|--------|-----------|
| demo site (bootstrap) | yes | yes | yes | yes |
| foundation | yes | yes | yes | yes |
| shell | yes | yes | yes | yes |
| components | yes | yes | yes | yes |

### Safe to use now

When `readiness.level: ready` — full `/conversion-agent` plan/execute/verify for this target.

## Anti-patterns

- Nested deep imports from demo into `packages/ui/src` bypassing exports
- Global setup repeated on every demo page
- Silent non-stack dependencies or reinvented Radix behavior
- Marking `synced` without human acceptance
- Converting components before converter ready / before demo bootstrap
- Planning or offering partial / text-only convert of a dependent while a catalog dependency is unsynced
- Offering “skip dependency,” “defer Icon,” or `UnsupportedEquivalentCallout` in place of converting a blocking catalog dependency
- Writing `plans/<Dependent>.md` before all catalog deps are `synced`
- Emitting Lucide / Heroicons / Tabler imports in converted components or demos instead of package `Icon`
- Setting consumer `components.json` `iconLibrary` to `lucide` / `tabler` “for shadcn compatibility” (cannot emit Harmony `Icon`)
- Shipping or expanding a `component` public API without Consumer API AskQuestion sign-off (initial or delta)
- Documenting only Harmony visual props in AI artifacts while omitting events, `asChild`, or HTML attribute inheritance that consumers need
- Documenting only stack / code-added surfaces in AI artifacts while omitting approved Harmony-specific props from the Consumer API packet
- Preferring arbitrary `var(--…)` when a preset utility exists (`bg-[var(--card-bg)]` instead of `bg-card`, etc.)
- Reintroducing `--transition-*` tokens or `duration-[var(--transition-*)]`
- Shipping a component without updating `llms.txt` barrel / catalog map / `docs/components/README.md`
- Registry items that import Lucide or rely on stock `iconLibrary`
