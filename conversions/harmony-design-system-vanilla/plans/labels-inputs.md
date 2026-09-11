# Conversion plan — Label, Input, Textarea

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Label` + `Input` + `Textarea` (+ conversion-only `harmony-form-layout`) |
| status | `completed` (human accept 2026-09-10; Label/Input/Textarea synced) |
| createdAt | `2026-09-10T21:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `25% (14/55)` |

## Summary

Ship **Label** as a native `.label` recipe; **Input** and **Textarea** as Shadow DOM form-associated Custom Elements (`harmony-input` / `harmony-textarea`) with a dual native CSS path (type-selector defaults on text-like `input` and all `textarea`). Add conversion-only **`harmony-form-layout`** for aligned label columns inside a native `<form>`. Card accepted as synced so Inputs demo card examples work. Catalog sync of Label/Input/Textarea is a cycle — none marked `synced` until Labels + Inputs demos verify.

## Open questions

- [x] Element strategy — **resolved:** Label `native`; Input/Textarea `web-component`
- [x] Native defaults — **resolved:** type selectors (text-like inputs + all textarea)
- [x] Dual path — **resolved:** document CSS + CE surface both ship
- [x] Labels on fields — **resolved:** `label` + `label-variant` outside `harmony-form-layout`; layout owns positioning inside it
- [x] Form helper — **resolved:** `harmony-form-layout` inside native `<form>`
- [x] Demo form-layout — **resolved:** keep all existing Inputs sections; **add** form-layout examples after
- [x] Card — **resolved:** accept Card-2 PASS → mark synced on execute
- [x] Consumer API — **resolved:** see below

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Label | `native` | `<label class="label">`; no `harmony-label` |
| Input | `web-component` | `harmony-input`; dual native CSS |
| Textarea | `web-component` | `harmony-textarea`; dual native CSS |
| Form layout | conversion-only | `harmony-form-layout` (not a catalog key) |

## Approach & stack fit (user confirmed)

- Label: `.label` / `.label--required` / `.label__helper`; native `for`
- Native fields: Harmony look by default on omitted-type + `text|email|password|number|url|search|tel` inputs and all `textarea`; `.input` / `.textarea` documented as same look
- Do not restyle checkbox, radio, file, hidden, range, date/time, color, button/submit/reset
- CEs: open Shadow DOM; `formAssociated` + `ElementInternals`; `delegatesFocus`; retarget `input`/`change`; `setFormValue`
- Input adornments: `icon` / `trailing-icon` → `harmony-icon`; `trailing` slot for light-DOM actions
- Error: `error` + `error-message`
- Standalone CE `label` + `label-variant` (`inline` | `stacked`; unset stacked, CP unset inline)
- Inside `harmony-form-layout`, `label-variant` is ignored — the layout positions light-DOM labels
- `harmony-form-layout`: light DOM; `label-layout` inline|stacked; reads child `label` attrs; creates light-DOM labels; descendants hide shadow labels; CP kit defaults unset attr to inline
- Forced-colors: document CSS for Label/native/layout; shadow-local on field CEs
- Demo Inputs: full reference parity **plus** extra form-layout sections

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Astro `labelVariant` on Input/Textarea | **Keep** — applies only outside `harmony-form-layout` |
| Astro auto-generated ids | **Skip** — consumer `id` |
| Catalog Form component | **None** — ship conversion-only `harmony-form-layout` |
| `harmony-label` | **Skip** |
| NumberInput / RangeInput / DateInput | **Out of scope** |
| Inner control not the host | **Accepted** — ElementInternals |

## Consumer API (user confirmed)

### Label (native)

```html
<label class="label" for="email">Email</label>
<label class="label label--required" for="name">First Name</label>
<label class="label" for="phone">Phone <span class="label__helper">(optional)</span></label>
```

### Native fields

```html
<input id="email" type="email" placeholder="you@example.com" />
<textarea id="msg" rows="4" placeholder="Message"></textarea>
```

### Custom Elements

| Tag | Attrs | Slots / events |
|-----|-------|----------------|
| `harmony-input` | `type`, `name`, `value`, `placeholder`, `disabled`, `required`, `readonly`, `id`, `error`, `error-message`, `icon`, `trailing-icon`, `label`, `label-variant` | `trailing`; retargeted `input`/`change` |
| `harmony-textarea` | core + `error`/`error-message`/`label`/`label-variant` + `rows` | retargeted `input`/`change` |
| `harmony-form-layout` | `label-layout` inline\|stacked | default = fields |

```html
<form>
  <harmony-form-layout label-layout="inline">
    <harmony-input id="email" name="email" type="email" label="Email" required></harmony-input>
    <harmony-textarea id="msg" name="message" label="Message" rows="4"></harmony-textarea>
  </harmony-form-layout>
  <button type="submit">Send</button>
</form>
```

## Blocking dependencies

Icon, Button, Link: `synced`. Card: accepted → mark `synced` on execute. Label ↔ Input/Textarea: circular cycle; joint verify.

## Phases

### Phase 1 — Apply

- Mark Card synced; write this plan; compute coverage
- Port Label + input/textarea + wrapper + form-layout CSS; CP compact + default inline layout
- Implement `HarmonyInput`, `HarmonyTextarea`, `HarmonyFormLayout`; CEM; register; flatten

### Phase 2 — Demo + docs

- `/components/labels`, `/components/inputs` (existing sections + form-layout examples)
- Docs / AGENTS / llms / CEM

### Phase 3 — Verification

- Capture vs reference; verifier; remediate; human accept → Label/Input/Textarea `synced`

## Approval

**Status: approved** — execute requested 2026-09-10.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-10 | Strategy, dual path, form-layout, Card accept, demo extras |
| User | 2026-09-10 | Explicitly requested implement/execute |
