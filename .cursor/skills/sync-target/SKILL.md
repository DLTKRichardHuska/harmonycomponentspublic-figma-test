---
name: sync-target
description: "Deprecated — use conversion-agent execute mode for one-shot apply. Kept as router only."
disable-model-invocation: false
---

# sync-target (deprecated)

**Use `/conversion-agent` execute mode instead.**

One-shot apply without full loop — still requires human direction and converter playbook delegation.

1. Resolve converter id from `converters/<id>/converter.manifest.json`
2. Load `converters/<id>/playbook/SKILL.md`
3. Apply for scope; update `conversion.manifest.json`

See **conversion-agent** SKILL.md.
