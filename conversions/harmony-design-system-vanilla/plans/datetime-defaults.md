# Conversion plan — date/time defaults and helpers

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | DateTime defaults + JS helpers (Consumer API delta) |
| status | `completed` |
| createdAt | `2026-09-11T15:30:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

App-wide `locale` / `timeFormat` defaults (JS module + optional `html` data attrs) and native `Date` / `Intl` helpers (`valueAsDate`, get/set helpers, adapter hook) for DateInput and all picker widgets.

## Element strategy

Not a new catalog element. Delta on existing web-component date surfaces.

## Consumer API (user confirmed)

- `setDateTimeDefaults` / `getDateTimeDefaults` / `initDateTimeDefaults`
- `data-harmony-locale` / `data-harmony-time-format` on `<html>`
- `valueAsDate` on date family hosts
- Module helpers: `getDateValue`, `setDateValue`, `getMachineValue`, `setMachineValue`, `formatDisplay`
- `setDateTimeAdapter` / `getDateTimeAdapter` / `createNativeAdapter` (native only in this ship)

## Blocking dependencies

None.

## Approval

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-11 | 1B JS+doc attrs; 2B all picker widgets + DateInput |
| User | 2026-09-11 | Explicitly requested implement plan |
