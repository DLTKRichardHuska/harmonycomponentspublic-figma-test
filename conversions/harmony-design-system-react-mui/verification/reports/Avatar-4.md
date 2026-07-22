# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Avatar` |
| iteration | `4` |
| artifactType | `html` |
| generatedAt | `2026-07-14T23:20:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 4 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/avatar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/avatar` (HTTP 200) |
| probe JSON | `verification/artifacts/avatar-4/probe.json` |
| screenshots | `verification/artifacts/avatar-4/` (`ref-` / `conv-` light+dark `page` + `examples`; `conv-*-focus-demo.png`; `conv-*-forced-focus.png`) |
| prior report | `verification/reports/Avatar-3.md` (FAIL — DEF-001–003; superseded by this re-verify) |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for verdict. Judgment is from side-by-side examples PNGs + Interactive crops; probe supports descriptions only.

## Content parity

Inventory of reference `src/pages/components/avatar.astro` vs converted `AvatarsDemo.tsx` at `/components/avatar`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | Converted notes MUI `rounded` default — same intent |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping |
| Example: Sizes (icon) sm/md/lg | present | HarmonyIcon sizes `sm` / `md` / `lg`; footprint 24 / 32 / 40 |
| Example: Variants (icon / initials / image) | present | Title "Content variants" (clarifies content ≠ MUI shape) |
| Example: Interactive — Default | present | ButtonBase composite |
| Example: Interactive — Hover (demo) | present | Restored; `avatar-demo-hover` staging (DEF-001 fixed) |
| Example: Interactive — Focus (demo) | present | Restored; `avatar-demo-focus` staging (DEF-001 fixed) |
| Example: Interactive — Disabled | present | ButtonBase `disabled` with faded Avatar (DEF-003 fixed) |
| Props table | present | Harmony prop docs + mapping section (existing-mui) |
| Accessibility: Roles and labels | present | Wording adapted for ButtonBase / `alt` |
| Extra: MUI shape supersets | accepted | Locked user decision — circular/square OK as documented extra |
| Extra: Harmony → MUI mapping | present | Target-specific addition |

**Content gaps (open):** 0

Hard dependency check: catalog `Icon` is `synced` — not dependency-blocked. Interactive composition uses synced `HarmonyIcon`.

Locked / accepted decisions respected: default `variant=rounded`; interactive = `ButtonBase` wrap; circular/square as MUI supersets; size via `sx`; **per-size radius/font gap** remains accepted (not re-opened).

## Visual parity

CP product. Light + dark browsed. Gate: rendered appearance (not CSS-proxy alone).

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
| Interactive columns | Default, Hover (demo), Focus (demo), Disabled | Same four labeled columns restored | present |
| Interactive hover (staged) | Hover demo darker blue `#2268B0` light / `#7BB8FF` dark | Same darker/lighter fills on Hover (demo) column | present |
| Interactive focus (staged + forced) | Soft double focus ring (primary tint ~10% at 3px + paper hairline at 4px); no hard outline | Soft double ring on Focus (demo) and on `Mui-focusVisible`; outline none — no hard 2px offset outline | present |
| Interactive disabled | ~50% opacity chip (clearly faded next to Default) | Disabled Avatar child at 0.5 opacity — reads clearly faded next to Default | present |
| MUI circular / square extras | — (not on reference) | Documented extra section (RD rounded / CR circular / SQ square) | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | accepted |
| Confirmed by | user (complete-in-progress execute) |
| Notes | Visual match accepted 2026-07-14; Avatar marked `synced` (Avatar-4 PASS; per-size radius/font gap remains accepted) |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **severity:** high
- **reference:** Interactive example shows four labeled columns — Default, Hover (demo), Focus (demo), Disabled.
- **converted:** Interactive example again shows all four columns with `avatar-demo-hover` / `avatar-demo-focus` staging.
- **description:** Avatar-3 missing Hover/Focus demo columns are restored; side-by-side docs now match reference Interactive layout.
- **evidence:** Live `#examples` CP light/dark; `avatar-4` examples PNGs; probe `interactiveLabels` include Default / Hover (demo) / Focus (demo) / Disabled on both surfaces.
- **remediationHint:** —

### DEF-002

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Focus (demo) uses Harmony soft double ring — primary ~10% at 3px + paper hairline at 4px; outline none.
- **converted:** Focus (demo) and forced `Mui-focusVisible` show the soft double `box-shadow` ring; hard `outline: 2px solid` treatment is gone.
- **description:** Focus affordance matches the soft ring designers see on reference instead of a thick offset outline.
- **evidence:** `avatar-4/conv-*-focus-demo.png`; `conv-*-forced-focus.png`; probe Focus column shadow matches ref pattern (`0 0 0 3px` primary tint + `0 0 0 4px` paper); `outline` none.
- **remediationHint:** —

### DEF-003

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Disabled interactive Avatar paints at ~50% opacity — clearly faded beside Default.
- **converted:** Disabled Interactive Avatar reads faded (~0.5 on Avatar child); clearly distinguishable from Default.
- **description:** Designer can tell Disabled from Default at a glance again, matching reference treatment.
- **evidence:** Live Interactive Disabled column light/dark screenshots; probe `childOp: "0.5"` on disabled ButtonBase; `avatar-4` examples PNGs.
- **remediationHint:** —

### DEF-004

- **status:** accepted
- **category:** visual
- **severity:** low
- **reference:** sm/md/lg corner radii 4 / 8 / 12 and initials fonts 10 / 12 / 14.
- **converted:** Theme applies md radius (8px) and font (12px) for all sizes.
- **description:** Locked accepted gap — do not treat as open. Documented in manifest `gaps[]` + mapping rows. Explicitly not re-opened in Avatar-4.
- **evidence:** `avatar-4` probe radii sm/lg 8px on converted vs 4px/12px on reference; userDecision / gaps lock 2026-07-14.

## Blocked items

None — both review surfaces reachable. Icon dependency synced.

## Verifier notes

- Designer walkthrough completed with live browse + avatar-4 PNG pairs (examples + focus crops) + probe (judgment on rendered appearance; probe supports descriptions only).
- Three-column visual matrix used; no PASS from mapper/source alone.
- Avatar-3 FAIL does not still stand — DEF-001–003 remediations confirmed on-screen in CP light and dark.
- Checks: MUI imports direct (`Avatar`, `ButtonBase`, `HarmonyIcon`); no file-local React components in `AvatarsDemo.tsx`; demo zone uses layout `sx` only (`width`/`height` size pattern per locked decision) plus documented demo staging classNames; no invented MUI props; propMappings / gaps / userDecision cover Harmony props including accepted per-size chrome gap.
- Composite dependency / hard dependency: not blocked (`Icon` synced).
- **Recommendation: PASS: zero conversion defects.** Ask human before sync (accepted gap remains).
