import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { DemoHeader } from './DemoHeader';
import { demoNavigation, isNavItemActive, navSectionCount } from './demoNavigation';
import { demoThemeConfig } from './demoThemeConfig';
import { getCoverageSummary } from './manifestStatus';

export function DemoShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { product } = useHarmonyTheme();
  const [navOpen, setNavOpen] = useState(false);
  const { percent, completed, total, version } = getCoverageSummary();
  const themeComponents = demoThemeConfig[product].components;

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <DemoHeader onOpenNav={() => setNavOpen(true)} />

      {navOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-14 z-30 bg-black/50 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <aside
          id="docs-sidebar"
          className={`fixed bottom-0 left-0 top-14 z-40 flex h-auto w-64 max-w-[85vw] flex-col border-r border-border bg-card transition-transform lg:static lg:top-auto lg:h-full lg:translate-x-0 ${
            navOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Documentation navigation"
        >
          <div className="shrink-0 border-b border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Navigation
              </p>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              >
                <Icon name="x-mark" size="sm" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Icon name="squares-2x2" size="sm" className="text-primary" />
              {navSectionCount} Sections
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Documentation">
            {demoNavigation.map((section) => (
              <div key={section.title} className="mb-4">
                <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isNavItemActive(item.href, pathname);
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={`block rounded-md px-2 py-1.5 text-sm ${
                            active
                              ? 'bg-primary/10 font-medium text-primary'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {themeComponents.length > 0 ? (
              <div className="mb-4">
                <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {demoThemeConfig[product].name} Components
                </p>
                <ul className="space-y-0.5">
                  {themeComponents.map((item) => {
                    const active = isNavItemActive(item.href, pathname);
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={`block rounded-md px-2 py-1.5 text-sm ${
                            active
                              ? 'bg-primary/10 font-medium text-primary'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </nav>

          <div
            className="shrink-0 border-t border-border px-4 py-3"
            aria-label={`Conversion coverage for version ${version}`}
          >
            <p className="font-mono text-[10px] text-muted-foreground">v{version}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Coverage
              </span>
              <span className="text-xs font-semibold tabular-nums text-foreground">{percent}%</span>
            </div>
            <div
              className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Reference design system conversion coverage"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              {completed}/{total} elements for this version
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-background">
          <div className="px-4 py-8 sm:px-8 md:px-12 md:py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
