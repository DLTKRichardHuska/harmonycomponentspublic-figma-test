import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

interface DemoIconGridProps {
  icons: readonly string[];
}

/** Catalog grid for icon reference pages — demo-site scaffolding only. */
export function DemoIconGrid({ icons }: DemoIconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
      {icons.map((icon) => (
        <div
          key={icon}
          title={icon}
          className="group flex cursor-pointer flex-col items-center gap-1 rounded-md p-2 transition-colors hover:bg-muted"
        >
          <span className="text-secondary transition-colors group-hover:text-primary">
            <Icon name={icon} size="lg" />
          </span>
          <span className="w-full truncate text-center text-[10px] uppercase tracking-wide text-muted-foreground">
            {icon}
          </span>
        </div>
      ))}
    </div>
  );
}
