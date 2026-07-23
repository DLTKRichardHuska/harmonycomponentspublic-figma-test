/**
 * Shared utilities for harmony-conversion scripts (Node).
 * Agents invoke these via Shell — not a user-facing conversion interface.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const CONVERTER_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ELEMENT_STATUSES = new Set(['not-started', 'in-progress', 'synced', 'gap']);
export const CONVERTER_TYPES = new Set(['component-library', 'external']);
export const REGISTRY_STATUSES = new Set(['placeholder', 'dev-in-progress', 'active', 'deprecated']);

const SKIP_CONVERTER_DIRS = new Set(['_templates', 'reference', 'schema']);
const SKIP_CONVERSION_DIRS = new Set(['schema']);

export function repoRoot() {
  return join(__dirname, '..', '..', '..', '..');
}

export function convertersDir() {
  return join(repoRoot(), 'converters');
}

export function conversionsDir() {
  return join(repoRoot(), 'conversions');
}

export function listConverterIds() {
  if (!existsSync(convertersDir())) return [];
  return readdirSync(convertersDir())
    .filter((name) => !SKIP_CONVERTER_DIRS.has(name) && !name.startsWith('.'))
    .filter((name) => existsSync(join(convertersDir(), name, 'converter.manifest.json')))
    .sort();
}

export function listConversionIds() {
  if (!existsSync(conversionsDir())) return [];
  return readdirSync(conversionsDir())
    .filter((name) => !SKIP_CONVERSION_DIRS.has(name) && !name.startsWith('.'))
    .filter((name) => existsSync(join(conversionsDir(), name, 'conversion.manifest.json')))
    .sort();
}

export function converterDirForId(converterId) {
  return join(convertersDir(), converterId);
}

export function conversionDirForId(conversionId) {
  return join(conversionsDir(), conversionId);
}

export function loadConverterManifest(converterDir) {
  const path = join(converterDir, 'converter.manifest.json');
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function loadConversionManifest(conversionDir) {
  const path = join(conversionDir, 'conversion.manifest.json');
  return JSON.parse(readFileSync(path, 'utf8'));
}

export const DEFAULT_PLAYBOOK = 'playbook/SKILL.md';
export const DEFAULT_VERIFICATION_PLAYBOOK = 'playbook/VERIFICATION.md';
export const DEFAULT_VERIFIER_AGENT = 'playbook/VERIFIER.md';

export function converterPlaybookPath(converterDir, manifest) {
  const rel = manifest?.conversion?.playbook ?? DEFAULT_PLAYBOOK;
  return join(converterDir, rel);
}

export function converterVerificationPlaybookPath(converterDir, manifest) {
  const rel = manifest?.conversion?.verification?.playbook ?? DEFAULT_VERIFICATION_PLAYBOOK;
  return join(converterDir, rel);
}

export function converterVerifierAgentPath(converterDir, manifest) {
  const rel = manifest?.conversion?.verification?.agent ?? DEFAULT_VERIFIER_AGENT;
  return join(converterDir, rel);
}

export function conversionProjectPath(converterId) {
  const cdir = converterDirForId(converterId);
  if (!existsSync(join(cdir, 'converter.manifest.json'))) return null;
  const manifest = loadConverterManifest(cdir);
  const outputId = manifest.conversion?.outputId ?? converterId;
  const outputPath = manifest.conversion?.outputPath ?? `conversions/${outputId}`;
  return join(repoRoot(), outputPath);
}

function walkFiles(dir, extensions, skipDirs = new Set(['node_modules', '.git', 'dist', 'build'])) {
  const results = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!skipDirs.has(name)) results.push(...walkFiles(full, extensions, skipDirs));
    } else if (extensions.has(name.slice(name.lastIndexOf('.')).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

export function scanParentSrcImports(projectDir) {
  const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.astro', '.vue']);
  const violations = [];
  for (const file of walkFiles(projectDir, extensions)) {
    const text = readFileSync(file, 'utf8');
    const rel = relative(projectDir, file);
    text.split('\n').forEach((line, i) => {
      if (/\.\.\/\.\.\/\.\.\/src\//.test(line) || /\.\.\/\.\.\/\.\.\/\.\.\/src\//.test(line)) {
        violations.push(`${rel}:${i + 1}: imports parent Astro src/`);
      }
    });
  }
  return violations;
}

export function findNestedPackageJsons(projectDir) {
  const rootPkg = join(projectDir, 'package.json');
  const nested = [];
  for (const file of walkFiles(projectDir, new Set(['.json']))) {
    if (file.endsWith('package.json') && file !== rootPkg) {
      nested.push(relative(projectDir, file));
    }
  }
  return nested;
}

/** Parse exported component names from src/data/component-catalog.ts */
export function getExportedComponentNames() {
  const catalogPath = join(repoRoot(), 'src/data/component-catalog.ts');
  const text = readFileSync(catalogPath, 'utf8');
  const blockMatch = text.match(/export const componentCategories = \{([\s\S]*?)\} as const;/);
  if (!blockMatch) {
    throw new Error('Could not parse componentCategories from component-catalog.ts');
  }
  const names = [...blockMatch[1].matchAll(/'([A-Z][A-Za-z0-9]+)'/g)].map((m) => m[1]);
  return [...new Set(names)];
}

/** Fallback when navigation.ts cannot be parsed. */
const FOUNDATION_ELEMENTS_FALLBACK = ['Colors', 'Typography', 'Spacing', 'Elevations', 'Dela'];

/**
 * Foundation coverage keys from `src/data/navigation.ts` Foundation section titles.
 * Plan/verify scope alias `foundation` means all of these — not a manifest key.
 */
export function getFoundationElementNames() {
  const navPath = join(repoRoot(), 'src/data/navigation.ts');
  try {
    const text = readFileSync(navPath, 'utf8');
    const sectionMatch = text.match(
      /title:\s*'Foundation',\s*items:\s*\[([\s\S]*?)\],\s*\},/,
    );
    if (!sectionMatch) return [...FOUNDATION_ELEMENTS_FALLBACK];
    const titles = [...sectionMatch[1].matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);
    return titles.length ? titles : [...FOUNDATION_ELEMENTS_FALLBACK];
  } catch {
    return [...FOUNDATION_ELEMENTS_FALLBACK];
  }
}

/** Token foundation pages required before component conversion (excludes Dela). */
export function getFoundationTokenElementNames() {
  return getFoundationElementNames().filter((k) => k !== 'Dela');
}

export function isFoundationElement(elementKey) {
  return getFoundationElementNames().includes(elementKey);
}

/** Canonical coverage element keys: foundation pages + ShellLayout + exported components */
export function getCoverageElements() {
  return [...getFoundationElementNames(), 'ShellLayout', ...getExportedComponentNames()];
}

export function getReferenceVersion() {
  const pkgPath = join(repoRoot(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return pkg.version;
}

let versionHelpersPromise = null;

export function loadVersionHelpers() {
  if (!versionHelpersPromise) {
    const versionPath = pathToFileURL(join(repoRoot(), 'scripts/lib/version.js')).href;
    versionHelpersPromise = import(versionPath);
  }
  return versionHelpersPromise;
}

export async function getRepoEffectiveVersionLabel(options = {}) {
  const { getConversionPackageVersion } = await loadVersionHelpers();
  return getConversionPackageVersion(options);
}

export function loadConverterManifestById(converterId) {
  const dir = converterDirForId(converterId);
  if (!existsSync(join(dir, 'converter.manifest.json'))) return null;
  return loadConverterManifest(dir);
}

/** Parse major version from an npm semver range (e.g. "^9.2.0" -> 9). */
export function parseSemverMajor(range) {
  if (!range || typeof range !== 'string') return null;
  const cleaned = range.trim().replace(/^[\^~>=<]+/, '');
  const match = cleaned.match(/^(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * MUI version policy from a linked converter manifest.
 * Falls back to framework.muiVersion when muiVersionPolicy is absent.
 */
export function getConverterMuiPolicy(converterId) {
  const manifest = loadConverterManifestById(converterId);
  if (!manifest?.framework) return null;
  const { framework } = manifest;
  const policy = framework.muiVersionPolicy;
  const major =
    policy?.major ??
    (framework.muiVersion ? Number.parseInt(String(framework.muiVersion), 10) : null);
  if (!major || Number.isNaN(major)) return null;
  return { major, track: policy?.track ?? 'latest' };
}

/** Latest published version for a major series (e.g. major 9 -> "9.2.0"). Requires network. */
export function resolveLatestMuiVersion(major) {
  if (!major) return null;
  try {
    const raw = execSync(`npm view "@mui/material@${major}" version`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    const matches = [...raw.matchAll(/\b(\d+\.\d+\.\d+)\b/g)];
    return matches.length ? matches[matches.length - 1][1] : null;
  } catch {
    return null;
  }
}

export function muiDocsUrlForVersion(version) {
  const v = version ?? 'latest';
  return `https://llms.mui.com/material-ui/${v}/llms.txt`;
}

export function listExternalConverterIds() {
  return listConverterIds().filter((id) => {
    const manifest = loadConverterManifestById(id);
    return manifest?.type === 'external';
  });
}

export function listComponentLibraryConversionIds() {
  return listConversionIds().filter((id) => {
    const dir = conversionDirForId(id);
    const manifest = loadConversionManifest(dir);
    return manifest.type === 'component-library';
  });
}

export function foundationSlugForElement(elementKey) {
  return elementKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function harmonySourceForElement(elementKey) {
  if (isFoundationElement(elementKey)) {
    return `src/pages/foundation/${foundationSlugForElement(elementKey)}.astro`;
  }
  if (elementKey === 'ShellLayout') return 'src/layouts/ShellLayout.astro';
  return `src/components/ui/${elementKey}.astro`;
}

export function isElementComplete(element) {
  if (!element) return false;
  if (element.status === 'synced') return true;
  if (element.status === 'gap' && element.userDecision) return true;
  return false;
}

export function computeCoverage(manifest) {
  const keys = getCoverageElements();
  const elements = manifest.elements ?? {};
  let completed = 0;
  for (const key of keys) {
    if (isElementComplete(elements[key])) completed += 1;
  }
  const total = keys.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return {
    percent,
    completed,
    total,
    computedAt: new Date().toISOString(),
  };
}

/** Seed missing coverage element keys in manifest.elements (mutates copy). */
export function seedCoverageElements(manifest) {
  const elements = { ...manifest.elements };
  delete elements.foundation;
  for (const key of getCoverageElements()) {
    if (!elements[key]) {
      elements[key] = {
        status: 'not-started',
        harmonySource: harmonySourceForElement(key),
      };
    }
  }
  return { ...manifest, elements };
}

export function saveConversionManifest(conversionDir, manifest) {
  const path = join(conversionDir, 'conversion.manifest.json');
  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}
