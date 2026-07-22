import { useEffect } from 'react';
import {
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
  { name: 'name', type: 'string', default: '—', description: 'Propagated to items by Radix' },
  { name: 'value / defaultValue', type: 'string', default: '—', description: 'Controlled / uncontrolled selection' },
  { name: 'onValueChange', type: '(value: string) => void', default: '—', description: 'Selection change' },
  { name: 'legend', type: 'string', default: '—', description: 'Fieldset legend' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Item layout' },
  { name: 'error / warning', type: 'boolean', default: 'false', description: 'Group validation chrome' },
  { name: 'errorMessage / warningMessage', type: 'string', default: '—', description: 'Group message' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function RadioGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Radio Groups');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Radio Groups"
        description="Group mutually exclusive radio options with a shared legend and optional validation."
      />

      <ImportSnippet
        code={`import {
  RadioGroup,
  RadioField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<RadioGroup legend="Shipping" defaultValue="standard" name="ship">
  <RadioField label="Standard" value="standard" />
  <RadioField label="Express" value="express" />
</RadioGroup>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Vertical Group" description="Default vertical layout.">
          <RadioGroup legend="Shipping method" defaultValue="standard" name="ship-v">
            <RadioField label="Standard (5–7 days)" value="standard" />
            <RadioField label="Express (2–3 days)" value="express" />
            <RadioField label="Overnight" value="overnight" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Horizontal Group" description="Stacks on small viewports.">
          <RadioGroup
            legend="Plan"
            orientation="horizontal"
            defaultValue="pro"
            name="plan"
          >
            <RadioField label="Free" value="free" />
            <RadioField label="Pro" value="pro" />
            <RadioField label="Enterprise" value="enterprise" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Group Error" description="Group-level error propagates to faces.">
          <RadioGroup
            legend="Payment"
            error
            errorMessage="Select a payment method"
            name="pay-err"
          >
            <RadioField label="Card" value="card" />
            <RadioField label="Invoice" value="invoice" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Group Warning" description="Group-level warning.">
          <RadioGroup
            legend="Region"
            warning
            warningMessage="Changing region may reset preferences"
            defaultValue="us"
            name="region"
          >
            <RadioField label="United States" value="us" />
            <RadioField label="Europe" value="eu" />
          </RadioGroup>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Name propagation" icon="link">
          Unlike Astro, Radix propagates <code>name</code> to items — do not duplicate{' '}
          <code>name</code> on each <code>RadioField</code>.
        </A11yCard>
        <A11yCard title="Validation" icon="exclamation-circle">
          Prefer group-level validation over per-item error for mutually exclusive choices.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
