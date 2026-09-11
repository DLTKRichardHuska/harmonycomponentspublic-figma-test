# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Link` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:30:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| deferred | 2 |
| **total** | 2 |

**Result:** PASS

## Side-by-side visual summary

| Area | Reference | Converted | Verdict |
|------|-----------|-----------|---------|
| Basic / muted / external | Blue link, muted gray, external icon | Match (compose icon) | Match |
| Size ladder 12/14/16 | Astro size props | Typography classes | Match |
| Default body size | Medium 14px on basic demos | 16px body inherit | Deferred (intentional API) |
| Props/A11y cards | Astro sections | API table + a11y + consume docs | Deferred / remediated on page |

## Defects

| ID | Status | Notes |
|----|--------|-------|
| DEF-001 | deferred | Default demos may inherit 16px vs Astro medium 14px — approved no size class |
| DEF-002 | deferred | Astro Props cards → API table + docs/components/Link.md |

**Open: 0**
