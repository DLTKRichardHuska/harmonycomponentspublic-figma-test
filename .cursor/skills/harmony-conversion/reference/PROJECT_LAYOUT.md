# Project layout — converters and conversions

See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md).

## Single-project model (conversion output)

Each **conversion** (`conversions/<id>/`) mirrors the reference repo layout:

| Reference | Conversion output |
|-----------|-------------------|
| `src/components/ui/` | `conversions/<id>/src/components/` |
| `src/layouts/` | `conversions/<id>/src/layouts/` |
| `src/pages/` | `conversions/<id>/src/pages/` + `src/demo/` — converter agent recreates reference demo site (placeholders first, then `src/demo/converted/`) |

Copy `conversions/<id>/` out for standalone use: `npm install && npm run dev`.

## Converter model

Each **converter** (`converters/<id>/`) holds playbooks and scripts only — no runnable project (component-library type).

| Converter | Conversion |
|-----------|------------|
| `playbook/SKILL.md` | `src/`, `package.json` |
| `converter.manifest.json` (`readiness`) | `conversion.manifest.json` (all element state) |

External converters have no `conversions/` sibling.
