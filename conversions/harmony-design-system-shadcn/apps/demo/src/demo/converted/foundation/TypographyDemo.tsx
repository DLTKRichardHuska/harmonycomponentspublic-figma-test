import { useEffect } from 'react';
import { cn } from '@dltkrichardhuska/harmony-design-system-shadcn/utils';
import { ImportSnippet } from '../../ui';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { TYPE_STYLE_ROWS } from './foundationHelpers';
import { demoPageTitle } from '../../demoPageTitle';

const ARTICLE_NAV = [
  { href: '#display', label: 'Display' },
  { href: '#headings', label: 'Headings' },
  { href: '#body', label: 'Body' },
  { href: '#supporting', label: 'Supporting' },
  { href: '#fonts', label: 'Fonts' },
];

export function TypographyDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Typography');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Typography"
        description="A comprehensive typography system based on roles and scale, not HTML tags. Display styles for hero content, Headings for hierarchy, Body for content, and supporting styles for labels and captions."
      />

      <ImportSnippet
        code={`/* Prefer theme type tokens (Tailwind → CSS vars in tokens.css) */
<p className="font-display text-display-xl font-bold leading-tight" />
<p className="font-sans text-base" />
<p className="text-label font-medium" />
<p className="text-caption text-secondary" />
<p className="text-overline font-semibold uppercase" />
<code className="font-mono text-sm" />

<span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--heading-m)' }} />

/* Single source: styles/tokens.css + Tailwind preset — do not invent parallel token JSON */`}
      />

      <nav className="mb-8 flex flex-wrap gap-4">
        {ARTICLE_NAV.map((item) => (
          <a key={item.href} href={item.href} className="text-sm text-primary hover:underline">
            {item.label}
          </a>
        ))}
      </nav>

      <DemoSection
        id="display"
        title="Display"
        description="Large, bold text for hero sections, marketing headlines, and high-impact moments."
      >
        <div className="space-y-6">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Display XL — var(--display-xl)</p>
            <p className="font-display text-display-xl font-bold leading-tight">The quick brown fox</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Display L — var(--display-l)</p>
            <p className="font-display text-display-l font-bold leading-tight">
              The quick brown fox jumps
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Display M — var(--display-m)</p>
            <p className="font-display text-display-m font-bold leading-tight">
              The quick brown fox jumps over
            </p>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        id="headings"
        title="Headings"
        description="Semantic hierarchy for page structure. Use based on content importance, not visual size."
      >
        <div className="space-y-4">
          <p className="font-display text-heading-xl font-semibold leading-tight">
            Heading Extra Large
          </p>
          <p className="font-display text-heading-l font-semibold leading-tight">Heading Large</p>
          <p className="font-display text-heading-m font-semibold leading-snug">Heading Medium</p>
          <p className="font-display text-heading-s font-medium leading-snug">Heading Small</p>
        </div>
      </DemoSection>

      <DemoSection id="body" title="Body" description="Default and emphasized body copy.">
        <div className="space-y-4">
          <p className="font-sans text-base font-normal leading-normal">
            Body default — The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-sans text-base font-semibold leading-normal">
            Body emphasized — The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </DemoSection>

      <DemoSection id="supporting" title="Supporting" description="Labels, captions, and overlines.">
        <div className="space-y-3">
          <p className="text-label font-medium uppercase tracking-wide">Label</p>
          <p className="text-caption text-secondary">Caption — secondary supporting text</p>
          <p className="text-overline font-semibold uppercase tracking-wider text-muted-foreground">
            Overline
          </p>
        </div>
      </DemoSection>

      <DemoSection id="fonts" title="Font Families">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-sans text-lg">Figtree</p>
            <p className="text-xs text-muted-foreground">font-sans · var(--font-sans)</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-display text-lg">Lexend</p>
            <p className="text-xs text-muted-foreground">font-display · var(--font-display)</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="font-mono text-lg">JetBrains Mono</p>
            <p className="text-xs text-muted-foreground">font-mono · var(--font-mono)</p>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Style table">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Style</th>
                <th className="px-3 py-2">Sample</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Weight</th>
                <th className="px-3 py-2">Tailwind</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_STYLE_ROWS.map((row) => (
                <tr key={row.name} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2">
                    <span className={cn(row.tw)}>Aa</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.size}</td>
                  <td className="px-3 py-2">{row.weight}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.cssClass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>

      <DemoSection title="Usage Guidelines">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Separate Visuals from Semantics</h3>
            <p className="text-sm text-secondary">
              Choose text styles based on their visual role (Display, Heading, Body), not HTML tags.
              A dashboard title might be the semantic H1 but use Heading M visually. A hero headline
              might use Display XL but be an H2 semantically.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Accessibility</h3>
            <p className="text-sm text-secondary">
              Ensure proper heading hierarchy in HTML (H1 → H2 → H3) regardless of visual styling.
              Screen readers navigate by heading structure, not visual appearance.
            </p>
          </div>
        </div>
      </DemoSection>
    </article>
  );
}
