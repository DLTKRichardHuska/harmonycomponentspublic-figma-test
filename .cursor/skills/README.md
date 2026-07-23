# Cursor skills (Harmony Design System)

All skills live under `.cursor/skills/`. See [.cursor/HARMONY_GUIDE.md](../HARMONY_GUIDE.md) for slash commands and agents.

## Hub and patterns

| Folder | Purpose |
|--------|---------|
| **harmony** | Hub: Astro source paths, theme/mode, allowed sources |
| **design-patterns** | Pattern registry |
| **create-pattern** | Generate pattern doc from Astro component |
| **search-patterns** | Search pattern registry |

## Review and compliance

| Folder | Purpose |
|--------|---------|
| **harmony-critique** | Critique against Harmony patterns and UX |
| **harmony-usage-rules** | Usage rules and accessibility |
| **harmony-ux-principles** | UX principles |
| **ux-review** | Standalone UX review |

## Conversion

| Folder | Purpose |
|--------|---------|
| **harmony-conversion** | Hub: converters, conversions, workflow |
| **conversion-management** | Portfolio orchestrator across all conversions |
| **conversion-agent** | Single-target orchestrator (includes execute loop) |
| **create-converter** | Scaffold converter (+ conversion) |
| **conversion-verify** | Agent-internal designer fidelity + optional evidence scripts |

Converter playbooks: `converters/<id>/playbook/`. Conversion output: `conversions/<id>/`.

Discover converters: scan `converters/*/converter.manifest.json`.

**No npm commands for conversion** — Cursor only via `/conversion-agent`.

## Key docs

- [docs/RULES.md](../../docs/RULES.md)
- [CONVERTER_VS_CONVERSION.md](harmony-conversion/reference/CONVERTER_VS_CONVERSION.md)

## Archived kits

- [archive/designer-starter/](../../archive/designer-starter/)
- [archive/integration-kit/](../../archive/integration-kit/)
