# Portfolio conversion plan format

Written by **conversion-management** agent (portfolio-plan mode). Aggregates per-conversion plans from engineering and QA agents. Reviewed and approved by the user before portfolio-execute runs.

## File location

```
plans/conversion-portfolio/<referenceVersion>-<YYYY-MM-DD>.md
```

## Template

```markdown
# Conversion portfolio plan

| Field | Value |
|-------|-------|
| referenceVersion | `<from root package.json>` |
| status | `draft` \| `approved` |
| createdAt | `<ISO-8601>` |

## Summary

One paragraph: what reference version all conversions will target and the overall outcome.

## Reference delta (optional)

What changed in the Astro reference since last conversion sync (if known).

## Portfolio status at plan time

| Conversion | referenceVersion | Coverage | Behind reference? | Converter ready? |
|------------|------------------|----------|-------------------|------------------|
| harmony-design-system-react-mui | 0.9.0 | 0% (0/51) | no | yes |

## Per-conversion plans

### harmony-design-system-react-mui

**Engineering plan:** [conversions/harmony-design-system-react-mui/plans/all.md](../conversions/harmony-design-system-react-mui/plans/all.md)

**QA assessment:** gaps vs reference at `<referenceVersion>` — foundation, shell, components, demo UI.

| Scope | Current status | Work needed |
|-------|----------------|-------------|
| foundation | in-progress | … |
| Button | not-started | … |

**Demo UI:** route coverage, chrome updates, placeholder replacements.

## Open questions

- [ ] Question — **resolved:** answer

## Execution options

Present to user via **AskQuestion**:

- Execute entire portfolio plan
- Execute one conversion only
- Execute one scope (e.g. foundation for react+mui)
- Revise plan

## Approval

**Status: draft** — do not execute until the user approves.

When approved, set `status` to `approved`.

| Approved by | Date | Notes |
|-------------|------|-------|
| | | |
```

## Rules

- **portfolio-plan mode** may create/update portfolio plan files and per-conversion draft plans only — no conversion source changes.
- **portfolio-execute mode** requires approved portfolio plan OR explicit user scope; delegates to **conversion-agent execute**.
- After piecemeal work, run **reassess** (portfolio-status) to refresh overall status.

## Related

- [CONVERSION_PLAN.md](CONVERSION_PLAN.md) — per-conversion plan format
- [COVERAGE.md](COVERAGE.md) — coverage calculation
- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md)
