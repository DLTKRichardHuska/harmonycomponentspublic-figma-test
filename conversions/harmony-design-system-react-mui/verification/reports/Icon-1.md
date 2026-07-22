# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Icon` |
| iteration | 1 |
| artifactType | `html` |
| generatedAt | 2026-07-06T18:30:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 4 |

**Result:** FAIL

Hero and custom icon grids render real SVGs (no "?" fallbacks), but the converted page omits the Icon Selection Guide, has an incomplete Accessibility section, and lacks icon-grid hover affordances.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/icons` |
| converted (live) | `http://localhost:5176/components/icons` |
| reference (capture) | `verification/artifacts/icon-ref-rendered.html` |
| converted (capture) | `verification/artifacts/icon-conv-rendered.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| Section: Icon Props (table) | present | Equivalent prop rows |
| Section: Usage — Icon Component code | present | |
| Section: Usage — Icon Sizes (xs–xl) | present | Correct pixel labels |
| Section: Icon Selection Guide | **missing** | Entire section absent (DEF-001) |
| Subsection: Icon Hierarchy for Application Development | **missing** | Part of DEF-001 |
| Subsection: Heroicons (Primary) preview + code | **missing** | Part of DEF-001 |
| Subsection: Tabler Icons (Secondary Fallback) | **missing** | Part of DEF-001 |
| Subsection: Custom Icons (Tertiary) preview + code | **missing** | Part of DEF-001 |
| Section: Hero Icons - Outline (284 icons) | present | All 10 categories |
| Section: Custom Icons (40 icons) | present | All 8 categories |
| Custom Icons intro — extension sentence | **different** | Missing second sentence (DEF-003) |
| Section: Accessibility | **different** | Present but shortened (DEF-002) |
| Accessibility — eye icon in heading | **missing** | DEF-002 |
| Accessibility — Tabler mention in body | **missing** | DEF-002 |
| Accessibility — Edit + Delete code examples | **different** | Edit only; Delete missing (DEF-002) |

**Content gaps (open):** 4 (via defects below)

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Icon Sizes row (home xs–xl) | 12/16/20/24/32 px SVGs | Same dimensions | present |
| Hero/custom grid icons | SVG paths, secondary color | SVG paths, secondary color | present |
| Icon grid cell hover | Hover bg + theme-primary tint + cursor | Static cells, no hover | **different** (DEF-004) |
| Selection guide preview rows | Bordered demo cards | Not shown | **missing** (DEF-001) |
| Accessibility card | Eye icon + a11y-card styling | Plain Paper, no eye icon | **different** (DEF-002) |

**Visual gaps (open):** 2 (DEF-002, DEF-004)

## Defects

### DEF-001 — Icon Selection Guide section missing

- **status:** open
- **category:** structure
- **reference:** Between Usage and Hero Icons grid, reference shows "Icon Selection Guide" with hierarchy card (Heroicons → Tabler → Custom), three preview example sections, code samples, and Tabler browse link.
- **converted:** Section not present; page goes directly from Usage/Icon Sizes to "Hero Icons - Outline".
- **description:** Designer would see no guidance on icon priority order or Tabler fallback usage.
- **evidence:** `icon-ref-rendered.html` contains "Icon Selection Guide", "Tabler Icons (Secondary Fallback)"; `icon-conv-rendered.html` does not.
- **remediationHint:** Port selection-guide block from `src/pages/components/icons.astro` into `IconsDemo.tsx` (hierarchy card + three ExampleSections).

### DEF-002 — Accessibility section incomplete

- **status:** open
- **category:** structure
- **reference:** h2 "Accessibility" card with eye icon, text mentioning Heroicons/Tabler/Custom, and two button examples (Edit + Delete).
- **converted:** h3 "Accessibility" with shortened body text and only Edit-document code sample; no eye icon in heading.
- **description:** Designer would see less complete accessibility guidance than reference.
- **evidence:** Reference lines with `Heroicons, Tabler, and Custom` and `aria-label="Delete item"`; absent on converted capture.
- **remediationHint:** Match reference a11y-card content in `IconsDemo.tsx`; add eye `Icon` in heading and second code block.

### DEF-003 — Custom Icons intro missing extension sentence

- **status:** open
- **category:** structure
- **reference:** "40 domain-specific icons… These icons extend Heroicons with project-specific needs."
- **converted:** First sentence only; extension clause omitted.
- **description:** Designer would miss the contextual link between custom icons and Heroicons.
- **evidence:** `icon-ref-rendered.html` vs `IconsDemo.tsx` Custom Icons intro.
- **remediationHint:** Add second sentence to Custom Icons `Typography` block.

### DEF-004 — Icon grid cells lack hover interactivity

- **status:** open
- **category:** behavior
- **reference:** Each grid cell has `hover:bg-hover-bg`, `cursor-pointer`, and `group-hover:text-theme-primary` on the icon.
- **converted:** `IconGrid` cells are static — no hover background, cursor, or color transition (0 vs 648 hover classes in reference capture).
- **description:** Designer would notice grid cells feel inert compared to reference browse experience.
- **evidence:** `icon-ref-rendered.html` vs `icon-conv-rendered.html`; `IconGrid` in `IconsDemo.tsx`.
- **remediationHint:** Add hover sx to grid cell `Box` (bgcolor, cursor, icon color on `:hover`).

## Blocked items

None.

## Verifier notes

- Content inventory and visual matrix completed per DESIGNER_COMPARE.md.
- Icon rendering verified across hero categories (e.g. `arrow-down`, `chart-pie`, `currency-dollar`) and custom categories (e.g. `gantt-chart`, `Risk Shield`, `mic-slash`, `Dela D in dark circle 1`) — all render SVG paths; zero "?" fallback boxes.
- Manifest `elements.Icon.status` is `in-progress`; grids are not placeholders.
- **Recommendation:** FAIL — remediate DEF-001 through DEF-004, then re-verify. Do not mark `synced` until human accepts after PASS.
