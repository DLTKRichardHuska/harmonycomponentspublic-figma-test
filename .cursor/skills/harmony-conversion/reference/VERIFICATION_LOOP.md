# Conversion verification loop

Part of the **Cursor-only** conversion workflow. Orchestrated by **conversion-agent** execute mode. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

Global orchestration for **apply → verify (readonly) → remediate → re-verify** until zero defects or the target cannot fix remaining issues.

Target-specific capture, compare, and remediate logic lives in each target's **`playbook/VERIFICATION.md`**. Global skills and agents **route only** — see [ROUTING.md](ROUTING.md).

## Phases

| Phase | Who runs it | Playbook / skill | Writable? | Purpose |
|-------|-------------|------------------|-----------|---------|
| **Apply** | **conversion-agent** execute | target `playbook/SKILL.md` | Yes | Sync/convert the requested scope |
| **Verify** | Target verifier agent + **conversion-fidelity-verifier** router | `playbook/VERIFIER.md`, **conversion-verify** | No | Browse/capture evidence; **agent judges** fidelity; defect report |
| **Remediate** | **conversion-agent** execute | target `playbook/VERIFICATION.md` | Yes | Fix open defects |

## Loop protocol

Inputs: **target id**, **scope** (`foundation` | `shell` | `components` | component name | `all`), optional **maxIterations** (default **5**).

```
iteration = 0
repeat:
  iteration += 1
  if iteration > maxIterations:
    STOP — max iterations; attach latest defect report

  1. APPLY — follow target playbook/SKILL.md for scope (skip on iteration 1 if user asked verify-only)

  2. VERIFY (readonly) — invoke target verifier agent (via **conversion-fidelity-verifier** router):
     - Visual match gate + designer walkthrough per [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md) and [DESIGNER_COMPARE.md](../conversion-verify/reference/DESIGNER_COMPARE.md)
     - Browse reference + converted review surfaces (or capture screenshots) — **source-only verify cannot PASS**
     - Target verifier **judges** equivalence (look, content, act) — designer bar, not CSS/probe proxy, not binary script diff
     - Visual matrix: **Reference (rendered) | Converted (rendered) | Status** for every row
     - Write report with **Content parity** and **Visual parity** sections per [DEFECT_REPORT.md](DEFECT_REPORT.md)
     - Copy/summary at verification/latest-defect-report.md

  3. if report summary.open == 0:
       Verifier recommends PASS — **AskQuestion (mandatory)**: visual match acceptable? (remediate / accept gap / reject)
       **Never** auto-sync on verifier PASS alone — see [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md)
       Also **AskQuestion** when summary.accepted > 0 or any deferred/accepted visual item — even if open == 0
       On human accept → update manifest element status if appropriate; run compute_coverage.mjs --write; STOP
       If human defers → remediate or record userDecision on deferred defects

  4. REMEDIATE — when human requests fixes, follow target VERIFICATION.md remediate section
     - Mark defects fixed | blocked | deferred in report

  5. if no defect moved to fixed and open > 0:
       Present to human — accept gaps, remediate, or block; record userDecision if accepted

  6. goto VERIFY (re-check after remediate; re-apply only if target playbook requires rebuild)
until human accepts good enough or STOP
```

## Verify-only mode

When the user requests **verify only** (no apply/remediate):

1. Run **Verify** via target verifier agent (**conversion-fidelity-verifier** router)
2. Do not modify target or reference files

## Playbook resolution

| Doc | Manifest path | Default |
|-----|---------------|---------|
| Conversion (apply) | `conversion.playbook` | `playbook/SKILL.md` |
| Verification | `conversion.verification.playbook` | `playbook/VERIFICATION.md` |

Full paths: `converters/<id>/<path>` (playbooks) and `conversions/<id>/verification/` (artifacts, reports).

## Defect report

All targets produce reports in the format defined in [DEFECT_REPORT.md](DEFECT_REPORT.md).

Reports are written under `conversions/<id>/verification/reports/` (component-library) or `converters/<id>/verification/reports/` (external).

## Artifact abstraction

Each target declares in **VERIFICATION.md** how it obtains **evidence** for the verifier agent. Artifact format varies by host; **compare criteria are always user-perceived fidelity** — see [FIDELITY_PRINCIPLES.md](FIDELITY_PRINCIPLES.md).

| Target type | Typical artifact | Capture |
|-------------|------------------|---------|
| component-library | Live browse (reference docs + conversion demo) | Optional Playwright evidence scripts |
| external (Figma) | PNG/screenshot via MCP | Figma MCP `get_screenshot` or equivalent |

Compare is **not** a DOM-diff workflow. The agent judges look, content, and act using the **visual match gate** in [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md) and [DESIGNER_COMPARE.md](../conversion-verify/reference/DESIGNER_COMPARE.md).

The global layer never assumes one artifact type — only that the target playbook defines evidence and compare steps aligned with FIDELITY_PRINCIPLES.

## Slash commands

Primary: `/conversion-agent` — see [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

## Related agents and skills

| Name | Role |
|------|------|
| **conversion-agent** | Primary: status, plan, approval, scoped execute (apply → verify → remediate) |
| **conversion-fidelity-verifier** | Readonly compare; writes defect report |
| **conversion-verify** | Shared designer fidelity principles + optional evidence scripts |
| `validate_converter.mjs` | Structural validation (not fidelity) |
