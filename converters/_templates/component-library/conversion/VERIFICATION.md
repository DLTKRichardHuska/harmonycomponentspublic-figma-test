# Verification playbook — {{TARGET_ID}}

Converter id: `{{TARGET_ID}}`  
Conversion output: `conversions/{{TARGET_ID}}/`  
**QA agent:** `playbook/VERIFIER.md` (invoked as **{{TARGET_ID}}-verifier**)

Compare follows [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [DESIGNER_COMPARE.md](../../../.cursor/skills/conversion-verify/reference/DESIGNER_COMPARE.md).

Verification is **designer-led QA** — the target QA agent locates reference vs converted equivalents using **Conversion knowledge** in `VERIFIER.md`. Equivalence is **converter-owned** (not a global URL registry).

## Compare (readonly)

The **{{TARGET_ID}}-verifier** agent:

1. Loads equivalence procedure from [`VERIFIER.md`](VERIFIER.md)
2. Browses reference + converted review surfaces (mandatory for PASS)
3. Completes content inventory and visual matrix per DESIGNER_COMPARE.md
4. Writes defect report per [DEFECT_REPORT.md](../../../.cursor/skills/harmony-conversion/reference/DEFECT_REPORT.md)

## Acceptance (good enough)

**This converter + human** own sign-off. **Designer bar** — not engineer structural parity.

| Scope type | Good enough when |
|------------|------------------|
| **demo** | Demo chrome **looks and behaves** like reference DocsLayout at desktop + mobile; nav/routes match; placeholders only for unconverted scopes |
| **foundation** | All foundation routes present with **same content** as reference; **rendered** colors/typography/spacing/elevations match for each product × mode |
| **shell** | Shell doc page content and layout anatomy match reference as shown |
| **component** | Every reference example section and variant/state visible on converted demo |

- **PASS:** Content parity + visual parity clean + zero open defects + rendered evidence reviewed + human confirms
- **Not sufficient:** theme mapper exists, JSON tokens match, routes wired without browsing
- Record acceptance in `elements.<scope>.userDecision` when gaps are knowingly accepted

## Remediate

After FAIL — **engineer agent** (`SKILL.md`) applies fixes; QA agent re-runs verify with designer walkthrough.

When output organization changes, update **both** `SKILL.md` and `VERIFIER.md`.

## Verify-only

Invoke **{{TARGET_ID}}-verifier**. Designer compare only; no remediate.
