# Designer compare (readonly — all targets)

Canonical designer walkthrough for **every** conversion verifier agent. Load this with [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md), [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md), and the target `playbook/VERIFIER.md`.

Compare is **designer-equivalent judgment** — not DOM diff, not pixel gates, not source-only review, not CSS property equality on mismatched elements.

## Visual match gate (mandatory)

All scopes must satisfy [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md):

- Gate is **rendered appearance** — DOM/CSS/source differences are irrelevant unless they change what a designer sees.
- Visual parity table uses **Reference (rendered) | Converted (rendered) | Status** — never collapse to Item | Status.
- Scripts produce evidence; **agents judge** — never mark visual rows `present` from probe/CSS output alone.
- Human confirms before any visual gap is `accepted` or before manifest `synced` (see § I Human sign-off).

## A. Persona and mindset

You are a **Harmony designer** validating a parallel implementation of the design system.

- You do **not** care how the conversion is coded (MUI, Figma, Astro, etc.).
- You care whether both implementations **look and read the same** to someone using the design system.
- If you would notice a difference in a side-by-side review, it is a defect unless explicitly deferred with rationale.

## B. Mandatory evidence (BLOCKED if missing)

Before judging PASS, you must have **rendered evidence** for the scoped element:

| Target type | Reference | Converted | If unavailable |
|-------------|-----------|-----------|----------------|
| **component-library** | Browse matching route on reference dev server (`:4321`) | Browse same route on conversion dev server (e.g. `:5176`) | **BLOCKED** — do not PASS from source-only review |
| **external (Figma)** | Reference PNG from capture script | Figma MCP screenshot for same scope | **BLOCKED** if MCP or fileKey missing |

Optional supplements (not substitutes for browsing):

- Reference page source (`src/pages/…`, `.astro` components)
- Converted demo source (`src/demo/converted/…`)
- Capture artifacts under `verification/artifacts/`

Record review URLs or artifact paths in the defect report **Artifacts captured** section.

## C. Content inventory (required per scope)

For each scoped route or host frame:

1. **Extract** from reference — every item a designer would expect on the page:
   - Page title and description
   - Every section heading (`h1`, `h2`, section titles)
   - Demo blocks, example cards, tables, callouts
   - Nav anchors / in-page links
   - Labels, badges, chips, helper text
   - Assets (icons, illustrations, SVGs) with alt/usage notes

2. **Walk** the converted page and mark each item:

   | Status | Meaning |
   |--------|---------|
   | **present** | Same or equivalent content visible |
   | **missing** | Reference has it; converted does not |
   | **different** | Present but wrong text, count, or placement |

3. **Report** — include a **Content parity** table in the defect report (see [DEFECT_REPORT.md](../../harmony-conversion/reference/DEFECT_REPORT.md)).

Missing reference content → `structure` or `visual` defect unless manifest or defect report explicitly defers that subsection with rationale.

Educational-only sections (e.g. Accessibility callouts) may be `accepted` if playbook documents them as optional — not silently omitted.

## D. Visual matrix (required per scope)

After content inventory, compare **rendered appearance** item by item. JSON or source equality is **not** sufficient.

### Foundation — colors

- Every palette swatch in each visible section (Semi-Light, CP Semi-Dark, VP/PPM/Mac dark, Semantic, Accent)
- For **each swatch**: compare **rendered color** on the review surface, not the hex/rgba string in source alone
- Test matrix: product (CP, VP, PPM, Maconomy) × mode (light, dark) × each swatch key (including `tableTotal`, `hover`, semantic colors)
- Note: reference may apply live CSS variables at runtime — converted must match **what the user sees**

#### Alpha / semi-transparent swatches (mandatory)

Tokens like `tableTotal` and `hover` use `rgba(...)` in source. **Do not PASS** because `theme.palette.harmony.tableTotal` equals the JSON string.

1. Read `getComputedStyle(swatchElement).backgroundColor` on **both** reference and converted swatch tiles.
2. If either value has alpha &lt; 1, composite over that page's `pageBackground` swatch before comparing.
3. Run `audit-palette-swatches.mjs` (component-library targets) and attach the report; investigate every mismatch row.
4. Optional: clip-screenshot individual swatch tiles (`tableTotal`, `hover`) when full-page captures are too small to judge.

**Why:** Reference `colors.astro` rewrites some rgba vars to opaque hex in the browser; converted may show the literal rgba — a designer sees different tiles even when tokens "match."

### Foundation — typography

- Every named style sample (Display XL/L/M, Heading XL/L/M/S, Body, Label, Caption, Overline)
- Font family showcase blocks
- Reference table rows (name, size, weight, line height, font)

### Foundation — spacing

- Every spacing scale row (bar width matches value)
- Border radius tiles
- Usage pattern cards (tight, default, relaxed, loose)

### Foundation — elevations

- Every shadow scale card (light and dark mode)
- Shadow value tables (light vs dark columns)
- Elevation hierarchy levels

### Foundation — Dela

- Brand guide link, Star symbol, Launch icon, token listing, panel preview sections
- Defer shell-only live demos only with explicit manifest/deferred note

### Demo chrome

- Header: branding, theme switcher, mode toggle, GitHub link, search
- Sidebar: sections, icons, footer (version, coverage)
- Responsive: hamburger + drawer below `1024px`

### Shell / components

- Every variant row, state demo, and example section on the reference doc page
- Compare at the same product theme and mode as reference examples when applicable
- **Alignment and spacing:** judge by browse or relative rect deltas — not absolute CSS (`paddingLeft`, `marginTop`) on different DOM roles (see VISUAL_MATCH_GATE § Layout and spacing)
- **Action rows, links, buttons:** compare left edge to sibling text/message — include link-only examples, not only multi-control rows

Record visual matrix results in defect report **Visual parity** section with **Reference (rendered)** and **Converted (rendered)** columns for every row.

## E. Behavior and responsive

When reference demonstrates or implies behavior, verify on converted:

- Theme switcher changes palette and swatches
- Light/dark toggle updates colors, shadows, and mode-specific sections
- Hover, focus, disabled, selected states shown in reference examples
- Demo chrome drawer / overlay at mobile width (scope `demo`)
- Interactive demos (dialogs open, tabs switch) when reference doc includes live examples

File `behavior` defects when affordances or state changes differ from reference intent.

## F. PASS bar (stricter)

Recommend **PASS: zero conversion defects** only when **all** of the following are true:

1. Rendered evidence was reviewed (not source-only)
2. Content inventory: no open `missing` or `different` items (or all documented as `deferred`/`accepted`)
3. Visual matrix: no open rendered deltas (or all documented as `deferred`/`accepted`)
4. Behavior checks pass for demonstrated states
5. Summary `open == 0` in defect report

**Not sufficient for PASS:**

- "Theme mapper exists" or "tokens synced from JSON"
- "Routes wired" or "same href paths"
- "Structurally similar" without side-by-side rendered review
- "Good enough for engineering" without designer bar
- CSS property match on different elements (e.g. same `paddingLeft` ≠ same visual alignment)
- Probe or `getComputedStyle` output alone without designer-visible rendered description
- Collapsed visual matrix (Item | Status only)

Recommend **FAIL** when any designer-visible gap remains open.

Recommend **BLOCKED** when review surfaces or MCP capture cannot be reached — never substitute PASS from code review alone.

### Deferring gaps

Use `deferred` or `accepted` only for:

- Documented technology limits (e.g. Figma cannot represent focus order)
- Explicit playbook/manifest scope exclusions (e.g. Dela live sidebar deferred to shell phase)

Do **not** defer because structural review looked "close enough."

Verifiers **must not** mark visual defects `accepted` without human confirmation — recommend `deferred` or note for human decision; **conversion-agent** uses **AskQuestion** before recording `accepted`.

## G. Defect phrasing

Write defects so a designer understands the gap:

- **Good:** "Designer would see Table Total swatch as solid blue on reference but pale transparent tint on conversion in CP light mode."
- **Bad:** "mapColorsToPalette missing tableTotal mapping" (implementation detail unless it explains visible gap)

## H. Target-specific supplements

| Target | Also load |
|--------|-----------|
| All targets | [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md) |
| component-library (browser) | [COMPARE_HTML.md](COMPARE_HTML.md), target `VERIFIER.md` |
| external (image) | [COMPARE_IMAGE.md](COMPARE_IMAGE.md), target `VERIFIER.md` |

Target playbooks add scope-specific checklists; this document defines the **shared designer bar** all targets must meet.

## I. Human sign-off

The verifier **recommends** PASS/FAIL. The **human** decides good enough per [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md).

1. Verifier completes content + visual matrices per rendered evidence.
2. **conversion-agent** presents a **side-by-side visual summary** (not defect counts alone).
3. **AskQuestion** before manifest `synced` or before final PASS when report has `accepted`/`deferred` items — even if `open == 0`.
4. Record **Human confirmation** in defect report (see [DEFECT_REPORT.md](../../harmony-conversion/reference/DEFECT_REPORT.md)).
