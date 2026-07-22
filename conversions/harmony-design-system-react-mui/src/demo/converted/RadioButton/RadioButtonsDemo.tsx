import { useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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

const radioProps: PropRow[] = [
  { name: 'name', type: 'string', default: '—', description: 'Radio group name (required; or via RadioGroup)' },
  { name: 'value', type: 'string', default: '—', description: 'Radio value (required)' },
  { name: 'id', type: 'string', default: '—', description: 'Element ID' },
  { name: 'label', type: 'string', default: '—', description: 'Via FormControlLabel' },
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Radio size (large via theme)' },
  { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the radio' },
  { name: 'warning', type: 'boolean', default: 'false', description: 'Parent FormControl color="warning"' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Parent FormControl error' },
  { name: 'warningMessage', type: 'string', default: '—', description: 'FormHelperText' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'FormHelperText' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'name / value / checked / disabled / id', type: '—', description: 'Same on Radio (name often from RadioGroup)' },
  { name: 'label', type: '—', description: 'FormControlLabel' },
  { name: 'size small / medium / large', type: '—', description: 'size prop; theme SVG 16 / 22 / 26px; large via theme variants' },
  { name: 'error / warning', type: '—', description: 'Parent FormControl error / color="warning"' },
  { name: 'errorMessage / warningMessage', type: '—', description: 'FormHelperText + HarmonyIcon' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function RadioButtonsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Radio Buttons');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Radio Buttons"
        description="Radio buttons allow users to select a single option from a list of mutually exclusive choices."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Radio Group" description="Standard radio button group.">
          <RadioGroup name="basic" defaultValue="2">
            <FormControlLabel value="1" control={<Radio />} label="Option 1" />
            <FormControlLabel value="2" control={<Radio />} label="Option 2" />
            <FormControlLabel value="3" control={<Radio />} label="Option 3" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Size Variants"
          description="Radio buttons support three sizes: small, medium (default), and large."
        >
          <RadioGroup name="sizes" defaultValue="md">
            <FormControlLabel value="sm" control={<Radio size="small" />} label="Small" />
            <FormControlLabel value="md" control={<Radio size="medium" />} label="Medium (default)" />
            <FormControlLabel value="lg" control={<Radio size="large" />} label="Large" />
          </RadioGroup>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different radio button states.">
          <Stack spacing={1.5}>
            <RadioGroup name="states" defaultValue="2">
              <FormControlLabel value="1" control={<Radio />} label="Unchecked" />
              <FormControlLabel value="2" control={<Radio />} label="Checked" />
            </RadioGroup>
            <FormControlLabel value="3" control={<Radio name="states2" disabled />} label="Disabled" />
            <FormControlLabel
              value="4"
              control={<Radio name="states2" defaultChecked disabled />}
              label="Checked & Disabled"
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Layout" description="Radio buttons arranged horizontally.">
          <RadioGroup name="color" defaultValue="green" row>
            <FormControlLabel value="red" control={<Radio />} label="Red" />
            <FormControlLabel value="green" control={<Radio />} label="Green" />
            <FormControlLabel value="blue" control={<Radio />} label="Blue" />
          </RadioGroup>
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
                    control={<Radio name="warning-unchecked" value="1" />}
                    label="Unchecked with warning"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
                    This action may have unintended consequences
                  </FormHelperText>
                </FormControl>
                <FormControl color="warning" variant="standard">
                  <FormControlLabel
                    control={<Radio name="warning-checked" value="2" defaultChecked />}
                    label="Checked with warning"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
                    Review this selection carefully
                  </FormHelperText>
                </FormControl>
                <FormControl color="warning" variant="standard">
                  <FormControlLabel
                    control={<Radio name="warning-disabled" value="3" disabled />}
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
                    control={<Radio name="error-unchecked" value="1" />}
                    label="Unchecked with error"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
                    This field is required
                  </FormHelperText>
                </FormControl>
                <FormControl error variant="standard">
                  <FormControlLabel
                    control={<Radio name="error-checked" value="2" defaultChecked />}
                    label="Checked with error"
                  />
                  <FormHelperText>
                    <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
                    This selection is invalid
                  </FormHelperText>
                </FormControl>
                <FormControl error variant="standard">
                  <FormControlLabel
                    control={<Radio name="error-disabled" value="3" disabled />}
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
        <PropsTable props={radioProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Labels">
            Use <code>FormControlLabel</code> so each radio is associated with visible text.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Navigable with <kbd>Tab</kbd>, selectable with <kbd>Space</kbd>. Arrow keys move between
            radios that share a <code>RadioGroup</code> / <code>name</code>.
          </A11yCard>
          <A11yCard icon="tag" title="Group Association">
            Prefer MUI <code>RadioGroup name</code> so the name is applied to children automatically.
          </A11yCard>
          <A11yCard icon="check-badge" title="Error States">
            Parent <code>FormControl error</code> plus <code>FormHelperText</code>; face colors
            inherit from FormControl via theme.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
