# Canonical Harmony sources (reference)

All paths are relative to the kit root. These files ship with the kit — no external clone needed. Verify against [docs/PINNED_SOURCES.md](../../../../docs/PINNED_SOURCES.md).

| Area | Path |
|------|------|
| Product themes + light/dark | `harmony-styles/tokens.css` — `html.theme-cp`, `theme-vp`, `theme-ppm`, `theme-maconomy` + `html.theme-*.dark` |
| Runtime class pattern | See [MAPPING_PLAYBOOK.md](../../../../docs/MAPPING_PLAYBOOK.md) Pass 1 — set one `theme-*` + optional `dark` on `document.documentElement` |
| Global CSS (canonical order) | `harmony-styles/global.css` chains: tokens → reset → layout → components → utilities |
| Individual CSS | `harmony-styles/tokens.css`, `reset.css`, `layout.css`, `components.css`, `utilities.css` |
| Icons | `harmony-data/icon-manifest.json` — keys `cp`, `vp`, `ppm`, `maconomy` |
| Custom icon SVGs | `icons/custom/` — project-specific icons not from tabler |
| Public assets | `harmony-assets/` — mic-slash.svg, RS_Dela variants, logos/PPMLogo.svg |
| Shell spec (TS) | `reference-components/ShellLayout.tsx` (+ header, footer, sidebars, panel) |
| Shell / component CSS | `harmony-styles/components.css`, `layout.css`; colocated `*.css` in `reference-components/` |
| Sidebar visibility | `reference-components/LeftSidebar.css`, `RightSidebar.css` — `html.theme-*` + `__variant--*` |
| Component manifest | `docs/COMPONENT_MANIFEST.md` — row per reference-components component |
| Mapping playbook | `docs/MAPPING_PLAYBOOK.md` — 8-pass workflow |

**Conflict rule:** Handbook vs CSS/TS → **CSS and TS win**.
