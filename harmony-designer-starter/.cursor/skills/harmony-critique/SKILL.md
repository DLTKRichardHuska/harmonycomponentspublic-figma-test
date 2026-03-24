---
name: harmony-critique
description: "Critique design or implementation against Harmony patterns, accessibility, and UX. Works with MUI or shadcn implementations that have the Harmony theme applied."
disable-model-invocation: true
---

# /harmony-critique

Critique design or implementation against Harmony patterns (components, accessibility, and UX). Works with **MUI or shadcn** implementations that have the Harmony theme applied via the mapping playbook.

## Instructions

Use both the **harmony-usage-rules** skill for component and accessibility rules, and the **harmony-ux-principles** skill for cognitive load, progressive disclosure, and usability checks.

1. Load the harmony-usage-rules skill and apply component usage, layout, and accessibility rules to the target file or design.
2. Load the harmony-ux-principles skill and apply the UX checklist (interactive element count, cross-reference friction, entry point, system status, error-prone flows, user frequency).
3. Produce a concise critique with specific findings and recommendations tied to both rule sets.

## Integration kit context

- The host app uses **MUI or shadcn** components — not Harmony React components.
- Evaluate whether the implementation correctly uses Harmony design tokens (spacing, colors, typography, elevation) through the host framework's theme.
- Use `reference-components/` as read-only spec to understand expected Harmony component behavior when mapping to host equivalents.
- Flag cases where the host framework component diverges from expected Harmony behavior (e.g. missing states, wrong token usage, accessibility gaps).
