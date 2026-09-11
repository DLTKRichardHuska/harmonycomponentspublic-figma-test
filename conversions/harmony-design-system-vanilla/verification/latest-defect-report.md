# Conversion defect report (latest)

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `controls-nav` batch re-verify (hybrid-2 + form-2) |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T17:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| reports | `reports/controls-nav-hybrid-2.md`, `reports/controls-nav-form-2.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 6 |
| blocked | 0 |
| deferred | 7 |
| accepted | 0 |
| **total** | 13 |

**Result:** PASS

**PASS: zero conversion defects.**

### Per-element recommendation

| Element | Verdict | Prior open defects |
|---------|---------|-------------------|
| ButtonGroup | **PASS** | none (smoke OK) |
| ListMenu | **PASS** | none (smoke OK) |
| NotificationBadge | **PASS** | hybrid-1 DEF-001, DEF-002 → fixed |
| Checkbox | **PASS** | form-1 DEF-001, DEF-002 → fixed |
| RadioButton | **PASS** | form-1 DEF-003 → fixed |
| TabStrip | **PASS** | form-1 DEF-004 → fixed |
| Toggle | **PASS** | form-1 already PASS |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321` matching `/components/*` routes |
| converted | `http://localhost:5178` matching routes |
| evidence | `verification/artifacts/controls-nav-2/` |

## Remediation confirmation

| Claimed fix | Re-verify outcome |
|-------------|-------------------|
| NotificationBadge `box-sizing: border-box` | Number sm/md 15×15 match reference |
| NotificationBadge shadow-local forced-colors | Digits/overflow readable under forced-colors |
| Checkbox/Radio `box-sizing: border-box` | CE boxes 18×18; radio 14/18/22 |
| TabStrip remove `row-reverse` for icon-right | Icons appear to the right of labels |
| Checkbox Usage Guidelines Do/Don't | Section present with matching bullets |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS for all controls-nav batch elements above. Ask before marking any `synced` in the manifest. |

## Verifier notes

- Full detail: `controls-nav-hybrid-2.md` and `controls-nav-form-2.md`.
- Reference Astro TabStrip "With Icons (Right)" still visually left-aligns icons (row-reverse bug); converted matches section intent (icon right). Not counted as a conversion FAIL.
