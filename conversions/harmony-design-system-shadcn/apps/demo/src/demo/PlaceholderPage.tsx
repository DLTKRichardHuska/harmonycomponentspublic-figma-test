import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConversionStatusForScope, type ElementStatus } from './manifestStatus';
import { titleForHref } from './demoNavigation';
import { demoPageTitle } from './demoPageTitle';
import { DemoStatusBadge } from './demoStatusBadge';
import { scopeFromPath } from './demoScope';

function statusDescription(status: ElementStatus): string {
  if (status === 'gap') {
    return 'This scope is an accepted gap for this conversion. The demo route exists so navigation matches the reference docs site; full content is deferred by human decision.';
  }
  return 'This scope is not converted yet. The demo route exists so navigation matches the reference docs site. After conversion, this page will show Harmony on shadcn/ui + Tailwind + Radix and element-specific npm import snippets.';
}

export function PlaceholderPage({ path }: { path: string }) {
  const title = titleForHref(path);
  const scope = scopeFromPath(path);
  const conversionStatus = getConversionStatusForScope(scope);

  useEffect(() => {
    document.title = demoPageTitle(title);
  }, [title]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <DemoStatusBadge badgeVariant={conversionStatus.variant}>{conversionStatus.label}</DemoStatusBadge>
      </div>
      <p className="mb-4 max-w-2xl text-muted-foreground">{statusDescription(conversionStatus.status)}</p>
      <p className="text-sm text-muted-foreground">
        Reference docs:{' '}
        <a
          className="text-primary underline"
          href={`http://localhost:4321${path}`}
          target="_blank"
          rel="noreferrer"
        >
          localhost:4321{path}
        </a>
        {' · '}
        <Link className="text-primary underline" to="/getting-started">
          Getting Started
        </Link>
      </p>
    </div>
  );
}
