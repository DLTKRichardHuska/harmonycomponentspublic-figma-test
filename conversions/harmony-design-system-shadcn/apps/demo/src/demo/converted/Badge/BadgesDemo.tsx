import { useEffect } from 'react';
import { Badge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const propRows: PropRow[] = [
  {
    name: 'variant',
    type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'orange' | 'pink' | 'disabled'",
    default: "'default'",
    description: 'Badge style using Alert Chip colors',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'lg'",
    description: 'Badge size — maps Astro small → sm, medium → md, large → lg',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Harmony Icon name for a leading icon',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Badge label content',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra Tailwind / CSS classes on the root',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function BadgesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Badges');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Badges"
        description="Badges are small status indicators used to highlight information or categorize content."
      />

      <ImportSnippet
        code={`import { Badge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

// Sizes are sm | md | lg (Astro small → sm, medium → md, large → lg)
<Badge variant="success">Success</Badge>
<Badge size="sm" icon="check">Done</Badge>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Variants" description="All badge color variants.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="orange">Orange</Badge>
            <Badge variant="pink">Pink</Badge>
            <Badge variant="disabled">Disabled</Badge>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="sm, md, and lg (Astro small → sm).">
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With icon" description="Leading Harmony Icon via the icon prop.">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" icon="check">
              Approved
            </Badge>
            <Badge variant="error" icon="x-mark">
              Rejected
            </Badge>
            <Badge variant="info" icon="information-circle">
              Info
            </Badge>
            <Badge variant="warning" size="sm" icon="exclamation-triangle">
              Caution
            </Badge>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Forwards <code>ref</code> and other safe <code>HTMLAttributes</code> on the root{' '}
          <code>span</code>. Presentational — non-interactive by default.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="Semantics">
            Badges are visual labels. Do not rely on color alone — keep meaningful text in{' '}
            <code>children</code>.
          </A11yCard>
          <A11yCard icon="eye" title="Decorative icons">
            Leading icons are decorative when the label already conveys meaning. Prefer clear
            status text over icon-only badges.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Disabled variant">
            <code>variant=&quot;disabled&quot;</code> is a visual style only — it does not change
            interactivity or announce a disabled state.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
