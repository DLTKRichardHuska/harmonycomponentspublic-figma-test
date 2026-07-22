# Accordion

Radix Accordion + Harmony tokens. Compound API only — no Astro `items[]`. Chevron uses package **Icon** `chevron-down`. Open/close uses shadcn height animation (`animate-accordion-down` / `animate-accordion-up`) from the Harmony Tailwind preset.

## Import

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<Accordion type="single" collapsible defaultValue="a">
  <AccordionItem value="a">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Body content</AccordionContent>
  </AccordionItem>
</Accordion>

{/* Multi-expand (Astro allowMultiple) */}
<Accordion type="multiple" defaultValue={['a']}>
  <AccordionItem value="a">…</AccordionItem>
  <AccordionItem value="b" disabled>…</AccordionItem>
</Accordion>
```

For a group label, wrap with `role="group"` + `aria-labelledby` (see demo).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | — | Exclusive vs multi-expand |
| `value` / `defaultValue` | `string \| string[]` | — | Open item value(s) |
| `onValueChange` | `fn` | — | Radix change handler |
| `collapsible` | `boolean` | — | Allow closing the open item (`type="single"`) |
| `AccordionItem.value` | `string` | — | Required identity |
| `AccordionItem.disabled` | `boolean` | `false` | Lock section |
| `className` | `string` | — | On Root / Item / Trigger / Content |
| `ref` | — | — | Forwarded on Root / Item / Trigger / Content |

## Events / polymorphism

Radix Accordion controlled API. Chevron rotates via `group-data-[state=open]:rotate-180` + `transition-transform`. No `items[]` convenience API.

Demo: `/components/accordion`.

**Omitted:** Astro `items[]`, `item-*` slots, built-in `label` prop (compose externally).

## If you were about to use stock shadcn Accordion

| Stock / mistaken | Harmony |
|------------------|---------|
| Lucide chevron | Package `<Icon name="chevron-down" />` |
| Astro `items={[{ title, content }]}` | Compose `AccordionItem` / `Trigger` / `Content` |
| Built-in `label` prop | External group label + `aria-labelledby` |

## Do not

- Invent an `items[]` package API without Consumer API sign-off
- Import Lucide for expand icons
