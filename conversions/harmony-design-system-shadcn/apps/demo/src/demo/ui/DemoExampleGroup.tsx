import type { ReactNode } from 'react';

interface DemoExampleGroupProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/** Subsection within a component demo Examples block (h3 + optional description + preview frame). */
export function DemoExampleGroup({ title, description, children }: DemoExampleGroupProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      {description ? <p className="mb-3 text-sm text-secondary">{description}</p> : null}
      <div className="overflow-visible rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--elevated-bg)] p-[var(--space-6)]">
        {children}
      </div>
    </div>
  );
}
