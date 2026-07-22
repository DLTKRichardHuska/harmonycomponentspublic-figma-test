---
name: conversion-management
description: "Harmony conversion management agent: portfolio status, multi-conversion planning, and coordinated execution across all conversion targets. Use for: 'status of all conversions', 'plan updating all conversions', 'begin conversion process', 'how far behind reference', or /conversion-management."
disable-model-invocation: false
---

# Conversion management agent

Portfolio orchestrator for Harmony conversions. Coordinates **engineering agents** (`converters/<id>/playbook/SKILL.md`) and **QA agents** (`playbook/VERIFIER.md`) across all conversion targets.

Read [CONVERTER_VS_CONVERSION.md](../harmony-conversion/reference/CONVERTER_VS_CONVERSION.md), [COVERAGE.md](../harmony-conversion/reference/COVERAGE.md), [PORTFOLIO_PLAN.md](../harmony-conversion/reference/PORTFOLIO_PLAN.md), and [CONVERSION_WORKFLOW.md](../harmony-conversion/reference/CONVERSION_WORKFLOW.md).

**Single-target work** delegates to **conversion-agent**. This skill handles **multi-conversion** status, planning, and coordinated execution.

## Intended workflow

1. Designers work on reference Harmony DS and demo UI until satisfied.
2. User asks conversion-management to **begin the conversion process**.
3. Management agent gathers per-conversion engineering + QA plans.
4. User reviews portfolio status and aggregated plan; approves all or piecemeal execution.
5. Management coordinates conversion-agent execute per approved slice; **reassess** after piecemeal work.

## Modes

| Mode | Trigger examples | Writable? | Response header |
|------|------------------|-----------|-----------------|
| **portfolio-status** | "status of all conversions", "how far behind reference" | No | `## Conversion portfolio status` |
| **portfolio-plan** | "plan updating all conversions", "begin conversion process" | Plan files only | `## Conversion portfolio plan` |
| **portfolio-execute** | "execute the whole plan", "update react+mui foundation" | Delegates to conversion-agent | Per-target execute reports |
| **reassess** | "reassess conversions", after piecemeal work | No | `## Conversion portfolio status` |
| **release-status** / **ready-to-release** | "is it ready to release?", "can we ship?" | No | `## Release readiness` |
| **release-blockers** | "what blocks release?" | No | `## Release blockers` |
| **release-instructions** | "how do I create the release?" | No | `## Release instructions` |
| **post-release-status** | "external conversions after release" | No | `## Post-release external conversions` |

Read [RELEASE_READINESS.md](../harmony-conversion/reference/RELEASE_READINESS.md) for release gate scripts and human release steps.

## Mode: portfolio-status (readonly)

1. Read current repo effective version via `scripts/lib/version.js` (`getRepoEffectiveVersion` / `getEffectiveVersion`) — e.g. `0.9.0-in-progress` on `main`.
2. Discover conversions: `node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --all --seed --write` (or `--write` only if elements already seeded).
3. For each conversion id from `listConversionIds()`:
   - Read `conversions/<id>/conversion.manifest.json` — `referenceVersion`, `coverage`
   - Read `conversions/<id>/package.json` — `version` (must match `referenceVersion`)
   - Read linked `converters/<id>/converter.manifest.json` — `readiness.level` only (not as sync proxy)
4. Present table:

| Conversion | Package version | referenceVersion | Coverage | In sync? | Converter ready? |
|------------|-----------------|------------------|----------|----------|------------------|

- **In sync:** `package.json.version === referenceVersion ===` repo effective version (or accepted release version during release prep).
- **Behind / not ready for release:** version drift, coverage &lt; 100% without accepted gaps, or converter not `ready`.
- **External converters** (no `conversions/<id>/`): report converter readiness only; note "portfolio coverage N/A — post-release update".

Flag next recommended action (plan, execute scope, release-status, or wait for converter readiness).

## Mode: portfolio-plan (plan files only)

1. Run portfolio-status steps.
2. **AskQuestion** if reference has unreleased edits on `main` — confirm target semver and whether to treat as same-version delta vs new release.
3. For each conversion where converter `readiness.level === ready`:
   - Delegate **readonly plan** to engineering agent (`playbook/SKILL.md` plan section) — foundation, shell, components, demo UI
   - Delegate **readonly assessment** to QA agent (`VERIFIER.md`) — gap list vs reference
4. Write per-conversion draft plans under `conversions/<id>/plans/<scope>.md` when missing.
5. Aggregate into `plans/conversion-portfolio/<referenceVersion>-<date>.md` per [PORTFOLIO_PLAN.md](../harmony-conversion/reference/PORTFOLIO_PLAN.md).
6. **AskQuestion:** execute all | one conversion | one scope | revise plan.

Do not modify conversion source or manifest element statuses in plan mode.

## Mode: portfolio-execute

**Gate:** approved portfolio plan OR explicit user scope command.

1. Resolve execution slice (all conversions, one conversion, one scope).
2. Verify converter readiness for each target in slice.
3. For each slice item, delegate to **conversion-agent execute**:
   - Engineering **version bump first** when reference semver changed (playbook Step 0)
   - Apply → verify → remediate loop
   - Recompute coverage after element status changes
4. When QA/engineering hit technology limits, surface **AskQuestion** with difference description and options (remediate, accept gap, defer).
5. Summarize PASS/FAIL per target; suggest **reassess**.

## Mode: reassess

Same as **portfolio-status** — use after piecemeal execution to show updated portfolio view.

## Mode: release-status / ready-to-release (readonly)

Answer whether the repo is ready to publish a Harmony release (reference + all in-repo conversion packages).

1. Determine intended release version — user-supplied `vX.Y.Z` / semver, or infer from root `package.json` and in-progress state; **AskQuestion** to confirm if ambiguous.
2. Run via Shell:
   - `node .cursor/skills/harmony-conversion/scripts/validate_conversion.mjs --all`
   - `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --check`
   - For an actual release candidate: `node .cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs --release-version <semver>`
3. Respond with **Yes — ready to release `<version>`** or **No — not ready to release `<version>`**.
4. If not ready: list blockers by area (version drift, coverage, converter readiness, package metadata, workflow) with the next concrete action.
5. If ready: include human release steps from [RELEASE_READINESS.md](../harmony-conversion/reference/RELEASE_READINESS.md).

## Mode: release-blockers (readonly)

Same checks as **release-status**, but emphasize blocker list and remediation only (no release steps unless all blockers are resolved).

## Mode: release-instructions (readonly)

1. Run **release-status** checks first.
2. If not ready: explain blockers and what must be done before release.
3. If ready: provide step-by-step GitHub Release instructions (tag, title, publish, verify Railway demo, verify GitHub Packages, post-release external updates).

Do not create the GitHub Release unless the user explicitly requests GitHub CLI automation.

## Mode: post-release-status (readonly)

1. List **external** converters from `converters/*/converter.manifest.json` where `type === external`.
2. For each: readiness level and note that host-specific conversion should target the last released bare semver.
3. Optionally remind user to run external converter playbooks via **conversion-agent** after the repo release completes.

## Human escalation

When larger differences cannot be fixed:

1. QA and engineering describe the difference and problem in plain language.
2. Management agent **AskQuestion** — how to proceed.
3. Record user guidance in `userDecision`, defect report, and plan notes.
4. Goal: conversion the user is happy with, not pixel-perfect parity when technology differs.

## Delegation

| Step | Delegate to |
|------|-------------|
| Single-target execute | **conversion-agent** execute mode |
| Single-target verify | **conversion-agent** verify-only |
| Engineering apply | `converters/<id>/playbook/SKILL.md` |
| QA verify | Target verifier agent via **conversion-fidelity-verifier** |
| Coverage recompute | `compute_coverage.mjs --write` via Shell |
| Version sync | `sync_conversion_versions.mjs --all` via Shell |
| Release readiness | `validate_release_readiness.mjs --release-version <semver>` via Shell |
| Converter readiness | **conversion-agent** readiness mode |

## Output checklist

- **portfolio-status / reassess:** header + repo effective version + table + flagged conversions + next action
- **portfolio-plan:** portfolio plan path + per-conversion plan links + "approve to execute"
- **portfolio-execute:** per-target PASS/FAIL + coverage delta + suggest reassess
- **release-status / release-blockers:** yes/no + blockers or release steps
- **release-instructions:** human GitHub Release checklist when ready
- **post-release-status:** external converter list + post-release reminder
