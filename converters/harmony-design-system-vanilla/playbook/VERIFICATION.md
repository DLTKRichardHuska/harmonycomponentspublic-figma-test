# Verification — harmony-design-system-vanilla

Capture is scripted when needed; compare is verifier-agent judgment; **acceptance is converter playbook + human**.

See [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [VISUAL_MATCH_GATE.md](../../../.cursor/skills/conversion-verify/reference/VISUAL_MATCH_GATE.md).

## UX designer review lens (hard)

| Judge | Do not judge as defects |
|-------|-------------------------|
| Perceived look (color, type, space, elevation, rhythm) | Identical HTML / DOM trees |
| Behavior and interaction affordances | Same element types as Astro |
| Doc page content (sections, examples, labels) | Same class names |
| Accessibility outcomes (WCAG 2.3 AA) | Matching Astro markup structure |
| Confirmed production APIs working | Extra attrs/events that Astro demo lacked (if user-confirmed) |

Native HTML + CSS recipes, light-DOM hybrid helpers, Shadow DOM, and Custom Elements are **often desired**. FAIL only when a designer would notice look/behavior/content differences, AA fails, or approved Consumer API / production gaps are missing or silently exceeded.

## Surfaces

| Surface | URL |
|---------|-----|
| Reference Astro | `http://localhost:4321` |
| Converted demo | `http://localhost:5178` (`apps/demo`, `npm run dev` from conversion root) |

## Bootstrap checks (demo harness)

FAIL bootstrap scope if any missing:

- Getting Started at `/getting-started` is **first** nav item before Changelog
- Home Quick Start leads with Installation → `/getting-started`
- Getting Started / CONSUMER / `AGENTS.md` document **npm and static zip** with equal weight
- Demo chrome uses **Custom Elements** on package `HarmonyElement` where needed; catalog examples may be **native HTML + Harmony classes** and/or `harmony-*` tags per element strategy (no React/Lit/Tailwind in `apps/demo`)
- Demo may switch products (demo chrome only); mode toggles `.dark`
- Sidebar shows **Coverage** for current `referenceVersion`
- Placeholders for unconverted scopes; routes mirror reference (+ Getting Started)

## Converted page docs checks

- Element-specific import/register or stylesheet snippets (npm **and/or** static `<link>` + `<script type="module">` as appropriate)
- Does not repeat full Getting Started global setup
- Snippets match actual package / static kit exports
- Strategy-aware examples: `native` → HTML + classes; `hybrid` → both native and CE; `web-component` → CE

## Consumer API / AI artifact / production-gap checks

For each synced or in-progress element with strategy **`native`**, **`hybrid`**, or **`web-component`**:

- Public surface matches approved Consumer API + confirmed production gaps
- `docs/components/<Name>.md` covers the approved recipe (classes and/or attrs/events/slots/parts) + a11y contract
- `AGENTS.md` / `llms.txt` consistent; **`custom-elements.json`** only required when a Custom Element ships (`hybrid` CE or `web-component`)
- Confirmed gaps implemented; **unapproved** extras → FAIL
- Missing confirmed `value`/`change` (or equivalent) → FAIL even if visuals match Astro

### Strategy-specific FAIL conditions

| Strategy | Also FAIL if |
|----------|----------------|
| **`native`** | Demo or docs require wrappers / prescribed inner DOM not in the approved native recipe; a Custom Element is the only documented path |
| **`hybrid`** | Native CSS path is omitted or incomplete; CE requires wrappers the native path does not; thin rename-only helper without class mapping |
| **`web-component`** | Shadow/API contract missing; unapproved surface; CEM/docs disagree |

## WCAG 2.3 AA checks

- Keyboard operable; visible `:focus-visible`; accessible name/role/state
- Contrast AA in light and `.dark`
- State not color-only; honor `prefers-reduced-motion`
- Form-associated Custom Elements use `ElementInternals` appropriately; native form controls use native semantics

### Forced-colors / Windows High Contrast (manual gate)

For interactive scope (and demo chrome when in scope), enable a Windows Contrast Theme **or** DevTools → Rendering → `forced-colors: active`, then FAIL if:

- Text or controls become invisible (same system color for fill and text)
- Focus rings disappear (must use outline / Highlight under HC)
- Selected / checked / error / disabled differ only by hue (need border, outline, text, or icon)
- Gradients or box-shadows were the only boundary — no border fallback
- For **Shadow DOM** elements: document-level CSS was expected to fix Shadow DOM internals (each sheet needs local `@media (forced-colors: active)`)
- For **`native` / light-DOM `hybrid`**: product document CSS does not keep focus/state usable under HC (no shadow-local requirement unless that element uses shadow)

HC is an **a11y outcome** gate, not visual parity with the Astro reference (reference has no forced-colors baseline).

## Stack / static kit checks

- No React/Lit/Tailwind/MUI in package for converted elements
- No product APIs in library; consumer docs do not teach product switching
- Static kit uses relative imports only (no bare/package specifiers)

## Loop

1. Capture or browse pair (reference vs demo) for scope
2. Verifier recommends PASS/FAIL with designer side-by-side summary
3. AskQuestion: visual/behavior/AA/API match acceptable?
4. Remediations subject to purity — no silent exceptions
5. Human confirms before `elements.<scope>.status = synced`
6. `compute_coverage.mjs --conversion harmony-design-system-vanilla --write`

## Defect reports

Write under `conversions/harmony-design-system-vanilla/verification/reports/`.
