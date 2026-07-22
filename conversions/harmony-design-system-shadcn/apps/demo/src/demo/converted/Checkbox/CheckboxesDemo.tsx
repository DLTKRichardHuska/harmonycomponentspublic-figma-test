import { useEffect } from 'react';
import {
  Checkbox,
  CheckboxField,
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

const propRows: PropRow[] = [
  { name: 'checked / defaultChecked', type: 'boolean', default: '—', description: 'Controlled / uncontrolled checked state' },
  { name: 'onCheckedChange', type: '(checked: boolean) => void', default: '—', description: 'Radix change handler' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
  { name: 'error / warning', type: 'boolean', default: 'false', description: 'Validation chrome' },
  { name: 'errorMessage / warningMessage', type: 'string', default: '—', description: 'Message below control' },
  { name: 'name / id / value', type: 'string', default: '—', description: 'Native-like attributes' },
  { name: 'CheckboxField.label', type: 'string', default: '—', description: 'Convenience labeled layout (Hybrid C)' },
  { name: 'CheckboxField.labelVariant', type: "'stacked' | 'inline'", default: "'inline'", description: 'Label above or beside' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#usage', label: 'Usage', icon: 'book-open' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function CheckboxesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Checkboxes');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Checkboxes"
        description="Checkboxes allow users to select one or more items from a set, or toggle a single option on/off."
      />

      <ImportSnippet
        code={`import {
  Checkbox,
  CheckboxField,
  Label,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<CheckboxField label="Option 1" name="basic-1" />
<Checkbox aria-label="Compact" defaultChecked />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Checkbox" description="Standard checkbox with label via CheckboxField.">
          <div className="flex flex-col gap-3">
            <CheckboxField label="Option 1" name="basic-1" />
            <CheckboxField label="Option 2 (checked)" name="basic-2" defaultChecked />
            <CheckboxField label="Option 3" name="basic-3" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different checkbox states.">
          <div className="flex flex-col gap-3">
            <CheckboxField label="Unchecked" name="state-unchecked" />
            <CheckboxField label="Checked" name="state-checked" defaultChecked />
            <CheckboxField label="Disabled" name="state-disabled" disabled />
            <CheckboxField label="Checked & Disabled" name="state-checked-disabled" defaultChecked disabled />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without Labels" description="Bare Checkbox for compact layouts (provide aria-label).">
          <div className="flex items-center gap-4">
            <Checkbox name="no-label-1" aria-label="Unchecked" />
            <Checkbox name="no-label-2" defaultChecked aria-label="Checked" />
            <Checkbox name="no-label-3" disabled aria-label="Disabled" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="In a Form Group" description="Multiple checkboxes with a group label.">
          <fieldset className="flex flex-col gap-4 border-0 p-0 m-0">
            <legend className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
              Notification Preferences
            </legend>
            <div className="flex flex-col gap-3 pl-4">
              <CheckboxField label="Email notifications" name="notif-email" defaultChecked />
              <CheckboxField label="SMS notifications" name="notif-sms" />
              <CheckboxField label="Push notifications" name="notif-push" defaultChecked />
              <CheckboxField label="Marketing emails" name="notif-marketing" />
            </div>
          </fieldset>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Layout" description="Checkboxes arranged horizontally.">
          <div className="flex flex-wrap items-center gap-6">
            <CheckboxField label="Option A" name="inline-a" />
            <CheckboxField label="Option B" name="inline-b" defaultChecked />
            <CheckboxField label="Option C" name="inline-c" />
            <CheckboxField label="Option D" name="inline-d" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="State Variants"
          description="Warning and error states for validation."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Warning States</h4>
              <CheckboxField
                label="Unchecked with warning"
                name="warning-unchecked"
                warning
                warningMessage="This action may have unintended consequences"
              />
              <CheckboxField
                label="Checked with warning"
                name="warning-checked"
                defaultChecked
                warning
                warningMessage="Review this selection carefully"
              />
              <CheckboxField
                label="Disabled warning"
                name="warning-disabled"
                disabled
                warning
                warningMessage="This option is currently unavailable"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Error States</h4>
              <CheckboxField
                label="Unchecked with error"
                name="error-unchecked"
                error
                errorMessage="This field is required"
              />
              <CheckboxField
                label="Checked with error"
                name="error-checked"
                defaultChecked
                error
                errorMessage="This selection conflicts with other settings"
              />
              <CheckboxField
                label="Disabled error"
                name="error-disabled"
                disabled
                error
                errorMessage="This option cannot be selected"
              />
            </div>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="usage" title="Usage Guidelines">
        <DemoDoDont
          doItems={
            <ul className="space-y-1 text-sm text-secondary">
              <li>• Use for multiple selections</li>
              <li>• Provide clear, concise labels</li>
              <li>• Group related options together</li>
              <li>• Use for binary on/off choices</li>
              <li>• Use error state for validation failures</li>
              <li>• Use warning state for cautionary information</li>
              <li>• Provide helpful message text with warning/error states</li>
            </ul>
          }
          dontItems={
            <ul className="space-y-1 text-sm text-secondary">
              <li>• Use for mutually exclusive options (use radio buttons)</li>
              <li>• Have checkboxes without labels</li>
              <li>• Use negative phrasing</li>
              <li>• Pre-check options unexpectedly</li>
              <li>• Use error state for warnings (use warning state instead)</li>
              <li>• Show error/warning states without helpful messages</li>
            </ul>
          }
        />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Associate labels via <code>CheckboxField</code> or <code>Label htmlFor</code> matching the
          control id. Unlabeled checkboxes need an <code>aria-label</code>.
        </A11yCard>
        <A11yCard title="Keyboard" icon="command-line">
          Space toggles; Tab moves focus. Validation messages use <code>aria-describedby</code>.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
