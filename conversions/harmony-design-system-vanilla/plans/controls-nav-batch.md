# Conversion plan — TabStrip, ButtonGroup, ListMenu, NotificationBadge, Checkbox, Radio, Toggle

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | TabStrip, ButtonGroup, ListMenu, NotificationBadge, Checkbox, RadioButton, Toggle |
| status | `done` — human accepted 2026-09-11 (Checkbox/Radio/Toggle style tweaks included) |
| createdAt | `2026-09-11T16:29:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `53% (29/55)` |

## Summary

Ship seven catalog surfaces: two hybrid recipes (ButtonGroup, ListMenu), dual-path form CEs (Checkbox, RadioButton) plus Toggle, a wrapping NotificationBadge CE, and TabStrip as an encapsulated strip. Register the three form CEs on `harmony-form-layout` the same way as `harmony-input`. **CheckboxGroup and RadioGroup are not in this plan.**

## Open questions

- [x] Element strategy — **resolved**
- [x] Consumer API — **resolved** (user accepted packet 2026-09-11)

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| TabStrip | `web-component` | `harmony-tab-strip`; open Shadow DOM |
| ButtonGroup | `hybrid` | `.btn-group` recipe + optional light-DOM `harmony-button-group` |
| ListMenu | `hybrid` | `.list-menu` recipe + optional light-DOM `harmony-list-menu` |
| NotificationBadge | `web-component` | Wrap-target API like Tooltip |
| Checkbox | `web-component` | Dual path: native `input[type=checkbox]` CSS + `harmony-checkbox` |
| RadioButton | `web-component` | Dual path: native `input[type=radio]` CSS + `harmony-radio` |
| Toggle | `web-component` | `harmony-toggle` only; form-layout participant |

## Approach & stack fit (user confirmed)

- Native / hybrid: product `styles.css` recipes; light-DOM helpers use `HarmonyElement` with `shadowRootInit = null`
- ButtonGroup CSS: match unclassed `button` / button-type `input` / `harmony-button` as well as `.btn`
- Checkbox/Radio native path: type-selector defaults; CE uses labeled structure in open Shadow DOM
- Form fields: `formAssociated` + `ElementInternals` + `delegatesFocus`; retarget `input`/`change`; `label` / `label-variant`; register in `harmony-form-layout`
- TabStrip: overflow, Add Tab, per-tab menus; panels consumer-owned outside the CE
- NotificationBadge: host wraps anchor; badge absolutely positioned (default `top-end`)
- Forced-colors: document CSS for native/hybrid; shadow-local for TabStrip, NotificationBadge, Checkbox, Radio, Toggle
- Demo dogfood: ListMenu → DemoNav where applicable

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| CheckboxGroup / RadioGroup | **Out of scope** |
| ListMenu `items[]` JSON / `as` prop | **Skip** — compose slotted `a`/`button` |
| Public `.tab-strip` / `.notification-badge` / `.toggle` recipes | **Skip** — CE-only |
| TabStrip named slots `tab-0`…`tab-9` | **Skip** |
| Astro auto-id | **Skip** |
| NotificationBadge wrap API | **Include** |
| Checkbox `indeterminate` | **Include** — property |
| Toggle native checkbox restyle as switch | **Skip** — CE only |

## Consumer API (user confirmed)

### TabStrip — `harmony-tab-strip`

Attrs: `variant`, `overflow-mode`, `show-add-tab`, `add-tab-label`, `icon-position`, `show-tab-open-in-new`, `show-tab-close`, `show-tab-overflow-menu`, `selected`. Property `tabs[]` + `overflowTabs`. Events: `tab-select`, `tab-close`, `tab-add`, `tab-open-new`, `tab-set-default`.

### ButtonGroup — native + `harmony-button-group`

`div.btn-group.btn-group--{variant|size|orientation}` + light-DOM helper attrs.

### ListMenu — native + `harmony-list-menu`

`nav.list-menu` with `a`/`button.list-menu__item`; helper adds class if missing.

### NotificationBadge — `harmony-notification-badge`

Wraps default slot; attrs `type`, `size`, `variant`, `value`, `border`, `position`.

### Checkbox / Radio / Toggle

Native checkbox/radio CSS + `harmony-checkbox` / `harmony-radio` / `harmony-toggle` with form-layout participation.

## Blocking dependencies

Icon, Button, Label, Input (form-layout): `synced`.

## Phases

### Phase 1 — Apply

CSS, elements, CEM, form-layout registration, demos, docs, AGENTS/llms.

### Phase 2 — Verification

Verifier clusters; human accept → `synced`; `compute_coverage.mjs --write`.

## Approval

**Status: done** — human accepted 2026-09-11 (Checkbox / Radio / Toggle style tweaks included; styles regenerated).
