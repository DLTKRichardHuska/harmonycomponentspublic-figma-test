# Plan: RangeInput filled track resync

| Field | Value |
|-------|-------|
| status | approved |
| conversion | `harmony-design-system-react-mui` |
| scope | `RangeInput` |
| strategy | `existing-mui` (unchanged) |
| date | 2026-07-20 |

## Element strategy

Keep `existing-mui` → `@mui/material/Slider` via theme `mapSliderToTheme.ts`. No package export / Consumer API delta.

## Delta

Reference RangeInput now fills the track with `--theme-primary` up to the thumb (remainder `--border-color`). Conversion previously forced track = rail divider gray (DEF-002 / input-form-controls-2).

**Apply:** `track.backgroundColor` → `var(--mui-palette-primary-main)`; rail stays divider.

## Blocking dependencies

None (Label already synced).

## Verify

Report: `verification/reports/range-input-filled-track-1.md` — PASS.
