# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Button` |
| product | `vp` |
| iteration | `2` |
| artifactType | `image` |
| generatedAt | `2026-07-22T21:01:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| plan | `converters/figma/playbook/plans/Button.md` (approved) |
| host | file `qPVWATAnhiYb6eboWa9LoD`, nodeId `6:2` (update-in-place held) |

## Summary

| Status | Count |
|--------|-------|
| open | 8 |
| fixed | 6 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 15 |

**Result:** FAIL

> Rebuild landed the confirmed Consumer API grid (8×4×3 + extras) on node `6:2`, with theme/pageHeader paints and hover reactions on the main matrix. Open gaps remain on Dela token binding, focus ring, loading content swap, Stars, `fullWidth` wiring, and extra-cell hover/wiring.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `converters/figma/verification/artifacts/reference-Button.png` (shadcn `/components/buttons`, VP — 1024×664; captures docs chrome + Examples intro only) |
| converted | `converters/figma/verification/artifacts/vp-Button.png` (Figma MCP set `6:2` — 2011×715) |
| plan | `converters/figma/playbook/plans/Button.md` |
| prior report | `converters/figma/verification/reports/Button-1.md` |
| audit | readonly `use_figma` on `6:2` (props, paints, reactions, wiring) |

## Content parity

| Reference / plan item | Status | Notes |
|-----------------------|--------|-------|
| 8 variants (primary…dela-pill) | present | All 8 on Y axis |
| Size ladder xs–lg | present | X nested with state |
| HTML `state` default/hover/focus | present | 96-cell core grid |
| Theme vs pageHeader samples | present | 3 pageHeader extras (primary/secondary/tertiary) |
| Icon + label / iconPosition | present | Extras: vertical + iconPosition=right |
| Disabled / loading layers | present | BOOLEAN layers exist on masters |
| Dela Stars graphic | missing | shadcn dela shows `/Stars.svg`; Figma `starsCount=0` |
| Docs Props table (non-deferred) | present | Props defined on set |
| Deferred: asChild, className, DOM type, handlers, href | deferred | Per approved plan |

**Content gaps (open):** 1

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Primary (VP theme) | Solid primary blue fill, white label | `primary` fill + `primary-foreground` label; size ladder readable | present |
| Secondary / tertiary | Elevated fill + primary stroke / transparent + tertiary fg | `elevated-bg` + `theme-btn-secondary-stroke`; tertiary `theme-btn-tertiary-fg` | present |
| Outline / ghost | Border / text-only | `border-color` stroke / transparent ghost | present |
| Destructive | Error red fill, white label | Bound `error` (#D83148 light) | present |
| Dela / dela-pill | Purple→blue gradient, white label, Stars, sm/pill radius | Gradient + `dela-foreground` visible; **no Stars**; radius 2 / pill OK | different |
| Hover paints | Darker / token hover fills | `primary-hover` etc. on hover cells; ON_HOVER on 32/37 defaults | present (extras gap) |
| Focus | Outline + focus-ring shadow | `card-bg` stroke only; **0/32 focus cells have effects** | different |
| Loading | Spinner replaces label/content | Spinner layer exists; **label/content stay visible** when loading | different |
| Disabled | Disabled paints / overlay | Overlay layer + BOOLEAN; overlay fill **unbound** | different |
| Vertical / icon right | Icon stacked / trailing | Extras present in screenshot | present |
| fullWidth | Full-width stretch in demo | Prop declared; **no stretch wiring** visible | missing |

**Visual gaps (open):** 5

## Token binding

| Check | Status | Notes |
|-------|--------|-------|
| Primary/secondary/tertiary/outline/ghost/destructive fills & strokes | present | CSS-equivalent Color vars (`primary`, `theme-btn-*`, `error`, `border-color`, …) |
| Label text Color + Typography/Button/{xs–lg} | present | Sampled md cells |
| Dela fill → `Dela/gradient` paint style | different | Raw `GRADIENT_LINEAR`, `fillStyleId` empty (`Dela/gradient` exists in file) |
| `dela-foreground` on dela labels | present | |
| disabledOverlay fill Color-bound | different | Unbound SOLID on overlay |
| Focus → Elevation / focus-ring effect style | missing | No effect styles on focus variants |
| Unbound spinner stroke | present | Spinner stroke bound (e.g. `primary-foreground` / `dela-foreground`) |

## Consumer API + wiring

| Prop (shadcn / plan) | Figma | Status |
|----------------------|-------|--------|
| `variant` | VARIANT ×8 | present |
| `size` | VARIANT ×4 | present |
| `state` | VARIANT default\|hover\|focus | present |
| `buttonType` | VARIANT theme\|pageHeader | present |
| `orientation` | VARIANT | present |
| `iconPosition` | VARIANT | present |
| `label` | TEXT wired | present (core); extras incomplete |
| `disabled` | BOOLEAN → overlay visible | present (core) |
| `loading` | BOOLEAN → loading frame visible | present (core); content not hidden |
| `loadingText` | TEXT wired | present (core) |
| `icon` | INSTANCE_SWAP → Icon set `44:28` (default `44:8`) | present |
| `fullWidth` | BOOLEAN defined | **missing wiring** (`fullWidthHits=0`) |
| asChild / className / type / handlers / href | — | deferred |

## HTML states

| Check | Status |
|-------|--------|
| `state` values default\|hover\|focus | present |
| While Hovering → Change to hover sibling | present on 32/37 `state=default` cells; **missing** on pageHeader×3, vertical, iconRight |
| Focus ring vs shadcn | different — outline only, no focus-ring shadow |
| `state` omitted from Code Connect | n/a this verify (not published) |

## Node identity

| Check | Status |
|-------|--------|
| Update-in-place `6:2` | held — set id still `6:2`, name `Button`, 101 children |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | FAIL — do not advance past `in-progress`. AskQuestion only after remediate + re-verify PASS. |

## Defects

### DEF-001

- **status:** open
- **category:** tokens
- **reference:** Dela / dela-pill use foundation `Dela/gradient` (CSS `--gradient-dela`)
- **converted:** Gradient looks close, but fill is unbound raw `GRADIENT_LINEAR` (`Dela/gradient` style not applied)
- **description:** Designer would see dela paints that are not library-token-bound — editing `Dela/gradient` will not update Button.
- **evidence:** `use_figma` md dela/dela-pill samples — `fillStyle` null; local style `Dela/gradient` exists; `vp-Button.png` gradient rows
- **remediationHint:** Apply paint style `Dela/gradient` on dela / dela-pill root fills (all states/sizes)

### DEF-002

- **status:** open
- **category:** tokens
- **reference:** Disabled uses theme disabled token colors
- **converted:** `disabledOverlay` rectangle uses unbound SOLID
- **description:** Designer would see an overlay that is not Color-variable bound (token audit fail even if screenshot looks muted).
- **evidence:** `primaryUnbound` / all sampled cells list `disabledOverlay` unbound
- **remediationHint:** Bind overlay fill to the appropriate disabled/hover wash Color variable

### DEF-003

- **status:** open
- **category:** api
- **reference:** `fullWidth` stretches the control (`width: 100%`)
- **converted:** `fullWidth` BOOLEAN exists on the set but has **zero** `componentPropertyReferences` / stretch wiring
- **description:** Designer toggling fullWidth would see no layout change — unused declared prop (not publish-ready).
- **evidence:** `fullWidthHits=0`; plan requires stretch wired on master/samples
- **remediationHint:** Wire layout grow / min-width FILL (or equivalent) to `fullWidth`; prove on a sample

### DEF-004

- **status:** open
- **category:** behavior
- **reference:** Loading replaces default content with spinner (+ optional loadingText)
- **converted:** `loading` shows the loading frame, but `content` / `label` stay visible (`contentHiddenOnLoading=0`)
- **description:** Designer would see label and spinner together instead of spinner replacing the label.
- **evidence:** layer tree on primary md default; plan text “spinner layer on; default content off”
- **remediationHint:** Bind content (or label+icon) `visible` inverse to `loading`, or hide content when loading is on

### DEF-005

- **status:** open
- **category:** visual
- **reference:** Dela buttons include Stars graphic beside the label
- **converted:** No Stars layer on dela / dela-pill (`starsCount=0`)
- **description:** Designer would miss the Stars mark that identifies Dela CTAs in shadcn.
- **evidence:** shadcn `Button.tsx` Stars `<img>`; Figma audit; `vp-Button.png` dela rows label-only
- **remediationHint:** Add Stars asset/instance on dela variants (baked SVG OK if fills exempted like Dela demo)

### DEF-006

- **status:** open
- **category:** visual
- **reference:** Focus-visible uses card outline + focus-ring shadow
- **converted:** Focus variants use `card-bg` stroke only; **0/32** focus cells have effects; 8/32 lack stroke
- **description:** Designer would see a thin outline without the Harmony focus-ring glow on most focus cells.
- **evidence:** `focusWithEffects=0`, `focusWithStroke=24`; shadcn `focus-visible:shadow-[var(--focus-ring-*)]`
- **remediationHint:** Apply Elevation / focus-ring effect style on all `state=focus` variants; ensure stroke on all focus cells

### DEF-007

- **status:** open
- **category:** behavior
- **reference:** Every `state=default` with a hover sibling uses While Hovering → Change to
- **converted:** 5 default extras missing ON_HOVER: pageHeader primary/secondary/tertiary, vertical, iconPosition=right
- **description:** Designer prototyping those instances would not get hover state changes.
- **evidence:** `missingHover` list from `use_figma`
- **remediationHint:** Add While Hovering → matching `state=hover` sibling on each missing default

### DEF-008

- **status:** open
- **category:** api
- **reference:** Non-deferred props wired on all shipped variants including extras
- **converted:** Vertical (and similarly iconRight) extras lack `componentPropertyReferences` on label / loading / disabled / icon swap
- **description:** Designer using vertical/iconRight instances cannot configure label, loading, disabled, or icon like the core grid.
- **evidence:** `verticalTree` refs empty on label/loading/disabled; icon instance missing swap ref
- **remediationHint:** Re-apply property references on extra cells to match the master template

### DEF-009 (prior DEF-001 API gap)

- **status:** fixed
- **category:** structure
- **description:** Consumer API props from Button-1 now present (buttonType, orientation, disabled, loading, loadingText, icon, iconPosition, state).

### DEF-010 (prior DEF-002 dela solid primary)

- **status:** fixed
- **category:** visual
- **description:** dela / dela-pill now show purple→blue gradient (binding still open as DEF-001).

### DEF-011 (prior DEF-003 icons)

- **status:** fixed
- **category:** visual
- **description:** Icon INSTANCE_SWAP → public Icon `44:28`; vertical / iconRight extras present.

### DEF-012 (prior DEF-004 disabled/loading)

- **status:** fixed
- **category:** visual
- **description:** disabled / loading layers authored (behavior gaps remain as DEF-002 / DEF-004).

### DEF-013 (prior DEF-005 state)

- **status:** fixed
- **category:** structure
- **description:** HTML `state` default/hover/focus authored on core 96-cell grid.

### DEF-014 (prior DEF-006 TEST-RUN synced process)

- **status:** fixed
- **category:** other
- **description:** Host status reset; Button is `in-progress` for quality rebuild (not falsely synced).

### DEF-015

- **status:** deferred
- **category:** api
- **description:** asChild, className, DOM type, handlers, href deferred per approved plan.
- **evidence:** `converters/figma/playbook/plans/Button.md`

## Blocked items

None — both PNGs present; Figma MCP audit succeeded.

## Verifier notes

- Compared **shadcn** reference PNG + Figma `vp-Button.png` and compact readonly `use_figma` audit (required for token/API/hover checks image alone cannot prove).
- Reference capture is **docs-chrome truncated** (does not include live variant tiles). Visual judgments for paints/states also used shadcn `Button.tsx` / demo sections + Figma rendered set. Recommend fuller shadcn capture on next verify cycle; not treated as BLOCKED.
- Axis plan held: X=`size`›`state`, Y=`variant`, 101 children ≈ 96 + extras; node `6:2` update-in-place held.
- Icon default `44:8` is a component inside public Icon set `44:28` — acceptable INSTANCE_SWAP default.
- Do **not** recommend `review` / `synced` while open > 0.
