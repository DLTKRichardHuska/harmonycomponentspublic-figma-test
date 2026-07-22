import type { ReactNode } from 'react';
import { DemoStatusBadge } from '../../demoStatusBadge';

export function DemoSection({
  id,
  title,
  description,
  badge,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {badge ? <DemoStatusBadge size="sm">{badge}</DemoStatusBadge> : null}
      </div>
      {description ? <p className="mb-4 max-w-3xl text-sm text-secondary">{description}</p> : null}
      {children}
    </section>
  );
}
