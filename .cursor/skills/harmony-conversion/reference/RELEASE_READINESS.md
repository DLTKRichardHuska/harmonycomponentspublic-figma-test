# Release readiness

How the **conversion-management** agent answers release questions and what scripts enforce release gates.

## Release train

The reference implementation and every **in-repo component-library** conversion share one version line:

| State | Example label | Where it is committed |
|-------|----------------|------------------------|
| Released (`latest`) | `1.1.0` | Publish job workspace only (from tag `v1.1.0`) |
| Main between releases | conversions `1.1.0-in-progress`; root base `1.1.0` | `main` |
| Feature branch (docs site only) | `1.1.0-my-branch.42` | Not stored on conversion packages |
| Dev npm tag | `1.1.0-in-progress.42` | Publish-dev job workspace only |

`conversion.manifest.json.referenceVersion` and `conversions/<id>/package.json.version` must match each other and the **train label** (`{root package.json.version}-in-progress`).

Do not commit bare release semver on conversion packages to `main`. Publish jobs rewrite versions at tag time.

**External** converters are not published from this repo. After a release, update external systems to the released bare semver.

## Scripts

```bash
# Sync conversion versions to current train label ({base}-in-progress)
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all

# Check for drift (CI uses this)
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --check

# Rewrite conversions (and root) to a release tag version — publish job workspace only
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --release-version 1.1.0

# Start the next train (writes root base + conversions {next}-in-progress)
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --bump minor

# Unique @dev prerelease rewrite — publish-dev job workspace only
node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all --dev

# Full release readiness gate (train labels on main are expected)
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

1. Determine intended release version (user-supplied tag/semver or infer from root `package.json` train base; confirm with user if ambiguous).
2. Run via Shell:
   - `validate_conversion.mjs --all`
   - `sync_conversion_versions.mjs --all --check` (train label, not bare semver)
   - `validate_release_readiness.mjs --release-version <semver>` when preparing an actual release
3. Answer:
   - **Yes — ready to release `<version>`** + human release steps (below).
   - **No — not ready to release `<version>`** + blockers grouped by area and next action.

### Blocker categories

| Area | Example | Next action |
|------|---------|-------------|
| Version drift | package vs manifest mismatch, or not on train label | `sync_conversion_versions.mjs --all` |
| Coverage gap | element not synced/accepted | portfolio-execute for scope |
| Converter not ready | readiness ≠ ready | conversion-agent readiness |
| Package metadata | `private: true` or missing publishConfig | fix `package.json` |
| Workflow | publish-conversion-packages.yml missing publish or `--release-version` rewrite | update workflow |
| Tag vs train | `--release-version` does not match root `package.json` base | tag the current train base, or bump the train first |

### Human release steps (when gate passes)

1. Confirm conversions are on `{base}-in-progress` and root `package.json` is the intended `X.Y.Z`. Do **not** commit bare conversion versions.
2. Tag and push from green `main`: `git tag vX.Y.Z && git push origin vX.Y.Z` (or GitHub Releases UI).
3. Watch **Publish conversion packages** (workspace rewrite + `npm publish` `@latest`) and **Release** (changelog PR).
4. Merge the changelog PR. Verify private GitHub Packages.
5. **AskQuestion** for patch / minor / major when the user is ready to start the next cycle — then run **Start next version train** (or tell the user to). Do not guess the next version.

Do **not** create tags unless the user explicitly requests it.

## Related

- [COVERAGE.md](COVERAGE.md)
- [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md)
- [docs/RELEASE_AND_GITHUB_SETUP.md](../../../../docs/RELEASE_AND_GITHUB_SETUP.md)
