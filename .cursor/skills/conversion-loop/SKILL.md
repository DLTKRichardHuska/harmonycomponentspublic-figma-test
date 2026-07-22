---
name: conversion-loop
description: "Deprecated — use conversion-agent execute mode (apply → verify → remediate loop). Kept as router only."
disable-model-invocation: false
---

# conversion-loop (deprecated)

**Use `/conversion-agent` execute mode instead.** This skill is a thin router.

## Execute loop

After human approval:

1. Load `converters/<id>/playbook/SKILL.md` — apply steps
2. Verify via converter verifier + `playbook/VERIFICATION.md`
3. Remediate per verification playbook
4. Update `conversion.manifest.json` on PASS

See **conversion-agent** SKILL.md — Mode: execute.
