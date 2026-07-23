# Conversion elements

All conversions track elements from the Astro reference. **Discovery is from source** — no generated inventory JSON.

## Reference discovery (agents)

| Need | Read |
|------|------|
| Exported components | [`src/data/component-catalog.ts`](../../../../src/data/component-catalog.ts) |
| Doc site routes | [`src/data/navigation.ts`](../../../../src/data/navigation.ts) |
| Component source | `src/components/ui/<Name>.astro` |
| Doc examples | `src/pages/components/`, `src/pages/shell/`, `src/pages/foundation/` |
| Verify evidence | Live docs (`:4321`) + conversion demo; optional scripts under `.cursor/skills/conversion-verify/scripts/` |

On status/plan sweeps, seed missing keys in `conversion.manifest.json` from the catalog.

## Element groups

### Foundation

One manifest element per Foundation nav page (equal coverage weight). Shared token implementation may be reused across pages; **status is per page**.

| Key | Reference page | Demo route |
|-----|----------------|------------|
| `Colors` | `src/pages/foundation/colors.astro` | `/foundation/colors` |
| `Typography` | `src/pages/foundation/typography.astro` | `/foundation/typography` |
| `Spacing` | `src/pages/foundation/spacing.astro` | `/foundation/spacing` |
| `Elevations` | `src/pages/foundation/elevations.astro` | `/foundation/elevations` |
| `Dela` | `src/pages/foundation/dela.astro` | `/foundation/dela` |

Token sources (`src/tokens/`, `src/styles/tokens.css`, `src/styles/global.css`) inform implementation notes; they do not collapse status into a single `foundation` key.

Plan/verify scope `foundation` = all five keys. Component hard-deps require `Colors`, `Typography`, `Spacing`, and `Elevations` synced (not `Dela`).

### Shell

Application shell layout and subcomponents (see catalog `shellSubcomponents`, `layouts`).

| Reference paths |
|-----------------|
| `src/layouts/ShellLayout.astro` |
| Shell UI in `src/components/ui/` |

Target: `src/layouts/` + related components.

### Components

Exported UI components (see `EXPORTED_UI_COMPONENT_COUNT` in catalog).

| Reference path |
|----------------|
| `src/components/ui/` |

Target: `src/components/` and/or theme-only consumption per converter playbook.

## Conversion state

For **component-library** converters, all per-element status, strategy, and gaps live in **`conversions/<id>/conversion.manifest.json`** under `elements` — one file, no separate mappings registry.

**External converters (exception).** External targets (e.g. `figma`) have **no** `conversions/<id>/` folder, so per-element sync state lives **in the external host**, not in a `conversion.manifest.json`. For the Figma converter, state is stored in the bound Figma file via shared plugin data (`harmony`/`conversionState`) plus a human-readable coversheet page; the repo holds only product→`fileKey` bindings in `converters/figma/external.config.json`. See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md) and the figma playbook.

**Hard-dependency checks** for external targets read dependency status from that **host state** (and write `blockedBy` there). Do not look for a repo `conversion.manifest.json` for figma.

## Status values

| Status | Meaning |
|--------|---------|
| `not-started` | Not yet converted |
| `in-progress` | Work underway |
| `review` | Verifier PASS (including publish-ready checks for host libraries); awaiting human visual tweaks / acceptance of the verify result |
| `needs-publish` | **External / Figma:** verify passed; component is publishable (no unused props, declared props wired); waiting for a human to publish the library. Code Connect must not run yet |
| `synced` | Matches reference for this element (human signed off). For Figma: also means Code Connect is written after publish |
| `gap` | Known intentional difference (document in `notes`) |

Coverage counts only `synced` (+ accepted `gap`). `review` and `needs-publish` are not yet complete.

**Figma / external library targets** use: `not-started → in-progress → review → needs-publish → synced` (+ `gap`). After publish, the converter runs Code Connect, then human sign-off moves the element to `synced`.

## Conversion direction

Reference Astro repo → target only. Do not edit the reference from a conversion implementation.

## Demo site (component-library)

**Converter agents** recreate the reference demo site in `conversions/<id>/`. **External** converters do not — preview is host-defined.

**Order:** bootstrap the full demo site **first** (all routes from reference nav), with **placeholders** for every scope not yet converted. Replace placeholders with real demos in `src/demo/converted/` as elements sync.

Routes mirror reference doc paths (`/foundation/*`, `/shell/*`, `/components/*`). Discovery: `src/data/navigation.ts` + `src/data/component-catalog.ts` — no demo route registry.

See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).
