# Harmony Integration Kit (archived)

This folder preserves the **MUI/shadcn Integration Kit** Cursor bundle, removed from the active Harmony Design System repo during the monorepo refactor.

## Purpose

Use this archive when integrating Harmony design tokens, themes, and shell behavior into a **customer MUI or shadcn application** — not for maintaining the Astro reference design system.

## How to use

1. Copy `cursor/` into your target project's root as `.cursor/` (merge with existing config if needed).
2. Read `docs/HARMONY_INTEGRATION_GUIDE.md` for skill and agent index.
3. Read `MANIFEST.md` for known gaps and referenced docs that were not shipped in this repo.

## Contents

| Path | Description |
|------|-------------|
| `cursor/skills/harmony-integration/` | Integration hub skill |
| `cursor/skills/build-all-patterns/` | Build all pattern demo pages in host framework |
| `cursor/skills/build-layout/` | `/build-layout` playbook |
| `cursor/skills/layout-builder/` | Composition rules for MUI/shadcn pages |
| `cursor/agents/` | `harmony-completeness`, `harmony-implement`, `harmony-verifier` |
| `cursor/rules/integration-source-first.mdc` | Read pinned sources before theming |
| `docs/HARMONY_INTEGRATION_GUIDE.md` | Integration guide index |

## Related archives

- **Designer Starter:** [`../designer-starter/`](../designer-starter/) — React preview kit Cursor bundle (separate product).
