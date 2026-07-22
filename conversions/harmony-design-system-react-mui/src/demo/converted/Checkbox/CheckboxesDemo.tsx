import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
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
import { demoPageTitle } from '@/demo/demoPageTitle';

const checkboxProps: PropRow[] = [
  { name: 'label', type: 'string', default: '—', description: 'Checkbox label text (via FormControlLabel)' },
  { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
  { name: 'warning', type: 'boolean', default: 'false', description: 'Parent FormControl color="warning"' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Parent FormControl error' },
  { name: 'warningMessage', type: 'string', default: '—', description: 'FormHelperText under FormControl' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'FormHelperText under FormControl' },
  { name: 'name', type: 'string', default: '—', description: 'Checkbox name attribute' },
  { name: 'id', type: 'string', default: '—', description: 'Checkbox id attribute' },
  { name: 'value', type: 'string', default: '—', description: 'Checkbox value' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'checked / disabled / name / id / value', type: '—', description: 'Same props on Checkbox' },
  { name: 'label', type: '—', description: 'FormControlLabel control + label' },
  { name: 'error', type: '—', description: 'Parent FormControl error (face color via theme)' },
  { name: 'warning', type: '—', description: 'Parent FormControl color="warning"' },
  { name: 'errorMessage / warningMessage', type: '—', description: 'FormHelperText + HarmonyIcon' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#usage', label: 'Usage' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function CheckboxesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Checkboxes');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Checkboxes"
        description="Checkboxes allow users to select one or more items from a set, or toggle a single option on/off."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Checkbox" description="Standard checkbox with label.">
          <FormGroup>
            <FormControlLabel control={<Checkbox name="basic-1" />} label="Option 1" />
            <FormControlLabel control={<Checkbox name="basic-2" defaultChecked />} label="Option 2 (checked)" />
            <FormControlLabel control={<Checkbox name="basic-3" />} label="Option 3" />
          </FormGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different checkbox states.">
          <FormGroup>
            <FormControlLabel control={<Checkbox name="state-unchecked" />} label="Unchecked" />
            <FormControlLabel control={<Checkbox name="state-checked" defaultChecked />} label="Checked" />
            <FormControlLabel control={<Checkbox name="state-disabled" disabled />} label="Disabled" />
            <FormControlLabel
              control={<Checkbox name="state-checked-disabled" defaultChecked disabled />}
              label="Checked & Disabled"
            />
          </FormGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without Labels" description="Checkboxes can be used without labels for compact layouts.">
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Checkbox name="no-label-1" slotProps={{ input: { 'aria-label': 'Unchecked' } }} />
            <Checkbox
              name="no-label-2"
              defaultChecked
              slotProps={{ input: { 'aria-label': 'Checked' } }}
            />
            <Checkbox
              name="no-label-3"
              disabled
              slotProps={{ input: { 'aria-label': 'Disabled' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="In a Form Group" description="Multiple checkboxes with a group label.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Notification Preferences</FormLabel>
            <FormGroup>
              <FormControlLabel control={<Checkbox name="notif-email" defaultChecked />} label="Email notifications" />
              <FormControlLabel control={<Checkbox name="notif-sms" />} label="SMS notifications" />
              <FormControlLabel control={<Checkbox name="notif-push" defaultChecked />} label="Push notifications" />
              <FormControlLabel control={<Checkbox name="notif-marketing" />} label="Marketing emails" />
            </FormGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Layout" description="Checkboxes arranged horizontally.">
          <FormGroup row>
            <FormControlLabel control={<Checkbox name="inline-a" />} label="Option A" />
            <FormControlLabel control={<Checkbox name="inline-b" defaultChecked />} label="Option B" />
            <FormControlLabel control={<Checkbox name="inline-c" />} label="Option C" />
            <FormControlLabel control={<Checkbox name="inline-d" />} label="Option D" />
          </FormGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="State Variants"
          description="Warning and error states for validation and important status information."
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Warning States
              </Typography>
              <Stack spacing={1.5}>
                <FormControl color="warning" variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="warning-unchecked" />}
                    label="Unchecked with warning"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
                    This action may have unintended consequences
                  </FormHelperText>
                </FormControl>
                <FormControl color="warning" variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="warning-checked" defaultChecked />}
                    label="Checked with warning"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
                    Review this selection carefully
                  </FormHelperText>
                </FormControl>
                <FormControl color="warning" variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="warning-disabled" disabled />}
                    label="Disabled warning"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
                    This option is currently unavailable
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Error States
              </Typography>
              <Stack spacing={1.5}>
                <FormControl error variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="error-unchecked" />}
                    label="Unchecked with error"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
                    This field is required
                  </FormHelperText>
                </FormControl>
                <FormControl error variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="error-checked" defaultChecked />}
                    label="Checked with error"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
                    This selection is invalid
                  </FormHelperText>
                </FormControl>
                <FormControl error variant="standard">
                  <FormControlLabel
                    control={<Checkbox name="error-disabled" disabled />}
                    label="Disabled error"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
                    Cannot select this option
                  </FormHelperText>
                </FormControl>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={checkboxProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="usage" title="Usage Guidelines">
        <Stack spacing={2}>
          <A11yCard icon="check" title="Do">
            Use for multiple selections. Provide clear labels. Group related options. Use error for
            validation failures and warning for cautionary information, with helpful message text.
          </A11yCard>
          <A11yCard icon="x-mark" title="Don't">
            Use for mutually exclusive options (use radio buttons). Pre-check options unexpectedly.
            Use error for warnings. Show error/warning states without helpful messages.
          </A11yCard>
        </Stack>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Labels">
            Prefer <code>FormControlLabel</code> so the control is associated with visible text. For
            label-less checkboxes, set <code>inputProps.aria-label</code> (or{' '}
            <code>slotProps.input[&#39;aria-label&#39;]</code>).
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard">
            Checkboxes are togglable with <kbd>Space</kbd> and navigable with <kbd>Tab</kbd>.
          </A11yCard>
          <A11yCard icon="check-badge" title="Error States">
            Wrap in <code>FormControl error</code> and associate messages with{' '}
            <code>FormHelperText</code>. Face colors inherit from the parent FormControl via theme.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
