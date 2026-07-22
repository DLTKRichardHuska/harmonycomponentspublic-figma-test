# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Avatar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-14T20:00:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 3 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/avatar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/avatar` (HTTP 200) |
| probe JSON | `verification/artifacts/avatar-1/probe.json` |
| screenshots | `verification/artifacts/avatar-1/` (`ref-` / `conv-` light+dark `page` + `examples`) |
| diag probe | `verification/artifacts/diag/probe-avatar-1.mjs` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for verdict.

## Content parity

Inventory of reference `src/pages/components/avatar.astro` vs converted `AvatarsDemo.tsx` at `/components/avatar`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | Converted adds MUI `rounded` default note — same intent |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping |
| Example: Sizes (icon) sm/md/lg | present | |
| Example: Variants (icon / initials / image) | present | Title “Content variants” (clarifies content ≠ MUI shape) |
| Example: Interactive (Default / Hover / Focus / Disabled) | present | ButtonBase composite per locked decision |
| Props table | present | Harmony prop docs + mapping section (existing-mui) |
| Accessibility: Roles and labels | present | Wording adapted for ButtonBase / `alt` |
| Extra: MUI shape supersets | accepted | Locked user decision — circular/square OK as documented extra |
| Extra: Harmony → MUI mapping | present | Target-specific addition |

**Content gaps (open):** 0

Hard dependency check: catalog `Icon` is `synced` — not dependency-blocked. Interactive composition does not depend on unsynced elements.

Locked user decisions respected: default `variant=rounded`; interactive = `ButtonBase` wrap; circular/square as MUI supersets.

## Visual parity

CP product. Light + dark browsed. Gate: rendered appearance (not CSS-proxy alone).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Default shape | Rounded square; md radius ~8px | Same rounded default via theme `variant=rounded` | present |
| Size footprint sm/md/lg | 24 / 32 / 40 px boxes; radii 4 / 8 / 12 | Same box sizes and radii | present |
| Light primary fill + white glyph/text | Blue `#2A78C6` fill; white icon / “JD” | Same blue fill; white icon / “JD” in light | present |
| Dark primary fill | Light blue `#59ACFF` fill | Same light-blue fill | present |
| Dark foreground (icon + initials) | **White** user icon and “JD” on light-blue chip | **Dark charcoal** icon and “JD” on light-blue chip | different |
| User icon size in size row | SVG ~16 / 20 / 24 px (sm/md/lg) | SVG ~12 / 16 / 20 px — clearly smaller | different |
| Content row: icon / initials / photo | Three md chips; photo fills frame | Same three content modes; photo fills frame | present |
| Interactive hover (demo) | Darker blue light / brighter blue dark (`#2268B0` / `#7BB8FF`) | Matches those hover fills | present |
| Interactive focus (demo) | Soft double focus ring (shadow hugging chip) | Hard 2px solid outline with 2px gap — thicker, more detached ring | different |
| Interactive disabled | ~50% opacity chip | ~50% opacity via ButtonBase | present |
| MUI circular / square extras | — (not on reference) | Documented extra section | accepted |

**Visual gaps (open):** 3

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Do not mark `synced` until open defects remediated (or human accepts gaps via AskQuestion). |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Size row user icons measure ~16×16 (sm), ~20×20 (md), ~24×24 (lg) — icon fills most of the chip.
- **converted:** Same chips use ~12×12 / 16×16 / 20×20 icons — noticeably smaller / more padding.
- **description:** Designer would see undersized user glyphs in every icon Avatar size versus reference.
- **evidence:** Live CP light/dark `:4321` vs `:5176` Sizes (icon); `ref-*-examples.png` / `conv-*-examples.png`; `probe.json` svg sizes; demo maps HarmonyIcon `xs/sm/md` instead of reference `sm/md/lg`.
- **remediationHint:** In `AvatarsDemo.tsx`, pass HarmonyIcon sizes `sm` / `md` / `lg` to match reference Avatar→Icon mapping (and document in mapping table).

### DEF-002

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Focus (demo) shows Harmony primary focus ring — soft double ring via box-shadow hugging the rounded chip.
- **converted:** Focus (demo) shows a solid 2px primary outline with 2px offset — thicker blue halo with a visible gap.
- **description:** Designer would see a different focus treatment on interactive Avatar (not the Harmony focus ring).
- **evidence:** Interactive Focus columns in examples screenshots; `probe.json` ref shadow `0 0 0 3px` + `0 0 0 4px` vs conv `outline: solid 2px` / `outlineOffset: 2px`.
- **remediationHint:** Match Button / shared focus-ring token (box-shadow pattern used elsewhere in theme) on `ButtonBase` interactive Avatar styles instead of raw outline.

### DEF-003

- **status:** open
- **category:** visual / tokens
- **severity:** high
- **reference:** CP dark Avatars keep **white** icons and initials on `#59ACFF` chips.
- **converted:** CP dark Avatars use **dark charcoal** (`primary.contrastText` ≈ `rgb(31, 37, 46)`) icons and initials on the same light-blue chips.
- **description:** Designer would see dark-on-light-blue Avatar content in dark mode instead of white-on-light-blue as on reference.
- **evidence:** Live CP dark examples screenshots; initials measure ref `spanColor: rgb(255,255,255)` vs conv `rgb(31,37,46)`; theme `mapAvatarToTheme.ts` sets `color: primary.contrastText` while reference `.avatar` uses `color: white`.
- **remediationHint:** Align Avatar foreground with reference (white / inverse) for both light and dark, or product-aware inverse that still reads white on CP dark primary.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Designer walkthrough completed with live browse + PNG pairs + probe evidence (judgment on rendered appearance; probe sizes/colors support descriptions only).
- Three-column visual matrix used; no PASS from mapper/source alone.
- Demo structure/checks: MUI imports direct; no file-local React components; size-via-`sx` matches locked manifest `userDecision`; MUI supersets section OK.
- Wrapper / invented-prop checks: clean for this iteration.
- **Recommendation: FAIL** — remediate DEF-001–003 then re-verify as Avatar-2.
