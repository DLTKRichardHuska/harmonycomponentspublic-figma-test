import { useEffect } from 'react';
import { Button, Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Spinner size (maps to --space-4 / --space-6 / --space-10)',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Harmony Icon name — replaces the default border ring',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra Tailwind / CSS classes on the root',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: "'Loading'",
    description: 'Accessible name for the status region',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function SpinnersDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Spinner');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Spinner"
        description="Spinners indicate that content is loading or an action is being processed."
      />

      <ImportSnippet
        code={`import { Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Spinner />
<Spinner size="lg" />
<Spinner icon="arrow-path" size="sm" />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Sizes" description="Different spinner sizes.">
          <div className="flex items-center gap-6">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="In Context" description="Spinners in common use cases.">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <span className="text-sm text-secondary">Loading…</span>
            </div>
            <div className="max-w-sm rounded-lg border border-border bg-card">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="mt-4 text-sm text-secondary">Loading content…</p>
                </div>
              </div>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Custom icon"
          description="Optional icon prop uses package Icon with spin animation (stock Spinner customization)."
        >
          <div className="flex items-center gap-6">
            <Spinner icon="arrow-path" size="sm" />
            <Spinner icon="arrow-path" size="md" />
            <Spinner icon="arrow-path" size="lg" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="In Button"
          description="Two patterns: loading prop (private spinner) and nested catalog Spinner."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button loading loadingText="Loading...">
              Submit
            </Button>
            <Button disabled size="sm">
              <Spinner size="sm" />
              Please wait
            </Button>
            <Button variant="outline" disabled size="sm">
              <Spinner size="sm" icon="arrow-path" />
              Processing
            </Button>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Forwards <code>ref</code> and other safe <code>HTMLAttributes</code> on the root{' '}
          <code>span</code>. Presentational — no custom Harmony events.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="ARIA Attributes">
            Spinners use <code>role=&quot;status&quot;</code> and <code>aria-label</code> (default{' '}
            <code>&quot;Loading&quot;</code>) so assistive tech announces the loading state. Override{' '}
            <code>aria-label</code> for more specific context (e.g. &quot;Loading content&quot;).
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            A visually hidden label mirrors <code>aria-label</code>. Prefer descriptive labels when the
            surrounding UI does not already explain what is loading.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Animation Preferences">
            Spin animation respects <code>prefers-reduced-motion</code> via{' '}
            <code>motion-reduce:animate-none</code>.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
