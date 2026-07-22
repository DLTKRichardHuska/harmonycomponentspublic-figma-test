# Manifest guide

Harmony splits metadata into two manifests:

| Manifest | Location | Tracks |
|----------|----------|--------|
| **Converter** | `converters/<id>/converter.manifest.json` | Readiness, playbooks, output path |
| **Conversion** | `conversions/<id>/conversion.manifest.json` | All element sync state, deliverables |

Discover converters by scanning `converters/*/converter.manifest.json` — no registry JSON.

**External converters (e.g. figma) have no conversion manifest.** Per-element sync state lives in the external host (for figma: Figma shared plugin data `harmony`/`conversionState` + a coversheet page), and the repo stores only product→`fileKey` bindings in `converters/<id>/external.config.json`. The `conversion.manifest.json` guidance below applies to **component-library** converters only. External element statuses: `not-started → in-progress → review → needs-publish → synced` (+ `gap`). `needs-publish` = verifier PASS and publish-ready; waiting for human library publish before Code Connect.

Validate via Shell (agents only):

```bash
node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>
node .cursor/skills/harmony-conversion/scripts/validate_conversion.mjs --conversion <id>
```

## Conversion manifest elements

Single `elements` object:

- **Foundation pages** — `Colors`, `Typography`, `Spacing`, `Elevations`, `Dela` (from Foundation nav; one status each). Same fields as other elements; `harmonySource` points at `src/pages/foundation/<slug>.astro`. Do **not** use a single `foundation` key.
- **`<ElementId>`** — per catalog element (e.g. `Button`, `ShellLayout`) with:
  - `status`, `harmonySource`
  - `strategy`: **converter-specific** string (or `null`). Allowed values come from the linked converter’s `elementStrategies.allowed` in `converters/<id>/converter.manifest.json` — **not** a global enum.
    - Examples (do not mix across targets):
      - react-mui: `existing-mui` | `custom` | `skip` (`theme-only` deprecated; `thin-wrapper` forbidden)
      - shadcn: `component` | `skip` (always ships package components; approach detail in `userDecision` / plan)
      - figma (external): `figma-component` | `figma-variable` | `skip` (when host sync state is modeled)
  - `recommendedTarget`, `targetCandidates`, `gaps`, `userDecision`, `notes`
  - `blockedBy`: catalog element keys blocking this element (structured array)
  - `propMappings`: `{ harmony, mui, notes? }[]` — Harmony prop → target equivalent (field name `mui` is historical; used heavily by react-mui)
  - `compositeEquivalents`: `{ harmonyFeature, composition, dependsOn: string[] }[]` — demo-only composition patterns
  - `skippedProps`: Harmony props with no equivalent, user accepted skip

`independence.layout` (component-library): omit or `single-package` (default); use `npm-workspace` with optional `packagePath` / `demoPath` when the demo consumes the library by package name.

### Converter `elementStrategies`

Required for **component-library** converters. Declares `allowed`, optional `deprecated` / `forbidden` / `descriptions`. `validate_conversion.mjs` enforces that each `elements.*.strategy` matches the linked converter’s policy.

`userDecision` — human sign-off for element strategy, prop mappings, composite equivalents, accepted gaps, **Consumer public API** (for package exports), or release boundary (converter + human, not global default). Prefer **prose in `userDecision` + the plan file** for the approved Consumer API packet (base/analog, inherited props/events, Harmony-specific props, omissions). No separate manifest schema field is required.

**Consumer API (package exports):** react-mui `custom` / custom sub-exports and shadcn `component` must record Consumer API sign-off before apply. Theme-only `existing-mui` and `skip` do not. On version/resync, record only the **delta** when the public surface changes. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md) § Consumer public API.

**Per-feature skips:** record in `skippedProps[]` and `gaps[]` (e.g. `"Button size xs — no native MUI size equivalent; skipped"`). Skipped demo sections use `UnsupportedEquivalentCallout` — verifier excludes them from FAIL when `userDecision` is set.

**Composite equivalents:** demo-only — show inline target-framework JSX in example demonstrations; structural composition of target components with props only — never package exports, file-local helpers, MUI-primitive wrappers, or fidelity styling on composed nodes.

Agents seed missing element keys from `src/data/component-catalog.ts` during status sweeps.

## Version and coverage

| Field | Meaning |
|-------|---------|
| `referenceVersion` | Repo release-train label — must match `package.json.version` for component-library conversions |
| `referenceVersionSetAt` | Optional ISO timestamp when `referenceVersion` was last set |
| `coverage` | `{ percent, completed, total, computedAt }` — share of coverage elements verified for that version |

Sync versions: `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --conversion <id>` (or `--all`).

See [COVERAGE.md](COVERAGE.md) and [RELEASE_READINESS.md](RELEASE_READINESS.md). Recompute coverage via Shell:

```bash
node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion <id> --write
```

**Version bump (execute mode):** when `referenceVersion` changes, engineering agent resets all element statuses to `not-started`, clears stale `userDecision`, sets coverage to 0%, then re-assesses. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

Schema: [`conversions/schema/conversion.manifest.schema.json`](../../../../conversions/schema/conversion.manifest.schema.json)

## Converter manifest

Tracks **readiness only** — not conversion sync state.

See [`converters/schema/converter.manifest.schema.json`](../../../../converters/schema/converter.manifest.schema.json).
