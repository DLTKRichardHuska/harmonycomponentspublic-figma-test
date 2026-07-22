#!/usr/bin/env node
/** Compute and optionally write conversion coverage. Agents invoke via Shell only. */
import {
  computeCoverage,
  conversionDirForId,
  listConversionIds,
  loadConversionManifest,
  saveConversionManifest,
  seedCoverageElements,
} from './_lib.mjs';

function printUsage() {
  console.error('Usage: compute_coverage.mjs --conversion <id> [--write] [--seed]');
  console.error('       compute_coverage.mjs --all [--write] [--seed]');
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const write = args.includes('--write');
const seed = args.includes('--seed');
const idx = args.findIndex((a) => a === '--conversion' || a === '-c');
const conversionId = idx >= 0 ? args[idx + 1] : null;

if (!all && !conversionId) {
  printUsage();
  process.exit(1);
}

const ids = conversionId ? [conversionId] : listConversionIds();

if (!ids.length) {
  console.error('No conversions found.');
  process.exit(1);
}

let exitCode = 0;

for (const id of ids) {
  const dir = conversionDirForId(id);
  let manifest = loadConversionManifest(dir);

  if (seed) {
    manifest = seedCoverageElements(manifest);
  }

  const coverage = computeCoverage(manifest);
  manifest.coverage = coverage;

  if (write || seed) {
    saveConversionManifest(dir, manifest);
  }

  console.log(
    `${id}: ${coverage.percent}% (${coverage.completed}/${coverage.total}) referenceVersion=${manifest.referenceVersion}`,
  );

  const stored = loadConversionManifest(dir);
  if (!write && !seed && stored.coverage) {
    const storedPercent = stored.coverage.percent;
    const storedCompleted = stored.coverage.completed;
    if (storedPercent !== coverage.percent || storedCompleted !== coverage.completed) {
      console.warn(`  WARN: stored coverage stale (${storedPercent}% ${storedCompleted}/${stored.coverage.total}) — run with --write`);
    }
  }
}

process.exit(exitCode);
