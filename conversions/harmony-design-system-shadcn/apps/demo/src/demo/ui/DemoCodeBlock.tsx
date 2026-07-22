import { cn } from '@dltkrichardhuska/harmony-design-system-shadcn/utils';

interface DemoCodeBlockProps {
  children: string;
  className?: string;
}

/** Demo-only fenced code block for docs pages. */
export function DemoCodeBlock({ children, className }: DemoCodeBlockProps) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-foreground',
        className,
      )}
    >
      <code>{children.trim()}</code>
    </pre>
  );
}
