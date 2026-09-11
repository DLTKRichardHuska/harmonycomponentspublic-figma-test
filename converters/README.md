# Converters

Expert **agents** per conversion target. Each converter is playbooks + readiness manifest — not a registry to maintain.

Discover converters: scan `converters/*/converter.manifest.json`.

| Converter | Type | Output |
|-----------|------|--------|
| `harmony-design-system-react-mui` | component-library | `conversions/harmony-design-system-react-mui/` |
| `harmony-design-system-shadcn` | component-library | `conversions/harmony-design-system-shadcn/` |
| `harmony-design-system-vanilla` | component-library | `conversions/harmony-design-system-vanilla/` (npm + static zip) |
| `figma` | external | Figma host via MCP |

Entry point: **`/conversion-agent`**
