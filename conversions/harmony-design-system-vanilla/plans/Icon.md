# Conversion plan — Icon

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Icon` |
| status | `completed` |
| createdAt | `2026-09-09T20:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `7% (4/55)` |

## Summary

Ship the first catalog Custom Element: `<harmony-icon>`. **Heroicons 24/outline** come from the official `heroicons` npm package (https://heroicons.com/, MIT) at kit build — Harmony does not commit Hero SVG blobs. **Custom** glyphs are Harmony SVG files. Apps look up by `name`, optionally `registerIcons()`, or slot raw SVG. Demo `/components/icons` plus replace demo chrome inline SVGs that have Harmony names.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Approach & stack fit — **resolved:** kit-build glob of `heroicons` 24/outline + Harmony custom SVGs; shadow SVG + `registerIcons()`
- [x] Production gaps — **resolved:** table below
- [x] Consumer API — **resolved:** outline-only; **no `variant`**; **host `class` included** (user revision)
- [x] Heroicons source — **resolved:** full 24/outline set from npm `heroicons` at kit build (not `icon-manifest.json` copies)

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Icon | `web-component` | Tag `harmony-icon`; first catalog element |

## Approach & stack fit (user confirmed)

- **Heroicons (public set):** `heroicons` is a **build/dev dependency**. Kit build globs `node_modules/heroicons/24/outline/*.svg` into a **generated** JS registry (`name` = filename without `.svg`). Same outline set in every product kit. Do **not** copy Hero paths/SVG strings from `src/data/icon-manifest.json`. Do **not** require `heroicons` or Node at consumer runtime.
- **Custom (Harmony):** pack Harmony-owned SVGs from reference `public/` (names used on the Icons page and other custom `name`s). These are the only glyphs this project authors.
- Lookup order: default slot (raw SVG) → `registerIcons()` → custom registry → Hero 24/outline → `?` fallback.
- Render in **open Shadow DOM** via `HarmonyElement` + `adoptedStyleSheets`.
- Sizes from `--icon-xs` … `--icon-xl`. Color via `currentColor` (inherit from host). Host `class` is native.
- No Tabler webfont, no `fetch('/name.svg')`, no `product` attr. MIT attribution for Heroicons in consumer docs.

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Full Heroicons 24/outline from npm `heroicons` | **Include** — generated at kit build; not authored in git |
| Harmony custom SVGs (`public/*.svg`) | **Include** — Harmony-owned files packed into the kit |
| App-specific extra names | **Include** via `registerIcons()` |
| Tabler webfont / `<i class="ti ti-*">` / Tabler as a second library | **Skip** (`pin` and other Tabler-only names later as custom SVGs if a dependent needs them) |
| Inline Hero copies in `icon-manifest.json` as vanilla source | **Skip** — reference file stays for Astro; vanilla does not consume those SVG blobs |
| Node `fs` / `heroicons` as a **runtime** consumer dependency | **Skip** — build-time only; kits are self-contained |
| Host CSS `class` (`className` / `classList`) | **Include** — native `HTMLElement` class on `<harmony-icon>`; `:host { color: inherit }`; glyph `currentColor`. Do not copy host classes into the shadow tree. `::part(svg)` remains for glyph targeting. |
| `product` / `theme-*` on the element | **Skip** — product-once kit |
| `variant` outline \| solid | **Skip** — outline only, always |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-icon` |
| Base / analog | Presentational inline SVG Custom Element |
| Attributes / reflected properties | `name` (string); `size` `xs` \| `sm` \| `md` \| `lg` \| `xl` (default `md`); `label` (optional accessible name); **`class`** (native host class — `className` / `classList`) |
| Events | None |
| Slots | Default: raw SVG override (wins over `name` lookup) |
| CSS parts | `svg`, `fallback` |
| Form association | None |
| Helpers | `registerIcons(map)`; registry lookup used internally |
| A11y | Decorative `aria-hidden` unless `label` is set; not focusable; missing name → `?` fallback (`part="fallback"`) |
| Forced-colors | `currentColor` / `CanvasText`; shadow-local HC so glyphs remain visible |
| Omissions | No `variant` (always outline); no Tabler; no product attr; no Harmony-specific class prop that mirrors onto the inner SVG |
| Docs / AI | `packages/ui/docs/components/Icon.md`, AGENTS catalog map, `llms.txt`, CEM |

### Usage

```html
<harmony-icon name="home"></harmony-icon>
<harmony-icon name="home" class="demo-icon"></harmony-icon>
<harmony-icon name="check-circle" size="lg"></harmony-icon>
<button type="button" aria-label="Edit">
  <harmony-icon name="pencil"></harmony-icon>
</button>
```

```js
import { registerIcons } from '@dltkrichardhuska/harmony-design-system-vanilla/<product>/elements';
registerIcons({ 'my-glyph': '<svg viewBox="0 0 24 24">…</svg>' });
```

## Blocking dependencies

None. Foundation tokens (`--icon-*`) are `synced`.

## Scope

| In scope | Out of scope |
|----------|--------------|
| `harmony-icon` + generated Hero 24/outline registry + Harmony custom SVGs | Button, shell, Dela, Tabler font / Tabler npm |
| `registerIcons` | `variant=solid`; consuming `icon-manifest.json` SVG blobs |
| Demo `/components/icons` (full Hero outline grid + custom) + chrome SVG → Harmony names | Runtime `heroicons` / `node_modules` in apps |
| AI artifacts + CEM + Heroicons MIT credit | Runtime product switching |

## Phases

### Phase 1 — Apply

- Add `heroicons` as conversion **devDependency**. Script: glob `24/outline/*.svg` → generated registry module (gitignored or clearly marked generated). Pack Harmony custom SVGs from `public/`.
- `HarmonyIcon` on `HarmonyElement`; reflect `name` / `size` / `label`; native host `class`; `:host { display: inline-flex; color: inherit }`.
- Wire into `packages/ui/src/elements/` + product flatten / static kit (generated registry copied into each product out dir — no `node_modules` in the zip).
- Demo page Custom Element; dogfood demo nav/header icons where names exist.
- Docs + CEM.

### Phase 2 — Verification

- Capture `/components/icons` vs reference (sizes, hero samples, custom names, fallback).
- Verifier: `harmony-design-system-vanilla-verifier`.
- Remediate until PASS; AskQuestion before `synced`.

## Risks and dependencies

- Foundation synced: **yes** (`--icon-*` tokens).
- Static kit size grows with the full ~320 Hero outline SVGs (accepted — avoids curating a subset).
- Missing names must match Astro `?` fallback, not a blank.
- `pin` is Tabler in the reference; not in this execute unless copied as a Harmony custom SVG later.

## Approval

**Status: completed** — human visual acceptance 2026-09-09.

| Approved by | Date | Notes |
|-------------|------|-------|
| User | 2026-09-09 | Explicitly requested execution of this plan |
| User | 2026-09-09 | Visual acceptance: Typography and Icon are good |
