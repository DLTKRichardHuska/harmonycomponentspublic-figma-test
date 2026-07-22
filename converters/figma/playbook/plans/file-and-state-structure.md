# Figma file + state structure

How each product's Figma file is organized and how conversion state is stored. Applies to all four files; VP is authored first (canonical) and the others are duplicated from it.

## Pages (match demo UI — one page per nav leaf)

**Intent:** each demo UI nav route is a Figma page. Discover pages the same way the demo discovers routes: [`src/data/navigation.ts`](../../../../src/data/navigation.ts).

Figma has a flat page list. Create **one page per nav item**, named `Section / Title`, in nav order:

| Page name | Maps to |
|-----------|---------|
| `Coversheet` | Overview like `/` — `referenceVersion` + full status table from state |
| `Foundation / Colors` … `Foundation / Dela` | Foundation section leaves |
| `Shell Layout / Shell Layout` … `Shell Layout / Shell Panel` | Shell section leaves |
| `Components / Accordion` … `Components / Tooltips` | Components section leaves (nav titles, e.g. `Components / Buttons`) |
| `_internal` | Structural helpers + the `Icon` **component set** (not a demo doc page) |

**Hard rules (bootstrap gate — non-negotiable):**

1. Do **not** use section-bucket pages (`Foundation`, `Shell Layout`, `Components` alone).
2. Page names and order must match `navigation.ts` (plus `Coversheet` first, `_internal` last). Skip Changelog (and demo-only Getting Started) — those are not design-library surfaces.
3. After creating/renaming pages, run the page validator (below). **Refuse** to mark bootstrap complete or start element apply if validation fails.
4. Component **nodes** use **shadcn export names** (`Button`, `Select`); page titles keep reference/demo nav labels.

### Page anatomy (every nav leaf)

Each leaf page (not Coversheet, not `_internal`) must contain a single top-level frame named **`Page chrome`** with this structure:

```text
Page chrome                    (VERTICAL auto-layout)
├── Page title                 (TEXT — nav item title, e.g. "Buttons")
├── Page status                (TEXT — status line for this page's elements)
└── Page content               (VERTICAL auto-layout — components / samples live here)
```

| Layer | Role |
|-------|------|
| `Page title` | Human title matching the nav leaf (last segment of the page name) |
| `Page status` | Rendered from `harmony`/`conversionState` for every element keyed to this page (e.g. `Button: review`). Update whenever element status changes |
| `Page content` | Converted Figma components, foundation samples, or a `Placeholder` until apply starts |

When converting an element, place (or move) its component set / samples **inside `Page content`**, never as a sibling of `Page chrome`.

**Replace placeholders on apply (hard):** any `Placeholder` or `Placeholder — *` on that page (page root or inside `Page content`) must be **removed** when real content is added. Do not stack demos/components under or beside a leftover placeholder — leftovers obscure the page. Unimplemented leaves keep exactly one `Placeholder` inside `Page content` only (never as a sibling of `Page chrome`).

**Foundation pages (Colors, Typography, Spacing, Elevations)** have no component sets — `Page content` holds a **variable/style demo** instead (see below).

Record in state: `pages[pageName].chromeId`, `titleNodeId`, `statusNodeId`, `contentId` so status sync does not re-walk the tree.

### Foundation demos (Colors / Typography / Spacing / Elevations)

Mirror the reference foundation pages (`src/pages/foundation/*.astro`) as **visual demos**, not documentation pages:

| Page | Demo content |
|------|----------------|
| `Foundation / Colors` | Swatch grid bound to `Color` variables (name label per swatch); Light/Dark via collection modes |
| `Foundation / Typography` | Type specimens using local text styles (`Typography/…`); style name label |
| `Foundation / Spacing` | Scale rows: bar width bound to `Spacing` floats + name/value label; optional radius samples from `Radius` |
| `Foundation / Elevations` | Cards with local `Elevation/shadow-*` effect styles applied |

Keep labels to token/style names only — no long prose, code samples, or usage essays. Dela may stay placeholder until its tokens are modeled.

### Bootstrap checklist

- [ ] Expected page list generated from `navigation.ts` (Coversheet + leaves + `_internal`)
- [ ] No bucket page names present
- [ ] Order matches expected list
- [ ] Every leaf has `Page chrome` / `Page title` / `Page status` / `Page content`
- [ ] `node .cursor/skills/...` wait — use `node converters/figma/scripts/validate-figma-pages.mjs --pages <dump.json>` → exit 0
- [ ] Coversheet rendered from state; leaf `Page status` texts synced from state

## Validate pages (agents)

Dump pages + chrome presence via `use_figma`, write JSON, then:

```bash
node converters/figma/scripts/validate-figma-pages.mjs --pages converters/figma/verification/artifacts/vp-pages.json
```

Exit non-zero on missing/extra/misordered pages, bucket names, or missing page chrome. Bootstrap and version-bump are **blocked** until this passes.

## Variable collections

Per product file (product baked; only light/dark modes):

| Collection | Modes | Source |
|------------|-------|--------|
| `Color` | light, dark | reference color tokens / shadcn `globals.css` `:root` + `.dark` |
| `Density` | (single) | `--field-*` height/radius/padding-x/font-size/label geometry (VP standard; CP compact) |
| `Spacing` | (single) | spacing tokens |
| `Elevation` | (single) | elevation/shadow tokens |
| `Typography` | (single) | type ramp; text styles reference the font stack with safe fallbacks |

CP additionally defines superset families (`--floating-nav-*`, `--cp-sidebar-*`, `--cp-datagrid-*`, kanban chrome).

## Token binding (hard)

Internal file content must **use** the collections/styles above — not merely define them. This is how the library teaches the standard.

| Must bind | To |
|-----------|----|
| Fills, strokes, text color | `Color` variables |
| Type (family/size/weight/line-height/letter-spacing) | `Typography/…` text styles |
| Shadows | `Elevation/…` effect styles |
| Spacing / radius / field geometry (when sized from tokens) | `Spacing` / `Radius` / `Density` variables |

Scope: coversheet, `Page chrome` (title/status), foundation demos, `_internal` component masters, and all samples under `Page content`.

**Refuse** to ship or mark `review` with unbound solids, manual fonts, or inline shadow effects. Only exception: baked brand `logo` image fill (vector logo fills should bind `primary` / `primary-foreground` when possible). Missing token → add to foundation first. Component-specific type (e.g. button sizes) lives under `Typography/<Component>/…`, not unbound font sizes.

**Expand Color when components need it:** foundation swatches alone are not enough for Button (and similar). Add variables for `--theme-btn-*`, `--dela-header-content-fg`, `--gradient-dela-start` / `--gradient-dela-end` (plus a Dela gradient paint style), page-header button tokens when `buttonType=pageHeader` is in scope. Prefer exact CSS names so Code Connect / designers share vocabulary.

## Brand identity (baked, not moded)

Product `name` (string) and `logo` (image) come from [`product-meta.json`](../../../../conversions/harmony-design-system-shadcn/packages/ui/src/data/product-meta.json) and are baked into the file's brand nodes (ShellHeader). The logo is an image fill — Figma variable modes cannot hold an image, so it is baked per file.

## Icons

**Shared Icons library** + product public `Icon` + doc samples on `Components / Icons`:

| Layer | Role |
|-------|------|
| **Icons library** (`external.config.json` → `iconsLibrary`) | Individual glyph components; **name = shadcn `Icon` `name` string**; shared by all product files |
| **`Icon`** (public, per product) | VARIANT `size` (xs–xl) + INSTANCE_SWAP `name` → Icons-library component; W/H bound to `icon/*` FLOAT vars |

Maps to shadcn `<Icon name="…" size="…" />` via Code Connect (`getInstanceSwap('name').name` + `getEnum('size')`). Component slots INSTANCE_SWAP to **public `Icon`**. Legacy product-file **`IconGlyph`** is deprecated.

### Glyph art (hard)

Canonical (see Icons-library `plus`):

1. **GROUP** wraps the vector — **not** a Frame (Frames do not scale with resize).
2. Vector **constraints** = SCALE / SCALE.
3. **Outline Stroke → filled** vector (no live stroke — stroke weight does not scale in Figma).
4. Fill bound to Color **`text-primary`** (shadcn `currentColor` / text inheritance stand-in; parents override when needed).

Defect if glyphs ship Frame wrappers, live strokes, unbound fills, or non-SCALE constraints.

## Variant grid layout (hard)

COMPONENT_SET masters are a **property grid**, not a wrapped list.

| Rule | Detail |
|------|--------|
| Axes | Only **VARIANT** props participate (including Figma-only `state`). BOOLEAN / TEXT / INSTANCE_SWAP stay as component properties. |
| Prefer X | Assign the primary browsing prop to **X (columns)** first; second prop to **Y (rows)**. |
| One prop per axis | Do not nest multiple VARIANT props on one axis unless there are **3+** VARIANT props forcing it. Prefer nesting on X before Y. |
| Confirm first | Ask the user to confirm the axis plan **and** HTML `state` values **before** building or rearranging the set. |
| Positioning | `layoutMode = NONE`; place children by parsed `prop=value` names; `resizeWithoutConstraints` to bounds. |
| Set chrome | Keep Figma’s default **dashed purple** stroke on the component set (`#9747FF`-equivalent, `dashPattern [10,5]`). Re-apply after Plugin API edits if missing. |
| HTML states | When confirmed: VARIANT `state` with `default` + interaction values; **While Hovering** → Change to `state=hover` on default cells. |

Record the confirmed axis plan in the element’s plan notes / state when useful (`axes: { x: ["variant"], y: ["size"] }`, `states: ["default","hover","focus"]` or `states: []`).

Also record the confirmed **Consumer API inventory** (prop → Figma kind → wired | deferred) so remediates and Code Connect stay honest.

## State schema (shared plugin data)

Stored at `figma.root.setSharedPluginData('harmony', 'conversionState', <json>)`. Private `setPluginData` is not supported in `use_figma`; use shared plugin data. Keep a human-readable mirror on the Coversheet **and** on each leaf's `Page status`.

```json
{
  "schemaVersion": 2,
  "referenceVersion": "0.9.0",
  "product": "vp",
  "role": "canonical",
  "derivedFrom": null,
  "brand": { "name": "Vantagepoint", "logoBaked": true },
  "nameMap": { "Dropdown": "Select", "DatePicker": "Calendar" },
  "codeConnect": {
    "target": "harmony-design-system-shadcn",
    "package": "@dltkrichardhuska/harmony-design-system-shadcn-vp",
    "libraryPublished": false,
    "tailwind": "v4-globals-import",
    "provider": "mode-only"
  },
  "pages": {
    "Components / Buttons": {
      "pageId": "…",
      "chromeId": "…",
      "titleNodeId": "…",
      "statusNodeId": "…",
      "contentId": "…",
      "elementKeys": ["Button"]
    }
  },
  "elements": {
    "Colors": { "status": "not-started", "pageName": "Foundation / Colors", "nodeId": null },
    "Button": {
      "status": "not-started",
      "pageName": "Components / Buttons",
      "nodeId": null,
      "shadcnExport": "Button",
      "variantMap": {},
      "codeConnectStatus": "none"
    }
  },
  "updatedAt": "ISO-8601"
}
```

- `product` is a **single** product per file (`role`: `canonical` | `derived` | `superset`; `derivedFrom` → `vp` for the duplicates).
- Element statuses: `not-started → in-progress → review → needs-publish → synced` (+ `gap`).
  - `review` — verifier PASS (includes publish-ready checks).
  - `needs-publish` — waiting for human library publish; **no Code Connect yet**.
  - `synced` — published + Code Connect + human sign-off.
- `codeConnectStatus`: `none | authored | published | stale`.
- On version bump: update `referenceVersion`, reset all element statuses to `not-started`, refresh coversheet **and every leaf `Page status`**.

### Page ↔ element keys

| Page pattern | Default `elementKeys` |
|--------------|----------------------|
| `Foundation / {Title}` | `[{Title}]` (e.g. `Colors`) |
| `Shell Layout / Shell Layout` | `["ShellLayout"]` |
| `Shell Layout / {Title}` | PascalCase of title without spaces (e.g. Shell Header → `ShellHeader`) |
| `Components / Buttons` | `["Button"]` (+ related exports when split) |
| `Components / {Title}` | shadcn export via `nameMap` / catalog (e.g. Dropdowns → `Select`) |

A page's `Page status` text joins its `elementKeys`: `Button: needs-publish` or `Input: synced · InputField: in-progress`.

## Coversheet render

Read state → render title, `referenceVersion`, product/role, a **summary count**, and a status table with **one row per element in `conversionState.elements`** (foundation → shell → components). Do **not** ship a partial seed (e.g. only Colors + Button) — at bootstrap, seed every page's `elementKeys` into `elements` (default `not-started`) so the coversheet and leaf `Page status` lines stay complete. Keep status text node ids in `coversheet.statusNodeIds` so updates are targeted. When any element status changes, refresh the coversheet row **and** that leaf's `Page status`.
