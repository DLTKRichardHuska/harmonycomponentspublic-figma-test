---
name: conversion-agent
description: "Harmony conversion agent: converter readiness, conversion status, planning, verification, and execution in Cursor. Use for: 'is the react+mui converter ready', 'is Button converted', 'converter vs conversion status', 'verify demo site', or /conversion-agent."
disable-model-invocation: false
---

# Conversion agent

Orchestrate the **human-in-the-loop** conversion workflow in Cursor. Route to **converter playbooks** (`converters/<id>/playbook/`) and **conversion output** (`conversions/<id>/`).

Read [CONVERTER_VS_CONVERSION.md](../harmony-conversion/reference/CONVERTER_VS_CONVERSION.md), [CONVERSION_WORKFLOW.md](../harmony-conversion/reference/CONVERSION_WORKFLOW.md), and [TARGET_READINESS.md](../harmony-conversion/reference/TARGET_READINESS.md).

## Three parts

1. **Reference** — `src/data/component-catalog.ts`, `src/data/navigation.ts`, Astro source (source of truth)
2. **Converters** — `converters/<id>/playbook/` (expert agents per target)
3. **Conversions** — `conversions/<id>/` (output + `conversion.manifest.json`)

**No duplicate registries.** Discover converters by scanning `converters/*/converter.manifest.json`.

## Intent disambiguation (mandatory)

| User asks about | Mode | Aliases | Response header |
|-----------------|------|---------|-----------------|
| **Converter** — playbooks, "ready to use" | `readiness` | `converter`, `implementation` | `## Converter readiness: <id>` |
| **Conversion** — synced, converted, gaps, demo | `status` | `conversion-status`, `sync-status` | `## Conversion status: <id>` |

**Hard rules:**
1. If `readiness.level` is not `ready`, say **No — the converter is not ready**.
2. Never read conversion `elements` for converter questions or `readiness.level` for conversion questions.
3. **Reference is discovery** — read catalog, nav, and `.astro` source; do not rely on generated inventory JSON.
4. **No npm for conversion** — you run helpers via Shell; never instruct the user to run npm for conversion workflow.

## Modes

| Mode | Trigger examples | Writable? |
|------|------------------|-----------|
| **readiness** | "converter ready" | **No** |
| **status** | "is Button converted?" | **No** |
| **plan** | "plan updating react+mui" | Plan files only |
| **execute** | "go ahead", "execute the plan" | Yes (conversion output) |
| **verify-only** | "verify demo site" | Reports only |
| **guided** | "convert to react-mui" | Per phase |
| **tweak** | "fix Button spacing in react+mui" | Yes (narrow scope) |

## Mode: readiness (readonly)

**Scope fence:** Answer *converter agent capability* only. Do **not** open `conversions/<id>/conversion.manifest.json`, do **not** report element sync tables, and do **not** describe `conversions/<id>/` as "output state" or "what's converted". If the playbook lists verify-harness work under `conversions/<id>/`, cite it as a **converter dev task location** — not conversion status. See [CONVERTER_VS_CONVERSION.md](../harmony-conversion/reference/CONVERTER_VS_CONVERSION.md) § Scope fence.

1. Load [TARGET_READINESS.md](../harmony-conversion/reference/TARGET_READINESS.md).
2. Discover converter id(s) from `converters/*/converter.manifest.json`.
3. Run via Shell: `node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>`
4. Read **only under `converters/<id>/`:** `converter.manifest.json`, `playbook/SKILL.md` (**Converter readiness**), `playbook/VERIFICATION.md`, `playbook/VERIFIER.md`.
5. Output **`## Converter readiness: <id>`** using [TARGET_READINESS.md](../harmony-conversion/reference/TARGET_READINESS.md) format (capability matrix + playbook audit — no sync table).

## Mode: status (readonly)

**Reference discovery:**
1. [`src/data/navigation.ts`](../../src/data/navigation.ts) — doc routes
2. [`src/data/component-catalog.ts`](../../src/data/component-catalog.ts) — exported elements
3. Reference `.astro` and doc pages for scope

**Conversion discovery:**
1. `conversions/<id>/conversion.manifest.json` — all element status, strategy, gaps
2. `conversions/<id>/src/` — theme, components, demo modules
3. List `src/demo/converted/` for implemented demo pages

**Compare** reference vs conversion per element. Seed missing manifest keys from catalog on first sweep.

Run via Shell: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion <id> --seed --write`

Output **`## Conversion status: <id>`** leading with version and coverage:

```
Reference: v<semver> (current)
Conversion target: v<referenceVersion> | Coverage: <percent>% (<completed>/<total>)
```

Then element table and gaps.

### External targets (e.g. figma) — status from the host

External converters have **no** `conversions/<id>/` folder and **no** `conversion.manifest.json`. Do not look for one.

1. Read `converters/<id>/external.config.json` for host bindings (figma: product→`fileKey`).
2. Per-element state lives **in the host**. For figma, read each bound file's `harmony`/`conversionState` shared plugin data via the converter playbook (Figma MCP, readonly) to get `referenceVersion` + statuses; report per product file.
3. A product with no `fileKey` is **unbound**, not "not converted".
4. External statuses: `not-started → in-progress → review → needs-publish → synced` (+ `gap`). `review` = verifier PASS; `needs-publish` = publish-ready, waiting for human library publish; Code Connect only after publish, then human sign-off → `synced`. Coverage counts only `synced` (+ accepted `gap`).

## Mode: plan (plan files only)

1. Perform status steps for scope.
2. **Hard-dependency plan gate (mandatory — before strategy AskQuestion):**
   1. Inventory catalog dependencies from reference `.astro` imports and doc page examples (plus any `compositeEquivalents[].dependsOn` / prior `blockedBy`). For **figma**, also inventory from **shadcn** source imports + `docs/components/<Name>.md`.
   2. Check each dependency’s status:
      - **Component-library:** `conversion.manifest.json`
      - **External (figma):** host `harmony`/`conversionState` via playbook (readonly MCP) — **not** a repo manifest
   3. **If any required dependency is not `synced`:**
      - Output a short **Blocked** response: requested element, `blockedBy` list, each dep’s status.
      - For figma: write `blockedBy` into host state when touching state is allowed in the session; still **do not** write `plans/<dependent>.md`.
      - **Do not** write `plans/<dependent>.md`.
      - **Do not** AskQuestion for element strategy, prop skips, or composites on the dependent.
      - **AskQuestion only:** whether to plan the blocking dependency next (or which blocker if several).
      - **Stop** plan mode for the dependent. Exception: documented circular dependency cycle only (see [CONVERSION_WORKFLOW.md](../harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Hard dependencies).
   4. **Forbidden offers** (never present as options when blocked):
      - Partial / text-only / “do some of X now” while a catalog dep is unsynced
      - Skip dependency / defer dependency / “convert X without Y”
      - `UnsupportedEquivalentCallout` or accepted gaps in place of converting the dependency
      - Joint execute of dependent + dep that marks the dependent completable before the dep is `synced`
3. **Only if the gate passes** — **AskQuestion — element strategy (mandatory):** choices come from the converter’s `elementStrategies.allowed` (e.g. react-mui: Existing / Custom / Skip; shadcn: Component / Skip; figma: `figma-component` / `figma-variable` / `skip`). Cannot write plan without answers.
4. If strategy needs prop/composite mapping (e.g. react-mui `existing-mui`): **AskQuestion** for prop mappings, skipped props, and composite equivalents (user sign-off required). Non-dependency feature skips only — never catalog dependencies.
5. **AskQuestion — Consumer API (mandatory for package exports):** when the element (or a custom sub-export) ships a **package export** — react-mui `custom` / custom sub-exports; shadcn `component` — present a **Consumer API packet** per [CONVERSION_WORKFLOW.md](../harmony-conversion/reference/CONVERSION_WORKFLOW.md) § Consumer public API and the converter playbook. **Skip** for pure `existing-mui` theme-only and for `skip`. Wait for sign-off. On version/resync updates, re-present the packet only for the **delta** (introduced/changed consumer surface). Cannot write an approval-ready plan without answers.
6. **AskQuestion — Figma strategy packet (mandatory for `figma-component` / `figma-variable`):** present the playbook **strategy packet** — full Consumer API → Figma property inventory (including HTML `state`), axis plan, deferred props, token/wiring decisions, update-in-place `nodeId`, and **Token / efficiency forecast** (grid/payload/loop/deps risks + mitigations; prefer Shell `converters/figma/scripts/estimate-apply-cost.mjs`). Parallel to Consumer API for package exports. Wait for sign-off. **Refuse apply** if the forecast section is missing. See `converters/figma/playbook/SKILL.md`.
7. Write plan file (`status: draft`):
   - Component-library: `conversions/<id>/plans/<scope>.md`
   - Figma: `converters/figma/playbook/plans/<scope>.md`
   Include Element strategy, Prop mappings / Figma inventory, Skipped/deferred props, Composite equivalents (when applicable), **Consumer API** or **Figma strategy packet (user confirmed)** including **Token / efficiency forecast**, and Blocking dependencies (empty or all deps already `synced`).
8. Wait for approval.

## Mode: execute (after approval)

**Gate:** explicit approval + converter readiness for scope. **Re-run the hard-dependency gate before apply** (same inventory + stop/redirect rules as plan mode). Plan approval is **not** permission to skip or defer catalog dependencies.

**Before coding each scope:** confirm manifest records all equivalence decisions (`strategy`, `gaps`, `userDecision` including approved Consumer API for package exports). Skipped features → `UnsupportedEquivalentCallout` in demo; do not implement silently. Never use callouts to stand in for unsynced catalog dependencies. Do **not** build or change a package export’s public surface without prior Consumer API AskQuestion sign-off (initial or delta).

1. Delegate apply to `converters/<id>/playbook/SKILL.md` (including **version bump** when reference semver changed — see playbook Step 0).
2. Update conversion `src/`, demo modules, and `conversion.manifest.json`.
3. Verify via target verifier + `playbook/VERIFICATION.md` per [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md).
4. **Good enough:** converter playbook + **human** decide acceptance — see [FIDELITY_PRINCIPLES.md](../harmony-conversion/reference/FIDELITY_PRINCIPLES.md) § Who decides "good enough". **AskQuestion** before `synced`: visual match acceptable? Update element `status` to `synced` only after human confirms (or explicit user instruction to sync on verifier PASS).
5. After any element status change, run: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion <id> --write`

### No silent purity exceptions (mandatory)

Before remediating or applying a change that bends or breaks a **hard playbook rule** (examples purity, no wrappers, no fidelity `sx`/`style`/`className`, no invented MUI props, no thin wrappers, no dependency callouts-as-sync, static pseudo-state staging classes, etc.):

1. **AskQuestion** and **wait for explicit user approval** — do not ship the exception first.
2. **Verifier FAIL does not authorize a purity violation.** Prefer theme overrides for documented MUI APIs, omit docs-only static hover/focus columns (no callout for presentation), or AskQuestion for custom/skip of **functional** features — not Astro-style docs staging classes. `UnsupportedEquivalentCallout` is for skipped component functionality only.
3. Approving an execute plan is **not** blanket permission to violate purity while remediating defects.
4. If prior `userDecision` / `gaps[]` already skipped a feature, do **not** reintroduce it without AskQuestion reversing that decision.
5. Record any approved exception in manifest `userDecision` + `gaps[]` **before** implementing.
6. **Fidelity sx trap (react-mui):** do **not** “fix” a missing Harmony→MUI mapping by adding example `sx`/`style`/`className` that only exists to look like the Harmony prop (alignment, header tint, grip, etc.). That is a hard-rule break — **AskQuestion** skip|custom (or theme a **documented** MUI API). Neutral layout `sx` does not cover this case; see converter playbook § Neutral layout sx vs fidelity sx.

### External targets (e.g. figma) — execute notes

For external converters, apply writes to the **host**, not `conversions/<id>/src/`, and status updates write to **host state** (figma: `harmony`/`conversionState` + coversheet), not a `conversion.manifest.json`. Delegate entirely to the converter playbook. For figma specifically:

- **Hard-dep gate:** re-check deps in **host** `conversionState` before apply (same stop/redirect rules as plan).
- **Strategy packet:** do not apply until the user signed off the Figma strategy packet (inventory, `state`, axes, deferred, **Token / efficiency forecast**). Forecast missing → refuse apply.
- **Token-efficient MCP:** follow `converters/figma/playbook/SKILL.md` § Token-efficient Figma MCP (parent owns writes, curl-only screenshots, compact inspect, one-pass, Node prep for repetitive work).
- **Update-in-place (hard):** edit the existing component set at `elements.<Key>.nodeId`; **never** delete/recreate masters (breaks instances and Code Connect keys). Major redos reset status to `not-started` but **keep** `nodeId`.
- **Implementor ↔ verifier loop:** apply → figma-verifier → remediate **until verifier PASS**, then hand to human for review/tweak. Do not mark `review` / `needs-publish` / `synced` while FAIL. Visual baseline = **shadcn demo** (not Astro).
- **PASS → `review` handoff:** include side-by-side visual summary **and Token retrospective** (forecast vs actual, inefficient moments, kept efficient, follow-ups). Qualitative only — no fabricated token counts. Handoff without retrospective is incomplete.
- **Account gate:** `create_new_file` MUST use the Deltek org `planKey` from `external.config.json`; refuse the personal starter team.
- **File model:** one file per product; author the **VP canonical** first, then derive PPM/Maconomy (brand/hue) and CP (superset) by duplication.
- **Code Connect** to the shadcn per-product package is gated on (a) the shadcn counterpart being `synced` and (b) a **human publishing the Figma library** (Plugin API cannot publish).
- **Version bump** runs the playbook's superset re-check + status reset in host state.

### Execute loop (apply → verify → remediate)

**Component-library:** repeat until human accepts scope or loop is blocked:

1. **Apply** — playbook apply steps for scope
2. **Verify** — invoke converter verifier agent; capture scripts produce **evidence** only; agent **recommends** PASS/FAIL per [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md)
3. **Present** — side-by-side **visual summary** for human (what matches, what differs — not defect counts alone); **AskQuestion**: visual match acceptable? (remediate / accept gap / reject) on FAIL, PASS with accepted/deferred items, or before sync
4. **Remediate** — when human wants fixes, per `playbook/VERIFICATION.md` — subject to **No silent purity exceptions** above
5. Re-verify after remediate; repeat until human accepts good enough

**Figma:** implementor ↔ verifier until **PASS**, then human:

1. **Apply** — playbook apply **in place** (Token-efficient MCP defaults)
2. **Verify** — figma-verifier (shadcn reference + Figma screenshot URL + curl)
3. On FAIL → **Remediate** in place → re-verify (agent loop; do not ask human to accept FAIL to exit)
4. On PASS → mark `review` → handoff with **visual summary + Token retrospective** → human tweak → `needs-publish` → publish → Code Connect → AskQuestion → `synced`

## Mode: verify-only

1. Resolve converter id (default `harmony-design-system-react-mui`).
2. Invoke verifier via **conversion-fidelity-verifier** router (loads [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md)).
3. Report PASS/FAIL and defect report path with **side-by-side visual summary** — **AskQuestion** before treating verifier PASS as user acceptance.

## Mode: tweak

Human-directed one-off changes to conversion output (no full plan). Read scope, apply minimal diff, update manifest if status changes, verify if requested.

## Scope

`foundation`, `shell`, `components`, `<ComponentName>`, or `all`. Use **AskQuestion** if omitted in plan/execute.

## Delegation

| Step | Delegate to |
|------|-------------|
| Converter readiness | TARGET_READINESS.md + converter playbook |
| Conversion status | Reference catalog/nav + `conversion.manifest.json` + conversion `src/` |
| Apply / sync | `converters/<id>/playbook/SKILL.md` |
| Fidelity compare | Verifier agent → **conversion-verify** |
| Remediate | Converter `playbook/VERIFICATION.md` |
| Structure check | `validate_converter.mjs` / `validate_conversion.mjs` / `compute_coverage.mjs` via Shell |
| Portfolio status/plan | **conversion-management** skill |

## Output checklist

- **readiness:** `## Converter readiness` + matrix + dev tasks
- **status:** `## Conversion status` + referenceVersion + coverage + table + next action
- **plan:** plan path + "approve to execute" — or **Blocked** + redirect to plan the dependency (no dependent plan file)
- **execute:** PASS/FAIL + report path
- **verify-only:** defect summary + report path
