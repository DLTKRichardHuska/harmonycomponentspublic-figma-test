# Release process and GitHub setup

This guide is for **GitHub administrators** (one-time setup) and **release managers** (creating official versions). You do not need the command line to publish a release.

Official versions are created from `main` using **GitHub Releases**. The reference package and all in-repo conversion packages share the same version and are published to **private GitHub Packages** when you release.

Install the reference package:

```bash
npm install @dltkrichardhuska/harmony-design-system@1.1.0
```

Install a conversion package (example React + MUI):

```bash
npm install @dltkrichardhuska/harmony-design-system-react-mui@1.1.0
```

Configure npm for `https://npm.pkg.github.com/` with a GitHub token that has `read:packages`.

Before releasing, use **conversion-management** release-status mode or:

```bash
node .cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs --release-version 1.1.0
```

---

## Part A — GitHub administrator setup (one-time)

Work through this checklist with a GitHub organization admin.

### 1. Branch protection on `main`

In the repository: **Settings → Branches → Branch protection rules → Add rule**

- [ ] Branch name pattern: `main`
- [ ] **Require a pull request before merging**
- [ ] **Require status checks to pass** — select the **CI** workflow (`validate-and-build`)
- [ ] **Do not allow bypassing the above settings** (or limit bypass to admins only)
- [ ] Restrict who can push to matching branches (recommended for a design system source-of-truth repo)

**Why:** All work happens on branches; `main` always reflects merged, reviewed code ready to release.

### 2. Tag and release rules

- [ ] Release tags must use semver with a `v` prefix: `v0.9.0`, `v1.1.0`, `v2.0.0`
- [ ] Restrict who can publish releases (GitHub **Settings → Collaborators and teams**, or **Rulesets** for tags matching `v*.*.*`)

**Why:** The tag name is the version consumers pin to. Consistent naming avoids confusion.

### 3. GitHub Actions permissions

In **Settings → Actions → General**:

- [ ] **Workflow permissions:** Read and write permissions
- [ ] Allow GitHub Actions to create and approve pull requests: **off** (not needed)

The default `GITHUB_TOKEN` is enough for:

- **CI** — validate and build on pull requests and branch pushes
- **Changelog** — commit updated `changelog-data/` back to the branch that changed components or tokens
- **Release** — promote changelog entries, bump `package.json`, build, and attach assets when a release is published

### 4. Optional: production environment approval

If you want a human to approve release automation before it commits to `main`:

- [ ] Create environment **production** under **Settings → Environments**
- [ ] Add required reviewers
- [ ] In `.github/workflows/release.yml`, set `environment: production` on the release job

### 5. Who can publish releases

- [ ] Grant **Maintain** or **Admin** role to release managers, or use a team with release permission
- [ ] Document who on the design systems team is allowed to click **Publish release**

---

## Part B — How to create a release (step-by-step)

Use this when design system changes on `main` are ready to ship as a new official version.

### Before you start

1. Confirm your work is **merged into `main`** (via an approved pull request).
2. Decide the next version number (see semver cheat sheet below).
3. The site on `main` shows **`0.9.0-in-progress`** (or similar) until you publish a release — that is expected.

### Steps

1. Open the repository on GitHub.
2. Click **Releases** (right side of the main code view, or under **Code**).
3. Click **Draft a new release**.
4. Click **Choose a tag**, type the new tag (example: `v1.1.0`), then choose **Create new tag: v1.1.0 on publish**.
5. Set **Target** to **`main`** (latest commit).
6. Set **Release title** to something readable, for example: `Harmony Design System v1.1.0`.
7. Click **Generate release notes** to get a starting summary from GitHub, then edit it in plain language for your audience.
8. Click **Publish release**.
9. Open the **Actions** tab and wait for the **Release** workflow to finish (green checkmark).
10. Verify:
    - The docs site shows the new version (for example `v1.1.0` on the homepage after deploy).
    - The [changelog](/changelog) page has a new **1.1.0** section.
    - **In progress** only lists changes not yet in a release.
    - GitHub Packages show the new version for `@dltkrichardhuska/harmony-design-system` and each in-repo conversion package.

### What happens automatically

When you publish the release, GitHub Actions will:

1. Promote **In progress** changelog entries to the version you tagged.
2. Update `package.json` and `CHANGELOG.md` on `main`.
3. Sync every in-repo conversion package to the release version.
4. Move the release tag to the promotion commit.
5. Build the docs site and attach build output to the release (when configured).
6. Build and publish the root package and each in-repo conversion package to **GitHub Packages**.

You **do not** edit version files by hand — the **tag name is the version**.

---

## Version numbers (semver cheat sheet)

| Bump | When to use | Example |
|------|-------------|---------|
| **Patch** (`0.9.0` → `1.0.1`) | Bug fixes, small visual tweaks, documentation fixes that do not change component APIs | Dialog footer spacing fix |
| **Minor** (`0.9.0` → `1.1.0`) | New components, new props, new tokens — backward compatible | New `Badge` variant |
| **Major** (`0.9.0` → `2.0.0`) | Breaking changes — removed props, renamed tokens, layout changes consumers must adapt to | Removed component export |

When in doubt, ask the design systems team before a **major** bump.

---

## Branch preview versions

While work is on a feature branch (not `main`), CI builds use a preview label:

```text
0.9.0-your-branch-name.42
```

On `main` before the next release, the site shows:

```text
0.9.0-in-progress
```

These labels are for identification only. Only git tags such as `v0.9.0` are official releases.

---

## Initial v0.9.0 tag (administrator, one time)

If the repository does not yet have a `v0.9.0` tag after the versioning baseline:

1. Ensure `main` includes the baseline migration (merged pull request).
2. Open **Releases → Draft a new release**.
3. Tag: **`v0.9.0`**, target: **`main`**, title: **Harmony Design System v0.9.0**.
4. Publish the release.

---

## Two changelogs (what each is for)

| File | Audience | Updated when |
|------|----------|--------------|
| Site changelog (`/changelog`) | Detailed component and token changes | Automatically on branch pushes when UI files change |
| `CHANGELOG.md` in the repo | Consumers installing via git/npm | Updated when a GitHub Release is published |

GitHub’s **Generate release notes** on the release form is a helpful summary; the site changelog remains the detailed history.

---

## Troubleshooting

| Problem | What to check |
|---------|----------------|
| Release workflow failed | **Actions** tab → **Release** job logs; confirm tag is `vX.Y.Z` and target is `main` |
| Changelog not updating on my branch | Did the push change files under `src/components/ui/`, `src/styles/`, `src/tokens/`, or `src/layouts/`? Check the **Changelog** workflow. |
| CI failing on pull request | Open the **CI** workflow log; run `npm run check` and `npm run validate:catalog` locally if needed |
| Version on site still shows `-in-progress` after release | Deploy may lag behind `main`; confirm the release workflow completed and deployment picked up `main` |

For technical issues, contact the design systems team or open an issue in the repository.
