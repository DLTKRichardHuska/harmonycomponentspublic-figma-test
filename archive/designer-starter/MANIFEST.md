# Harmony Designer Starter — archived reference

This folder preserves the **Cursor bundle and documentation** for the Harmony Designer Starter kit, removed from the active monorepo during the structure refactor. It is **not** a runnable project.

## What the kit contained

| Area | Description |
|------|-------------|
| **Vite + React app** | Preview shell and components under `src/components/harmony/` |
| **Vendored CSS** | `harmony-styles/` — snapshot of design-system global styles |
| **Icons** | Full SVG tree at `icons/` (Tabler outline + custom) |
| **Icon manifest** | `harmony-data/icon-manifest.json` |
| **LLM reference** | `llms/` component markdown |
| **Packaging** | `scripts/package-designer-kit.sh` and root `scripts/package-harmony-designer-kit.sh` |
| **Kit version** | `KIT_VERSION` (last known: **1.0.3**) |

## Contents of this archive

| Path | Purpose |
|------|---------|
| `cursor/` | Full `.cursor/` bundle recovered from git (`harmony-designer-starter/.cursor/` at commit before removal) |
| `docs/HARMONY_DESIGNER_HANDBOOK.md` | Complete kit handbook |
| `docs/AGENTS.md` | Agent context and three-way parity rule (historical) |
| `docs/README.md` | Kit quick start |

## Restoring the full kit

The complete application (React source, icons, vendored CSS) remains in **git history**. To recover the full folder:

```bash
git log --oneline -- harmony-designer-starter/
git checkout <commit-before-removal> -- harmony-designer-starter/
```

Copy `cursor/` from this archive into the restored kit root as `.cursor/` if you want the archived Cursor configuration rather than the commit snapshot.

## Related archives

- **MUI/shadcn integration kit:** [`../integration-kit/`](../integration-kit/) — separate bundle for non-Astro Harmony integration workflows.
