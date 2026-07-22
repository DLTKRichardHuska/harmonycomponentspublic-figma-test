import { useEffect } from 'react';
import { ShellPageHeader } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function ShellPageHeaderDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Page Header');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Page Header"
        description="In-content title bar shown above page cards. Title + optional subtitle on the left; outline buttons then a primary button on the right (or a full actions override)."
      />

      <ImportSnippet
        code={`import { ShellPageHeader } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ShellPageHeader
  title="Projects"
  subtitle="All active engagements"
  outlineButtons={[{ text: 'Export' }]}
  primaryButton={{ text: 'New project', icon: 'plus' }}
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Title, subtitle and actions">
          <ShellPageHeader
            title="Projects"
            subtitle="All active engagements"
            outlineButtons={[{ text: 'Export' }]}
            primaryButton={{ text: 'New project', icon: 'plus' }}
          />
        </DemoExampleGroup>

        <DemoExampleGroup title="Title only">
          <ShellPageHeader title="Dashboard" />
        </DemoExampleGroup>

        <DemoExampleGroup title="Multiple outline buttons">
          <ShellPageHeader
            title="Invoices"
            outlineButtons={[{ text: 'Filter', icon: 'funnel' }, { text: 'Export' }]}
            primaryButton={{ text: 'Create', icon: 'plus' }}
          />
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
