#!/usr/bin/env node
/** Validate whether the repo is ready for a Harmony release (reference + in-repo conversions). */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import {
  computeCoverage,
  conversionDirForId,
  isElementComplete,
  listComponentLibraryConversionIds,
  listExternalConverterIds,
  loadConversionManifest,
  loadConverterManifestById,
  loadVersionHelpers,
  repoRoot,
} from './_lib.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = { releaseVersion: null, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--release-version') opts.releaseVersion = argv[++i];
    else if (a === '--quiet' || a === '-q') opts.quiet = true;
  }
  return opts;
}

function validatePackagePublishMetadata(pkg, conversionId, errors) {
  if (!pkg.name?.startsWith('@')) {
    errors.push(`${conversionId}: package name must be scoped for GitHub Packages`);
  }
  if (pkg.private === true) {
    errors.push(`${conversionId}: package.json is private: true — remove for publishable conversion packages`);
  }
  const registry = pkg.publishConfig?.registry;
  if (registry !== 'https://npm.pkg.github.com/') {
    errors.push(`${conversionId}: publishConfig.registry must be https://npm.pkg.github.com/`);
  }
  if (!pkg.scripts?.['build:lib']) {
    errors.push(`${conversionId}: package.json missing build:lib script`);
  }
  if (!pkg.exports) {
    errors.push(`${conversionId}: package.json missing exports`);
  }
}

function validateCoverageComplete(manifest, conversionId, errors, warnings) {
  const coverage = computeCoverage(manifest);
  if (coverage.percent < 100) {
    const incomplete = [];
    for (const [key, el] of Object.entries(manifest.elements ?? {})) {
      if (!isElementComplete(el)) incomplete.push(key);
    }
    if (incomplete.length) {
      errors.push(
        `${conversionId}: coverage ${coverage.percent}% — incomplete elements: ${incomplete.slice(0, 8).join(', ')}${incomplete.length > 8 ? '…' : ''}`,
      );
    }
  }
  const stored = manifest.coverage;
  if (stored && stored.percent !== coverage.percent) {
    warnings.push(
      `${conversionId}: coverage stale — run compute_coverage.mjs --conversion ${conversionId} --write`,
    );
  }
}

function validateReleaseWorkflow(errors) {
  const workflowPath = join(repoRoot(), '.github/workflows/release.yml');
  if (!existsSync(workflowPath)) {
    errors.push('Missing .github/workflows/release.yml');
    return;
  }
  const text = readFileSync(workflowPath, 'utf8');
  if (!/packages:\s*write/.test(text) && !/permissions:[\s\S]*packages:\s*write/.test(text)) {
    errors.push('release.yml: add packages: write permission for GitHub Packages publish');
  }
  if (!/npm publish/.test(text)) {
    errors.push('release.yml: missing npm publish step for conversion packages');
  }
  if (!/sync_conversion_versions/.test(text)) {
    errors.push('release.yml: missing sync_conversion_versions step for conversion packages');
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { getConversionPackageVersion, parseReleaseVersion } = await loadVersionHelpers();

  let releaseVersion = null;
  if (opts.releaseVersion) {
    releaseVersion = parseReleaseVersion(opts.releaseVersion);
    if (!releaseVersion) {
      console.error(`Invalid --release-version: ${opts.releaseVersion}`);
      process.exit(1);
    }
  }

  const expectedVersion = getConversionPackageVersion(
    releaseVersion ? { releaseVersion } : {},
  );

  const errors = [];
  const warnings = [];
  const postRelease = [];

  if (!opts.quiet) {
    console.log(`Release readiness check for version: ${expectedVersion}\n`);
  }

  const validateProc = spawnSync(
    process.execPath,
    [join(scriptDir, 'validate_conversion.mjs'), '--all', '--quiet'],
    { cwd: repoRoot(), encoding: 'utf8' },
  );
  if (validateProc.status !== 0) {
    errors.push('validate_conversion.mjs failed — fix conversion structure errors first');
    if (!opts.quiet && validateProc.stdout) console.log(validateProc.stdout);
    if (!opts.quiet && validateProc.stderr) console.log(validateProc.stderr);
  }

  const syncArgs = [join(scriptDir, 'sync_conversion_versions.mjs'), '--all', '--check'];
  if (releaseVersion) syncArgs.push('--release-version', releaseVersion);
  const syncProc = spawnSync(process.execPath, syncArgs, {
    cwd: repoRoot(),
    encoding: 'utf8',
  });
  if (syncProc.status !== 0) {
    errors.push('Conversion version drift — run sync_conversion_versions.mjs --all');
    if (!opts.quiet && syncProc.stdout) console.log(syncProc.stdout);
  }

  for (const id of listComponentLibraryConversionIds()) {
    const dir = conversionDirForId(id);
    const manifest = loadConversionManifest(dir);
    const rootPkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    const isWorkspace = manifest.independence?.layout === 'npm-workspace';
    const publishPkgPath = isWorkspace
      ? join(dir, manifest.independence?.packagePath ?? 'packages/ui', 'package.json')
      : join(dir, 'package.json');
    const pkg = JSON.parse(readFileSync(publishPkgPath, 'utf8'));

    if (manifest.referenceVersion !== expectedVersion) {
      errors.push(`${id}: referenceVersion ${manifest.referenceVersion} !== expected ${expectedVersion}`);
    }
    if (pkg.version !== expectedVersion) {
      errors.push(`${id}: publishable package.json.version ${pkg.version} !== expected ${expectedVersion}`);
    }
    if (pkg.version !== manifest.referenceVersion) {
      errors.push(`${id}: publishable package.json.version !== manifest.referenceVersion`);
    }
    if (isWorkspace && rootPkg.version !== expectedVersion) {
      warnings.push(`${id}: workspace root package.json.version ${rootPkg.version} !== expected ${expectedVersion}`);
    }

    validatePackagePublishMetadata(pkg, id, errors);
    validateCoverageComplete(manifest, id, errors, warnings);

    const converter = loadConverterManifestById(manifest.converterId);
    if (!converter) {
      errors.push(`${id}: linked converter ${manifest.converterId} missing`);
    } else if (converter.readiness?.level !== 'ready') {
      errors.push(`${id}: converter ${manifest.converterId} readiness is not ready`);
    }
  }

  for (const id of listExternalConverterIds()) {
    const converter = loadConverterManifestById(id);
    postRelease.push({
      id,
      readiness: converter?.readiness?.level ?? 'unknown',
      note: `Update external system to released version after repo release`,
    });
  }

  validateReleaseWorkflow(errors);

  for (const w of warnings) {
    if (!opts.quiet) console.log(`WARN: ${w}`);
  }
  for (const e of errors) {
    if (!opts.quiet) console.log(`ERROR: ${e}`);
  }

  if (postRelease.length && !opts.quiet) {
    console.log('\nPost-release external conversions:');
    for (const p of postRelease) {
      console.log(`  - ${p.id} (converter readiness: ${p.readiness})`);
    }
  }

  if (errors.length) {
    if (!opts.quiet) {
      console.log(`\nNo — not ready to release ${expectedVersion}`);
      console.log('Resolve blockers above, then re-run validate_release_readiness.mjs');
    }
    process.exit(1);
  }

  if (!opts.quiet) {
    console.log(`\nYes — ready to release ${expectedVersion}`);
    console.log('Create a GitHub Release with tag v' + expectedVersion.replace(/-.*$/, '') + ' (or matching tag for prerelease labels).');
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
