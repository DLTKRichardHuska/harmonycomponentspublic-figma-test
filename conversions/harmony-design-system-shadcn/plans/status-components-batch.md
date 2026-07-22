# Status components batch — harmony-design-system-shadcn

status: synced (batch complete — human accepted all elements 2026-07-19)  
scope: ProgressBar, ButtonGroup, Badge, NotificationBadge, Chip, Avatar, Alert + demo Badge chrome  
strategy: `component` (all)  
created: 2026-07-18  
approved: 2026-07-18

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| ProgressBar | component | shadcn Progress / Radix |
| ButtonGroup | component | shadcn Button Group |
| Badge | component | shadcn Badge |
| NotificationBadge | component | Badge counter pattern |
| Chip | component | cva (no stock Chip) |
| Avatar | component | shadcn Avatar |
| Alert | component | shadcn Alert |

## Locked decisions

See Cursor plan `shadcn_status_components_f77554f9` — AI-first sizes, `*Variants`, compound Alert/Avatar exports, Badge `sm|md|lg`, Alert `appearance`, Chip omit legacy `selected` / static states.

## Consumer API

Confirmed in Cursor plan. Blocking: Alert after ProgressBar synced. Badge unlocks demo chrome.

## Execute order

1. ProgressBar → 2. ButtonGroup / Badge / NotificationBadge / Chip / Avatar → 3. Alert → 4. Demo badges
