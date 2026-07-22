import { useEffect } from 'react';
import { Chip } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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
    description: 'Chip height / padding',
  },
  {
    name: 'variant',
    type: "'fill' | 'outline'",
    default: "'fill'",
    description: 'Fill or outline style',
  },
  {
    name: 'type',
    type: "'chip' | 'horiz-dots' | 'vert-dots' | 'overflow'",
    default: "'chip'",
    description: 'Content mode',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Chip'",
    description: 'Text when no children',
  },
  {
    name: 'overflowCount',
    type: 'number',
    default: '10',
    description: 'Count shown as +N for overflow type',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Leading Harmony Icon name',
  },
  {
    name: 'removable',
    type: 'boolean',
    default: 'false',
    description: 'Shows remove control',
  },
  {
    name: 'onRemove',
    type: '(event) => void',
    default: '—',
    description: 'Called when remove is activated',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled appearance and interaction',
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

export function ChipsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Chips');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Chips"
        description="Chips are compact elements that represent tags, filters, or small pieces of information."
      />

      <ImportSnippet
        code={`import { Chip } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Chip label="Tag" />
<Chip variant="outline" icon="tag" />
<Chip removable onRemove={() => {}} label="Removable" />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Fill / outline" description="Primary fill and outline variants.">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="fill" label="Fill" />
            <Chip variant="outline" label="Outline" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="sm, md, and lg.">
          <div className="flex flex-wrap items-end gap-2">
            <Chip size="sm" label="Small" />
            <Chip size="md" label="Medium" />
            <Chip size="lg" label="Large" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Removable"
          description="Remove control calls onRemove (console in this demo)."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              label="Removable"
              removable
              onRemove={() => {
                console.log('Chip removed');
              }}
            />
            <Chip
              variant="outline"
              label="Outline removable"
              removable
              onRemove={() => {
                console.log('Outline chip removed');
              }}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Overflow" description="Overflow type shows +N count.">
          <div className="flex flex-wrap items-center gap-2">
            <Chip type="overflow" overflowCount={3} />
            <Chip type="overflow" overflowCount={12} variant="outline" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Dots"
          description="Horizontal and vertical ellipsis chip types (presentational spans)."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Chip type="horiz-dots" />
            <Chip type="vert-dots" />
            <Chip type="horiz-dots" variant="outline" />
            <Chip type="vert-dots" variant="outline" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With icon" description="Leading Harmony Icon via the icon prop.">
          <div className="flex flex-wrap items-center gap-2">
            <Chip icon="tag" label="Tagged" />
            <Chip icon="funnel" variant="outline" label="Filter" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled" description="Disabled fill and outline chips.">
          <div className="flex flex-wrap items-center gap-2">
            <Chip disabled label="Fill disabled" />
            <Chip disabled variant="outline" label="Outline disabled" />
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Hover, focus, and pressed are CSS pseudo-states — not static props. Legacy{' '}
          <code>selected</code> is not supported.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="keyboard" title="Keyboard">
            Standard chips render as <code>button</code>. Use <kbd>Tab</kbd> to focus and{' '}
            <kbd>Enter</kbd> / <kbd>Space</kbd> to activate. Removable control is keyboard-activable
            and stops propagation from the chip click.
          </A11yCard>
          <A11yCard icon="tag" title="Dots types">
            <code>horiz-dots</code> and <code>vert-dots</code> are presentational spans with{' '}
            <code>aria-label=&quot;More options&quot;</code>.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Disabled">
            Disabled chips set <code>disabled</code> on the button and block remove handlers.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
