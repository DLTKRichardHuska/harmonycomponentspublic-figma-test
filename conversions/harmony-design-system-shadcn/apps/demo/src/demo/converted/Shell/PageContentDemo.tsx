import { useEffect } from 'react';
import { Card, ShellPageHeader } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function PageContentDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Page Content');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Page Content"
        description="The scrollable main region of ShellLayout. Pass your application content as ShellLayout children — typically a ShellPageHeader followed by cards. There is no dedicated component: it is simply the children slot."
      />

      <ImportSnippet
        code={`<ShellLayout header={<ShellHeader />}>
  <ShellPageHeader title="Projects" />
  {/* your cards / content */}
</ShellLayout>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Page header + cards" description="A typical content region.">
          <div className="bg-[var(--page-bg)] p-6">
            <ShellPageHeader
              title="Projects"
              subtitle="All active engagements"
              primaryButton={{ text: 'New project', icon: 'plus' }}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="mb-1 font-semibold text-foreground">Card one</h3>
                <p className="text-sm text-secondary">Content lives in the scrollable main region.</p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-1 font-semibold text-foreground">Card two</h3>
                <p className="text-sm text-secondary">The shell provides structure; you provide content.</p>
              </Card>
            </div>
          </div>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
