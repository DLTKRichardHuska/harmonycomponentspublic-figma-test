# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Alert` |
| iteration | `2` |
| artifactType | `html` + `png` |
| generatedAt | `2026-08-14T01:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 1 |

**Result:** PASS

**PASS: zero conversion defects.** Iteration 1 FAIL (missing Without Title examples) remediated in `AlertsDemo.tsx`; recapture confirms the section.

Prior: [Verify shadcn batch B](6c1c3f1a-40dd-413e-ae48-2967c99e325a) recommended FAIL. Chip and ProgressBar from that run remain PASS.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/alerts` |
| converted (live) | `http://localhost:5177/components/alerts` |
| reference PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/alert-1/ref-top.png` |
| converted PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/alert-1/conv-top.png` |
| reference HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/alert-1/ref.html` |
| converted HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/alert-1/conv.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Alerts | present | |
| Intro | present | |
| Variants | present | |
| Dismissible | present | |
| Without Title | present | Iteration 2: body-only info + success |
| Enhanced / actions / progress | present | |
| Props + Accessibility | present | |

**Content gaps (open):** 0

### Docs / import checks

| Check | Status |
|-------|--------|
| ImportSnippet Alert | PASS |
| `docs/components/Alert.md` | PASS |

## Side-by-side visual / behavior summary

**Matches**

- Info/success/warning/error titled variants
- Dismissible with X
- Untitled info and success (message only)
- Enhanced accent, actions, progress

**Differs (not defects)**

- ImportSnippet; `synced` vs `stable`

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Title | Alerts + stable | Alerts + synced | present (badge pattern) |
| Info / success variants | Blue info + green success banners with titles | Same | present |
| Untitled alerts | Body-only info and success, no bold title | Same copy and no title | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | explicit user instruction to remediate Without Title, then keep `synced` |
| Notes | Iteration 2 after demo fix |

## Defects

### DEF-ALERT-001

- **status:** fixed
- **category:** structure
- **reference:** Without Title — simple info and success, message only
- **converted:** `DemoExampleGroup` Without Title with the same two body-only alerts
- **description:** Designer can now see title-less alerts on the converted docs page.
- **evidence:** `AlertsDemo.tsx`; recaptured `alert-1/conv.html` contains “Without Title”

## Recommendation

PASS — keep `Alert` `synced`.
