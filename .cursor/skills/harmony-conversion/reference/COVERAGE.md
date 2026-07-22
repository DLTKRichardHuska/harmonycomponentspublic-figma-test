# Conversion coverage

How **coverage** is computed for Harmony conversions. Coverage answers: *of the reference design system at the current `referenceVersion` label, how much has been verified in this conversion?*

## Version

| Field | Meaning |
|-------|---------|
| `referenceVersion` | Current repo release-train label for this conversion — matches `package.json.version` and the reference effective version (e.g. `1.0.0-in-progress` on `main`, `1.1.0` after release) |
| `referenceVersionSetAt` | Optional ISO timestamp when `referenceVersion` was last set |

For **in-repo component-library** conversions, `referenceVersion` and `package.json.version` are kept in sync via `sync_conversion_versions.mjs`. Consumers use the package version to identify which Harmony reference release the conversion matches.

Base semver source: root [`package.json`](../../../../package.json) `version` + effective-version rules in [`scripts/lib/version.js`](../../../../scripts/lib/version.js).

## Coverage element set

Equal weight per manifest element. Canonical keys:

| Unit | Key(s) |
|------|--------|
| Foundation | One key per Foundation nav page in [`src/data/navigation.ts`](../../../../src/data/navigation.ts): `Colors`, `Typography`, `Spacing`, `Elevations`, `Dela` |
| Shell | `ShellLayout` |
| Components | every name from `getAllExportedComponents()` in [`src/data/component-catalog.ts`](../../../../src/data/component-catalog.ts) |

**Total:** 5 + 1 + 49 = **55** elements (when catalog count is 49 exported UI components).

Plan/verify scope alias `foundation` means all five foundation keys — it is **not** a manifest element.

Agents discover the live list via `getCoverageElements()` in [`.cursor/skills/harmony-conversion/scripts/_lib.mjs`](../scripts/_lib.mjs).

## What counts as complete

An element counts toward `coverage.completed` when:

| Condition | Counts? |
|-----------|---------|
| `status === "synced"` | Yes |
| `status === "gap"` AND `userDecision` is set | Yes (accepted intentional difference) |
| `status === "not-started"` | No |
| `status === "in-progress"` | No |
| `status === "gap"` without `userDecision` | No |

## Coverage block

Stored in `conversion.manifest.json`:

```json
"coverage": {
  "percent": 0,
  "completed": 0,
  "total": 55,
  "computedAt": "2026-06-28T12:00:00.000Z"
}
```

Recompute after any element status change:

```bash
node .cursor/skills/harmony-conversion/scripts/compute_coverage.mjs --conversion <id> --write
```

## Demo UI

Demo review-surface routes are **not** coverage units. Demo pages follow DS element completion and are tracked in per-conversion plans.

## Version bump reset

When engineering starts an update to a **new** reference semver (new release-train label):

1. Set `referenceVersion` via `sync_conversion_versions.mjs` (or playbook Step 0)
2. Reset all `elements.*.status` to `not-started` when the bare semver changes (preserve `notes`, `strategy`, `harmonySource`; clear stale `userDecision`)
3. Recompute coverage → **0%**

Same version label with reference edits: do **not** auto-reset — scoped re-verify only. See [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md).

## Related

- [MANIFEST_GUIDE.md](MANIFEST_GUIDE.md)
- [RELEASE_READINESS.md](RELEASE_READINESS.md)
- [SYNC_ELEMENTS.md](SYNC_ELEMENTS.md)
- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md)
