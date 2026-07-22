/**
 * Project version helpers for Astro pages (mirrors scripts/lib/version.js).
 */

import packageJson from '../../package.json';

export const IN_PROGRESS_VERSION = 'in-progress';

const MAX_BRANCH_SLUG_LENGTH = 40;

export function getBaseVersion(): string {
  return packageJson.version;
}

export function sanitizeBranchName(name: string): string {
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

function getReleaseTagVersion(): string | null {
  const ref = import.meta.env.GITHUB_REF ?? '';
  const tagMatch = ref.match(/^refs\/tags\/v(\d+\.\d+\.\d+)$/);
  if (tagMatch) {
    return tagMatch[1];
  }

  const releaseVersion = import.meta.env.RELEASE_VERSION;
  if (releaseVersion && /^\d+\.\d+\.\d+$/.test(releaseVersion)) {
    return releaseVersion;
  }

  return null;
}

function getBranchName(): string {
  return (
    import.meta.env.GITHUB_REF_NAME ||
    import.meta.env.PUBLIC_BRANCH_NAME ||
    'main'
  );
}

function getBuildNumber(): string {
  const runNumber = import.meta.env.GITHUB_RUN_NUMBER;
  if (runNumber && /^\d+$/.test(runNumber)) {
    return runNumber;
  }
  return '0';
}

/**
 * Version string shown in the docs site UI.
 */
export function getEffectiveVersion(): string {
  const releaseVersion = getReleaseTagVersion();
  if (releaseVersion) {
    return releaseVersion;
  }

  const base = getBaseVersion();
  const branch = sanitizeBranchName(getBranchName());
  const buildNumber = getBuildNumber();

  if (branch === 'main') {
    return `${base}-in-progress`;
  }

  return `${base}-${branch}.${buildNumber}`;
}

export function compareSemverDesc(a: string, b: string): number {
  const parse = (value: string) => value.split('.').map(Number);
  const [aMajor, aMinor, aPatch] = parse(a);
  const [bMajor, bMinor, bPatch] = parse(b);

  if (aMajor !== bMajor) return bMajor - aMajor;
  if (aMinor !== bMinor) return bMinor - aMinor;
  return bPatch - aPatch;
}

export function isSemverVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

export function getVersionDisplayLabel(version: string): string {
  if (version === IN_PROGRESS_VERSION) {
    return 'In progress';
  }
  return version;
}
