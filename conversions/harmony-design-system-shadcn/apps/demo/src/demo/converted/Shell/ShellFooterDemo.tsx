import { useEffect, useState } from 'react';
import { ShellFooter } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function ShellFooterDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Shell Footer');
  }, []);

  const [value, setValue] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'planning', label: 'Planning' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <article>
      <DemoPageHeader
        title="Shell Footer"
        description="Bottom tab bar for VP/PPM/Maconomy workspaces (CP uses FloatingNav instead). Wraps the Tabs component on a dark bar; the active tab shows a pin and a primary-colored underline."
      />

      <ImportSnippet
        code={`import { ShellFooter } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ShellFooter
  value={value}
  onValueChange={setValue}
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'planning', label: 'Planning' },
  ]}
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Default" description="Active tab pinned; Add Tab button at the end.">
          <ShellFooter value={value} onValueChange={setValue} tabs={tabs} />
        </DemoExampleGroup>

        <DemoExampleGroup title="Compact variant">
          <ShellFooter defaultValue="overview" variant="compact" tabs={tabs} showAddButton={false} />
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
