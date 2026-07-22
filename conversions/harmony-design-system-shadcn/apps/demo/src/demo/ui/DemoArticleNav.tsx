import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

export interface DemoArticleNavLink {
  href: string;
  label: string;
  icon?: string;
}

interface DemoArticleNavProps {
  links: readonly DemoArticleNavLink[];
}

export function DemoArticleNav({ links }: DemoArticleNavProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-3 border-b border-border pb-4 text-sm">
      {links.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="inline-flex items-center gap-1.5 text-secondary hover:text-foreground"
        >
          {item.icon ? <Icon name={item.icon} size="sm" /> : null}
          {item.label}
        </a>
      ))}
    </nav>
  );
}
