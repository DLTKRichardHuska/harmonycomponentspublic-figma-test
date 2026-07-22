# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Link` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-09T19:40:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 2 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (links) | Live review `http://localhost:4321/components/links` |
| converted (links) | Live review `http://localhost:5176/components/links` |
| reference (alerts regression) | Live review `http://localhost:4321/components/alerts` |
| converted (alerts regression) | Live review `http://localhost:5176/components/alerts` |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic link (default/medium) | 14px regular-weight link | 14px regular-weight link | present |
| Size variant: small | 12px | 12px | present |
| Size variant: medium | 14px | 14px | present |
| Size variant: large | 16px | 16px | present |
| Alert action: Link Text | 12px caption-scale link | 12px caption-scale link | present |
| Alert action: Learn more | 12px caption-scale link | 12px caption-scale link | present |

**Visual gaps (open):** 0

## Defects

### DEF-001 (fixed)

- **category:** visual
- **description:** Iteration 1 default/medium links rendered at 16px vs reference 14px because `body2` maps to bodyEmphasized (1rem) in Harmony typography theme.
- **remediation:** `mapLinkToTheme` defaultProps `variant: 'subtitle2'`; LinksDemo medium explicit `variant="subtitle2"`.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier PASS iteration 2. |
