# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Avatar` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-14T20:06:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 3 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/avatar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/avatar` (HTTP 200) |
| probe JSON | `verification/artifacts/avatar-2/probe.json` |
| screenshots | `verification/artifacts/avatar-2/` (`ref-` / `conv-` light+dark `page` + `examples`) |
| diag probe | `verification/artifacts/diag/probe-avatar-2.mjs` |
| prior report | `verification/reports/Avatar-1.md` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for verdict.

## Content parity

Inventory of reference `src/pages/components/avatar.astro` vs converted `AvatarsDemo.tsx` at `/components/avatar`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | Converted adds MUI `rounded` default note — same intent |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping |
| Example: Sizes (icon) sm/md/lg | present | HarmonyIcon sizes `sm` / `md` / `lg` |
| Example: Variants (icon / initials / image) | present | Title "Content variants" (clarifies content ≠ MUI shape) |
| Example: Interactive (Default / Hover / Focus / Disabled) | present | ButtonBase composite per locked decision |
| Props table | present | Harmony prop docs + mapping section (existing-mui) |
| Accessibility: Roles and labels | present | Wording adapted for ButtonBase / `alt` |
| Extra: MUI shape supersets | accepted | Locked user decision — circular/square OK as documented extra |
| Extra: Harmony → MUI mapping | present | Target-specific addition |

**Content gaps (open):** 0

Hard dependency check: catalog `Icon` is `synced` — not dependency-blocked. Interactive composition does not depend on unsynced elements.

Locked user decisions respected: default `variant=rounded`; interactive = `ButtonBase` wrap; circular/square as MUI supersets; size via `sx`.

## Visual parity

CP product. Light + dark browsed. Gate: rendered appearance (not CSS-proxy alone).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Default shape | Rounded square; md radius ~8px | Same rounded default via theme `variant=rounded` | present |
| Size footprint sm/md/lg | 24 / 32 / 40 px boxes; radii 4 / 8 / 12 | Same box sizes and radii | present |
| Light primary fill + white glyph/text | Blue `#2A78C6` fill; white icon / "JD" | Same blue fill; white icon / "JD" | present |
| Dark primary fill | Light blue `#59ACFF` fill | Same light-blue fill | present |
| Dark foreground (icon + initials) | White user icon and "JD" on light-blue chip | White user icon and "JD" on light-blue chip | present |
| User icon size in size row | SVG ~16 / 20 / 24 px (sm/md/lg) | SVG ~16 / 20 / 24 px (sm/md/lg) | present |
| Content row: icon / initials / photo | Three md chips; photo fills frame | Same three content modes; photo fills frame | present |
| Interactive hover (demo) | Darker blue light / brighter blue dark (`#2268B0` / `#7BB8FF`) | Matches those hover fills | present |
| Interactive focus (demo) | Soft double focus ring (shadow hugging chip) | Soft double focus ring via box-shadow + paper hairline — Harmony-like, not hard outline | present |
| Interactive disabled | ~50% opacity chip | ~50% opacity via ButtonBase | present |
| MUI circular / square extras | — (not on reference) | Documented extra section | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Conversion-agent should AskQuestion before marking Avatar `synced` in the manifest. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Size row user icons measure ~16×16 (sm), ~20×20 (md), ~24×24 (lg) — icon fills most of the chip.
- **converted:** Same chips now use ~16×16 / 20×20 / 24×24 icons — matches reference scale.
- **description:** Avatar-1 undersized glyph defect closed after HarmonyIcon sizes `sm`/`md`/`lg`.
- **evidence:** Live CP light/dark `:4321` vs `:5176` Sizes (icon); `avatar-2` examples PNGs; `probe.json` svg sizes 16/20/24 on both sides.

### DEF-002

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Focus (demo) shows Harmony primary focus ring — soft double ring via box-shadow hugging the rounded chip.
- **converted:** Focus (demo) now uses the same soft double-ring treatment (box-shadow), not a hard 2px outline with offset.
- **description:** Avatar-1 hard-outline focus defect closed; designer sees equivalent focus affordance.
- **evidence:** Interactive Focus columns in `avatar-2` examples screenshots; `probe.json` conv focus `boxShadow` 3px primary tint + 4px paper (outline no longer solid 2px / offset 2px).

### DEF-003

- **status:** fixed
- **category:** visual / tokens
- **severity:** high
- **reference:** CP dark Avatars keep **white** icons and initials on `#59ACFF` chips.
- **converted:** CP dark Avatars now use **white** icons and initials on the same light-blue chips.
- **description:** Avatar-1 dark charcoal glyph defect closed after theme foreground `#FFFFFF`.
- **evidence:** Live CP dark examples screenshots; `probe.json` dark size/initials `color: rgb(255,255,255)` on both sides.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Designer walkthrough completed with live browse + PNG pairs + probe evidence (judgment on rendered appearance; probe sizes/colors support descriptions only).
- Three-column visual matrix used; no PASS from mapper/source alone.
- Prior Avatar-1 open defects DEF-001–003 all **fixed**.
- Demo structure/checks: MUI imports direct; no file-local React components (helper `toAvatarInitials` is non-component); size-via-`sx` matches locked manifest `userDecision`; MUI supersets section OK.
- Wrapper / invented-prop checks: clean for this iteration.
- Focus ring intensity is slightly stronger on converted (primary tint ~35% vs reference ~10%) but still reads as the same soft double ring — not a designer-visible wrong treatment.
- **Recommendation: PASS** — human confirmation still required before manifest `synced`.
