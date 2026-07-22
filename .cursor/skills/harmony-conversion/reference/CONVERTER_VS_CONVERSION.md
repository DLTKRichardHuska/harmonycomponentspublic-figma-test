# Three-part conversion model

Canonical vocabulary for Harmony cross-framework work. Agents must use these terms consistently.

## The three parts

| Part | Path | Role |
|------|------|------|
| **1. Reference** | Repo root `src/`, `src/data/`, `.cursor/skills/harmony*` | Source of truth — Astro Harmony DS, catalog, nav, docs site |
| **2. Converters** | `converters/<id>/` | Expert **agents** per target — playbooks, readiness, verify instructions |
| **3. Conversions** | `conversions/<id>/` or external host | **Output** — converted code, demo app, sync state |

```text
Reference (truth)  →  Converter agent (how)  →  Conversion (result)
        ↑___________________________________|
              agent compares & plans gaps
```

**No duplicate registries.** Agents discover reference structure by reading `src/data/navigation.ts`, `src/data/component-catalog.ts`, and reference source. Conversion state lives in one file: `conversion.manifest.json`.

## Converter vs conversion

| Term | Meaning | Question it answers |
|------|---------|---------------------|
| **Converter** | Target expert agent — playbooks + readiness | Can this agent convert, verify, and remediate for this target? |
| **Conversion** | Output of converter work — code + manifest | What has been converted? What gaps vs reference? |

**Converter readiness comes first.** Do not recommend conversion plan/execute until the converter is `ready`.

## Paths

| Concept | Root | Manifest |
|---------|------|----------|
| Converter | `converters/<id>/` | `converter.manifest.json` — **`readiness.level` only** |
| Conversion | `conversions/<id>/` | `conversion.manifest.json` — **all element sync state** |

Discover converters by scanning `converters/*/converter.manifest.json` (no registry JSON).

### Converter (`converters/<id>/`)

- `playbook/SKILL.md` — apply, plan, status, remediate (the converter agent)
- `playbook/VERIFICATION.md` — verify + remediate loop
- `playbook/VERIFIER.md` — automated verify agent playbook
- `scripts/` — minimal target automation only (e.g. token copy)
- `converter.manifest.json` — readiness, playbook paths, output link

Component-library converters link to output via `conversion.outputId` and `conversion.outputPath`.

External converters (e.g. Figma) have **no** `conversions/` sibling — output **and per-element sync state** live in the external host via MCP. For the `figma` converter, sync state is stored inside the bound Figma file (shared plugin data `harmony`/`conversionState` + a coversheet page); the repo keeps only product→`fileKey` bindings in `converters/figma/external.config.json`. Do not expect a `conversion.manifest.json` for external targets. External element statuses: `not-started → in-progress → review → needs-publish → synced` (+ `gap`). `review` = verifier PASS; `needs-publish` = publishable and waiting for human library publish; Code Connect runs only after publish, then human sign-off → `synced`.

### Conversion (`conversions/<id>/`)

- `src/`, `package.json`, demo pages — runnable project output
- `conversion.manifest.json` — per-element status, strategy, gaps, deliverables
- `verification/artifacts/`, `verification/reports/`
- `plans/` — execution plans (draft/approved)

**1:1 pairing:** same id for component-library pairs (e.g. `harmony-design-system-react-mui`).

## Agent modes

| User asks about | conversion-agent mode | Aliases |
|-----------------|----------------------|---------|
| Converter readiness | `readiness` | `converter`, `implementation` |
| Conversion status | `status` | `conversion-status`, `sync-status` |

### Response headers

- Converter: `## Converter readiness: <id>`
- Conversion: `## Conversion status: <id>`

Never use "ready" for a converter unless `readiness.level === ready`.

## Hard rules

1. **Not ready means not ready** — if `readiness.level` is not `ready`, answer **No — the converter is not ready** and list completion tasks.
2. **Do not conflate manifests** — never read conversion `elements` for converter questions or `readiness.level` for conversion questions.
3. **Reference is discovery** — read catalog + nav + `.astro` source; do not maintain parallel inventory JSON.
4. **Ambiguous queries** — "ready", "status of react+mui" → **AskQuestion**: converter readiness vs conversion status.
5. **Cursor only for conversion** — readiness, status, plan, execute, verify, remediate run **only in Cursor** via `/conversion-agent`. Never instruct the user to run npm for conversion.

## npm (what it is and is not)

| npm | Role | Who runs it |
|-----|------|-------------|
| Root repo conversion npm scripts | **None** — not part of conversion | — |
| Node scripts under `.cursor/skills/.../scripts/` and `converters/<id>/scripts/` | Agent-internal helpers | **Agents only** via Shell |
| `conversions/<id>/package.json` (`dev`, `build:lib`, `npm publish`) | Output project runtime + GitHub Packages | Agents during verify capture; consumers install matching Harmony version from GitHub Packages |
| Astro `npm run dev` | Reference preview for capture | Agents during verify capture |

Conversion is **not** part of npm build, CI, or documented CLI workflows.

## Lifecycle

1. `/create-converter` → scaffold `converters/<id>/` + `conversions/<id>/` (component-library) or converter only (external)
2. Build converter playbooks → `/conversion-agent converter <id>` until `readiness.level: ready`
3. Run conversion → `/conversion-agent` status, plan, execute against `conversions/<id>/`

## Disambiguation keywords

| Route to **converter readiness** | Route to **conversion status** |
|----------------------------------|--------------------------------|
| converter, skills, playbooks, tooling, implementation | converted, synced, gaps, what's done |
| ready to use, can it convert/verify/remediate | demo app status, needs updating, match reference |
| is the converter ready | is Button converted, conversion status |

## Scope fence (agents)

Same id under `converters/` and `conversions/` does **not** merge the two questions.

### Converter readiness — allowed sources

- `converters/<id>/converter.manifest.json` → `readiness.level`, `readiness.summary`
- `converters/<id>/playbook/SKILL.md` → **Converter readiness** section, apply steps
- `converters/<id>/playbook/VERIFICATION.md`, `VERIFIER.md`
- `converters/<id>/scripts/`
- `node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>`

### Converter readiness — forbidden for the answer

- `conversions/<id>/conversion.manifest.json` → `elements.*.status` (sync state)
- Per-element "converted / pending / gap" tables vs reference catalog
- Phrasing that describes **what has been synced** ("output reset", "placeholder scaffold", "Button not converted")

### Verify harness (exception)

Component-library converters need a **verify harness** in `conversions/<id>/` (capture URL, `CaptureView.tsx`, demo render path). That is **converter tooling**, not sync progress. In readiness answers:

- OK: "Verify harness missing: no `CaptureView` fixture for shell (converter dev task in `conversions/.../src/`)"
- Wrong: "Conversion output is a placeholder" / "nothing is synced"

### Conversion status — allowed sources

- Reference: `src/data/navigation.ts`, `component-catalog.ts`, `.astro` source
- `conversions/<id>/conversion.manifest.json`, `conversions/<id>/src/`, demo modules

Never cite `readiness.level` as evidence of sync progress.

## Related

- [TARGET_READINESS.md](TARGET_READINESS.md) — converter readiness audit
- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md) — Cursor-only workflow
- [ROUTING.md](ROUTING.md) — skill and path routing
