# Converter playbook — {{TARGET_ID}}

Converter id: `{{TARGET_ID}}`  
Path: `converters/{{TARGET_ID}}/`  
Framework: {{FRAMEWORK}}

> **Status: placeholder** — define conversion steps for this converter here.

Global **conversion-agent** routes to this file. Do not put converter-specific conversion logic in `.cursor/skills/`.

## Converter readiness

**Overall level:** `not-ready`  
**Last reviewed:** (set when scaffolded)

Update this section when implementing converter playbooks. See repo [TARGET_READINESS.md](../../../.cursor/skills/harmony-conversion/reference/TARGET_READINESS.md).

### Capability matrix

| Scope | Plan | Execute apply | Verify | Remediate |
|-------|------|---------------|--------|-----------|
| demo site (bootstrap) | no | no | no | no |
| foundation | no | no | no | no |
| shell | no | no | no | no |
| components | no | no | no | no |

### Gaps

1. Conversion steps below are TODO
2. `playbook/VERIFICATION.md` is stub
3. List scripts, MCP servers, and blockers here as you implement

### Safe to use now

- `/conversion-agent readiness {{TARGET_ID}}` only until matrix is updated

## Planning and status

When the user asks for conversion status or a conversion plan:

1. Read `conversions/{{TARGET_ID}}/conversion.manifest.json` and compare to reference `src/data/component-catalog.ts` and `src/data/navigation.ts`.
2. Summarize foundation, shell, and components progress; include demo site route coverage vs reference nav.
3. Output a phased plan; do not implement unless asked.

## Step 1 — Demo site bootstrap (first execute — component-library only)

**Converter agent responsibility.** Recreate the reference demo site in `conversions/{{TARGET_ID}}/` before foundation, shell, or component sync.

1. Read `src/data/navigation.ts` and `src/data/component-catalog.ts`.
2. Scaffold routing, nav, and a page for every reference doc route under `src/pages/` + `src/demo/`.
3. **Placeholder** every scope not yet converted (scope name, manifest status, link to reference).
4. Replace placeholders with real demos in `src/demo/converted/` as elements sync.

See repo [CONVERSION_WORKFLOW.md](../../../.cursor/skills/harmony-conversion/reference/CONVERSION_WORKFLOW.md).

## Conversion steps (TODO)

Document how to convert foundation, shell, and components for {{FRAMEWORK}}.
