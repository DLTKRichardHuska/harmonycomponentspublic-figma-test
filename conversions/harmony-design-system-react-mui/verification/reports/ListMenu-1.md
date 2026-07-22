# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ListMenu` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-20T23:11:12.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 1 |

**Result:** FAIL

CP × light. Strategy `existing-mui` (List + ListItemButton + `divider`). Icon dependency `synced`. No skipped props. Do **not** mark ListMenu `synced` — human acceptance required after remediate + re-verify.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/list-menu` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/list-menu` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/list-menu-1/ref-page-top.png` / `conv-page-top.png` |
| screenshot | `verification/artifacts/list-menu-1/ref-basic-list-menu.png` / `conv-basic-list-menu.png` |
| screenshot | `verification/artifacts/list-menu-1/ref-without-icons.png` / `conv-without-icons.png` |
| screenshot | `verification/artifacts/list-menu-1/ref-with-links.png` / `conv-with-links.png` |
| screenshot | `verification/artifacts/list-menu-1/ref-no-borders.png` / `conv-no-borders.png` |
| probe | `verification/artifacts/list-menu-1/ref-probe.json` / `conv-probe.json` |
| inventory | `verification/artifacts/list-menu-1/ref-inventory.json` / `conv-inventory.json` |
| capture script | `verification/artifacts/list-menu-1/capture.mjs` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | List Menu; same body copy |
| Article nav (Examples, Props) | present | Converted also adds Harmony mapping + Accessibility (OK for conversion demos) |
| Examples: Basic List Menu | present | Dashboard / Profile / Settings / Logout; first selected; icons |
| Examples: Without icons | present | Overview / Details / History / Export; first selected |
| Examples: With Links | present | Documents / Images / Videos / Audio as links; first selected |
| Examples: No Borders | present | Same items as Basic; no item separators; outer shell border retained on both |
| Section: Props | present | MUI-oriented List / ListItemButton tables (expected for existing-mui) |
| ListMenu / MenuItem prop headings | present | Equivalent MUI prop coverage via mapping + tables; Harmony prop names in mapping section |
| Section: Accessibility | present | Converted adds a11y cards (reference has none on this page — OK extra) |

**Content gaps (open):** 0

## Visual parity

CP × light. Judged from live browse + per-example screenshots (not probe alone).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Shell — width / radius / border | ~320px, 8px radius, 1px gray border, paper fill | Same 320 / 8px / matching border / paper | present |
| Item padding / type | 12×16 padding, 14px label, primary text | Matching padding, type, primary text | present |
| Selected row | Full-width primary blue fill, white label + white icon | Matching primary blue + white chrome | present |
| Separators (default / links) | 1px dividers between items; none under last | Matching dividers via `divider` prop | present |
| No Borders | Outer border kept; **no** item separators | Matching — outer border, no separators | present |
| Icon size / placement | 20×20 icons, 16px left inset, ~12px gap to label | Matching size, inset, gap | present |
| Unselected icon color | Muted gray (`#6B7280` / `--text-muted`) | Darker secondary slate (`#525969` / `text.secondary`) | **different** |
| Without-icons label inset | Labels at left padding (no icon column) | Matching left-aligned labels | present |
| Link items | Same chrome as button items (icons + selected) | Matching via `component="a"` | present |

**Visual gaps (open):** 1

## Side-by-side visual summary

| Example | Designer takeaway |
|---------|-------------------|
| Basic List Menu | Layout, selected blue, dividers, and sizing match; **unselected icons read darker** on converted |
| Without icons | Label-only rows match reference |
| With Links | Link composition matches button chrome; same icon-color gap as Basic |
| No Borders | Separators correctly omitted; outer border retained on both surfaces |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **FAIL** until DEF-001 closed. Do not mark ListMenu `synced` until remediate + re-verify PASS and human confirms via AskQuestion. |

**conversion-agent** must **AskQuestion** before any manifest status change when Status is `pending`.

## Defects

### DEF-001

- **status:** open
- **category:** tokens / visual
- **reference:** Unselected list-item icons render as muted gray (`#6B7280`, Harmony `--text-muted`)
- **converted:** Unselected `ListItemIcon` / `HarmonyIcon` render as secondary text slate (`#525969`, `theme.palette.text.secondary`)
- **description:** Designer would see unselected icons (Profile, Settings, Logout, and link-row icons) as noticeably darker / cooler on conversion than on reference in CP light — side-by-side the glyph weight feels heavier on converted.
- **evidence:** Live `:4321` vs `:5176` Basic / With Links / No Borders examples; group shots `ref-basic-list-menu.png` vs `conv-basic-list-menu.png` (and with-links / no-borders pairs). Measured unselected icon `color`: ref `rgb(107, 114, 128)` vs conv `rgb(82, 89, 105)`.
- **remediationHint:** In `mapListToTheme.ts`, set `MuiListItemIcon` default color to Harmony muted (reference `--text-muted`). On this theme, muted is currently exposed as `palette.text.disabled` (`mutedText`); prefer a muted token path consistent with other components (e.g. Link muted) rather than `text.secondary`.

## Blocked items

None — both review surfaces reachable; Icon dependency synced.

## Verifier notes

- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE (three-column visual matrix).
- Probe dimensions (320×185, padding, selected blue) match on both sides — used as supporting evidence only; visual rows judged from rendered screenshots + browse.
- Demo purity: `ListMenusDemo.tsx` uses `@mui/material` + `HarmonyIcon` directly; `Box sx={{ maxWidth: 320 }}` is neutral docs density only; no local wrappers or fidelity `sx`.
- Manifest: `skippedProps: []`, `gaps: []`, strategy `existing-mui` matches plan `plans/list-menu.md`.
- Example copy differs slightly on Without icons / No Borders descriptions (MUI-oriented wording); not filed — examples and rendered chrome carry the designer signal.
- Status badge `stable` (ref) vs `in progress` (conv) is conversion chrome, not a ListMenu visual defect.
