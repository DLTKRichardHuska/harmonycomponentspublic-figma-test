# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ListMenu` |
| iteration | `2` |
| artifactType | `image` |
| generatedAt | `2026-07-20T23:14:03.396Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 1 |

**Result:** PASS

**PASS: zero conversion defects.**

CP × light. Strategy `existing-mui` (List + ListItemButton + `divider`). Icon dependency `synced`. No skipped props. Do **not** mark ListMenu `synced` — human confirmation via AskQuestion still required.

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
| Section: Accessibility | present | Converted adds a11y cards (reference has none on this page — OK extra) |

**Content gaps (open):** 0

## Visual parity

CP × light. Judged from live browse + per-example screenshots (not probe alone). DEF-001 re-checked with live `getComputedStyle` on SVG icons.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Shell — width / radius / border | ~320px, 8px radius, 1px gray border, paper fill | Same 320 / 8px / matching border / paper | present |
| Item padding / type | 12×16 padding, 14px label, primary text | Matching padding, type, primary text | present |
| Selected row | Full-width primary blue fill, white label + white icon | Matching primary blue + white chrome | present |
| Separators (default / links) | 1px dividers between items; none under last | Matching dividers via `divider` prop | present |
| No Borders | Outer border kept; **no** item separators | Matching — outer border, no separators | present |
| Icon size / placement | 20×20 icons, left inset, gap to label | Matching size, inset, gap | present |
| Unselected icon color | Muted gray (`#6B7280` / `--text-muted`) | Matching muted gray (`#6B7280` / `text.disabled`) | present |
| Without-icons label inset | Labels at left padding (no icon column) | Matching left-aligned labels | present |
| Link items | Same chrome as button items (icons + selected) | Matching via `component="a"` | present |

**Visual gaps (open):** 0

## Side-by-side visual summary

| Example | Designer takeaway |
|---------|-------------------|
| Basic List Menu | Layout, selected blue, dividers, sizing, and **unselected icon mute** match |
| Without icons | Label-only rows match reference |
| With Links | Link composition matches button chrome; icons muted correctly |
| No Borders | Separators correctly omitted; outer border retained; icons muted correctly |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | user |
| Notes | Human accepted ListMenu-2 PASS; marked `synced` 2026-07-20. |

## Defects

### DEF-001

- **status:** fixed
- **category:** tokens / visual
- **reference:** Unselected list-item icons render as muted gray (`#6B7280`, Harmony `--text-muted`)
- **converted:** Unselected `ListItemIcon` / `HarmonyIcon` now render the same muted gray (`#6B7280`, `theme.palette.text.disabled`) — prior FAIL was `#525969` / `text.secondary`
- **description:** Designer no longer sees a darker unselected icon on conversion. Live CP light measure: ref and conv unselected SVG `color` both `rgb(107, 114, 128)`.
- **evidence:** Live `:4321` vs `:5176` Basic / With Links / No Borders; screenshots; live Playwright re-measure after remediating `mapListToTheme.ts` `MuiListItemIcon` → `text.disabled`.
- **remediationHint:** (applied) `MuiListItemIcon` color uses `var(--mui-palette-text-disabled)` for Harmony muted.

## Blocked items

None — both review surfaces reachable; Icon dependency synced.

## Verifier notes

- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
- Demo purity: `ListMenusDemo.tsx` uses `@mui/material` + `HarmonyIcon` directly; `Box sx={{ maxWidth: 320 }}` is neutral docs density only.
- Manifest: `skippedProps: []`, `gaps: []`, strategy `existing-mui`; Icon `synced`.
