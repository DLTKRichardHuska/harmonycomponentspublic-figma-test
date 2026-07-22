# Verification playbook — {{TARGET_ID}}

Converter id: `{{TARGET_ID}}`  
Path: `converters/{{TARGET_ID}}/`

Compare follows [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [DESIGNER_COMPARE.md](../../../.cursor/skills/conversion-verify/reference/DESIGNER_COMPARE.md).

## Artifact model

Define reference and converted artifact formats and paths under `verification/artifacts/`.

## Capture (automated)

Reference via **conversion-verify** scripts. Converted side via **{{MCP_SERVER}}** MCP.

If converted capture unavailable → **BLOCKED** — no PASS from reference-only review.

## Compare (readonly)

The **{{TARGET_ID}}-verifier** agent:

1. Loads equivalence procedure from [`VERIFIER.md`](VERIFIER.md)
2. Captures reference PNG + converted PNG (mandatory for PASS)
3. Completes content inventory and visual matrix per DESIGNER_COMPARE.md
4. Writes defect report per [DEFECT_REPORT.md](../../../.cursor/skills/harmony-conversion/reference/DEFECT_REPORT.md)

See **conversion-verify** compare guidance for the artifact type ([COMPARE_IMAGE.md](../../../.cursor/skills/conversion-verify/reference/COMPARE_IMAGE.md)).

## Acceptance (good enough)

**Designer bar** — section-by-section image compare; content + visual matrices clean.

- **PASS:** Rendered evidence reviewed + zero open defects + human confirms
- **Not sufficient:** readiness stubs, reference PNG only, layer names match without screenshot compare

## Verify-only

Invoke **{{TARGET_ID}}-verifier** agent. Capture + designer compare only; no remediate.
