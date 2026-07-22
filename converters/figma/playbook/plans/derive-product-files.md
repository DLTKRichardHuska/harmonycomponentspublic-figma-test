# Derive product files from VP canonical

MCP / Plugin API / REST **cannot duplicate a Figma file**. Derive is a **human duplicate** + **agent brand/hue (and CP superset) swap**.

## Human step (required)

From [Harmony Design System (VP)](https://www.figma.com/design/qPVWATAnhiYb6eboWa9LoD):

1. Open the file → file menu → **Duplicate** (or append `/duplicate` to the file URL with no `node-id`).
2. Rename each copy exactly:
   - `Harmony Design System (PPM)`
   - `Harmony Design System (Maconomy)`
   - `Harmony Design System (CP)`
3. Paste the three file URLs (or `fileKey`s) back to the agent.

Do **not** create blank files with `create_new_file` for derive — that loses pages, variables, components, and state.

## Agent step — PPM / Maconomy (after bind)

For each derived file:

1. Persist `fileKey` in [`external.config.json`](../../external.config.json).
2. Via `use_figma`, update shared plugin data `harmony`/`conversionState`:
   - `product`, `role: "derived"`, `derivedFrom: "vp"`
   - `brand.name` from [`product-meta.json`](../../../../conversions/harmony-design-system-shadcn/packages/ui/src/data/product-meta.json)
   - `codeConnect.package` → `@dltkrichardhuska/harmony-design-system-shadcn-<product>`
3. Swap **light-mode** Color collection values for the product primary family (see table). Dark mode primaries match VP today (`#59ACFF`) — leave unless tokens diverge.
4. Update Shell Header brand text (`Vantagepoint` → product display name) and re-bake logo image fill from that product’s SVG in `product-meta.json` when present.
5. Refresh coversheet title / product identity text if present.
6. Spot-check Colors + Shell Header screenshots vs VP (brand/hue only).

### Light primary hues (from shadcn `tokens.css`)

| Product | `--theme-primary` (light) | `--theme-primary-hover` (light) | Notes |
|---------|---------------------------|----------------------------------|--------|
| `vp` | `#2A78C6` | `#2268B0` | Canonical — no swap |
| `ppm` | `#4C92D9` | derive hover from token block | Brand swap + primary |
| `maconomy` | `#4C92D9` | same family as ppm today | Brand swap + primary |
| `cp` | `#2A78C6` | `#2268B0` | Same primary as VP; brand + **superset** |

Convert hex → Figma RGB 0–1 when calling `variable.setValueForMode`.

Also update related light vars when they exist locally: `primary-hover`, and any `primary-light` / `primary-border` alphas derived from primary.

## Agent step — CP (after bind)

1. Same state + brand bake as above (`role: "superset"`).
2. Set Density / `--field-*` variables to **CP compact** values from the CP token block (not VP standard).
3. Add CP-only variable families when converting those surfaces (`--floating-nav-*`, `--cp-sidebar-*`, `--cp-datagrid-*`, kanban chrome) — can defer until those elements are converted.
4. Do **not** remove shared components; CP-only components (`FloatingNav`, `KanbanCardCostpoint`, `TableCostpointGrid`) are authored **only** in the CP file when those elements are converted.

## Code Connect after derive

Derived files do **not** inherit Code Connect mappings. After human publish of each library, re-author mappings with the product’s package import (`…-ppm` / `…-maconomy` / `…-cp`). Until then, leave `codeConnectStatus` as copied from VP or reset to `none` and re-run the publish → CC loop per element.

## Checklist

- [ ] Human duplicated VP → three named files; URLs provided
- [ ] `external.config.json` bindings filled
- [ ] State identity + package updated per file
- [ ] Light primary (PPM/Maconomy) + brand name/logo swapped
- [ ] CP density (and later superset vars/components)
- [ ] Spot-check screenshots
- [ ] Publish + Code Connect per product (later)
