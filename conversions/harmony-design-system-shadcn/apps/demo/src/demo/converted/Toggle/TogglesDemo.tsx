import { useEffect } from 'react';
import {
  Toggle,
  ToggleField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { UnsupportedEquivalentCallout } from '../../UnsupportedEquivalentCallout';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const propRows: PropRow[] = [
  { name: 'checked / defaultChecked', type: 'boolean', default: '—', description: 'Controlled / uncontrolled state' },
  { name: 'onCheckedChange', type: '(checked: boolean) => void', default: '—', description: 'Radix change handler' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the toggle' },
  { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Toggle size' },
  { name: 'name / id', type: 'string', default: '—', description: 'Form / DOM attributes' },
  { name: 'ToggleField.label', type: 'string', default: '—', description: 'Convenience labeled layout (Hybrid C)' },
  { name: 'ToggleField.labelVariant', type: "'stacked' | 'inline'", default: "'inline'", description: 'Label above or beside' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function TogglesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Toggle Switches');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Toggle Switches"
        description="Toggle switches are used for binary on/off settings where the effect is immediate."
      />

      <ImportSnippet
        code={`import {
  Toggle,
  ToggleField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ToggleField label="Enable notifications" />
<Toggle aria-label="Compact" defaultChecked />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature='variant="segmented"'
          reason="Radix Switch has no segmented two-label track equivalent. optionLabelLeft / optionLabelRight are also skipped."
        />

        <DemoExampleGroup title="Basic Toggle" description="Standard toggle switch.">
          <div className="flex flex-col gap-4">
            <ToggleField label="Enable notifications" name="notifications" />
            <ToggleField label="Dark mode" name="dark-mode" defaultChecked />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different toggle states.">
          <div className="flex flex-col gap-4">
            <ToggleField label="Unchecked" name="state-unchecked" />
            <ToggleField label="Checked" name="state-checked" defaultChecked />
            <ToggleField label="Disabled" name="state-disabled" disabled />
            <ToggleField label="Checked & Disabled" name="state-checked-disabled" defaultChecked disabled />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Different toggle sizes.">
          <div className="flex items-center gap-6">
            <ToggleField label="Small" name="size-sm" size="sm" />
            <ToggleField label="Medium" name="size-md" size="md" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without Label" description="Toggle without visible label (provide aria-label).">
          <div className="flex items-center gap-4">
            <Toggle name="nolabel-1" aria-label="Unchecked" />
            <Toggle name="nolabel-2" defaultChecked aria-label="Checked" />
            <Toggle name="nolabel-3" disabled aria-label="Disabled" />
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Prefer a visible label via <code>ToggleField</code> or compose <code>Label</code> with bare{' '}
          <code>Toggle</code>. For unlabeled switches, pass <code>aria-label</code>.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          Use <kbd>Tab</kbd> to move focus and <kbd>Space</kbd> to toggle.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          Radix Switch exposes <code>role=&quot;switch&quot;</code> and reflects checked state for assistive tech.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce the toggle label and current state (on/off). State changes are announced when
          toggles are activated.
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled toggles use the <code>disabled</code> attribute and are removed from the tab order.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
