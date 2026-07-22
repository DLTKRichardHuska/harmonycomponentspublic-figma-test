# Cards and Dialogs — harmony-design-system-shadcn

status: synced (human accepted visual match 2026-07-20)  
scope: Card, Dialog  
strategy: `component` (both)  
created: 2026-07-20  
approved: 2026-07-20  

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| Card | component | shadcn Card (compound) + cva |
| Dialog | component | shadcn Dialog + `@radix-ui/react-dialog` |

## Consumer API (user confirmed)

Dual-path (Alert-style): shadcn composition first-class; convenience props additive. Compound children win.

### Card
- Compound: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` + `cardVariants`
- Harmony: `elevated`, `interactive`, `primary`
- Convenience: `title`, `description` when not composing `CardHeader`
- Header actions via `CardAction` + `Button`/`Icon` (no Astro `icon1`/`icon2`/`icon3`)
- Inherited: HTML attrs + ref; root `asChild`

### Dialog
- Radix Dialog exports + `DialogBody` + `dialogContentVariants`
- Harmony: `DialogHeader` `variant` `default`|`primary`; `DialogFooter` `buttonAlignment`
- Convenience footer: `confirmLabel` / `onConfirm` / `cancelLabel` / `onCancel` / `tertiaryLabel` / `onTertiary`
- Controlled: `open` / `onOpenChange`
- Close: `Icon name="x-mark"`
- Gaps: `resizable`; Astro globals / callback name strings

## Blocking dependencies

- Icon — synced
- Button — synced

## Out of scope

- KanbanCard, KanbanCardCostpoint, Kanban

## Execute order

1. Card → `/components/cards`
2. Dialog → `/components/dialogs`
3. Verify → human accept → synced
