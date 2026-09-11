# Conversion plan — Dialog

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Dialog` |
| status | `completed` |
| createdAt | `2026-09-10T19:43:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `22% (12/55)` |

## Summary

Ship Dialog as a **web-component** `<harmony-dialog>` wrapping a native `<dialog>` (`showModal` / `close`). Sticky header/footer, composed close button, convenience footer or footer slot, optional resize grip. Production additions: `close-on-backdrop`, `dirty` + `confirm-unsaved` nested confirm, cancelable `close-request`.

## Open questions

- [x] Element strategy — **resolved:** `web-component` with native `<dialog>`
- [x] Backdrop close — **resolved:** boolean `close-on-backdrop` (default true)
- [x] Unsaved — **resolved:** `dirty` + `confirm-unsaved` nested confirm + cancelable `close-request`
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Dialog | `web-component` | Tag `harmony-dialog`; open Shadow DOM; inner native `<dialog>` |

## Approach & stack fit (user confirmed)

- Native `<dialog>` for modal, Escape, focus trap/restore, `::backdrop`
- Do **not** port Astro overlay `div` + `is-open`
- Close + convenience footer compose `harmony-button` (`buttonSheet` + `typographySheet`)
- `close-on-backdrop` (default true); `dirty` + `confirm-unsaved` nested confirm
- Cancelable `close-request` with `detail.reason`; `close({ force: true })` skips gate
- Forced-colors: shadow-local
- No public document `.dialog-overlay` recipe

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `window.openDialog` / `closeDialog` | **Skip** — methods `show()` / `close()` |
| `confirmCallbackName` globals | **Skip** — events |
| Overlay `div` + `is-open` | **Omit** — native `<dialog>` |
| Public `.dialog` document recipe | **Skip** — CE-only |
| `close-on-backdrop` / `dirty` / `confirm-unsaved` | **Include** — vanilla production |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-dialog` |
| Attrs | `title`; `header-variant` default\|primary; `button-alignment` left\|right; boolean `resizable` (default true); reflected `open`; boolean `close-on-backdrop` (default true); boolean `dirty`; boolean `confirm-unsaved`; optional unsaved copy attrs |
| Methods | `show()`; `close({ force?: boolean })` |
| Events | `close`; `confirm` / `cancel` / `tertiary`; cancelable `close-request` `{ reason }` |
| Slots | **default** = body; **`footer`** wins over convenience |
| Convenience | `confirm-label`, `cancel-label`, `tertiary-label` when footer empty |
| Parts | `dialog`, `header`, `title`, `close`, `body`, `footer`, `grip`, `unsaved` |
| Form | none (body may contain consumer form) |
| Docs | `docs/components/Dialog.md`, CEM, AGENTS, llms |

### Dismiss algorithm

1. Backdrop: only if `close-on-backdrop`. Escape, X, Cancel, `close()` request close.
2. Confirm / tertiary emit events only — do not auto-close.
3. Fire cancelable `close-request`; `preventDefault()` stays open.
4. If `dirty` and not force: nested confirm when `confirm-unsaved`; else stay open.
5. Else close native dialog and emit `close`.

## Blocking dependencies

None. Button and Icon are `synced`.

## Phases

### Phase 1 — Apply

- Port dialog CSS into shadow sheet + `HarmonyDialog`; CEM; register
- Demo `/components/dialogs` (Astro-parity first; production section after)
- Docs / AGENTS / llms; flatten

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Dialog-1; execute 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy + Consumer API + backdrop/unsaved |
| User | 2026-09-10 | Explicitly requested implement plan |
| Verifier | 2026-09-10 | Dialog-1 PASS |
