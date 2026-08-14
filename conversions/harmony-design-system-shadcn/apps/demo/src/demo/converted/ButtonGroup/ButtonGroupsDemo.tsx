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
  <Button variant="ghost">Week</Button>
  <Button variant="ghost">Month</Button>
</ButtonGroup>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Default Variant (Container with Border)"
          description="Bordered shell with spaced buttons. Selected = primary fill; unselected sit in the tray."
        >
          <ButtonGroup aria-label="Selected options">
            <Button variant="primary">Selected</Button>
            <Button variant="ghost">Option 1</Button>
            <Button variant="ghost">Option 2</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Default Variant - Toggle Example"
          description="Button group used as a toggle with selected and unselected states."
        >
          <ButtonGroup aria-label="View period">
            <Button variant="primary">Day</Button>
            <Button variant="ghost">Week</Button>
            <Button variant="ghost">Month</Button>
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

        <DemoExampleGroup title="Orientation Variants" description="Horizontal (default) or vertical.">
          <div className="flex flex-col items-start gap-4">
            <div>
              <p className="mb-2 text-sm text-secondary">Horizontal (default)</p>
              <ButtonGroup orientation="horizontal" aria-label="Horizontal options">
                <Button variant="primary">Option 1</Button>
                <Button variant="ghost">Option 2</Button>
                <Button variant="ghost">Option 3</Button>
              </ButtonGroup>
            </div>
            <div>
              <p className="mb-2 text-sm text-secondary">Vertical</p>
              <ButtonGroup orientation="vertical" aria-label="Vertical options">
                <Button variant="primary">Option 1</Button>
                <Button variant="ghost">Option 2</Button>
                <Button variant="ghost">Option 3</Button>
              </ButtonGroup>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Disabled state"
          description="Disable individual buttons via the Button disabled prop."
        >
          <ButtonGroup aria-label="Disabled group">
            <Button variant="primary" disabled>
              Selected
            </Button>
            <Button variant="ghost" disabled>
              Option 1
            </Button>
            <Button variant="ghost" disabled>
              Option 2
            </Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Multiple Button Counts"
          description="Button groups work with 2, 5, and 10 buttons."
        >
          <div className="flex flex-col items-start gap-4">
            <div>
              <p className="mb-2 text-sm text-secondary">2 Buttons</p>
              <ButtonGroup aria-label="Two buttons">
                <Button variant="primary">Option 1</Button>
                <Button variant="ghost">Option 2</Button>
              </ButtonGroup>
            </div>
            <div>
              <p className="mb-2 text-sm text-secondary">5 Buttons</p>
              <ButtonGroup aria-label="Five buttons">
                <Button variant="primary">Option 1</Button>
                <Button variant="ghost">Option 2</Button>
                <Button variant="ghost">Option 3</Button>
                <Button variant="ghost">Option 4</Button>
                <Button variant="ghost">Option 5</Button>
              </ButtonGroup>
            </div>
            <div>
              <p className="mb-2 text-sm text-secondary">10 Buttons</p>
              <ButtonGroup aria-label="Ten buttons">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((n) => (
                  <Button key={n} variant={n === '1' ? 'primary' : 'ghost'}>
                    {n}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With icons and text"
          description="Use the Button icon prop — no separate icon imports."
        >
          <ButtonGroup aria-label="Actions with icons">
            <Button variant="primary" icon="plus">
              Button 1
            </Button>
            <Button variant="ghost" icon="squares-2x2">
              Button 2
            </Button>
            <Button variant="ghost" icon="chart-bar">
              Button 3
            </Button>
          </ButtonGroup>
          <div className="mt-6 flex flex-col items-start gap-4">
            <p className="text-sm text-secondary">With icons and text at every size:</p>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size}>
                <p className="mb-2 text-sm text-secondary">
                  {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                </p>
                <ButtonGroup size={size} aria-label={`${size} icon text group`}>
                  <Button variant="primary" size={size} icon="plus">
                    Button 1
                  </Button>
                  <Button variant="ghost" size={size} icon="squares-2x2">
                    Button 2
                  </Button>
                  <Button variant="ghost" size={size} icon="chart-bar">
                    Button 3
                  </Button>
                </ButtonGroup>
              </div>
            ))}
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Default Variant - With Icons"
          description="Icon-only buttons in the default variant."
        >
          <ButtonGroup aria-label="Text formatting">
            <Button variant="primary" icon="bold" aria-label="Bold" />
            <Button variant="ghost" icon="italic" aria-label="Italic" />
            <Button variant="ghost" icon="underline" aria-label="Underline" />
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Small, medium, and large groups.">
          <div className="flex flex-col items-start gap-4">
            <ButtonGroup size="sm" aria-label="Small group">
              <Button variant="primary" size="sm">
                Option 1
              </Button>
              <Button variant="ghost" size="sm">
                Option 2
              </Button>
              <Button variant="ghost" size="sm">
                Option 3
              </Button>
            </ButtonGroup>
            <ButtonGroup size="md" aria-label="Medium group">
              <Button variant="primary" size="md">
                Option 1
              </Button>
              <Button variant="ghost" size="md">
                Option 2
              </Button>
              <Button variant="ghost" size="md">
                Option 3
              </Button>
            </ButtonGroup>
            <ButtonGroup size="lg" aria-label="Large group">
              <Button variant="primary" size="lg">
                Option 1
              </Button>
              <Button variant="ghost" size="lg">
                Option 2
              </Button>
              <Button variant="ghost" size="lg">
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
            <Button variant="ghost">Week</Button>
            <Button variant="ghost">Month</Button>
            <Button variant="ghost">Year</Button>
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
            segments typically use <code>ghost</code>.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
