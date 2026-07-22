# Converter and conversion types

Harmony conversion uses two paired concepts:

- **Converter** (`converters/<id>/`) — how to convert, verify, and remediate
- **Conversion** (`conversions/<id>/`) — the converted output and sync status (component-library only)

## component-library

A **standalone project** under `conversions/<id>/`. Two layouts are supported via `independence.layout`:

### Layout: `single-package` (default)

Mirrors the reference Astro repo layout in one package:

| Reference | Conversion output |
|-----------|-------------------|
| Root `package.json` | `conversions/<id>/package.json` |
| `src/components/ui/` | `src/components/` |
| `src/layouts/` | `src/layouts/` |
| `src/styles/`, `src/tokens/` | `src/styles/` |
| `src/pages/` | `src/pages/` |

**Dual mode, one project:**

- `npm run dev` — demo/docs site using converted components in the same repo
- `npm run build:lib` — publishable npm library via `exports` / `files[]`

No nested `package.json` files.

### Layout: `npm-workspace`

Use when the demo must consume the library **by package name** (AI/consumer-faithful):

| Role | Path |
|------|------|
| Workspace root | `conversions/<id>/package.json` (`workspaces`, delegates `dev` / `build:lib`) |
| Publishable package | `packages/ui/` (or `independence.packagePath`) — scoped npm package |
| Demo app | `apps/demo/` (or `independence.demoPath`) — depends on the package by name |

Demo imports only public package exports (published name). Nested `package.json` allowed only under `packages/*` and `apps/*`.

**Demo site (both layouts):** the **converter agent** recreates the reference doc site first — full nav from `src/data/navigation.ts`, **placeholder pages** for unconverted catalog scopes, real demos as elements sync. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

**Independence:** The entire `conversions/<id>/` folder is extractable. One `npm install` at the conversion root. No runtime imports from parent Astro `src/`.

The paired **converter** lives at `converters/<id>/` with playbooks and scripts only.

## external

Hosted entirely outside this repo (e.g. Figma). Metadata only under `converters/<id>/`:

- `converter.manifest.json`
- `external.config.json`
- `playbook/` — SKILL, VERIFICATION, VERIFIER
- No `conversions/<id>/` entry

Conversion uses host tools (e.g. Figma MCP). Demo/preview is host-defined — **do not** recreate a local demo site in this repo.

## When to use which

| Need | Type |
|------|------|
| Framework npm package + local demo site | component-library |
| Design tool or hosted system with no local code | external |
