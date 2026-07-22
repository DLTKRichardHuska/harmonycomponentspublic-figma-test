# Plan: Toggle, Dropdown, Accordion — harmony-design-system-shadcn

status: approved  
scope: Toggle, Dropdown, Accordion  
strategy: `component` (all)  
created: 2026-07-20  
approved: 2026-07-20

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| Toggle | component | `@radix-ui/react-switch` → shadcn Switch |
| Dropdown | component | `@radix-ui/react-select` → export as **Select** (demo `/components/dropdowns`) |
| Accordion | component | `@radix-ui/react-accordion` → shadcn Accordion compound |

## Approach & stack fit (locked)

- Add Radix deps: `@radix-ui/react-switch`, `@radix-ui/react-select`, `@radix-ui/react-accordion`.
- Tailwind + cva; package `Icon` for chevrons (no Lucide).
- **Hybrid C labels** (same as Input/Checkbox): bare controls have no `label` / `labelVariant`; compose `Field` / `FieldLabel`; ship `*Field` convenience.
- Reuse existing dropdown tokens (`--dropdown-*`, `--shadow-dropdown`, `--z-dropdown`).

## Consumer API (user confirmed)

### Toggle
- Bare Radix Switch: `checked` / `onCheckedChange`, `disabled`, `name` / `id`, `size` `sm` \| `md`, HTML/aria attrs + ref.
- No `label` on bare Toggle.
- **`ToggleField`:** `label`, helper, required + Toggle props (Field composition).
- **Skip:** `variant="segmented"` and `optionLabelLeft` / `optionLabelRight` → `UnsupportedEquivalentCallout` on demo.

### Dropdown → Select
- Export name: **`Select`** (catalog element remains Dropdown; demo title “Dropdown”).
- **shadcn Select pattern for options:** compound `Select` / `SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem` (and Group/Label/Separator if needed). Authors compose `SelectItem` children — **no Astro `options[]` package API**, **no `trigger` / `option-*` slots**.
- Value API: Radix `value` / `onValueChange` / `defaultValue`; `placeholder` on `SelectValue`; `disabled`, `name`.
- Chevron: package `<Icon name="chevron-down" />`.
- **`SelectField`:** `label`, `labelVariant` `stacked` \| `inline`, helper + Select composition (match InputField / CheckboxField hybrid).

### Accordion
- **shadcn compound only:** `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent`.
- `type="single"` \| `"multiple"` maps Astro `allowMultiple` (default single).
- Controlled/uncontrolled: Radix `value` / `defaultValue` / `onValueChange`.
- Optional group label via Field / legend composition (not Astro `items[]`).
- **No** Astro `items[]` or `item-0…9` slots — rich bodies are React children in `AccordionContent`.
- Expand chevron: package `Icon` `chevron-down` with open rotate.

## Blocking dependencies

None (Icon synced, Label synced).

## Skipped / gaps

- Toggle segmented variant
- Dropdown Astro slots + `options[]` prop API
- Accordion Astro `items[]` / item slots

## Execute order

1. Toggle + ToggleField → `/components/toggle-switches`
2. Select + SelectField → `/components/dropdowns`
3. Accordion compound → `/components/accordion`
4. Docs / AI artifacts; update conversion.manifest.json
5. Verify → human accept → synced → compute_coverage
