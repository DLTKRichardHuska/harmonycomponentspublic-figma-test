# Integration Kit — archive manifest

## Status at time of archival

This kit was **experimental / incomplete** in the Harmony monorepo. Skills and agents reference documentation that was **not present** at the repo root:

| Referenced doc | Status in monorepo |
|----------------|---------------------|
| `docs/MAPPING_PLAYBOOK.md` | Not shipped |
| `docs/harmony-source-inventory.md` | Not shipped |
| `docs/COMPONENT_MANIFEST.md` | Not shipped |
| `docs/PINNED_SOURCES.md` | Not shipped |
| `docs/GENERATE_INVENTORY.md` | Not shipped |
| `HARMONY_INTEGRATION_HANDBOOK.md` | Not shipped |

Before using this kit in a customer repo, create or supply those docs, or update skill/agent paths to match your integration project layout.

## Skills archived

- `harmony-integration` — hub for 8-pass MUI/shadcn mapping workflow
- `build-all-patterns` — batch pattern page builder with layout + fidelity verification
- `build-layout` — single-page layout playbook
- `layout-builder` — composition constraints (MUI/shadcn host)

## Agents archived

- `harmony-completeness.md` — audit inventory and manifest completeness
- `harmony-implement.md` — apply one mapping playbook pass
- `harmony-verifier.md` — integration deviation list (MUI/shadcn; **not** the Astro structural verifier)

## Rules archived

- `integration-source-first.mdc` — read pinned Harmony CSS/JSON before theming

## Removed from active repo

These assets were moved out of the root `.cursor/` during the refactor so the live design-system workspace focuses on the Astro pattern library only.
