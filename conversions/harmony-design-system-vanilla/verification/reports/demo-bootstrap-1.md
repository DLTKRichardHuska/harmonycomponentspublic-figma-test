# Defect report — demo bootstrap

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `demo` (bootstrap) |
| iteration | 1 |
| recommendation | **PASS** (harness) |
| date | 2026-09-03 |

## Surfaces

| Surface | URL | Status |
|---------|-----|--------|
| Converted demo | http://localhost:5178/ | HTTP 200; Vite ready |
| Getting Started | http://localhost:5178/getting-started | Served via SPA (`main.js` includes npm + static zip guidance) |
| Package tokens | workspace package `styles/tokens.css` | HTTP 200 via demo |
| Reference Astro | http://localhost:4321/ | Used for side-by-side chrome comparison when running |

## Content inventory (bootstrap)

| Item | Status |
|------|--------|
| Getting Started before Changelog in nav | present (`demoNavigation.js`) |
| Home Installation card → Getting Started | present |
| npm install snippet | present in Getting Started page |
| Static zip / folder snippet | present (equal weight) |
| Cursor / AGENTS.md pointer | present |
| Product switcher (demo only) | present in header |
| Light/dark mode toggle | present (`.dark` / `setColorScheme`) |
| Coverage footer | present (`referenceVersion` + percent) |
| Placeholder routes for unconverted scopes | present (all reference hrefs) |
| No React/Lit/Tailwind in package elements | present (vanilla ESM only) |

## Visual / behavior (designer lens)

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Docs chrome: sidebar + main | Astro DocsLayout | DemoShell grid | match (intent) |
| Nav sections | Foundation / Shell / Components | Same + Getting Started | match |
| Unconverted pages | N/A | Placeholder + badge + link to :4321 | expected |
| Theme product control | theme-* on html | `data-product` demo-only | OK (library has no product API) |
| Dark mode | `.dark` | `.dark` + setColorScheme | match |

## AI / static deliverables

| Artifact | Status |
|----------|--------|
| `packages/ui/AGENTS.md` | present |
| `packages/ui/llms.txt` | present |
| `custom-elements.json` | generated |
| `dist-static/<product>/` + zips | built (cp/vp/ppm/maconomy) |
| `docs/CONSUMER.md` | present |

## Human confirmation

Harness bootstrap accepted for **converter readiness** (not marking catalog elements `synced`). Catalog conversion awaits `/conversion-agent` plan → execute with production-gap HITL.
