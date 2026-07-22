import { useEffect } from 'react';
import { Button, Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoDoDont,
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
    type: "'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive' | 'dela' | 'dela-pill'",
    default: "'primary'",
    description: 'Visual style of the button',
  },
  {
    name: 'buttonType',
    type: "'theme' | 'pageHeader'",
    default: "'theme'",
    description: 'Theme uses primary shades; pageHeader uses dark blue header tokens',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Size of the button',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Button layout orientation',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Shows loading spinner (replaces content)',
  },
  {
    name: 'loadingText',
    type: 'string',
    default: '—',
    description: 'Text to display while loading',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Harmony Icon name (e.g. "plus", "arrow-right")',
  },
  {
    name: 'iconPosition',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Position of the icon relative to text',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description: 'Button HTML type (ignored when href is set)',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Makes button full width',
  },
  {
    name: 'href',
    type: 'string',
    default: '—',
    description: 'When set, renders as an anchor with button styling',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Radix Slot — merge styles onto a single child element',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#usage', label: 'Usage', icon: 'book-open' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function ButtonsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Buttons');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Buttons"
        description="Buttons trigger actions and events. Use different variants to communicate the importance and nature of the action."
      />

      <ImportSnippet
        code={`import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Button variant="primary">Save</Button>
<Button variant="secondary" icon="pencil">Edit</Button>
<Button variant="dela">Ask Dela</Button>
<Button icon="plus" aria-label="Add" />`}
      />

      <DemoArticleNav links={articleNav} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Button Types"
          description="Theme buttons (default) use primary color shades. Page header buttons use a dark blue color scheme."
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Theme Buttons (Default)</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" buttonType="theme">
                  Primary
                </Button>
                <Button variant="secondary" buttonType="theme">
                  Secondary
                </Button>
                <Button variant="tertiary" buttonType="theme">
                  Tertiary
                </Button>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Page Header Buttons</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" buttonType="pageHeader">
                  Primary
                </Button>
                <Button variant="secondary" buttonType="pageHeader">
                  Secondary
                </Button>
                <Button variant="tertiary" buttonType="pageHeader">
                  Tertiary
                </Button>
              </div>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Variants"
          description="The main action styles for buttons (Theme buttons shown)."
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Dela Buttons"
          description="Dela variants for launching AI or Dela features. Use dela (4px radius) or dela-pill (fully rounded) with foundation bg-dela tokens and Stars graphic. Brand tokens: /foundation/dela."
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="dela">Ask Dela</Button>
            <Button variant="dela-pill">Try AI</Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Four size options to fit different contexts.">
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">XSmall</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons" description="Buttons can include icons for visual reinforcement.">
          <div className="flex flex-wrap gap-4">
            <Button icon="plus">Add Item</Button>
            <Button icon="arrow-right" iconPosition="right">
              Continue
            </Button>
            <Button icon="arrow-down-tray">Download</Button>
            <Button variant="secondary" icon="pencil">
              Edit
            </Button>
            <Button variant="outline" icon="share">
              Share
            </Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Icon Only" description="Compact buttons with just an icon.">
          <div className="flex flex-wrap items-center gap-4">
            <Button icon="plus" size="xs" aria-label="Add item" />
            <Button icon="plus" size="sm" aria-label="Add item" />
            <Button icon="plus" size="md" aria-label="Add item" />
            <Button icon="plus" size="lg" aria-label="Add item" />
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button variant="secondary" icon="pencil" size="md" aria-label="Edit" />
            <Button variant="tertiary" icon="cog-6-tooth" size="md" aria-label="Settings" />
            <Button variant="outline" icon="share" size="md" aria-label="Share" />
            <Button variant="ghost" icon="ellipsis-vertical" size="md" aria-label="More options" />
            <Button variant="destructive" icon="trash" size="md" aria-label="Delete" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="States"
          description="All button variants support multiple states: default, hover, pressed (active), focused, and disabled."
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Theme Buttons - States</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Default</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary">Default</Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
                <Button variant="tertiary">Default</Button>
                <Button variant="tertiary" disabled>
                  Disabled
                </Button>
              </div>
              <p className="mt-2 text-xs text-secondary">
                Hover, pressed, and focused states are shown on interaction.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Page Header Buttons - States</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" buttonType="pageHeader">
                  Default
                </Button>
                <Button variant="primary" buttonType="pageHeader" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" buttonType="pageHeader">
                  Default
                </Button>
                <Button variant="secondary" buttonType="pageHeader" disabled>
                  Disabled
                </Button>
                <Button variant="tertiary" buttonType="pageHeader">
                  Default
                </Button>
                <Button variant="tertiary" buttonType="pageHeader" disabled>
                  Disabled
                </Button>
              </div>
              <p className="mt-2 text-xs text-secondary">
                Hover, pressed, and focused states are shown on interaction.
              </p>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Loading State"
          description="Use the loading prop (private spinner) or nest catalog Spinner as children."
        >
          <div className="flex flex-wrap gap-4">
            <Button loading loadingText="Loading...">
              Submit
            </Button>
            <Button variant="secondary" loading loadingText="Processing">
              Process
            </Button>
            <Button variant="outline" loading loadingText="Saving...">
              Save
            </Button>
            <Button disabled>
              <Spinner size="sm" />
              Please wait
            </Button>
            <Button variant="outline" disabled>
              <Spinner size="sm" icon="arrow-path" />
              Processing
            </Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Full Width" description="Buttons that span the full container width.">
          <div className="max-w-sm space-y-3">
            <Button fullWidth>Full Width Primary</Button>
            <Button variant="outline" fullWidth>
              Full Width Outline
            </Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Vertical Orientation"
          description="Buttons with vertical layout for icons and text."
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" orientation="vertical" icon="arrow-up">
              Up
            </Button>
            <Button variant="secondary" orientation="vertical" icon="arrow-down">
              Down
            </Button>
            <Button variant="tertiary" orientation="vertical" icon="arrow-left">
              Left
            </Button>
            <Button variant="outline" orientation="vertical" icon="arrow-right">
              Right
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button variant="primary" buttonType="pageHeader" orientation="vertical" icon="arrow-up">
              Up
            </Button>
            <Button
              variant="secondary"
              buttonType="pageHeader"
              orientation="vertical"
              icon="arrow-down"
            >
              Down
            </Button>
            <Button
              variant="tertiary"
              buttonType="pageHeader"
              orientation="vertical"
              icon="arrow-left"
            >
              Left
            </Button>
            <Button
              variant="outline"
              buttonType="pageHeader"
              orientation="vertical"
              icon="arrow-right"
            >
              Right
            </Button>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Button Combinations" description="Common button patterns.">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button variant="primary">Save Changes</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
            <div className="flex gap-3">
              <Button variant="destructive" icon="trash">
                Delete
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" icon="check">
                Confirm
              </Button>
              <Button variant="secondary" icon="x-mark">
                Reject
              </Button>
            </div>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="usage" title="Usage Guidelines">
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              When to Use Each Button Type
            </h3>
            <ul className="mb-4 space-y-2 text-sm text-secondary">
              <li>
                • <strong>Theme Buttons:</strong> Use for general UI actions throughout the
                application. These use darker shades of the theme primary color to maintain visual
                hierarchy.
              </li>
              <li>
                • <strong>Page Header Buttons:</strong> Use specifically in page headers and
                navigation areas. These use a dark blue color scheme (#043852) for consistency in
                header contexts.
              </li>
            </ul>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              When to Use Each Variant
            </h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li>• <strong>Primary:</strong> Main call-to-action, one per section</li>
              <li>• <strong>Secondary:</strong> Alternative actions, less prominent</li>
              <li>• <strong>Tertiary:</strong> Subtle actions with theme-primary text color</li>
              <li>• <strong>Outline:</strong> Secondary actions that need visibility</li>
              <li>• <strong>Ghost:</strong> Minimal actions, toolbar buttons</li>
              <li>• <strong>Destructive:</strong> Delete, remove, or irreversible actions</li>
            </ul>
          </div>
        </div>

        <DemoDoDont
          doItems={
            <ul className="space-y-1 text-sm text-secondary">
              <li>• Use clear, action-oriented labels</li>
              <li>• Limit primary buttons per view</li>
              <li>• Provide visual feedback on interaction</li>
              <li>• Use icons to reinforce meaning</li>
              <li>• Maintain consistent sizing in groups</li>
            </ul>
          }
          dontItems={
            <ul className="space-y-1 text-sm text-secondary">
              <li>• Use vague labels like &quot;Click Here&quot;</li>
              <li>• Disable buttons without explanation</li>
              <li>• Mix too many variants in one area</li>
              <li>• Use destructive style for safe actions</li>
              <li>• Rely solely on color for meaning</li>
            </ul>
          }
        />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            <p>
              All buttons are focusable and can be activated with <kbd>Enter</kbd> or{' '}
              <kbd>Space</kbd>.
            </p>
          </A11yCard>
          <A11yCard icon="eye" title="Icon-Only Buttons">
            <p>
              Always include <code className="text-xs">aria-label</code> for icon-only buttons to
              provide context for screen readers.
            </p>
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Focus States">
            <p>
              Buttons include visible focus indicators that meet WCAG 2.1 requirements for contrast.
            </p>
          </A11yCard>
          <A11yCard icon="no-symbol" title="Disabled State">
            <p>
              Disabled buttons are marked with the <code className="text-xs">disabled</code>{' '}
              attribute. Explain why buttons are disabled via tooltip or adjacent text.
            </p>
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
