# Conversion plan format

Written by **conversion-agent** (plan mode). Reviewed and approved by the user before execute mode runs.

## File location

**Component-library:**

```
conversions/<conversion-id>/plans/<scope>.md
```

**External (figma):**

```
converters/figma/playbook/plans/<scope>.md
```

`<scope>` examples: `foundation` (alias for all five foundation page keys), `Colors`, `Dela`, `shell`, `components`, `Button`, `Icon`, `all`.

**Do not create** `plans/<Dependent>.md` while any catalog dependency of that element is not `synced`. Report **Blocked**, then write a plan for the blocking dependency instead (e.g. user asked for Button, Icon is `not-started` → write `plans/Icon.md` only after strategy sign-off for Icon). Check deps in `conversion.manifest.json` (component-library) or host `conversionState` (figma). See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md) § Hard dependencies and conversion-agent plan mode gate.

## Template

```markdown
# Conversion plan

| Field | Value |
|-------|-------|
| target | `<target-id>` |
| scope | `<foundation \| shell \| components \| ComponentName \| all>` |
| status | `draft` \| `approved` |
| createdAt | `<ISO-8601>` |
| referenceVersion | `<from conversion.manifest.json>` |
| coverageAtPlan | `<percent> (<completed>/<total>)` |

## Summary

One paragraph: what will be converted and the expected outcome.

## Reference delta (optional)

What changed in the Astro reference since last sync (if known).

## Open questions

- [ ] Question 1 — **resolved:** answer
- [ ] Question 2 — pending (use AskQuestion before approval)

## Element strategy (user confirmed)

| Element | Strategy | recommendedTarget | userDecision |
|---------|----------|-------------------|--------------|
| Button | existing-mui | @mui/material/Button | … |

## Prop mappings (existing-mui only)

| Harmony prop | MUI equivalent | Notes |
|--------------|----------------|-------|
| variant=primary | variant="contained" color="primary" | |

## Skipped props (user accepted)

- Button size xs — no native MUI size equivalent

## Composite equivalents (demo-only)

| Harmony feature | MUI composition | Depends on |
|-----------------|-----------------|------------|
| progressValue | LinearProgress as Alert child | ProgressBar |

## Consumer API (user confirmed)

**Required** when the element (or a custom sub-export) ships a **package export** (react-mui `custom` / custom sub-exports; shadcn `component`). **Omit** for pure `existing-mui` theme-only and for `skip`. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md) § Consumer public API.

On version/resync updates, document only the **delta** (introduced/changed consumer surface) under Reference delta + this section.

| Field | Value |
|-------|-------|
| Export name | e.g. `StatusBadge`, `Button` |
| Base / analog | e.g. MUI `Chip`; shadcn Button + Radix Slot |
| Inherited props / events / slots | e.g. `ButtonProps` minus `variant`; `ButtonHTMLAttributes`; `onClick`, `disabled`, … |
| Harmony-specific props | e.g. `pill`, `name` (icon), … |
| Omissions / divergences | e.g. no `variant` prop; non-interactive `aria-hidden` |
| TypeScript surface | Key types / `...rest` forwarding notes |
| Docs / AI artifacts | CONSUMER_GUIDE, Getting Started, `docs/components/<Name>.md`, AGENTS.md |

## Figma strategy packet (user confirmed)

**Required** for figma `figma-component` / `figma-variable`. **Omit** for component-library plans and for figma `skip`. See `converters/figma/playbook/SKILL.md` § Strategy packet.

| Field | Value |
|-------|-------|
| Element strategy | `figma-component` \| `figma-variable` |
| Product file(s) | e.g. `vp` (canonical first) |
| Consumer API → Figma props | Full inventory table (VARIANT / BOOLEAN / TEXT / INSTANCE_SWAP / deferred) |
| HTML `state` | Values or `none`; axis placement |
| Axis plan | X / Y / nesting |
| Token / wiring decisions | CSS-equivalent Color/Typography/Elevation bindings |
| Update-in-place | Existing `nodeId` (keep) or new create |
| Other decisions | Samples, icon names, fullWidth, etc. |

## Blocking dependencies

For a plan that **passes** the hard-dependency gate, this table is empty or every listed dep is already `synced`. Action is always **Convert `<Dep>` first** — never “defer,” “partial,” or “skip dependency.” If blockers exist, do not author this plan file for the dependent; plan the dependency instead.

| Element | blockedBy | Action |
|---------|-----------|--------|
| Alert | ProgressBar | Convert ProgressBar first |

## Scope

Exactly what is in / out of this plan.

| In scope | Out of scope |
|----------|--------------|
| Button variants | Shell |

## Phases

### Phase 1 — …

- Steps (target-specific detail from target conversion playbook)
- Files likely touched
- MCP / tooling required

### Phase 2 — Verification

- Capture method (from target VERIFICATION.md)
- Compare criteria
- Remediate loop max iterations (default 5)

## Risks and dependencies

- Depends on foundation synced: yes/no
- Known gaps or intentional waivers

## Approval

**Status: draft** — do not execute until the user approves.

When approved, set `status` to `approved` and record approver note below.

| Approved by | Date | Notes |
|-------------|------|-------|
| | | |
```

## Rules

- **plan mode** may create/update plan files only — no target source changes, no manifest status changes to `synced`.
- **Hard-dependency gate:** no plan file for a dependent while catalog deps are unsynced; no forbidden workaround options (see CONVERSION_WORKFLOW § Hard dependencies).
- **Consumer API gate:** plans for package exports must include **Consumer API (user confirmed)** after AskQuestion sign-off; cannot be approval-ready without it.
- **execute mode** requires `approved` OR explicit one-shot user command for scoped test. Approval does not waive catalog dependencies or Consumer API sign-off for package-export surface changes.
- User revisions edit the plan file; re-present summary after changes.
