import { useEffect } from 'react';
import { RightSidebar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function RightSidebarDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Right Sidebar');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Right Sidebar"
        description="Mirror of the left rail on the right edge, vertically centered. Every variant starts with the Dela AI item (which shows its active logo and gradient when selected)."
      />

      <ImportSnippet
        code={`import { RightSidebar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<RightSidebar
  variant="cp"
  activeId={activeId}
  onItemSelect={(item, id) => setActiveId(id)}
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="CP rail (hover to expand)">
          <div className="flex min-h-[420px] items-start justify-end bg-[var(--page-bg)] p-4">
            <RightSidebar variant="cp" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Standard rail (VP/PPM/Maconomy)">
          <div className="flex min-h-[360px] items-start justify-end bg-[var(--page-bg)] p-4">
            <RightSidebar variant="vp" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Dela active" description="Selecting Dela AI shows its active logo and gradient tile.">
          <div className="flex min-h-[420px] items-start justify-end bg-[var(--page-bg)] p-4">
            <RightSidebar variant="cp" expanded activeId="0-0" />
          </div>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
