import { useEffect } from 'react';
import {
  Field,
  FieldLabel,
  Input,
  Label,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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
    name: 'htmlFor',
    type: 'string',
    default: '—',
    description: 'Associated control id (React htmlFor, not Astro for)',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Shows required asterisk',
  },
  {
    name: 'helper',
    type: 'string',
    default: '—',
    description: 'Helper text in parentheses after the label',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Label text',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra classes',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function LabelsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Labels');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Labels"
        description="Labels identify form inputs and provide context for users."
      />

      <ImportSnippet
        code={`import {
  Label,
  Field,
  FieldLabel,
  Input,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Label htmlFor="name">Full Name</Label>
<Input id="name" placeholder="Enter your name" />

{/* Prefer Field composition for forms */}
<Field>
  <FieldLabel htmlFor="email" required>Email</FieldLabel>
  <Input id="email" type="email" />
</Field>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Label" description="Standard label for inputs.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Required Label" description="Label with required indicator.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="email" required>
              Email Address
            </Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Helper Text" description="Label with additional context.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="phone" helper="optional">
              Phone Number
            </Label>
            <Input id="phone" type="tel" placeholder="(555) 555-5555" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Field composition"
          description="Prefer Field + FieldLabel for stacked layouts (shadcn-style)."
        >
          <div className="max-w-sm">
            <Field orientation="stacked">
              <FieldLabel htmlFor="field-name">Full Name</FieldLabel>
              <Input id="field-name" placeholder="Enter your name" />
            </Field>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Label Association" icon="tag">
          Always use <code>htmlFor</code> to associate labels with their corresponding form inputs.
          Prefer <code>Field</code> + <code>FieldLabel</code> for consistent form layout.
        </A11yCard>
        <A11yCard title="Required Indicators" icon="exclamation-circle">
          The <code>required</code> prop adds a visual asterisk. Pair with the control&apos;s{' '}
          <code>required</code> attribute for form validation.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
