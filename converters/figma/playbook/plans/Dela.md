# Conversion plan — Dela (Figma VP)

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Dela` |
| status | `approved` |
| createdAt | `2026-07-22T20:26:00.000Z` |
| product | `vp` |
| referenceVersion | `0.9.0` |

## Summary

Convert Foundation / Dela on the VP library: add Dela Color variables + `Dela/gradient` paint style, build a demo-first page on existing chrome, verify against shadcn `/foundation/dela`. Unlocks Button’s hard dep on Dela. No component set — `figma-variable` strategy.

## Blocking dependencies

| Element | Status | Notes |
|---------|--------|-------|
| Colors | synced | |
| Typography | synced | |
| Spacing | synced | |
| Elevations | synced | |
| Icon | synced | |
| Button | not required | Button is blockedBy Dela; do not instance Button |

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Dela | `figma-variable` | Brand tokens + gradient paint style + page demo |

## Figma strategy packet (user confirmed)

### Consumer API → Figma

| CSS / shadcn | Figma | Notes |
|--------------|--------|-------|
| `--gradient-dela-start` | Color/`gradient-dela-start` | Light/Dark same |
| `--gradient-dela-end` | Color/`gradient-dela-end` | Light/Dark same |
| `--dela-header-content-fg` | Color/`dela-foreground` | Always white |
| `--gradient-dela-hover-bg` | Color/`gradient-dela-hover-bg` | RGBA |
| `--gradient-dela` / `bg-dela` | Paint style `Dela/gradient` | 119deg linear #8A33C2 → #423FE2 |

HTML `state`: **none**. Axes: **none**.

### Deferred / gaps

- Live Ask Dela panel, Panel Usage, AI Guidelines, a11y (shell)
- Button CTA instance until Button converts
- Panel bubble tokens (`--dela-bubble-*`, `--dela-panel-*`) until ShellPanel

### Page content

1. Token swatches (start/end/foreground/hover) + large `Dela/gradient` square
2. Star symbol asset (min 20px)
3. Ask Dela Launch Icon asset (min 27px)
4. Brand guide: static gradient sample + URL note (not Button set)

Update-in-place: `Page content` `15:29`; record demo root as `elements.Dela.nodeId`.

### Token / efficiency forecast

| Risk | Level | Mitigation |
|------|-------|------------|
| Grid / volume | Low | No variant grid |
| Payload | Low–Med | Two small SVGs via upload_assets |
| Loop | Low | One-pass + 1–2 screenshots |
| Dependency / redo | Low | Foundation synced; no Button dep |

## Approval

**Status: approved** — user confirmed via plan execute (2026-07-22). Apply → verify until PASS → `review`.

## Post-apply

- **2026-07-22 apply:** Color vars `gradient-dela-start|end`, `dela-foreground`, `gradient-dela-hover-bg`; paint style `Dela/gradient`; page demo on `86:7` (swatches, static brand sample, Stars + AskDelaLaunch SVGs).
- **Dela-1 FAIL** — unbound text/frame fills ([Dela-1.md](../../verification/reports/Dela-1.md)). Remediated: bind text-primary/secondary + dela-foreground on sample; clear layout frame fills.
- **Dela-2 PASS** — ([Dela-2.md](../../verification/reports/Dela-2.md)). Host advanced **`review` → `needs-publish`**.
- **VP synced (2026-07-22)** — human published library; sign-off → host status **`synced`** (Code Connect N/A). Button `blockedBy` cleared of Dela (and stale synced Icon).
