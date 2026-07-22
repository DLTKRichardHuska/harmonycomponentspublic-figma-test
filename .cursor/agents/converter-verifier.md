---
name: converter-verifier
description: Validates Harmony converter and conversion structure. Readonly audit; outputs deviation list or PASS.
model: inherit
readonly: true
---

# Converter verifier

Audit **converter and conversion structure**. Readonly — list deviations only.

Use **conversion-agent** readiness mode or run validation directly.

## Automated checks (agent runs via Shell)

```bash
node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>
node .cursor/skills/harmony-conversion/scripts/validate_conversion.mjs --conversion <id>
```

Discover ids by scanning `converters/*/converter.manifest.json`.

## Checks

- [ ] `converter.manifest.json` with `readiness.level`
- [ ] `playbook/SKILL.md`, `playbook/VERIFICATION.md`, `playbook/VERIFIER.md`
- [ ] `conversion.manifest.json` with foundation page keys (`Colors`, `Typography`, `Spacing`, `Elevations`, `Dela`) and per-element keys
- [ ] Single `package.json`, required `src/` layout (component-library)

If zero deviations: **PASS: converter structure valid.**
