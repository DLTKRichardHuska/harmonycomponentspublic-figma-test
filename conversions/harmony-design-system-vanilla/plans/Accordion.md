# Conversion plan — Accordion

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Accordion` |
| status | `completed` |
| createdAt | `2026-09-11T19:15:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship Accordion as **web-components** `<harmony-accordion>` + `<harmony-accordion-item>` with open Shadow DOM. Chevron via `harmony-icon`. Nested items replace Astro `items[]` / named slots.

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Accordion | `web-component` | `harmony-accordion` + `harmony-accordion-item` |

## Approach & stack fit (user confirmed)

- Open Shadow DOM on both; adopt icon sheets as needed
- Single-open vs `allow-multiple`; disabled items
- Item default slot = panel body
- Forced-colors shadow-local
- No public `.accordion` document recipe

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Astro `items[]` + `item-0`…`item-9` | **Omit** — nested items + default slot |
| Public `.accordion` recipe | **Skip** — CE-only |
| Controlled open | **Include** — `open` on item + `toggle` event |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tags | `harmony-accordion`, `harmony-accordion-item` |
| Accordion attrs | `allow-multiple`; optional `label` |
| Item attrs | `title`; boolean `open`; boolean `disabled` |
| Events | `toggle` on item `{ open }` (bubbles/composed) |
| Slots | item **default** = panel body |
| Parts | `label`, `item`, `trigger`, `icon`, `panel` |
| A11y | button + `aria-expanded` + `aria-controls`; group labelling; forced-colors shadow-local |
| Docs | `docs/components/Accordion.md`, CEM, AGENTS, llms |

## Blocking dependencies

Icon is `synced`.

## Phases

### Phase 1 — Apply

- Shadow sheets + elements; CEM; register
- Demo `/components/accordion`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; remediate; human accept → `synced`
