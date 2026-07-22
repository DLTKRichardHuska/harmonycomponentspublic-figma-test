# TabStrip (Tabs)

Radix Tabs compound + Harmony tokens. Composition-first: replace the Astro `tabs[]` array, named content slots, and custom DOM events with `TabsTrigger` / `TabsContent`, the `actions` slot, `TabsAddButton`, and React callbacks. Kebab/overflow menus use the standalone **DropdownMenu** (styled to match **Select**).

## Import

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsAddButton,
  useTabOverflow,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="features" icon="star">Features</TabsTrigger>
    <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
    <TabsAddButton onClick={addTab} />
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="features">…</TabsContent>
</Tabs>
```

Per-tab actions (compose Button / DropdownMenu into the `actions` slot):

```tsx
<TabsTrigger
  value="docs"
  actions={
    <>
      <Button variant="ghost" size="xs" icon="x-mark" aria-label="Close" onClick={close} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="xs" icon="ellipsis-vertical" aria-label="More" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={setDefault}>Set as default</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  }
>
  Documents
</TabsTrigger>
```

Auto overflow (compose `useTabOverflow` + `DropdownMenu`):

```tsx
const { containerRef, hiddenFrom, hasOverflow } = useTabOverflow(tabs.length, { reserve: 150 });
<TabsList ref={containerRef}>
  {tabs.map((t, i) => (
    <TabsTrigger key={t.value} value={t.value} className={i >= hiddenFrom ? 'hidden' : undefined}>
      {t.label}
    </TabsTrigger>
  ))}
  {hasOverflow && (/* DropdownMenu listing tabs where index >= hiddenFrom */)}
</TabsList>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `Tabs.value` / `defaultValue` | `string` | — | Controlled / uncontrolled active tab |
| `Tabs.onValueChange` | `(value: string) => void` | — | Replaces `tab-strip:tab-selected` |
| `Tabs.orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Radix orientation |
| `TabsList.variant` | `'default' \| 'compact' \| 'pill'` | `'default'` | Pill selected state is VP-only (other products keep the underline) |
| `TabsList.iconPosition` | `'left' \| 'right' \| 'top'` | — | Enforce one icon position for all triggers |
| `TabsList.overflow` | `'none' \| 'scroll'` | `'none'` | `scroll` = horizontal scroll. For auto move-into-menu, compose `useTabOverflow` |
| `TabsTrigger.value` | `string` | — | Required tab identity |
| `TabsTrigger.icon` | `string` | — | Harmony Icon name |
| `TabsTrigger.iconPosition` | `'left' \| 'right' \| 'top'` | `'left'` | Per-trigger icon position |
| `TabsTrigger.disabled` | `boolean` | `false` | Disable the tab |
| `TabsTrigger.actions` | `ReactNode` | — | Per-tab toolbar (compose Button / DropdownMenu) |
| `TabsContent.value` | `string` | — | Panel tied to a trigger value |
| `TabsAddButton` | Button props | — | Add-tab button composed inside TabsList |

## Events → callbacks

| Reference event | shadcn equivalent |
|-----------------|-------------------|
| `tab-strip:tab-selected` | `Tabs onValueChange` |
| `tab-strip:add-tab` | `TabsAddButton onClick` |
| `tab-strip:close-tab` | `actions` close `Button onClick` |
| `tab-strip:open-new-window` | `actions` open `Button onClick` |
| `tab-strip:set-default` | `DropdownMenuItem onSelect` |

## Divergences (not skips)

- `tabs[]` data array → compound `TabsTrigger` children.
- named content slots → `TabsContent`.
- overflow `auto`/`manual` → `useTabOverflow` hook + composed `DropdownMenu` (or `overflow="scroll"`).

Demo: `/components/tab-strip`.

## If you were about to use stock shadcn

| Stock / mistaken | Harmony |
|------------------|---------|
| Lucide icons | Package `Icon` name string (`icon` prop) or compose `<Icon />` as a child |
| `tabs={[{ id, label }]}` | Compose `TabsTrigger` children |
| Custom DOM events | React callbacks / composed handlers |
| Reuse `Select` for kebab menu | Standalone `DropdownMenu` |

`TabsTrigger` also supports the stock patterns: compose an icon as a child (`<TabsTrigger value="x"><Icon name="home" /> Home</TabsTrigger>`) and `asChild` for router links (`<TabsTrigger value="x" asChild><Link to="/x">Label</Link></TabsTrigger>`).

## Do not

- Invent a `tabs[]` package API without Consumer API sign-off
- Extract a shared menu-style module or refactor `Select` (DropdownMenu inlines the same tokens)
- Import Lucide for tab/menu icons
