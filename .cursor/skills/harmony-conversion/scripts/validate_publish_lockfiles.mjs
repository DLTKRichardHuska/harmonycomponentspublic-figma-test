#!/usr/bin/env node
/**
 * Ensure conversion lockfiles stay valid after the publish version rewrite.
 * Copies each conversion's install manifests to a scratch dir, applies the same
 * package/lock version bump publish workflows run, then `npm ci --dry-run`.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';
import {
  conversionDirForId,
  listComponentLibraryConversionIds,
  loadConversionManifest,
  updatePackageLockVersion,
} from './_lib.mjs';

/** Sentinel semver so the rewrite always runs and never matches a real release. */
const SENTINEL_VERSION = '99.0.0-lockfile-ci';

function setJsonVersion(filePath, newVersion) {
  const pkg = JSON.parse(readFileSync(filePath, 'utf8'));
  if (pkg.version === newVersion) return false;
  pkg.version = newVersion;
  writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  return true;
}

function installManifestRels(manifest) {
  const rels = ['package.json', 'package-lock.json'];
  if (manifest.independence?.layout === 'npm-workspace') {
    const libRel = manifest.independence?.packagePath ?? 'packages/ui';
    rels.push(join(libRel, 'package.json'));
    const demoRel = manifest.independence?.demoPath;
    if (demoRel) rels.push(join(demoRel, 'package.json'));
  }
  return rels;
}

function copyInstallTree(srcDir, destDir, rels) {
  for (const rel of rels) {
    const from = join(srcDir, rel);
    if (!existsSync(from)) {
      throw new Error(`Missing required install file: ${rel}`);
    }
    const to = join(destDir, rel);
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to);
  }
}

function applyPublishVersionRewrite(scratchDir, manifest, version) {
  setJsonVersion(join(scratchDir, 'package.json'), version);
  updatePackageLockVersion(join(scratchDir, 'package-lock.json'), version);

  if (manifest.independence?.layout === 'npm-workspace') {
    const libRel = manifest.independence?.packagePath ?? 'packages/ui';
    setJsonVersion(join(scratchDir, libRel, 'package.json'), version);
    const demoRel = manifest.independence?.demoPath;
    if (demoRel) setJsonVersion(join(scratchDir, demoRel, 'package.json'), version);
  }
}

function validateConversion(conversionId) {
  const srcDir = conversionDirForId(conversionId);
  const lockPath = join(srcDir, 'package-lock.json');
  if (!existsSync(lockPath)) {
    return { conversionId, skipped: true, reason: 'no package-lock.json' };
  }

  const manifest = loadConversionManifest(srcDir);
  const rels = installManifestRels(manifest);
  const scratchDir = mkdtempSync(join(tmpdir(), `harmony-lock-${conversionId}-`));

  try {
    copyInstallTree(srcDir, scratchDir, rels);
    applyPublishVersionRewrite(scratchDir, manifest, SENTINEL_VERSION);
    execSync('npm ci --dry-run --ignore-scripts --no-audit --no-fund', {
      cwd: scratchDir,
      stdio: 'pipe',
      encoding: 'utf8',
      shell: true,
    });
    return { conversionId, skipped: false, ok: true };
  } catch (err) {
    const stdout = typeof err.stdout === 'string' ? err.stdout : err.stdout?.toString?.() ?? '';
    const stderr = typeof err.stderr === 'string' ? err.stderr : err.stderr?.toString?.() ?? err.message;
    return {
      conversionId,
      skipped: false,
      ok: false,
      detail: [stdout, stderr].filter(Boolean).join('\n').trim(),
    };
  } finally {
    rmSync(scratchDir, { recursive: true, force: true });
  }
}

function main() {
  const ids = listComponentLibraryConversionIds();
  let failed = false;

  for (const id of ids) {
    const result = validateConversion(id);
    if (result.skipped) {
      console.log(`${id}: skipped (${result.reason})`);
      continue;
    }
    if (result.ok) {
      console.log(`${id}: ok (npm ci --dry-run after release rewrite)`);
      continue;
    }
    failed = true;
    console.error(`${id}: FAILED — lockfile invalid after publish version rewrite`);
    if (result.detail) console.error(result.detail);
  }

  if (failed) {
    console.error(
      '\nPublish rewrite desynced a conversion lockfile. Fix updatePackageLockVersion / regenerate the lock.',
    );
    process.exit(1);
  }

  console.log('\nAll conversion lockfiles survive the publish version rewrite.');
}

main();
