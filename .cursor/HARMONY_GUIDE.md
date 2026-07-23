# Harmony guide (Cursor)

Quick reference for Cursor slash commands and skills in the **Harmony Design System (Astro)** repo.

---

## Three parts

1. **Reference** — Astro Harmony DS (`src/`, catalog, nav) — source of truth
2. **Converters** — expert agents per target (`converters/<id>/playbook/`)
3. **Conversions** — output projects (`conversions/<id>/`)

---

## Slash commands

| Command | What it does |
|--------|----------------|
| **/conversion-management** | Portfolio status, multi-conversion plans, coordinated execution |
| **/conversion-agent** | Single-target readiness, status, plan, execute, verify, tweak |
| **/create-converter** | Scaffold converter (+ conversion for component-library) |
| **/create-pattern** | Create a design pattern doc |
| **/search-patterns** | Search design-patterns registry |
| `/harmony-critique` | Critique against Harmony usage rules |
| **/ux-review** | Standalone UX review |

### Converter vs conversion

| You ask about | Agent mode | Example |
|---------------|------------|---------|
| **Converter** — agent ready? | `readiness` | "Is the react+mui converter ready?" → answer from `converters/<id>/` only |
| **Conversion** — what's done? | `status` | "Is Button converted to react+mui?" → `referenceVersion` + `coverage` from `conversions/<id>/` |
| **All conversions** — portfolio view | `portfolio-status` via **conversion-management** | "Status of all conversions" |

**Conversion runs only in Cursor** — no npm commands for conversion workflow.

---

## Skills

| Skill | Purpose |
|-------|---------|
| **harmony-conversion** | Hub: three-part model, paths, version/coverage |
| **conversion-management** | Portfolio orchestrator across all conversions |
| **conversion-agent** | Single-target orchestrator |
| **create-converter** | Scaffold new converter |
| **conversion-verify** | Agent-internal designer fidelity + optional evidence scripts |

Converter playbooks: `converters/<id>/playbook/SKILL.md`

---

## Repo layout

| Path | Role |
|------|------|
| `src/data/component-catalog.ts` | Reference element inventory |
| `src/data/navigation.ts` | Reference demo nav |
| `converters/` | Converter agents |
| `conversions/` | Conversion output (`referenceVersion`, `coverage` in manifest) |
| `plans/conversion-portfolio/` | Multi-conversion plans |

---

## Theme and mode

Themes: `theme-cp`, `theme-vp`, `theme-ppm`, `theme-maconomy` on `<html>`. Dark mode: class `dark`.
