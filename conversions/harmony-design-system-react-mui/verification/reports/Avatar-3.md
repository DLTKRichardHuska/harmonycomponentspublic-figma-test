# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Avatar` |
| iteration | `3` |
| artifactType | `html` |
| generatedAt | `2026-07-14T23:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/avatar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/avatar` (HTTP 200) |
| probe JSON | `verification/artifacts/avatar-3/probe.json` |
| screenshots | `verification/artifacts/avatar-3/` (`ref-` / `conv-` light+dark `page` + `examples`; `conv-*-examples-focus.png`) |
| diag probe | `verification/artifacts/diag/run-avatar-3.mjs` |
| prior report | `verification/reports/Avatar-2.md` (PASS — **superseded**; does not stand after fresh evidence) |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for verdict. Avatar-2 was not rubber-stamped.

## Content parity

Inventory of reference `src/pages/components/avatar.astro` vs converted `AvatarsDemo.tsx` at `/components/avatar`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | Converted adds MUI `rounded` default note — same intent |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping |
| Example: Sizes (icon) sm/md/lg | present | HarmonyIcon sizes `sm` / `md` / `lg`; footprint 24 / 32 / 40 |
| Example: Variants (icon / initials / image) | present | Title "Content variants" (clarifies content ≠ MUI shape) |
| Example: Interactive — Default | present | ButtonBase composite |
| Example: Interactive — Hover (demo) | missing | Reference stages hover via `avatar--demo-hover`; converted drops the column |
| Example: Interactive — Focus (demo) | missing | Reference stages focus via `avatar--demo-focus`; converted drops the column |
| Example: Interactive — Disabled | present | ButtonBase `disabled` — see visual gap DEF-003 |
| Props table | present | Harmony prop docs + mapping section (existing-mui) |
| Accessibility: Roles and labels | present | Wording adapted for ButtonBase / `alt` |
| Extra: MUI shape supersets | accepted | Locked user decision — circular/square OK as documented extra |
| Extra: Harmony → MUI mapping | present | Target-specific addition |

**Content gaps (open):** 2 (Hover demo column, Focus demo column)

Hard dependency check: catalog `Icon` is `synced` — not dependency-blocked. Interactive composition `dependsOn: []`; demo uses synced `HarmonyIcon`.

Locked / accepted decisions respected where recorded: default `variant=rounded`; interactive = `ButtonBase` wrap; circular/square as MUI supersets; size via `sx`; **per-size radius/font gap** (see accepted defect).

## Visual parity

CP product. Light + dark browsed. Gate: rendered appearance (not CSS-proxy alone). Forced focus + real hover used for interactive states not on-page for converted.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Default shape | Rounded square chips | Same rounded default (`MuiAvatar-rounded`) | present |
| Size footprint sm/md/lg | 24 / 32 / 40 px boxes | Same box sizes via `sx` / theme default md | present |
| Corner radius by size | sm 4px / md 8px / lg 12px | All sizes 8px (md) | accepted |
| Initials type size by avatar size | 10 / 12 / 14 px on sm/md/lg | Theme xs (12px) for all sizes | accepted |
| Light primary fill + white glyph/text | Blue `#2A78C6` fill; white icon / "JD" | Same blue fill; white icon / "JD" | present |
| Dark primary fill | Light blue `#59ACFF` fill | Same light-blue fill | present |
| Dark foreground (icon + initials) | White user icon and "JD" on light-blue chip | White user icon and "JD" on light-blue chip | present |
| User icon size in size row | SVG ~16 / 20 / 24 px (sm/md/lg) | SVG ~16 / 20 / 24 px (sm/md/lg) | present |
| Content row: icon / initials / photo | Three md rounded chips; photo fills frame | Same three content modes; photo fills rounded frame | present |
| Interactive hover (real / staged) | Hover demo darker blue `#2268B0` light / `#7BB8FF` dark | Real hover matches those fills; **no staged Hover column** | different |
| Interactive focus (real / staged) | Soft double focus ring (`box-shadow` primary tint + paper hairline), no hard outline | Hard `solid 2px` primary outline + `2px` offset on `Mui-focusVisible`; **no staged Focus column** | different |
| Interactive disabled | ~50% opacity chip (clearly faded next to Default) | Disabled ButtonBase: pointer-events none but **opacity still 1** — reads like Default | different |
| MUI circular / square extras | — (not on reference) | Documented extra section (RD rounded / CR circular / SQ square) | accepted |

**Visual gaps (open):** 3 (missing hover/focus staging counted under content + focus treatment + disabled fade)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **FAIL**. Do not mark Avatar `synced`. Avatar-2 PASS is obsolete. Accepted gap (per-size radius/font) remains locked — not re-opened. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **severity:** high
- **reference:** Interactive example shows four labeled columns — Default, Hover (demo), Focus (demo), Disabled — so designers can see hover/focus without interacting.
- **converted:** Interactive example shows only Default and Disabled. Description says hover/focus are "via interaction" only.
- **description:** Designer comparing docs side by side would notice two missing state demos on the Interactive row. Manifest does not record a skip for static hover/focus demos (unlike Chip).
- **evidence:** Live `#examples` CP light/dark; `avatar-3` examples PNGs; probe `interactiveLabels` ref includes Hover/Focus, conv only Default/Disabled.
- **remediationHint:** Restore staged Hover/Focus columns using theme-driven looks (e.g. composed ButtonBase states or documented demo staging) without fidelity `sx` inside the copy-paste zone; or lock an explicit `gaps`/`userDecision` skip if intentional.

### DEF-002

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Focus (demo) uses Harmony soft double ring — `box-shadow` primary ~10% at 3px + paper hairline at 4px; outline none.
- **converted:** `Mui-focusVisible` on ButtonBase uses hard `outline: 2px solid primary` with `outlineOffset: 2px` and no soft ring (`mapButtonBaseToTheme.ts`). On-page Focus column absent.
- **description:** Focus affordance regresses to the hard-outline treatment closed in Avatar-2 (Avatar-1 DEF-002). Designer sees a thick offset outline instead of the soft ring hugging the chip.
- **evidence:** `avatar-3/probe.json` `conv-*-forced.focused`; `conv-light-examples-focus.png` Default column with hard outline; ref Interactive Focus column screenshots.
- **remediationHint:** Align bare ButtonBase focus-visible with `--focus-ring-primary` / soft double ring used by reference Avatar (without breaking Button/IconButton slots).

### DEF-003

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Disabled interactive Avatar paints at ~50% opacity — clearly faded beside Default.
- **converted:** `ButtonBase disabled` sets `Mui-disabled` / `pointer-events: none` but computed opacity stays `1` on button and Avatar — Disabled chip looks like Default at rest.
- **description:** Designer cannot tell Disabled from Default without interacting. Equivalence to reference disabled treatment is lost after purity remediation.
- **evidence:** Live Interactive row + targeted Playwright probe (`disabled: true`, `btnOpacity: "1"`, `avOpacity: "1"`); `avatar-3` examples PNGs; reference Interactive Disabled column ~0.5 opacity in probe.
- **remediationHint:** Theme opacity (or equivalent) for `ButtonBase` when wrapping Avatar / disabled interactive composite so disabled reads ~50% as on reference.

### DEF-004

- **status:** accepted
- **category:** visual
- **severity:** low
- **reference:** sm/md/lg corner radii 4 / 8 / 12 and initials fonts 10 / 12 / 14.
- **converted:** Theme applies md radius (8px) and font (12px) for all sizes.
- **description:** Locked accepted gap — do not treat as open. Documented in manifest `gaps[]` + mapping rows.
- **evidence:** `avatar-3` probe radii sm/lg 8px on converted vs 4px/12px on reference; userDecision / gaps lock 2026-07-14.

## Blocked items

None — both review surfaces reachable. Icon dependency synced.

## Verifier notes

- Designer walkthrough completed with live browse + avatar-3 PNG pairs + probe (judgment on rendered appearance; probe supports descriptions only).
- Three-column visual matrix used; no PASS from mapper/source alone.
- **Avatar-2 PASS does not still stand** — purity remediation removed Hover/Focus staging, disabled fade, and soft focus ring.
- Checks: MUI imports direct (`Avatar`, `ButtonBase`, `HarmonyIcon`); no file-local React components in `AvatarsDemo.tsx`; demo zone uses layout `sx` only (`width`/`height` size pattern per locked decision); no invented MUI props; propMappings / gaps / userDecision cover Harmony props including accepted per-size chrome gap.
- Manifest prop coverage: size, content modes, interactive, disabled recorded; content `variant` clarified vs MUI shape.
- Composite dependency / hard dependency: not blocked.
- **Recommendation: FAIL** — remediate DEF-001–003, then re-verify before human sync.
