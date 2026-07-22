import { useEffect } from 'react';
import { getReferenceVersion } from '../manifestStatus';
import { demoPageTitle } from '../demoPageTitle';
import { DemoStatusBadge } from '../demoStatusBadge';

const entries = [
  {
    version: '0.9.0',
    date: '2026-07-17',
    title: 'npm workspace scaffold',
    description:
      'Restructured into an npm workspace (packages/ui + apps/demo). Package, theme provider, and demo chrome stubs added; components and foundation tokens are not yet converted.',
  },
];

export function ChangelogPage() {
  const version = getReferenceVersion();

  useEffect(() => {
    document.title = demoPageTitle('Changelog');
  }, []);

  return (
    <div>
      <div className="mb-10 border-b border-border pb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="max-w-2xl text-muted-foreground">
          Release history for the Harmony Design System shadcn/ui conversion. Reference version:{' '}
          <code>{version}</code>.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.version} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-1 flex items-center gap-2">
              <DemoStatusBadge badgeVariant="primary" size="sm">
                v{entry.version}
              </DemoStatusBadge>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-1 text-sm font-semibold">{entry.title}</p>
            <p className="text-sm text-muted-foreground">{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
