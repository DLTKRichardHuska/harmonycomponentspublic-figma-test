import { useEffect, useState } from 'react';
import {
  Button,
  Field,
  FieldLabel,
  Input,
  InputField,
  Label,
  Textarea,
  TextareaField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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

const inputPropRows: PropRow[] = [
  {
    name: 'type',
    type: "'text' | 'email' | 'password' | 'number' | 'url' | 'search' | 'tel'",
    default: "'text'",
    description: 'Input type',
  },
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'Shows error state',
  },
  {
    name: 'errorMessage',
    type: 'string',
    default: '—',
    description: 'Error message below the input',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Leading Harmony Icon name',
  },
  {
    name: 'trailingIcon',
    type: 'string',
    default: '—',
    description: 'Trailing Icon name; ignored when trailing is set',
  },
  {
    name: 'trailing',
    type: 'ReactNode',
    default: '—',
    description: 'Trailing action slot (wins over trailingIcon)',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra classes on the input',
  },
];

const textareaPropRows: PropRow[] = [
  {
    name: 'rows',
    type: 'number',
    default: '4',
    description: 'Visible rows',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '—',
    description: 'Placeholder text',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the textarea',
  },
];

const fieldPropRows: PropRow[] = [
  {
    name: 'label',
    type: 'string',
    default: '—',
    description: 'Label text (required)',
  },
  {
    name: 'labelVariant',
    type: "'stacked' | 'inline'",
    default: 'product default (inline for cp)',
    description: 'Maps to Field orientation',
  },
  {
    name: 'helper',
    type: 'string',
    default: '—',
    description: 'Helper / description text',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#usage', label: 'Usage', icon: 'book-open' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function InputsDemo() {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = demoPageTitle('Inputs');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Inputs"
        description="Text inputs allow users to enter and edit text. Prefer Field composition or InputField for labeled layouts."
      />

      <ImportSnippet
        code={`import {
  Label,
  Input,
  Button,
  Textarea,
  Field,
  FieldLabel,
  InputField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

{/* Compose */}
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
</Field>

{/* Trailing action — icon-only ghost Button filling the right gutter */}
<Input
  type="password"
  trailing={
    <Button
      type="button"
      variant="ghost"
      size="sm"
      icon="eye"
      aria-label="Show password"
      className="h-full w-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
    />
  }
/>

{/* Convenience */}
<InputField label="Email" labelVariant="stacked" type="email" />`}
      />
      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Input" description="Standard text input with label.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="email-basic">Email</Label>
            <Input type="email" id="email-basic" placeholder="you@example.com" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Input Types" description="Different input types for various data.">
          <div className="max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-input">Text</Label>
              <Input type="text" id="text-input" placeholder="Enter text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-input">Email</Label>
              <Input type="email" id="email-input" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-input">Password</Label>
              <Input type="password" id="password-input" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number-type">Number</Label>
              <Input type="number" id="number-type" placeholder="0" />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icon" description="Input with leading icon for context.">
          <div className="max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-input">Search</Label>
              <Input icon="magnifying-glass" id="search-input" placeholder="Search..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-icon">Email</Label>
              <Input icon="envelope" type="email" id="email-icon" placeholder="you@example.com" />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Trailing icon and slot"
          description="trailingIcon for decoration; trailing for actions — use icon-only ghost Button filling the right gutter."
        >
          <div className="max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-trailing-icon">Trailing icon</Label>
              <Input id="input-trailing-icon" trailingIcon="currency-dollar" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-lead-trail">Leading and trailing icons</Label>
              <Input
                icon="magnifying-glass"
                id="input-lead-trail"
                trailingIcon="x-mark"
                placeholder="Search"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-trailing-slot">Trailing slot (action)</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="input-trailing-slot"
                placeholder="Password"
                trailing={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={showPassword ? 'eye-slash' : 'eye'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="h-full w-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    onClick={() => setShowPassword((v) => !v)}
                  />
                }
              />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different input states for feedback.">
          <div className="max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-state">Default</Label>
              <Input id="default-state" placeholder="Default state" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-state">Disabled</Label>
              <Input id="disabled-state" disabled defaultValue="Disabled input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="error-state">Error</Label>
              <Input
                id="error-state"
                error
                errorMessage="Please enter a valid value"
                defaultValue="Invalid value"
              />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Textarea" description="Multi-line text input.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="textarea-basic">Description</Label>
            <Textarea id="textarea-basic" placeholder="Enter your message..." />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="InputField (stacked)"
          description="Convenience composite — label + Input."
        >
          <div className="max-w-sm">
            <InputField
              label="Email Address"
              labelVariant="stacked"
              type="email"
              placeholder="you@example.com"
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="InputField (inline)"
          description="Convenience composite with horizontal label."
        >
          <div className="max-w-sm">
            <InputField
              label="Email Address"
              labelVariant="inline"
              type="email"
              placeholder="you@example.com"
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="TextareaField" description="Convenience composite for Textarea.">
          <div className="max-w-sm">
            <TextareaField
              label="Message"
              labelVariant="inline"
              placeholder="Enter your message..."
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Form Example" description="Compose Label + Input + Textarea.">
          <div className="max-w-md rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--card-bg)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Contact Form</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="first-name" required>
                    First Name
                  </FieldLabel>
                  <Input id="first-name" placeholder="John" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name" required>
                    Last Name
                  </FieldLabel>
                  <Input id="last-name" placeholder="Doe" required />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="contact-email" required>
                  Email
                </FieldLabel>
                <Input
                  icon="envelope"
                  type="email"
                  id="contact-email"
                  placeholder="john@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message" required>
                  Message
                </FieldLabel>
                <Textarea id="message" rows={4} placeholder="How can we help you?" required />
              </Field>
              <Button fullWidth type="submit">
                Send Message
              </Button>
            </form>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Form Example with InputField"
          description="Same form using convenience *Field composites."
        >
          <div className="max-w-md rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--card-bg)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
            <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">Contact Form</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="First Name" labelVariant="inline" placeholder="John" required />
                <InputField label="Last Name" labelVariant="inline" placeholder="Doe" required />
              </div>
              <InputField
                label="Email"
                labelVariant="inline"
                icon="envelope"
                type="email"
                placeholder="john@example.com"
                required
              />
              <TextareaField
                label="Message"
                labelVariant="inline"
                rows={4}
                placeholder="How can we help you?"
                required
              />
              <Button fullWidth type="submit">
                Send Message
              </Button>
            </form>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <h3 className="mb-3 text-base font-semibold">Input</h3>
        <PropsTable props={inputPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">Textarea</h3>
        <PropsTable props={textareaPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">InputField / TextareaField</h3>
        <PropsTable props={fieldPropRows} />
      </DemoSection>

      <DemoSection id="usage" title="Usage Guidelines">
        <DemoDoDont
          doItems={
            <ul className="list-inside list-disc space-y-1 text-sm text-secondary">
              <li>Always use labels with inputs (Label, FieldLabel, or *Field)</li>
              <li>Provide helpful placeholder text</li>
              <li>Show validation feedback inline with error + errorMessage</li>
              <li>Use appropriate input types</li>
            </ul>
          }
          dontItems={
            <ul className="list-inside list-disc space-y-1 text-sm text-secondary">
              <li>Use placeholder as a label</li>
              <li>Hide error messages</li>
              <li>Disable without explanation</li>
              <li>Use generic error messages</li>
            </ul>
          }
        />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Always associate labels with inputs using <code>htmlFor</code>. Prefer Field composition or{' '}
          <code>*Field</code> convenience composites.
        </A11yCard>
        <A11yCard title="Error Announcements" icon="exclamation-circle">
          Error messages are linked via <code>aria-describedby</code> when using{' '}
          <code>errorMessage</code>.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
