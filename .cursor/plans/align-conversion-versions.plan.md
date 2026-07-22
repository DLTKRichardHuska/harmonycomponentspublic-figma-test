# Align conversion versions (implemented)

See workspace changes for the full release-train versioning implementation:

- `scripts/lib/version.js` — `getRepoEffectiveVersion`, `getConversionPackageVersion`
- `.cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs`
- `.cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs`
- `.cursor/skills/harmony-conversion/reference/RELEASE_READINESS.md`
- `.cursor/skills/conversion-management/SKILL.md` — release-status, release-blockers, release-instructions, post-release-status
- `.github/workflows/release.yml` — sync conversions, publish GitHub Packages
- `.github/workflows/ci.yml` — version drift + conversion validation
