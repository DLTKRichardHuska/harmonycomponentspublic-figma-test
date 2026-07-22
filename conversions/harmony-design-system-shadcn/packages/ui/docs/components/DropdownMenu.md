# DropdownMenu

Radix Dropdown Menu + Harmony tokens. A small action menu (kebab / overflow) used by **TabStrip**. It is NOT the catalog Dropdown — catalog Dropdown maps to **Select**. `DropdownMenu` independently inlines the same Tailwind token utilities as `Select` (`bg-card`, `text-foreground`, `bg-hover`, `border-border`) so all popovers look identical, per shadcn copy-paste convention (no shared style module).

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="xs" icon="ellipsis-vertical" aria-label="More" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={openNewWindow}>Open in new window</DropdownMenuItem>
    <DropdownMenuItem onSelect={setDefault}>Set as default</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Props

Thin wrappers over `@radix-ui/react-dropdown-menu`. `DropdownMenuContent` defaults `sideOffset={4}` and portals. `DropdownMenuItem` uses `onSelect`. All accept `className` / `ref`.

## Do not

- Use for the catalog Dropdown / a `<select>` replacement — use **Select**
- Extract a shared menu-style module or refactor `Select`
- Import Lucide for the trigger icon
