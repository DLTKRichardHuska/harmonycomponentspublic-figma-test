# Converter playbook — {{TARGET_ID}}

Converter id: `{{TARGET_ID}}`  
Path: `converters/{{TARGET_ID}}/`  
Host: {{HOST_SYSTEM}} via MCP (`{{MCP_SERVER}}`)

No local `conversions/{{TARGET_ID}}/` — output lives in {{HOST_LOCATION}}.

**No local demo site** — preview is host-defined. Do not recreate reference nav or placeholder pages in this repo.

> **Status: placeholder** — conversion steps below are stubs until implementation begins.

## Planning and status

Invoked by **conversion-agent** (`status` or `plan` mode).

### Status (readonly)

1. Read `converter.manifest.json` and `external.config.json`.
2. Summarize scope progress vs `src/data/component-catalog.ts`.
3. **Do not call host MCP** for writes; readonly metadata only.

### Plan (plan file only)

1. Propose phased plan for requested scope.
2. **AskQuestion** for host-specific configuration or waivers.
3. Write `playbook/plans/<scope>.md` (`status: draft`).
4. **Do not call host MCP** for create/update unless user later approves execute mode.

## Converter readiness

**Overall level:** `not-ready`  
**Last reviewed:** (set when scaffolded)

Update capability matrix as playbooks are implemented.

### Safe to use now

- `/conversion-agent readiness {{TARGET_ID}}` until playbooks are implemented

## Conversion steps (TODO)

Document host-specific apply steps for foundation, shell, and components.
