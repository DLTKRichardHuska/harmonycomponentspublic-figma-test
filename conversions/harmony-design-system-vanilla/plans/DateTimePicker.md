# Conversion plan — DateTimePicker

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `DateTimePicker` |
| status | `completed` |
| createdAt | `2026-09-11T01:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `44% (24/55)` |

## Summary

Ship catalog DateTimePicker as an open Shadow DOM widget that composes the synced date and time pickers. It is not a form field and is not registered in `harmony-form-layout`. DateInput stays blocked until this element is `synced`.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Approach & production gaps — **resolved:** compose existing widgets; emit when either half changes and the other is already known
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| DateTimePicker | `web-component` | `harmony-datetime-picker` composes `harmony-date-picker` + `harmony-time-picker` |

## Approach & stack fit (user confirmed)

- Open Shadow DOM. Do not reimplement the calendar or clock.
- Not form-associated. No `harmony-form-layout` field registration.
- Not native `input type="datetime-local"`.
- Split `value` / `min` / `max` on `T`. Date half (`YYYY-MM-DD`) goes to the calendar. Time half is `HH:MM` (drop seconds/ms). Date-only min/max still bound the calendar.
- `time-format` (`12`|`24`, default `24`) maps to the time picker’s `format`. `locale` (default `en-US`) goes to the date picker only. `disabled` forwards to both.
- Seed both halves from `value`. Emit `datetime-select` `{ datetime }` (`YYYY-MM-DDTHH:MM`, bubbles+composed) when either half changes and the other half is already known, including an initial value.
- Reflect the combined value on the host. Guard attribute updates so child events do not recurse.
- Child `date-select` / `time-select` stay composed. Do not stop them.
- Keyboard navigation and forced-colors stay on the child widgets. Shadow-local divider border under forced-colors so the two sections remain distinct.
- Demo: “Date and time” section on the Date Picker page. Do not convert Specialty Inputs.

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Astro auto-id | **Skip** — consumer `id` |
| Astro emits only after both halves are picked in that session | **Include** — emit when either half changes and the other is already known |
| Form association | **Skip** until DateInput |
| Native `input type="datetime-local"` | **Skip** |
| Same-day min/max tightening beyond the Astro split | **Skip** |

## Consumer API (user confirmed)

### `harmony-datetime-picker`

| Attr | Values | Default |
|------|--------|---------|
| `value` | `YYYY-MM-DDTHH:MM` | — |
| `min` / `max` | datetime or date-only | — |
| `disabled` | boolean | false |
| `time-format` | `12` \| `24` | `24` |
| `locale` | BCP 47 | `en-US` |

Event: `datetime-select` `{ datetime }`. Parts: `date`, `time`. Not a form control.

Docs: `docs/components/DateTimePicker.md`; CEM; AGENTS / llms catalog map.

## Blocking dependencies

None. DatePicker and TimePicker are `synced`. DateInput is not in this plan.

## Phases

### Phase 1 — Apply

- Port datetime divider CSS; `HarmonyDateTimePicker`
- Register; CEM; docs; AGENTS / llms
- Demo Date Picker page section (empty, prefilled, 12-hour, disabled, readout)

### Phase 2 — Verification

- Verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS datetime-1; human accept 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy + approach + Consumer API |
| User | 2026-09-10 | Explicitly requested implement plan |
| Verifier | 2026-09-10 | datetime-1 PASS |
| User | 2026-09-10 | Visual accept → synced |
