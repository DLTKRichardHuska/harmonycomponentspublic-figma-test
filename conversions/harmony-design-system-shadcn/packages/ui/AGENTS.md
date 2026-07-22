# AGENTS.md — @dltkrichardhuska/harmony-design-system-shadcn

Harmony Design System for **AI-assisted greenfield apps** on **shadcn/ui patterns + Tailwind + Radix**.

## Choose a product first (upfront, one time)

Harmony ships **one package per product** — `cp`, `vp`, `ppm`, `maconomy`. Pick the product for your app **before installing**; from then on it is a plain shadcn + Tailwind + Radix library with no product switching. See [docs/PRODUCT_BUILDS.md](docs/PRODUCT_BUILDS.md).

```bash
# pick ONE (example: Costpoint)
npm install @dltkrichardhuska/harmony-design-system-shadcn-cp
```

> The unsuffixed `@dltkrichardhuska/harmony-design-system-shadcn` is the multi-product **development source** (all four palettes + a product switcher for the review demo). Application consumers install a **product-specific** package, not this one.

Requires **Tailwind CSS v4**. Peers: `react`, `react-dom`, `tailwindcss` (`^4`). `class-variance-authority`, `clsx`, and `tailwind-merge` are bundled as dependencies. **Fonts are bundled** (variable Figtree / Lexend / JetBrains Mono woff2) — there is no `@fontsource` setup.

### Authenticate to GitHub Packages (`@dltkrichardhuska` scope)

The package is published to GitHub Packages, so npm needs auth for the scope. Use **either** method:

- **Personal access token (PAT).** Create a classic PAT with `read:packages`, then add to `.npmrc`:

  ```ini
  @dltkrichardhuska:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
  ```

- **GitHub CLI login (already signed in on the command line).** If you use `gh`, reuse its token — no PAT to manage:

  ```ini
  # .npmrc
  @dltkrichardhuska:registry=https://npm.pkg.github.com
  ```
  ```bash
  # log in once (grants read:packages), then wire the token into npm
  gh auth login --scopes read:packages
  npm config set //npm.pkg.github.com/:_authToken "$(gh auth token)"
  ```

## Global setup (once)

Using the product package (examples show `-cp`; substitute your product):

1. Import styles **once** at your app entry:
   `import '@dltkrichardhuska/harmony-design-system-shadcn-cp/styles/globals.css'`
   This single file pulls in Tailwind, the bundled fonts, and the design tokens (already baked for the product; no token JSON export).
2. **Tailwind v4 — no config needed.** `globals.css` already does `@import "tailwindcss"`, maps the Harmony tokens to utilities via `@theme`, enables `.dark` mode, and registers the package's own classes with `@source`. Just make sure your bundler runs Tailwind v4 (e.g. the `@tailwindcss/vite` plugin, or `@tailwindcss/postcss`). Your app's own `bg-primary`, `text-heading-xl`, `shadow-md`, `dark:*`, etc. work automatically — no `content` globs, no preset import, no `tailwind.config`.
3. Wrap with `HarmonyThemeProvider` — **mode only** (`defaultMode="light" | "dark"`). There is **no** `defaultProduct` / product switching in a product build.

(Fonts load themselves via `globals.css`; do not import `@fontsource`.)

## Imports

The bare package specifier is the primary import surface (components, layouts, theme provider, and `cn`):

```tsx
import {
  HarmonyThemeProvider,
  Button,
  Icon,
  cn,
} from '@dltkrichardhuska/harmony-design-system-shadcn';

<Icon name="home" size="md" />
<Button variant="primary">Save</Button>
```

Subpath entries remain available when you want them: `.../theme`, `.../components`, `.../utils`.

Style with Tailwind **theme utilities** (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `gap-2`, `rounded-lg`, `shadow-md`, `transition-colors`). Use `var(--…)` only when no utility exists (focus rings, `--icon-*`, `--z-*`, `--dropdown-*`, rare product washes).

## Catalog → package exports

Do **not** invent catalog Astro names as import identifiers. Use this map:

| Catalog / demo route | Package export | Notes |
|----------------------|----------------|-------|
| Button | `Button` | Keep Harmony variants (`primary`, `dela`, …) — not stock `default` |
| Icon | `Icon` | Name strings only — never Lucide |
| Dropdown (`/dropdowns`) | `Select` + compounds / `SelectField` | **No** `Dropdown` export |
| Toggle (`/toggle-switches`) | `Toggle` / `ToggleField` | Not stock ToggleGroup; no segmented |
| Accordion | `Accordion` / `Item` / `Trigger` / `Content` | No Astro `items[]` |
| Stepper (`/stepper`) | `Stepper` / `Step` | No `steps[]`; `onStepClick` not `stepper:step-clicked` |
| TabStrip (`/tab-strip`) | `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` (+ `TabsAddButton`, `useTabOverflow`) | No `tabs[]`; events → callbacks; pill is VP-only |
| Tab / overflow menu | `DropdownMenu*` | NOT catalog Dropdown (that is `Select`); inlines Select tokens |
| DatePicker | `DatePicker` / `Calendar` | Alias |
| Input / Checkbox / Toggle / Select labels | `*Field` or `Field` + `Label` | **Hybrid C** — bare controls have no `label` prop |
| Label | `Label` + `Field*` | Prefer Field composition |

## Dela

Brand gradient tokens live in `tokens.css`. Prefer Tailwind / CSS vars; CTA via Button variants:

```tsx
<div className="bg-dela text-dela-foreground" />
<div style={{ backgroundImage: 'var(--gradient-dela)' }} />
<Button variant="dela">Ask Dela</Button>
<Button variant="dela-pill">Try AI</Button>
```

- `bg-dela` → `--gradient-dela`; `text-dela-foreground` → `--dela-header-content-fg`
- Hover overlay: `var(--gradient-dela-hover-bg)`
- No separate `DelaButton` export — use `Button` `dela` / `dela-pill`
- Demo: `/foundation/dela`

## Buttons

Use package **`Button`** (shadcn-style `cva` + Harmony tokens). Keep Harmony variant names (`primary`, `dela`, …) — do not remap to stock shadcn `default`.

```tsx
import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Button variant="primary">Save</Button>
<Button variant="secondary" icon="pencil">Edit</Button>
<Button variant="dela">Ask Dela</Button>
<Button icon="plus" aria-label="Add" />
```

- Props mirror reference: `variant`, `buttonType`, `size` (`xs`–`lg`), `orientation`, `loading`, `icon`, `href`, etc.
- **Events:** native `ButtonHTMLAttributes` / `AnchorHTMLAttributes` (`onClick`, …) — no custom Harmony event props. `href` → `<a>`; `asChild` → Radix Slot.
- Icons via `icon` string → package `Icon` (not Lucide children).
- **Loading:** `loading` / `loadingText` uses a private inline SVG; or nest package `<Spinner />` as children when `loading` is false.
- Export `buttonVariants` for composition. Optional `asChild` (Radix Slot).
- See `docs/components/Button.md`.

## Spinner

Use package **`Spinner`** for page/content loading. Stock shadcn Spinner pattern; Harmony border ring by default.

```tsx
import { Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Spinner />
<Spinner size="lg" />
<Spinner icon="arrow-path" size="sm" />
```

- Props: `size` (`sm`|`md`|`lg`), optional `icon` (Harmony Icon name replaces ring), `className`, `aria-label` (default `"Loading"`).
- Forwards `ref` + HTML attributes on root `<span>` (`role="status"`).
- Do not use Lucide for spinner glyphs. See `docs/components/Spinner.md`.

## ProgressBar

Use package **`ProgressBar`** (Radix Progress + Harmony tokens). Export `progressBarVariants`.

```tsx
import { ProgressBar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ProgressBar value={40} />
<ProgressBar value={72} size="lg" variant="success" showLabel />
```

- Props: `value` (required), `max` (default `100`), `size` (`sm`|`md`|`lg`), `variant` (`default`|`success`|`warning`|`error`), `showLabel`.
- Forwards `ref` + HTML attrs on wrapper `<div>`. See `docs/components/ProgressBar.md`.

## ButtonGroup

Use package **`ButtonGroup`** to shell package `Button` children. Not ToggleGroup.

```tsx
import { ButtonGroup, Button } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ButtonGroup variant="default" aria-label="View period">
  <Button variant="primary">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>
```

- Default shell: child borders stripped (shell only). Selection = child `primary`.
- Horizontal groups stack full-width below 768px.
- Export `buttonGroupVariants`. See `docs/components/ButtonGroup.md`.

## Badge

Use package **`Badge`** for status labels. Astro `small`/`medium`/`large` → `sm`/`md`/`lg` (default `lg`). Export `badgeVariants`.

```tsx
import { Badge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Badge>Default</Badge>
<Badge variant="success" size="sm" icon="check-circle">Done</Badge>
```

- Props: `variant` (`default`|`primary`|`success`|`warning`|`error`|`info`|`orange`|`pink`|`disabled`), `size`, `icon`, `children`.
- Presentational `<span>`. See `docs/components/Badge.md`.

## NotificationBadge

Use package **`NotificationBadge`** for unread dots/counts. Prefer wrapping the anchor as `children` (auto top-right). Export `notificationBadgeVariants`.

```tsx
import { Icon, NotificationBadge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<NotificationBadge type="number" value={3} variant="error">
  <Icon name="bell" />
</NotificationBadge>

<NotificationBadge type="dot" variant="primary" />
```

- Discriminated `type`; do not hand-roll relative/absolute wrappers for on-anchor use.
- Not for status labels — use `Badge`. See `docs/components/NotificationBadge.md`.

## Chip

Use package **`Chip`** for filters/tags. No stock shadcn Chip. No `selected`/`static` props.

```tsx
import { Chip } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Chip label="Filters" icon="funnel" onClick={() => {}} />
<Chip type="overflow" overflowCount={5} variant="outline" />
<Chip removable label="Tag" onRemove={() => {}} />
```

- Props: `size`, `variant` (`fill`|`outline`), `type` (`chip`|`horiz-dots`|`vert-dots`|`overflow`), `overflowCount?`, `label?`, `icon?`, `removable?`, `onRemove?`, `disabled?`, `onClick?`.
- Export `chipVariants`. See `docs/components/Chip.md`.

## Avatar

Use package **`Avatar`** convenience API, or compound **`AvatarImage`** / **`AvatarFallback`**. Export `avatarVariants`.

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Avatar variant="icon" />
<Avatar variant="initials" initials="Ada Lovelace" />
<Avatar variant="image" src="/avatar.jpg" alt="Ada" />
<Avatar interactive onClick={() => {}} initials="AL" />
```

- Props: `size`, `variant` (`icon`|`initials`|`image`), `initials?`, `src?`, `alt?`, `interactive?`, `disabled?`, `onClick` when interactive.
- See `docs/components/Avatar.md`.

## Alert

Use package **`Alert`** — `appearance` (not Astro `style`). Compound: `AlertTitle`, `AlertDescription`, `AlertAction`. Export `alertVariants`.

```tsx
import { Alert } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Alert variant="success" title="Saved">Stored.</Alert>
<Alert
  appearance="enhanced"
  variant="warning"
  title="Syncing"
  dismissible
  onDismiss={() => {}}
  progressValue={45}
  primaryAction={{ label: 'Retry', onClick: () => {} }}
>
  Upload in progress.
</Alert>
```

- Props: `variant`, `appearance` (`default`|`enhanced`), `title?`, `dismissible?`, `onDismiss?` (controlled — does not unmount), `icon?`, `primaryAction?`/`secondaryAction?`, `linkText?`/`linkHref?`, `progressValue?` (composes `ProgressBar`), `children`.
- See `docs/components/Alert.md`.

## Label + Field

Prefer **Field** composition (shadcn-style). Bare **Label** for simple cases. Use **`InputField` / `TextareaField` / `NumberField` / `RangeField` / `DateInputField` / `ToggleField` / `SelectField` / `CheckboxField`** for one-shot labeled layouts — do **not** put `label` on bare controls.

```tsx
import {
  Label,
  Field,
  FieldLabel,
  Input,
  InputField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Label htmlFor="name">Full Name</Label>
<Input id="name" />

<Field orientation="stacked">
  <FieldLabel htmlFor="email" required>Email</FieldLabel>
  <Input id="email" type="email" />
</Field>

<InputField label="Email" labelVariant="inline" type="email" />
```

- Label: `htmlFor`, `required`, `helper`. Field: `orientation` `stacked` | `horizontal`.
- See `docs/components/Label.md`.

## Input / Textarea

```tsx
import { Input, Textarea, InputField, TextareaField } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Input icon="magnifying-glass" placeholder="Search" />
<Input error errorMessage="Required" />
<Textarea rows={4} />
<InputField label="Email" labelVariant="stacked" type="email" />
```

- Input: `error`, `errorMessage`, `icon`, `trailingIcon`, `trailing` (ReactNode wins). No label props on primitives.
- Trailing actions: icon-only `Button` `variant="ghost"` with `className="h-full w-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"` so the control fills the right gutter (keeps ghost `--hover-bg`).
- Textarea: no error API (reference parity).
- See `docs/components/Input.md`, `docs/components/Textarea.md`.

## NumberInput / RangeInput

```tsx
import { NumberInput, NumberField, RangeInput, RangeField } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<NumberInput value={1} min={0} max={99} onChange={setQty} />
<RangeInput value={75} showPercent onChange={setVolume} />
<NumberField label="Quantity" labelVariant="inline" value={1} />
```

- NumberInput steppers: package `Button` + `Icon`. RangeInput: Radix Slider + value label (`showPercent` / `prefix` / `suffix`).
- `onChange` is `(value: number) => void`.
- See `docs/components/NumberInput.md`, `docs/components/RangeInput.md`.

## Date / time inputs

Use **`DateInput`** (+ **`DateInputField`**) for forms. Panels: **`DatePicker`** / **`Calendar`**, **`TimePicker`**, **`MonthPicker`**, **`WeekPicker`**, **`DateTimePicker`**. Shell: **`Popover`** / **`PickerPopup`**.

```tsx
import {
  DateInput,
  DateInputField,
  Calendar,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<DateInput type="date" value={date} onChange={setDate} />
<DateInputField label="Select Date" labelVariant="stacked" value={date} onChange={setDate} />
<Calendar value={date} onSelect={setDate} />
```

- Stack: `react-day-picker` + Radix Popover + `date-fns`; icons via package `Icon` only.
- DateInput: `type` `date`|`time`|`datetime-local`|`month`|`week`; `onChange(string)`; no label props on bare control.
- Panels use `onSelect(string)` with ISO shapes (`YYYY-MM-DD`, `HH:MM`, `YYYY-MM`, `YYYY-Www`, `YYYY-MM-DDTHH:MM`).
- `Calendar` aliases `DatePicker`. See `docs/components/DateInput.md`.

## Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Card title="Card Title" description="Subtitle" elevated>
  Body
</Card>

<Card primary>
  <CardHeader>
    <CardTitle>Featured</CardTitle>
  </CardHeader>
  <CardContent>Body</CardContent>
</Card>
```

- Compound: `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` / `CardContent` / `CardFooter` + `cardVariants`
- Harmony: `elevated`, `interactive`, `primary` (combinable)
- Convenience `title` / `description` when not composing `CardHeader`
- Header icons via `CardAction` + `Button` `icon` — not Astro `icon1`/`icon2`/`icon3`
- See `docs/components/Card.md`. Demo `/components/cards`

## Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Dialog>
  <DialogTrigger asChild><Button type="button">Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Confirm</DialogTitle></DialogHeader>
    <DialogBody>Are you sure?</DialogBody>
    <DialogFooter confirmLabel="Confirm" cancelLabel="Cancel" />
  </DialogContent>
</Dialog>
```

- Radix `@radix-ui/react-dialog`; controlled `open` / `onOpenChange`
- Harmony: `DialogHeader` `variant` `default`|`primary`; `DialogFooter` `buttonAlignment` `left`|`right`
- Convenience footer props when no children; compose `Button` + `DialogClose` otherwise
- Close: package `Icon name="x-mark"` — not Lucide; no `openDialog` globals
- Skipped: `resizable` grip
- See `docs/components/Dialog.md`. Demo `/components/dialogs`

## Checkbox / CheckboxGroup

```tsx
import {
  Checkbox, CheckboxField, CheckboxGroup, Label,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<CheckboxField label="Email" name="email" defaultChecked />
<CheckboxGroup legend="Prefs">
  <CheckboxField label="SMS" name="sms" />
</CheckboxGroup>
```

- Bare `Checkbox` has **no** `label` prop — use `CheckboxField` or `Label` + `htmlFor` (Hybrid C).
- Indicator: package `Icon name="check"` — not Lucide.
- Group error/warning propagates face chrome via `data-group-error` / `data-group-warning`.
- See `docs/components/Checkbox.md`, `CheckboxGroup.md`. Demos `/components/checkboxes`, `/components/checkbox-groups`

## RadioButton / RadioGroup

```tsx
import {
  RadioGroup, RadioField, RadioButton,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<RadioGroup legend="Plan" defaultValue="pro" name="plan">
  <RadioField label="Pro" value="pro" />
  <RadioField label="Free" value="free" size="sm" />
</RadioGroup>
```

- Items must be inside `RadioGroup`. Radix **propagates `name`** (document vs Astro).
- Bare `RadioButton` has no `label` — use `RadioField`. Dot is CSS, not Icon.
- See `docs/components/RadioButton.md`, `RadioGroup.md`. Demos `/components/radio-buttons`, `/components/radio-groups`

## Link

```tsx
import { Link } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Link href="/docs">Docs</Link>
<Link href="https://example.com" external>External</Link>
```

- cva `<a>`; `external` → new tab + `Icon name="arrow-top-right-on-square"`.
- Skipped: Astro responsive default size &lt;768px.
- See `docs/components/Link.md`. Demo `/components/links`

## Tooltip

```tsx
import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="secondary">Hover</Button></TooltipTrigger>
    <TooltipContent text="Tip" position="top" />
  </Tooltip>
</TooltipProvider>
```

- Radix Tooltip; `position` → `side`. Skipped: `cornerVariant`.
- See `docs/components/Tooltip.md`. Demo `/components/tooltips`

## Toggle

```tsx
import { Toggle, ToggleField } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ToggleField label="Enable notifications" />
<Toggle aria-label="Compact" defaultChecked size="sm" />
```

- Radix Switch; bare Toggle has **no** `label` — use `ToggleField` (Hybrid C).
- `size` `sm`|`md`; export `toggleVariants`. Skipped: segmented variant.
- See `docs/components/Toggle.md`. Demo `/components/toggle-switches`

## Select (Dropdown)

```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<SelectField label="Country" placeholder="Select a country">
  <SelectItem value="us">United States</SelectItem>
</SelectField>
```

- Catalog Dropdown → package **Select**. Compose `SelectItem` children (no `options[]`).
- `SelectField` Hybrid C labels. Chevron: package `Icon`. See `docs/components/Select.md`. Demo `/components/dropdowns`

## Accordion

```tsx
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Body</AccordionContent>
  </AccordionItem>
</Accordion>
```

- Compound only — no Astro `items[]`. `type="multiple"` maps `allowMultiple`.
- Height animation: `animate-accordion-down` / `animate-accordion-up` (defined in the Tailwind v4 `@theme` in `globals.css`).
- Chevron: `Icon name="chevron-down"`. See `docs/components/Accordion.md`. Demo `/components/accordion`

## ListMenu

Use package **`ListMenu`** / **`ListMenuItem`** / **`ListMenuButton`** for vertical nav/selection lists. Shaped like stock shadcn **SidebarMenu** but standalone (no Sidebar / `useSidebar`). No Astro `items[]`.

```tsx
import {
  ListMenu, ListMenuItem, ListMenuButton, Icon,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ListMenu>
  <ListMenuItem>
    <ListMenuButton isActive icon="home">Dashboard</ListMenuButton>
  </ListMenuItem>
  <ListMenuItem>
    <ListMenuButton asChild>
      <a href="/profile"><Icon name="user" size="md" /><span>Profile</span></a>
    </ListMenuButton>
  </ListMenuItem>
</ListMenu>
```

- `ListMenu.variant` `default` | `no-borders` (separators). `ListMenuButton`: `isActive` (not Astro `active`), `icon` name string, `asChild` (Radix Slot → `<a>` / router Link), native button attrs + `onClick`.
- No Radix component; icons via package `Icon` (muted → theme-primary on hover → white when active). Export `listMenuVariants` / `listMenuButtonVariants`.
- Do not use stock `SidebarMenu` for a plain list. See `docs/components/ListMenu.md`. Demo `/components/list-menu`

## Stepper / Step

Use package **`Stepper`** / **`Step`** — a custom compound (no Radix). `Stepper` clones `Step` children to inject index + resolved state (linear auto-disable, auto-numbering, connector activation) via context.

```tsx
import { Stepper, Step } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Stepper activeStep={1} nonLinear onStepClick={setActive}>
  <Step completed success>Account</Step>
  <Step icon="user">Profile</Step>
  <Step disabled description="Unavailable">Payment</Step>
</Stepper>
```

- `Stepper`: `activeStep`, `orientation` `horizontal|vertical`, `nonLinear`, `onStepClick(index)` (replaces `stepper:step-clicked`).
- `Step`: `completed`/`disabled`/`error`/`warning`/`success`, `icon` name, `description` (replaces `slot="description"`). State icon priority error>warning>success>completed>number; custom `icon` overrides all.
- No Astro `steps[]` / init script; state icons via package `Icon`. See `docs/components/Stepper.md`. Demo `/components/stepper`

## TabStrip (Tabs)

Use package **`Tabs`** / **`TabsList`** / **`TabsTrigger`** / **`TabsContent`** (Radix Tabs). Compose triggers, per-tab `actions`, `TabsAddButton`, and overflow menus instead of the Astro `tabs[]` array + custom events.

```tsx
import {
  Tabs, TabsList, TabsTrigger, TabsContent, TabsAddButton, useTabOverflow,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="features" icon="star">Features</TabsTrigger>
    <TabsAddButton onClick={addTab} />
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>
```

- `TabsList.variant` `default|compact|pill` (pill selected state is **VP-only**, matching reference), `iconPosition`, `overflow` `none|scroll` (auto move-into-menu = compose `useTabOverflow`).
- `TabsTrigger`: `value`, `icon` name string **or** compose `<Icon>` as a child, `iconPosition` `left|right|top`, `disabled`, `asChild` (router links), `actions` (per-tab toolbar; compose `Button` + `DropdownMenu`).
- Events → callbacks: `tab-strip:tab-selected`→`onValueChange`, `add-tab`→`TabsAddButton onClick`, `close-tab`/`open-new-window`→`actions` Button `onClick`, `set-default`→`DropdownMenuItem onSelect`.
- Auto overflow: `useTabOverflow(count, { reserve })` → hide `index >= hiddenFrom`, surface in a `DropdownMenu`.
- No `tabs[]` / named content slots; icons via package `Icon`. See `docs/components/TabStrip.md`. Demo `/components/tab-strip`

## DropdownMenu

Use package **`DropdownMenu*`** (Radix Dropdown Menu) for kebab/overflow action menus. This is **not** the catalog Dropdown — catalog Dropdown → **Select**. `DropdownMenu` inlines the same Tailwind token utilities as `Select` (idiomatic shadcn copy-paste) so popovers look identical; do **not** extract a shared menu-style module or refactor `Select`.

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

- `DropdownMenuItem` uses `onSelect`; icons via package `Icon`. See `docs/components/DropdownMenu.md`

## Icons

Use package **`Icon`** with Harmony **name strings** — the only public icon API for app UI.

```tsx
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Icon name="home" size="md" />
<Icon name="check-circle" size="lg" />
<Icon name="x-mark" />
```

- Resolution: product manifest → Heroicons → Tabler → custom public SVG → `?` fallback.
- Sizes: `xs` | `sm` | `md` | `lg` | `xl` (CSS tokens `--icon-*`).
- **Events:** presentational only (`aria-hidden`) — wrap in `<button>` / use `Button` `icon` for clicks.
- Heroicons / Tabler are **internal resolvers** — do not import them (or Lucide) at call sites.
- Stock shadcn `components.json` `iconLibrary` cannot target Harmony `Icon` — omit it; do not set `"lucide"` / `"tabler"` for Harmony apps.
- **Registry:** the package ships a **complete** shadcn CLI registry (`registry.json` + `registry/new-york/` shims, one per component, auto-generated from `components/index.ts`). `npx shadcn add <name>` drops in a shim that re-exports the installed npm package, so it never forks a stale component. Prefer direct package imports in apps.

**If you were about to import `lucide-react`:** use Harmony names instead, e.g. `home`, `check-circle`, `x-mark`, `magnifying-glass`, `chevron-down`. See `docs/components/Icon.md`.

## Shell (application frame)

Use the **Shell family** to build the app frame. All pieces are **prop-driven** and **composition-based** — the library **never switches product at runtime**. You pick a product surface by composing the pieces you want (CP → `FloatingNav`, no footer; VP/PPM/Maconomy → `ShellFooter`, no floating nav). Product **identity** (brand name, logo, sidebar variant) comes from the build/provider — you do **not** pass `productName`, `logoSrc`, or sidebar `variant` for the normal case. Import from `/components` like everything else.

```tsx
import {
  ShellLayout, ShellHeader, LeftSidebar, RightSidebar,
  ShellPageHeader, ShellFooter, FloatingNav, ShellPanel,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

// VP/PPM/Maconomy surface (footer, no floating nav)
// Header brand + sidebar variant are auto-supplied by the product build.
<ShellLayout
  productVariant="standard"
  header={<ShellHeader companyName="Acme Corporation" />}
  leftSidebar={<LeftSidebar />}
  rightSidebar={<RightSidebar />}
  footer={<ShellFooter value={tab} onValueChange={setTab} tabs={tabs} />}
>
  <ShellPageHeader title="Projects" primaryButton={{ text: 'New', icon: 'plus' }} />
  {/* page content */}
</ShellLayout>

// CP surface (floating nav, no footer)
<ShellLayout
  productVariant="cp"
  header={<ShellHeader companyName="Acme Corporation" />}
  leftSidebar={<LeftSidebar />}
  rightSidebar={<RightSidebar />}
  floatingNav={<FloatingNav onSave={save} />}
/>
```

- **`ShellLayout`** — thin grid frame. Slot props: `header`, `leftSidebar`, `rightSidebar`, `footer`, `floatingNav`, `leftPanel`, `rightPanel`, `children`. Grid derives from which slots are present; `productVariant` (`cp` | `standard`) only tunes spacing.
- **`ShellHeader`** — brand + optional company picker + Avatar. **Brand is auto-supplied**: `productName` and `logoSrc` default to the active product (baked into the single-product build; derived from `HarmonyThemeProvider` in the multi-product dev demo). Pass them only to override the brand. The company list is **per-customer**: pass `companies` (`{ id, name, color }[]`); set initial selection with `defaultSelectedId` or control it with `selectedId` + `onCompanyChange`. `companyColor` overrides the indicator/gradient color. `actions` overrides the right side.
- **`ShellPageHeader`** — `title`/`subtitle` + `outlineButtons[]` then `primaryButton`, or an `actions` override.
- **`ShellFooter`** — VP/PPM/Maconomy tab bar; composes `Tabs`. `tabs[]` + `value`/`onValueChange` + `showAddButton` + `variant`.
- **`FloatingNav`** — CP toolbar; `variant` `full`|`compact`, `showExecute`, `saveDisabled`, React callbacks, `actions` override.
- **`ShellPanel`** — **non-modal** inline drawer. `side`, `open`/`onOpenChange`, `title`, `titleIcon`, `headerVariant` (`theme`|`default`), `width` (`narrow`|`full`, user-toggleable), `gradientHeader` (Dela), `showClose`/`showPopout`.
- **`LeftSidebar` / `RightSidebar`** — hover-expand icon rails. `variant` defaults to the active product (override to pick different default sections, or pass `sections`); controlled `activeId` + `onItemSelect` drive a `ShellPanel`. `RightSidebar` leads with the Dela AI item.

**Note on shadcn blocks:** these are **custom** on Harmony tokens, not the stock shadcn `sidebar`/`sheet` blocks — the hover-expand rail and non-modal inline panel do not fit those blocks. The public API still follows shadcn slot/compound + `open`/`onOpenChange` conventions. The shell ships a small scoped stylesheet loaded via `styles/globals.css`.

## Do

- Prefer package components and Radix/shadcn patterns already in this library
- Style with **preset utilities**; reserve `var(--…)` for unmapped tokens only
- Read `llms.txt` and `docs/components/` for API details
- Follow the catalog → export map (Dropdown → Select, Hybrid C `*Field`)

## Don't

- Invent a second token system (JSON theme objects, per-product Tailwind hex configs, parallel CSS)
- Switch product at runtime (product is fixed per build; only the multi-product demo chrome switches, for review)
- Import MUI, Chakra, Lucide, or other UI kits for Harmony icons/UI
- Skip `HarmonyThemeProvider` / base styles and then patch with ad-hoc CSS
- Import a non-existent `Dropdown` — use `Select`
- Put `label` on bare `Input` / `Checkbox` / `Toggle` / `Select` — use `*Field` or Label
- Set `components.json` `iconLibrary` to `lucide` / `tabler`
- Reintroduce `--transition-*` tokens or `duration-[var(--transition-*)]`

## Demo

Local review app: `conversions/harmony-design-system-shadcn` → `npm run dev` (port 5177). Start at **/getting-started**.
