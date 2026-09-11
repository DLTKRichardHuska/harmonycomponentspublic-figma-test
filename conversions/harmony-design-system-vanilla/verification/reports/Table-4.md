# Conversion defect report — Table-4

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Table` |
| iteration | `4` |
| artifactType | `html` |
| generatedAt | `2026-09-11T20:12:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Table-3.md` (FAIL; DEF-005–008 remediated) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 1 |
| accepted | 5 |
| **total** | 10 |

**Result:** PASS

## Side-by-side visual summary

| Area | Reference (`:4321`, CP light) | Converted (`:5178`, CP light) | Verdict |
|------|-------------------------------|-------------------------------|---------|
| Native gray header + status | Green / orange / gray / blue status pills on 4 project rows | Same semantic pill set via `harmony-badge` (success / orange / default / info); Budget col present | Match (DEF-005 fixed) |
| Striped + total row | Zebra rows; Total row blue tint `--table-total-bg` | Same tint `rgba(0, 115, 230, 0.15)` wins over zebra | Match (DEF-006 fixed) |
| Interactive selection | Checkboxes, avatar+name+email, Actions | Same structure; 3 employees; kebab Actions | Match (DEF-007 fixed) |
| Usage guidelines | Best Practices + Accessibility | Both present (vanilla-adapted copy) | Match (DEF-008 fixed) |
| Hybrid demos (reorder / group / sort / filter / CC) | Fuller fixtures | Real nested tables; fewer rows / brief CC | Acceptable brevity |
| TableCostpointGrid | Full CP split grid | Out-of-scope callout | **Not a FAIL** (accepted skip) |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/tables` (CP light) |
| converted | Live `http://localhost:5178/components/tables` (CP light) |
| compare JSON | `verification/artifacts/table-4/compare.json` |
| screenshots | `verification/artifacts/table-4/ref-*.png`, `conv-*.png` |
| key clips | `*-native-gray.png`, `*-striped.png`, `ref-striped-total.png`, `*-interactive.png`, `*-usage.png` |

Rendered evidence: Playwright browse + section clips after Table-3 remediation. Not source-only.

## Fixed from Table-3

| ID | Was | Now |
|----|-----|-----|
| DEF-005 | Status as plain text / non-semantic chips | **fixed** — four `harmony-badge` pills (success / orange / default / info) |
| DEF-006 | Total row lost under striped zebra | **fixed** — computed bg equals `--table-total-bg` on striped total |
| DEF-007 | Thin interactive demo | **fixed** — avatars, emails under names, Actions kebab column |
| DEF-008 | Missing Best Practices | **fixed** — Usage guidelines with Best practices + Accessibility |

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| TableCostpointGrid omitted | accepted | Manifest `skip`; callout on demo; do not FAIL |
| Filter popovers / sort algorithms in host | accepted | Manifest gaps |
| Title-bar window chrome skipped | accepted | Manifest gaps |
| Keyboard reorder deferred | accepted | Manifest gaps |
| CommandCenterPanel compose-in-aside | accepted | Manifest gaps; brief CC table OK |
| Hybrid demo row-count brevity | accepted | Designer-visible Table-3 gaps closed; fewer rows OK per verify brief |
| Usage copy adapted for vanilla | accepted | Same sections; wording targets native/`harmony-table` consumers |
| Badge `size="small"` vs reference default height | accepted | Same semantic colors; slightly shorter pills |
| Avatar glyph vs initials mark | accepted | Avatars present; initials attr set — Avatar mark rendering is out of Table-3 remediation scope |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Tables | present | |
| Intro / hybrid note | present | |
| CostpointGrid section | deferred | Accepted skip + demo callout |
| Native default gray header | present | Badges restored; 4 rows |
| White header / striped + total | present | Combined striped + white header demo |
| Interactive / actions table | present | Avatars, emails, Actions |
| Reorderable | present | Real nested table (briefer) |
| Grouped | present | Real nested table (briefer) |
| Sortable headers | present | `columns` JSON header |
| Title / action / filter bars | present | Real body rows |
| Command Center | present | Brief PR grid + aside stub |
| Props / API | present | Surface notes |
| Usage Guidelines / Best Practices / Accessibility | present | DEF-008 closed |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Native status pills | Active green, In Progress orange, Pending gray, Review blue pills | Same four semantic pill colors via `harmony-badge` | present |
| Striped total row tint | Light blue Total row over zebra (`rgba(0,115,230,0.15)`) | Same blue Total tint; zebra does not win | present |
| Interactive employee cells | Avatar + name + muted email; Actions column | Avatar + name + muted email; Actions kebabs | present |
| Usage guidelines block | Best Practices + Accessibility cards | Best practices + Accessibility in demo card | present |
| Costpoint split grid | Full CP grid | Callout only | deferred |

**Visual gaps (open):** 0

## Defects

### DEF-005

- **status:** fixed
- **category:** visual
- **reference:** Status as green / orange / gray / blue pills
- **converted:** `harmony-badge` variants success / orange / default / info with matching pill colors
- **description:** Designer again sees categorical status color on the primary native table.
- **evidence:** `ref-native-gray.png` vs `conv-native-gray.png`; `compare.json` badges

### DEF-006

- **status:** fixed
- **category:** visual
- **reference:** Striped table Total row uses blue `--table-total-bg`
- **converted:** Total row bg `rgba(0, 115, 230, 0.15)` equals token; specificity under `.table--striped … .table-row--total`
- **description:** Designer sees Total highlighted distinctly from zebra rows.
- **evidence:** `conv-striped.png`, `ref-striped-total.png`; `compare.json` totalRow

### DEF-007

- **status:** fixed
- **category:** structure
- **reference:** Interactive table with avatars, emails, Actions
- **converted:** Same columns; three employees with avatar + email + Actions
- **description:** Designer can validate selection + people cells + row actions.
- **evidence:** `conv-interactive.png`, `ref-interactive.png`; `compare.json` interactive

### DEF-008

- **status:** fixed
- **category:** structure
- **reference:** Usage Guidelines with Best Practices + Accessibility
- **converted:** Usage guidelines section with both subsections
- **description:** Guidelines education block is present for designers consuming the demo.
- **evidence:** `conv-usage.png`, `ref-usage.png`; heading inventory in `compare.json`

## Blocked items

None — both servers reachable (`:4321`, `:5178`).

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Human confirms before manifest `synced`. |

## Verifier notes

- Designer browse of matching routes; three-column visual matrix completed.
- TableCostpointGrid explicitly excluded from FAIL per brief and manifest skip.
- Minor demo brevity on hybrid fixtures and vanilla-adapted guideline copy accepted; Table-3 designer-visible gaps closed.
- Recommend **PASS**.
