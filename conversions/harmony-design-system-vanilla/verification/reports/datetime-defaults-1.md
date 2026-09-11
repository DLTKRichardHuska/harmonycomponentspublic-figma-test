# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | DateTime defaults + JS helpers (API delta) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T15:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/datetime-defaults.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 0 |

**Result:** PASS

Smoke: native adapter round-trips date/time/datetime/month/week. Browser probe on `/components/date-picker`: `valueAsDate` sets machine `2024-01-15`; helpers match; `setDateTimeDefaults({ locale: 'fr-FR', timeFormat: '12' })` updates `field.locale` and `timePicker.format`. No page errors.

Artifacts: `verification/artifacts/datetime-defaults-1/probe.json`

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | human |
| Notes | Visual accept 2026-09-11 (“looks good”). Marked synced. |
