import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { cn } from '@dltkrichardhuska/harmony-design-system-shadcn/utils';
import { ImportSnippet } from '../../ui';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { ELEVATION_HIERARCHY, SHADOW_SCALE } from './foundationHelpers';
import { demoPageTitle } from '../../demoPageTitle';

function ShadowCard({
  name,
  description,
  usage,
  cssClass,
  cssVar,
  level,
}: {
  name: string;
  description: string;
  usage: readonly string[];
  cssClass: string;
  cssVar: string;
  level: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = useHarmonyTheme();
  const [resolved, setResolved] = useState('');

  useLayoutEffect(() => {
    if (!ref.current || cssClass === 'shadow-none') {
      setResolved('none');
      return;
    }
    setResolved(getComputedStyle(ref.current).boxShadow);
  }, [mode, cssClass]);

  return (
    <div
      ref={ref}
      className={cn('rounded-lg bg-card p-6 text-center', cssClass)}
      title={cssVar}
    >
      <p className="mb-1 font-medium">{name}</p>
      <p className="mb-2 text-xs text-muted-foreground">{description}</p>
      {usage.length > 0 ? (
        <p className="mb-2 text-xs text-secondary">{usage.join(', ')}</p>
      ) : null}
      <p className="font-mono text-[10px] text-muted-foreground">{cssClass}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{cssVar}</p>
      <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">{resolved}</p>
      <p className="mt-1 text-xs text-muted-foreground">Level {level}</p>
    </div>
  );
}

export function ElevationsDemo() {
  const { mode } = useHarmonyTheme();

  useEffect(() => {
    document.title = demoPageTitle('Elevations');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Elevations"
        description="A layered shadow system that creates depth and visual hierarchy in the interface."
      />

      <ImportSnippet
        code={`/* Prefer theme shadows — Tailwind classes map to --shadow-* */
<div className="shadow-sm rounded-lg bg-card" />
<div className="shadow-lg" />
<div style={{ boxShadow: 'var(--shadow-md)' }} />

/* Single source: styles/tokens.css (via globals.css) + Tailwind preset; .dark updates shadows */`}
      />

      <DemoSection
        title="Shadow Scale"
        description="Shadows automatically adapt to light and dark modes. In dark mode, shadows use increased opacity for better visibility on dark backgrounds."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SHADOW_SCALE.map((shadow) => (
            <ShadowCard
              key={shadow.key}
              name={shadow.name}
              description={shadow.description}
              usage={shadow.usage}
              cssClass={shadow.cssClass}
              cssVar={shadow.cssVar}
              level={shadow.level}
            />
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Shadow Values"
        description="Resolved box-shadow for the current mode (from CSS variables). Prefer shadow-* / var(--shadow-*) in app code."
      >
        <div className="space-y-3">
          {SHADOW_SCALE.filter((s) => s.key !== 'none').map((shadow) => (
            <ResolvedShadowRow key={`${shadow.key}-${mode}`} shadow={shadow} />
          ))}
        </div>
      </DemoSection>

      <DemoSection title="Elevation Hierarchy">
        <div className="space-y-3">
          {ELEVATION_HIERARCHY.map((item) => (
            <div
              key={item.level}
              className={cn('rounded-lg border border-border bg-card p-4', item.shadowClass)}
              title={item.cssVar}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-medium">
                  Level {item.level}: {item.name}
                </span>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {item.shadowClass}
                </span>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {item.cssVar}
                </span>
              </div>
              <p className="text-sm text-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </DemoSection>
    </article>
  );
}

function ResolvedShadowRow({
  shadow,
}: {
  shadow: (typeof SHADOW_SCALE)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = useHarmonyTheme();
  const [resolved, setResolved] = useState('…');

  useLayoutEffect(() => {
    if (!ref.current) return;
    setResolved(getComputedStyle(ref.current).boxShadow);
  }, [mode, shadow.cssClass]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-medium">{shadow.name}</span>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {shadow.cssClass}
        </span>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {shadow.cssVar}
        </span>
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {mode}
        </span>
      </div>
      <div ref={ref} className={cn('h-0 w-0 overflow-hidden', shadow.cssClass)} aria-hidden />
      <code className="block break-all rounded-md bg-muted p-2 font-mono text-[11px] text-muted-foreground">
        {resolved}
      </code>
    </div>
  );
}
