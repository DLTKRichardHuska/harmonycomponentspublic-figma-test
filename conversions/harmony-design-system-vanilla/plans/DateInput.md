# Conversion plan — DateInput

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `DateInput` |
| status | `completed` |
| createdAt | `2026-09-11T01:48:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `51% (28/55)` |

## Summary

Ship catalog DateInput as a form-associated field that composes the synced picker popup and widgets. It participates in `harmony-form-layout` the same way as `harmony-input`. Date range stays out of scope. Specialty Inputs stays unconverted.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Approach & production gaps — **resolved:** see below
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| DateInput | `web-component` | `harmony-date-input` composes synced picker popup + widgets; form-associated |

## Approach & stack fit (user confirmed)

- Open Shadow DOM. `static formAssociated = true` and `ElementInternals`, same pattern as `harmony-input`.
- Not native `input type="date"`. Do not reimplement the calendar, clock, or popup.
- Port field chrome from `DateInput.astro` and `.date-input` / `.date-input-wrapper` / `.date-input-wrapper__icon`. Skip `.theme-cp` selectors.
- Size the control with `--harmony-field-height` (and the other `--harmony-field-*` metrics) so product flatten (CP 20px) applies. Place the icon like the input trailing icon, not the CP-only offset.
- `type` picks the widget: `date` → `harmony-date-picker`, `time` → `harmony-time-picker`, `datetime-local` → `harmony-datetime-picker`, `month` → `harmony-month-picker`, `week` → `harmony-week-picker`. Forward `value`, `min`, `max`, `disabled`, `locale`. `time-format` maps to `format` / `time-format` on the time and datetime widgets only.
- Visible control: readonly text input (no `name`) plus `harmony-icon` (`calendar`, or `clock` when `type="time"`). Placeholders: Select date, Select time, Select date & time, Select month, Select week.
- Display text is locale-formatted. Form value and `value` attr stay the machine string.
- Popup is `harmony-picker-popup` inside the same shadow root, `for` the field id. Open on field click, icon click, Enter, Space, or ArrowDown. Close on `date-select`, `month-select`, and `week-select`. Time and datetime stay open after selection. Escape and light dismiss stay on the Popover API. Do not port `.is-open`.
- On commit: set host `value`, `setFormValue`, emit `input` and `change` with the machine value (bubbles+composed). Do not add a second public picker event on the field.
- `label` / `label-variant` match `harmony-input`. Inside `harmony-form-layout`, hide the shadow label via `:host-context`. Register `HARMONY-DATE-INPUT` in form-layout field detection and document selectors so the label column and required mark line up with `harmony-input`.
- `required` sets internals validity and the layout asterisk. Disabled blocks open and forwards to the widget and icon button.
- Forced-colors: shadow-local focus outline on the field and a non-hue-only disabled state. Keyboard nav inside the popup stays on the child widgets.

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Astro auto-id | **Skip** — consumer sets `id`; layout still wires `for` |
| `labelFor` | **Skip** |
| Automatic CP inline labels | **Skip** — no product detection |
| Native `input type=date\|time\|datetime-local\|month\|week` dual path | **Skip** |
| `time-format` on field text | **Skip** — popup clock only; field text stays 24-hour |
| `error` attr | **Skip** |
| Date range pickers | **Skip** — not catalog elements |
| Specialty Inputs | **Skip** — out of this execute |

## Consumer API (user confirmed)

### `harmony-date-input`

| Attr | Values | Default |
|------|--------|---------|
| `type` | `date` \| `time` \| `datetime-local` \| `month` \| `week` | `date` |
| `value` | machine string (`YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM`, `YYYY-MM`, `YYYY-Www`) | — |
| `name` | form name | — |
| `id` | consumer id (no auto-id) | — |
| `min` / `max` | same shape as `value` | — |
| `disabled` | boolean | false |
| `required` | boolean | false |
| `label` | string | — |
| `label-variant` | `inline` \| `stacked` | stacked (CP kits: inline when unset; ignored inside `harmony-form-layout`) |
| `time-format` | `12` \| `24` | `24` |
| `locale` | BCP 47 | `en-US` |

Events: `input`, `change` — machine value, bubbles and composed. Parts: `field`, `icon`, `popup`. Form value is the machine string, not the display text.

Docs: `docs/components/DateInput.md`; CEM; AGENTS / llms. Note the form-layout delta in Input docs only if that page claims an exclusive field list.

## Blocking dependencies

None. Icon, Label, DatePicker, TimePicker, DateTimePicker, MonthPicker, WeekPicker, and PickerPopup are `synced`.

## Phases

### Phase 1 — Apply

- Port field CSS; `HarmonyDateInput`; register; form-layout; CEM; product copy
- Demo Date Picker page field examples (date, time, datetime-local, month, week, min/max, disabled, labeled, one form-layout row beside `harmony-input`). Leave the date-range callout.
- Docs, AGENTS, llms. Manifest `in-progress`. Do not mark `synced` until verifier PASS and human visual accept.

### Phase 2 — Verification

- Capture Date Picker page (light, dark, forced-colors), including an open popup and a form-layout row
- Delegate compare to the vanilla fidelity verifier
- Human visual accept before `synced`

## Approval

**Status: completed** — verifier PASS date-input-1; human accept 2026-09-11 (“looks good”).

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy + approach + Consumer API |
| User | 2026-09-10 | Explicitly requested implement plan |
| Verifier | 2026-09-11 | date-input-1 PASS |
| User | 2026-09-11 | Visual accept → synced |
