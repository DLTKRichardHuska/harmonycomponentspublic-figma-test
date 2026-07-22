import { useEffect, useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Tabs,
  TabsAddButton,
  TabsContent,
  TabsList,
  TabsTrigger,
  useTabOverflow,
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
  { name: 'Tabs.value / defaultValue', type: 'string', default: '—', description: 'Controlled / uncontrolled active tab (Radix Tabs.Root)' },
  { name: 'Tabs.onValueChange', type: '(value: string) => void', default: '—', description: 'Replaces the tab-strip:tab-selected event' },
  { name: 'Tabs.orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Radix orientation' },
  { name: 'TabsList.variant', type: "'default' | 'compact' | 'pill'", default: "'default'", description: 'Visual variant (pill is VP-only, like the reference)' },
  { name: 'TabsList.iconPosition', type: "'left' | 'right' | 'top'", default: '—', description: 'Enforce one icon position across all triggers' },
  { name: 'TabsList.overflow', type: "'none' | 'scroll' | 'menu'", default: "'none'", description: 'scroll = horizontal scroll; menu = compose useTabOverflow + DropdownMenu' },
  { name: 'TabsTrigger.value', type: 'string', default: '—', description: 'Required tab identity' },
  { name: 'TabsTrigger.icon', type: 'string', default: '—', description: 'Harmony Icon name' },
  { name: 'TabsTrigger.iconPosition', type: "'left' | 'right' | 'top'", default: "'left'", description: 'Per-trigger icon position' },
  { name: 'TabsTrigger.disabled', type: 'boolean', default: 'false', description: 'Disable the tab' },
  { name: 'TabsTrigger.actions', type: 'ReactNode', default: '—', description: 'Per-tab toolbar (compose Button / DropdownMenu)' },
  { name: 'TabsContent.value', type: 'string', default: '—', description: 'Panel tied to a trigger value' },
  { name: 'TabsAddButton', type: 'Button props', default: '—', description: 'Convenience add-tab button (composed inside TabsList)' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#events', label: 'Events', icon: 'bolt' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

function PerTabActionsExample() {
  const [tabs, setTabs] = useState([
    { value: '1', label: 'Documents', menu: true },
    { value: '2', label: 'Reports', menu: true },
    { value: '3', label: 'Settings', menu: false },
  ]);
  const [value, setValue] = useState('1');

  const closeTab = (v: string) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.value !== v);
      if (v === value && next.length) setValue(next[0].value);
      return next;
    });
  };

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            actions={
              <>
                <Button
                  variant="ghost"
                  size="xs"
                  icon="arrow-top-right-on-square"
                  aria-label={`Open ${tab.label} in new window`}
                  onClick={() => console.log('open-new-window', tab.value)}
                />
                <Button
                  variant="ghost"
                  size="xs"
                  icon="x-mark"
                  aria-label={`Close ${tab.label}`}
                  onClick={() => closeTab(tab.value)}
                />
                {tab.menu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        icon="ellipsis-vertical"
                        aria-label={`More actions for ${tab.label}`}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => console.log('set-default', tab.value)}>
                        Set as default
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </>
            }
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function AutoOverflowExample() {
  const tabs = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `Tab ${i + 1}`,
  }));
  const [value, setValue] = useState('1');
  const { containerRef, hiddenFrom, hasOverflow } = useTabOverflow(tabs.length, { reserve: 150 });
  const overflowed = tabs.filter((_, i) => i >= hiddenFrom);

  return (
    <div className="w-[400px] border border-[var(--border-color)] p-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList ref={containerRef}>
          {tabs.map((tab, i) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={i >= hiddenFrom ? 'hidden' : undefined}
            >
              {tab.label}
            </TabsTrigger>
          ))}
          {hasOverflow ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto shrink-0">
                  More ({overflowed.length})
                  <Icon name="ellipsis-horizontal" size="sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {overflowed.map((tab) => (
                  <DropdownMenuItem key={tab.value} onSelect={() => setValue(tab.value)}>
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </TabsList>
      </Tabs>
      <p className="mt-2 text-sm text-secondary">
        Resize the container/viewport: tabs that no longer fit move into the &ldquo;More&rdquo; menu.
      </p>
    </div>
  );
}

export function TabStripsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Tab Strip');
  }, []);

  const manualOverflowTabs = [
    { value: '5', label: 'Tab 5', icon: 'document' },
    { value: '6', label: 'Tab 6', icon: 'folder' },
    { value: '7', label: 'Tab 7', icon: 'chart-bar' },
  ];
  const [manualValue, setManualValue] = useState('1');

  return (
    <article>
      <DemoPageHeader
        title="Tab Strip"
        description="Tabs organize content into separate views where only one view is visible at a time. This shadcn conversion is a Radix Tabs compound: compose triggers, actions, add-tab, and overflow menus instead of passing a tabs[] array."
      />

      <ImportSnippet
        code={`import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="features">Features</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="features">Features content</TabsContent>
</Tabs>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--elevated-bg)] p-4 text-sm text-secondary">
          <p className="mb-1 font-semibold text-foreground">Composition, not a tabs[] array</p>
          The Astro <code>tabs[]</code> data prop, named content slots, and custom DOM events are
          replaced by Radix compound children (<code>TabsTrigger</code> / <code>TabsContent</code>),
          the <code>actions</code> slot, <code>TabsAddButton</code>, and React callbacks.
        </div>

        <DemoExampleGroup title="Basic Tabs" description="Standard tab navigation.">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              This is the overview content. Click other tabs to switch views.
            </TabsContent>
            <TabsContent value="features">Features content.</TabsContent>
            <TabsContent value="pricing">Pricing content.</TabsContent>
            <TabsContent value="reviews">Reviews content.</TabsContent>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Left)" description="Tabs with icons on the left of the label.">
          <Tabs defaultValue="home">
            <TabsList>
              <TabsTrigger value="home" icon="home">Home</TabsTrigger>
              <TabsTrigger value="profile" icon="user">Profile</TabsTrigger>
              <TabsTrigger value="settings" icon="cog-6-tooth">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="home">Home tab content.</TabsContent>
            <TabsContent value="profile">Profile tab content.</TabsContent>
            <TabsContent value="settings">Settings tab content.</TabsContent>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Right)" description="Tabs with icons on the right of the label.">
          <Tabs defaultValue="home">
            <TabsList>
              <TabsTrigger value="home" icon="home" iconPosition="right">Home</TabsTrigger>
              <TabsTrigger value="profile" icon="user" iconPosition="right">Profile</TabsTrigger>
              <TabsTrigger value="settings" icon="cog-6-tooth" iconPosition="right">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Centered Over Text)" description="Tabs with icons centered above the text label.">
          <Tabs defaultValue="home">
            <TabsList>
              <TabsTrigger value="home" icon="home" iconPosition="top">Home</TabsTrigger>
              <TabsTrigger value="profile" icon="user" iconPosition="top">Profile</TabsTrigger>
              <TabsTrigger value="settings" icon="cog-6-tooth" iconPosition="top">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled Tab" description="Tab that cannot be selected.">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="normal">Normal</TabsTrigger>
              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Add Tab Button" description="Compose TabsAddButton at the end of the list.">
          <Tabs defaultValue="1">
            <TabsList>
              <TabsTrigger value="1">Tab 1</TabsTrigger>
              <TabsTrigger value="2">Tab 2</TabsTrigger>
              <TabsTrigger value="3">Tab 3</TabsTrigger>
              <TabsAddButton onClick={() => console.log('add-tab')} />
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Per-tab actions (open, close, ⋮)"
          description="Compose Button actions and a DropdownMenu into each trigger via the actions slot. Close removes the tab; the ⋮ menu (styled like Select) lists Set as default. Settings omits the menu."
        >
          <PerTabActionsExample />
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Overflow Handling"
          description="overflow via useTabOverflow + a composed DropdownMenu. Tabs that don't fit appear in the More menu."
        >
          <AutoOverflowExample />
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Manual Overflow Control"
          description="Choose exactly which tabs live in the overflow menu by composing them into a DropdownMenu."
        >
          <Tabs value={manualValue} onValueChange={setManualValue}>
            <TabsList>
              <TabsTrigger value="1">Tab 1</TabsTrigger>
              <TabsTrigger value="2">Tab 2</TabsTrigger>
              <TabsTrigger value="3">Tab 3</TabsTrigger>
              <TabsTrigger value="4">Tab 4</TabsTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                    More ({manualOverflowTabs.length})
                    <Icon name="ellipsis-horizontal" size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {manualOverflowTabs.map((tab) => (
                    <DropdownMenuItem key={tab.value} onSelect={() => setManualValue(tab.value)}>
                      <Icon name={tab.icon} size="sm" />
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup title="Compact Variant" description="A more condensed version with reduced height and padding.">
          <Tabs defaultValue="overview">
            <TabsList variant="compact">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="VP Pill Variant"
          description="Selected tab uses a filled pill instead of a bottom border. VP theme only—switch Product to VP to see the pill; other products keep the underline."
        >
          <Tabs defaultValue="overview">
            <TabsList variant="pill">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transformation">Transformation</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Content for the selected tab.</TabsContent>
          </Tabs>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Enforced Icon Position"
          description="Set iconPosition on TabsList to enforce consistent positioning across all triggers."
        >
          <Tabs defaultValue="home">
            <TabsList iconPosition="top">
              <TabsTrigger value="home" icon="home">Home</TabsTrigger>
              <TabsTrigger value="profile" icon="user">Profile</TabsTrigger>
              <TabsTrigger value="settings" icon="cog-6-tooth">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="events" title="Events">
        <p className="mb-4 text-sm text-secondary">
          The reference dispatches custom DOM events; the shadcn compound uses React callbacks and
          composed handlers instead.
        </p>
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[var(--elevated-bg)] text-foreground">
              <tr>
                <th className="p-3 font-semibold">Reference event</th>
                <th className="p-3 font-semibold">shadcn equivalent</th>
              </tr>
            </thead>
            <tbody className="text-secondary">
              {[
                ['tab-strip:tab-selected', 'Tabs onValueChange'],
                ['tab-strip:add-tab', 'TabsAddButton onClick'],
                ['tab-strip:close-tab', 'actions close Button onClick'],
                ['tab-strip:open-new-window', 'actions open Button onClick'],
                ['tab-strip:set-default', 'DropdownMenuItem onSelect'],
              ].map(([ref, shad]) => (
                <tr key={ref} className="border-t border-[var(--border-color)]">
                  <td className="p-3"><code>{ref}</code></td>
                  <td className="p-3"><code>{shad}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          Radix Tabs manages roving focus: <kbd>Tab</kbd> to reach the tablist, <kbd>Arrow</kbd> keys
          to move between tabs, <kbd>Home</kbd>/<kbd>End</kbd> to jump, and <kbd>Enter</kbd>/
          <kbd>Space</kbd> to activate. <kbd>Escape</kbd> closes an open menu.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          Radix applies <code>role=&quot;tablist&quot;</code>, <code>role=&quot;tab&quot;</code>,{' '}
          <code>aria-selected</code>, <code>aria-disabled</code>, and <code>aria-controls</code>{' '}
          wiring triggers to <code>TabsContent</code> panels.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Tab labels, active state, and disabled state are announced. Icon-only action buttons pass an{' '}
          <code>aria-label</code>.
        </A11yCard>
        <A11yCard title="Focus Management" icon="cursor-arrow-rays">
          Focus indicators are visible on triggers and composed action buttons; the DropdownMenu
          manages focus when opened.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
