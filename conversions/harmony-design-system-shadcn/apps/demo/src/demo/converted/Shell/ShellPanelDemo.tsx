import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  RightSidebar,
  ShellHeader,
  ShellLayout,
  ShellPanel,
  type SidebarItem,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';
import { ShellDemoFrame } from './ShellDemoFrame';

export function ShellPanelDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Shell Panel');
  }, []);

  const [rightOpen, setRightOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [panelTitle, setPanelTitle] = useState('Panel');
  const [panelIcon, setPanelIcon] = useState<string | undefined>(undefined);
  const [gradient, setGradient] = useState(false);

  const handleSelect = (item: SidebarItem, id: string) => {
    setActiveId(id);
    setPanelTitle(item.panelTitle ?? item.label);
    setPanelIcon(item.panelIcon ?? item.icon);
    setGradient(item.label === 'Dela AI');
    setRightOpen(true);
  };

  const closeRight = () => {
    setRightOpen(false);
    setActiveId(undefined);
  };

  const [leftOpen, setLeftOpen] = useState(false);

  return (
    <article>
      <DemoPageHeader
        title="Shell Panel"
        description="Non-modal slide-out drawer that extends from a sidebar. Controlled via open / onOpenChange, with a theme or default header, narrow/full width (user-toggleable), and an optional Dela gradient header."
      />

      <ImportSnippet
        code={`import { ShellPanel } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ShellPanel
  side="right"
  open={open}
  onOpenChange={setOpen}
  title="Notifications"
  titleIcon="bell"
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Right panel wired to the sidebar"
          description="Select a right-sidebar item to open the panel; Dela AI uses the gradient header. Use the width button in the header to toggle narrow/full."
        >
          <ShellDemoFrame height={520}>
            <ShellLayout
              productVariant="cp"
              header={<ShellHeader productName="Costpoint" />}
              rightSidebar={
                <RightSidebar
                  variant="cp"
                  activeId={activeId}
                  panelOpen={rightOpen}
                  onItemSelect={handleSelect}
                />
              }
              rightPanel={
                <ShellPanel
                  side="right"
                  open={rightOpen}
                  onOpenChange={(o) => (o ? setRightOpen(true) : closeRight())}
                  title={panelTitle}
                  titleIcon={panelIcon}
                  gradientHeader={gradient}
                >
                  <p className="text-sm text-secondary">
                    Contextual content for <strong>{panelTitle}</strong>.
                  </p>
                </ShellPanel>
              }
            >
              <Card className="p-6">
                <p className="text-secondary">Open a panel from the right rail.</p>
              </Card>
            </ShellLayout>
          </ShellDemoFrame>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Left panel, default header"
          description="A default (non-theme) header variant sliding from the left."
        >
          <ShellDemoFrame height={440}>
            <ShellLayout
              productVariant="standard"
              header={<ShellHeader productName="Vantagepoint" showCompanyPicker={false} />}
              leftPanel={
                <ShellPanel
                  side="left"
                  open={leftOpen}
                  onOpenChange={setLeftOpen}
                  headerVariant="default"
                  title="Filters"
                  titleIcon="funnel"
                  showPopout={false}
                >
                  <p className="text-sm text-secondary">Left panel content.</p>
                </ShellPanel>
              }
            >
              <Card className="p-6">
                <Button variant="primary" onClick={() => setLeftOpen((v) => !v)}>
                  {leftOpen ? 'Close' : 'Open'} left panel
                </Button>
              </Card>
            </ShellLayout>
          </ShellDemoFrame>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
