# Demo bootstrap verification — harmony-design-system-shadcn

**Scope:** demo site bootstrap (harness)  
**Date:** 2026-07-17  
**Surfaces:** demo `http://localhost:5177` (running); reference nav from `src/data/navigation.ts`  
**Recommendation:** **PASS** (bootstrap harness)

## Side-by-side summary

| Area | Reference | Demo | Match? |
|------|-----------|------|--------|
| Doc routes (foundation / shell / components / changelog) | All `navigation.ts` hrefs | All present in `demoNavigation` + `App` routes | Yes |
| Getting Started | N/A (conversion-only) | First nav section before Changelog; `/getting-started` | Yes (required additive) |
| Home Quick Start | Foundation / Shell / Components style cards | Installation first → `/getting-started`, then Foundation / Shell / Components | Yes |
| Unconverted scopes | Real docs | `PlaceholderPage` with status + reference link | Yes (intentional) |
| Package consumption | N/A | `HarmonyThemeProvider` + `styles/globals.css` via package name in `main.tsx` / shell | Yes |
| Coverage footer | N/A | Sidebar: version, Coverage %, bar, completed/total | Yes |
| Visual chrome vs Astro DocsLayout | Astro docs chrome | Tailwind stub shell (not pixel-matched) | Acceptable for bootstrap — not a fidelity sync of foundation/components |

## Bootstrap checklist ([VERIFICATION.md](../../../converters/harmony-design-system-shadcn/playbook/VERIFICATION.md))

| Check | Result |
|-------|--------|
| Getting Started first before Changelog | PASS |
| Home Installation → Getting Started | PASS |
| Demo imports package by `@dltkrichardhuska/harmony-design-system-shadcn/...` only | PASS (no deep `packages/ui` imports; no MUI) |
| `ImportSnippet` under `apps/demo/src/demo/ui/` | PASS |
| Coverage in menu for current `referenceVersion` | PASS (`0/51` · `0%` — expected until elements signed off) |
| HTTP smoke (`/`, `/getting-started`, placeholders, `/cp/kanban`) | PASS (200 SPA shell) |
| Typecheck | PASS |

## Nav inventory

- Reference doc hrefs: **all covered** (0 missing)
- Additive: `/getting-started`
- Correction (2026-07-21): `/cp/floating-nav` and `/cp/kanban` were previously logged as "not in reference left-nav." That was an href-inventory artifact — the reference **does** surface them in the sidebar via the runtime, product-driven `"<Product> Components"` section (`renderThemeSpecificNav` + `theme-config.ts`), not via the static `navigation.ts`. The demo now reproduces that section (`demoThemeConfig.components` + `DemoShell`), so switching product to CP shows Floating Nav (converted) and Kanban (placeholder). This is intended structure fidelity, distinct from the packages' "composition, not runtime switching" decision.

## Defects

None for bootstrap harness.

## Notes (not FAIL)

1. Foundation / shell / components are **placeholders** — not yet converted; visual fidelity verify applies after those scopes execute.
2. Getting Started uses local `CodeBlock` rather than `ImportSnippet` (helper exists for converted pages; Getting Started is global setup — OK).
3. Demo chrome is intentionally a Tailwind docs shell, not a 1:1 Astro DocsLayout port.
4. Verification lens for future element syncs: **UX designer** look/behavior parity — HTML structure differences vs reference are not defects.

## Human acceptance

Is the demo bootstrap good enough to treat as complete for this scope?
