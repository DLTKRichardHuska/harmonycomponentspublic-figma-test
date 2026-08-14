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

For verification builds that are **not** a public release:

```bash
npm install @dltkrichardhuska/harmony-design-system-react-mui@dev
```

Configure npm for `https://npm.pkg.github.com/` with a GitHub token that has `read:packages`.

Before releasing, use **conversion-management** release-status mode or:

```bash
node .cursor/skills/harmony-conversion/scripts/validate_release_readiness.mjs --release-version 1.1.0
```

---

## Release train (how versions work)

| Place | Between releases on `main` | At publish time (tag job workspace only) |
|-------|----------------------------|------------------------------------------|
| Root `package.json.version` | Bare train base, e.g. `1.1.0` | Rewritten to `1.1.0` |
| Conversion `package.json` + `referenceVersion` | Train label, e.g. `1.1.0-in-progress` | Rewritten to `1.1.0` |
| npm `latest` | Unchanged | Published from the tag |
| npm `dev` | Optional prerelease from **Publish dev packages** | Never updates `latest` |

Do **not** commit bare release semver on conversion packages to `main`. CI expects the train label. The publish workflow rewrites versions in the job workspace.

After a release, start the next train only when you know whether the next cycle is a **patch**, **minor**, or **major**. Use **Actions → Start next version train** — it opens a PR; it does not guess the bump.

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
- [ ] Allow GitHub Actions to create and approve pull requests: **on** (needed for changelog and next-train PRs)

The default `GITHUB_TOKEN` is enough for:

- **CI** — validate and build on pull requests and branch pushes
- **Changelog** — commit updated `changelog-data/` back to the branch that changed components or tokens
- **Release** — promote changelog entries via a PR, rewrite versions in the publish job, and publish packages when a release is tagged
- **Start next version train** — open a PR that bumps the train after you choose patch / minor / major

### 4. Optional: production environment approval

If you want a human to approve release automation before it publishes packages:

- [ ] Create environment **production** under **Settings → Environments**
- [ ] Add required reviewers
- [ ] Attach `environment: production` on the publish job in `.github/workflows/publish-conversion-packages.yml`

### 5. Who can publish releases

- [ ] Grant **Maintain** or **Admin** role to release managers, or use a team with release permission
- [ ] Document who on the design systems team is allowed to click **Publish release**

---

## Part B — How to create a release (step-by-step)

Use this when design system changes on `main` are ready to ship as a new official version.

### Before you start

1. Confirm your work is **merged into `main`** (via an approved pull request).
2. Confirm the train base in root `package.json` is the version you will tag (conversions should show `{base}-in-progress`).
3. The site on `main` shows **`0.9.0-in-progress`** (or similar) until you publish a release — that is expected.
4. Optional: run **Publish dev packages** and install `@dev` to verify consumers before tagging.

### Steps

1. Open the repository on GitHub.
2. Click **Releases** (right side of the main code view, or under **Code**).
3. Click **Draft a new release**.
4. Click **Choose a tag**, type the new tag matching the train base (example: `v1.1.0`), then choose **Create new tag: v1.1.0 on publish**.
5. Set **Target** to **`main`** (latest commit).
6. Set **Release title** to something readable, for example: `Harmony Design System v1.1.0`.
7. Click **Generate release notes** to get a starting summary from GitHub, then edit it in plain language for your audience.
8. Click **Publish release**.
9. Open the **Actions** tab and wait for:
    - **Publish conversion packages** (rewrites versions in the job, publishes `@latest`)
    - **Release** (opens a changelog promotion PR)
10. Merge the changelog PR when CI is green.
11. Verify GitHub Packages show the new version for `@dltkrichardhuska/harmony-design-system` and each in-repo conversion package.
12. When you are ready to start the **next** cycle, run **Actions → Start next version train**, choose patch / minor / major, and merge the PR it opens.

### What happens automatically

When you publish the release, GitHub Actions will:

1. Rewrite package versions to the tag semver **in the publish job workspace only** (not on `main`).
2. Build and publish the root package and each in-repo conversion package to **GitHub Packages** (`latest`).
3. Open a PR that promotes **In progress** changelog entries to the tagged version.
4. Append a note on the GitHub Release pointing at **Start next version train**.

You **do not** edit conversion version files by hand for a release — the **tag name is the published version**.

---

## Dev / test packages (`@dev`)

Use **Actions → Publish dev packages** (`workflow_dispatch`) when you need installable packages before an official release.

- Versions are unique prereleases such as `1.1.0-in-progress.42`
- Published with npm dist-tag **`dev`**
- Does **not** update **`latest`**

```bash
npm install @dltkrichardhuska/harmony-design-system@dev
npm install @dltkrichardhuska/harmony-design-system-react-mui@dev
npm install @dltkrichardhuska/harmony-design-system-shadcn@dev
```

---

## Version numbers (semver cheat sheet)

| Bump | When to use | Example |
|------|-------------|---------|
| **Patch** (`0.9.0` → `1.0.1`) | Bug fixes, small visual tweaks, documentation fixes that do not change component APIs | Dialog footer spacing fix |
| **Minor** (`0.9.0` → `1.1.0`) | New components, new props, new tokens — backward compatible | New `Badge` variant |
| **Major** (`0.9.0` → `2.0.0`) | Breaking changes — removed props, renamed tokens, layout changes consumers must adapt to | Removed component export |

When in doubt, ask the design systems team before a **major** bump. The next-train workflow asks you to choose; it does not infer the bump from the last tag.

---

## Branch preview versions

While work is on a feature branch (not `main`), the docs site preview label is:

```text
0.9.0-your-branch-name.42
```

On `main` before the next release, the site shows:

```text
0.9.0-in-progress
```

Conversion packages on every branch stay on the **train label** (`0.9.0-in-progress`) until you start the next train. Only git tags such as `v0.9.0` are official releases.

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
| `CHANGELOG.md` in the repo | Consumers installing via git/npm | Updated when a GitHub Release is published (via changelog PR) |

GitHub’s **Generate release notes** on the release form is a helpful summary; the site changelog remains the detailed history.

---

## Troubleshooting

| Problem | What to check |
|---------|----------------|
| Release / publish workflow failed | **Actions** tab → job logs; confirm tag is `vX.Y.Z` and target is `main` |
| CI failing because versions are bare semver on conversions | Sync to the train: `node .cursor/skills/harmony-conversion/scripts/sync_conversion_versions.mjs --all` |
| Changelog not updating on my branch | Did the push change files under `src/components/ui/`, `src/styles/`, `src/tokens/`, or `src/layouts/`? Check the **Changelog** workflow. |
| CI failing on pull request | Open the **CI** workflow log; run `npm run check` and `npm run validate:catalog` locally if needed |
| Version on site still shows `-in-progress` after release | Expected on `main` until the next deploy; published npm packages use the tag. Confirm **Publish conversion packages** completed |
| Next-train or changelog PR was not opened | Enable **Allow GitHub Actions to create and approve pull requests** in Actions settings |

For technical issues, contact the design systems team or open an issue in the repository.
