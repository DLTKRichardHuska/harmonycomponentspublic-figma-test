import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { demoNavigation, componentDocPageCount, EXPORTED_UI_COMPONENT_COUNT } from '../demoNavigation';
import { getCoveragePercent, getReferenceVersion } from '../manifestStatus';
import { demoPageTitle } from '../demoPageTitle';
import { DemoStatusBadge } from '../demoStatusBadge';

const quickStart = [
  {
    href: '/getting-started',
    title: 'Installation',
    desc: 'Install the npm package, configure Tailwind, and wrap your app with HarmonyThemeProvider.',
  },
  {
    href: '/foundation/colors',
    title: 'Foundation',
    desc: 'Colors, typography, spacing, and elevation tokens as CSS variables + Tailwind classes.',
  },
  {
    href: '/shell/layout',
    title: 'Shell Layout',
    desc: 'Headers, sidebars, footers, and page content areas.',
  },
  {
    href: '/components/buttons',
    title: 'Components',
    desc: `${EXPORTED_UI_COMPONENT_COUNT} production-ready UI components across ${componentDocPageCount} doc pages.`,
  },
];

export function DemoHomePage() {
  const version = getReferenceVersion();
  const coverage = getCoveragePercent();

  useEffect(() => {
    document.title = demoPageTitle('Overview');
  }, []);

  return (
    <div>
      <div className="mb-10 border-b border-border pb-8">
        <div className="mb-4">
          <DemoStatusBadge badgeVariant="primary">
            v{version} · {coverage}% converted
          </DemoStatusBadge>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Design
          <br />
          System
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Harmony Design System built on shadcn/ui patterns, Tailwind CSS, and Radix primitives —
          optimized for AI coding agents. Foundation, shell layout, and{' '}
          {EXPORTED_UI_COMPONENT_COUNT} components, converted incrementally from the Astro
          reference.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Dark &amp; Light Themes</span>
          <span>·</span>
          <span>Foundation System</span>
          <span>·</span>
          <span>Shell Layout</span>
          <span>·</span>
          <span>{EXPORTED_UI_COMPONENT_COUNT} Components</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Quick Start</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStart.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-muted/40"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-sm font-semibold text-primary">
                {card.title.charAt(0)}
              </div>
              <p className="mb-1 text-sm font-semibold">{card.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {demoNavigation.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="h-5 w-1.5 rounded bg-primary" />
            {section.title}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
