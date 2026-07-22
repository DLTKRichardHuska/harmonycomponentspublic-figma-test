import { useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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

const switchProps: PropRow[] = [
  { name: 'checked', type: 'boolean', default: 'false', description: 'Toggle state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch' },
  { name: 'size', type: "'small' | 'medium'", default: "'medium'", description: 'Harmony sm → small; md → medium' },
  { name: 'name / id', type: 'string', default: '—', description: 'Form / DOM attributes on Switch' },
  { name: 'label', type: 'string', default: '—', description: 'Via FormControlLabel (default variant only)' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'default switch', type: '—', description: 'Switch' },
  { name: 'label', type: '—', description: 'FormControlLabel control + label' },
  { name: 'checked / disabled / name / id', type: '—', description: 'Same props on Switch' },
  { name: 'size sm / md', type: '—', description: 'size="small" / size="medium" + theme' },
  { name: 'variant segmented', type: '—', description: 'Not supported — see callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function TogglesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Toggle Switches');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Toggle Switches"
        description="Toggle switches are used for binary on/off settings where the effect is immediate."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature='variant="segmented"'
          reason="MUI Switch has no segmented two-label track equivalent. optionLabelLeft / optionLabelRight are also skipped."
        />

        <DemoExampleGroup title="Basic Toggle" description="Standard toggle switch.">
          <Stack spacing={2}>
            <FormControlLabel control={<Switch name="notifications" />} label="Enable notifications" />
            <FormControlLabel control={<Switch name="dark-mode" defaultChecked />} label="Dark mode" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different toggle states.">
          <Stack spacing={2}>
            <FormControlLabel control={<Switch name="state-unchecked" />} label="Unchecked" />
            <FormControlLabel control={<Switch name="state-checked" defaultChecked />} label="Checked" />
            <FormControlLabel control={<Switch name="state-disabled" disabled />} label="Disabled" />
            <FormControlLabel
              control={<Switch name="state-checked-disabled" defaultChecked disabled />}
              label="Checked & Disabled"
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Different toggle sizes.">
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <FormControlLabel control={<Switch name="size-sm" size="small" />} label="Small" />
            <FormControlLabel control={<Switch name="size-md" size="medium" />} label="Medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without Label" description="Toggle without visible label.">
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Switch name="nolabel-1" slotProps={{ input: { 'aria-label': 'Unchecked' } }} />
            <Switch name="nolabel-2" defaultChecked slotProps={{ input: { 'aria-label': 'Checked' } }} />
            <Switch name="nolabel-3" disabled slotProps={{ input: { 'aria-label': 'Disabled' } }} />
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={switchProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Prefer a visible label via <code>FormControlLabel</code>. For unlabeled switches, pass an accessible name
          with <code>slotProps.input[&apos;aria-label&apos;]</code>.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          Use <kbd>Tab</kbd> to move focus and <kbd>Space</kbd> to toggle.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          MUI Switch exposes a checkbox input with switch semantics; checked state is reflected for assistive tech.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce the toggle label and current state (on/off). State changes are announced when
          toggles are activated.
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled switches use the <code>disabled</code> attribute and are removed from the tab order.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
