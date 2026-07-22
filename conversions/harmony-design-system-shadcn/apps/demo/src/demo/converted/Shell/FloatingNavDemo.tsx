import { useEffect } from 'react';
import { FloatingNav } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function FloatingNavDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Floating Nav');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Floating Nav"
        description="Costpoint action toolbar that hangs below the header (Execute, Actions, Refresh, Save, pin). Compose it into ShellLayout via the floatingNav slot for the CP surface."
        scope="FloatingNav"
      />

      <ImportSnippet
        code={`import { FloatingNav } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<FloatingNav onSave={() => save()} onExecute={() => run()} />`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Full variant" description="All four buttons.">
          <div className="flex justify-center py-4">
            <FloatingNav />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Compact variant" description="Execute button hidden.">
          <div className="flex justify-center py-4">
            <FloatingNav variant="compact" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Save disabled">
          <div className="flex justify-center py-4">
            <FloatingNav saveDisabled />
          </div>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
