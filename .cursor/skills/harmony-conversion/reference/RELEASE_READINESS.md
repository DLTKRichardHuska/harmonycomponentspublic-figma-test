# Release readiness

How the **conversion-management** agent answers release questions and what scripts enforce release gates.

## Release train

The reference implementation and every **in-repo component-library** conversion share one version line:

| State | Example label |
|-------|----------------|
| Released | `1.1.0` |
| Main between releases | `1.0.0-in-progress` |
| Feature branch | `1.0.0-my-branch.42` |

`conversion.manifest.json.referenceVersion` and `conversions/<id>/package.json.version` must match each other and the current repo effective version.

**External** converters are not published from this repo. After a release, update external systems to the released bare semver.

## Scripts

```bash
# Sync conversion versions to current repo effective version
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all

# Check for drift (CI uses this)
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --check

# Sync all conversions to a release tag version (release workflow)
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --release-version 1.1.0

# Full release readiness gate
node .cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs --release-version 1.1.0
```

## Management agent modes

| Mode | Triggers | Response header |
|------|----------|-----------------|
| **release-status** / **ready-to-release** | "Is it ready to release?", "Can we ship?" | `## Release readiness` |
| **release-blockers** | "What blocks release?" | `## Release blockers` |
| **release-instructions** | "How do I create the release?" | `## Release instructions` |
| **post-release-status** | "What external conversions need updates?" | `## Post-release external conversions` |

### release-status flow

1. Determine intended release version (user-supplied tag/semver or infer from root `package.json` + in-progress state; confirm with user if ambiguous).
2. Run via Shell:
   - `validate_conversion.mjs --all`
   - `sync_conversion_versions.mjs --all --check` (or `--release-version` when checking a specific release)
   - `validate_release_readiness.mjs --release-version <semver>` when preparing an actual release
3. Answer:
   - **Yes — ready to release `<version>`** + human release steps (below).
   - **No — not ready to release `<version>`** + blockers grouped by area and next action.

### Blocker categories

| Area | Example | Next action |
|------|---------|-------------|
| Version drift | package vs manifest mismatch | `sync_conversion_versions.mjs --all` |
| Coverage gap | element not synced/accepted | portfolio-execute for scope |
| Converter not ready | readiness ≠ ready | conversion-agent readiness |
| Package metadata | `private: true` or missing publishConfig | fix `package.json` |
| Workflow | publish-conversion-packages.yml missing publish steps | update workflow |

### Human release steps (when gate passes)

1. Confirm publishable package versions match the intended semver (`vX.Y.Z`).
2. Tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`.
3. Watch **Publish conversion packages** in Actions.
4. Verify private GitHub Packages for each in-repo conversion library.
5. Run **post-release-status** for external converters.

Do **not** create tags unless the user explicitly requests it.

## Related

- [COVERAGE.md](COVERAGE.md)
- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md)
- [docs/RELEASE_AND_GITHUB_SETUP.md](../../../../docs/RELEASE_AND_GITHUB_SETUP.md)
