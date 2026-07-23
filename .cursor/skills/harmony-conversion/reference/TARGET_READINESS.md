# Converter readiness

Assess whether a **converter's** playbooks and tooling (`converters/<id>/`) are implemented enough to run conversions — separate from **conversion status** (`conversions/<id>/`, element sync state).

Used by **conversion-agent** `readiness` mode (aliases: `converter`, `implementation`).

See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md).

## Two different questions

| Question | Mode | Answers |
|----------|------|---------|
| "What's synced?" | **status** (conversion status) | `conversion.manifest.json` element groups vs reference |
| "Is the **converter** ready?" | **readiness** (converter readiness) | Playbooks, scripts, MCP — can plan/execute work? |

A converter can be **structurally valid** (`validate_converter.mjs` passes via agent Shell) but **not ready** (playbooks stubbed).

## Scope fence (readiness audits)

Readiness mode is **not** conversion status. Before auditing:

1. **Do not** open `conversions/<id>/conversion.manifest.json` for `elements` sync state.
2. **Do not** produce per-element converted/pending tables (that is **status** mode).
3. **Primary sources:** `converters/<id>/` only — manifest, playbooks, scripts, `validate_converter.mjs`.
4. **Review surface:** If playbooks document a browsable demo or host review surface under `conversions/<id>/`, check existence only — report as *converter QA capability*, not *what is synced*.

See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md) § Scope fence.

## Readiness levels

| Level | Meaning | Plan mode | Execute mode |
|-------|---------|-----------|--------------|
| **not-ready** | Placeholder playbooks or missing required docs | Status/readiness only | Blocked — list dev tasks |
| **dev-in-progress** | Partial playbooks; some scopes documented | OK for documented scopes | Limited scopes only; warn on gaps |
| **partial** | Core paths work for listed scopes | OK | OK for listed scopes + verify caveats |
| **ready** | Apply + **converter-owned QA verification** proven for target type | OK | OK (subject to MCP/runtime) |

Registry `status: placeholder` or `dev-in-progress` implies **not-ready** until `readiness.level` is `ready` and verify column is `yes` for scope.

**Verify is agent-led QA** — each converter owns a QA verifier agent in `playbook/VERIFIER.md`. There is no global route registry or mandatory capture script pipeline.

## Global checklist (readonly audit)

For each target, assess:

### Structure (helpers)

- [ ] Agent runs `node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>` (or list ERRORs)
- [ ] `converters/<id>/playbook/SKILL.md` exists
- [ ] `converters/<id>/playbook/VERIFICATION.md` exists
- [ ] `conversions/<id>/plans/` exists (component-library) when plans are used

### Converter playbook (`playbook/SKILL.md`)

- [ ] No top-level `Status: placeholder` (unless manifest is placeholder)
- [ ] **Planning and status** section is actionable (not empty/TODO-only)
- [ ] Apply steps exist for: **demo site bootstrap**, foundation, shell, components (or explicit "not implemented" per scope)
- [ ] MCP gates documented with server id (if required)
- [ ] Referenced scripts exist on disk
- [ ] **Converter readiness** section present in `playbook/SKILL.md`

### Verification playbook (`playbook/VERIFICATION.md`)

- [ ] **Compare (readonly)**, **Acceptance**, **Remediate** sections present
- [ ] Acceptance criteria defined per scope type (demo, foundation, shell, component)
- [ ] Cross-links target `VERIFIER.md` equivalence procedure

### QA verifier agent (`playbook/VERIFIER.md`)

- [ ] **Conversion knowledge** section — how this target organizes output
- [ ] **Equivalence procedure** — how to locate converted counterpart for each scope type
- [ ] QA walkthrough and defect report paths documented
- [ ] `.cursor/agents/<target-id>-verifier.md` router exists (delegates to VERIFIER.md)

### Review surface (component-library only)

QA agents need a **browsable review surface** (demo site) or documented source paths to compare against reference. See [FIDELITY_PRINCIPLES.md](FIDELITY_PRINCIPLES.md).

- [ ] Playbook documents **demo site bootstrap** as first execute step (placeholders for unconverted scopes)
- [ ] `VERIFIER.md` documents where QA finds each scope in this conversion's output
- [ ] Review surface exists when playbook says it is required (e.g. `npm run dev` on documented port)
- [ ] `conversions/<id>/package.json` has `dev`, `build:lib` when playbook requires build for QA

**external:**

- [ ] `external.config.json` with required host fields
- [ ] MCP server documented in manifest `host.mcpServer`

### Capability matrix

Build a table of what works **today**:

| Scope | Plan | Execute apply | Verify | Remediate |
|-------|------|---------------|--------|-----------|
| demo site (bootstrap) | ? | ? | ? | ? |
| foundation | ? | ? | ? | ? |
| shell | ? | ? | ? | ? |
| `<Component>` | ? | ? | ? | ? |

Use target **Converter readiness** section as primary source; cross-check by reading playbooks for `TODO`, `placeholder`, `when implemented`, `not implemented`.

## Output format

Present to the user:

```markdown
## Converter readiness: <converter-id>

**Overall:** not-ready | dev-in-progress | partial | ready  
**Registry status:** placeholder | dev-in-progress | active  
**Structural validate:** PASS | FAIL (list errors)

## Summary

One paragraph: can the **converter agent** plan/apply/verify/remediate right now? (Not: what is synced.)

## Capability matrix

(scope table — Plan | Execute apply | Verify | Remediate)

## Playbook audit

| Doc | Completeness | Gaps |
|-----|--------------|------|
| playbook/SKILL.md | … | … |
| playbook/VERIFICATION.md | … | … |
| playbook/VERIFIER.md | … | … |

## Converter blockers (before execute)

1. … (playbook gaps, missing verify harness — label harness tasks explicitly)

## Recommended converter dev tasks

1. …

## Safe to use now

- readiness / status / plan for: …
- execute for: … (or "none")
```

**Do not include:** element sync tables, `conversion.manifest.json` status, or phrases like "conversion output placeholder".

If user asks about **all targets**, produce one section per target plus a comparison table.

## Developing target skills

When readiness is **not-ready** or **dev-in-progress**, direct the user to:

1. Edit `converters/<id>/playbook/SKILL.md` — apply + output organization
2. Edit `converters/<id>/playbook/VERIFICATION.md` — acceptance + remediate
3. Edit `converters/<id>/playbook/VERIFIER.md` — QA agent equivalence + walkthrough
4. Implement review surface in paired project when needed (**converter dev**, not sync)
5. Update **Converter readiness** in `playbook/SKILL.md` and `readiness` in `converter.manifest.json`
6. Re-run `/conversion-agent converter <id>`
7. Run `node .cursor/skills/harmony-conversion/scripts/validate_converter.mjs --converter <id>` for folder structure

Do not implement target logic in `.cursor/skills/` — only in the target folder.

## Related

- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md) — user conversion journey
- [ADD_CONVERTER_CHECKLIST.md](ADD_CONVERTER_CHECKLIST.md) — scaffold new converters
- `validate_converter.mjs` — structural validation only
