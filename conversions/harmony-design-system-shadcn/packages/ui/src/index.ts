/**
 * Root barrel — the primary import surface for the package.
 *
 * Everything (components, layouts, the theme provider, and the `cn` helper) is
 * available from the bare package specifier:
 *
 *   import { Button, HarmonyThemeProvider, cn } from '@dltkrichardhuska/harmony-design-system-shadcn';
 *
 * Styles are loaded once, separately, from the styles entry:
 *
 *   import '@dltkrichardhuska/harmony-design-system-shadcn/styles/globals.css';
 *
 * Subpath entries (./components, ./theme, ./utils) remain available for
 * tree-shaking-sensitive or explicit imports.
 */
export * from './components';
export * from './theme';
export { cn } from './lib/utils';
