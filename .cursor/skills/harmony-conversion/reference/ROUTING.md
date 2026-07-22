# Conversion routing

Global conversion skills **route only**. Converter-specific logic lives in `converters/<id>/playbook/`.

**Primary user entries:** **conversion-management** (portfolio), **conversion-agent** (single target). See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md) and [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

**Cursor only** — no npm commands for conversion.

## Layers

| Layer | Location | Role |
|-------|----------|------|
| Hub | `.cursor/skills/harmony-conversion/` | Registries, types, agent-internal scripts |
| Portfolio orchestrator | `.cursor/skills/conversion-management/` | Multi-conversion status, plan, execute |
| Single-target orchestrator | `.cursor/skills/conversion-agent/` | Converter readiness, conversion status, plan, execute |
| Execution | `.cursor/skills/conversion-loop/` | Apply → verify → remediate |
| Converter playbook | `converters/<id>/playbook/SKILL.md` | Apply steps |
| Verification playbook | `converters/<id>/playbook/VERIFICATION.md` | Capture, compare, remediate |
| Verifier agent | `converters/<id>/playbook/VERIFIER.md` | Automated verify |
| Conversion output | `conversions/<id>/` | Project, sync status, artifacts |
| Shared verify | `.cursor/skills/conversion-verify/` | Reference capture scripts |

## Playbook resolution

| Purpose | Manifest field | Default |
|---------|----------------|---------|
| Apply / sync | `conversion.playbook` in `converter.manifest.json` | `playbook/SKILL.md` |
| Verify / remediate | `conversion.verification.playbook` | `playbook/VERIFICATION.md` |
| Plan artifact | (convention) | `conversions/<id>/plans/<scope>.md` |
| Portfolio plan | (convention) | `plans/conversion-portfolio/<version>-<date>.md` |

1. Read `converters/<id>/converter.manifest.json`
2. Load playbooks from `converters/<id>/<path>`
3. Read conversion state from `conversions/<outputId>/conversion.manifest.json`

## User intents

| Intent | Router |
|--------|--------|
| All conversions status | **conversion-management** `portfolio-status` / `reassess` |
| Plan all conversions | **conversion-management** `portfolio-plan` |
| Execute portfolio / slice | **conversion-management** `portfolio-execute` → **conversion-agent** |
| Converter ready? | **conversion-agent** `readiness` / `converter` |
| Conversion synced? | **conversion-agent** `status` / `conversion-status` |
| Plan (single target) | **conversion-agent** `plan` |
| Execute (single target) | **conversion-agent** `execute` → **conversion-loop** |
| Verify | **conversion-agent** `verify-only` → verifier agent |
| Coverage recompute | `compute_coverage.mjs --write` via Shell |
| One-shot apply | **sync-target** (advanced) |
| Structure | **verify-converter** |

## Adding a converter

1. `/create-converter`
2. Implement `playbook/SKILL.md` and `playbook/VERIFICATION.md`
3. `/verify-converter <id>`
4. `/conversion-agent converter <id>` until ready
5. Then run conversion against `conversions/<id>/`
