import { useEffect, useLayoutEffect, useState } from 'react';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { ImportSnippet } from '../../ui';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { BORDER_RADIUS_SCALE, SPACING_PATTERNS, SPACING_SCALE } from './foundationHelpers';
import { demoPageTitle } from '../../demoPageTitle';

function ResolvedLength({ cssVar }: { cssVar: string }) {
  const { product, mode } = useHarmonyTheme();
  const [value, setValue] = useState('…');

  useLayoutEffect(() => {
    setValue(
      getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '…',
    );
  }, [cssVar, product, mode]);

  return <span>{value}</span>;
}

export function SpacingDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Spacing');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Spacing"
        description="A consistent spacing scale based on a 4px grid system for margins, padding, and gaps."
      />

      <ImportSnippet
        code={`/* Prefer theme tokens — Tailwind spacing or CSS variables */
<div className="p-4 gap-6 m-8" />
<div style={{ width: 'var(--space-8)', borderRadius: 'var(--radius-08)' }} />

/* Single source: styles/tokens.css (via globals.css) + Tailwind preset */`}
      />

      <DemoSection title="Spacing Scale">
        <div className="space-y-3">
          {SPACING_SCALE.map(([name, cssVar]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{name}</span>
              <div
                className="h-6 shrink-0 bg-primary"
                style={{ width: `var(${cssVar})` }}
                title={cssVar}
              />
              <span className="text-sm text-secondary">
                <ResolvedLength cssVar={cssVar} />
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">{cssVar}</span>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Usage Patterns">
        <div className="grid gap-4 md:grid-cols-2">
          {SPACING_PATTERNS.map((pattern) => (
            <div key={pattern.key} className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-1 font-semibold">
                {pattern.title} ({pattern.values})
              </h3>
              <p className="text-sm text-secondary">{pattern.usage}</p>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Border Radius"
        description="Border radius values using a numbered naming convention (e.g., radius-04, radius-12, radius-100)."
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {BORDER_RADIUS_SCALE.map(([name, cssVar]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 border border-primary bg-primary/20"
                style={{ borderRadius: `var(${cssVar})` }}
                title={cssVar}
              />
              <p className="text-sm font-medium">{name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                <ResolvedLength cssVar={cssVar} />
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">{cssVar}</p>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="CSS Variables">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Variable</th>
                <th className="px-3 py-2">Resolved value</th>
              </tr>
            </thead>
            <tbody>
              {BORDER_RADIUS_SCALE.map(([_, cssVar]) => (
                <tr key={cssVar} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">{cssVar}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    <ResolvedLength cssVar={cssVar} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>
    </article>
  );
}
