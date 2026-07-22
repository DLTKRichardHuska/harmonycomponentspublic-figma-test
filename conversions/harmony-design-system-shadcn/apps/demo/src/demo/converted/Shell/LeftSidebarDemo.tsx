import { useEffect } from 'react';
import { LeftSidebar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function LeftSidebarDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Left Sidebar');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Left Sidebar"
        description="Icon rail that expands on hover to reveal labels. Ships default sections per product variant, or pass your own sections. Wire activeId + onItemSelect to drive a ShellPanel."
      />

      <ImportSnippet
        code={`import { LeftSidebar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<LeftSidebar
  variant="cp"
  activeId={activeId}
  onItemSelect={(item, id) => setActiveId(id)}
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="CP rail (hover to expand)" description="Two sections; hover to reveal labels.">
          <div className="flex min-h-[420px] items-start bg-[var(--page-bg)] p-4">
            <LeftSidebar variant="cp" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Standard rail (VP/PPM/Maconomy)">
          <div className="flex min-h-[360px] items-start bg-[var(--page-bg)] p-4">
            <LeftSidebar variant="vp" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Expanded (labels forced open)">
          <div className="flex min-h-[360px] items-start bg-[var(--page-bg)] p-4">
            <LeftSidebar variant="cp" expanded />
          </div>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
