---
name: harmony-critique
description: "Critique design or implementation against Harmony patterns, accessibility, and UX. Works with Harmony Astro components, tokens, and docs pages."
disable-model-invocation: true
---

# /harmony-critique

Critique design or implementation against Harmony patterns (components, accessibility, and UX) in the **Astro reference design system**.

## Instructions

Use both the **harmony-usage-rules** skill for component and accessibility rules, and the **harmony-ux-principles** skill for cognitive load, progressive disclosure, and usability checks.

1. Load the harmony-usage-rules skill and apply component usage, layout, and accessibility rules to the target file or design.
2. Load the harmony-ux-principles skill and apply the UX checklist (interactive element count, cross-reference friction, entry point, system status, error-prone flows, user frequency).
3. Produce a concise critique with specific findings and recommendations tied to both rule sets.

## Astro reference context

- Evaluate Harmony Astro components in `src/components/ui/` and preview/doc pages in `src/pages/`.
- Check token usage against `src/styles/tokens.css` and component CSS in `src/styles/components.css`.
- Compare against pattern anatomy in `.cursor/skills/design-patterns/reference/` when relevant.
- Flag missing states, wrong token usage, accessibility gaps, or deviations from documented props.
