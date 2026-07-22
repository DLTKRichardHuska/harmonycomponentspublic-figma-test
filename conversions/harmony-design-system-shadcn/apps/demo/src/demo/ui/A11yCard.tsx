import type { ReactNode } from 'react';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

interface A11yCardProps {
  icon: string;
  title: string;
  children: ReactNode;
}

export function A11yCard({ icon, title, children }: A11yCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon name={icon} size="sm" /> {title}
      </h3>
      <div className="text-sm text-secondary">{children}</div>
    </div>
  );
}
