# Converter playbook — figma

Converter id: `figma`
Path: `converters/figma/`
Host: Figma via MCP (`user-Figma`)

No local `conversions/figma/` — output **and per-element sync state** live in Figma. Per-element state is stored in each bound file via shared plugin data (`harmony`/`conversionState`) + a coversheet page. The repo holds only product→`fileKey` bindings in [`external.config.json`](../external.config.json).

Read before executing: [CONVERTER_VS_CONVERSION.md](../../../.cursor/skills/harmony-conversion/reference/CONVERTER_VS_CONVERSION.md), [SYNC_ELEMENTS.md](../../../.cursor/skills/harmony-conversion/reference/SYNC_ELEMENTS.md), Phase 0 findings [`plans/phase-0-findings.md`](plans/phase-0-findings.md), file/state spec [`plans/file-and-state-structure.md`](plans/file-and-state-structure.md), and the MCP skill `skill://figma/figma-use/SKILL.md` (mandatory before any `use_figma` call).

## Model (one file per product)

Four Figma **product** files, one per product — each a 1:1 mirror of its `@dltkrichardhuska/harmony-design-system-shadcn-<product>` package — plus one **shared Icons library** (`external.config.json` → `iconsLibrary`) whose glyph components are INSTANCE_SWAPped by every product’s public `Icon`:

| Product | File name | Role |
|---------|-----------|------|
| `vp` | Harmony Design System (VP) | **canonical** — authored first; the shared VP/PPM/Maconomy interface |
| `ppm` | Harmony Design System (PPM) | derived — duplicate of VP; swap brand + light primary hue |
| `maconomy` | Harmony Design System (Maconomy) | derived — duplicate of VP; swap brand + light primary hue |
| `cp` | Harmony Design System (CP) | superset — duplicate of VP + add CP-only components/variables + compact density |
| *(shared)* | Harmony Design System Icons | Glyph components; **name = shadcn `Icon` name**; not product-scoped |

Within a product file, the only variable mode dimension is **light/dark**; product is baked (colors, `--field-*` density, brand `name`/`logo`, component set). Brand `logo` is an image, which Figma variable modes cannot hold — this is why each product is a separate file, not a combined file with a product mode.

## Planning and status

Invoked by **conversion-agent** (`status`, `plan`, or `execute`).

### Status (readonly)

1. Read [`external.config.json`](../external.config.json) for bindings.
2. For each bound `fileKey`, read `harmony`/`conversionState` shared plugin data via `use_figma` (readonly) and report `referenceVersion` + per-element statuses vs [`src/data/component-catalog.ts`](../../../src/data/component-catalog.ts) and [`src/data/navigation.ts`](../../../src/data/navigation.ts).
3. If a product has no `fileKey`, report it as **unbound** (not "not converted").
4. Never treat `converter.manifest.json` readiness as sync progress.

### Plan (plan file only)

Plans live under [`plans/<scope>.md`](plans/) (`status: draft`). Do not call Figma MCP writes in plan mode.

1. **Hard-dependency gate (mandatory — before strategy AskQuestion):**
   1. Inventory catalog/shadcn dependencies from the export’s source imports + `docs/components/<Name>.md` examples (plus foundation tokens the component paints use).
   2. Read each dependency’s status from the product file’s `harmony`/`conversionState` (not a repo `conversion.manifest.json`).
   3. **If any required dependency is not `synced`:**
      - Output a short **Blocked** response: requested element, `blockedBy` list, each dep’s status.
      - Write `blockedBy` into host state for the dependent (do not mark it completable).
      - **Do not** write `plans/<dependent>.md`.
      - **Do not** AskQuestion for strategy, props, `state`, or axes on the dependent.
      - **AskQuestion only:** whether to plan the blocking dependency next (or which blocker if several).
      - **Stop.** Exception: documented circular dependency cycle only (see **Dependency order**).
   4. **Forbidden offers** when blocked: partial convert, skip/defer dep, “do some of X now,” or joint execute that marks the dependent done before the dep is `synced`.
2. **Only if the gate passes — AskQuestion strategy packet (mandatory):** present the full **strategy packet** (below) for user review/refine. Cannot write an approval-ready plan without answers.
3. Write `plans/<scope>.md` with Element strategy, Consumer API inventory, HTML `state`, axis plan, deferred props, token/wiring decisions, **Token / efficiency forecast**, Blocking dependencies (empty or all `synced`), and Update-in-place notes.
4. Wait for explicit signoff before execute.

#### Strategy packet (present → refine → signoff)

| Section | Required content |
|---------|------------------|
| **Element strategy** | `figma-component` \| `figma-variable` \| `skip` (from `converter.manifest.json` → `elementStrategies.allowed`) |
| **Product file(s)** | Which bound file(s); VP canonical first |
| **Consumer API inventory** | Every shadcn prop/cva key → proposed Figma type (VARIANT / BOOLEAN / TEXT / INSTANCE_SWAP) or **deferred** + rationale |
| **HTML `state`** | Values (`default`/`hover`/`focus`/…) or explicit **none**; which axis |
| **Axis plan** | Which VARIANT props on X vs Y; nesting only if 3+; option order |
| **Wiring / tokens** | How BOOLEAN/TEXT/INSTANCE_SWAP bind; Color/Typography/Elevation bindings (CSS-equivalent tokens) |
| **Token / efficiency forecast** | Risk list + mitigations (see below). User must acknowledge before signoff. Prefer Shell `estimate-apply-cost.mjs` for grid heuristics. |
| **Other decisions** | Samples on page, icon names needed, fullWidth behavior, etc. |
| **Update-in-place** | Existing `nodeId` to edit (if any); confirm no delete/recreate |

**Refuse to apply** until the user confirms the packet (including deferred, interaction states, **and the Token / efficiency forecast**). A strategy AskQuestion **without** a forecast is **invalid**. Partial mirrors (e.g. only `variant` × `size`) are invalid.

#### Token / efficiency forecast (mandatory in strategy packet)

Fill before AskQuestion. Use qualitative **Low | Med | High** — do not invent token counts. Optional: `node converters/figma/scripts/estimate-apply-cost.mjs --axes … --states … --samples …`.

| Field | What to cover |
|-------|----------------|
| **Grid / volume** | Product of VARIANT axes × `state` values; **High** if ≥ ~24 cells or large sample/name catalogs |
| **Payload risk** | Large SVG/CSS/token dumps through chat; bulky MCP `code` (mitigation: Node prep, e.g. `build-iconglyph-apply.mjs`) |
| **Loop risk** | Task subagents for sequential writes; multi-pass recreate; screenshot-per-cell (mitigation: parent apply, one master template, 1–2 captures + compact audit) |
| **Dependency / redo risk** | Unsynced deps or unclear axes → FAIL→rebuild (mitigation: finish blockers / lock axes first) |
| **Proposed approach** | One-pass plan; prep scripts; capture = URL + `curl.exe` only; inspect budget (what `use_figma` returns) |
| **Optional trim** | Explicit AskQuestion choices to cut cost (fewer `state` values, curated vs full set) — never silent skips |

## Execute mode

### Step 0 — Gates

1. **MCP gate:** confirm `user-Figma` is available; else stop and tell the user to enable Figma MCP.
2. **Account gate:** all `create_new_file` calls MUST use the Deltek org `planKey` from `external.config.json` (`organization::1303904496611212311`). Call `whoami` if unsure. **Refuse** to create production library files under the personal starter team. Wrong-plan mistakes only happen at file-creation time; `use_figma`/screenshots/Code Connect use whichever `fileKey` is bound.
3. **File binding:** resolve the `fileKey` for the requested product. If unknown, **AskQuestion**: create a new file (via `create_new_file` with org `planKey` + naming convention) or supply an existing file URL/`fileKey` the org can access. Persist the `fileKey` into `external.config.json`.
4. **Version gate (version-bump):** when starting a new reference version, run the version-bump flow below before per-element work.

### Step 1 — File bootstrap + foundation (canonical VP first)

Author the **VP** file, then derive the others (see Step 4).

1. **Pages (hard gate)** — match the demo UI: **one Figma page per nav leaf** from [`src/data/navigation.ts`](../../../src/data/navigation.ts), named `Section / Title`, same order. Plus `Coversheet` first and `_internal` last. **Refuse** section-bucket pages (`Foundation`, `Shell Layout`, `Components` alone).
2. **Page anatomy (hard)** — every leaf page gets a `Page chrome` frame with `Page title`, `Page status` (from conversion state for that page's elements), and `Page content` (where components / samples live). See [`plans/file-and-state-structure.md`](plans/file-and-state-structure.md).
3. **Validate before continuing** — dump pages via `use_figma`, then run:
   ```bash
   node converters/figma/scripts/validate-figma-pages.mjs --pages <dump.json>
   ```
   Exit non-zero → **stop**; fix pages/chrome before foundation or element apply. Do not mark bootstrap complete until this passes.
4. **State:** write `harmony`/`conversionState` (schema v2) and render the coversheet **and** each leaf `Page status` from it.
5. **Foundation:**
   - Colors → Figma variables in a `Color` collection with **light + dark modes only** (product baked); names match reference token names.
   - Field density/geometry (`--field-*`) → `Density` collection variables (VP standard values).
   - Spacing → `Spacing`; elevation → effect styles / elevation tokens; typography → text styles (`Typography`) using the **reference font stack with safe fallbacks** — do not embed proprietary brand fonts.
   - Each file's variable collections mirror exactly its product's flattened `:root`/`.dark` from shadcn [`globals.css`](../../../conversions/harmony-design-system-shadcn/packages/ui/src/styles/globals.css) / reference tokens.
   - **Foundation demos (hard for Colors / Typography / Spacing / Elevations):** those pages have no UI components — put a **visual demo of the variables/styles** inside `Page content`, modeled on the reference foundation pages (`src/pages/foundation/*.astro`) but **demo-first** (swatches, type specimens, spacing bars, elevation cards). Minimal labels (token name); no long usage essays or code blocks. Bind fills/sizes/effects to the live variables/styles so Light/Dark mode switching updates the demo.
6. **Brand identity (baked):** set the product `name` and `logo` (from [`product-meta.json`](../../../conversions/harmony-design-system-shadcn/packages/ui/src/data/product-meta.json)) on brand nodes (ShellHeader) inside that page's `Page content`. Logo is a baked image fill, never a mode.
7. **Icon set (shared Icons library + product wrapper):**
   - **Icons library** — one shared Figma file (`external.config.json` → `iconsLibrary.fileKey`). Individual components; **component name = shadcn `Icon` `name` string** (e.g. `plus`, `gantt-chart`). See **Glyph authoring (hard)** and **Icons-library apply pipeline** below.
   - **Public `Icon`** (per product file) — VARIANT `size` (xs–xl) + INSTANCE_SWAP `name` → Icons-library components; width/height bound to `icon/*` FLOAT variables (lock aspect ratio).
   - Component icon slots INSTANCE_SWAP to **public `Icon`** (not raw glyphs). Samples on `Components / Icons` → `Page content`.
   - **Legacy `IconGlyph`** (product-file VARIANT set) is **deprecated** — do not author new glyphs there.

### Glyph authoring (hard)

Canonical structure for each Icons-library component (reference master: `plus`):

```text
COMPONENT <shadcn-name>          // e.g. plus, home, gantt-chart
  └── GROUP "Group"
        └── VECTOR (filled)     // after Outline Stroke — no live stroke
              fills → Color/`text-primary` (bound)
              constraints → SCALE / SCALE
```

| Rule | Detail |
|------|--------|
| **Name = shadcn string** | Component name is the Harmony `Icon` `name` prop identity (kebab / custom names as in shadcn). |
| **Group, not Frame** | Wrap the vector in a **GROUP**. A Frame around the vector does **not** scale correctly when the icon instance is resized. |
| **Scale constraints** | Vector `constraints` = `{ horizontal: 'SCALE', vertical: 'SCALE' }` so art scales with the component. |
| **Outline Stroke → fill** | Figma does **not** scale stroke weight with size (unlike shadcn `currentColor` stroke icons). Convert paths with **Outline Stroke**, then use a **filled** vector with **no** live stroke. |
| **Default color** | Bind fill to Color collection **`text-primary`** (matches shadcn `currentColor` / normal text). Parent components override instance fill when “inheriting” context color. |
| **Update-in-place** | Never delete/recreate published glyph components when fixing art; remediate each component in place. |

**Forbidden:** Frame wrapper around glyph vectors; live stroke as the sole paint; unbound solid fills; MIN/CENTER constraints that prevent scale; product-local `IconGlyph` as the glyph source.

Verifier: Frame wrapper, live stroke, unbound fill, or non-SCALE constraints on a glyph vector = **defect**.

### Icons-library apply pipeline (hard)

Add/update glyphs in the **shared Icons library** via Node prep + parent `use_figma` — not ad-hoc SVG paste and not Task subagents for batch apply. Target `iconsLibrary.fileKey` from [`external.config.json`](../external.config.json).

1. Shell: `node converters/figma/scripts/build-iconglyph-apply.mjs --from custom|curated|file …` (optional `--dry-run` first). Creates/updates **standalone components** named with the shadcn id (not `name=*` variants on a product set).
2. Emits gitignored `.iconglyph-apply-N.js` batches (shared template: import → Outline Stroke → Group + `text-primary` + SCALE → create/update component on the Icons page).
3. Parent agent runs each batch with `use_figma` (**Icons library** `fileKey` + `skillNames: resource:figma-use`). Do **not** `Read` apply files into the parent transcript or restate their contents in the reply.
4. One pass only — forbid a second “replace art” / shared-fallback SVG pass.
5. After publish, refresh product `Icon` `name` INSTANCE_SWAP preferredValues to the published library components.

**Plugin learnings (locked):** Strip SVG `clip-path` / `<defs>` before `createNodeFromSvg`. Oversized brand SVGs (gradients): simplify to monochrome in the build script for the `text-primary` rule. Prefer update-in-place when a component with that name already exists.

### Token-efficient Figma MCP (hard)

Applies to **every** Figma execute/verify session (foundation, shell, components, Icon, Icons library). Icons-library prep is a specialization; these rules are converter-wide defaults.

| Rule | Detail |
|------|--------|
| Prep offline | Prefer Node helpers via Shell for repetitive work (variants, tokens, samples, Icons-library batches). Do **not** paste large SVG/CSS/token dumps into the assistant message |
| No full-file Read | Do not `Read` large generated payloads (e.g. `.iconglyph-apply-*.js`) into the parent transcript; load once for `use_figma` only and do not echo the file in the reply |
| Parent owns writes | Sequential / bulk `use_figma` apply runs in the **parent** agent — do **not** spawn Task subagents for “apply all batches” or sequential remediates |
| figma-use once | `FetchMcpResource` `skill://figma/figma-use/SKILL.md` once per session before the first write |
| One pass | Apply after strategy signoff in one coherent pass; forbid recreate / shared-fallback / “fix art later” double passes |
| Screenshots | `get_screenshot` **without** `enableBase64Response`; save via `curl.exe -L -o …`; forbid `await node.screenshot()` except rare single-node debug |
| Inspect scripts | Keep `use_figma` returns small (counts / ids / defect lists), not full node trees |

### Step 2 — Components (per element)

Figma components are authored to the **shadcn Consumer API** (identity mirror). **Visual + configurability baseline = shadcn** (demo + package docs/source) — designers should be able to look, prototype-act, and configure the Figma component like the shadcn reference. Astro remains the broader Harmony source of truth; do not use Astro preview as the Figma fidelity compare target for components.

- **Component name = shadcn export name** (`Select` not Dropdown, `Calendar` not DatePicker). Page/section labels follow reference nav for discoverability; keep the `nameMap` (reference↔shadcn) in state.
- **Property names + values = shadcn props / cva unions.** VARIANT for enums, BOOLEAN for `disabled`/`loading`/`fullWidth`, TEXT for `loadingText`/`errorMessage`/`href`/`children` label, INSTANCE_SWAP for icons/nested components. Confirm the mapping via the **strategy packet** before the element leaves `not-started`.
- **Consumer API inventory (hard)** — see below. Never build from memory or a partial prop list.
- **HTML / interaction states (hard)** — see below. Pseudo-states (`:hover`, `:focus-visible`, …) are not shadcn props; expose them in Figma via a `state` VARIANT when the component has them.
- **Property wiring (hard)** — see below. Declared props with no `componentPropertyReferences` (or equivalent visual binding) are defects.
- **Hybrid-C split mirrored 1:1:** separate Figma components matching the shadcn exports (`Input` + `InputField`).
- **Variant grid layout (hard)** — see below; confirm axis plan with the user **before** building or rearranging a component set.
- **Token binding (hard)** — see below; applies to every node authored in the file, not only component masters.
- **Update-in-place (hard)** — see below. Never delete/recreate an existing component set when updating.
- **Product-exclusive components** (`FloatingNav`, `KanbanCardCostpoint`, `TableCostpointGrid`) exist **only in the CP file**.

### Consumer API inventory (hard)

Before apply, open the **shadcn** source for that export (`conversions/harmony-design-system-shadcn/packages/ui/src/components/<…>`) **and** its `docs/components/<Name>.md` Props table. Build a complete inventory:

| Source | Capture |
|--------|---------|
| `cva` `variants` keys + unions | Each becomes a Figma **VARIANT** (unless playbook opts it to BOOLEAN for binary UI-only toggles — still must appear in the plan) |
| Props on the component type not in cva (`loading`, `icon`, `loadingText`, …) | BOOLEAN / TEXT / INSTANCE_SWAP as appropriate |
| Compound / contextual props (`buttonType`, `orientation`) | Still in inventory — do not drop because they are uncommon |
| CSS / Tailwind interaction pseudo-classes (`hover:`, `focus-visible:`, `active:`, …) on the component | Candidate **`state` VARIANT** values (see HTML states) — not Consumer API props |
| Native-only / out of Figma scope (`asChild`, `className`, DOM `type`, event handlers) | List as **deferred** with rationale in the plan; do not silently omit |

Present the inventory + proposed Figma type for **every** row, plus the **HTML `state` set** (or explicit “none”), to the user with the axis plan as part of the **strategy packet**. **Refuse to apply** until the user confirms (including deferred and interaction states). Partial mirrors (e.g. only `variant` × `size`) are invalid.

**Figma property names follow shadcn**, not Astro, when they differ. The Figma-only `state` prop is the exception (HTML pseudo-states). Visual compare uses the **shadcn demo** capture, not Astro preview.

### HTML / interaction states (hard)

Many Harmony components change paint on **browser interaction** (`:hover`, `:focus-visible`, `:active`, …). Those are **not** parameters on the shadcn component — they happen automatically in CSS. In Figma, expose them as a VARIANT property named **`state`**:

| Value | Meaning |
|-------|---------|
| `default` | Resting / normal (always present when `state` exists) |
| `hover` | Matches CSS `:hover` / `hover:*` |
| `focus` | Matches `:focus-visible` / `focus-visible:*` (name `focus` in Figma) |
| `active` | Matches `:active` / `active:*` when the plan includes it |
| others | Only if CSS has a distinct look and the user confirms (e.g. `disabled` visual may stay on the `disabled` BOOLEAN instead of `state`) |

**Confirm before build (mandatory):** interaction states multiply the grid and get messy. As part of the component implementation-plan review, propose which `state` values to ship (and which axis they sit on). **Do not invent or apply `state` until the user confirms.** Components with no meaningful hover/focus paint may omit `state` entirely (record “none” in the plan).

**Hover interaction:** for every variant cell that has a `state=default` sibling with `state=hover`, set a prototype reaction on the **default** component: trigger **While Hovering** → action **Change to** the matching `state=hover` variant (same other VARIANT props). Prefer Plugin API `reactions` that match the UI “While Hovering” + “Change to”. Other states (`focus`, `active`) are selectable in the properties panel; add prototype wiring only when the plan calls for it.

**Code Connect:** `state` is Figma-only — do **not** map it into the shadcn React props (omit from the generated snippet / identity map).

**Grid note:** `state` counts as a VARIANT prop for axis rules. Default suggestion to propose (not apply): keep browsing props on X/Y and nest or place `state` where the confirmed plan says — often a third axis / nested group so designers can still read `variant` × `size` at a glance.

### Property wiring (hard)

`addComponentProperty` alone does nothing. Before `review`:

| Figma type | Must wire |
|------------|-----------|
| TEXT | `componentPropertyReferences.characters` on the label text node |
| BOOLEAN | `componentPropertyReferences.visible` (and/or opacity layers) so the toggle changes the instance — e.g. `loading` shows spinner / hides default content; `disabled` shows disabled paint or dims content |
| INSTANCE_SWAP | `componentPropertyReferences.mainComponent` on the icon/slot instance |
| VARIANT | Encoded in child names; every combination that ships must exist |

**Unused prop = defect.** If a BOOLEAN cannot express the visual (e.g. `fullWidth` needs stretch behavior), either (a) add VARIANT values the grid/plan accounts for, or (b) mark **deferred** in the confirmed inventory with rationale — do not leave a dead BOOLEAN on the set.

After apply, re-read `componentPropertyDefinitions` and walk `componentPropertyReferences` on children; every non-deferred prop key must appear in at least one reference (VARIANT props via child names).

### Variant grid layout (hard)

Component sets must be readable as a **property grid**, not a wrapped auto-layout row. VARIANT properties map to axes; BOOLEAN / TEXT / INSTANCE_SWAP stay as component properties (do **not** explode the grid).

**Confirm before build:** for every new or rearranged component set, **AskQuestion** (or explicit chat confirmation) on (1) the Consumer API inventory, (2) the **HTML `state` values** (or none), and (3) the axis plan — which VARIANT props go on X vs Y, option order, and any hierarchy nesting — **before** `combineAsVariants` / repositioning. Do not invent a grid and ship it.

#### Axis assignment

| # of VARIANT props | Layout |
|--------------------|--------|
| 1 | **X only** (single row). Leave Y unused. |
| 2 | **One prop per axis** — prefer **X first** (primary browsing prop on columns), second prop on **Y** (rows). |
| 3+ | Still prefer one prop per axis; only then **nest** multiple props on one axis as a hierarchy. Prefer nesting on **X** before nesting on **Y**. Never nest when ≤2 VARIANT props. |

Hierarchy on an axis = treat options as grouped blocks (outer prop changes slower / larger stride; inner prop steps cell-by-cell). Example with 3 props `tone × size × state`: X = `tone › size`, Y = `state`.

#### Positioning (Plugin API)

After `combineAsVariants`, children stack at `(0,0)` — **must** place them on the confirmed grid:

1. Set the component set `layoutMode` to **`NONE`** (absolute positions). Do **not** leave HORIZONTAL/VERTICAL auto-layout on the set — it wraps unpredictably and fights the grid.
2. Parse each child’s `prop=value` name; map to column/row (and nested stride if hierarchical).
3. Space cells with consistent gaps; then `resizeWithoutConstraints` so the set bounds hug the grid + padding.
4. Restore Figma’s default **dashed purple component-set stroke** (UI-equivalent chrome). Plugin-built sets often lose it — re-apply after layout:

```js
componentSet.strokes = [{ type: 'SOLID', color: { r: 0.59, g: 0.278, b: 1 } }]; // ≈ #9747FF
componentSet.dashPattern = [10, 5];
componentSet.strokeWeight = 1;
componentSet.strokeAlign = 'INSIDE';
```

Do not remove that stroke when editing sets. Verifier: missing dashed purple set outline = defect (chrome), not a visual-fidelity miss vs reference.

#### Suggested default (override only with user confirmation)

When the user has not specified axes yet, **propose** (do not apply): primary semantic prop (e.g. `variant` / `tone`) → **X**; secondary scale prop (e.g. `size`) → **Y**; further props nested on X.

### Token binding (hard)

The file is the design-system source of truth for how tokens are used. **Every painted node** inside a product file (coversheet, page chrome, foundation demos, `_internal` masters, and `Page content` samples) MUST bind to local variables / styles — never raw hex, free font picks, or ad-hoc drop shadows.

| Paint | Bind to | Forbidden |
|-------|---------|-----------|
| Fills / strokes / text color | `Color` collection variables | Hardcoded RGB/HEX (or unbound solid fills) |
| Font family / size / weight / line-height / letter-spacing | Local `Typography/…` text styles | Manual font settings not attached to a text style |
| Shadows / elevation | Local `Elevation/shadow-*` (or equivalent) **effect styles** | Inline effect arrays with raw color/blur/offset |

**Exceptions (only):**
- Baked brand `logo` **image** fill (variable modes cannot hold images). Prefer binding vector mark fills to `primary` / `primary-foreground` when the artwork is semantic brand chrome.
- Nodes with no paint (empty fill / no effects) used purely for layout.

**Component type ramps:** when size variants need font sizes outside the foundation ramp, add named text styles under `Typography/<Component>/…` (e.g. `Typography/Button/xs|sm|md|lg`) and apply those — do not leave manual font sizes on masters.

**Apply / remediate rule:** before marking an element `review`, confirm new and touched nodes are bound. If a needed token does not exist yet, add it to the foundation collections/styles first — do not hardcode a stand-in. Light/Dark must update appearance via variable modes, not by duplicating unbound paints.

**Component paint fidelity:** bind fills/strokes/text to the **same token the shadcn classes resolve to**, not a “close enough” foundation swatch. Example: `dela` → `--gradient-dela` / `--dela-header-content-fg` (Dela fill style + `dela-foreground` variable), not `primary`. `secondary` / `tertiary` text and strokes → `--theme-btn-*` (add those Color variables if missing). If the CSS uses a gradient, create a local paint/fill style for it — solid `primary` is a defect.

### Update-in-place (hard)

When an element already has a component set / master in the file (or `elements.<Key>.nodeId` is set):

| Rule | Detail |
|------|--------|
| **Resolve first** | Read `nodeId` from host state; edit **that** COMPONENT / COMPONENT_SET. |
| **Forbidden** | Delete the set and recreate under a new id. That breaks instances in other Figma files and Code Connect / publish keys. |
| **Allowed** | Add/remove variant children, add/rename/remove properties, rebind paints, reposition the grid, update samples — all on the **same** set node. |
| **New element only** | Create a new component set only when `nodeId` is null / no existing set. |
| **After structural edits** | Publish status regresses → return element to `needs-publish`; human must re-publish before Code Connect rewrite. |
| **Major redo** | Reset status to `not-started`, clear deferred/false-complete notes, **keep `nodeId`**, then strategy → in-place rebuild. Do not treat redo as permission to recreate. |

Verifier: if an update was requested and the set’s `nodeId` / publish key changed because the master was recreated → **defect**.

### Step 3 — Per-element lifecycle (HITL)

Contract: **dep gate → strategy signoff (incl. Token forecast) → implementor ↔ verifier until PASS → human review (incl. Token retrospective) → publish → Code Connect → synced**.

**Efficiency defaults (every element):**

- Parent owns sequential `use_figma` writes — no Task for batch apply/remediate loops.
- Screenshots: URL + `curl.exe` only (no `enableBase64Response`).
- Compact inspect returns; one-pass apply after strategy signoff.
- Prefer Node prep when work is repetitive (variant grids, foundation tokens, Icons-library glyphs, sample grids).

1. **Dep gate** — re-run the hard-dependency gate (same as plan). Plan approval is not permission to skip deps. If blocked, stop and redirect.
2. **Strategy signoff** — user has confirmed the strategy packet (inventory + `state` + axes + deferred + tokens + **Token / efficiency forecast**). Only then mark element `in-progress` in state; sync that page's `Page status` text. **Refuse apply** if forecast was missing from the signed packet.
3. **Apply (implementor)** — via `use_figma`, **update-in-place** when `nodeId` exists. Place/update samples **inside the page's `Page content`**. **Hard:** before adding real content, **remove every `Placeholder` / `Placeholder — *` node** on that page. Real content **replaces** the placeholder; never leave both. Unimplemented pages may keep a single `Placeholder` inside `Page content` only. Follow **Token-efficient Figma MCP**.
4. **Verify (figma-verifier)** — invoke ([VERIFICATION.md](VERIFICATION.md) / [VERIFIER.md](VERIFIER.md)). Compare against **shadcn demo** reference PNG. **Publish-ready is part of PASS:** no unused component properties; every declared non-deferred prop is wired.
5. **Implementor ↔ verifier loop** — on FAIL, remediate **in place**, re-verify. Repeat until verifier **PASS**. Do **not** mark `review`, `needs-publish`, or `synced` while FAIL. Do **not** ask the human to accept FAIL as “good enough” to skip the loop (defer/accept only for documented technology limits with explicit rationale).
6. On verifier PASS → mark `review`; sync `Page status` + coversheet. **Hand to human** for visual tweak. Handoff **must** include: side-by-side visual summary + **Token retrospective** (see below). A PASS→`review` handoff without the retrospective is **incomplete**.
7. When ready for the human to publish (PASS held, wiring clean) → mark `needs-publish`; sync `Page status` + coversheet. **Stop** until the human publishes.
8. After human publish (`getPublishStatusAsync() === 'CURRENT'`) → **Code Connect step** (see below).
9. Human sign-off (**AskQuestion**) after Code Connect → mark `synced`; sync `Page status` + coversheet.

#### Token retrospective (mandatory at PASS → `review`)

Filled by the **orchestrator / implementor** when promoting to `review` (not by the readonly verifier inventing costs). Append to the verification report and the human-facing handoff. **No fabricated token counts** — qualitative evidence only (batch counts, iteration count, Task used Y/N, re-apply Y/N, capture method).

| Field | Purpose |
|-------|---------|
| **Forecast vs actual** | What was predicted Low/Med/High; what actually burned effort |
| **Inefficient moments** | e.g. Task retry, base64 screenshot, double pass, oversized inspect, mid-apply strategy change |
| **Kept efficient** | Prep script used, one-pass, curl capture, compact audit |
| **Follow-ups** | 1–3 playbook/script tweaks for the next element |

**Refuse Code Connect** while status is `in-progress`, `review`, or `needs-publish`, or while unused props / unwired declarations remain. Verify + remediate must finish before any publish/Code Connect attempt.

**Never** mark `synced` while open fidelity defects remain (no TEST-RUN exception for catalog work).

### Step 4 — Derive the other product files

Once VP is proven for a scope, follow [`plans/derive-product-files.md`](plans/derive-product-files.md).

**Hard gate:** Figma MCP / Plugin API / REST **cannot duplicate files**. The human must **Duplicate** the VP file in Figma (three copies), rename them to the library names below, and return the URLs/`fileKey`s. Then the agent binds keys and applies brand/hue (and CP superset) swaps.

- **VP → PPM / Maconomy:** duplicate VP → swap brand (`name`/`logo`) and light-mode primary hue only.
- **VP → CP:** duplicate VP → swap brand + apply compact `--field-*` density; add CP-only components/variables when those elements convert.

### Dependency order (hard — host state)

Same rules as [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Hard dependencies, with status read/written in **Figma** `harmony`/`conversionState`:

| Rule | Detail |
|------|--------|
| **Inventory** | From shadcn source imports + docs examples + foundation tokens the paints use |
| **Complete means complete** | Dep must be `synced`. For `Icon`, that means the **curated set published in the shared Icons library** + product public `Icon` wired (`size` + `name` INSTANCE_SWAP) as documented in `plans/Icon.md` — not every Heroicon in the Astro gallery (code still resolves the full set) |
| **Plan / execute gate** | Before strategy AskQuestion or apply: if any required dep is not `synced` → **Blocked**; do not write dependent plan; AskQuestion only which blocker to plan next |
| **`blockedBy`** | Record `elements.<Key>.blockedBy: [<ElementKey>, …]` in host state while blocked / in-progress waiting on deps |
| **Forbidden** | Partial convert of dependent, skip/defer dep, “do some of X now” |
| **Circular exception only** | When A↔B is genuine: partial work on both while `in-progress`; **neither** `synced` until the cycle is complete and verified |
| **Foundation** | `Colors`, `Typography`, `Spacing`, `Elevations` (and component-needed token expansions such as Dela / `--theme-btn-*`) must be `synced` before components that use them |

### Version-bump flow

1. Resolve the product binding (single file).
2. **Superset re-check:** re-read shadcn `PRODUCT_EXCLUSIVE` in [`scripts/build-product.mjs`](../../../conversions/harmony-design-system-shadcn/packages/ui/scripts/build-product.mjs) + per-product token blocks for the new version. Update the VP canonical first, re-derive PPM/Maconomy (swap brand/hue), then re-derive CP (re-apply superset). Files are never split/merged — only their contents adjust.
3. Write the new `referenceVersion` into state.
4. Reset all element statuses to `not-started`; refresh the coversheet.
5. Only then allow per-element conversion.

## Code Connect (to shadcn per-product packages)

Runs per element only after verify PASS, `needs-publish`, and a successful human library publish — **not** before. See [`plans/code-connect.md`](plans/code-connect.md).

**Gates (all required):**
1. **Verify / remediate gate:** element has passed verifier publish-ready checks (no unused props, declared props wired). Status is `needs-publish` or the human has just published after that status. Do **not** author Code Connect from a half-built or orphan-prop component.
2. **shadcn-synced gate:** the element's shadcn counterpart must be `synced` in [`conversions/harmony-design-system-shadcn/conversion.manifest.json`](../../../conversions/harmony-design-system-shadcn/conversion.manifest.json). If not, block Code Connect (visual Figma sync may still proceed) and tell the user which shadcn component to convert first.
3. **Publish gate (manual human step):** the Figma library for the product file must be **published** (Assets panel), and each component must show Plugin API `getPublishStatusAsync() === 'CURRENT'` (not `UNPUBLISHED`). Edits after publish (layout, props, paints) put the component back to unpublished — return status to `needs-publish` and **re-publish before Code Connect write**. The Plugin API **cannot** publish. `list_file_components_for_code_connect` / suggestions may still list nodes with keys; always verify `getPublishStatusAsync` before `add_code_connect_map`.

**Authoring (MCP parserless, primary):**
1. Identify the shadcn export (the Figma component is already named for it).
2. `get_context_for_code_connect` on the node + read the shadcn component's exported prop unions / `docs/components/<Name>.md`.
3. Author a parserless template (mostly identity maps since Figma props mirror shadcn); `example` imports from the file's own product package `…-<product>/components`. Write with `add_code_connect_map` / `send_code_connect_mappings`. (Optional committed `.figma.ts` mirror is off by default — see `codeConnect.committedMirror`.)
4. Add **custom instructions** for Make: install `@dltkrichardhuska/harmony-design-system-shadcn-<product>` for this file's product, `import '.../styles/globals.css'` (Tailwind v4 — no preset/config/content globs), wrap in a **mode-only** `HarmonyThemeProvider` (`defaultMode` only), use `Icon` name strings.
5. Verify via `get_code_connect_map`. Record `codeConnectStatus` in the node registry.

**Maintenance (reverse dependency):** the shadcn converter flags a mapping **stale** on Consumer-API delta or version bump; the figma converter re-authors/republishes and clears the flag.

## Implementation readiness

**Overall level:** `ready` (tooling) — plan / apply / verify-capture / Code Connect / derive proven across four product files. Catalog fidelity (Icon full set, Button redo vs shadcn, Dela, remaining components) is conversion work under the hardened lifecycle — not a readiness blocker.

### Capability matrix

| Scope | Plan | Execute apply | Verify (capture) | Remediate | Code Connect |
|-------|------|---------------|------------------|-----------|--------------|
| foundation | yes | proven (VP) | proven (`get_screenshot`) | yes (via `use_figma`) | n/a |
| shell | yes | partial (brand baked) | proven | yes | pending per element |
| components | yes | proven (in-place update) | proven (shadcn demo + Figma screenshot) | yes (implementor↔verifier until PASS) | proven path (publish gate) |

Live build: VP + derived PPM/Maconomy/CP. Capture: `scripts/capture-shadcn-reference.mjs` (reference) + `scripts/resolve-capture-target.mjs` (converted).

### Gaps (catalog / fidelity — not converter-tooling blockers)

1. **Full icon set** — expand `Icon` from seed to full catalog before dependents (e.g. Button) leave the dep gate.
2. **Button redo** — reset to `not-started`; full Consumer API + shadcn visual parity via strategy → implement/verify loop (see `plans/Button.md`).
3. **Dela** foundation page + remaining component catalog.
4. **CP-only** vars/components when those elements convert.

### MCP

- **user-Figma** required for execute + verify + Code Connect.

### Safe to use now

- `/conversion-agent readiness`, `status`, `plan`, `execute`, `verify-only` for documented scopes. Confirm product + scope with the user before execute. Enforce dep gate → strategy signoff → implementor↔verifier until PASS → human → publish. Never mark `synced` with open fidelity defects.
