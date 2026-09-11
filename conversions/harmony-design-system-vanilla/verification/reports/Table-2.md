# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Table` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T19:54:26.846Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Table-1.md` (FAIL; page host collapsed via chipSheet `:host`) |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 1 |
| blocked | 0 |
| deferred | 1 |
| accepted | 5 |
| **total** | 10 |

**Result:** FAIL

## Side-by-side visual summary

| Area | Reference (`:4321`, CP light) | Converted (`:5178`, CP light) | Verdict |
|------|-------------------------------|-------------------------------|---------|
| Page host / layout | Full scrollable Tables doc | Host no longer collapsed (~1144×1041 main; tables ~798px wide) | Match (DEF-001 fixed) |
| Native gray header | 4 cols + status **chips**, 4 data rows | 4 cols; status as plain text; 3 rows; full width | Gap (DEF-002) |
| Striped / white header | Separate white-header + striped+total examples | Combined striped + white header + Total row | Partial |
| Interactive selection | Checkboxes, avatars, emails, actions menu | Leaked plain-text dump + stub "COLUMN" / "Table body content." | Fail (DEF-003) |
| Reorderable / Grouped / Sortable | Full project grids, grips, hierarchy, sort headers | Same stub pattern; data outside table | Fail (DEF-003) |
| Filter + title/action bars | Real filter UI + populated table | Bars/chips OK; table body still stub | Fail (DEF-003) |
| Command Center | Full PR grid + docked panel | Brief stub + "Detail" placeholder panel | Fail (DEF-003) |
| TableCostpointGrid | Split frozen/scroll CP grid | Out-of-scope callout only | **Not a FAIL** (accepted skip) |
| Usage / a11y guidelines | Present | Missing | Gap (DEF-004) |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/tables` (CP light) |
| converted | Live `http://localhost:5178/components/tables` (CP light) |
| screenshots | `verification/artifacts/Table-2-ref.png`, `Table-2-conv.png` |
| section PNGs | `verification/artifacts/accordion-table-2/conv-tables-sec-Interactive-selection.png`, `*-Reorderable.png`, `*-Filter-bar-title-action-bars.png`, `*-Command-Center-brief-.png`, `*-Native-default-gray-header.png` |
| metrics | `verification/artifacts/accordion-table-2/conv-tables-detail.json` |

Rendered evidence: Playwright browse after chipSheet remediation. Not source-only.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| TableCostpointGrid omitted | accepted | Manifest `skip`; do not FAIL |
| Filter popovers / sort algorithms in host | accepted | Manifest gaps |
| Title-bar window chrome skipped | accepted | Manifest gaps |
| Keyboard reorder deferred | accepted | Manifest gaps |
| CommandCenterPanel compose-in-aside | accepted | Manifest gaps; placeholder OK **only if** table body itself is real |
| Badge `in progress` vs no badge | deferred | Docs chrome |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Tables | present | |
| Intro | present | |
| CostpointGrid section | deferred | Accepted skip + demo callout |
| Native default gray header | different | Present but missing chips / row count |
| White header table | different | Folded into striped demo |
| Interactive / actions table | different | Stub + leaked text |
| Striped table | present | Combined variant |
| Reorderable | different | Stub |
| Grouped | different | Stub |
| Sortable headers | different | Headers partly OK; body stub |
| Title / action / filter bars | different | Chrome partial; body stub |
| Command Center | different | Brief stub |
| Props / API | present | Surface notes table |
| Usage Guidelines / Accessibility | missing | DEF-004 |

**Content gaps (open):** 3 (DEF-002–004)

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Page host height/width | Full article scroll (~8.7k) | Full main scroll (~3.6k); **not** ~24px collapsed | present (fixed) |
| Native gray header table | Wide table; colored status chips | Wide table; plain Status text | different |
| Hybrid feature demos | Populated rows inside table | "COLUMN" / "Table body content." with data as text above | different |
| Filter chips / Period+Status buttons | In filter bar with live table | Buttons + Chip X render; table body stub | different |
| Costpoint split grid | Full CP grid | Callout only | deferred |

**Visual gaps (open):** 2 (DEF-002, DEF-003)

## Prior FAIL remediation (Table-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | `chipSheet` on `demo-tables-page` collapsed host via `:host { display: inline-flex }` | **fixed** — page renders; tables measure ~798×182+ |

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** Full-width Tables page
- **converted:** Main content ~1144×1041; first native table ~798×182
- **description:** Designer can again review Tables; host is no longer a collapsed strip.
- **evidence:** `Table-2-conv.png`; `conv-tables-detail.json`

## Defects

### DEF-002

- **status:** open
- **category:** visual
- **reference:** Default gray-header table shows Status as green/orange/gray/blue chips across four project rows
- **converted:** Same columns but Status is plain text; three rows; no chip pills
- **description:** Designer would notice missing status chips and a thinner sample set on the primary native table.
- **evidence:** `ref-tables-sec-Default-Table-with-Gray-Header.png` vs `conv-tables-sec-Native-default-gray-header.png`
- **remediationHint:** Restore Chip (or equivalent) status cells and match reference row set on the native demo.

### DEF-003

- **status:** open
- **category:** structure
- **reference:** Interactive, reorderable, grouped, sortable, filter-bar, and Command Center demos show real rows inside the table
- **converted:** Those hybrid sections dump row text above the control and show placeholder "COLUMN" / "Table body content." inside the table
- **description:** Designer cannot validate selection, reorder grips-in-rows, grouping, sort-with-data, or CC body fidelity — demos read as broken fixtures, not Harmony tables.
- **evidence:** `conv-tables-sec-Interactive-selection.png`, `conv-tables-sec-Reorderable.png`, `conv-tables-sec-Filter-bar-title-action-bars.png`, `conv-tables-sec-Command-Center-brief-.png`; detail JSON rows=2 stubs
- **remediationHint:** Fix `harmony-table` demo slotting so header/body rows render inside the table (not as adjacent text nodes); populate fixtures like reference.

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Usage Guidelines with Best Practices + Accessibility
- **converted:** No Usage/Accessibility section on Tables demo
- **description:** Designer would miss the guidelines/a11y education block present on reference.
- **evidence:** Heading inventory — ref has Usage Guidelines/Accessibility; conv headings end at API + Consume
- **remediationHint:** Add equivalent Usage/Accessibility content (or explicitly defer with human acceptance).

## Blocked items

None — both servers reachable.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | FAIL recommendation; CostpointGrid skip already human-accepted and excluded from FAIL |

## Verifier notes

- Content + visual matrices from rendered browse (VISUAL_MATCH_GATE three-column).
- **Did not FAIL** for skipped `TableCostpointGrid` (manifest `gap`/`skip`, demo callout present).
- chipSheet host-collapse from Table-1 is resolved; remaining FAIL is demo fidelity of hybrid examples + native chips + missing guidelines.
