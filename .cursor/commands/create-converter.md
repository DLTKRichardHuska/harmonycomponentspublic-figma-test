# /create-converter

Scaffold a new Harmony **converter** in `converters/` and paired **conversion** in `conversions/` (component-library only).

## Input

- **Converter id** (required), kebab-case
- **Type** (required): `component-library` or `external`

Example: `/create-converter vue-vuetify --type component-library --runtime vue --ui-library vuetify`

## Instructions

1. Load **harmony-conversion** and **create-converter** skills.
2. Agent runs `create_converter.mjs` via Shell.
3. Remind user: converter is **not ready** until playbooks are implemented — see ADD_CONVERTER_CHECKLIST.md Phase A.
