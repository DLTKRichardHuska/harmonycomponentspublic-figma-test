import { useEffect } from 'react';
import { Button, ButtonGroup } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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
    type: "'default' | 'outline'",
    default: "'default'",
    description: 'Segmented shell (default) or connected outline strip',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Hint for child Button sizes (pass matching size on children)',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Layout direction of the group',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Package Button children',
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

export function ButtonGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Button Groups');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Button Groups"
        description="Button groups combine related buttons into a single visual unit."
      />

      <ImportSnippet
        code={`import { Button, ButtonGroup } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ButtonGroup aria-label="View period">
  <Button variant="primary">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Default segmented"
          description="Selected = primary. Unselected children lose their borders inside the shell (reference parity)."
        >
          <ButtonGroup aria-label="View period">
            <Button variant="primary">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Outline connected strip"
          description="Connected buttons without a segmented container shell."
        >
          <ButtonGroup variant="outline" aria-label="Alignment">
            <Button variant="outline">Left</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Vertical" description="Stack segments vertically.">
          <ButtonGroup orientation="vertical" aria-label="Vertical options">
            <Button variant="primary">Option 1</Button>
            <Button variant="outline">Option 2</Button>
            <Button variant="outline">Option 3</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Disabled state"
          description="Disable individual buttons via the Button disabled prop."
        >
          <ButtonGroup aria-label="Disabled group">
            <Button variant="primary" disabled>
              Selected
            </Button>
            <Button variant="outline" disabled>
              Option 1
            </Button>
            <Button variant="outline" disabled>
              Option 2
            </Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With icons"
          description="Use the Button icon prop — no separate icon imports."
        >
          <ButtonGroup aria-label="Actions with icons">
            <Button variant="primary" icon="plus">
              Create
            </Button>
            <Button variant="outline" icon="squares-2x2">
              Grid
            </Button>
            <Button variant="outline" icon="chart-bar">
              Chart
            </Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Small, medium, and large groups.">
          <div className="flex flex-col items-start gap-4">
            <ButtonGroup size="sm" aria-label="Small group">
              <Button variant="primary" size="sm">
                Option 1
              </Button>
              <Button variant="outline" size="sm">
                Option 2
              </Button>
              <Button variant="outline" size="sm">
                Option 3
              </Button>
            </ButtonGroup>
            <ButtonGroup size="md" aria-label="Medium group">
              <Button variant="primary" size="md">
                Option 1
              </Button>
              <Button variant="outline" size="md">
                Option 2
              </Button>
              <Button variant="outline" size="md">
                Option 3
              </Button>
            </ButtonGroup>
            <ButtonGroup size="lg" aria-label="Large group">
              <Button variant="primary" size="lg">
                Option 1
              </Button>
              <Button variant="outline" size="lg">
                Option 2
              </Button>
              <Button variant="outline" size="lg">
                Option 3
              </Button>
            </ButtonGroup>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Responsive"
          description="Horizontal groups stack to full-width below 768px (resize the viewport to verify)."
        >
          <ButtonGroup className="max-w-md" aria-label="Responsive group">
            <Button variant="primary">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
            <Button variant="outline">Year</Button>
          </ButtonGroup>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Selection is consumer-managed via child <code>Button</code> variants — not a group value.
          Root has <code>role=&quot;group&quot;</code>.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="Group label">
            Provide an accessible name with <code>aria-label</code> or <code>aria-labelledby</code>{' '}
            on the <code>ButtonGroup</code> root.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Buttons are in DOM order. Use <kbd>Tab</kbd> to move between them and{' '}
            <kbd>Enter</kbd> or <kbd>Space</kbd> to activate.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Selection">
            Mark the selected segment with <code>variant=&quot;primary&quot;</code>; unselected
            segments typically use <code>outline</code> or <code>secondary</code>.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
