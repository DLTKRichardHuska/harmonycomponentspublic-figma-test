#!/usr/bin/env node
/** Validate Harmony converter structure and manifests. Agents invoke via Shell only. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONVERTER_TYPES,
  REGISTRY_STATUSES,
  CONVERTER_ID_PATTERN,
  converterPlaybookPath,
  converterVerificationPlaybookPath,
  converterVerifierAgentPath,
  loadConverterManifest,
  listConverterIds,
  converterDirForId,
} from './_lib.mjs';

function validateConverterFields(manifest, result) {
  for (const field of ['id', 'name', 'type', 'status', 'description', 'conversion', 'readiness']) {
    if (!(field in manifest)) result.errors.push(`Manifest missing required field: ${field}`);
  }
  if (manifest.id && !CONVERTER_ID_PATTERN.test(manifest.id)) {
    result.errors.push(`Invalid manifest id: ${manifest.id}`);
  }
  if (!CONVERTER_TYPES.has(manifest.type)) result.errors.push(`Invalid type: ${manifest.type}`);
  if (!REGISTRY_STATUSES.has(manifest.status)) result.errors.push(`Invalid status: ${manifest.status}`);
  if (!manifest.readiness?.level) result.errors.push('readiness.level required');
}

function validateComponentLibraryConverter(manifest, converterDir, result) {
  if (!manifest.conversion?.outputId) {
    result.errors.push('component-library converter requires conversion.outputId');
  }
  if (!manifest.conversion?.outputPath) {
    result.errors.push('component-library converter requires conversion.outputPath');
  }
  if (!manifest.elementStrategies?.allowed?.length) {
    result.errors.push(
      'component-library converter requires elementStrategies.allowed (converter-specific strategy vocabulary)',
    );
  }
  if (existsSync(join(converterDir, 'package.json'))) {
    result.errors.push('Converter folder must not have package.json (output lives in conversions/)');
  }
  if (existsSync(join(converterDir, 'src'))) {
    result.errors.push('Converter folder must not have src/ (output lives in conversions/)');
  }
}

function validateExternalConverter(manifest, converterDir, result) {
  if (!manifest.host?.system) result.errors.push('external converter requires host.system');
  if (!existsSync(join(converterDir, 'external.config.json'))) {
    result.errors.push('Missing external.config.json');
  }
  if (manifest.conversion?.outputId) {
    result.warnings.push('external converter should not set conversion.outputId');
  }
}

function validatePlaybooks(manifest, converterDir, result) {
  for (const [label, path] of [
    ['playbook', converterPlaybookPath(converterDir, manifest)],
    ['verification playbook', converterVerificationPlaybookPath(converterDir, manifest)],
    ['verifier agent', converterVerifierAgentPath(converterDir, manifest)],
  ]) {
    if (!existsSync(path)) result.errors.push(`Missing ${label}: ${path}`);
  }

  const readiness = manifest.readiness?.level;
  if (manifest.status === 'active' && readiness === 'not-ready') {
    result.warnings.push(
      'Status is active but converter readiness.level is not-ready (conversion status may differ)',
    );
  }
}

function validateConverter(converterId) {
  const result = { converterId, errors: [], warnings: [] };
  const cdir = converterDirForId(converterId);
  if (!existsSync(cdir)) {
    result.errors.push(`Converter directory not found: ${cdir}`);
    return result;
  }

  const manifestPath = join(cdir, 'converter.manifest.json');
  if (!existsSync(manifestPath)) {
    result.errors.push('Missing converter.manifest.json');
    return result;
  }

  let manifest;
  try {
    manifest = loadConverterManifest(cdir);
  } catch (e) {
    result.errors.push(`Invalid converter.manifest.json: ${e.message}`);
    return result;
  }

  if (manifest.id !== converterId) {
    result.errors.push(`Manifest id '${manifest.id}' does not match '${converterId}'`);
  }

  validateConverterFields(manifest, result);
  validatePlaybooks(manifest, cdir, result);

  if (manifest.type === 'component-library') validateComponentLibraryConverter(manifest, cdir, result);
  else if (manifest.type === 'external') validateExternalConverter(manifest, cdir, result);

  return result;
}

function printResult(result, verbose) {
  if (verbose) console.log(`\n=== converter: ${result.converterId} ===`);
  for (const e of result.errors) console.log(`  ERROR: ${e}`);
  for (const w of result.warnings) console.log(`  WARN:  ${w}`);
  if (!result.errors.length && verbose) console.log('  PASS');
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const quiet = args.includes('--quiet') || args.includes('-q');
const idx = args.findIndex((a) => a === '--converter' || a === '--target' || a === '-t');
const converterId = idx >= 0 ? args[idx + 1] : null;

if (!all && !converterId) {
  console.error('Specify --converter <id> or --all');
  process.exit(1);
}

const ids = converterId ? [converterId] : listConverterIds();

if (!ids.length) {
  console.error('No converters found.');
  process.exit(1);
}

let allOk = true;
for (const id of ids) {
  const result = validateConverter(id);
  if (!quiet || result.errors.length) printResult(result, !quiet);
  if (result.errors.length) allOk = false;
}

if (allOk) {
  if (!quiet) console.log('\nAll converters valid.');
  process.exit(0);
}
if (!quiet) console.log('\nValidation failed.');
process.exit(1);
