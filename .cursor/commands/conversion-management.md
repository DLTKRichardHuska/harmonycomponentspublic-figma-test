# /conversion-management

Harmony **conversion management agent** — portfolio status, multi-conversion planning, and coordinated execution across all conversion targets.

## Input

Optional **mode** and arguments:

| Invocation | Mode |
|------------|------|
| `/conversion-management` | portfolio-status |
| `/conversion-management status` | portfolio-status |
| `/conversion-management plan` | portfolio-plan |
| `/conversion-management execute` | portfolio-execute (after approval) |
| `/conversion-management reassess` | reassess |
| `/conversion-management release` | release-status |
| `/conversion-management release-blockers` | release-blockers |
| `/conversion-management release-instructions` | release-instructions |
| `/conversion-management post-release` | post-release-status |

Natural language: *"Status of all conversions"*, *"Plan updating all conversions to match reference"*, *"Begin the conversion process"*, *"Reassess after foundation sync"*, *"Is it ready to release?"*, *"What blocks release?"*, *"How do I create the release?"*.

## Instructions

1. Load **harmony-conversion** and **conversion-management** skills.
2. For portfolio-status/reassess: read repo effective version; run `compute_coverage.mjs --all`; present portfolio table with package + manifest versions.
3. For release-status/release-blockers/release-instructions: run `validate_release_readiness.mjs` and follow [RELEASE_READINESS.md](../skills/harmony-conversion/reference/RELEASE_READINESS.md).
4. For portfolio-plan: gather engineering + QA plans per conversion; write `plans/conversion-portfolio/<version>-<date>.md`.
5. For portfolio-execute: delegate to **conversion-agent** execute per approved slice; run `sync_conversion_versions.mjs` after version bumps.
5. **Never instruct the user to run npm for conversion workflow.**

Single-target work: use **`/conversion-agent`** instead.

See [PORTFOLIO_PLAN.md](../skills/harmony-conversion/reference/PORTFOLIO_PLAN.md) and [COVERAGE.md](../skills/harmony-conversion/reference/COVERAGE.md).
