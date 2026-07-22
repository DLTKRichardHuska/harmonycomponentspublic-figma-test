# HTML / demo compare (readonly — agent judgment)

Used by **component-library** QA verifier agents when reviewing browser-based conversions (e.g. React + MUI demo sites).

**Read first:**

1. [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md)
2. [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md) — **mandatory** visual match gate (all scopes)
3. [DESIGNER_COMPARE.md](DESIGNER_COMPARE.md) — **mandatory** designer walkthrough

Compare is **designer-equivalent judgment** — not DOM diff, not pixel gates, not source-only pass.

## Where compare logic lives

**Equivalence** (how to locate reference vs converted counterparts) is defined in each converter's `playbook/VERIFIER.md` — not here.

This doc supplements DESIGNER_COMPARE with **browser-specific** notes once the target QA agent has found both sides.

## Compare process

1. **Ensure rendered evidence** — browse reference (`:4321`) and converted (e.g. `:5176`) at matching routes. If unreachable → **BLOCKED**.
2. **Content inventory** — extract every section, demo, label, and asset from reference; walk converted page per DESIGNER_COMPARE § C.
3. **Visual matrix** — compare rendered appearance per DESIGNER_COMPARE § D (swatches, typography samples, spacing bars, shadows, component variants).
4. **Behavior** — theme/mode switches, responsive demo chrome, interactive states per DESIGNER_COMPARE § E.
5. Load reference and converted source only to **resolve** ambiguities — not as substitute for browsing.
6. For **foundation/colors**, run `audit-palette-swatches.mjs` and attach swatch matrix evidence (see DESIGNER_COMPARE § D alpha swatches).
7. For **layout/spacing/alignment** (all scopes), use side-by-side browse or optional `audit-rendered-alignment.mjs` — see VISUAL_MATCH_GATE § Layout and spacing.
8. Record defects per [DEFECT_REPORT.md](../../harmony-conversion/reference/DEFECT_REPORT.md) with designer phrasing.

**Scripts produce evidence; agents judge pass/fail.** Source-only review cannot justify PASS.

### Evidence types (browser)

| Concern | Valid evidence | Invalid as PASS gate |
|---------|----------------|----------------------|
| **Flat color swatches** | `getComputedStyle` background + alpha compositing | JSON token string match alone |
| **Layout, spacing, alignment** | Browse judgment or relative `getBoundingClientRect` deltas | Absolute CSS on mismatched selectors (`paddingLeft`, `marginTop`) |
| **Component examples** | Side-by-side route browse + visual matrix with rendered columns | Ad-hoc `verification/artifacts/diag/` probes |

## Check categories (designer-perceived)

| Category | What to judge |
|----------|----------------|
| `visual` | Rendered layout, spacing, alignment, iconography, typography, **color on screen** |
| `behavior` | States and affordances match reference intent |
| `tokens` | **Rendered** colors and typography match reference for theme/mode/product |
| `structure` | Reference **content** present — sections, examples, labels; not DOM parity |
| `a11y` | Equivalent outcomes for name, role, state |
| `api` | Only when missing configurability removes a **visible** variant/state from the doc page |
| `mapping` | Output matches approved strategy in `conversion.manifest.json` |

## Scope-type notes

| Scope type | Designer focus |
|------------|----------------|
| **demo** | Demo chrome look/behavior at desktop + `< 1024px`; nav/route coverage; placeholders labeled for unconverted scopes only |
| **foundation** | All five `/foundation/*` routes — full content inventory + color swatch visual matrix per product × mode |
| **shell** | Shell doc page content + layout anatomy as shown on reference |
| **component** | Every example section and variant/state on reference doc page |

**Partial conversion:** if manifest status is `not-started` or `in-progress`, placeholders are expected — not defects unless review-surface structure is wrong or synced scope shows visible gaps.

## Not sufficient for PASS

Per [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md):

- CSS property match on different DOM elements
- Reference CSS token copied into wrong DOM context
- Collapsed visual matrix (Item | Status only)
- Ad-hoc probes under `conversions/<id>/verification/artifacts/diag/` as verdict
- Source-only or theme-mapper review
- Probe/`getComputedStyle` output without designer-visible rendered description in visual matrix

## Output

Recommend PASS only when content inventory and visual matrix are clean (DESIGNER_COMPARE § F):

**PASS: zero conversion defects.**
