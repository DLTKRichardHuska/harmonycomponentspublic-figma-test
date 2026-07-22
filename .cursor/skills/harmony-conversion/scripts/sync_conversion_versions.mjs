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
  saveConversionManifest,
} from './_lib.mjs';

function parseArgs(argv) {
  const opts = { check: false, all: false, conversionId: null, releaseVersion: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') opts.check = true;
    else if (a === '--all') opts.all = true;
    else if (a === '--conversion' || a === '-c') opts.conversionId = argv[++i];
    else if (a === '--release-version') opts.releaseVersion = argv[++i];
  }
  return opts;
}

function updatePackageLockVersion(lockPath, newVersion) {
  if (!existsSync(lockPath)) return false;
  let text = readFileSync(lockPath, 'utf8');
  const pkg = JSON.parse(readFileSync(lockPath, 'utf8'));
  const oldVersion = pkg.version;
  if (oldVersion === newVersion && pkg.packages?.['']?.version === newVersion) {
    return false;
  }
  text = text.replace(
    new RegExp(`"version": "${oldVersion.replace(/\./g, '\\.')}"`, 'g'),
    `"version": "${newVersion}"`,
  );
  writeFileSync(lockPath, text, 'utf8');
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

  // npm-workspace: also sync publishable package version
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
  }

  return { conversionId, expectedVersion, changes, inSync: changes.length === 0 };
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
