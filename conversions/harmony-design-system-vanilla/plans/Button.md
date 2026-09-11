# Conversion plan — Button

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Button` |
| status | `completed` |
| createdAt | `2026-09-10T00:16:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `9% (5/55)` |

## Summary

Ship Button as a **hybrid** surface: product CSS styles native `<button>` / button-type `<input>` by default; `.btn` is the opt-in class for other tags (chiefly `<a>`). Optional light-DOM `<harmony-button>` maps attributes to those classes. Dela variants deferred until foundation Dela is synced.

## Open questions

- [x] Element strategy — **resolved:** `hybrid`
- [x] Surface — **resolved:** full parity except dela / dela-pill (deferred)
- [x] Native tags — **resolved:** default on `button` + `input[type=button|submit|reset]`; `.btn` for `<a>`
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Button | `hybrid` | CSS recipe + optional `harmony-button` |

## Approach & stack fit (user confirmed)

- Shared selectors: `button, input[type=button], input[type=submit], input[type=reset], .btn` — base + default primary + md
- Modifiers (`.btn--secondary`, sizes, etc.) work without requiring `.btn` on built-in buttons
- `.btn` required on `<a>` (and any non-button tag)
- Light-DOM hybrid CE; formAssociated + ElementInternals; no `href` on CE
- Icons via synced `<harmony-icon>`; private `.btn__spinner` (not catalog Spinner)
- `buttonSheet` / `buttonCss` for Shadow DOM hosts (demo chrome)

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `dela` / `dela-pill` + Stars graphic | **Skip / defer** until foundation Dela synced |
| `href` on hybrid CE | **Skip** — use native `<a class="btn">` |
| Catalog Spinner for loading | **Skip** — private SVG spinner |
| Customized built-ins (`is=""`) | **Skip** |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Native defaults | Unclassed `button` / `input[type=button\|submit\|reset]` = primary + md |
| Opt-in class | `.btn` on `<a>` (and non-button tags) |
| Modifiers | `.btn--primary\|secondary\|tertiary\|outline\|ghost\|destructive`, `.btn--page-header`, sizes, icon-only, loading, full, vertical, disabled |
| Tag | `harmony-button` (light DOM) |
| Attrs | `variant`, `button-type`, `size`, `orientation`, `disabled`, `loading`, `loading-text`, `icon`, `icon-position`, `type`, `full-width` |
| Form | formAssociated + ElementInternals; not a real HTMLButtonElement |
| Omissions | dela variants; href on CE |

## Blocking dependencies

None. Icon is `synced`. Spinner not a catalog dep. Dela variants deferred (accepted gap).

## Phases

### Phase 1 — Apply

- Port button CSS (no Dela); flatten + `buttonSheet`
- Implement `HarmonyButton`; CEM; register
- Demo `/components/buttons`; dogfood DemoHeader
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — human visual acceptance 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-09 | Explicitly requested execution of this plan |
| User | 2026-09-10 | Visual acceptance after Button-2 PASS → synced |
