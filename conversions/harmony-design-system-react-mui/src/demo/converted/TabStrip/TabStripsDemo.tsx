import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import { demoPageTitle } from '@/demo/demoPageTitle';

const tabsProps: PropRow[] = [
  { name: 'value', type: 'any', default: '—', description: 'Value of the currently selected Tab' },
  { name: 'onChange', type: 'func', default: '—', description: 'Fired when the selected tab changes' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'variant', type: "'standard' | 'scrollable' | 'fullWidth'", default: "'standard'", description: 'Layout behavior (scrollable enables overflow scrolling)' },
  { name: 'scrollButtons', type: "'auto' | true | false", default: "'auto'", description: 'Scroll button behavior when scrollable' },
];

const tabProps: PropRow[] = [
  { name: 'label', type: 'node', default: '—', description: 'Tab label' },
  { name: 'value', type: 'any', default: '—', description: 'Value matched against Tabs value' },
  { name: 'icon', type: 'element | string', default: '—', description: 'Icon shown with the label' },
  { name: 'iconPosition', type: "'top' | 'start' | 'end' | 'bottom'", default: "'top'", description: 'Icon position relative to label' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the tab' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'tabs[].id + active', type: '—', description: 'Controlled Tabs value + Tab value' },
  { name: 'tabs[].label', type: '—', description: 'Tab label' },
  { name: 'tabs[].icon + iconPosition left/right/top', type: '—', description: 'Tab icon + iconPosition start/end/top' },
  { name: 'tabs[].disabled', type: '—', description: 'Tab disabled' },
  { name: 'tabs[].href', type: '—', description: 'Tab component="a" href' },
  { name: 'iconPosition (component-level)', type: '—', description: 'Same iconPosition on every Tab' },
  { name: 'overflow', type: '—', description: 'Tabs variant="scrollable" (MUI native, not the Harmony More menu)' },
  { name: 'showAddTab', type: '—', description: 'Composite — Tabs + adjacent MUI IconButton (see "With Add Tab Button")' },
  { name: 'per-tab actions / More menu', type: '—', description: 'Not supported — see callout' },
  { name: 'variant compact / pill', type: '—', description: 'Not supported — see callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const scrollableTabs = Array.from({ length: 10 }, (_, i) => `Tab ${i + 1}`);

export function TabStripsDemo() {
  const [basic, setBasic] = useState(0);
  const [iconLeft, setIconLeft] = useState(0);
  const [iconRight, setIconRight] = useState(0);
  const [iconTop, setIconTop] = useState(0);
  const [disabledTab, setDisabledTab] = useState(0);
  const [enforced, setEnforced] = useState(0);
  const [scrollable, setScrollable] = useState(0);
  const [addableTabs, setAddableTabs] = useState(['Tab 1', 'Tab 2', 'Tab 3']);
  const [addable, setAddable] = useState(0);

  useEffect(() => {
    document.title = demoPageTitle('Tab Strip');
  }, []);

  const handleAddTab = () => {
    setAddableTabs((prev) => {
      const next = [...prev, `Tab ${prev.length + 1}`];
      setAddable(next.length - 1);
      return next;
    });
  };

  return (
    <Box component="article">
      <DemoPageHeader
        title="Tab Strip"
        description="Tabs organize content into separate views where only one view is visible at a time."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature='per-tab actions (open / close / ⋮) and the "More" overflow menu'
          reason="These are browser-tab chrome behaviors with no equivalent in MUI Tabs. Use Tabs variant='scrollable' for overflow; close/menu affordances are out of scope for this conversion. (Add-tab is available via composition — see the 'With Add Tab Button' example.)"
        />
        <UnsupportedEquivalentCallout
          feature='variant="compact" / variant="pill"'
          reason="MUI Tabs variants (standard / scrollable / fullWidth) control layout, not Harmony visual chrome. Compact density and the VP-only pill selected style are not part of the existing-mui surface."
        />

        <DemoExampleGroup title="Basic Tabs" description="Standard tab navigation.">
          <Box>
            <Tabs value={basic} onChange={(_e: SyntheticEvent, v: number) => setBasic(v)} aria-label="Basic tabs">
              <Tab label="Overview" />
              <Tab label="Features" />
              <Tab label="Pricing" />
              <Tab label="Reviews" />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Left)" description="Icons on the left (start) of the label.">
          <Box>
            <Tabs value={iconLeft} onChange={(_e: SyntheticEvent, v: number) => setIconLeft(v)} aria-label="Tabs with left icons">
              <Tab icon={<HarmonyIcon name="home" fontSize="inherit" />} iconPosition="start" label="Home" />
              <Tab icon={<HarmonyIcon name="user" fontSize="inherit" />} iconPosition="start" label="Profile" />
              <Tab icon={<HarmonyIcon name="cog-6-tooth" fontSize="inherit" />} iconPosition="start" label="Settings" />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Right)" description="Icons on the right (end) of the label.">
          <Box>
            <Tabs value={iconRight} onChange={(_e: SyntheticEvent, v: number) => setIconRight(v)} aria-label="Tabs with right icons">
              <Tab icon={<HarmonyIcon name="home" fontSize="inherit" />} iconPosition="end" label="Home" />
              <Tab icon={<HarmonyIcon name="user" fontSize="inherit" />} iconPosition="end" label="Profile" />
              <Tab icon={<HarmonyIcon name="cog-6-tooth" fontSize="inherit" />} iconPosition="end" label="Settings" />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons (Centered Over Text)" description="Icons above the label (top).">
          <Box>
            <Tabs value={iconTop} onChange={(_e: SyntheticEvent, v: number) => setIconTop(v)} aria-label="Tabs with top icons">
              <Tab icon={<HarmonyIcon name="home" fontSize="inherit" />} iconPosition="top" label="Home" />
              <Tab icon={<HarmonyIcon name="user" fontSize="inherit" />} iconPosition="top" label="Profile" />
              <Tab icon={<HarmonyIcon name="cog-6-tooth" fontSize="inherit" />} iconPosition="top" label="Settings" />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled Tab" description="A tab that cannot be selected.">
          <Box>
            <Tabs value={disabledTab} onChange={(_e: SyntheticEvent, v: number) => setDisabledTab(v)} aria-label="Tabs with a disabled tab">
              <Tab label="Active" />
              <Tab label="Normal" />
              <Tab label="Disabled" disabled />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Enforced Icon Position"
          description="Use the same iconPosition on every Tab to keep icons consistent."
        >
          <Box>
            <Tabs value={enforced} onChange={(_e: SyntheticEvent, v: number) => setEnforced(v)} aria-label="Tabs with enforced icon position">
              <Tab icon={<HarmonyIcon name="home" fontSize="inherit" />} iconPosition="top" label="Home" />
              <Tab icon={<HarmonyIcon name="user" fontSize="inherit" />} iconPosition="top" label="Profile" />
              <Tab icon={<HarmonyIcon name="cog-6-tooth" fontSize="inherit" />} iconPosition="top" label="Settings" />
            </Tabs>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Scrollable overflow"
          description="When tabs overflow, use variant='scrollable' with scroll buttons. This is the MUI overflow pattern (not the Harmony More dropdown)."
        >
          <Box sx={{ maxWidth: 400, border: '1px solid', borderColor: 'divider', p: 2 }}>
            <Tabs
              value={scrollable}
              onChange={(_e: SyntheticEvent, v: number) => setScrollable(v)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Scrollable tabs"
            >
              {scrollableTabs.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Resize the container to see scroll buttons appear.
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Add Tab Button"
          description="Compose a standard MUI Tabs with an adjacent IconButton to append and select a new tab. No custom TabStrip wrapper is needed."
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tabs value={addable} onChange={(_e: SyntheticEvent, v: number) => setAddable(v)} aria-label="Tabs with add button">
              {addableTabs.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
            <IconButton aria-label="Add tab" onClick={handleAddTab}>
              <HarmonyIcon name="plus" fontSize="inherit" />
            </IconButton>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={tabsProps} />
        <Box sx={{ mt: 3 }}>
          <PropsTable props={tabProps} />
        </Box>
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Roles" icon="tag">
          MUI Tabs render <code>role="tablist"</code> with <code>role="tab"</code> children and manage{' '}
          <code>aria-selected</code> automatically.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          <kbd>Arrow Left/Right</kbd> move between tabs, <kbd>Home</kbd>/<kbd>End</kbd> jump to first/last, and{' '}
          <kbd>Enter</kbd>/<kbd>Space</kbd> activate.
        </A11yCard>
        <A11yCard title="Labels" icon="tag">
          Provide <code>aria-label</code> on <code>Tabs</code> to describe the tab set for screen readers.
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled tabs are skipped in keyboard navigation and announced as disabled.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
