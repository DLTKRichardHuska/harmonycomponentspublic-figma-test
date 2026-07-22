# /conversion-loop

Advanced execution engine: apply → verify → remediate. **Prefer `/conversion-agent`** for the full status → plan → approve workflow.

Cursor-only — not npm build or CI.

## Input

**Target id**, optional **scope**, optional **verify-only**.

Example: `/conversion-loop harmony-design-system-react-mui Button`

## Instructions

1. Load **harmony-conversion** and **conversion-loop** skills.
2. Confirm user intent to execute (or that **conversion-agent** already approved).
3. Route to target playbooks; invoke **conversion-fidelity-verifier** for readonly compare.
