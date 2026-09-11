# Conversion plan — Select (catalog Dropdown)

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Dropdown` (consumer **Select**) |
| status | `completed` (human accept 2026-09-10; Dropdown synced) |
| createdAt | `2026-09-11T00:18:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `33% (18/55)` |

## Summary

Ship catalog **Dropdown** as a vanilla **Select** dual path: product CSS styles native `<select>` (and `.select`) with Input closed-field chrome, plus form-associated `<harmony-select>`. Options are light-DOM `<option>` / `<optgroup>`. The open list is the OS picker. `harmony-select` participates in `harmony-form-layout` the same way as `harmony-input`.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Consumer API — **resolved:** native select CSS + `harmony-select`; **no `multiple`** (revised 2026-09-10)
- [x] Open list — **resolved:** OS picker (custom Astro listbox skipped)

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Dropdown (consumer Select) | `web-component` | Dual path: native `<select>` defaults + `harmony-select` |

## Approach & stack fit (user confirmed)

- Native: unclassed `select` + `.select` share Input height, padding, border, radius, focus, disabled. `appearance: none` + CSS chevron. Do not restyle `option` / `optgroup` / OS menu.
- CE: open Shadow DOM; `formAssociated` + `ElementInternals`; `delegatesFocus`; retarget `input`/`change`
- Default slot: light-DOM `<option>` / `<optgroup>` copied into the shadow control (not moved)
- `placeholder`: disabled empty first option
- `label` + `label-variant` outside `harmony-form-layout`; layout owns positioning inside it
- `multiple` is **not** a `harmony-select` feature (attribute is removed). Native `<select multiple>` is left to the platform and is not styled as a Harmony field.
- Forced-colors: document CSS for native select; shadow-local on the CE; OS chrome restored under HC

## Production gaps (user confirmed)

| Gap vs Astro Dropdown | Decision |
|-----------------------|----------|
| Custom `.dropdown__menu` listbox | **Skip** — OS picker |
| Trigger slot | **Skip** |
| `option-0`…`option-9` slots | **Skip** |
| Kanban CP menu positioning | **Skip** (later custom Dropdown if needed) |
| Astro auto-id | **Skip** — consumer `id` |
| Host is not `HTMLSelectElement` | **Accepted** — ElementInternals |

## Consumer API (user confirmed)

### Native

```html
<label class="label" for="country">Country</label>
<select id="country" name="country">
  <option value="" disabled selected>Select a country</option>
  <option value="us">United States</option>
</select>
```

### `<harmony-select>`

| Attr | Values | Default |
|------|--------|---------|
| `name` / `value` / `id` | string | — |
| `placeholder` | string | — |
| `disabled` / `required` / `error` | boolean | false |
| `error-message` | string | — |
| `label` | string | — |
| `label-variant` | inline \| stacked | stacked; CP unset → inline; ignored inside form layout |

Events: retargeted `input` / `change`. Parts: `label`, `control`, `error`.

```html
<harmony-form-layout label-layout="inline">
  <harmony-form-row>
    <harmony-input id="first" name="first" label="First Name" required></harmony-input>
    <harmony-select id="country" name="country" label="Country" placeholder="Select a country">
      <option value="us">United States</option>
    </harmony-select>
  </harmony-form-row>
</harmony-form-layout>
```

## Blocking dependencies

None. Label, Icon, Input, Textarea, and conversion-only `harmony-form-layout` / `harmony-form-row` are `synced`.

## Phases

### Phase 1 — Apply

- Native `select` / `.select` in `input.css`; shadow select rules in `input-field.css`
- `HarmonySelect`; register; form-layout field recognition
- CEM; docs; AGENTS / llms catalog map (Dropdown → Select)

### Phase 2 — Demo

- `/components/dropdowns` (`DemoDropdownsPage`)
- Country select on Inputs form-layout examples

### Phase 3 — Verification

- Closed-field chrome vs Input / Astro trigger. Do not FAIL because the open list is the OS picker.
- Human visual accept before `synced`.

## Approval

**Status: approved** — execute requested 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy `web-component`; Consumer API. `multiple` later removed from CE and demo |
| User | 2026-09-10 | Explicitly requested implement/execute |
