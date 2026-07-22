import type { ReactNode } from 'react';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

interface DemoDoDontProps {
  doItems: ReactNode;
  dontItems: ReactNode;
}

/** Paired Do / Don't guidance cards for component usage sections. */
export function DemoDoDont({ doItems, dontItems }: DemoDoDontProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-success/40 bg-success/5 p-4">
        <h3 className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon name="check" size="sm" /> Do
        </h3>
        {doItems}
      </div>
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
        <h3 className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon name="x-mark" size="sm" /> Don&apos;t
        </h3>
        {dontItems}
      </div>
    </div>
  );
}
