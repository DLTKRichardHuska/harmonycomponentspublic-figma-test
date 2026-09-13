# AGENTS.md — @dltkrichardhuska/harmony-design-system-vanilla

Harmony Design System for **frameworkless** apps: **native HTML + CSS recipes**, optional **hybrid** Custom Element helpers, encapsulated **Custom Elements** (open Shadow DOM when needed), native ESM.

## Choose a product first (upfront, one time)

Ship as **one package** with **four product subpaths** (`/cp`, `/vp`, `/ppm`, `/maconomy`) **or** download the matching **static zip**. Product is fixed by which subpath/zip you use — **no runtime product switching**. Only light/dark mode is runtime (`html.dark` / Theme JS).

### Path A — npm

```bash
npm install @dltkrichardhuska/harmony-design-system-vanilla
```

```html
<link rel="stylesheet" href="node_modules/@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css" />
<script type="module">
  import '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';
  import { initColorScheme } from '@dltkrichardhuska/harmony-design-system-vanilla/theme';
  initColorScheme();
</script>
```

(Or import CSS from your bundler: `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css'`.)

### Path B — static zip / folder (no npm)

1. Unzip `harmony-design-system-vanilla-<product>.zip` (or copy `dist-static/<product>/`) to e.g. `/vendor/harmony/`.
2. Keep the folder intact (includes `assets/logo.svg` for the Shell Header brand mark).
3. Use relative links only:

```html
<link rel="stylesheet" href="/vendor/harmony/styles.css" />
<script type="module" src="/vendor/harmony/elements.js"></script>
```

No Node, bundler, or `node_modules` required. Moving the folder as a unit must keep working.

## Fonts

Host apps must load **Figtree**, **Lexend**, and **JetBrains Mono** (token families `--font-sans`, `--font-display`, `--font-mono`).

## Mode (runtime)

Token CSS is class-based (`html.dark`). Theme helpers:

```js
import {
  initColorScheme,
  persistColorScheme,
  setColorScheme,
  toggleColorScheme,
} from '@dltkrichardhuska/harmony-design-system-vanilla/theme';

initColorScheme(); // prefers-color-scheme when nothing saved
persistColorScheme(toggleColorScheme()); // explicit override wins over OS
```

You may also toggle `document.documentElement.classList` directly.

Storage key for overrides: `harmony-color-scheme` (`COLOR_SCHEME_STORAGE_KEY`).

## Date / time defaults (runtime)

Set locale and 12/24 once for all date controls (omit per-control attrs to inherit):

```js
import {
  setDateTimeDefaults,
  initDateTimeDefaults,
  getDateValue,
  setDateValue,
} from '@dltkrichardhuska/harmony-design-system-vanilla/datetime';
// or from the package root: '@dltkrichardhuska/harmony-design-system-vanilla'

setDateTimeDefaults({ locale: 'en-GB', timeFormat: '24' });
// or <html data-harmony-locale="en-GB" data-harmony-time-format="24"> then:
initDateTimeDefaults();

const field = document.querySelector('harmony-date-input');
field.valueAsDate = new Date(); // or setDateValue(field, new Date())
```

See `docs/components/DateTime.md`. Machine `value` stays ISO; Luxon/Day.js adapters are not shipped yet.

## Forced colors (Windows High Contrast)

Product `styles.css` remaps tokens under `@media (forced-colors: active)`. Automatic — no Theme JS. Host apps must not hard-code colors that break system colors. **Native / light-DOM** surfaces rely on document CSS. **Shadow DOM** Custom Elements need **shadow-local** HC rules for focus and state (document CSS does not pierce Shadow DOM).

## Foundation tokens

See `docs/foundation/` — Colors, Typography, Spacing, Elevations are CSS variables on the product stylesheet. No foundation Custom Elements; no JS token modules.

Product `styles.css` includes the Harmony CSS reset (port of reference `src/styles/reset.css`, without bundled fonts) so this kit can be the project’s sole CSS. `typographySheet` includes the same reset for Shadow DOM.

Two reset rules differ from the reference on purpose. The margin/padding reset lists the elements it targets instead of using `*`, because a universal rule in the document tree overrides a shadow root's own `:host` padding and margin — so keep setting host box spacing in the element's own sheet, and never reintroduce a `*` margin/padding rule. Lists keep their markers (`ul` disc, `ol` decimal, indented by `--space-6`), so an element that uses a list for structure — nav, tab strip, menu — must set `list-style: none` in its shadow styles.

Component and reset styles use Harmony variables for color, spacing, borders, radii, shadows, and transitions. Use semantic color tokens such as `--card-bg`, `--text-primary`, and `--border-color`; use `--space-*`, `--radius-*`, and `--border-width-*` rather than literal values. Structural zeroes, percentages, responsive constraints, SVG geometry, and forced-colors system keywords are intentional exceptions.

### Typography (tags, classes, variables)

The product stylesheet also styles plain HTML: `<h1>`–`<h6>` are Heading XL→S, `<p>` is Body Default, `<label>` is Label, `<small>` is Caption, and `<code>`/`<pre>`/`<kbd>`/`<samp>` are mono. Display type styles are class-only.

```html
<h1>Page title</h1>
<div class="text-overline">Featured</div>
```

Classes: `.text-display-xl|l|m`, `.text-heading-xl|l|m|s`, `.text-body-default|emphasized`, `.text-label`, `.text-caption`, `.text-overline`, plus `.font-sans|display|mono`, `.text-xs…5xl`, `.font-light…bold`, `.leading-none|tight|normal|relaxed` — same names as the reference design system.

Inside Shadow DOM, adopt `typographySheet` (document CSS does not pierce shadow roots):

```js
static styles = [typographySheet, ownSheet];
```

## Catalog → surface map

As elements convert, the map lists the **shipped surface**: native tag + classes, optional hybrid helper, or a `harmony-*` Custom Element. Prefer this map over inventing Astro component names as tags.

| Catalog | Surface | Notes |
|---------|---------|-------|
| Colors / Typography / Spacing / Elevations | *(CSS only)* | Product `styles.css` |
| Icon | `harmony-icon` | Web component — Heroicons outline + Harmony custom SVGs; app glyphs via `registerIcons()` — `docs/components/Icon.md` |
| Button | native `button` / `input[type=button\|submit\|reset]` + `.btn` + optional `harmony-button` | Hybrid — defaults on built-ins; `.btn` for `<a>`; helper maps attrs — `docs/components/Button.md` |
| Card | native `.card` BEM + optional `harmony-card` | Hybrid — compose header/body/footer; header actions = ghost icon-only; `interactive` CE sets button a11y — `docs/components/Card.md` |
| ProgressBar | `harmony-progress` | Web component — `docs/components/ProgressBar.md` |
| Spinner | `harmony-spinner` | Web component — `docs/components/Spinner.md` |
| Accordion | `harmony-accordion` + `harmony-accordion-item` | Web component — `docs/components/Accordion.md` |
| Link | unclassed `<a>` + `.link--muted` | Native — sizes via typography; compose external icon — `docs/components/Link.md` |
| Badge | `harmony-badge` | Web component — `docs/components/Badge.md` |
| Avatar | `harmony-avatar` | Web component — interactive fires `click` — `docs/components/Avatar.md` |
| ShellHeader | `harmony-shell-header` | Web component — product logo from kit `assets/logo.svg`; `actions` slot — `docs/components/ShellHeader.md` |
| LeftSidebar | `harmony-left-sidebar` | Web component — product-kit default sections; `left-sidebar-item-select` — `docs/components/LeftSidebar.md` |
| RightSidebar | `harmony-right-sidebar` | Web component — Dela-first product defaults; `right-sidebar-item-select` — `docs/components/RightSidebar.md` |
| CompanyPicker | `harmony-company-picker` | Web component — `company-change` event — `docs/components/CompanyPicker.md` |
| UserMenu | `harmony-user-menu` | Web component — avatar + menu; `name` / optional `src` — `docs/components/UserMenu.md` |
| Chip | `harmony-chip` | Web component — body `click` + `remove` event — `docs/components/Chip.md` |
| Alert | `harmony-alert` | Web component — `dismiss` event; `actions` slot for buttons/links; `progress-value` — `docs/components/Alert.md` |
| Tooltip | `harmony-tooltip` | Web component — hover + focus; `text` / `content` slot; Escape dismiss — `docs/components/Tooltip.md` |
| Dialog | `harmony-dialog` | Web component — native `<dialog>`; `show()`/`close()`; `close-on-backdrop`; dirty + confirm-unsaved — `docs/components/Dialog.md` |
| Label | native `<label class="label">` | Native — `.label--required`, `.label__helper` — `docs/components/Label.md` |
| Input | native text-like `input` + `harmony-input` | Dual path — CE for icons/error/label; `harmony-form-layout` + `harmony-form-row` for aligned / multi-field forms — `docs/components/Input.md` |
| Select (catalog Dropdown) | native `select` + `harmony-select` | Dual path — light-DOM `option`/`optgroup`; OS picker; same form-layout as input — `docs/components/Select.md` |
| Textarea | native `textarea` + `harmony-textarea` | Dual path — `docs/components/Textarea.md` |
| PickerPopup | `harmony-picker-popup` | Web component — Popover API; not a form field — `docs/components/PickerPopup.md` |
| DatePicker | `harmony-date-picker` | Web component — calendar widget; `date-select` — `docs/components/DatePicker.md` |
| TimePicker | `harmony-time-picker` | Web component — `HH:MM`; `time-select` — `docs/components/TimePicker.md` |
| DateTimePicker | `harmony-datetime-picker` | Web component — composes date + time; `datetime-select` — `docs/components/DateTimePicker.md` |
| MonthPicker | `harmony-month-picker` | Web component — `YYYY-MM`; `month-select` — `docs/components/MonthPicker.md` |
| WeekPicker | `harmony-week-picker` | Web component — `YYYY-Www`; `week-select` — `docs/components/WeekPicker.md` |
| DateInput | `harmony-date-input` | Web component — form-associated field; composes picker popup + widgets; `input` / `change` machine value — `docs/components/DateInput.md` |
| ButtonGroup | native `.btn-group` + optional `harmony-button-group` | Hybrid — compose button children; helper maps variant/size/orientation — `docs/components/ButtonGroup.md` |
| ListMenu | native `.list-menu` + optional `harmony-list-menu` | Hybrid — compose `a`/`button` items (no items JSON); helper adds item classes — `docs/components/ListMenu.md` |
| NotificationBadge | `harmony-notification-badge` | Web component — wrap-target API; badge absolute (default top-end) — `docs/components/NotificationBadge.md` |
| Checkbox | native `input[type=checkbox]` + `harmony-checkbox` | Dual path — CE for label/error/indeterminate; form-layout — `docs/components/Checkbox.md` |
| RadioButton | native `input[type=radio]` + `harmony-radio` | Dual path — group via `name`; form-layout — `docs/components/Radio.md` |
| Toggle | `harmony-toggle` | Web component only — form-layout; no native switch recipe — `docs/components/Toggle.md` |
| TabStrip | `harmony-tab-strip` | Web component — `tabs[]` property; panels consumer-owned — `docs/components/TabStrip.md` |
| Table | unclassed `table` + modifiers + optional `harmony-table` | Hybrid — bars/slots; sort/reorder/grouped/CC; totals via native `tfoot` — `docs/components/Table.md` |

Adopt `buttonSheet` in Shadow DOM hosts so button defaults / `.btn` apply inside the shadow tree. Adopt `cardSheet` for `.card` inside Shadow hosts. Adopt `linkSheet` for `.link--muted` / icon inherit inside Shadow DOM (reset `a` comes from `typographySheet`). Adopt `labelSheet` / `inputSheet` for `.label` and native field / form-layout recipes inside Shadow hosts. Adopt `buttonGroupSheet` / `listMenuSheet` / `tableSheet` for hybrid recipes inside Shadow hosts. Adopt `checkboxSheet` / `radioSheet` / `toggleSheet` / `tabStripSheet` / `notificationBadgeSheet` when embedding those surfaces in other Shadow hosts.

## Do

- Prefer **native HTML + documented classes** when the catalog map says so; use Custom Element APIs (attrs, properties, slots, `addEventListener`) for `harmony-*` tags
- Meet WCAG 2.3 AA for interactive controls
- Include Shadow-local `@media (forced-colors: active)` fallbacks for Shadow DOM components; rely on product CSS for native / light-DOM surfaces
- Read `docs/components/`, `docs/foundation/`, and `custom-elements.json` (CEM covers Custom Elements only)
- Use `harmony-icon`; call `registerIcons({ name: '<svg…>' })` for trusted app-owned SVG glyphs (after `/elements` import). Lookup: slot → `registerIcons` → Harmony custom → Hero outline → `?`. See `docs/components/Icon.md`.
- Use unclassed `<button>` / button-type `<input>` for Harmony buttons; `.btn` on `<a>`; optional `<harmony-button>` for attr→class mapping. See `docs/components/Button.md`.
- Use `.card` BEM regions for cards; optional `<harmony-card>`; header actions compose ghost icon-only buttons. See `docs/components/Card.md`.
- Use unclassed `<a>` for text links; `.link--muted` when muted; compose external icons. See `docs/components/Link.md`.
- Use `<harmony-progress>`, `<harmony-spinner>`, `<harmony-accordion>` / `<harmony-accordion-item>`, `<harmony-badge>`, `<harmony-avatar>`, `<harmony-shell-header>`, `<harmony-left-sidebar>`, `<harmony-right-sidebar>`, `<harmony-company-picker>`, `<harmony-user-menu>`, `<harmony-chip>`, `<harmony-alert>`, `<harmony-tooltip>`, `<harmony-dialog>` for those catalog surfaces.
- Use `<harmony-picker-popup>`, `<harmony-date-picker>`, `<harmony-time-picker>`, `<harmony-datetime-picker>`, `<harmony-month-picker>`, `<harmony-week-picker>` for picker widgets. They are not form fields and do not belong in `harmony-form-layout`. Use `<harmony-date-input>` for the form field (it does).
- Use `<label class="label">` for labels; text-like `<input>` / `<textarea>` / `<select>` for native fields; `<harmony-input>` / `<harmony-textarea>` / `<harmony-select>` when you need CE features; `<harmony-form-layout>` (+ optional `<harmony-form-row>`) for aligned labeled forms. Catalog Dropdown is Select — there is no `harmony-dropdown`.
- Use `.btn-group` (+ modifiers) or optional `<harmony-button-group>` for button clusters; compose button children. See `docs/components/ButtonGroup.md`.
- Use `.list-menu` with composed `a`/`button` items (`.list-menu__item`) or optional `<harmony-list-menu>` — no items JSON. See `docs/components/ListMenu.md`.
- Use `<harmony-notification-badge>` to wrap a target (or standalone); separate from `<harmony-badge>`. See `docs/components/NotificationBadge.md`.
- Use native checkbox/radio or `<harmony-checkbox>` / `<harmony-radio>` (catalog RadioButton); group radios with `name`. Use `<harmony-toggle>` for switches (CE-only). All three participate in `harmony-form-layout`. **CheckboxGroup** and **RadioGroup** are not converted yet.
- Use `<harmony-tab-strip>` with the `tabs` property; keep panels outside the CE and sync via `selected` / `tab-select`. See `docs/components/TabStrip.md`.
- Use unclassed `<table>` (optional modifiers) or `<harmony-table>` for data tables; TableCostpointGrid is not converted. See `docs/components/Table.md`.
- Use product subpath **or** matching static kit — not the bare multi-product source in apps
- Compose children as normal HTML (or other synced Harmony pieces) — do not invent required wrappers

## Don’t

- Switch product at runtime in consumer apps (demo chrome only may swap the flattened stylesheet)
- Import React, Lit, Vue, Tailwind, or MUI for Harmony UI
- Require npm when the static kit is enough
- Invent Astro demo-only props without an approved Consumer API
- Drive tokens from CSS `@media (prefers-color-scheme)` — use `.dark` + Theme JS
- Rely on document CSS to style inside Shadow DOM under forced-colors
- Use blanket `forced-color-adjust: none` (reserve for rare documented cases)
- Register untrusted SVG with `registerIcons`, or expect Node/`heroicons` at consumer runtime
- Use customized built-ins (`is="…"`)

## Cursor rule snippet

Point agent rules at this file (product subpath or static kit copy of `AGENTS.md`) — do not duplicate a second source of truth.

## Demo

`conversions/harmony-design-system-vanilla` → `npm run dev` (port **5178**). Start at **/getting-started**. Foundation pages: `/foundation/colors|typography|spacing|elevations`.
