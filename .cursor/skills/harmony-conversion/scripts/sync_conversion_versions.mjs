#!/usr/bin/env node
/** Sync conversion package.json.version and manifest referenceVersion to the repo release train. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  conversionDirForId,
  listComponentLibraryConversionIds,
  listExternalConverterIds,
  loadConversionManifest,
  loadVersionHelpers,
  repoRoot,
  saveConversionManifest,
} from './_lib.mjs';

function parseArgs(argv) {
  const opts = {
    check: false,
    all: false,
    conversionId: null,
    releaseVersion: null,
    bump: null,
    fromVersion: null,
    dev: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') opts.check = true;
    else if (a === '--all') opts.all = true;
    else if (a === '--conversion' || a === '-c') opts.conversionId = argv[++i];
    else if (a === '--release-version') opts.releaseVersion = argv[++i];
    else if (a === '--bump') opts.bump = argv[++i];
    else if (a === '--from-version') opts.fromVersion = argv[++i];
    else if (a === '--dev') opts.dev = true;
  }
  return opts;
}

function updatePackageLockVersion(lockPath, newVersion) {
  if (!existsSync(lockPath)) return false;
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  const oldVersion = lock.version;
  if (!oldVersion || oldVersion === newVersion) {
    const rootEntry = lock.packages?.[''];
    if (rootEntry?.version === newVersion) return false;
  }

  let changed = false;
  if (lock.version && lock.version !== newVersion) {
    lock.version = newVersion;
    changed = true;
  }
  for (const [key, entry] of Object.entries(lock.packages ?? {})) {
    if (!entry || typeof entry !== 'object') continue;
    if (key.startsWith('node_modules')) continue;
    if (entry.version && entry.version !== newVersion) {
      entry.version = newVersion;
      changed = true;
    }
  }
  if (!changed) return false;
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  return true;
}

function setJsonVersion(filePath, newVersion) {
  const pkg = JSON.parse(readFileSync(filePath, 'utf8'));
  if (pkg.version === newVersion) return false;
  pkg.version = newVersion;
  writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  return true;
}

async function syncConversion(conversionId, expectedVersion, { check }) {
  const dir = conversionDirForId(conversionId);
  const manifest = loadConversionManifest(dir);
  const pkgPath = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const lockPath = join(dir, 'package-lock.json');

  const changes = [];
  const manifestVersion = manifest.referenceVersion;
  const packageVersion = pkg.version;

  if (manifestVersion !== expectedVersion) {
    changes.push(`manifest.referenceVersion: ${manifestVersion} -> ${expectedVersion}`);
    if (!check) {
      manifest.referenceVersion = expectedVersion;
      manifest.referenceVersionSetAt = new Date().toISOString();
      saveConversionManifest(dir, manifest);
    }
  }

  if (packageVersion !== expectedVersion) {
    changes.push(`package.json.version: ${packageVersion} -> ${expectedVersion}`);
    if (!check) {
      pkg.version = expectedVersion;
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      updatePackageLockVersion(lockPath, expectedVersion);
    }
  } else if (!check && existsSync(lockPath)) {
    const lockChanged = updatePackageLockVersion(lockPath, expectedVersion);
    if (lockChanged) changes.push(`package-lock.json.version -> ${expectedVersion}`);
  }

  if (manifest.independence?.layout === 'npm-workspace') {
    const libRel = manifest.independence?.packagePath ?? 'packages/ui';
    const libPkgPath = join(dir, libRel, 'package.json');
    if (existsSync(libPkgPath)) {
      const libPkg = JSON.parse(readFileSync(libPkgPath, 'utf8'));
      if (libPkg.version !== expectedVersion) {
        changes.push(`${libRel}/package.json.version: ${libPkg.version} -> ${expectedVersion}`);
        if (!check) {
          libPkg.version = expectedVersion;
          writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n', 'utf8');
        }
      }
    }

    const demoRel = manifest.independence?.demoPath;
    if (demoRel) {
      const demoPkgPath = join(dir, demoRel, 'package.json');
      if (existsSync(demoPkgPath)) {
        const demoPkg = JSON.parse(readFileSync(demoPkgPath, 'utf8'));
        if (demoPkg.version !== expectedVersion) {
          changes.push(`${demoRel}/package.json.version: ${demoPkg.version} -> ${expectedVersion}`);
          if (!check) setJsonVersion(demoPkgPath, expectedVersion);
        }
      }
    }
  }

  return { conversionId, expectedVersion, changes, inSync: changes.length === 0 };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const {
    getConversionPackageVersion,
    parseReleaseVersion,
    getBaseVersion,
    bumpSemver,
    getTrainLabel,
    writeRootPackageVersion,
  } = await loadVersionHelpers();

  if ([opts.releaseVersion, opts.bump, opts.dev].filter(Boolean).length > 1) {
    console.error('Use only one of --release-version, --bump, or --dev');
    process.exit(1);
  }

  if (opts.check && (opts.bump || opts.dev)) {
    console.error('--check cannot be combined with --bump or --dev');
    process.exit(1);
  }

  let releaseVersion = null;
  if (opts.releaseVersion) {
    releaseVersion = parseReleaseVersion(opts.releaseVersion);
    if (!releaseVersion) {
      console.error(`Invalid --release-version: ${opts.releaseVersion}`);
      process.exit(1);
    }
  }

  let nextBase = null;
  if (opts.bump) {
    const from = opts.fromVersion ? parseReleaseVersion(opts.fromVersion) : getBaseVersion();
    if (opts.fromVersion && !from) {
      console.error(`Invalid --from-version: ${opts.fromVersion}`);
      process.exit(1);
    }
    nextBase = bumpSemver(from, opts.bump);
  }

  const expectedVersion = opts.dev
    ? getConversionPackageVersion({ dev: true })
    : releaseVersion
      ? getConversionPackageVersion({ releaseVersion })
      : nextBase
        ? getTrainLabel(nextBase)
        : getConversionPackageVersion({});

  const rootExpected = releaseVersion || (opts.dev ? expectedVersion : nextBase);
  const rootPath = join(repoRoot(), 'package.json');
  const rootPkg = JSON.parse(readFileSync(rootPath, 'utf8'));

  if (rootExpected && rootPkg.version !== rootExpected && !opts.check) {
    writeRootPackageVersion(rootExpected);
    console.log(`root package.json.version: ${rootPkg.version} -> ${rootExpected}`);
  }

  const ids = opts.conversionId
    ? [opts.conversionId]
    : opts.all
      ? listComponentLibraryConversionIds()
      : null;

  if (!ids?.length) {
    console.error('Specify --conversion <id> or --all');
    process.exit(1);
  }

  console.log(`Expected repo/conversion version: ${expectedVersion}`);

  const external = listExternalConverterIds();
  if (external.length) {
    console.log(`External converters (post-release targets): ${external.join(', ')}`);
  }

  let drift = false;
  for (const id of ids) {
    const result = await syncConversion(id, expectedVersion, { check: opts.check });
    if (result.inSync) {
      console.log(`${id}: in sync (${expectedVersion})`);
    } else if (opts.check) {
      drift = true;
      console.log(`${id}: DRIFT`);
      for (const c of result.changes) console.log(`  - ${c}`);
    } else {
      console.log(`${id}: synced`);
      for (const c of result.changes) console.log(`  - ${c}`);
    }
  }

  if (opts.check && drift) {
    console.error('\nVersion drift detected. Run without --check to sync.');
    process.exit(1);
  }

  if (!opts.check) {
    console.log('\nDone.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
