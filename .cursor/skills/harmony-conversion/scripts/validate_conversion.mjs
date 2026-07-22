#!/usr/bin/env node
/** Validate Harmony conversion output structure and manifests. Agents invoke via Shell only. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONVERTER_ID_PATTERN,
  ELEMENT_STATUSES,
  REGISTRY_STATUSES,
  computeCoverage,
  getConverterMuiPolicy,
  getFoundationElementNames,
  loadConversionManifest,
  listConversionIds,
  conversionDirForId,
  converterDirForId,
  findNestedPackageJsons,
  scanParentSrcImports,
  loadVersionHelpers,
  parseSemverMajor,
  resolveLatestMuiVersion,
  loadConverterManifestById,
} from './_lib.mjs';

async function validateComponentLibraryVersions(manifest, pkg, conversionId, result) {
  if (pkg.version !== manifest.referenceVersion) {
    result.errors.push(
      `package.json.version (${pkg.version}) !== referenceVersion (${manifest.referenceVersion}) — run sync_conversion_versions.mjs --conversion ${conversionId}`,
    );
  }

  const { getConversionPackageVersion } = await loadVersionHelpers();
  const expected = getConversionPackageVersion({});
  if (manifest.referenceVersion !== expected) {
    result.warnings.push(
      `referenceVersion (${manifest.referenceVersion}) !== repo effective version (${expected}) — run sync_conversion_versions.mjs --conversion ${conversionId}`,
    );
  }
}

function validateComponentLibraryMuiVersion(manifest, pkg, conversionId, result, checkLatest) {
  const policy = getConverterMuiPolicy(manifest.converterId ?? conversionId);
  if (!policy) return;

  const materialRange = pkg.dependencies?.['@mui/material'];
  const iconsRange = pkg.dependencies?.['@mui/icons-material'];

  if (!materialRange) {
    result.errors.push(
      `@mui/material dependency required for MUI converter (policy major ${policy.major}) — add to package.json`,
    );
    return;
  }

  const materialMajor = parseSemverMajor(materialRange);
  if (materialMajor !== policy.major) {
    result.errors.push(
      `@mui/material (${materialRange}) major ${materialMajor} !== converter policy major ${policy.major} — update to ^${policy.major}.x`,
    );
  }

  if (iconsRange) {
    const iconsMajor = parseSemverMajor(iconsRange);
    if (iconsMajor !== materialMajor) {
      result.errors.push(
        `@mui/icons-material (${iconsRange}) major ${iconsMajor} !== @mui/material major ${materialMajor} — align versions`,
      );
    }
  } else {
    result.warnings.push('@mui/icons-material not in dependencies — recommended for MUI conversions');
  }

  if (checkLatest && policy.track === 'latest' && materialMajor === policy.major) {
    const latest = resolveLatestMuiVersion(policy.major);
    if (latest) {
      const installedFloor = materialRange.replace(/^[\^~]/, '');
      if (installedFloor && latest !== installedFloor && !latest.startsWith(installedFloor.split('.').slice(0, 2).join('.'))) {
        const latestMajor = parseSemverMajor(latest);
        const floorMajor = parseSemverMajor(installedFloor);
        if (latestMajor === floorMajor) {
          const [, , patchLatest] = latest.split('.').map(Number);
          const [, , patchFloor] = installedFloor.split('.').map(Number);
          if (!Number.isNaN(patchLatest) && !Number.isNaN(patchFloor) && patchLatest > patchFloor) {
            result.warnings.push(
              `@mui/material range floor (${materialRange}) is behind latest v${policy.major} (${latest}) — consider bumping to ^${latest}`,
            );
          }
        }
      }
    }
  }
}

function validatePackagePublishMetadata(pkg, conversionId, result) {
  if (!pkg.name?.startsWith('@')) {
    result.errors.push('package name must be scoped (@org/name) for GitHub Packages');
  }
  if (pkg.private === true) {
    result.errors.push('package.json private: true — conversion packages must be publishable to GitHub Packages');
  }
  const registry = pkg.publishConfig?.registry;
  if (registry !== 'https://npm.pkg.github.com/') {
    result.errors.push('publishConfig.registry must be https://npm.pkg.github.com/');
  }
}

/**
 * Validate element strategy against the linked converter's elementStrategies.
 * Shared schema only requires string|null — vocabulary is per converter.
 */
function validateElementStrategy(key, el, elements, result, strategyPolicy) {
  const strategy = el.strategy;
  if (strategy == null) {
    // null / omitted is fine until plan records a choice
  } else if (strategyPolicy) {
    const forbidden = strategyPolicy.forbidden ?? [];
    const deprecated = strategyPolicy.deprecated ?? [];
    const allowed = strategyPolicy.allowed ?? [];
    if (forbidden.includes(strategy)) {
      result.errors.push(
        `elements.${key}.strategy '${strategy}' is forbidden for this converter — allowed: ${allowed.join(', ') || '(none)'}`,
      );
    } else if (deprecated.includes(strategy)) {
      result.warnings.push(
        `elements.${key}.strategy '${strategy}' is deprecated for this converter — migrate to one of: ${allowed.join(', ')}`,
      );
    } else if (!allowed.includes(strategy)) {
      result.errors.push(
        `elements.${key}.strategy '${strategy}' is not allowed for this converter — allowed: ${allowed.join(', ')}`,
      );
    }
  }

  if (el.status !== 'synced') return;

  const blockedBy = el.blockedBy ?? [];
  for (const dep of blockedBy) {
    const depEl = elements[dep];
    if (!depEl) {
      result.warnings.push(`elements.${key}.blockedBy references unknown element: ${dep}`);
      continue;
    }
    if (depEl.status !== 'synced') {
      result.errors.push(
        `elements.${key}.status is 'synced' but blockedBy dependency '${dep}' is '${depEl.status}' — convert dependency first`,
      );
    }
  }

  const composites = el.compositeEquivalents ?? [];
  for (const composite of composites) {
    for (const dep of composite.dependsOn ?? []) {
      const depEl = elements[dep];
      if (!depEl) {
        result.warnings.push(
          `elements.${key}.compositeEquivalents depends on unknown element: ${dep}`,
        );
        continue;
      }
      if (depEl.status !== 'synced') {
        result.errors.push(
          `elements.${key}.status is 'synced' but compositeEquivalents depends on '${dep}' (${depEl.status}) — convert dependency first`,
        );
      }
    }
  }
}

/**
 * A `synced` element must carry verification evidence: a `verificationReport`
 * pointing to an existing report file, plus a `lastVerified` timestamp.
 * A `gap` element must record the accepted `userDecision`.
 * This prevents marking elements complete without proof they synced correctly.
 */
function validateElementVerification(key, el, conversionDir, result) {
  if (el.status === 'synced') {
    if (!el.verificationReport) {
      result.errors.push(
        `elements.${key}.status is 'synced' but verificationReport is missing — verify via harmony-design-system-react-mui-verifier before marking synced`,
      );
    } else if (conversionDir && !existsSync(join(conversionDir, el.verificationReport))) {
      result.errors.push(
        `elements.${key}.verificationReport not found: ${el.verificationReport}`,
      );
    }
    if (!el.lastVerified) {
      result.errors.push(`elements.${key}.status is 'synced' but lastVerified is missing`);
    }
  }
  if (el.status === 'gap' && !el.userDecision) {
    result.errors.push(
      `elements.${key}.status is 'gap' but userDecision is missing — record the accepted gap rationale`,
    );
  }
}

function validateConversionFields(manifest, result, conversionDir) {
  for (const field of [
    'id',
    'name',
    'type',
    'status',
    'description',
    'converterId',
    'referenceVersion',
    'coverage',
    'elements',
  ]) {
    if (!(field in manifest)) result.errors.push(`Manifest missing required field: ${field}`);
  }
  if (manifest.coverage) {
    const c = manifest.coverage;
    for (const f of ['percent', 'completed', 'total', 'computedAt']) {
      if (!(f in c)) result.errors.push(`coverage missing field: ${f}`);
    }
    if (typeof c.percent === 'number') {
      const computed = computeCoverage(manifest);
      if (c.percent !== computed.percent || c.completed !== computed.completed || c.total !== computed.total) {
        result.warnings.push(
          `coverage stale: stored ${c.percent}% (${c.completed}/${c.total}), computed ${computed.percent}% (${computed.completed}/${computed.total}) — run compute_coverage.mjs --write`,
        );
      }
    }
  }
  if (manifest.id && !CONVERTER_ID_PATTERN.test(manifest.id)) {
    result.errors.push(`Invalid manifest id: ${manifest.id}`);
  }
  if (!REGISTRY_STATUSES.has(manifest.status)) result.errors.push(`Invalid status: ${manifest.status}`);

  let strategyPolicy = null;
  if (manifest.converterId) {
    try {
      const converter = loadConverterManifestById(manifest.converterId);
      strategyPolicy = converter?.elementStrategies ?? null;
      if (converter?.type === 'component-library' && !strategyPolicy?.allowed?.length) {
        result.errors.push(
          `Linked converter '${manifest.converterId}' missing elementStrategies.allowed — declare converter-specific strategy vocabulary`,
        );
      }
    } catch (e) {
      result.warnings.push(`Could not load converter for strategy policy: ${e.message}`);
    }
  }

  const elements = manifest.elements ?? {};
  if (elements.foundation) {
    result.errors.push(
      'elements.foundation is removed — use Colors, Typography, Spacing, Elevations, Dela (one key per foundation nav page)',
    );
  }

  for (const key of getFoundationElementNames()) {
    const el = elements[key];
    if (!el) {
      result.errors.push(`elements.${key} required (foundation nav page)`);
      continue;
    }
    if (!ELEMENT_STATUSES.has(el.status)) {
      result.errors.push(`elements.${key}.status invalid: ${el.status}`);
    }
    if (!el.harmonySource) {
      result.errors.push(`elements.${key}.harmonySource required`);
    }
    validateElementVerification(key, el, conversionDir, result);
    validateElementStrategy(key, el, elements, result, strategyPolicy);
  }

  for (const [key, el] of Object.entries(elements)) {
    if (getFoundationElementNames().includes(key)) continue;
    if (!ELEMENT_STATUSES.has(el.status)) {
      result.errors.push(`elements.${key}.status invalid: ${el.status}`);
    }
    if (!el.harmonySource) {
      result.errors.push(`elements.${key}.harmonySource required`);
    }
    validateElementVerification(key, el, conversionDir, result);
    validateElementStrategy(key, el, elements, result, strategyPolicy);
  }
}

const BANNED_DEMO_WRAPPERS = [
  'EnhancedActions',
  'AlertActionButton',
  'HarmonyProgress',
  'BtnIcon',
  'IconGrid',
  'Row',
  'ExampleBlock',
  'DismissibleAlert',
];

/** sx/style patterns that emulate Harmony catalog props in example demonstrations. */
const FIDELITY_STYLING_PATTERNS = [
  /<LinearProgress\b[^>]*\bsx=\{\{[^}]*\b(height|width)\s*:/,
  /<CircularProgress\b[^>]*\bsx=\{\{[^}]*\b(height|width)\s*:/,
];

/** Docs-only staging classNames for hover/focus/pressed — banned under examples purity. */
const DEMO_STAGING_CLASS_PATTERN =
  /(?:className|class)\s*=\s*['"`][^'"`]*(?:demo[-_]?(?:hover|focus|pressed)|--demo-(?:hover|focus|pressed))[^'"`]*['"`]/i;

/** Theme selectors that exist only to support docs staging classes. */
const THEME_STAGING_SELECTOR_PATTERN =
  /(?:demo[-_]?(?:hover|focus|pressed)|--demo-(?:hover|focus|pressed))/i;

/** Props not documented on MUI components — must be skip or custom export, not invented on @mui/material. */
const INVENTED_MUI_PROP_PATTERNS = [/<LinearProgress\b[^>]*\bsize=/];

const BANNED_DEMO_THEME_IMPORTS = ['harmonyProgressHeights'];

/**
 * React+MUI: component demo files must not define local React components
 * or use fidelity styling in example demonstrations.
 */
function checkDemoExamplesPurity(conversionDir, manifest, result) {
  if (manifest.converterId !== 'harmony-design-system-react-mui') return;

  const convertedDir = join(conversionDir, 'src/demo/converted');
  if (!existsSync(convertedDir)) return;

  for (const scopeEntry of readdirSync(convertedDir, { withFileTypes: true })) {
    if (!scopeEntry.isDirectory() || scopeEntry.name === 'foundation') continue;
    const scopeDir = join(convertedDir, scopeEntry.name);
    for (const fileName of readdirSync(scopeDir)) {
      if (!fileName.endsWith('Demo.tsx')) continue;
      const relativePath = `src/demo/converted/${scopeEntry.name}/${fileName}`;
      const content = readFileSync(join(scopeDir, fileName), 'utf8');

      const localComponents = [
        ...content.matchAll(/^function\s+([A-Z]\w*)/gm),
        ...content.matchAll(/^const\s+([A-Z]\w*)\s*=/gm),
      ].map((match) => match[1]);

      for (const name of localComponents) {
        result.errors.push(
          `demo purity: ${relativePath} defines local component '${name}' — use @/demo/ui or foundation demo modules`,
        );
      }

      for (const banned of BANNED_DEMO_WRAPPERS) {
        if (
          content.includes(`function ${banned}`) ||
          content.includes(`<${banned}`) ||
          content.includes(`<${banned} `)
        ) {
          result.errors.push(`demo purity: ${relativePath} uses banned wrapper '${banned}'`);
        }
      }

      for (const bannedImport of BANNED_DEMO_THEME_IMPORTS) {
        if (content.includes(bannedImport)) {
          result.errors.push(
            `demo purity: ${relativePath} imports theme internal '${bannedImport}' for example styling — use MUI/custom props or theme augmentation`,
          );
        }
      }

      for (const pattern of FIDELITY_STYLING_PATTERNS) {
        if (pattern.test(content)) {
          result.errors.push(
            `demo purity: ${relativePath} uses fidelity styling (sx/style) to emulate catalog props — use theme overrides for documented MUI props or AskQuestion for skip/custom`,
          );
          break;
        }
      }

      if (DEMO_STAGING_CLASS_PATTERN.test(content)) {
        result.errors.push(
          `demo purity: ${relativePath} uses docs staging className (demo-hover/focus/pressed) — omit static columns; verify via real interaction; do not stage pseudo-states (UnsupportedEquivalentCallout is for functional skips only)`,
        );
      }

      for (const pattern of INVENTED_MUI_PROP_PATTERNS) {
        if (pattern.test(content)) {
          result.errors.push(
            `demo purity: ${relativePath} uses invented prop on @mui/material component (e.g. LinearProgress size) — AskQuestion for skip or custom export`,
          );
          break;
        }
      }

      if (/description:\s*['"`][^'"`]*sx=\{\{/.test(content)) {
        result.errors.push(
          `demo purity: ${relativePath} mapping table documents sx={{ … }} as official equivalent — record theme augmentation in propMappings instead`,
        );
      }
    }
  }

  checkThemeStagingSelectors(conversionDir, result);
}

/** Fail theme mappers that embed docs-only staging class selectors. */
function checkThemeStagingSelectors(conversionDir, result) {
  const themeDir = join(conversionDir, 'src/theme');
  if (!existsSync(themeDir)) return;

  for (const fileName of readdirSync(themeDir)) {
    if (!fileName.startsWith('map') || !fileName.endsWith('ToTheme.ts')) continue;
    const relativePath = `src/theme/${fileName}`;
    const content = readFileSync(join(themeDir, fileName), 'utf8');
    if (THEME_STAGING_SELECTOR_PATTERN.test(content)) {
      result.errors.push(
        `theme purity: ${relativePath} embeds docs staging selector (demo-hover/focus/pressed) — remove staging-only hooks; real :hover/:focus-visible/Mui-disabled only`,
      );
    }
  }
}

function isNpmWorkspaceLayout(manifest) {
  return manifest.independence?.layout === 'npm-workspace';
}

function workspacePackagePath(manifest) {
  return manifest.independence?.packagePath ?? 'packages/ui';
}

function workspaceDemoPath(manifest) {
  return manifest.independence?.demoPath ?? 'apps/demo';
}

function validateComponentLibraryConversion(manifest, conversionDir, result) {
  if (manifest.independence?.standalone !== true) {
    result.errors.push('component-library conversion requires independence.standalone: true');
  }

  const pkgPath = join(conversionDir, 'package.json');
  if (!existsSync(pkgPath)) {
    result.errors.push('Missing root package.json');
    return;
  }

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    result.errors.push(`Invalid package.json: ${e.message}`);
    return;
  }

  for (const required of ['dev', 'build:lib']) {
    if (!pkg.scripts?.[required]) result.errors.push(`package.json missing script: ${required}`);
  }

  const deliverables = manifest.deliverables ?? {};
  for (const field of ['npmPackageName', 'scripts', 'exports']) {
    if (!(field in deliverables)) result.errors.push(`deliverables missing: ${field}`);
  }

  const consumer = manifest.documentation?.consumerGuide;
  if (consumer && !existsSync(join(conversionDir, consumer))) {
    result.errors.push(`Consumer guide not found: ${consumer}`);
  }

  if (isNpmWorkspaceLayout(manifest)) {
    const packageRel = workspacePackagePath(manifest);
    const demoRel = workspaceDemoPath(manifest);
    const libDir = join(conversionDir, packageRel);
    const demoDir = join(conversionDir, demoRel);

    if (!existsSync(join(libDir, 'package.json'))) {
      result.errors.push(`npm-workspace layout missing publishable package.json: ${packageRel}/package.json`);
    } else {
      let libPkg;
      try {
        libPkg = JSON.parse(readFileSync(join(libDir, 'package.json'), 'utf8'));
      } catch (e) {
        result.errors.push(`Invalid ${packageRel}/package.json: ${e.message}`);
        libPkg = null;
      }
      if (libPkg) {
        if (!libPkg.exports) result.errors.push(`${packageRel}/package.json missing exports`);
        if (libPkg.private === true) {
          result.errors.push(`${packageRel}/package.json private: true — publishable package must not be private`);
        }
        if (deliverables.npmPackageName && libPkg.name !== deliverables.npmPackageName) {
          result.errors.push(
            `${packageRel}/package.json name (${libPkg.name}) !== deliverables.npmPackageName (${deliverables.npmPackageName})`,
          );
        }
      }
    }

    if (!pkg.workspaces) {
      result.errors.push('npm-workspace root package.json missing workspaces field');
    }

    for (const subdir of ['src/components', 'src/layouts', 'src/styles']) {
      if (!existsSync(join(libDir, subdir))) {
        result.errors.push(`Missing required directory: ${packageRel}/${subdir}`);
      }
    }
    if (!existsSync(join(demoDir, 'package.json'))) {
      result.errors.push(`npm-workspace layout missing demo package.json: ${demoRel}/package.json`);
    }
    if (!existsSync(join(demoDir, 'src'))) {
      result.errors.push(`Missing required directory: ${demoRel}/src`);
    }

    for (const p of findNestedPackageJsons(conversionDir)) {
      const norm = p.replace(/\\/g, '/');
      const parts = norm.split('/');
      // Allow only packages/<name>/package.json and apps/<name>/package.json
      const underPackages = parts[0] === 'packages' && parts.length === 3 && parts[2] === 'package.json';
      const underApps = parts[0] === 'apps' && parts.length === 3 && parts[2] === 'package.json';
      if (!underPackages && !underApps) {
        result.errors.push(`Nested package.json not allowed outside packages/* and apps/*: ${p}`);
      }
    }
  } else {
    if (!pkg.exports) result.errors.push('package.json missing exports');

    for (const subdir of ['src/components', 'src/layouts', 'src/styles', 'src/pages']) {
      if (!existsSync(join(conversionDir, subdir))) {
        result.errors.push(`Missing required directory: ${subdir}`);
      }
    }

    for (const p of findNestedPackageJsons(conversionDir)) {
      result.errors.push(`Nested package.json not allowed: ${p}`);
    }
  }

  for (const v of scanParentSrcImports(conversionDir)) {
    result.errors.push(`Independence violation: ${v}`);
  }

  checkDemoExamplesPurity(conversionDir, manifest, result);
}

function validateConverterLink(manifest, result) {
  const cdir = converterDirForId(manifest.converterId);
  if (!existsSync(join(cdir, 'converter.manifest.json'))) {
    result.errors.push(`Linked converter missing manifest: ${manifest.converterId}`);
  }
}

function validateConversion(conversionId) {
  const result = { conversionId, errors: [], warnings: [] };
  const dir = conversionDirForId(conversionId);
  if (!existsSync(dir)) {
    result.errors.push(`Conversion directory not found: ${dir}`);
    return result;
  }

  const manifestPath = join(dir, 'conversion.manifest.json');
  if (!existsSync(manifestPath)) {
    result.errors.push('Missing conversion.manifest.json');
    return result;
  }

  let manifest;
  try {
    manifest = loadConversionManifest(dir);
  } catch (e) {
    result.errors.push(`Invalid conversion.manifest.json: ${e.message}`);
    return result;
  }

  if (manifest.id !== conversionId) {
    result.errors.push(`Manifest id '${manifest.id}' does not match '${conversionId}'`);
  }

  validateConversionFields(manifest, result, dir);
  validateConverterLink(manifest, result);

  if (manifest.type === 'component-library') {
    validateComponentLibraryConversion(manifest, dir, result);
  }

  return result;
}

async function validateConversionAsync(conversionId, versionChecks, checkLatest) {
  const result = validateConversion(conversionId);
  if (result.errors.length) return result;

  const dir = conversionDirForId(conversionId);
  let manifest;
  try {
    manifest = loadConversionManifest(dir);
  } catch {
    return result;
  }

  if (manifest.type === 'component-library' && versionChecks) {
    const rootPkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    const publishPkgPath = isNpmWorkspaceLayout(manifest)
      ? join(dir, workspacePackagePath(manifest), 'package.json')
      : join(dir, 'package.json');
    const publishPkg = JSON.parse(readFileSync(publishPkgPath, 'utf8'));

    // Version train: publishable package must match referenceVersion; root may match too
    await validateComponentLibraryVersions(manifest, publishPkg, conversionId, result);
    if (isNpmWorkspaceLayout(manifest) && rootPkg.version !== manifest.referenceVersion) {
      result.warnings.push(
        `workspace root package.json.version (${rootPkg.version}) !== referenceVersion (${manifest.referenceVersion})`,
      );
    }
    validateComponentLibraryMuiVersion(manifest, publishPkg, conversionId, result, checkLatest);
    validatePackagePublishMetadata(publishPkg, conversionId, result);
  }

  return result;
}

function printResult(result, verbose) {
  if (verbose) console.log(`\n=== conversion: ${result.conversionId} ===`);
  for (const e of result.errors) console.log(`  ERROR: ${e}`);
  for (const w of result.warnings) console.log(`  WARN:  ${w}`);
  if (!result.errors.length && verbose) console.log('  PASS');
}

const args = process.argv.slice(2);
const all = args.includes('--all');
const quiet = args.includes('--quiet') || args.includes('-q');
const checkLatest = args.includes('--check-latest');
const idx = args.findIndex((a) => a === '--conversion' || a === '-c');
const conversionId = idx >= 0 ? args[idx + 1] : null;

if (!all && !conversionId) {
  console.error('Specify --conversion <id> or --all');
  process.exit(1);
}

const ids = conversionId ? [conversionId] : listConversionIds();

if (!ids.length) {
  console.error('No conversions found.');
  process.exit(1);
}

async function run() {
  let allOk = true;
  for (const id of ids) {
    const result = await validateConversionAsync(id, true, checkLatest);
    if (!quiet || result.errors.length) printResult(result, !quiet);
    if (result.errors.length) allOk = false;
  }

  if (allOk) {
    if (!quiet) console.log('\nAll conversions valid.');
    process.exit(0);
  }
  if (!quiet) console.log('\nValidation failed.');
  process.exit(1);
}

run();
