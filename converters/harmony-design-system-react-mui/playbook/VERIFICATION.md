# Verification playbook — harmony-design-system-react-mui

Converter id: `harmony-design-system-react-mui`  
Conversion output: `conversions/harmony-design-system-react-mui/`  
**QA agent:** `playbook/VERIFIER.md` (invoked as **harmony-design-system-react-mui-verifier**)

Compare follows [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md), [VISUAL_MATCH_GATE.md](../../../.cursor/skills/conversion-verify/reference/VISUAL_MATCH_GATE.md), and [DESIGNER_COMPARE.md](../../../.cursor/skills/conversion-verify/reference/DESIGNER_COMPARE.md): **designer-perceived** rendered appearance — not DOM/HTML/CSS proxy parity.

Verification is **designer-led QA** — browse reference (`:4321`) and converted (`:5176`) side by side; complete content inventory and visual matrix per scope.

## Compare (readonly)

The **harmony-design-system-react-mui-verifier** agent:

1. Loads equivalence procedure from [`VERIFIER.md`](VERIFIER.md)
2. Browses matching routes on reference and converted dev servers (**mandatory for PASS**)
3. Completes content inventory and visual matrix per DESIGNER_COMPARE.md
4. Writes defect report per [DEFECT_REPORT.md](../../../.cursor/skills/harmony-conversion/reference/DEFECT_REPORT.md)

See [COMPARE_HTML.md](../../../.cursor/skills/conversion-verify/reference/COMPARE_HTML.md) for browser-specific notes.

## Acceptance (good enough)

**This converter + human** own sign-off. **Designer bar** — side-by-side rendered review required.

| Scope type | Good enough when |
|------------|------------------|
| **demo** | Demo chrome **looks and behaves** like reference DocsLayout at desktop + `< 1024px`; nav/routes match; placeholders only for unconverted scopes |
| **foundation** | All five `/foundation/*` routes present; demos teach the **shipped MUI theme + custom component API** (`useTheme` / package exports) — not Harmony token JSON; **rendered** theme values match for each product × mode; no open visual/content gaps |
| **shell** | Shell doc page content and layout anatomy match reference as shown |
| **component** | Every reference example section and variant/state visible on converted demo — **no** missing sections due to unconverted catalog dependencies; composite patterns shown as inline target-framework JSX |

**Wrapper violations (always FAIL for react-mui):**

- Package export that re-exposes MUI with Harmony-shaped props
- File-local React components in component demo files
- Wrappers around MUI primitives inside example demonstrations (layout, sizing, Harmony-shaped)
- Demo-local component that accepts Harmony catalog prop names not on the target MUI component
- `thin-wrapper` strategy in manifest

**Consumer API (custom package exports):** `custom` exports and custom sub-exports must match the **approved** Consumer API in the plan / element `userDecision` (base/analog, inherited props/events, Harmony-specific props). Missing an interactive or configurability surface that was approved → defect. Pure `existing-mui` theme-only elements are not subject to this check. Visual fidelity rules are unchanged.

**Not sufficient for PASS:**

- Theme mapper or vendored JSON exists
- Routes wired without browsing
- JSON token string matches but rendered swatch differs (e.g. Table Total alpha compositing)
- CSS property match on different DOM elements (e.g. same `paddingLeft` ≠ same visual alignment)
- Reference CSS token copied into wrong DOM context (theme override that mimics reference source but misaligns)
- Collapsed visual matrix (Item | Status only) or rows marked **present** from probe/`getComputedStyle` alone
- Ad-hoc probes under `conversions/<id>/verification/artifacts/diag/` used as verdict
- **`UnsupportedEquivalentCallout` or omitted sections where a catalog dependency is not yet `synced`** — convert the dependency first; dependent element stays `in-progress`
- Partial PASS for dependency-deferred content

- **PASS:** Full content parity + visual parity (three rendered columns) + zero open defects + **all catalog dependencies synced** + rendered evidence reviewed **and human confirms** via AskQuestion
- **Intentional:** MUI DOM differs from Astro — not defects by themselves
- **Defer / accept:** only for non-dependency gaps the human explicitly declined (skip) or documented circular-dependency interim state — never for avoidable dependency ordering

## Remediate

After FAIL — **engineer agent** (`SKILL.md`) applies fixes; QA agent re-runs designer walkthrough.

| Scope type | Typical remediate |
|------------|-------------------|
| **demo** | Fix demo chrome in `src/demo/`; theme palette in `src/theme/` |
| **foundation** | Fix theme mapping; foundation demos use **only** `useTheme()` / package exports (never `@/tokens` or Harmony palette helpers on the demo surface) |
| **shell** | Layout components, shell demo modules |
| **component** | Theme overrides / custom component + demo module via MUI MCP; demo uses inline MUI JSX — no Harmony-prop wrappers |

MCP gate for apply/remediate: **user-mui-mcp**.

When output organization changes, update **both** `SKILL.md` and `VERIFIER.md`.

## Verify-only

Invoke **harmony-design-system-react-mui-verifier**. Designer compare only; no remediate. Summarize recommendation with side-by-side visual summary; **AskQuestion** — human decides good enough ([VISUAL_MATCH_GATE.md](../../../.cursor/skills/conversion-verify/reference/VISUAL_MATCH_GATE.md)).
