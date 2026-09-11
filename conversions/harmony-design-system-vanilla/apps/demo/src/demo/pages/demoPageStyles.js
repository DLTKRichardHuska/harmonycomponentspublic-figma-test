import { createSheet } from '@dltkrichardhuska/harmony-design-system-vanilla/elements';

/**
 * Shared doc-page chrome for component demo pages (headings, tables, layout helpers).
 * Adopt alongside typographySheet + demoChromeSheet. Page-specific layout stays local.
 */
export const demoPageSheet = createSheet(`
  :host { display: block; }
  demo-page-header { display: block; }
  h1 { margin: 0 0 var(--space-2); }
  h2 { margin: var(--space-8) 0 var(--space-3); font-size: var(--heading-m); }
  h3 { margin: var(--space-4) 0 var(--space-2); font-size: var(--heading-s); }
  h4 { margin: 0 0 var(--space-3); font-size: var(--text-sm); font-weight: var(--font-semibold); }
  p { max-width: 50rem; }
  .muted {
    font-size: var(--caption);
    color: var(--text-secondary);
    margin-top: var(--space-2);
  }
  .path-label {
    font-size: var(--caption);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    margin: 0 0 var(--space-2);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    align-items: center;
  }
  .stack {
    display: grid;
    gap: var(--space-3);
    max-width: 24rem;
  }
  .snippet-block {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }
  ul {
    margin: 0 0 var(--space-3);
    padding-inline-start: var(--space-6);
    max-width: 50rem;
  }
  li { margin: var(--space-1) 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td {
    padding: var(--space-2-5);
    border-bottom: var(--border-width-thin) solid var(--border-color);
    text-align: left;
    vertical-align: top;
  }
  th {
    text-transform: uppercase;
    font-size: var(--caption);
  }
`);
