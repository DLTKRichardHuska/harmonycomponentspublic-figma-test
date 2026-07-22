# /conversion-agent

Harmony **conversion agent** — Cursor-only workflow for converter readiness, conversion status, planning, approval, and scoped execution.

## Input

Optional **mode** and arguments:

| Invocation | Mode |
|------------|------|
| `/conversion-agent` | guided |
| `/conversion-agent converter` | converter readiness (all) |
| `/conversion-agent converter harmony-design-system-react-mui` | converter readiness (one) |
| `/conversion-agent conversion-status` | conversion sync progress |
| `/conversion-agent plan harmony-design-system-react-mui Button` | plan only |
| `/conversion-agent execute harmony-design-system-react-mui Button` | execute (after approval) |
| `/conversion-agent verify-only harmony-design-system-react-mui Button` | readonly defect report |

Aliases: `readiness` = `converter`, `status` = `conversion-status`.

Natural language: *"Is the react+mui converter ready?"*, *"Is Button converted?"*, *"Go ahead with that plan."*

## Instructions

1. Load **harmony-conversion** and **conversion-agent** skills.
2. Disambiguate **converter readiness** vs **conversion status** per [CONVERTER_VS_CONVERSION.md](../skills/harmony-conversion/reference/CONVERTER_VS_CONVERSION.md) — apply the **scope fence** (readiness: `converters/` only; no `elements` sync tables).
3. Route apply/verify to `converters/<id>/playbook/`; status to `conversions/<id>/`.
4. **Never instruct the user to run npm for conversion.**

See [CONVERSION_WORKFLOW.md](../skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md).
