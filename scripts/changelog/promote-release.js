#!/usr/bin/env node
/**
 * Promote in-progress changelog entries to an official release version.
 * Updates changelog.json, metadata.json, package.json, and CHANGELOG.md.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  IN_PROGRESS_VERSION,
  parseReleaseVersion,
} from '../lib/version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');
const changelogFile = path.join(rootDir, 'changelog-data/changelog.json');
const metadataFile = path.join(rootDir, 'changelog-data/metadata.json');
const packageJsonFile = path.join(rootDir, 'package.json');
const changelogMdFile = path.join(rootDir, 'CHANGELOG.md');

function parseArgs() {
  const versionIndex = process.argv.indexOf('--version');
  if (versionIndex === -1 || !process.argv[versionIndex + 1]) {
    console.error('Usage: node scripts/changelog/promote-release.js --version X.Y.Z');
    process.exit(1);
  }

  const version = parseReleaseVersion(process.argv[versionIndex + 1]);
  if (!version) {
    console.error('Invalid semver. Expected format: X.Y.Z (optional leading v).');
    process.exit(1);
  }

  return version;
}

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function categoryHeading(category) {
  const labels = {
    added: 'Added',
    changed: 'Changed',
    deprecated: 'Deprecated',
    removed: 'Removed',
    fixed: 'Fixed',
    security: 'Security',
  };
  return labels[category] || 'Changed';
}

function buildReleaseBulletsFromEntries(entries) {
  const grouped = new Map();

  for (const entry of entries) {
    const heading = categoryHeading(entry.category);
    if (!grouped.has(heading)) {
      grouped.set(heading, []);
    }
    const breaking = entry.breaking ? ' **[BREAKING]**' : '';
    grouped.get(heading).push(
      `- **${entry.target}**: ${entry.description}${breaking}`
    );
  }

  return grouped;
}

function formatReleaseSection(version, date, promotedEntries, unreleasedContent) {
  const lines = [`## [${version}] - ${date}`, ''];
  const grouped = buildReleaseBulletsFromEntries(promotedEntries);

  if (grouped.size === 0 && unreleasedContent.trim()) {
    return `## [${version}] - ${date}\n\n${unreleasedContent.trim()}\n`;
  }

  for (const [heading, bullets] of grouped) {
    lines.push(`### ${heading}`);
    lines.push(...bullets);
    lines.push('');
  }

  if (unreleasedContent.trim()) {
    lines.push(unreleasedContent.trim());
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function updateChangelogMd(version, date, promotedEntries) {
  const content = fs.readFileSync(changelogMdFile, 'utf-8');
  const unreleasedMatch = content.match(/## \[Unreleased\]\s*\n([\s\S]*?)(?=\n## \[|\n\[|$)/);

  let unreleasedBody = '';
  if (unreleasedMatch) {
    unreleasedBody = unreleasedMatch[1].trim();
  }

  const releaseSection = formatReleaseSection(version, date, promotedEntries, unreleasedBody);
  const emptyUnreleased = '## [Unreleased]\n\n';

  let updated = content;
  if (unreleasedMatch) {
    updated = updated.replace(/## \[Unreleased\]\s*\n[\s\S]*?(?=\n## \[|\n\[|$)/, emptyUnreleased);
  } else {
    updated = updated.replace(
      /(and this project adheres to[^\n]+\n\n)/,
      `$1${emptyUnreleased}`
    );
  }

  const insertPoint = updated.indexOf(emptyUnreleased) + emptyUnreleased.length;
  updated = `${updated.slice(0, insertPoint)}${releaseSection}\n${updated.slice(insertPoint)}`;

  const linkLine = `[${version}]: https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test/releases/tag/v${version}`;
  if (updated.includes(`[${version}]:`)) {
    updated = updated.replace(new RegExp(`\\[${version.replace(/\./g, '\\.')}\\]:[^\n]+`), linkLine);
  } else {
    updated = `${updated.trim()}\n\n${linkLine}\n`;
  }

  fs.writeFileSync(changelogMdFile, updated);
}

function promoteRelease(version) {
  const changelog = loadJson(changelogFile, { entries: [] });
  const inProgressEntries = changelog.entries.filter(
    (entry) => entry.version === IN_PROGRESS_VERSION
  );

  if (inProgressEntries.length === 0) {
    console.warn('No in-progress entries found to promote.');
  }

  const releaseDate = new Date().toISOString().split('T')[0];

  changelog.entries = changelog.entries.map((entry) => {
    if (entry.version === IN_PROGRESS_VERSION) {
      return { ...entry, version };
    }
    return entry;
  });

  fs.writeFileSync(changelogFile, JSON.stringify(changelog, null, 2));

  const metadata = loadJson(metadataFile, {});
  metadata.currentReleasedVersion = version;
  metadata.lastReleaseDate = releaseDate;
  metadata.lastReleaseTag = `v${version}`;
  metadata.lastUpdated = new Date().toISOString();
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

  const packageJson = loadJson(packageJsonFile, {});
  packageJson.version = version;
  fs.writeFileSync(packageJsonFile, `${JSON.stringify(packageJson, null, 2)}\n`);

  updateChangelogMd(version, releaseDate, inProgressEntries);

  console.log(`Promoted ${inProgressEntries.length} entries to v${version}`);
  console.log(`Updated package.json, metadata.json, and CHANGELOG.md`);
}

if (import.meta.url.startsWith('file:') && process.argv[1]) {
  const scriptPath = fileURLToPath(import.meta.url);
  if (path.resolve(process.argv[1]) === scriptPath) {
    promoteRelease(parseArgs());
  }
}

export { promoteRelease };
