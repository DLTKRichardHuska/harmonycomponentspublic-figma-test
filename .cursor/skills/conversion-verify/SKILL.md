---
name: conversion-verify
description: "Agent-internal: routes to converter-owned QA verifier agents and shared designer fidelity principles. Not user-facing."
disable-model-invocation: true
---

# Conversion verify (agent routing)

Shared **thin layer** for conversion fidelity checks. **Agents only** — users coordinate via **conversion-agent**.

**Compare is never scripted.** Each converter owns a **QA verifier agent** that judges equivalence like a **Harmony designer**. See [FIDELITY_PRINCIPLES.md](../harmony-conversion/reference/FIDELITY_PRINCIPLES.md), [VISUAL_MATCH_GATE.md](reference/VISUAL_MATCH_GATE.md), and [DESIGNER_COMPARE.md](reference/DESIGNER_COMPARE.md).

## Your job (global)

1. Resolve **converter id** from user or conversion-agent context.
2. Invoke the **target-owned QA agent**: `.cursor/agents/<converter-id>-verifier.md` (or `converters/<id>/playbook/VERIFIER.md`).
3. Load [FIDELITY_PRINCIPLES.md](../harmony-conversion/reference/FIDELITY_PRINCIPLES.md), [VISUAL_MATCH_GATE.md](reference/VISUAL_MATCH_GATE.md), [DESIGNER_COMPARE.md](reference/DESIGNER_COMPARE.md), and [DEFECT_REPORT.md](../harmony-conversion/reference/DEFECT_REPORT.md).

**Do not** implement compare logic here. **Do not** PASS from source-only review without rendered evidence.

## Reference discovery (shared)

When any QA agent needs to know *what exists* in the reference design system:

- [`src/data/component-catalog.ts`](../../src/data/component-catalog.ts)
- [`src/data/navigation.ts`](../../src/data/navigation.ts)
- Harmony `.astro` source under `src/components/ui/`
- Doc pages under `src/pages/`

## Equivalence resolution (converter-owned)

**How to find the converted counterpart** for a reference element lives in:

`converters/<id>/playbook/VERIFIER.md`

Examples:

| Target | Equivalence model |
|--------|-------------------|
| `harmony-design-system-react-mui` | Demo routes, package exports, theme files — see target VERIFIER.md |
| `figma` | Figma file nodes via MCP — no URLs |

When output organization changes, the **engineer agent** updates `playbook/SKILL.md` and the **QA agent** updates `playbook/VERIFIER.md` together.

## Designer compare (mandatory)

All verifiers follow [VISUAL_MATCH_GATE.md](reference/VISUAL_MATCH_GATE.md) and [DESIGNER_COMPARE.md](reference/DESIGNER_COMPARE.md):

1. Mandatory rendered evidence (BLOCKED if missing)
2. Content inventory per scope
3. Visual matrix (rendered appearance — three columns; not JSON or CSS proxy equality)
4. Behavior and responsive checks
5. Stricter PASS bar + human confirmation before sync

Target-specific supplements:

| Target type | Also load |
|-------------|-----------|
| Browser demo | [COMPARE_HTML.md](reference/COMPARE_HTML.md) |
| Image host | [COMPARE_IMAGE.md](reference/COMPARE_IMAGE.md) |

## Judgment categories

Use categories from [FIDELITY_PRINCIPLES.md](../harmony-conversion/reference/FIDELITY_PRINCIPLES.md): `visual`, `behavior`, `tokens`, `structure`, `a11y`, `api`, `mapping`. Phrase defects as what **a designer would see**.

## Readiness rule

**Verify: yes** for a converter when its `playbook/VERIFIER.md` documents **designer compare procedure + equivalence** and a QA run has been proven for representative scopes with rendered evidence — not when a global script or route registry exists.

## Optional evidence scripts

Node scripts under `scripts/` may produce artifacts for agent judgment. They are **not** the verify path for converter readiness and **never** decide PASS/FAIL.

**Evidence only:** `audit-palette-swatches.mjs`, `audit-rendered-alignment.mjs`, `capture-html.mjs`.

**Forbidden as pass/fail gates:** ad-hoc probes under `conversions/<id>/verification/artifacts/diag/` — investigation only, not closure criteria.
