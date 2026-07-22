import { useEffect } from 'react';
import {
  CheckboxField,
  CheckboxGroup,
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
  { name: 'legend', type: 'string', default: '—', description: 'Fieldset legend' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout of child checkboxes' },
  { name: 'error / warning', type: 'boolean', default: 'false', description: 'Group validation chrome (propagates to faces)' },
  { name: 'errorMessage / warningMessage', type: 'string', default: '—', description: 'Message below the group' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Checkbox / CheckboxField children' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function CheckboxGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Checkbox Groups');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Checkbox Groups"
        description="Group related checkboxes with a shared legend and optional group-level validation."
      />

      <ImportSnippet
        code={`import {
  CheckboxGroup,
  CheckboxField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<CheckboxGroup legend="Preferences">
  <CheckboxField label="Email" name="email" />
  <CheckboxField label="SMS" name="sms" />
</CheckboxGroup>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Vertical Group" description="Default vertical orientation.">
          <CheckboxGroup legend="Notification Preferences">
            <CheckboxField label="Email notifications" name="cg-email" defaultChecked />
            <CheckboxField label="SMS notifications" name="cg-sms" />
            <CheckboxField label="Push notifications" name="cg-push" defaultChecked />
          </CheckboxGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Horizontal Group" description="Wraps to a column on small viewports.">
          <CheckboxGroup legend="Days" orientation="horizontal">
            <CheckboxField label="Mon" name="day-mon" />
            <CheckboxField label="Tue" name="day-tue" defaultChecked />
            <CheckboxField label="Wed" name="day-wed" />
            <CheckboxField label="Thu" name="day-thu" />
            <CheckboxField label="Fri" name="day-fri" defaultChecked />
          </CheckboxGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Group Error" description="Group-level error propagates face chrome to children.">
          <CheckboxGroup
            legend="Required selections"
            error
            errorMessage="Select at least one option"
          >
            <CheckboxField label="Option A" name="err-a" />
            <CheckboxField label="Option B" name="err-b" />
            <CheckboxField label="Option C" name="err-c" />
          </CheckboxGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Group Warning" description="Group-level warning state.">
          <CheckboxGroup
            legend="Optional extras"
            warning
            warningMessage="These options may increase cost"
          >
            <CheckboxField label="Express shipping" name="warn-a" defaultChecked />
            <CheckboxField label="Gift wrap" name="warn-b" />
          </CheckboxGroup>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Fieldset" icon="rectangle-group">
          Rendered as a fieldset with an optional legend. Each child owns its own{' '}
          <code>name</code>/<code>value</code>/<code>checked</code> (Astro parity).
        </A11yCard>
        <A11yCard title="Messages" icon="exclamation-circle">
          Group messages are linked via <code>aria-describedby</code> on the fieldset.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
