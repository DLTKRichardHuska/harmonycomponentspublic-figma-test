# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Button` |
| iteration | `1` |
| artifactType | `html` + `png` |
| generatedAt | `2026-07-18T18:25:00.000Z` |
| referenceVersion | `0.9.0` |
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
| reference (live) | `http://localhost:4321/components/buttons` |
| converted (live) | `http://localhost:5177/components/buttons` |
| reference HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/ref-buttons.html` |
| converted HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/conv-buttons.html` |
| reference PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/ref-buttons-top.png` |
| converted PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/conv-buttons-top.png` |
| reference PNG (dela region) | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/ref-dela.png` |
| converted PNG (dela region) | `conversions/harmony-design-system-shadcn/verification/artifacts/button-1/conv-dela.png` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Buttons | present | |
| Intro description | present | |
| Examples / Props / Usage / Accessibility nav | present | |
| Button Types (theme + page header) | present | |
| Variants (primary→destructive) | present | |
| Dela Buttons (dela + dela-pill + stars) | present | Gradient + Stars.svg |
| Sizes xs–lg | present | |
| With Icons / Icon Only | present | Package `Icon` |
| States (theme + page header disabled) | present | |
| Loading / Full Width / Vertical / Combinations | present | |
| Props table | present | Adds `asChild` (stack-native, additive) |
| Usage guidelines + Do/Don't | present | |
| Accessibility cards | present | |

**Content gaps (open):** 0

### Docs / import checks

| Check | Status |
|-------|--------|
| Element-specific ImportSnippet with package name | PASS |
| No duplicated Getting Started global setup | PASS (link only) |
| Snippet matches `packages/ui` exports | PASS |

### Stack elegance

| Check | Status |
|-------|--------|
| shadcn-style `cva` + Tailwind token utilities | PASS |
| Package `Icon` for `icon` prop (no Lucide at call sites) | PASS |
| Radix Slot `asChild` optional | PASS |
| Harmony variants kept (not remapped to stock shadcn-only set) | PASS |

## Side-by-side visual / behavior summary

**Matches**

- Theme vs page-header primary/secondary/tertiary hierarchy and colors
- Variant row including outline, ghost, destructive
- Dela gradient + stars + pill radius
- Size ladder and icon / icon-only layouts
- Loading spinner + loadingText behavior (content replaced)
- Vertical orientation and combinations

**Differs (not defects)**

- Converted includes ImportSnippet (required for conversion docs)
- Reference “stable” badge omitted (DemoPageHeader parity with Icon page)
- DOM uses Tailwind/`cva` classes vs Astro `.btn` — expected for this target

## Recommendation

PASS — recommend human accept visual match, then mark `Button` `synced` and recompute coverage.
