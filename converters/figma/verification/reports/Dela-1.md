# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Dela` |
| product | `vp` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-22T20:29:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| strategy | `figma-variable` (not a component set) |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 5 |

**Result:** FAIL

> Foundation Dela demo content and rendered token/asset colors match the approved plan and CSS values, but token binding does not meet the Colors-page convention: most demo text and layout frame fills are unbound solids.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `converters/figma/verification/artifacts/reference-Dela.png` (shadcn `/foundation/dela`, 1024×664) |
| converted | `converters/figma/verification/artifacts/vp-Dela.png` (Figma MCP `get_screenshot` node `86:7`, file `qPVWATAnhiYb6eboWa9LoD`, 880×477) |
| plan | `converters/figma/playbook/plans/Dela.md` |
| node identity | `conversionState.elements.Dela.nodeId` = `86:7` (update-in-place held) |

## Content parity

Inventory vs approved plan page content + visible shadcn sections. Plan-deferred items are not open gaps.

| Reference / plan item | Status | Notes |
|-----------------------|--------|-------|
| Dela Color vars: `gradient-dela-start`, `gradient-dela-end`, `dela-foreground`, `gradient-dela-hover-bg` | present | Color collection; Light/Dark same values |
| Paint style `Dela/gradient` (119deg / stop positions) | present | Applied on gradient swatch + static brand sample |
| Token swatches row (start/end/foreground/hover + gradient) | present | Figma demo; shadcn uses table + one `bg-dela` swatch further down page |
| Star symbol asset (min ~20px) | present | Baked SVG vectors (raw fills allowed) |
| Ask Dela Launch Icon asset (min ~27px) | present | Baked SVG (teal→purple→magenta brand gradient; raw fills allowed) |
| Brand guide static sample + URL note (not Button set) | present | Deferred note + gradient sample labeled “Dela product brand guide” |
| Live Ask Dela panel / RightSidebar / ShellPanel | deferred | Plan + `conversionState.gaps` |
| Button CTA instance | deferred | Plan + note on canvas |
| Panel bubble tokens (`--dela-bubble-*`, `--dela-panel-*`) | deferred | Plan |
| Usage from npm / full prose sections | deferred | Out of plan Figma page inventory (demo-first tokens + assets) |
| HTML `state` / componentPropertyDefinitions | n/a | `figma-variable` foundation — skipped per verify brief |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| `gradient-dela-start` | CSS `#8A33C2` (purple) | Solid purple swatch ~`#8A33C2` | present |
| `gradient-dela-end` | CSS `#423FE2` (blue) | Solid blue swatch ~`#423FE2` | present |
| `dela-foreground` | White on-gradient text | White swatch with border | present |
| `gradient-dela-hover-bg` | `rgba(255,255,255,0.1)` wash | Near-white low-alpha swatch with border | present |
| `Dela/gradient` / `bg-dela` | Purple→blue diagonal brand gradient | Same diagonal gradient on 52px tile + CTA sample | present |
| Brand guide CTA look | Shadcn `Button variant="dela"` (deferred in Figma) | Static gradient pill + white label (intentional stand-in) | deferred |
| Star symbol | Purple sparkle pair ~20px | Purple sparkle asset @ 20px | present |
| Ask Dela Launch Icon | Gradient bubble + D ~27px | Matching baked launch mark @ 27px | present |
| Section label color | DS `text-primary` / `text-secondary` on Colors foundation | Pure black unbound fills on headings/labels | different |

**Visual gaps (open):** 1 (label color / binding — see DEF-001)

## Token binding

| Check | Status | Notes |
|-------|--------|-------|
| Color vars exist with CSS-equivalent values | present | start `#8A33C2`, end `#423FE2`, foreground white, hover `a≈0.1` |
| Swatch fills bound to matching Color vars | present | `86:12`→start, `86:15`→end, `86:18`→foreground, `86:21`→hover |
| Gradient swatch / static sample use `Dela/gradient` style | present | `fillStyleId` on `86:24`, `86:29` |
| CTA label uses `dela-foreground` | present | `86:30` |
| White swatch strokes bound | present | `text-primary` (`VariableID:2:13`) |
| Demo text colors bound to Color vars | **different** | 12/13 texts unbound black; Colors page is 26/26 bound |
| Layout frame solid fills bound | **different** | Multiple white frame fills unbound; Colors page 22/22 bound |
| Baked brand SVG vector fills | accepted (exempt) | Star + Launch Icon raw paints per verify brief |
| Typography text styles on text nodes | present | Heading/L, Label, Body/Default |
| Consumer API / HTML `state` | n/a | Not a component set |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Open token-binding defects; do not advance past `in-progress` / do not mark `synced` |

## Defects

### DEF-001

- **status:** open
- **category:** tokens
- **reference:** On Foundation / Colors, headings bind `text-primary` and swatch labels bind `text-secondary` (100% of text nodes).
- **converted:** Dela demo headings and labels (`Dela tokens`, swatch names, `Brand guide…`, asset titles, min-height notes, deferral body) use Typography styles but **unbound solid black** fills. Only “Dela product brand guide” binds `dela-foreground`.
- **description:** Designer would see demo copy as raw black instead of Harmony text tokens; remode/theme and consistency with other foundation pages break.
- **evidence:** `use_figma` readonly audit of node `86:7`; compare to Colors page text binding rate. Artifacts: `vp-Dela.png`.
- **remediationHint:** Bind section titles to Color/`text-primary`; labels and helper copy to Color/`text-secondary` (or `text-muted` for deferral note), matching Colors.

### DEF-002

- **status:** open
- **category:** tokens
- **reference:** Foundation / Colors binds every solid frame/rectangle fill to a Color variable (0 unbound in sample).
- **converted:** Layout frames under `Dela demo` (`Dela tokens`, `swatches`, per-swatch wrappers, `Brand guide sample`, `Assets`, etc.) use unbound solid white fills.
- **description:** Designer/library consumers get unbound scaffolding paints; fails the same token-binding bar as Colors.
- **evidence:** `use_figma` unbound fill walk on `86:7` vs Colors page frame-fill audit.
- **remediationHint:** Bind container fills to the page/surface Color var used on other foundation demos (e.g. `page-bg` / transparent pattern already established).

### DEF-003

- **status:** deferred
- **category:** structure
- **description:** Live Ask Dela panel / RightSidebar / ShellPanel demos deferred until those shell elements convert.
- **evidence:** Plan § Deferred; `conversionState.elements.Dela.gaps`

### DEF-004

- **status:** deferred
- **category:** structure
- **description:** Button CTA instance deferred until Button converts; static gradient sample stands in.
- **evidence:** Plan; canvas note on `86:28`

### DEF-005

- **status:** deferred
- **category:** tokens
- **description:** Panel bubble tokens (`--dela-bubble-*`, `--dela-panel-*`) deferred until ShellPanel.
- **evidence:** Plan § Deferred

## Blocked items

None — both PNGs and Figma MCP readonly audit available.

## Verifier notes

- Compared **shadcn** reference PNG + Figma `vp-Dela.png` (not Astro). Persona: designer.
- `figma-variable` scope: skipped `componentPropertyDefinitions` / HTML `state` checks.
- Reference crop (1024×664) shows header, nav, Usage snippet, and start of brand guide / Star sections — not the lower token table or launch icon. Token/asset visual judgment used converted PNG + CSS token values + plan inventory; Colors-page binding convention for token audit.
- Node identity `86:7` matches `conversionState.elements.Dela.nodeId`.
- Baked Star / Ask Dela Launch Icon raw fills treated as exempt (verify brief).
- **Recommendation: FAIL** — remediate DEF-001 and DEF-002, re-capture `vp-Dela.png`, re-verify. Do not mark `synced`. After PASS → `review` (orchestrator adds Token retrospective).
