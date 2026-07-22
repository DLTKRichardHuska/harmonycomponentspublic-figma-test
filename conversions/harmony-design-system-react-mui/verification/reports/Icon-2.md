# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Icon` |
| iteration | 2 |
| artifactType | `html` |
| generatedAt | 2026-07-06T19:35:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 4 |

**Result:** PASS

All four open defects from Icon-1 are remediated. Live rendered review of `:4321/components/icons` vs `:5176/components/icons` shows full content parity and equivalent icon-grid hover affordances.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/icons` |
| converted (live) | `http://localhost:5176/components/icons` |
| reference (capture) | `verification/artifacts/icon-ref-iter2-rendered.html` |
| converted (capture) | `verification/artifacts/icon-conv-iter2-rendered.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| Section: Icon Props (table) | present | Equivalent prop rows |
| Section: Usage — Icon Component code | present | |
| Section: Usage — Icon Sizes (xs–xl) | present | Correct pixel labels |
| Section: Icon Selection Guide | present | Fixed (was DEF-001) |
| Subsection: Icon Hierarchy for Application Development | present | Fixed (was DEF-001) |
| Subsection: Heroicons (Primary) preview + code | present | Fixed (was DEF-001) |
| Subsection: Tabler Icons (Secondary Fallback) | present | Fixed (was DEF-001) |
| Subsection: Custom Icons (Tertiary) preview + code | present | Fixed (was DEF-001) |
| Section: Hero Icons - Outline (284 icons) | present | All 10 categories |
| Section: Custom Icons (40 icons) | present | All 8 categories |
| Custom Icons intro — extension sentence | present | Fixed (was DEF-003) |
| Section: Accessibility | present | Fixed (was DEF-002) |
| Accessibility — eye icon in heading | present | Fixed (was DEF-002) |
| Accessibility — Tabler mention in body | present | Fixed (was DEF-002) |
| Accessibility — Edit + Delete code examples | present | Fixed (was DEF-002) |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Icon Sizes row (home xs–xl) | 12/16/20/24/32 px SVGs | Same dimensions | present |
| Hero/custom grid icons | SVG paths, secondary color | SVG paths, secondary color | present |
| Icon grid cell hover | Hover bg + theme-primary tint + cursor | MUI `action.hover` bg + `primary.main` icon tint + cursor | present |
| Selection guide preview rows | Bordered demo cards | Outlined Paper cards with equivalent previews | present |
| Accessibility card | Eye icon + a11y-card styling | Eye icon + outlined Paper card | present |

**Visual gaps (open):** 0

## Defects

### DEF-001 — Icon Selection Guide section missing

- **status:** fixed
- **category:** structure
- **reference:** Between Usage and Hero Icons grid, reference shows "Icon Selection Guide" with hierarchy card, three preview example sections, code samples, and Tabler browse link.
- **converted:** Full section present with hierarchy card, Heroicons/Tabler/Custom subsections, previews, code blocks, and Tabler link.
- **description:** Designer now sees the same icon-priority guidance as reference.
- **evidence:** `icon-conv-iter2-rendered.html` contains "Icon Selection Guide", "Icon Hierarchy for Application Development", "Browse Tabler Icons →".

### DEF-002 — Accessibility section incomplete

- **status:** fixed
- **category:** structure
- **reference:** Accessibility card with eye icon, text mentioning Heroicons/Tabler/Custom, and two button examples (Edit + Delete).
- **converted:** Eye icon beside "Icon Accessibility" heading, full body text with Tabler mention, Edit + Delete code samples.
- **description:** Designer now sees complete accessibility guidance matching reference intent.
- **evidence:** `icon-conv-iter2-rendered.html` contains `Heroicons, Tabler, and Custom`, `aria-label="Delete item"`, eye icon before "Icon Accessibility".

### DEF-003 — Custom Icons intro missing extension sentence

- **status:** fixed
- **category:** structure
- **reference:** "40 domain-specific icons… These icons extend Heroicons with project-specific needs."
- **converted:** Both sentences present in Custom Icons intro.
- **description:** Designer sees contextual link between custom icons and Heroicons.
- **evidence:** `icon-conv-iter2-rendered.html` contains "extend Heroicons with project-specific needs".

### DEF-004 — Icon grid cells lack hover interactivity

- **status:** fixed
- **category:** behavior
- **reference:** Grid cells use `hover:bg-hover-bg`, `cursor-pointer`, and `group-hover:text-theme-primary`.
- **converted:** Grid cells use `cursor:pointer`, `:hover` background (`action.hover`), and icon color shift to `primary.main` via `.icon-cell` (327 cells).
- **description:** Designer would see equivalent browse affordance on grid hover.
- **evidence:** Emotion rules in `icon-conv-iter2-rendered.html`: `.css-1fdmgnj:hover{background-color:var(--mui-palette-action-hover)}`, `.css-1fdmgnj:hover .icon-cell{color:var(--mui-palette-primary-main)}`.

## Blocked items

None.

## Verifier notes

- Rendered evidence reviewed on live dev servers (`:4321`, `:5176`) and Playwright captures (CP light).
- Content inventory and visual matrix completed per DESIGNER_COMPARE.md.
- Icon rendering verified across hero categories (e.g. `arrow-down`, `chart-pie`, `currency-dollar`) and custom categories (e.g. `gantt-chart`, `Risk Shield`, `mic-slash`, `Dela D in dark circle 1`) — all render SVG paths; zero "?" fallback boxes.
- Iteration-1 defects DEF-001 through DEF-004 confirmed fixed on rendered surface.
- Manifest `elements.Icon.status` remains `in-progress` — verifier recommends PASS; human sign-off required before `synced`.
- **Recommendation:** PASS — zero open conversion defects. Do not mark `synced` until human accepts.
