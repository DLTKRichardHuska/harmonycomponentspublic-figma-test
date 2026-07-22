# Conversion plan — Shell

| Field | Value |
|---|---|
| target | `harmony-design-system-shadcn` |
| scope | `shell` |
| status | `approved` |
| createdAt | `2026-07-20` |
| referenceVersion | `0.9.0` |
| coverageAtPlan | `71% (39/55)` |

## Summary

Convert the full Harmony Shell family into the shadcn conversion as **prop-driven, composition-based** package layouts:

`ShellLayout`, `ShellHeader`, `ShellFooter`, `ShellPageHeader`, `ShellPanel`, `LeftSidebar`, `RightSidebar`, `FloatingNav`.

Reference source: `src/layouts/ShellLayout.astro` + `src/components/ui/{ShellHeader,ShellFooter,LeftSidebar,RightSidebar,FloatingNav,ShellPageHeader,ShellPanel}.astro`.

## Approach & stack fit (user confirmed)

- **Prop-driven only.** No runtime `theme-cp/vp/ppm/maconomy` detection, no `MutationObserver`, no per-theme variant swapping. The library never switches products at runtime. Each product look is produced by **composition** — the CP demo composes `FloatingNav` and no footer; VP/PPM/Maconomy demos compose `ShellFooter` and no floating nav.
- **`ShellLayout` is a thin structural grid frame** (fixed header row / scrollable main / optional footer row + fixed sidebar/panel slots). It derives its grid purely from which slots are present (`footer`, `floatingNav`, `rightSidebar`) — **zero product/theme branching**.
- **shadcn block fit, documented:** Harmony's sidebars are a hover-expanding icon rail with rounded section cards, and `ShellPanel` is a **non-modal inline** drawer. shadcn's `sidebar` block (SidebarProvider + offcanvas/icon collapsible) and `sheet` (modal overlay) do not fit these behaviors, so the shell pieces are built custom on Tailwind + Harmony tokens, but the **public API uses shadcn-familiar slot/compound conventions** (slot props, `data-slot`, `data-side`, `open`/`onOpenChange`) so shadcn-oriented AI/devs can consume them. This decision is documented in `AGENTS.md`.
- Icons via the package `Icon` (Harmony name strings) only — never `lucide-react`/heroicons at call sites.
- Styling: shell layout primitives ship a small scoped stylesheet `packages/ui/src/styles/shell.css` (imported by `globals.css`) that reuses the existing Harmony CSS variables in `tokens.css`. No new token system.

## Element strategy (user confirmed)

| Element | Strategy | Target |
|---|---|---|
| ShellPageHeader | component | `packages/ui/src/layouts/shell-page-header` |
| ShellHeader | component | `packages/ui/src/layouts/shell-header` (company picker via `DropdownMenu`, `Avatar`) |
| ShellFooter | component | `packages/ui/src/layouts/shell-footer` (composes `Tabs`) |
| FloatingNav | component | `packages/ui/src/layouts/floating-nav` |
| ShellPanel | component | `packages/ui/src/layouts/shell-panel` (non-modal, narrow/full, open/onOpenChange) |
| LeftSidebar | component | `packages/ui/src/layouts/left-sidebar` (icon rail, hover-expand, sections) |
| RightSidebar | component | `packages/ui/src/layouts/right-sidebar` (mirror, Dela AI first item) |
| ShellLayout | component | `packages/ui/src/layouts/shell-layout` (slot/grid frame) |

## Consumer API (user confirmed)

Shell pieces ship as package exports from `@dltkrichardhuska/harmony-design-system-shadcn/components` (re-exported through `layouts/index.ts` → components barrel). Key API shape:

- `ShellLayout` — slot props `header`, `leftSidebar`, `rightSidebar`, `footer`, `floatingNav`, `leftPanel`, `rightPanel`, plus `children` (main content). Grid derives from slot presence; optional `productVariant` only tunes spacing (cp vs standard), not content.
- `ShellHeader` — `productName`, `logoSrc`, `companyName`, `companies`, `companyColor`, `showCompanyPicker`, `actions` slot.
- `ShellPageHeader` — `title`, `subtitle`, `primaryButton`, `outlineButtons`, `actions` slot.
- `ShellFooter` — `tabs`, `value`/`onValueChange`, `showAddButton`, `variant`.
- `FloatingNav` — `variant`, `showExecute`, `saveDisabled`, `actions` slot.
- `ShellPanel` — `side`, `open`, `onOpenChange`, `title`, `titleIcon`, `headerVariant`, `width`, `showClose`, `showPopout`.
- `LeftSidebar` / `RightSidebar` — `variant`, `sections` (`SidebarSection[]` / `SidebarItem[]`), controlled `activeId`/`onItemSelect` for panel wiring.

Events use React callbacks (no custom DOM events). Native HTML attributes forwarded on roots.

## Blocking dependencies

None. All leaf deps are `synced`: `Icon`, `Avatar`, `Tooltip`, `Button`, `TabStrip`(Tabs), `Card`.

## Scope

- **In scope:** the 8 shell elements above, their demo pages (`/shell/*`), routing wiring, AI artifacts, manifest updates.
- **Out of scope:** runtime product/theme switching in the library; Table/Kanban/other pending elements; the Dela live panel content (panel shell only).

## Phases

1. `shell.css` + `layouts/` scaffolding.
2. Sub-components: ShellPageHeader → ShellHeader → ShellFooter → FloatingNav → ShellPanel → LeftSidebar → RightSidebar.
3. ShellLayout composition.
4. Demo pages (8) + `App.tsx` routing.
5. Verify vs reference, AI artifacts, flip manifest to `synced`, recompute coverage.

## Approval

Status: approved (user: "execute this plan").
