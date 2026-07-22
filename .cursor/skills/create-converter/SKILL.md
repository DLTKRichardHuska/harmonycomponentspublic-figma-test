---
name: create-converter
description: "Scaffold a new Harmony converter (component-library or external) and paired conversion output when applicable."
disable-model-invocation: true
---

# /create-converter

Scaffold a new Harmony **converter** in `converters/` and register it. For **component-library** type, also scaffolds paired **conversion** output in `conversions/`.

## Input

- **Converter id** (required), kebab-case
- **Type** (required): `component-library` or `external`

Optional: `--name`, `--description`, `--package-name`, `--runtime`, `--ui-library`, `--host-system`, `--mcp-server`

Examples:
- `/create-converter vue-vuetify --type component-library --runtime vue --ui-library vuetify`
- `/create-converter storybook --type external --host-system storybook`

## Instructions

1. Load the **harmony-conversion** skill.
2. Agent runs from workspace root via Shell:

```bash
node .cursor/skills/harmony-conversion/scripts/create_converter.mjs <id> --type <type> [options]
```

3. Report paths: `converters/<id>/` and (if component-library) `conversions/<id>/`.
4. Remind: **converter is not ready** — complete [ADD_CONVERTER_CHECKLIST.md](../harmony-conversion/reference/ADD_CONVERTER_CHECKLIST.md) Phase A before conversion work.
5. Suggest `/conversion-agent converter <id>` for readiness audit.

**No npm commands for conversion.**
