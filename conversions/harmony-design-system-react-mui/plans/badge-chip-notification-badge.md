# Plan: Badge, Chip, NotificationBadge

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Badge, Chip, NotificationBadge

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Badge | custom | `StatusBadge` in `src/components/` |
| Chip | existing-mui | `@mui/material/Chip` + `mapChipToTheme.ts` |
| NotificationBadge | existing-mui | `@mui/material/Badge` + `mapNotificationBadgeToTheme.ts` |

## Prop mappings

### Badge → StatusBadge

| Harmony | StatusBadge |
|---------|-------------|
| variant | variant (same values) |
| size | size (`small` \| `medium` \| `large`) |
| icon | icon (Harmony icon name) |
| slot / children | children |

### Chip → MUI Chip

| Harmony | MUI Chip |
|---------|----------|
| variant fill | variant="filled" |
| variant outline | variant="outlined" |
| size sm | size="small" |
| size md | size="medium" |
| state disabled | disabled |
| removable | onDelete |
| icon | icon={<HarmonyIcon />} |
| label / slot | label / children |

### NotificationBadge → MUI Badge

| Harmony | MUI Badge |
|---------|-----------|
| type dot | variant="dot" |
| type number | badgeContent={value} |
| type overflow | badgeContent="99+" |
| variant primary | color="primary" |
| variant error | color="error" |
| border | overlap="circular" + theme border ring |
| value | badgeContent |

## Composite equivalents (demo-only)

| Harmony | MUI composition |
|---------|-----------------|
| Chip type overflow | `<Chip label={\`+${count}\`} />` |
| Chip type horiz-dots | `<Chip icon={<HorizDotsSvg />} />` |
| Chip type vert-dots | `<Chip icon={<VertDotsSvg />} />` |
| NotificationBadge standalone | `<Badge><IconButton>…</IconButton></Badge>` |

## Skipped props

- Chip `size="lg"` — MUI Chip has only small/medium
- Chip `state` hover/focused/pressed — MUI uses CSS pseudo-states
- Chip `selected` (legacy)
- NotificationBadge `size` sm/lg — no native MUI size prop; theme targets md

## Blocking dependencies

- Icon — synced

## User decisions

- Badge: custom StatusBadge (not MUI Chip or Badge)
- Chip special types: composite in demo (no package export)
- Chip state: skip static states; use MUI disabled for disabled
- NotificationBadge: wrapped demos on Icon/Avatar only
