---
name: layout-builder
description: "Compose page layouts inside a Harmony-themed MUI or shadcn app using design patterns and composition rules. Use when a designer wants to build a page (settings, dashboard, form, list/detail) after the Harmony theme has been applied. Triggers on 'build layout', 'create page', 'compose page', 'settings page', 'dashboard layout'."
---

# Layout Builder Skill

Compose page layouts inside a **Harmony-themed MUI or shadcn** app using pattern definitions from the **design-patterns** skill (`.cursor/skills/design-patterns/reference/`) and composition rules below.

**Integration kit context:** The Harmony theme has been applied via [docs/MAPPING_PLAYBOOK.md](../../../docs/MAPPING_PLAYBOOK.md). Build with **MUI or shadcn components**, not Harmony React components. Use `reference-components/` as read-only spec for expected structure and behavior.

## How it connects to other skills

- **design-patterns** → provides documented patterns (anatomy, variants, when to use). If a pattern exists in the registry, the layout builder uses its anatomy as the structural reference.
- **Host framework components** → MUI (`Button`, `Card`, `TextField`, `Dialog`, etc.) or shadcn (`Button`, `Card`, `Input`, `Dialog`, etc.) with Harmony theme applied.
- **reference-components/** → Read-only spec showing expected structure and behavior. Do not import these into the host app.
- **Shell** → Built with MUI or shadcn per Pass 7 of the mapping playbook. The layout goes inside the shell's content area.

## Layout Patterns

Common page layout types with their expected component composition. These are starting points, not rigid templates. The designer can describe any layout and the builder composes it.

### Settings page

- Page header (title, optional subtitle)
- Card (elevated) containing:
  - Form groups: Label + Input, Label + Switch, Label + Checkbox
  - Grouped in sections (optional Card subdivisions or dividers)
- Button bar at bottom: Cancel (outlined) + Save (primary)

### List / detail

- Page header (title, action buttons)
- Card containing:
  - Table or list view (sortable, filterable)
- Detail panel: Card or Drawer with form fields
- Optional: Floating action button

### Dashboard

- Page header (title, date range picker)
- Grid layout (CSS grid or flex):
  - Stat cards (Card with Badge or value display)
  - Chart cards (Card containing chart placeholder)
  - Activity list (Card with table or list)

### Form page

- Page header (title, subtitle)
- Card containing:
  - Stepper or accordion sections
  - Form fields per section
  - Inline validation
- Button bar: Cancel + Submit

### Empty state

- Page header (title)
- Card (centered content):
  - Icon (large)
  - Heading + description
  - Primary action button

## Composition Constraints

### Nesting rules

- Card can contain: form fields (Input/TextField, Textarea, Switch, Checkbox, Radio), Button, Badge, Table, any display component.
- Card cannot nest inside Card. Use dividers or sections instead.
- Page header is always the first child in the content area.
- Button bar is always the last child (inside or after the Card).

### Dialog and overlay sizing

Dialogs, wizards, and panels with variable-length content must set both min-height and max-height. Use `min-height: 80vh` and `max-height: 90vh` on the dialog container, `min-height: 60vh` and `max-height: 80vh` on the scrollable content area. Footer buttons must remain fixed at the bottom. Content area scrolls internally.

### Verification

Verification: no browser. Verification is file/source comparison and build command run only. Do not open a browser or start a dev server. If the build runs without errors, compilation verification passes. Visual comparison is done by the designer, not the AI.

### Spacing

- Use Harmony spacing tokens: `var(--space-1)` through `var(--space-8)`.
- Between form groups: `var(--space-4)`.
- Between sections: `var(--space-6)`.
- Card padding: use the theme's card padding (MUI `CardContent` or shadcn card body).
- Page-level gaps: `var(--space-6)` between page header and first Card.

### Grid

- Use CSS grid for multi-card layouts: `grid-template-columns`.
- 2-column: `repeat(2, 1fr)`.
- 3-column: `repeat(3, 1fr)`.
- Gap: `var(--space-4)` or `var(--space-6)`.
- Responsive: stack to single column below 768px.

### Props (host framework mapping)

- **MUI Card:** `variant="elevation"` `elevation={2}` for page content.
- **MUI Button:** `variant="contained"` for primary, `variant="outlined"` for secondary.
- **shadcn Card:** default styling with Harmony tokens.
- **shadcn Button:** `variant="default"` for primary, `variant="outline"` for secondary.
- Page header: use MUI `Typography` or shadcn heading with action slot.

## Framework notes

Build with **MUI or shadcn** components. Use `reference-components/*.tsx` as **read-only spec** for expected structure and behavior — do not import them into the host app. All Harmony styling comes through the theme applied in passes 1-8 (CSS vars, MUI theme overrides, or Tailwind extensions).

## Design-patterns integration

When a documented pattern exists in the design-patterns registry, the layout builder uses its anatomy as the structural reference. Pattern component names map to host framework equivalents:

- Pattern says `Dialog` → MUI `Dialog` or shadcn `Dialog`
- Pattern says `Button` → MUI `Button` or shadcn `Button`
- Pattern says `Card` → MUI `Card` or shadcn `Card`
- Pattern says `Table` → MUI `Table`/`DataGrid` or shadcn `Table`

Patterns should include a "Component Tree" section. If no documented pattern exists in the registry, the builder uses the layout patterns in this skill as the reference.
