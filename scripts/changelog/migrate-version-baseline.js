#!/usr/bin/env node
/**
 * One-time baseline migration to v0.9.0-only versioning.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IN_PROGRESS_VERSION } from '../lib/version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');
const changelogFile = path.join(rootDir, 'changelog-data/changelog.json');
const metadataFile = path.join(rootDir, 'changelog-data/metadata.json');
const changelogMdFile = path.join(rootDir, 'CHANGELOG.md');

const BASELINE_VERSION = '0.9.0';
const LEGACY_VERSIONS = new Set(['recent', 'unreleased', IN_PROGRESS_VERSION]);

function createRefactorEntry() {
  const date = new Date().toISOString();
  return {
    id: `${date.split('T')[0]}-system-release-process-baseline0001`,
    version: BASELINE_VERSION,
    date,
    category: 'changed',
    type: 'system',
    target: 'Release process',
    title: 'Refactored for initial release',
    description: 'Refactored for initial release (versioning workflow, CI, and changelog grouping).',
    breaking: false,
  };
}

function migrateChangelogJson() {
  const changelog = JSON.parse(fs.readFileSync(changelogFile, 'utf-8'));
  let remapped = 0;

  changelog.entries = (changelog.entries || []).map((entry) => {
    if (LEGACY_VERSIONS.has(entry.version)) {
      remapped += 1;
      return { ...entry, version: BASELINE_VERSION };
    }
    return entry;
  });

  const refactorEntry = createRefactorEntry();
  const hasRefactorEntry = changelog.entries.some(
    (entry) => entry.id === refactorEntry.id || entry.title === refactorEntry.title
  );

  if (!hasRefactorEntry) {
    changelog.entries.push(refactorEntry);
  }

  fs.writeFileSync(changelogFile, JSON.stringify(changelog, null, 2));
  console.log(`Remapped ${remapped} legacy entries to ${BASELINE_VERSION}`);
}

function migrateMetadata() {
  const metadata = fs.existsSync(metadataFile)
    ? JSON.parse(fs.readFileSync(metadataFile, 'utf-8'))
    : {};

  metadata.currentReleasedVersion = BASELINE_VERSION;
  metadata.lastReleaseDate = '2026-01-27';
  metadata.lastReleaseTag = 'v0.9.0';
  metadata.lastUpdated = new Date().toISOString();
  metadata.totalEntries = JSON.parse(fs.readFileSync(changelogFile, 'utf-8')).entries.length;

  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
}

function migrateChangelogMd() {
  const content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/0.9.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.0] - 2026-01-27

### Added
- Initial release of @deltek/harmony-components as an installable npm package
- 40+ production-ready UI components for Astro applications
- 2 layout templates (ShellLayout, DocsLayout)
- Complete design token system (colors, typography, spacing, elevations)
- Multi-theme support (CP, VP, PPM, Maconomy)
- Light and dark mode support for all themes
- Comprehensive CSS system with vanilla CSS (no framework dependencies)
- Public assets (logos, icons) included in package
- Git + npm installation support for private repositories
- **Button**: Dela variants \`dela\` (4px radius) and \`dela-pill\` (fully rounded) with gradient background and Stars graphic for launching AI/Dela features.
- **ShellPanel**: Dela variant (\`variant="dela"\`) for the Digital Assistant panel with gradient header, Dela chat content, and related design tokens.

### Changed
- **Dialog**: Sticky header and footer (always visible); only the body scrolls when content overflows.
- **Dialog**: Min width 600px, default max width 700px (design tokens).
- **Dialog**: All dialog styles use design tokens only; new tokens include \`--dialog-min-width\`, \`--dialog-max-width-default\`, \`--dialog-margin\`, \`--dialog-margin-horizontal\`, \`--dialog-margin-vertical\`, \`--dialog-max-width-medium\`, \`--dialog-footer-btn-min-width\`.
- **Component catalog:** Added \`src/data/component-catalog.ts\` as the canonical categorized list (49 exported UI components).
- **RightSidebar**: Dela AI icon now uses \`DStar_LM.svg\` with updated active-state styling and \`--linear-new\` token.
- **Card Component**: Header styling aligned with documentation (neutral header styling; \`primary\` adds theme top border only).
- **Release process:** Refactored for initial release (versioning workflow, CI, and changelog grouping).

### Removed
- **Monorepo subprojects:** Removed \`harmony-designer-starter/\` and \`harmony-react-conversion/\` from the active repo. Cursor bundles are archived under \`archive/\`.

### Fixed
- **Button (Dela variants)**: Text and icon stay white in dark mode via \`--dela-header-content-fg\`.
- **ShellPanel (Dela variant)**: Panel layout, scroll behavior, dark mode tokens, and input box structure updates.
- **Card Component**: Neutral header element styles and font sizing for \`headerTitle\`.
- **CSS Reset**: Removed h1–h6 font-size declarations from reset.css so component typography controls sizing.

### Components Included

**Form Controls:**
- Button, ButtonGroup
- Input, Textarea, NumberInput, RangeInput
- Checkbox, RadioButton, Toggle
- DateInput, Label

**Display:**
- Card, Badge, NotificationBadge, Chip
- Alert, Tooltip, Spinner, ProgressBar
- Table, Icon

**Navigation:**
- TabStrip, Stepper, Step, FloatingNav, Link

**Layout:**
- LeftSidebar, RightSidebar
- ShellPageHeader, ShellPanel

**Interactive:**
- Dialog, Dropdown, Accordion
- Kanban, KanbanCard

### Design Tokens
- Colors: Theme-specific palettes, semantic colors, light/dark modes
- Typography: Font families (Figtree, Lexend, JetBrains Mono), sizes, weights
- Spacing: Consistent spacing scale from 2px to 96px, border radius values
- Elevations: Shadow system for depth and hierarchy

### Layouts
- **ShellLayout**: Enterprise application shell with configurable header, footer, sidebars, and floating navigation
- **DocsLayout**: Documentation page layout

### Distribution
- Installable via git tag from GitHub repository
- Supports version pinning with git tags
- Documentation for developers on installation and usage

[0.9.0]: https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test/releases/tag/v0.9.0
`;

  fs.writeFileSync(changelogMdFile, content);
}

function main() {
  console.log('Migrating changelog baseline to v0.9.0...\n');
  migrateChangelogJson();
  migrateMetadata();
  migrateChangelogMd();
  console.log('\nBaseline migration complete.');
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
  main();
}

export { main as migrateVersionBaseline };
