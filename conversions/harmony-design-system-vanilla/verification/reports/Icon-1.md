# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Icon` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-09T21:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 7 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/icons` (HTTP 200, VP light/dark) |
| converted | Live `http://localhost:5178/components/icons` (HTTP 200, pierce `demo-app` / `demo-icons-page` shadow) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/icon-1/` (`ref-vp-light-top.png`, `ref-vp-light-custom.png`, `ref-vp-light-a11y.png`, `ref-vp-dark-top.png`, `conv-vp-light-top.png`, `conv-vp-light-usage.png`, `conv-vp-light-custom.png`, `conv-vp-dark-top.png`, `conv-forced-colors.png`, `compare-notes.json`) |

Rendered evidence: Playwright browse of both routes. Source-only review was not used for the verdict.

## Approved non-defects

- Custom Elements / open Shadow DOM / `harmony-icon` vs Astro `<Icon>` / `<svg>`
- No `variant` (outline only) and no Tabler webfont — plan + manifest `gaps` (accepted)
- No `product` / `data-product` on the element; demo product via stylesheet swap only (`data-product` null)
- Full Heroicons 24/outline (324) vs reference curated categorized 284 — plan: kit-build glob, not `icon-manifest.json`
- Packing all Harmony `public/*.svg` (65 names) vs reference curated Custom (40) — plan: pack public SVGs
- Native host `class`; `registerIcons()`; raw SVG slot; `?` fallback `part="fallback"`
- Relative ESM in static kit vs package-name imports in npm docs
- Forced-colors look differing from Astro (no HC baseline on reference)

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Icons + Hero Outline intro | present | Converted copy describes full 24/outline + custom + `registerIcons` |
| Section: Icon Props | missing | No attrs table on demo; API lives in `docs/components/Icon.md` only — **DEF-002** |
| Usage + Icon Sizes (home xs–xl) | different | Five home glyphs present; captions omit `(12px)`…`(32px)` — **DEF-003** |
| Icon Selection Guide (Hero → Tabler → Custom) | deferred | Tabler skipped per accepted gap; remaining hierarchy not restated as a numbered guide |
| Example: Heroicons primary (home/user/cog) | present | Covered by size row + 324 grid |
| Example: Tabler secondary | deferred | Accepted skip |
| Example: Custom tertiary (gantt / Risk Shield / dock-center) | present | Those names render SVG in the custom grid |
| Hero Icons Outline 24×24 categorized (284) | deferred | Flat 324-name grid per approved plan |
| Custom Icons curated categories (40) | deferred | Flat 65-name public SVG grid per approved plan |
| Accessibility section (aria-hidden + labeled button examples) | missing | **DEF-001** |
| npm + static consume snippets | different | Both snippets present; static `script` close tag shows a backslash — **DEF-004** |
| Missing-name `?` fallback | present | Demo-only example; matches Astro fallback tokens/shape |
| `registerIcons` + slotted SVG | present | Converted production-gap demos (not on reference page) |

**Content gaps (open):** 4

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Page heading | “Icons” plus Hero Outline intro on docs canvas | “Icons” plus outline/custom/register intro on demo canvas | present |
| Size scale home glyphs | xs–xl house outlines at 12 / 16 / 20 / 24 / 32 px | Same five sizes (measured 12 / 16 / 20 / 24 / 32) | present |
| Size captions | “xs (12px)” … “xl (32px)” under glyphs | “xs” … “xl” only | different |
| Size/usage card | White bordered card, row of homes | White bordered card, row of homes | present |
| currentColor | Icons inherit surrounding text/theme color | `class` on host paints check-circle `rgb(42, 120, 198)` (VP primary) | present |
| Missing fallback | Pink `#ffecef` tile, red `#c1253a` “?” (token) | Same token tile with “?” (`part=fallback`) | present |
| Hero outline glyphs | 24px outline strokes, muted labels, 10-col-ish catalog | Same outline language; 324 cells; narrower 6-col wrap in 56rem column | present |
| Custom gantt / Risk Shield / pin | Domain SVGs in categorized cards | Same names render SVG (0 unknown in custom grid) | present |
| Custom extras (favicon, product logos) | Not on Icons catalog | Extra public SVGs in the 65 grid | deferred |
| Dark mode | Homes remain outline on dark page | `.dark` on `html`; outline homes remain visible | present |
| Forced-colors | n/a (no reference HC) | Glyphs `CanvasText`; fallback bordered `?`; mode button 2px Highlight outline | present |
| Demo chrome icons | n/a (Astro chrome) | Header `bars-3`/`sun`/`moon` and nav names resolve to SVG | present |

**Visual gaps (open):** 1

## Consumer API / AI / static kit

| Check | Result |
|-------|--------|
| Public surface vs approved Consumer API | `name`, `size` xs–xl default md, `label`, native `class`, default slot, parts `svg`/`fallback`, `registerIcons`, no events, no form association — matches plan |
| Unapproved extras | None observed |
| `docs/components/Icon.md` | Covers attrs, slot, parts, a11y, HC, MIT credit, omissions |
| `AGENTS.md` / `llms.txt` / CEM | Icon tag map, `HarmonyIcon` + `registerIcons`, CEM members/slots/parts |
| npm flatten `dist-products/<product>/` | Relative `./HarmonyElement.js` / `./generated/heroIcons.js`; generated registries copied |
| Static kit | Relative imports only in `dist-static/vp/elements.js` + `register.js`; generated registries copied; no React/Lit/Tailwind/MUI |
| Demo snippets vs exports | npm path matches `/vp/elements`; static `styles.css` + `elements.js` match kit; **DEF-004** breaks the static sample as displayed |

## WCAG 2.3 AA / forced-colors

- Decorative icons: `aria-hidden="true"`, not focusable
- `label="Registered diamond"`: `role="img"` + `aria-label`, `aria-hidden` removed
- Keyboard: Icon itself is not a control; header Mode button keeps a 2px Highlight outline under `forced-colors: active`
- Contrast: outline glyphs follow `currentColor` / `CanvasText` in HC; fallback uses token colors in normal mode and Canvas/CanvasText + border in HC
- Shadow-local `@media (forced-colors: active)` on `HarmonyIcon` and demo chrome

No open a11y defects.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. conversion-agent must AskQuestion before `elements.Icon.status = synced`. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Accessibility section with Icon Accessibility card: default `aria-hidden`, put `aria-label` on the parent button, plus Edit/Delete markup examples
- **converted:** No Accessibility heading or equivalent callout on `/components/icons`
- **description:** Designer would see an Accessibility section on the reference Icons page and nothing corresponding on the converted demo page.
- **evidence:** Live `:4321/components/icons` h2 Accessibility (`ref-vp-light-a11y.png`); converted h2 list is only Sizes, Usage and behavior, Heroicons 24/outline (324), Harmony custom icons (65)
- **remediationHint:** Add a short Accessibility card on `demo-icons-page` using `<harmony-icon>` inside labeled buttons, aligned with `docs/components/Icon.md` (do not require Tabler copy)

### DEF-002

- **status:** open
- **category:** structure
- **reference:** Icon Props table listing `name`, `size`, and `variant`
- **converted:** No props/API table on the demo page (`variant` omission is approved; `name` / `size` / `label` / `class` are not shown as a table)
- **description:** Designer would see a props table under the title on reference and jump straight to sizes on conversion, with no on-page API summary.
- **evidence:** `ref-vp-light-top.png` vs `conv-vp-light-top.png`
- **remediationHint:** Add a Vanilla API table (no `variant`) for `name`, `size`, `label`, host `class`, slot, parts

### DEF-003

- **status:** open
- **category:** visual
- **reference:** Size row captions read xs (12px), sm (16px), md (20px), lg (24px), xl (32px)
- **converted:** Same five house glyphs at the correct pixel sizes, captions are only xs–xl
- **description:** Designer would notice missing pixel labels under the size examples even though the glyphs scale correctly.
- **evidence:** Measured converted sizes 12/16/20/24/32 in `compare-notes.json`; captions in `conv-vp-light-top.png` vs `ref-vp-light-top.png`
- **remediationHint:** Restore the `(Npx)` captions beside each size

### DEF-004

- **status:** open
- **category:** structure
- **reference:** n/a (Astro page has no static-kit snippet)
- **converted:** Consume — static zip snippet text is `<script type="module" src="/vendor/harmony/elements.js"><\/script>`
- **description:** Designer/consumer would copy a broken `<\/script>` closer instead of `</script>`.
- **evidence:** Playwright `demo-import-snippet` textContent in `icon-1/compare-notes.json`; `DemoIconsPage.js` assigns `<\\/script>`
- **remediationHint:** Set the snippet to a normal `</script>` string (module JS, not an HTML file)

### DEF-005

- **status:** deferred
- **category:** structure
- **reference:** Tabler Icons (Secondary Fallback) section and Tabler step in the selection guide
- **converted:** No Tabler webfont or Tabler examples
- **description:** Intentional accepted gap (plan/manifest). Not counted in open.
- **evidence:** Plan production gaps; manifest `No Tabler webfont or Tabler runtime (accepted)`

### DEF-006

- **status:** deferred
- **category:** structure
- **reference:** Hero icons grouped in named categories totaling 284
- **converted:** One alphabetical grid of 324 Heroicons 24/outline
- **description:** Approved kit-build of full npm `heroicons` 24/outline, not the Astro category list.
- **evidence:** Plan Consumer API / Approach; live counts 284 vs 324

### DEF-007

- **status:** deferred
- **category:** visual
- **reference:** 40 curated custom names in domain category cards
- **converted:** 65 names from all `public/*.svg` (includes favicon, product logos, etc.)
- **description:** Approved pack of Harmony public SVGs. Human may later ask to curate the demo grid to the reference 40.
- **evidence:** `conv-vp-light-custom.png` vs `ref-vp-light-custom.png`; generate-icons log 65 custom

## Blocked items

None. Both review servers responded HTTP 200; converted page rendered `harmony-icon` grids (no Vite overlay).

## Verifier notes

Content inventory and three-column visual matrix completed from live `:4321` vs `:5178` (Playwright, including dark and `forced-colors: active`). Visual rows are from rendered appearance, not CSS-property equality. Glyph size, outline language, currentColor, fallback `?`, registries, CEM/docs, relative static imports, and HC outcomes are in good shape. Open defects are demo documentation/content plus the static snippet typo. **PASS: zero conversion defects** is not recommended.

**FAIL:** four open conversion defects (DEF-001–DEF-004).
