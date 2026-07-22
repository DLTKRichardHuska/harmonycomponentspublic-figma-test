# Plan: Label + form inputs (hybrid) — harmony-design-system-shadcn

status: synced (human accepted via plan execute 2026-07-20)  
scope: Label, Input, Textarea, NumberInput, RangeInput  
strategy: `component` (all)  
created: 2026-07-20  
approved: 2026-07-20  
updated: 2026-07-20 (input-form-controls-1 → synced)

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| Label | component | shadcn Label + Field helpers |
| Input | component | shadcn Input (+ adornments) |
| Textarea | component | shadcn Textarea |
| NumberInput | component | cva steppers + Input + Button/Icon |
| RangeInput | component | Radix/shadcn Slider |

## Approach & stack fit (locked)

**Hybrid Consumer API:**

1. **Primitives** — bare `Label`, `Input`, `Textarea`, `NumberInput`, `RangeInput` (no built-in `label`/`labelVariant` on controls).
2. **Field layout** — `Field`, `FieldLabel`, `FieldDescription`, `FieldError` with `orientation` `stacked` | `horizontal`.
3. **Convenience** — `InputField`, `TextareaField`, `NumberField`, `RangeField` for one-shot labeled layouts.

**Stack leverage:** shadcn Field/Input/Textarea/Slider patterns; Tailwind + cva; package Icon + Button.

**Stack friction:** Astro embeds Label on controls → `*Field` only. Specialty Date/Time → callout until DateInput.

## Consumer API (user confirmed)

See Cursor plan `shadcn_label_inputs_2dba716b`. Summary:

- Label: `htmlFor`, `required`, `helper`, children; Field helpers co-exported.
- Input: `error`, `errorMessage`, `icon`, `trailingIcon`, `trailing`; HTML attrs + ref; no label props.
- Textarea: `rows`; no error API; no label props.
- NumberInput: value/onChange, min/max/step, steppers via Button+Icon.
- RangeInput: Radix Slider; showPercent/prefix/suffix.
- `*Field`: label, labelVariant (stacked|inline), helper + control props; useId when id omitted.

## Blocking dependencies

- Icon — synced
- Button — synced (NumberInput steppers)
- Label — in this batch (execute first)

## Out of scope

- Toggle
- DateInput / pickers (UnsupportedEquivalentCallout on specialty demo)

## Execute order

1. Label + Field helpers → `/components/labels`
2. Input + Textarea (+ InputField/TextareaField) → `/components/inputs`
3. NumberInput + RangeInput (+ NumberField/RangeField) → `/components/specialty-inputs`
