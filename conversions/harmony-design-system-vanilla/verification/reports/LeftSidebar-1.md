# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `LeftSidebar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T23:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/shell/left-sidebar` (HTTP 200; CP light + dark) |
| converted | Live `http://localhost:5178/shell/left-sidebar` (HTTP 200; pierce `demo-app` / `demo-left-sidebar-page`; product Costpoint / Vantagepoint) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/left-sidebar-1/` (`ref-light-demo.png`, `ref-light-hover.png`, `conv-light-demo.png`, `conv-light-hover.png`, `ref-dark-demo.png`, `conv-dark-demo.png`, `conv-hc2.png`, `mode-compare.json`, `conv-metrics.json`) |

Rendered evidence: Playwright browse of both routes (collapsed + hover expand, light/dark, forced-colors smoke). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No consumer `variant` / multi-theme simultaneous DOM | deferred | Approved gap; product kit + demo product switch instead of Astro multi-variant DOM |
| No Astro ShellPanel DOM mutation (event-only) | deferred | Approved gap; `left-sidebar-item-select` verified on default rail |
| Different HTML / open Shadow DOM vs Astro | n/a | Not a defect per VERIFIER.md |
| Demo chrome ≠ DocsLayout | n/a | Expected |
| Educational Behavior / Theme Variants / Styling card grids | n/a | Peer shell demos (ShellHeader) also omit Astro a11y-card grids when API/snippets cover the contract — **but** snippets are missing here (see DEF-001) |
| Forced-colors look vs Astro | n/a | No reference HC baseline; shadow-local focus/active remain usable |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Left Sidebar | present | Converted `demo-page-header` title + in-progress badge |
| Intro / description | present | Product-kit / hover / product-switch framing (not Astro multi-theme wording) |
| Badges Shell Component / Theme Adaptive | deferred | Reference maturity chips; not Consumer API |
| Live Demo — CP collapsed rail (4 + 11 icons) | present | Default rail; icons + labels match CP set |
| Live Demo — expand on hover with labels | present | 52 → ~188px; labels visible |
| Behavior cards (Collapsible / Fixed / Sections / Animation) | different | Converted demos cover expand / `expanded` / `panel-open` / custom sections instead of four a11y-cards |
| Theme Variants cards (CP/VP/PPM/Mac) | deferred | Approved: no simultaneous multi-theme DOM; VP set verified via demo product switch (12 items, 1 section) |
| Styling token list card | different | Covered in package `docs/components/LeftSidebar.md`, not duplicated as Astro card |
| Accessibility keyboard callout | different | Outcomes verified (nav landmark, focus-visible, buttons); page lacks dedicated a11y section |
| npm + static consume snippets | missing | `DemoConsumeSnippets` imported but not mounted; peer shell pages include them |
| API attrs/events surface on demo | missing | No API table / snippets block on page (docs markdown exists off-page) |
| Custom `sections` override | present | Home / Favorites / Settings; Home active primary |
| `expanded` staging | present | Extra vs reference; useful |
| `panel-open` + tooltips | present | Rail stays 52px; `harmony-tooltip` present |

**Content gaps (open):** 2 (snippets + on-page API)

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| CP light section chrome | Off-white `rgb(252,253,255)` panels; right radii 12px; 1px border `rgb(191,198,212)`; XL shadow | Same bg / radius / border / shadow on `.left-sidebar__section` | present |
| CP light icons + labels | Dark slate icons; Welcome / Dashboard / My menu / Recent + 11 modules | Same set and order on Costpoint product | present |
| CP light expand | Hover widens rail; labels fade in | Same (52 → ~188; label opacity 1) | present |
| CP dark section chrome | Charcoal `rgb(51,61,71)` panels; light icons | Same | present |
| Active (controlled / custom) | Primary blue fill + inverse icon/label when active | Custom Home and `active-id` panel-open item: `rgb(42,120,198)` + white | present |
| Section / item density (CP docs) | Standalone docs: ~16px gap between sections; looser item stack (top section ~210px) | `data-density=cp`: ~8px section gap; tighter item stack (top ~180px) | different |
| VP product set | Listed in copy; simultaneous DOM hidden | Product switch → 12 items / 1 section (Command Center…Add Menu) | present |
| Focus-visible | Keyboard focus affordance | 2px theme-primary outline, offset 2px | present |
| Forced-colors | n/a | Section Canvas border; focus Highlight outline; active bordered | present |

**Visual gaps (open):** 1 (CP density vs reference docs fixture)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **FAIL**. Do not mark manifest `synced` until defects remediated or human accepts. Approved gaps above remain deferred. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Shell / component demo pages expose equal-weight npm + static consume snippets (and usually a short API surface) on the review route.
- **converted:** `/shell/left-sidebar` imports `DemoConsumeSnippets` but never renders it; no API table / consume block on the page (package `docs/components/LeftSidebar.md` + AGENTS/llms/CEM exist off-page).
- **description:** Designer/consumer reviewing the demo would not see how to install or register `harmony-left-sidebar` the way every peer converted page shows.
- **evidence:** Live `:5178/shell/left-sidebar`; `DemoLeftSidebarPage.js` (import only); compare `DemoShellHeaderPage.js` / `DemoCompanyPickerPage.js` which mount `<demo-consume-snippets>`.
- **remediationHint:** Mount `demo-consume-snippets` with npm + static zip examples matching `LeftSidebar.md`; optional short attrs/events table like Shell Header.

### DEF-002

- **status:** open
- **category:** visual
- **reference:** Docs Live Demo (CP, not inside `.shell-layout[data-cp-variant]`) shows ~16px gap between the two section cards and looser item spacing (top section ~210px tall for 4 items).
- **converted:** Costpoint product always sets `data-density="cp"` → ~8px nav gap and tighter in-section gaps (top section ~180px).
- **description:** Side-by-side on the review routes, a designer sees a denser CP rail on conversion than on the Astro docs fixture (same icons/labels/chrome colors, tighter vertical rhythm).
- **evidence:** `mode-compare.json` (`refLight.navGap` 16px vs `convLight.navGap` 8px; section heights 210/574 vs 180/474); `ref-light-demo.png` vs `conv-light-demo.png`.
- **remediationHint:** Align docs/demo density with the reference review fixture (standard gap on inline demos), or document intentional CP shell density and accept after human confirmation.

### DEF-003

- **status:** deferred
- **category:** api
- **reference:** Astro `variant` + multi-theme simultaneous DOM.
- **converted:** Product-kit defaults; no `variant` attr.
- **description:** Approved gap — do not fail.
- **evidence:** `conversion.manifest.json` `elements.LeftSidebar.gaps`; user query approved list.

### DEF-004

- **status:** deferred
- **category:** behavior
- **reference:** Astro script mutates `.shell-panel--left` on item click.
- **converted:** Emits `left-sidebar-item-select` only (demo shows last selection text).
- **description:** Approved gap — do not fail.
- **evidence:** Select handler output `Welcome screen (left-sidebar-item-0-0)` on default rail; docs Gaps section.

## Blocked items

None — both review servers reachable.

## Verifier notes

- Strategy `web-component` / `harmony-left-sidebar` matches manifest + CEM + AGENTS map.
- Component look/act for CP and VP product kits is largely designer-equivalent (chrome colors, icons, expand, active, panel-open, custom sections, focus, HC smoke).
- FAIL driven by missing on-page consume/API (DEF-001) and noticeable CP density delta vs the reference docs fixture (DEF-002).
- Content + visual matrices completed from rendered browse per DESIGNER_COMPARE.md / VISUAL_MATCH_GATE.md (three-column visual matrix; no CSS-only closure).
