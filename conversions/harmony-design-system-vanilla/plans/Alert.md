# Conversion plan — Alert

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Alert` |
| status | `completed` |
| createdAt | `2026-09-10T19:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `20% (11/55)` |

## Summary

Ship Alert as a **web-component** `<harmony-alert>`. Dismiss emits a `dismiss` CustomEvent (consumer removes). Enhanced action buttons/links are composed via an **`actions` slot** using design-system buttons and links — no Astro `primaryButton` / `linkText` props.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Dismiss — **resolved:** `dismiss` CustomEvent (no auto-remove)
- [x] Enhanced actions — **resolved:** `actions` slot; compose `harmony-button` / native `.btn` / `<a>` links
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Alert | `web-component` | Tag `harmony-alert`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Open Shadow DOM on `HarmonyElement`
- Default icons per variant; override via `icon`
- Default slot = message; `title` attr; `dismissible` close control
- `enhanced` boolean (not HTML `style` — avoids clash with CSS `style`)
- Enhanced: accent border; optional `actions` slot; optional `progress-value` → inner `harmony-progress` (size sm; variant maps info→default)
- Close click → `dismiss` CustomEvent (`bubbles`, `composed`); **does not** remove the host
- Compose synced catalog: `harmony-icon`, buttons/links in light-DOM `actions` slot, `harmony-progress`
- Forced-colors: shadow-local
- No public `.alert` document recipe (CE-only, same as Badge/Chip)

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| `primaryButton` / `secondaryButton` / `linkText` / `linkHref` props | **Skip** — compose in `actions` slot |
| Astro inline `onClick` strings | **Skip** — real buttons + listeners / href |
| Auto `.remove()` on dismiss | **Skip** — emit `dismiss` only |
| Astro prop name `style="enhanced"` | **Omit** — use boolean `enhanced` (HTML `style` reserved) |
| Public `.alert` CSS recipe | **Skip** — CE-only |
| `role="alert"` | **Include** |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-alert` |
| Attrs | `variant` info\|success\|warning\|error (default info); boolean `enhanced`; `title`; boolean `dismissible`; `icon` (override default Hero name); `progress-value` (number, enhanced; renders `harmony-progress`) |
| Slots | **default** = message body; **`actions`** = enhanced actions row (compose `harmony-button` / `<button class="btn--* btn--xs">` / `<a class="btn …">` / text `<a>`) |
| Events | `dismiss` — CustomEvent, `bubbles: true`, `composed: true` (close control only) |
| Parts | `border`, `icon`, `title`, `message`, `close`, `actions`, `progress` |
| Form | none |
| A11y | `role="alert"`; close `aria-label="Dismiss"`; forced-colors shadow-local |
| Omissions | No button/link text attrs; no auto-remove; no public CSS recipe |
| Docs | `docs/components/Alert.md`, CEM, AGENTS, llms |

### Usage

```html
<harmony-alert variant="info" title="Information">
  This is an informational message.
</harmony-alert>

<harmony-alert variant="success" enhanced title="Success" dismissible>
  Saved.
  <div slot="actions">
    <harmony-button size="xs" variant="primary">Confirm</harmony-button>
    <harmony-button size="xs" variant="secondary">Cancel</harmony-button>
    <a href="/docs">Learn more</a>
  </div>
</harmony-alert>

<harmony-alert variant="warning" enhanced title="Countdown" progress-value="45" dismissible>
  Expiring soon.
</harmony-alert>
```

```js
alert.addEventListener('dismiss', () => alert.remove());
```

## Blocking dependencies

None. Icon, Button, ProgressBar, Link are `synced`.

## Phases

### Phase 1 — Apply

- Port alert CSS into shadow sheet + `HarmonyAlert`; CEM; register
- Demo `/components/alerts` (actions via slot composition)
- Docs / AGENTS / llms; flatten

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Alert-2; execute 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy, dismiss, enhanced actions confirmed |
| User | 2026-09-10 | Explicitly requested build/execute |
| Verifier | 2026-09-10 | Alert-2 PASS |
