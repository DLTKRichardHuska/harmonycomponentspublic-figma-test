---
name: harmony-integration
description: Hub for Harmony → MUI/shadcn integration. Use when applying Harmony tokens, themes, or shell behavior to Material UI or shadcn; when the user mentions integration kit, pinned sources, harmony-source-inventory, or wants to integrate Harmony.
---

# Harmony integration (hub)

## Install / sharing

Kit contents must be at the **project root**, not inside a subfolder. Cursor only reads `.cursor/` at the workspace root — if the kit is nested, nothing activates. See the **Installation** section in [../../../README.md](../../../README.md) for step-by-step instructions on merging into an existing project. If the project already has a `.cursor/` folder, merge the kit's skills, agents, and rules into it rather than replacing it.

## Before any implementation

1. Open [docs/PINNED_SOURCES.md](../../../docs/PINNED_SOURCES.md) — confirm paths resolve.
2. Open [docs/harmony-source-inventory.md](../../../docs/harmony-source-inventory.md). If still template/TBD, follow [docs/GENERATE_INVENTORY.md](../../../docs/GENERATE_INVENTORY.md) first.
3. Open [docs/MAPPING_PLAYBOOK.md](../../../docs/MAPPING_PLAYBOOK.md) — this defines the 8-pass workflow.
4. Read pinned **`harmony-styles/tokens.css`** — list every `html.theme-*` and `.dark` block; do not trust chat-only theme lists.

## Full handbook

[../../../HARMONY_INTEGRATION_HANDBOOK.md](../../../HARMONY_INTEGRATION_HANDBOOK.md)

## Source table

[reference/SOURCES.md](reference/SOURCES.md)

## Key docs

| Document | Purpose |
|----------|---------|
| [MAPPING_PLAYBOOK.md](../../../docs/MAPPING_PLAYBOOK.md) | 8-pass workflow with per-category token checklists |
| [COMPONENT_MANIFEST.md](../../../docs/COMPONENT_MANIFEST.md) | Row per reference-components component, host equivalents, mapping status |
| [harmony-source-inventory.md](../../../docs/harmony-source-inventory.md) | Full token/component checklist, §12 mapping appendix |

## Shell boundary

- **Implement** shell with **MUI or shadcn** only.
- **Designer `reference-components/ShellLayout.tsx` + shell CSS** = **spec** for regions, `data-*`, CP floating nav vs footer, per-theme nav — not components to paste into the host app unless the user explicitly requests a hybrid.

## Inventory scope

The inventory must cover **shell + all mapped library primitives** (forms, buttons, cards, alerts, dialogs, tables, etc.) — **not** shell-only. [docs/harmony-source-inventory.md](../../../docs/harmony-source-inventory.md) sections 4–12.

## Orchestration workflow

When the user wants to integrate Harmony, follow these steps. The main agent handles detection, then delegates each pass to subagents sequentially (foreground mode).

### Step 0 — Detect project state

Before delegating any passes, determine the project state:

1. **Check for host framework:** Look at `package.json` for `@mui/material` or `tailwindcss` + shadcn dependencies. If neither exists, ask the user which framework to use.
2. **Detect build tool and entry point:** Check for `vite.config.ts`, `next.config.js`/`next.config.ts`, or `react-scripts` in `package.json` to identify the build tool. Locate the app entry point (e.g. `main.tsx`, `_app.tsx`, `app/layout.tsx`) and the primary CSS import location. These determine where Harmony CSS is imported and where theme providers are wired in Pass 1.
3. **Check for existing shell:** Search for existing layout/shell components:
   - **MUI indicators:** `AppBar`, `Drawer`, `Toolbar` imports in any layout or app-level component
   - **shadcn indicators:** existing layout component with sidebar/header structure
   - **Router:** existing route definitions with layout wrapper
4. **Classify:**
   - **Existing app** → shell components found. Pass 7 will **restyle** the existing shell.
   - **Greenfield** → no shell found (or only a bare scaffold). Pass 7 will **build** the shell from scratch.
5. **Report classification** to the user: "Detected: [build tool] + [MUI / shadcn]. Project state: [existing app / greenfield]. Entry point: [path]. Proceeding with [restyle / build] for Pass 7."

### Step 1 — Delegate passes 1–8

Confirm §3–12 in `harmony-source-inventory.md` are populated or marked WIP.

For each pass (1 through 8), delegate to the **harmony-implement** subagent in foreground mode. Pass these inputs each time:
- **Pass number** (1–8)
- **Stack:** MUI or shadcn (from detection)
- **Project state:** existing app or greenfield (from detection)
- **Entry point path** (from detection)

One pass per invocation. Wait for each to complete before starting the next. Each pass follows the corresponding section in [docs/MAPPING_PLAYBOOK.md](../../../docs/MAPPING_PLAYBOOK.md).

For greenfield projects, after pass 8, add a **sample content screen** using only library primitives (button, input, card, alert) to confirm mapped tokens are inherited without local hex/spacing hacks.

### Step 2 — Delegate completeness

After all 8 passes complete, delegate to the **harmony-completeness** subagent (foreground). It checks every inventory subsection has a mapping or §13 gap entry.

### Step 3 — Delegate verification

Delegate to the **harmony-verifier** subagent (foreground). It performs the final read-only check and returns a deviation list.

### Step 4 — Loop on gaps

If the verifier returns deviations, delegate back to **harmony-implement** for fixes (targeting the specific pass that needs correction), then re-run **harmony-completeness** and **harmony-verifier**. Repeat until PASS or only §13 gaps remain.

## Success criteria

- **4 themes × light/dark** verification paths documented and checked (inventory §3 matrix).
- Host mapping appendix (§12) covers **shell + content** components in use, with Pass # per row.
- **COMPONENT_MANIFEST.md** rows for in-use components have status `mapped` or `gap` (with §13 entry).
- **harmony-verifier** passes or remaining items are listed in inventory §13.
- For greenfield: all subsequent UI built with the library **inherits** the same theme (no ad-hoc colors/spacing outside the mapped system unless documented as a gap).

## Anti-patterns

- Theming **only** the header/sidebar while leaving default MUI/shadcn grays on forms.
- Guessing theme keys without opening `tokens.css`.
- Importing `reference-components/` as the integration solution (they are read-only spec).
- Running all passes in a single invocation instead of one-at-a-time.
- Per-screen one-off colors that bypass the shared Harmony theme wiring.

## Related rules

- `.cursor/rules/integration-source-first.mdc`
- `.cursor/rules/skills-source-of-truth.mdc`
