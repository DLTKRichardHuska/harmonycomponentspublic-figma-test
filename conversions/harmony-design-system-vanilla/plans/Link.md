# Conversion plan — Link

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Link` |
| status | `completed` |
| createdAt | `2026-09-10T18:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship Link as **native**: unclassed `<a>` is the Harmony link (reset already styles it). Only extra class: `.link--muted`. Sizes via typography classes. External via composition (`target`/`rel` + `harmony-icon`). No `harmony-link`.

## Open questions

- [x] Element strategy — **resolved:** `native`
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Link | `native` | Reset `a` + `.link--muted`; compose icons |

## Approach & stack fit (user confirmed)

- Default look = reset `a` / `a:hover`
- No base `.link` class; no size modifiers
- Icons inside `a` inherit `currentColor`
- `a.btn` remains a button (button.css wins)
- Forced-colors via document CSS (`LinkText`)

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `.link` base class | **Skip** — unclassed `a` is enough |
| `.link--small\|medium\|large` | **Skip** — typography classes |
| Auto external icon on Astro `external` prop | **Omit** — compose manually |
| `harmony-link` CE | **Skip** |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Analog | `<a>` |
| Classes | `.link--muted` only |
| Composition | External: `target`/`rel` + `<harmony-icon class="link__external-icon">` |
| A11y | native `<a>`; forced-colors document CSS |
| Docs | `docs/components/Link.md`; AGENTS map = `a` + `.link--muted` |

## Blocking dependencies

Icon is `synced`.

## Phases

### Phase 1 — Apply

- Add muted + icon inherit CSS to product bundle
- Demo `/components/links`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Link-1; plan execute approval 2026-09-10.
