# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/0.9.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Dialog**: Footer action buttons always use `gap: var(--space-3)` between siblings for default and custom footers (including mobile); custom footer slot wrappers inherit the same flex layout as `.dialog__footer-actions`.

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
- **Button**: Dela variants `dela` (4px radius) and `dela-pill` (fully rounded) with gradient background and Stars graphic for launching AI/Dela features.
- **ShellPanel**: Dela variant (`variant="dela"`) for the Digital Assistant panel with gradient header, Dela chat content, and related design tokens.

### Changed
- **Dialog**: Sticky header and footer (always visible); only the body scrolls when content overflows.
- **Dialog**: Min width 600px, default max width 700px (design tokens).
- **Dialog**: All dialog styles use design tokens only; new tokens include `--dialog-min-width`, `--dialog-max-width-default`, `--dialog-margin`, `--dialog-margin-horizontal`, `--dialog-margin-vertical`, `--dialog-max-width-medium`, `--dialog-footer-btn-min-width`.
- **Component catalog:** Added `src/data/component-catalog.ts` as the canonical categorized list (49 exported UI components).
- **RightSidebar**: Dela AI icon now uses `DStar_LM.svg` with updated active-state styling and `--linear-new` token.
- **Card Component**: Header styling aligned with documentation (neutral header styling; `primary` adds theme top border only).
- **Release process:** Refactored for initial release (versioning workflow, CI, and changelog grouping).

### Removed
- **Monorepo subprojects:** Removed `harmony-designer-starter/` and `harmony-react-conversion/` from the active repo. Cursor bundles are archived under `archive/`.

### Fixed
- **Button (Dela variants)**: Text and icon stay white in dark mode via `--dela-header-content-fg`.
- **ShellPanel (Dela variant)**: Panel layout, scroll behavior, dark mode tokens, and input box structure updates.
- **Card Component**: Neutral header element styles and font sizing for `headerTitle`.
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
