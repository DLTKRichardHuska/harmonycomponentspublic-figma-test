# Figma

Harmony Design System target: **figma** (external).

> **Status: ready** — converter tooling proven. Lifecycle: hard-dep gate → strategy packet signoff → implementor↔verifier until PASS → human review → publish → Code Connect → synced. Visual baseline for components = **shadcn demo** (not Astro). Update existing component sets **in place** (never delete/recreate).

## Host

The Harmony Figma libraries live entirely in **Figma** — one file per product (`cp`, `vp`, `ppm`, `maconomy`) plus a **shared Icons library** (`iconsLibrary` in config). There is no local component project in this repo, and **no `conversion.manifest.json`**: per-element sync state is stored inside each product Figma file (shared plugin data `harmony`/`conversionState` + a coversheet page). The repo keeps product→`fileKey` bindings and the Icons library `fileKey`.

Configuration: [`external.config.json`](external.config.json)

## Model (one file per product)

Each file is a 1:1 mirror of its `@dltkrichardhuska/harmony-design-system-shadcn-<product>` package. VP is the **canonical** file (the shared VP/PPM/Maconomy interface); PPM and Maconomy are duplicated from VP with brand + light primary hue swapped; CP is VP plus its superset (CP-only components/variables + compact `--field-*` density). Product is baked per file (colors, density, brand `name`/`logo`, component set); only light/dark is a variable mode. The per-product brand `logo` is an image, which Figma variable modes cannot hold — hence separate files rather than one combined file with a product mode.

## Sync

Sync runs **only in Cursor** via `/conversion-agent` (execute mode), using the **Figma MCP server** (`user-Figma`) to build and update:

- **Pages** — one Figma page per demo nav leaf (`Section / Title` from `src/data/navigation.ts`), each with **Page chrome** (title + status + content). Section-bucket pages are forbidden; agents must pass `converters/figma/scripts/validate-figma-pages.mjs` before bootstrap is complete.
- **Foundation** — color / density / spacing / elevation variables and typography text styles (reference font stack with fallbacks; no bundled proprietary fonts).
- **Token binding (hard)** — all internal nodes (chrome, demos, masters, samples) use those variables/styles for color, type, and shadows; no hardcoded paints except the baked brand logo.
- **Icons** — shared Icons library (glyph components named like shadcn `name` strings) + per-product public `Icon` (`size` VARIANT + `name` INSTANCE_SWAP); consumers INSTANCE_SWAP to public `Icon`.
- **Shell + Components** — Figma components authored to the **shadcn** Consumer API (identity mirror); **look / prototype / configurability** match the shadcn demo. Placed in each page's `Page content`. Variant sets use a confirmed X/Y property grid and keep Figma's dashed purple component-set outline. HTML pseudo-states become a confirmed Figma-only `state` VARIANT with While Hovering → Change to `hover`. **Update-in-place** when `nodeId` exists.

Per-element lifecycle: **dep gate → strategy signoff → in-progress → implementor↔verifier until PASS → review → needs-publish → synced** (+ `gap`).

| Status | Meaning |
|--------|---------|
| `review` | Verifier PASS (including publish-ready: no unused props, declared props wired); human may tweak |
| `needs-publish` | Waiting for human to publish the library component |
| `synced` | Published + Code Connect written + human sign-off |

Status is mirrored on the coversheet and on each leaf's `Page status`. Hard dependencies must be `synced` in host state before a dependent's strategy AskQuestion (circular exception only).

**Order is hard:** verify + remediate until PASS → `review` → `needs-publish` → human publish → Code Connect → human sign-off → `synced`. Do **not** attempt Code Connect while the element is still in `review` or `needs-publish`, or while unused props would block publish. Never mark `synced` with open fidelity defects.

## Code Connect (to shadcn)

Each product file's components are Code-Connected to that product's shadcn package so Figma Make can implement designs with the correct package. Authoring is MCP-parserless. Gates: shadcn counterpart `synced`, element past verify/`needs-publish`, and **`getPublishStatusAsync() === 'CURRENT'`** (human publish; Plugin API cannot publish).

## Account

Production files MUST be created under the Deltek **org** plan (`organization::1303904496611212311`) — never the personal starter team.

## Demo / preview

Unlike component-library targets, preview is host-defined (the Figma files themselves). No `npm run dev` for this target.

## Figma Make

See [`playbook/plans/figma-make.md`](playbook/plans/figma-make.md) for per-product package selection, private-registry auth, Tailwind v4 globals import, and mode-only provider setup.

## Derive other products

See [`playbook/plans/derive-product-files.md`](playbook/plans/derive-product-files.md). Requires a **human Duplicate** of the VP file (MCP cannot copy files), then agent brand/hue (and CP density/superset) swap.
