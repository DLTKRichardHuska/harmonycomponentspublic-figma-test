# Conversion plan — date picker primitives

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `PickerPopup` + `DatePicker` + `TimePicker` + `MonthPicker` + `WeekPicker` |
| status | `completed` |
| createdAt | `2026-09-11T00:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `35% (19/55)` |

## Summary

Ship the five unblocked date-picker catalog widgets as open Shadow DOM Custom Elements so a later DateInput plan can compose them and participate in `harmony-form-layout` the same way as `harmony-input`. **DateInput and DateTimePicker stay out of this execute.** These widgets are not form fields and are not native `input type="date"`.

## Open questions

- [x] Next blocker — **resolved:** one plan for all unblocked pickers
- [x] Element strategy — **resolved:** all `web-component`
- [x] Approach & production gaps — **resolved:** Popover API popup; keyboard nav; no form association
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| PickerPopup | `web-component` | `harmony-picker-popup`; Popover API |
| DatePicker | `web-component` | `harmony-date-picker` |
| TimePicker | `web-component` | `harmony-time-picker` |
| MonthPicker | `web-component` | `harmony-month-picker` |
| WeekPicker | `web-component` | `harmony-week-picker` |

## Approach & stack fit (user confirmed)

- Not form-associated. No `harmony-form-layout` field registration in this plan.
- PickerPopup uses the Popover API (`show()` / `hide()`, Escape, light dismiss). Not `harmony-dialog`. Anchor under the `for` trigger (`anchor-name` / `position-anchor`) with a fixed-position JS fallback. Optional `title` + close. Default slot holds a picker. Trigger is any element id — not hardcoded `.date-input-wrapper`.
- Calendars and time port reference CSS (without range-day modifiers). Nav uses `harmony-icon`. `locale` via `Intl` where practical.
- Events bubble and compose: `date-select` `{date}` `YYYY-MM-DD`; `time-select` `{time}` `HH:MM`; `month-select` `{value}` `YYYY-MM`; `week-select` `{value}` `YYYY-Www`.
- Keyboard grid/list navigation for WCAG 2.3 AA.
- Forced-colors: shadow-local (focus `outline: 2px solid Highlight`, selected, disabled; suppress shadow-only affordances).
- Demo Date Picker page shows standalone widgets + popup composition. DateInput, DateTimePicker, and internal DateRange stay callouts.

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Astro auto-id | **Skip** — consumer `id` |
| DateRangePicker / DateRangePickerExpanded | **Skip** — internal, not catalog |
| `.date-picker__day--range-*` on DatePicker | **Skip** |
| Native `input type=date\|time\|month\|week` dual path | **Skip** on these widgets |
| Form association | **Skip** until DateInput |
| Astro `.is-open` class toggle | **Omit** — Popover API |
| `aria-modal="true"` on a non-modal popup | **Omit** — `role="dialog"` without modal (Popover `auto`) |

## Consumer API (user confirmed)

### `harmony-picker-popup`

| Attr / method | Values | Default |
|---------------|--------|---------|
| `for` | trigger element id | — |
| `open` | boolean (reflected) | false |
| `title` | string | — |
| `show()` / `hide()` | methods | — |

Event: `toggle` `{ open }`. Slot: default. Part: `panel`. Not a form control.

### `harmony-date-picker`

Attrs: `value`, `min`, `max`, `disabled`, `locale` (default `en-US`). Event: `date-select` `{ date }`. Parts: `header`, `grid`.

### `harmony-time-picker`

Attrs: `value` (`HH:MM`), `min`, `max`, `disabled`, `format` (`12` \| `24`, default `24`), `step` (default `1`). Event: `time-select` `{ time }`.

### `harmony-month-picker` / `harmony-week-picker`

Attrs: `value`, `min`, `max`, `disabled`, `locale` (default `en-US`). Events: `month-select` `{ value }` / `week-select` `{ value }`.

Docs: `docs/components/{PickerPopup,DatePicker,TimePicker,MonthPicker,WeekPicker}.md`; CEM; AGENTS / llms catalog map.

## Blocking dependencies

None for this scope. Icon is `synced`. These five are `synced`. DateTimePicker and DateInput can be planned next.

## Phases

### Phase 1 — Apply

- Port picker CSS into shadow sheets; `HarmonyPickerPopup`, `HarmonyDatePicker`, `HarmonyTimePicker`, `HarmonyMonthPicker`, `HarmonyWeekPicker`
- Register; CEM; docs; AGENTS / llms
- Demo `/components/date-picker` (widgets + popup; DateInput/range callouts)

### Phase 2 — Verification

- Verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS date-pickers-2; human accept 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy + approach + Consumer API |
| User | 2026-09-10 | Explicitly requested implement plan |
| Verifier | 2026-09-10 | date-pickers-2 PASS |
| User | 2026-09-10 | Visual accept → synced |
