# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `ListMenu` |
| iteration | `1` |
| artifactType | `html` + `png` |
| generatedAt | `2026-08-14T01:35:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 0 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/list-menu` |
| converted (live) | `http://localhost:5177/components/list-menu` |
| reference PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/list-menu-1/ref-top.png` |
| converted PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/list-menu-1/conv-top.png` |
| reference HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/list-menu-1/ref.html` |
| converted HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/list-menu-1/conv.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title List Menu | present | |
| Intro | present | Same copy |
| Basic / without icons / with links / no borders | present | |
| Props ListMenu + item | present | Converted ListMenuItem / ListMenuButton |
| Accessibility | present | Additive on converted |

**Content gaps (open):** 0

### Docs / import checks

| Check | Status |
|-------|--------|
| ImportSnippet ListMenu / Item / Button / Icon | PASS |
| `docs/components/ListMenu.md` | PASS |

## Side-by-side visual / behavior summary

**Matches**

- Vertical list: Dashboard (active blue fill + white icon/text), Profile, Settings, Logout with matching glyphs
- Remaining examples present

**Differs (not defects)**

- ImportSnippet; `synced` vs `stable`; compound API vs Astro `items[]`

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Title | List Menu + stable | List Menu + synced | present (badge pattern) |
| Basic menu | Active Dashboard blue row; three muted icon rows | Same four items and active fill | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | human (prior visual accept 2026-07-20) + explicit re-verify to restore report |
| Notes | Re-verify 2026-08-13; keep `synced` |

## Recommendation

PASS — keep `ListMenu` `synced`.
