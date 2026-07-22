# Conversion plan — Icon (Figma VP)

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Icon` |
| status | `approved` |
| createdAt | `2026-07-22T02:20:00.000Z` |
| updatedAt | `2026-07-22T23:00:00.000Z` |
| product | `vp` |
| referenceVersion | `0.9.0` |

## Summary

Icon mirrors the shadcn Consumer API for Code Connect **and** has samples on `Components / Icons`. Structure = **shared Icons library** (glyph components) + **product public `Icon`** (`size` VARIANT + `name` INSTANCE_SWAP). Outline only (no solid). Sequencing: Icon → Dela → Button.

**Supersedes Option C hybrid** (product-local `IconGlyph` VARIANT set). Glyphs now live in [`iconsLibrary`](../../external.config.json) (`wGxEhlZyk9kQqshrD3aQYu`); legacy `IconGlyph` is deprecated.

## Blocking dependencies

| Element | blockedBy | Action |
|---------|-----------|--------|
| — | — | Colors / Typography / Spacing / Elevations `synced` |

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| Icon | `figma-component` | Shared library glyphs + product wrapper; update-in-place; outline only |

## Figma strategy packet

### Consumer API → Figma

| shadcn prop | Figma | Notes |
|-------------|-------|-------|
| `name` | INSTANCE_SWAP on **public Icon** → Icons-library component | Swapped component **name** = shadcn string (e.g. `plus`) |
| `size` | VARIANT on **public Icon**: xs \| sm \| md \| lg \| xl | Code Connect `getEnum('size')` |
| (geometry) | FLOAT vars `icon/xs`…`icon/xl` bound to width/height | Lock aspect ratio; values 12/16/20/24/32 (`--icon-*`) |
| `variant` | **omit** | Outline only |
| `className` / `product` | deferred | |
| HTML `state` | **none** | |

### Structure (shared library — current)

1. **Icons library** (`external.config.json` → `iconsLibrary.fileKey`): individual components named exactly like Harmony shadcn `Icon` `name` values. **Art rules (hard)** — reference master `plus`:
   - GROUP wraps vector (not Frame)
   - Vector constraints SCALE / SCALE
   - Outline Stroke → **filled** path (no live stroke)
   - Fill bound to Color **`text-primary`**
2. **Public `Icon` component set** (VP `44:28`): VARIANT `size` only (5 cells). Each size cell: INSTANCE_SWAP `name` → Icons-library glyph; frame W/H bound to matching `icon/*` FLOAT variable; aspect ratio locked.
3. **Code Connect** on public `Icon`: `getInstanceSwap('name').name` + `getEnum('size')` → `<Icon name="…" size="…" />`. Template rewrite required if mapping has `hasTemplate: false`.
4. Consumers / Button `icon` slots INSTANCE_SWAP to **public Icon**. For string `icon` props, CC extracts nested glyph **name** (not nested JSX).

### Axis / layout

| Set | Axis |
|-----|------|
| Icons library | N/A (standalone components, not a VARIANT grid) |
| Public Icon (`size`) | X = `size` (single row) |

### Page samples (hard)

- Demo: size row + name grid using **public Icon** instances (outline only).
- Glyph masters remain in the **Icons library** file (not product `_internal`).

### Update-in-place

- Keep public Icon set id `44:28` when updating.
- Never delete/recreate published Icons-library components when fixing art.
- Structural edits → `needs-publish` before Code Connect rewrite.
- Do **not** expand legacy `IconGlyph` (`4:26`) — deprecated.

## Code Connect template (locked)

See [`code-connect.md`](code-connect.md) § Icon. Make instructions: [`figma-make.md`](figma-make.md).

## Sequencing

1. Icons-library curated glyphs published  
2. Product Icon wired + samples → verify → `review` → publish → Code Connect → `synced`  
3. Dela → synced  
4. Button (blockedBy Icon, Dela)

## Approval / history

**Status: approved** — Option C + outline-only (2026-07-22). Later same day: **shared Icons library** scheme adopted; converter playbook updated.

**VP review accepted (2026-07-22)** — human confirmed Icon reviewed → `needs-publish`.

**VP synced (2026-07-22)** — library published; Code Connect on `44:28` (template may need rewrite for `name` INSTANCE_SWAP → string).

## Post-apply remediations (historical — Option C era)

- **2026-07-22 IconGlyph scale/color:** glyphs remediated to Group + Outline Stroke fill + `text-primary` + SCALE/SCALE. Verifier PASS [`Icon-2.md`](../../verification/reports/Icon-2.md).
- **2026-07-22 Custom Icons expansion:** custom names added to then-`IconGlyph` `4:26`. Verifier PASS [`Icon-3.md`](../../verification/reports/Icon-3.md).

### Learnings

Codified in playbook **Glyph authoring**, **Icons-library apply pipeline**, converter-wide **Token-efficient Figma MCP**, **Token / efficiency forecast**, and **Token retrospective** — see `SKILL.md`. Use `build-iconglyph-apply.mjs` / `estimate-apply-cost.mjs` for Icons-library glyph work (target `iconsLibrary.fileKey`).
