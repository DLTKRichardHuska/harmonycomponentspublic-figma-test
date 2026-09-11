# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `LeftSidebar` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T23:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 2 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 4 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/shell/left-sidebar` (HTTP 200; CP light + dark) |
| converted | Live `http://localhost:5178/shell/left-sidebar` (HTTP 200; pierce `demo-app` / `demo-left-sidebar-page`; product Costpoint) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/left-sidebar-2/` (`ref-light-demo.png`, `ref-light-hover.png`, `conv-light-demo.png`, `conv-light-hover.png`, `ref-dark-demo.png`, `conv-dark-demo.png`, `reverify.json`, `dark-probe.json`) |
| prior | `verification/reports/LeftSidebar-1.md` |

Rendered evidence: Playwright re-verify of both routes after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No consumer `variant` / multi-theme simultaneous DOM | deferred | Approved gap |
| No Astro ShellPanel DOM mutation (event-only) | deferred | Approved gap; select event still fires on demo |
| Different HTML / open Shadow DOM vs Astro | n/a | Not a defect per VERIFIER.md |
| Educational Behavior / Theme Variants / Styling card grids | n/a | Replaced by demos + API + consume snippets (peer shell pattern) |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Left Sidebar | present | |
| Live Demo CP rail (4 + 11) | present | Default rail |
| Expand on hover | present | |
| API surface on demo | present | **fixed (DEF-001)** — API table + event note |
| npm + static consume snippets | present | **fixed (DEF-001)** — Consume — npm / static zip with `harmony-left-sidebar` |
| Custom sections / expanded / panel-open | present | Extra demos vs reference |
| Theme multi-DOM cards | deferred | Approved |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| CP light section chrome | Off-white panels; 12px right radius; border + XL shadow | Same `rgb(252,253,255)` / radius / border / shadow | present |
| CP light density | Section gap 16px; top section ~210px; item gap 16px | **Matches** — navGap 16px; sections 210/574; no `data-density` | present (DEF-002 fixed) |
| CP light icons + expand | Dark slate icons; hover ~188px with labels | Same | present |
| CP dark chrome | Charcoal `rgb(51,61,71)`; light text/icons `#E9ECEF` | Same | present |
| Active / select | Primary affordance + event wiring | Custom active + `left-sidebar-item-select` demo output | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Do **not** mark manifest `synced` until human confirms (AskQuestion). Deferred approved gaps remain. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Peer demos show API + npm/static consume snippets.
- **converted (iter 1):** Snippets imported but not mounted; no API block.
- **converted (iter 2):** `API` h2 + attrs table; `<demo-consume-snippets>` with npm import/`registerHarmonyElements` and static `<link>`/`<script>` + `<harmony-left-sidebar>`.
- **description:** Designer/consumer can see how to consume the CE on the review route.
- **evidence:** Live `:5178/shell/left-sidebar`; `reverify.json` (`hasConsume`, `tableRows`, `snippets`).

### DEF-002

- **status:** fixed
- **category:** visual
- **reference:** Docs fixture ~16px section/item gaps; top section ~210px.
- **converted (iter 1):** `data-density=cp` → 8px gaps; top ~180px.
- **converted (iter 2):** Standalone `space-4` gaps; measured navGap 16px; sections 210/574 — matches reference.
- **description:** Designer no longer sees a denser CP rail on the docs review surface.
- **evidence:** `reverify.json` ref vs conv section metrics; `ref-light-demo.png` / `conv-light-demo.png`.

### DEF-003

- **status:** deferred
- **category:** api
- **description:** No multi-theme simultaneous DOM — approved gap.
- **evidence:** Manifest gaps / user instruction.

### DEF-004

- **status:** deferred
- **category:** behavior
- **description:** Event-only (no ShellPanel DOM mutation) — approved gap.
- **evidence:** Demo select output `Welcome screen (left-sidebar-item-0-0)`.

## Blocked items

None.

## Verifier notes

- Re-verify after LeftSidebar-1 remediation: both open defects fixed; open == 0.
- Content + visual matrices completed from rendered browse per DESIGNER_COMPARE.md / VISUAL_MATCH_GATE.md.
