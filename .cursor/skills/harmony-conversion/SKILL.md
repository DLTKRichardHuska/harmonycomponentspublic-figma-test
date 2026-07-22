---
name: harmony-conversion
description: "Hub for Harmony design system conversion. Use conversion-management for portfolio status/plans; conversion-agent for single-target readiness, status, planning, and execution; when the user mentions converters, conversions, react-mui, Figma sync, or cross-framework Harmony."
disable-model-invocation: false
---

# Harmony conversion (hub)

Three-part model:

| Part | Path | Role |
|------|------|------|
| **Reference** | Repo `src/`, catalog, nav | Source of truth (Astro Harmony DS) |
| **Converters** | `converters/<id>/` | Expert agents — playbooks + readiness |
| **Conversions** | `conversions/<id>/` | Output — code + `conversion.manifest.json` |

**Primary entries:**

- **`/conversion-management`** — portfolio status, multi-conversion plans, coordinated execution
- **`/conversion-agent`** — single-target readiness, status, plan, execute, verify, tweak

**Cursor-only.** Node helpers are agent-internal via Shell — not for humans.

See [reference/CONVERTER_VS_CONVERSION.md](reference/CONVERTER_VS_CONVERSION.md) and [reference/CONVERSION_WORKFLOW.md](reference/CONVERSION_WORKFLOW.md).

## Paths

| Resource | Path |
|----------|------|
| Reference catalog | `src/data/component-catalog.ts` |
| Reference nav | `src/data/navigation.ts` |
| Converter agent | `converters/<id>/playbook/SKILL.md` |
| Converter readiness | `converters/<id>/converter.manifest.json` |
| Conversion output | `conversions/<id>/` |
| Conversion state | `conversions/<id>/conversion.manifest.json` |
| Version + coverage | `referenceVersion`, `coverage` in manifest — see [COVERAGE.md](reference/COVERAGE.md) |
| Defect reports | `conversions/<id>/verification/reports/` |
| Capture (verify) | `.cursor/skills/conversion-verify/` |
| Per-conversion plans | `conversions/<id>/plans/` |
| Portfolio plans | `plans/conversion-portfolio/` |

Discover converters: scan `converters/*/converter.manifest.json` (no registry JSON).

## Converter types

| Type | Description |
|------|-------------|
| **component-library** | Converter + paired conversion project; converter agent recreates reference demo site (placeholders first) |
| **external** | Converter only; output in external host via MCP — no local demo site |

## New converter

1. `/create-converter` or `node .cursor/skills/harmony-conversion/scripts/create_converter.mjs <id> --type <type>`
2. Complete [ADD_CONVERTER_CHECKLIST.md](reference/ADD_CONVERTER_CHECKLIST.md)
3. Build playbooks until `readiness.level: ready`
4. Run conversion via `/conversion-management` (portfolio) or `/conversion-agent` (single target)

## Version and coverage

Each conversion communicates status via:

- **`referenceVersion`** — repo release-train label (matches `package.json.version` for in-repo conversions)
- **`coverage`** — percent of design system elements verified for that version

Recompute coverage: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion <id> --write`

Sync versions: `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all`

Release readiness: `node .cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs --release-version <semver>`

See [COVERAGE.md](reference/COVERAGE.md) and [PORTFOLIO_PLAN.md](reference/PORTFOLIO_PLAN.md).

## Boundaries

- Reference Astro repo is source of truth — agents read catalog/nav directly
- Do not add converter-specific steps to global skills — only to `converters/<id>/playbook/`
- Conversion state lives in **one file**: `conversion.manifest.json`
- **Readiness ≠ status:** converter readiness uses `converters/<id>/` only; never answer readiness with sync tables or "conversion output" phrasing ([CONVERTER_VS_CONVERSION.md](reference/CONVERTER_VS_CONVERSION.md) § Scope fence)
- **Good enough:** each converter playbook + human decide acceptance; global skills do not auto-mark `synced` ([FIDELITY_PRINCIPLES.md](reference/FIDELITY_PRINCIPLES.md))

## Reference docs

- [FIDELITY_PRINCIPLES.md](reference/FIDELITY_PRINCIPLES.md)
- [CONVERTER_VS_CONVERSION.md](reference/CONVERTER_VS_CONVERSION.md)
- [SYNC_ELEMENTS.md](reference/SYNC_ELEMENTS.md)
- [TARGET_READINESS.md](reference/TARGET_READINESS.md)
- [CONVERSION_WORKFLOW.md](reference/CONVERSION_WORKFLOW.md)
- [COVERAGE.md](reference/COVERAGE.md)
- [RELEASE_READINESS.md](reference/RELEASE_READINESS.md)
- [PORTFOLIO_PLAN.md](reference/PORTFOLIO_PLAN.md)
- [ADD_CONVERTER_CHECKLIST.md](reference/ADD_CONVERTER_CHECKLIST.md)
