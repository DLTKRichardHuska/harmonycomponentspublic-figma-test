# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Button` |
| product | `vp` |
| iteration | `3` |
| artifactType | `image` |
| generatedAt | `2026-07-22T21:10:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| plan | `converters/figma/playbook/plans/Button.md` (approved) |
| host | file `qPVWATAnhiYb6eboWa9LoD`, nodeId `6:2` (update-in-place held) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 14 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 15 |

**Result:** PASS

> **PASS: zero conversion defects.** Iteration-2 open defects (DEF-001–008) remediated. Dela paint style, Stars, focus-ring Elevation styles, Color-bound disabled overlay, fullWidth spacer wiring, absolute loading cover, extra-cell hover reactions, and prop rewire all hold on node `6:2`. Host may move Button to `review`.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `converters/figma/verification/artifacts/reference-Button.png` (shadcn `/components/buttons`, VP — docs chrome + Examples intro) |
| converted | `converters/figma/verification/artifacts/vp-Button.png` (Figma MCP set `6:2` — fresh after remediate) |
| plan | `converters/figma/playbook/plans/Button.md` |
| prior report | `converters/figma/verification/reports/Button-2.md` |
| audit | readonly `use_figma` on `6:2` (props, paints, effects, reactions, wiring) |

## Content parity

| Reference / plan item | Status | Notes |
|-----------------------|--------|-------|
| 8 variants (primary…dela-pill) | present | All 8 on Y axis |
| Size ladder xs–lg | present | X nested with state |
| HTML `state` default/hover/focus | present | Core focus/hover/default grid |
| Theme vs pageHeader samples | present | pageHeader extras present |
| Icon + label / iconPosition | present | Vertical + iconPosition=right extras |
| Disabled / loading layers | present | Overlay Color-bound; loading ABSOLUTE cover |
| Dela Stars graphic | present | `withStars=24/24` dela cells |
| Docs Props table (non-deferred) | present | Props defined + wired on core and extras |
| Deferred: asChild, className, DOM type, handlers, href | deferred | Per approved plan |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Primary (VP theme) | Solid primary blue fill, white label | Primary fill + primary-foreground label; size ladder readable | present |
| Secondary / tertiary | Elevated fill + primary stroke / transparent + tertiary fg | `elevated-bg` + theme secondary/tertiary tokens | present |
| Outline / ghost | Border / text-only | Border stroke / transparent ghost | present |
| Destructive | Error red fill, white label | Bound `error` fills | present |
| Dela / dela-pill | Purple→blue gradient, white label, Stars, sm/pill radius | `Dela/gradient` style + Stars on all dela cells; pill radius on dela-pill | present |
| Hover paints | Darker / token hover fills | Hover cells + ON_HOVER on all 37 defaults (incl. extras) | present |
| Focus | Outline + focus-ring shadow | All 32 focus cells: stroke + Elevation focus-ring (primary / error on destructive) | present |
| Loading | Spinner replaces label/content | ABSOLUTE loading cover, opaque bound fill, visible↔loading on 101 cells | present |
| Disabled | Disabled paints / overlay | Overlay Color-bound on all 106 cells | present |
| Vertical / icon right | Icon stacked / trailing | Extras present; props wired | present |
| fullWidth | Full-width stretch in demo | `fullWidthSpacer` visible↔`fullWidth` (101 wired); wider cells visible in set | present |

**Visual gaps (open):** 0

## Token binding

| Check | Status | Notes |
|-------|--------|-------|
| Primary/secondary/tertiary/outline/ghost/destructive fills & strokes | present | CSS-equivalent Color vars |
| Label text Color + Typography/Button/{xs–lg} | present | Sampled md labels: textStyle ok |
| Dela fill → `Dela/gradient` paint style | present | 24/24 dela cells `fillStyleId` → `Dela/gradient` |
| `dela-foreground` on dela labels | present | |
| disabledOverlay fill Color-bound | present | 106 bound / 0 unbound |
| Focus → Elevation / focus-ring effect style | present | 32/32; destructive → `Elevation/focus-ring-error`; others → `Elevation/focus-ring-primary` |
| Stars vector fills | deferred/exempt | Baked Stars Vectors unbound — same exemption as Dela demo assets |
| Spinner / loading cover | present | Loading cover SOLID Color-bound (opacity 1) |

## Consumer API + wiring

| Prop (shadcn / plan) | Figma | Status |
|----------------------|-------|--------|
| `variant` | VARIANT ×8 | present |
| `size` | VARIANT ×4 | present |
| `state` | VARIANT default\|hover\|focus | present |
| `buttonType` | VARIANT theme\|pageHeader | present |
| `orientation` | VARIANT | present |
| `iconPosition` | VARIANT | present |
| `label` | TEXT wired | present (core + extras) |
| `disabled` | BOOLEAN → overlay visible | present (core + extras) |
| `loading` | BOOLEAN → loading frame visible | present; ABSOLUTE opaque cover |
| `loadingText` | TEXT wired | present |
| `icon` | INSTANCE_SWAP | present (extras rewired) |
| `fullWidth` | BOOLEAN → spacer visible | present (`spacerVisibleBound=101`) |
| asChild / className / type / handlers / href | — | deferred |

## HTML states

| Check | Status |
|-------|--------|
| `state` values default\|hover\|focus | present |
| While Hovering → Change to hover sibling | present on **37/37** `state=default` cells (extras included) |
| Focus ring vs shadcn | present — Elevation focus-ring styles on all focus cells |
| `state` omitted from Code Connect | n/a this verify (not published) |

## Node identity

| Check | Status |
|-------|--------|
| Update-in-place `6:2` | held — set id still `6:2`, name `Button`, 106 children |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier PASS — host may mark `review`. AskQuestion before `synced` / publish handoff. |

## Defects

### DEF-001

- **status:** fixed
- **category:** tokens
- **description:** Dela / dela-pill root fills now use paint style `Dela/gradient` (24/24).
- **evidence:** `use_figma` — `dela.styleOk=24`, sampleStyleName `Dela/gradient`; `vp-Button.png` gradient rows

### DEF-002

- **status:** fixed
- **category:** tokens
- **description:** `disabledOverlay` SOLID fills Color-bound on all cells (106/0).
- **evidence:** `use_figma` overlay audit

### DEF-003

- **status:** fixed
- **category:** api
- **description:** `fullWidth` wired via `fullWidthSpacer` `visible` ↔ `fullWidth` BOOLEAN (`spacerVisibleBound=101`).
- **evidence:** `use_figma`; wider cells visible in `vp-Button.png`

### DEF-004

- **status:** fixed
- **category:** behavior
- **description:** Loading uses ABSOLUTE cover with opaque Color-bound fill (`absLoading=106`, visible↔loading); spinner replaces visible content when loading is on.
- **evidence:** `use_figma` primary md default sample — `loadingAbs=ABSOLUTE`, fill opacity 1, bound

### DEF-005

- **status:** fixed
- **category:** visual
- **description:** Stars cloned onto all dela / dela-pill cells (`withStars=24/24`).
- **evidence:** `use_figma`; star pattern visible on dela rows in `vp-Button.png`

### DEF-006

- **status:** fixed
- **category:** visual
- **description:** All 32 focus cells have stroke + Elevation focus-ring (`focus-ring-primary`; destructive `focus-ring-error`).
- **evidence:** `use_figma` focusByVariant; focus rings visible in `vp-Button.png`

### DEF-007

- **status:** fixed
- **category:** behavior
- **description:** While Hovering on all 37 default cells including pageHeader×3, vertical, iconRight.
- **evidence:** `use_figma` — `withHover=37`, `missingCount=0`

### DEF-008

- **status:** fixed
- **category:** api
- **description:** Extra cells rewired — label / disabled / loading / icon `componentPropertyReferences` present on pageHeader, vertical, iconRight samples.
- **evidence:** `use_figma` extrasWire all true

### DEF-009 through DEF-014

- **status:** fixed
- **description:** Carried fixed from Button-2 (API grid, dela gradient appearance, icons, disabled/loading layers, state axis, TEST-RUN reset).

### DEF-015

- **status:** deferred
- **category:** api
- **description:** asChild, className, DOM type, handlers, href deferred per approved plan.
- **evidence:** `converters/figma/playbook/plans/Button.md`

## Blocked items

None — both PNGs present; Figma MCP audit succeeded; node `6:2` held.

## Verifier notes

- Compared **shadcn** reference PNG + fresh Figma `vp-Button.png` and compact readonly `use_figma` audit (required for token/API/hover checks image alone cannot prove).
- Reference capture remains docs-chrome truncated; visual judgments for paints/states used plan + shadcn intent + rendered set. Not treated as BLOCKED.
- Axis plan held: X=`size`›`state`, Y=`variant`; node `6:2` update-in-place held (106 children ≈ 96 + extras).
- Unbound paints found only on baked Stars Vectors inside dela cells — exempt per Dela demo convention; not filed as open defects.
- **PASS: zero conversion defects.** Host may move Button to `review` (then `needs-publish` when ready for human publish). Do not mark `synced` without human confirmation.
