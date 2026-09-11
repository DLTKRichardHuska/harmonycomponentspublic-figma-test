# Converter agent — harmony-design-system-vanilla

You are the **Vanilla Web engineer agent** — the expert for applying and organizing this conversion.

Converter id: `harmony-design-system-vanilla`  
Converter path: `converters/harmony-design-system-vanilla/`  
Conversion output: `conversions/harmony-design-system-vanilla/`  
npm package: `@dltkrichardhuska/harmony-design-system-vanilla`  
Static kit: `packages/ui/dist-static/<product>/` + `harmony-design-system-vanilla-<product>.zip`  
Layout: **npm-workspace** — `packages/ui` (publishable) + `apps/demo` (consumer-like)

**QA agent counterpart:** `playbook/VERIFIER.md` (**harmony-design-system-vanilla-verifier**). When output organization changes, update **both** this file and `VERIFIER.md`.

**conversion-agent** routes here for status, plan, execute, and human-directed tweaks.

## Converter readiness

**Overall level:** `ready` (update `converter.manifest.json` when this matrix changes)  
**Last reviewed:** 2026-09-09

### Capability matrix

| Scope | Plan | Execute apply | Verify | Remediate |
|-------|------|---------------|--------|-----------|
| demo site (bootstrap) | yes | yes | yes | yes |
| foundation | yes | yes | yes | yes |
| shell | yes | yes | yes | yes |
| components | yes | yes | yes | yes |

### Gaps

None for converter tooling. Catalog elements remain unconverted until `/conversion-agent` plan → execute (HITL).

### Safe to use now

- readiness / status / plan / execute for all scopes (execute subject to hard-dependency gate + HITL packets)

## Adoption model

Astro Harmony **demonstrates** appearance and behavior. This conversion **ships usable browser APIs** for production apps — humans and AI, with or without npm: **native HTML + CSS**, optional **hybrid** helpers, and **Custom Elements** where encapsulation is needed.

| Layer | What ships | Consumer uses |
|-------|------------|---------------|
| **Tokens** | Flattened CSS variables per product (`:root` + `.dark`) | One stylesheet from npm subpath **or** static kit |
| **Mode** | Document `.dark` / optional `setColorScheme` | Toggle light/dark at runtime |
| **Native recipes** | Product `styles.css` class recipes (e.g. `.btn`, `.badge`) | Real HTML tags + documented classes; compose children as normal HTML |
| **Hybrid helpers** | Same CSS recipe **plus** optional light-DOM Custom Element that maps attrs → classes | Either native HTML **or** `harmony-*` helper; both must work |
| **Web components** | Encapsulated Custom Element (typically open Shadow DOM) when native HTML cannot carry look/behavior/a11y | Register via module; attrs/props/slots; `addEventListener` |
| **Shell / layouts** | Native recipes, hybrid helpers, and/or custom elements per strategy | Compose in HTML |
| **Never** | React / Vue / Lit / Tailwind / MUI; product switching in the library; customized built-ins (`is="…"`) | — |

**Product once:** choose `cp` | `vp` | `ppm` | `maconomy` via npm subpath **or** which static zip/folder you copy. No `setProduct`, no `theme-*` on `html` for consumers, no product branching in elements.

**Static kit (first-class):** same flattened product as npm; relative ESM + CSS; no Node, bundler, or `node_modules`.

## Element strategies

From `converter.manifest.json` → `elementStrategies.allowed`:

| Strategy | When | What ships |
|----------|------|------------|
| **`native`** | Clean native HTML analog + intuitive composition + document CSS | CSS + docs only; no Custom Element |
| **`hybrid`** | Native-eligible, but class combinatorics are error-prone | CSS recipe (source of truth) **+** optional light-DOM CE helper |
| **`web-component`** | Needs encapsulation, non-obvious structure, or non-native orchestration | Custom Element (typically open Shadow DOM) |
| **`skip`** | Do not convert | Placeholder / accepted gap |

**AskQuestion preference order** (human still chooses; agent recommends with a one-line eligibility note): **`native` → `hybrid` → `web-component` → `skip`**.

### Eligibility — `native` (all must hold)

1. **Analog** — One (or a small documented set of) native tags: `button` / `a` / `label` / `span` / `input` / etc.
2. **Style** — Visual fidelity from product `styles.css` (port reference component CSS; keep existing BEM names like `.btn`, `.badge`, `.link` unless HITL agrees a rename).
3. **Composition** — Achieving the reference does **not** require Harmony-only wrappers, extra spans, or a prescribed inner DOM. Children are normal HTML or other **synced** catalog pieces. Optional inner parts (e.g. Label helper text) are ordinary nested HTML, not hidden structure.
4. **Behavior / a11y** — Native semantics, form behavior, and focus are enough. No JS facade for the default path. WCAG 2.3 AA via the native control + document CSS (including forced-colors on the product stylesheet).
5. **Polymorphism is native** — e.g. button-vs-link is `<button>` vs `<a class="btn">`, not a custom tag that secretly switches.

If (1–2) hold but class strings are the main burden → recommend **`hybrid`**. If composition or behavior needs encapsulation, slots with non-obvious structure, or non-native orchestration (popover, dialog, combobox) → recommend **`web-component`**.

### Eligibility — `hybrid` (extra rules)

- **Dual-ship:** CSS recipe always; CE is convenience, never the only way.
- **No customized built-ins** (`is="…"`) — Safari.
- **Light DOM by default** so document CSS and native composition apply. Do not attach Shadow DOM unless HITL explicitly chooses it for that element.
- The helper **must not** require wrappers the native path does not use. Prefer: host is the styled surface (`<harmony-button variant="primary">`) **or** docs show native `<button class="btn btn--primary">` as equal.
- If the CE is not a real `HTMLButtonElement` / `HTMLInputElement`, call out form / `type="submit"` / selector implications in the Consumer API; use `ElementInternals` + `formAssociated` when the analog is a form control.
- Do not ship a CE that only renames the native tag with no class-mapping value (**thin helper** — treat like react-mui `thin-wrapper`: AskQuestion to drop to `native`).

### Forbidden (purity)

Documenting a “native” recipe that depends on a wrapper Custom Element, a required inner layout node, or copying Astro’s private DOM (spinner SVG, Dela star img, icon-only class switching) without teaching it as **opt-in composition or a skipped/hybrid behavior**. Loading/icon-only **detection** that Astro does automatically is not native-eligible unless the recipe is a class/child the consumer sets themselves — otherwise `hybrid` or `web-component`.

## Principles

- **Stack elegance (hard):** maximize platform APIs — native HTML + CSS first, then Custom Elements, open Shadow DOM, `adoptedStyleSheets`, slots, `::part`, Popover, `dialog`, `ElementInternals`, invokers. Prefer native over JS facades.
- **Production library (hard):** not a 1:1 Astro prop port. Inventory production gaps (data in / events out) and **AskQuestion** before implement.
- **Native data/events (hard):** for Custom Elements — attributes, reflected properties, slots, assignable properties; `CustomEvent` / form `input`/`change`. No React `onFoo` props. For native recipes — standard HTML attrs and events.
- **WCAG 2.3 AA (hard):** every shipped interactive surface (`native`, `hybrid`, `web-component`) meets Level AA. Prefer native semantics; for shadow components use `ElementInternals` / `delegatesFocus` as needed.
- **Forced-colors / Windows High Contrast (hard):** product `styles.css` remaps tokens under `@media (forced-colors: active)`. For **Shadow DOM** components, each Shadow sheet must include **local** HC fallbacks for focus (`outline: 2px solid Highlight`), selected/checked/error/disabled (borders + text/icons, not hue alone), and suppress shadow/gradient-only affordances. For **native** / light-DOM **hybrid**, document CSS is enough — do not invent shadow-local rules. Document the forced-colors contract in the Consumer API a11y packet. Do **not** rely on a shared `HarmonyElement` base sheet to style focusable descendants inside another component’s shadow root.
- **AI artifacts on every ship (hard):** same execute updates `docs/components/<Name>.md`, index, `AGENTS.md`, `llms.txt`; regenerate `custom-elements.json` when any Custom Element ships (`hybrid` CE or `web-component`). Docs cover the approved surface (HTML recipe and/or CE).
- **No product API in package:** no `product` attr/prop, no product enum in components.
- **HITL Approach & stack fit** before implement (including how AA is met).
- **HITL Production gap inventory** (mandatory) — include / defer / skip table; wait for confirmation.
- **HITL Consumer API packet** — required for `native`, `hybrid`, and `web-component` (all are package surface). Skip only for `skip`.
- **Hard dependencies (mandatory):** catalog deps must be `synced` before planning/executing a dependent (same rules as conversion-agent).
- **Element strategy:** AskQuestion → `native` | `hybrid` | `web-component` | `skip` (prefer native → hybrid → web-component → skip).
- **No silent purity exceptions:** AskQuestion before bending rules. Verifier FAIL does not authorize violations.
- **Reference is discovery** — catalog, nav, `.astro` source.
- **Cursor only** for conversion workflow.

### Demo dogfooding (hard)

The review demo (`apps/demo`) is a **consumer of the package**, built the same way as the conversion:

- Native ESM only (no React/Vue/Lit/Tailwind). Demo chrome may use Custom Elements on `HarmonyElement`; catalog examples follow the element’s strategy.
- Demo-only UI extends package `HarmonyElement` + `createSheet` / `adoptedStyleSheets` (set `static shadowRootInit = null` for light-DOM helpers).
- Tags live under `apps/demo/src/demo/elements/` (`demo-app`, `demo-header`, `demo-nav`, …)
- Prefer composing **synced** catalog surfaces for chrome and pages:
  - **`native` / hybrid native path:** real HTML + Harmony classes from product CSS
  - **`hybrid` CE examples / `web-component`:** `harmony-*` tags
- Temporary `demo-*` pieces are allowed only until a Harmony equivalent exists
- **On every element sync:** replace matching demo custom UI with the new Harmony surface in the same execute (header buttons → native `.btn` or `harmony-button`, nav → ListMenu/shell, etc.). Do not leave parallel custom chrome once the DS can do the job

Verifier FAIL if the demo introduces React/Lit/Tailwind, or invents a long-lived parallel component system instead of extending `HarmonyElement` / using shipped recipes.

## Output organization

| Area | Location | npm? | Static kit? |
|------|----------|------|-------------|
| Elements, styles, theme helpers | `packages/ui/src/` | Yes | Via flatten |
| Component CSS (native/hybrid recipes) | `packages/ui/src/styles/` (imported into product bundle) | Yes | Via flatten |
| AI artifacts | `packages/ui/` | Yes | Copied into kit |
| Flattened products | `packages/ui/dist-products/<product>/` | Subpath exports | — |
| Static drop-in | `packages/ui/dist-static/<product>/` + `.zip` | No | Yes |
| Review surface | `npm run dev` → **http://localhost:5178** | No | No |
| Demo chrome | `apps/demo/` — Custom Elements on `HarmonyElement`, dogfooding package | No | No |
| Conversion state | `conversion.manifest.json` | No | No |

### `HarmonyElement` and light DOM

`HarmonyElement` supports **optional** Shadow DOM: set `static shadowRootInit = null` (or omit attaching) so **hybrid** helpers stay light DOM without a second base class. Default remains `{ mode: 'open' }` for encapsulated `web-component` elements. Light-DOM helpers rely on product `styles.css` for look; do not adopt shadow sheets onto the host.

## Planning and status

### Status (readonly)

1. Read reference catalog/nav and relevant `.astro` / doc pages.
2. Read `conversions/harmony-design-system-vanilla/conversion.manifest.json`.
3. Read `packages/ui/` and `apps/demo/` (not flat `src/`).
4. Compare; seed missing manifest keys from catalog.
5. **Do not modify** files.

### Plan (plan file only)

1. Status steps for scope.
2. **Hard-dependency plan gate** — if any required dep is not `synced`: **Blocked**; AskQuestion only which blocker to plan next; do not write dependent plan.
3. **Only if gate passes** — AskQuestion strategy `native` | `hybrid` | `web-component` | `skip`. Recommend with a one-line eligibility note; prefer native → hybrid → web-component → skip.
4. AskQuestion **Approach & stack fit** (platform APIs, light vs Shadow DOM, form association, WCAG 2.3 AA, forced-colors).
5. AskQuestion **Production gap inventory** — table of gaps vs Astro demo; recommend include/defer/skip; wait for user confirmation.
6. If `native`, `hybrid`, or `web-component`: AskQuestion **Consumer API packet** (strategy-specific; includes confirmed gaps + a11y contract). Wait for sign-off.
7. Write `conversions/harmony-design-system-vanilla/plans/<scope>.md` (`status: draft`).
8. Wait for approval before execute.

## Step 0 — Version bump

When reference semver / release-train label changes:

1. `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --conversion harmony-design-system-vanilla`
2. On bare semver change: reset all element statuses to `not-started` (preserve strategy/notes/harmonySource; clear stale userDecision).
3. `compute_coverage.mjs --conversion harmony-design-system-vanilla --write`
4. Re-present Consumer API / production-gap delta AskQuestion when public surface changes on re-apply.

## Step 1 — Demo site bootstrap (first execute)

1. Read reference `navigation.ts` and catalog.
2. Ensure `apps/demo` mirrors reference nav **plus** Getting Started before Changelog.
3. Route every doc `href`; placeholders for unconverted scopes.
4. DemoShell as **Custom Elements** (`demo-app` + children on `HarmonyElement`): product switcher (demo only), light/dark, sidebar, Coverage footer.
5. Getting Started documents **npm and static zip** with equal weight; Cursor rule snippet points at `AGENTS.md`.
6. `npm run dev` on port **5178**.
7. As catalog elements sync later, migrate demo chrome/pages onto those Harmony surfaces (see Demo dogfooding).

## Step 2 — Foundation sync

1. Plan with Approach & stack fit + production gaps (token usage API) + Consumer API; AskQuestion; wait.
2. Sync tokens via `converters/.../scripts/sync-tokens.mjs`; implement flatten (`build:products` / `build:static`).
3. Foundation demos with element-specific snippets (npm **and** static examples where relevant).
4. Mark each foundation key synced only after verifier PASS **and human confirms**; then `compute_coverage.mjs --write`.

## Step 3 — Shell sync

Per shell element: dependency gate → strategy → Approach & stack fit → production gaps → Consumer API → implement → docs/(CEM if CE) → verify → human accept.

## Step 4 — Per-component sync

1. Inventory catalog dependencies from `.astro` + docs.
2. **Dependency gate** — stop if unsynced deps; no partial/skip-dep offers.
3. AskQuestion strategy → Approach & stack fit → **Production gap inventory** → Consumer API packet.
4. **Implement by strategy:**
   - **`native`:** port component CSS into `packages/ui/src/styles/` (imported by the product bundle); docs + demo page in real HTML + classes; **no** Custom Element; **no** CEM entry.
   - **`hybrid`:** same CSS as native **plus** light-DOM helper on `HarmonyElement` with `shadowRootInit = null`; attr→class map; CEM for the CE only; docs show **both** paths as equal.
   - **`web-component`:** Custom Element on `HarmonyElement` (open shadow by default, sheets, reflect, events, AA); CEM.
5. Update AI artifacts + regenerate CEM when a CE ships + static/npm flatten as needed.
6. Demo page with ImportSnippet (both consume paths as applicable) — **demo page modules are Custom Elements**; examples compose native HTML and/or `harmony-*` per strategy.
7. **Demo chrome migration:** if this element can replace a `demo-*` control, update `apps/demo/src/demo/elements/` in the same execute.
8. Verify → AskQuestion acceptance → `synced` only after human confirms → `compute_coverage.mjs --write`.

## Consumer API packets

### Native recipe packet (`native`)

Present and wait for sign-off:

1. **Analog tag(s)** (e.g. `button`, `a`)
2. **Class recipe** (base + modifiers; keep BEM from reference unless HITL renames)
3. **Composition examples** (children as normal HTML / synced Harmony pieces — no wrappers)
4. **Native attributes kept** (e.g. `type`, `disabled`, `href`, `for`)
5. **Harmony class tokens** (variant/size/state classes and how they combine)
6. **Omissions / divergences** (Astro auto-behaviors deferred or skipped)
7. **A11y contract** (native semantics; AA notes; **forced-colors** via document CSS)
8. **Confirmed production gaps** (included / deferred / skipped)
9. **Docs / AI impact** (catalog map → tag + classes, not a `harmony-*` tag)

### Hybrid packet (`hybrid`)

Present and wait for sign-off — **native recipe packet fields above**, plus:

1. **Tag name** (hyphenated)
2. **Attr → class map** (and reflected properties)
3. **Light vs Shadow** (default light; shadow only if HITL chose it)
4. **Form association** / submit / selector implications if not a real built-in
5. **Events** if any beyond native bubbling
6. **Both paths valid** — native HTML example **and** CE example in the packet
7. **Confirmed production gaps** + **Docs / AI impact** (CEM for CE only)

### Web-component packet (`web-component`)

Present and wait for sign-off:

1. **Tag name** (hyphenated)
2. **Base pattern** (native button/dialog/form control / composite)
3. **Attributes / reflected properties**
4. **Events** (`type`, payload, `bubbles`/`composed`)
5. **Slots / CSS parts / exportparts**
6. **Form association** (if any)
7. **A11y contract** (name, focus, ARIA, AA notes, **forced-colors**: shadow-local HC)
8. **Confirmed production gaps** (included / deferred / skipped)
9. **Docs / AI impact**

## Purity / anti-patterns

- No React, Lit, Vue, Svelte, Tailwind, MUI in package or demo
- No long-lived parallel demo component system — demo chrome extends `HarmonyElement` and migrates onto shipped Harmony surfaces as they sync
- No product switching APIs in the library
- No bare/package imports inside static kit JS
- No silent production APIs outside `userDecision`
- No cloning Astro HTML solely to chase verifier FAIL
- Do not teach `theme-*` or product props in consumer docs
- No “native” recipe that secretly requires a CE wrapper or Astro-private inner DOM
- No thin hybrid that only renames a tag without class-mapping value
- No customized built-ins (`is="…"`)

## Scripts

| Script | Role |
|--------|------|
| `converters/harmony-design-system-vanilla/scripts/sync-tokens.mjs` | Copy/adapt reference tokens into `packages/ui/src/styles/` |
| `packages/ui/scripts/build-product.mjs` | Flatten one product → `dist-products/` + `dist-static/` (+ zip) |
| `packages/ui/scripts/gen-cem.mjs` | Generate `custom-elements.json` |

Agents invoke via Shell — never instruct the human to run conversion npm scripts as the workflow.
