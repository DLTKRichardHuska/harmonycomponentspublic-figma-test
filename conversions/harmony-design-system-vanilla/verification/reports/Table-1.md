# Table-1 — fidelity verify

| Field | Value |
|-------|-------|
| Element | Table |
| Result | **FAIL** (remediated → re-verify Table-2) |
| Date | 2026-09-11 |
| Demo | http://localhost:5178/components/tables |
| Reference | http://localhost:4321/components/tables |

## Visual summary

Page host collapsed to ~24px tall because `chipSheet` `:host { display: inline-flex }` restyled `demo-tables-page`. Content existed but was not reviewable. TableCostpointGrid absence accepted (skip/gap).

## Defects

| ID | Severity | Notes |
|----|----------|-------|
| DEF-001 | visual/blocking | chipSheet adopted on page host broke layout |

## Remediation

Removed `chipSheet` from DemoTablesPage styles (`harmony-chip` carries its own shadow styles). Re-verify as Table-2.
