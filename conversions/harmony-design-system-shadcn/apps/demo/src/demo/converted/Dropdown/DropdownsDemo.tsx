import { useEffect } from 'react';
import {
  Label,
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  { name: 'value / defaultValue', type: 'string', default: '—', description: 'Controlled / uncontrolled selected value' },
  { name: 'onValueChange', type: '(value: string) => void', default: '—', description: 'Radix change handler' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
  { name: 'name', type: 'string', default: '—', description: 'Form name on Select root' },
  { name: 'SelectValue.placeholder', type: 'string', default: "'Select an option'", description: 'Placeholder when empty' },
  { name: 'SelectField.label', type: 'string', default: '—', description: 'Convenience labeled layout (Hybrid C)' },
  { name: 'SelectField.labelVariant', type: "'stacked' | 'inline'", default: 'product default', description: 'stacked or inline (cp defaults inline)' },
  { name: 'SelectItem', type: 'children', default: '—', description: 'Compose options as SelectItem children (no options[] API)' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

const countryItems = (
  <>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="ca">Canada</SelectItem>
    <SelectItem value="uk">United Kingdom</SelectItem>
    <SelectItem value="de">Germany</SelectItem>
    <SelectItem value="fr">France</SelectItem>
  </>
);

const priorityItems = (
  <>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="high">High</SelectItem>
    <SelectItem value="urgent">Urgent</SelectItem>
  </>
);

export function DropdownsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Dropdowns');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Dropdowns"
        description="Dropdowns allow users to select an option from a list. They're useful when space is limited or options exceed 5 items."
      />

      <ImportSnippet
        code={`import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<SelectField label="Country" placeholder="Select a country">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="ca">Canada</SelectItem>
</SelectField>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="options[] / trigger / option-* slots"
          reason="shadcn Select uses compound SelectItem children instead of Astro options arrays or named slots."
        />

        <DemoExampleGroup title="Basic Dropdown" description="Standard dropdown with options.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="basic-country">Country</Label>
            <Select name="basic-country">
              <SelectTrigger id="basic-country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>{countryItems}</SelectContent>
            </Select>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Label (Stacked)" description="Dropdown with label on top (default for non-CP themes).">
          <div className="max-w-sm">
            <SelectField label="Country" labelVariant="stacked" placeholder="Select a country" name="stacked-country">
              {countryItems}
            </SelectField>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Label (Inline)" description="Dropdown with label to the left (default for CP theme).">
          <div className="max-w-sm">
            <SelectField label="Country" labelVariant="inline" placeholder="Select a country" name="inline-country">
              {countryItems}
            </SelectField>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Pre-selected Value" description="Dropdown with a default selection.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>{priorityItems}</SelectContent>
            </Select>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled" description="Disabled dropdown state.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="disabled-country">Country (Disabled)</Label>
            <Select name="disabled-country" defaultValue="us" disabled>
              <SelectTrigger id="disabled-country">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>{countryItems}</SelectContent>
            </Select>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Use <code>SelectField</code> or associate a <code>Label</code> with the trigger <code>id</code>.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          <kbd>Space</kbd> / <kbd>Enter</kbd> opens the list; arrow keys move between options; <kbd>Enter</kbd> selects;
          <kbd>Escape</kbd> closes.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          Radix Select provides listbox semantics on the content and appropriate roles on the trigger and items.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce the label, current value, and option list when opened.
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled selects use the <code>disabled</code> prop on the root and are not interactive.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
