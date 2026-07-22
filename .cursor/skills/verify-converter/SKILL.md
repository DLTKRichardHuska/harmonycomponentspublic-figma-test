---
name: verify-converter
description: "Deprecated — use conversion-agent readiness mode. Kept as router only."
disable-model-invocation: false
---

# verify-converter (deprecated)

**Use `/conversion-agent converter <id>` or readiness mode instead.**

Structural validation (agents via Shell):

```bash
node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>
node .cursor/skills/harmony-conversion/scripts/validate_conversion.mjs --conversion <id>
```

Discover converters by scanning `converters/*/converter.manifest.json`.

See **conversion-agent** SKILL.md — Mode: readiness.
