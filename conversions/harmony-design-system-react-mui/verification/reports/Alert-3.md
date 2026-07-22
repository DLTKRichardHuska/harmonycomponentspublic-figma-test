# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Alert` |
| iteration | `3` |
| artifactType | `html` |
| generatedAt | `2026-07-06T20:40:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 0 |
| accepted | 5 |
| **total** | 9 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/alerts` (HTTP 200, CP light) |
| converted | Live review `http://localhost:5176/components/alerts` (HTTP 200, CP light) |
| prior reports | `verification/reports/Alert-1.md`, `Alert-2.md` |

Rendered evidence reviewed on both dev servers.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | accepted | MUI mapping note — target framing |
| Article nav | accepted | Converted adds Harmony mapping link |
| Section: Variants (4 severities) | present | |
| Section: Dismissible | present | |
| Section: Without Title (2 alerts) | present | |
| Section: Enhanced Variant (2 alerts) | present | |
| Section: Enhanced with Actions (2 alerts) | present | |
| Section: Enhanced with Progress (2 alerts) | accepted | `UnsupportedEquivalentCallout` — ProgressBar dependency |
| Section: Props table | present | MUI-native props |
| Section: Accessibility — Role | present | |
| Extra: Harmony → MUI mapping table | accepted | |

**Content gaps (open):** 0

## Visual parity

| Item | Status |
|------|--------|
| Standard alert border-radius 8px | present |
| Standard severity colors | present |
| Enhanced card + shadow + left accent | present |
| Enhanced action buttons 24px / 12px | present |
| Enhanced actions indent 28px | present |
| Message-to-button gap 16px | present (DEF-005 fixed — `EnhancedActions` `mt: 4`) |
| Progress examples | accepted (ProgressBar not synced) |

**Visual gaps (open):** 0

## Defects

### DEF-001 — Standard alert corner radius

- **status:** fixed

### DEF-002 — Enhanced action buttons oversized

- **status:** fixed

### DEF-003 — Enhanced actions layout

- **status:** fixed

### DEF-004 — Enhanced with Progress blocked pending ProgressBar

- **status:** accepted

### DEF-005 — Enhanced actions vertical spacing

- **status:** fixed — `EnhancedActions` uses `mt: 4` (16px) for message-to-button gap

## Verifier notes

- Demo uses direct `@mui/material` imports — no Harmony Alert wrapper export.
- Theme-only via `mapAlertToTheme.ts` (`MuiAlert`, `MuiAlertTitle`, `MuiLink`).
- Progress section correctly blocked with named ProgressBar dependency.
