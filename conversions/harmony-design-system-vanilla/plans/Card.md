# Conversion plan — Card

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Card` |
| status | `approved` |
| createdAt | `2026-09-10T15:25:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship Card as a **hybrid** surface: product CSS styles the BEM `.card` recipe; optional light-DOM `<harmony-card>` maps attributes and light-DOM slot markers onto that recipe. Header actions compose catalog ghost icon-only buttons (no `.card__icon-btn`). Interactive CE applies button a11y (`role="button"`, focus, Enter/Space).

## Open questions

- [x] Element strategy — **resolved:** `hybrid`
- [x] Consumer API — **resolved:** see below
- [x] Header icons — **resolved:** compose ghost `btn--icon-xs` (drop `.card__icon-btn`)
- [x] CE title attrs — **resolved:** `title` / `subtitle` (not `header-title`)
- [x] Interactive CE a11y — **resolved:** set `role="button"` + keyboard

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Card | `hybrid` | CSS recipe + optional `harmony-card` |

## Approach & stack fit (user confirmed)

- Analog: `article` / `div` / `a`; host class `.card`
- Native path: BEM children; no CE required
- Hybrid: light DOM (`shadowRootInit = null`); host is styled surface
- Slot markers `header` / `header-actions` / `footer` (light DOM); unmarked → body
- `title` / `subtitle` inject header content when no `slot="header"` (precedence like Astro)
- No `icon1`–`icon3`; compose ghost icon-only buttons
- Native `.card--interactive` = CSS only; CE `interactive` = button a11y
- `cardSheet` / `cardCss` for Shadow demo hosts
- Forced-colors via product CSS / `cardSheet`

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `withHeader` / `headerTitle` / `headerSubtitle` as native props | **Omit** on native; CE uses `title` / `subtitle` |
| `icon1` / `icon2` / `icon3` | **Skip** — compose ghost icon-only |
| Astro `.card__icon-btn` | **Skip** — ghost `btn--icon-xs` (muted chrome delta accepted) |
| Auto `role="button"` on native `.card--interactive` | **Skip** — CSS only |
| Auto `role="button"` + keyboard on `<harmony-card interactive>` | **Include** |
| Kanban Card / CP Kanban | **Out of scope** |
| Footer examples | **Include** (CSS + slot exist) |
| Customized built-ins (`is=""`) | **Skip** |

## Consumer API (user confirmed)

### Native recipe

| Field | Value |
|-------|-------|
| Analog | `article` \| `div` \| `a` |
| Base | `.card` |
| Modifiers | `.card--elevated`, `.card--interactive`, `.card--primary` (combinable) |
| Inner classes | `.card__header`, `.card__header-content`, `.card__header-title` (`h2`), `.card__header-subtitle`, `.card__header-actions`, `.card__body`, `.card__footer`; also `.card__title` / `.card__subtitle`. **No `.card__icon-btn`** |
| Composition | Header actions = ghost icon-only + `harmony-icon`; footer = catalog buttons |
| A11y | Heading hierarchy; native interactive must be a real control; action buttons need `aria-label` |

### Hybrid helper

| Field | Value |
|-------|-------|
| Tag | `harmony-card` (light DOM) |
| Attrs | `elevated`, `interactive`, `primary`; `title`, `subtitle` |
| Slot markers | default → body; `header`; `header-actions`; `footer` |
| Interactive a11y | `interactive` → `role="button"`, focusable, Enter/Space → `click` |
| Form | none |
| Docs | both native and CE paths; CEM for CE |

## Blocking dependencies

None. Icon is `synced`. Button is synced for composition (not a hard catalog dep of Card).

## Phases

### Phase 1 — Apply

- Port card CSS (no `.card__icon-btn`); flatten + `cardSheet`
- Implement `HarmonyCard`; CEM; register
- Demo `/components/cards`; dogfood DemoHome
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: approved** — execute requested 2026-09-10.
