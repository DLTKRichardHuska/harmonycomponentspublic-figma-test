# Add converter checklist

Use when creating or fixing a **converter** (`converters/<id>/`). Conversion output for component-library types lives in `conversions/<id>/`.

See [CONVERTER_VS_CONVERSION.md](CONVERTER_VS_CONVERSION.md).

---

## Phase A — Build converter (before any conversion work)

### 1. Choose type

- [ ] **component-library** — converter + paired conversion project
- [ ] **external** — converter only (no `conversions/` entry)

### 2. Create scaffold

Agent runs via Shell:

```bash
node .cursor/skills/harmony-conversion/scripts/create_converter.mjs <id> --type <type> [options]
```

Or `/create-converter` in Cursor.

### 3. Converter folder (`converters/<id>/`)

- [ ] `converter.manifest.json` with `readiness.level`, playbook paths, `conversion.outputId` (component-library), and **`elementStrategies.allowed`** (converter-specific strategy vocabulary)
- [ ] `playbook/SKILL.md` with apply steps and **Converter readiness** section
- [ ] `playbook/VERIFICATION.md` — capture, compare, remediate (script-only)
- [ ] `playbook/VERIFIER.md`
- [ ] Minimal `scripts/` only where automation beats agent re-read (e.g. token copy)
- [ ] No `package.json` or `src/` in converter folder (component-library)
- [ ] `/conversion-agent converter <id>` or `validate_converter.mjs` passes

### 4. external only

- [ ] `external.config.json` present
- [ ] `host.system` and optional `host.mcpServer`
- [ ] No `conversions/<id>/` entry
- [ ] **Sync state lives in the host, not the repo.** Document where per-element status is stored in the host (for figma: Figma shared plugin data `harmony`/`conversionState` + a coversheet page). The repo keeps only host bindings (e.g. product→`fileKey`) in `external.config.json`.
- [ ] External element statuses may use **`review`** (verifier PASS) and, for publishable host libraries (Figma), **`needs-publish`** (waiting for human publish before Code Connect) between `in-progress` and `synced`.
- [ ] No `conversion.manifest.json` — external converters are exempt from the component-library manifest requirement (see [MANIFEST_GUIDE.md](MANIFEST_GUIDE.md), [SYNC_ELEMENTS.md](SYNC_ELEMENTS.md)).

### 5. component-library conversion folder (`conversions/<id>/`)

- [ ] `conversion.manifest.json` with `converterId`, foundation page keys (`Colors`, `Typography`, `Spacing`, `Elevations`, `Dela`), per-element keys seeded by agent from catalog
- [ ] Root `package.json` with `dev` and `build:lib`
- [ ] Layout either:
  - **single-package (default):** `src/components/`, `src/layouts/`, `src/styles/`, `src/pages/`, `src/demo/` — no nested `package.json`
  - **npm-workspace:** `independence.layout: "npm-workspace"`; publishable package under `packages/ui/` (exports + GitHub Packages metadata); demo under `apps/demo/` depending on the package **by package name**
- [ ] **First execute task (converter agent):** recreate reference demo site — all nav routes, placeholder pages for unconverted scopes (see [CONVERSION_WORKFLOW.md](CONVERSION_WORKFLOW.md))
- [ ] `verification/artifacts/`, `verification/reports/`, `plans/`
- [ ] `docs/CONSUMER.md` or `docs/CONSUMER_GUIDE.md` (path in `documentation.consumerGuide`)
- [ ] No imports from parent Astro `../../../src/`

### 6. Fix loop

1. Read ERROR lines from validate output
2. Fix manifest, structure, or playbooks
3. Re-run validation

### 7. Converter readiness sign-off

- [ ] **Converter readiness** matrix: Plan / Execute / Verify / Remediate = yes per scope (when truly ready)
- [ ] `readiness.level: ready` in `converter.manifest.json`
- [ ] `/conversion-agent converter <id>` confirms ready

**Do not start Phase B until converter is ready.**

---

## Phase B — Run conversion (after converter ready)

- [ ] `/conversion-agent` status for baseline (reads reference catalog/nav + manifest)
- [ ] **Demo site bootstrap (first execute):** converter agent builds full reference nav in conversion output; placeholders for all unconverted scopes
- [ ] Plan in `conversions/<id>/plans/<scope>.md`
- [ ] Execute via `/conversion-agent` after approval
- [ ] Update `conversion.manifest.json` element statuses to `synced` or `gap` when verification passes

Conversion runs **only in Cursor** — not via npm scripts.
