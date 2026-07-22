# Avatar

Harmony user avatar — stock [shadcn Avatar](https://ui.shadcn.com/docs/components/avatar) primitives (`AvatarImage` / `AvatarFallback`) plus a convenience `Avatar` with icon / initials / image modes.

## Import

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  avatarVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props (convenience `Avatar`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensions / radius tokens |
| `variant` | `'icon' \| 'initials' \| 'image'` | `'icon'` | Content mode |
| `initials` | `string` | — | Source string normalized to 1–2 letters |
| `src` | `string` | — | Image URL when `variant="image"` |
| `alt` | `string` | `''` | Accessible name for image / overall avatar |
| `interactive` | `boolean` | `false` | Render as `<button>` (e.g. menu trigger) |
| `disabled` | `boolean` | `false` | When `interactive` |
| `onClick` | handler | — | When `interactive: true` |
| `className` | `string` | — | Extra classes |
| `children` | `ReactNode` | — | Override default content (advanced) |

### Compound exports

| Export | Role |
|--------|------|
| `AvatarImage` | Radix image — `ImgHTMLAttributes` |
| `AvatarFallback` | Radix fallback slot — `HTMLAttributes` + `children` |
| `avatarVariants` | `cva` size shell |

## Inherited / events / polymorphism

| Mode | Element | Surface |
|------|---------|---------|
| Default | `<div role="img">` | `HTMLAttributes` |
| `interactive` | `<button type="button">` | `ButtonHTMLAttributes` — `onClick`, `disabled`, … |

```tsx
<Avatar variant="icon" size="md" />
<Avatar variant="initials" initials="Ada Lovelace" />
<Avatar variant="image" src="/avatar.jpg" alt="Ada" />
<Avatar interactive onClick={() => openMenu()} initials="AL" />
```

## Behavior notes

- **Fallbacks:** `initials` without usable letters → icon; `image` without `src`/children → icon. Image mode uses Radix root + `AvatarImage` / `AvatarFallback` (fallback = package `user` icon).
- **Initials:** multi-word → first + last initial; short string uppercased.
- **Compound API:** nest `AvatarImage` / `AvatarFallback` yourself when you need full stock control — still prefer Harmony tokens via `avatarVariants` / convenience sizes.

## Composition recipes

```tsx
{/* Convenience — image mode wires AvatarImage + AvatarFallback internally */}
<Avatar variant="image" src={url} alt="User" size="lg" />
<Avatar variant="initials" initials="RH" size="md" />

{/* With notification dot */}
<span className="relative inline-flex">
  <Avatar variant="initials" initials="RH" />
  <span className="absolute -bottom-0.5 -right-0.5">
    <NotificationBadge type="dot" variant="error" border />
  </span>
</span>
```

`AvatarImage` / `AvatarFallback` are also public for stock-style composition inside a Radix Avatar root when you need custom fallback content beyond the convenience API.

## If you were about to use stock shadcn Avatar

| Stock shadcn | Harmony |
|--------------|---------|
| `Avatar` + `AvatarImage` + `AvatarFallback` | Same exports + convenience `Avatar` props |
| Size via `className="size-*"` | `size="sm" \| "md" \| "lg"` |
| Initials / icon as custom children | `variant="initials" \| "icon"` (+ `initials`) |
| Wrap in button yourself | `interactive` + `onClick` |
| Lucide user icon | Package `Icon` `user` (default icon mode) |

## Do not

- Import Lucide for avatar glyphs — use `variant="icon"` or Harmony `Icon` in fallbacks
- Skip `alt` / rely on empty labels for image avatars in accessible UIs
- Use `Badge` where you need a photo/initials avatar
