import { createSheet } from '@dltkrichardhuska/harmony-design-system-vanilla/elements';

/**
 * Shared styles for top-level demo pages (home, getting started, etc.).
 *
 * Type comes from the package `typographySheet` these pages adopt — only
 * demo-specific layout and chrome live here.
 */
export const pageStyles = createSheet(`
  :host { display: block; }
  demo-page-header { display: block; }
  h1 { margin: 0 0 var(--space-3); }
  h2 { margin: var(--space-6) 0 var(--space-2); font-size: var(--heading-s); }
  p { max-width: 42rem; }
  .home-badge {
    margin: 0 0 var(--space-4);
  }
  .cards {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin: var(--space-4) 0;
  }
`);
