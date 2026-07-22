# Harmony Integration Guide (Cursor)

Skills and slash-style playbooks for this kit. **All skills live under `.cursor/skills/`.**

## Slash playbooks (natural language or command)

| User says | Skill / Agent | Reference |
|-----------|---------------|-----------|
| "integrate Harmony" or "apply the Harmony theme" | `harmony-integration` skill (auto-detected) orchestrates `harmony-implement` subagent | [harmony-integration/SKILL.md](skills/harmony-integration/SKILL.md) |
| **`/build-layout`** or "build a settings page" | `build-layout` | [build-layout/SKILL.md](skills/build-layout/SKILL.md) |
| **`/build-all-patterns`** or "build all pattern pages" | `build-all-patterns` | [build-all-patterns/SKILL.md](skills/build-all-patterns/SKILL.md) |
| **`/create-pattern`** or "create pattern from component" | `create-pattern` | [create-pattern/SKILL.md](skills/create-pattern/SKILL.md) |
| **`/search-patterns`** or "find wizard pattern" | `search-patterns` | [search-patterns/SKILL.md](skills/search-patterns/SKILL.md) |
| **`/harmony-critique`** or "critique this page" | `harmony-critique` | [harmony-critique/SKILL.md](skills/harmony-critique/SKILL.md) |
| **`/ux-review`** or "review UX of this page" | `ux-review` | [ux-review/SKILL.md](skills/ux-review/SKILL.md) |

## Skills index

### Integration skills

| Folder | Purpose |
|--------|---------|
| **harmony-integration** | Hub: pinned paths, inventory, themes/modes, mapping playbook, orchestration workflow. Auto-detects existing app vs greenfield, delegates to subagents. |

### Page building skills

| Folder | Purpose |
|--------|---------|
| **build-layout** | Compose a page layout inside a Harmony-themed MUI/shadcn app. |
| **layout-builder** | Composition rules, layout patterns, spacing constraints for page building. |
| **design-patterns** | Pattern registry: 45 design patterns with anatomy, usage, and Component Tree. |
| **build-all-patterns** | Build all pattern pages with dual verification (layout + fidelity). |
| **create-pattern** | Generate a new pattern doc from a component. |
| **search-patterns** | Search the pattern registry by query, product, or category. |

### Review and critique skills

| Folder | Purpose |
|--------|---------|
| **harmony-critique** | Critique design/implementation against Harmony patterns, accessibility, and UX. |
| **harmony-usage-rules** | Harmony component usage rules, accessibility, do's and don'ts. |
| **harmony-ux-principles** | UX principles: cognitive load, progressive disclosure, entry points, system status. |
| **ux-review** | Standalone UX review (framework-agnostic). |

## Key docs

| Document | Purpose |
|----------|---------|
| [docs/MAPPING_PLAYBOOK.md](../docs/MAPPING_PLAYBOOK.md) | 8-pass workflow with per-category token checklists |
| [docs/COMPONENT_MANIFEST.md](../docs/COMPONENT_MANIFEST.md) | Row per reference-components component, host equivalents, mapping status |
| [docs/harmony-source-inventory.md](../docs/harmony-source-inventory.md) | Full token/component checklist, §12 mapping appendix |

## Rules

- **integration-source-first** — No implementation until inventory + pinned sources are read. Read MAPPING_PLAYBOOK.md before starting any pass.
- **skills-source-of-truth** — Edit skills only under `.cursor/skills/`.
- **layout-composition** — Spacing must use Harmony tokens; no Card-in-Card; page header first, button bar last.
- **pattern-fidelity-rule** — Every named item, component, label, and count from pattern markdown must appear exactly in built output.

## Agents

### Integration agents

| Agent | Role |
|-------|------|
| **harmony-implement** | Runs one playbook pass (1–8) at a time. Edits customer repo. |
| **harmony-completeness** | Read-only audit of inventory sections + component manifest. |
| **harmony-verifier** | Read-only final check. Deviation list until zero gaps. |

**Order:** implement (passes 1–8) → completeness → verifier. Loop on gaps.

### Page building agents

| Agent | Role |
|-------|------|
| **layout-verifier** | Read-only. Checks layout against composition constraints and pattern anatomy. |
| **pattern-fidelity-verifier** | Read-only. Compares built page to pattern markdown. Deviation list until zero. |

**Order:** build page → layout-verifier → pattern-fidelity-verifier. Fix deviations and re-verify (max 3 rounds).

## Parent handbook

[../HARMONY_INTEGRATION_HANDBOOK.md](../HARMONY_INTEGRATION_HANDBOOK.md)
