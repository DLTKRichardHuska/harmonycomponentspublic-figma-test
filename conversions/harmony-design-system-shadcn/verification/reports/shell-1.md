# Verification report — shell-1

| Field | Value |
|---|---|
| scope | Shell family (ShellLayout, ShellHeader, ShellFooter, ShellPageHeader, ShellPanel, LeftSidebar, RightSidebar, FloatingNav) |
| conversion | `harmony-design-system-shadcn` |
| referenceVersion | `0.9.0` |
| date | 2026-07-20 |
| result | PASS (pending human acceptance) |

## Method

- Typecheck: `packages/ui` and `apps/demo` both `tsc --noEmit` clean.
- Render: `verification/artifacts/shell-1/capture.mjs` captured all 8 shell demo routes on the conversion demo (`http://localhost:5177`) at 1280×940. Zero console/page errors on every route.
- Visual spot-check vs the reference shell components.

## Routes captured (conversion)

`/shell/layout`, `/shell/header`, `/shell/footer`, `/shell/page-header`, `/shell/left-sidebar`, `/shell/right-sidebar`, `/shell/panel`, `/cp/floating-nav` — all rendered.

## Findings

- **ShellLayout** — grid frame renders both compositions (CP floating-nav; standard footer). Grid derives from slot presence; no runtime theme detection. Matches reference structure.
- **ShellHeader** — brand + logo, company picker (indicator + selectable dropdown), avatar, and bottom gradient bar reflecting the company color. Matches reference.
- **ShellFooter** — dark bar, white tab labels, active tab pinned with primary-colored underline, Add Tab button. Matches reference footer.
- **ShellPageHeader** — title/subtitle left; outline buttons then primary button right. Matches reference.
- **ShellPanel** — non-modal drawer slides from side; theme/default/gradient headers; width toggle; wired to RightSidebar selection. Matches reference behavior (popout is a stub callback).
- **LeftSidebar / RightSidebar** — hover-expand icon rails with rounded section cards attached to the edge; RightSidebar leads with Dela AI (active logo + gradient tile). Built custom (shadcn Sidebar block not a fit) — documented.
- **FloatingNav** — CP toolbar (Execute/Actions/Refresh/Save + pin), full/compact, disabled Save. Matches reference.

## Deviations (accepted, prop-driven design)

- No runtime product/theme switching in the library (reference used a `theme-*` MutationObserver). Product surface is chosen by composition. Documented in `plans/shell.md` and `AGENTS.md`.
- Sidebars/panel are custom (not shadcn `sidebar`/`sheet` blocks) because the hover-expand rail and non-modal inline drawer do not fit those blocks. Public API follows shadcn slot/compound conventions.
- ShellPanel popout/detach is a stub (`onPopout` callback only), matching the reference TODO.

## Artifacts

`verification/artifacts/shell-1/` — `capture.mjs` + `conv-*.png` for all 8 routes.
