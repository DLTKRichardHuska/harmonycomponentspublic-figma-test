import { useEffect } from 'react';
import {
  RadioButton,
  RadioField,
  RadioGroup,
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
  { name: 'value', type: 'string', default: '—', description: 'Required item value' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Circle size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the item' },
  { name: 'error / warning', type: 'boolean', default: 'false', description: 'Per-item validation chrome' },
  { name: 'RadioField.label', type: 'string', default: '—', description: 'Convenience labeled layout' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function RadioButtonsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Radio Buttons');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Radio Buttons"
        description="Radio buttons allow users to select a single option from a mutually exclusive set."
      />

      <ImportSnippet
        code={`import {
  RadioGroup,
  RadioField,
  RadioButton,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<RadioGroup defaultValue="a" name="demo">
  <RadioField label="Option A" value="a" />
  <RadioField label="Option B" value="b" />
</RadioGroup>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Radio" description="Must be wrapped in RadioGroup (Radix).">
          <RadioGroup defaultValue="opt2" name="basic">
            <RadioField label="Option 1" value="opt1" />
            <RadioField label="Option 2 (selected)" value="opt2" />
            <RadioField label="Option 3" value="opt3" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Small, medium, and large.">
          <RadioGroup defaultValue="md" name="sizes">
            <RadioField label="Small" value="sm" size="sm" />
            <RadioField label="Medium (default)" value="md" size="md" />
            <RadioField label="Large" value="lg" size="lg" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different radio button states.">
          <div className="flex flex-col gap-3">
            <RadioGroup defaultValue="checked" name="states">
              <RadioField label="Unchecked" value="unchecked" />
              <RadioField label="Checked" value="checked" />
            </RadioGroup>
            <RadioGroup defaultValue="checked-disabled" name="states-disabled">
              <RadioField label="Disabled" value="disabled" disabled />
              <RadioField label="Checked & Disabled" value="checked-disabled" disabled />
            </RadioGroup>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Layout" description="Radio buttons arranged horizontally.">
          <RadioGroup
            defaultValue="green"
            name="color"
            orientation="horizontal"
            className="gap-6"
          >
            <RadioField label="Red" value="red" />
            <RadioField label="Green" value="green" />
            <RadioField label="Blue" value="blue" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without Labels" description="Bare RadioButton with aria-label.">
          <RadioGroup defaultValue="b" name="nolabel" orientation="horizontal" className="gap-4">
            <RadioButton value="a" aria-label="A" />
            <RadioButton value="b" aria-label="B" />
            <RadioButton value="c" aria-label="C" disabled />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="State Variants" description="Warning and error on items.">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Warning States</h4>
              <RadioGroup defaultValue="w2" name="warn">
                <RadioField
                  label="Unchecked with warning"
                  value="w1"
                  warning
                  warningMessage="This action may have unintended consequences"
                />
                <RadioField
                  label="Checked with warning"
                  value="w2"
                  warning
                  warningMessage="Review this selection carefully"
                />
              </RadioGroup>
              <RadioGroup name="warn-disabled">
                <RadioField
                  label="Disabled warning"
                  value="w3"
                  disabled
                  warning
                  warningMessage="This option is currently unavailable"
                />
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Error States</h4>
              <RadioGroup defaultValue="e2" name="err">
                <RadioField label="Unchecked with error" value="e1" error errorMessage="This field is required" />
                <RadioField label="Checked with error" value="e2" error errorMessage="This selection is invalid" />
              </RadioGroup>
              <RadioGroup name="err-disabled">
                <RadioField
                  label="Disabled error"
                  value="e3"
                  disabled
                  error
                  errorMessage="Cannot select this option"
                />
              </RadioGroup>
            </div>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="RadioGroup required" icon="radio">
          Use <code>RadioGroup</code> as the root; Radix propagates <code>name</code> and manages
          roving tabindex. Prefer <code>RadioField</code> or <code>Label htmlFor</code>.
        </A11yCard>
        <A11yCard title="Keyboard" icon="command-line">
          Arrow keys move selection within the group; Space selects the focused item.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
