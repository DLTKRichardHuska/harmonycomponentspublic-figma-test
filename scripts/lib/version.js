#!/usr/bin/env node
/**
 * Project version helpers for CI, changelog automation, and release scripts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '../../package.json');

/** Changelog / unreleased work marker */
export const IN_PROGRESS_VERSION = 'in-progress';

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
const MAX_BRANCH_SLUG_LENGTH = 40;

let cachedPackageJson = null;

function readPackageJson() {
  if (!cachedPackageJson) {
    cachedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  }
  return cachedPackageJson;
}

/**
 * Last released semver from package.json.
 */
export function getBaseVersion() {
  return readPackageJson().version;
}

/**
 * Normalize branch names for prerelease identifiers.
 */
export function sanitizeBranchName(name) {
  if (!name || name === 'main' || name === 'HEAD') {
    return 'main';
  }

  return name
    .toLowerCase()
    .replace(/^refs\/heads\//, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_BRANCH_SLUG_LENGTH) || 'branch';
}

/**
 * Resolve current git branch name (best effort).
 */
export function getGitBranchName() {
  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }

  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }

  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'main';
  }
}

/**
 * CI run number or local fallback.
 */
export function getBuildNumber() {
  const runNumber = process.env.GITHUB_RUN_NUMBER;
  if (runNumber && /^\d+$/.test(runNumber)) {
    return runNumber;
  }
  return '0';
}

/**
 * Release tag from CI (e.g. v1.2.0) without leading v.
 */
export function getReleaseTagVersion() {
  const ref = process.env.GITHUB_REF || '';
  const tagMatch = ref.match(/^refs\/tags\/v(\d+\.\d+\.\d+)$/);
  if (tagMatch) {
    return tagMatch[1];
  }

  const releaseTag = process.env.RELEASE_VERSION || process.env.npm_package_version;
  if (releaseTag && SEMVER_PATTERN.test(releaseTag)) {
    return releaseTag;
  }

  return null;
}

/**
 * Effective version shown in the app and CI summaries.
 */
export function getEffectiveVersion(options = {}) {
  const base = options.baseVersion || getBaseVersion();
  const releaseVersion = getReleaseTagVersion();
  if (releaseVersion) {
    return releaseVersion;
  }

  const branch = sanitizeBranchName(options.branch || getGitBranchName());
  const buildNumber = options.buildNumber || getBuildNumber();

  if (branch === 'main') {
    return `${base}-in-progress`;
  }

  return `${base}-${branch}.${buildNumber}`;
}

/**
 * Version stored on new changelog entries until release promotion.
 */
export function getChangelogEntryVersion() {
  return IN_PROGRESS_VERSION;
}

/**
 * Parse semver from a release tag (v1.2.0 or 1.2.0).
 */
export function parseReleaseVersion(tagOrVersion) {
  if (!tagOrVersion) {
    return null;
  }

  const normalized = String(tagOrVersion).trim().replace(/^v/, '');
  return SEMVER_PATTERN.test(normalized) ? normalized : null;
}

/**
 * Compare semver strings for descending sort (newest first).
 */
export function compareSemverDesc(a, b) {
  const parse = (value) => value.split('.').map(Number);
  const [aMajor, aMinor, aPatch] = parse(a);
  const [bMajor, bMinor, bPatch] = parse(b);

  if (aMajor !== bMajor) return bMajor - aMajor;
  if (aMinor !== bMinor) return bMinor - aMinor;
  return bPatch - aPatch;
}

/**
 * Human-readable label for a changelog version bucket.
 */
export function getVersionDisplayLabel(version, baseVersion = getBaseVersion()) {
  if (version === IN_PROGRESS_VERSION) {
    return 'In progress';
  }
  return version;
}

/**
 * Effective version label for the Harmony repo release train (reference + in-repo conversions).
 */
export function getRepoEffectiveVersion(options = {}) {
  return getEffectiveVersion(options);
}

/**
 * Expected conversion package + manifest referenceVersion for the current repo state.
 * When releasing, pass releaseVersion (bare semver) via options.
 */
export function getConversionPackageVersion(options = {}) {
  if (options.releaseVersion) {
    return options.releaseVersion;
  }
  return getRepoEffectiveVersion(options);
}
