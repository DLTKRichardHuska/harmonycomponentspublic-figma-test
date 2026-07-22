import { useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
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

const groupProps: PropRow[] = [
  {
    name: 'name',
    type: 'string',
    default: '—',
    description: 'RadioGroup name (required) — MUI propagates to children',
  },
  { name: 'legend', type: 'string', default: '—', description: 'FormLabel / legend' },
  { name: 'error', type: 'boolean', default: 'false', description: 'FormControl error' },
  { name: 'warning', type: 'boolean', default: 'false', description: 'FormControl color="warning"' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'FormHelperText' },
  { name: 'warningMessage', type: 'string', default: '—', description: 'FormHelperText' },
  {
    name: 'orientation',
    type: "'vertical' | 'horizontal'",
    default: "'vertical'",
    description: 'RadioGroup row for horizontal',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'name', type: '—', description: 'RadioGroup name (auto-propagates; unlike Harmony manual pass-through)' },
  { name: 'legend', type: '—', description: 'FormLabel component="legend"' },
  { name: 'orientation horizontal', type: '—', description: 'RadioGroup row' },
  { name: 'error / warning', type: '—', description: 'FormControl error / color="warning"' },
  { name: 'errorMessage / warningMessage', type: '—', description: 'FormHelperText + HarmonyIcon' },
  { name: 'children', type: '—', description: 'FormControlLabel + Radio inside RadioGroup' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function RadioGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Radio Groups');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Radio Groups"
        description="Radio groups allow users to select a single option from a set of mutually exclusive choices."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Group" description="Standard radio group.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Shipping Method</FormLabel>
            <RadioGroup name="shipping" defaultValue="standard">
              <FormControlLabel value="standard" control={<Radio />} label="Standard (5-7 days)" />
              <FormControlLabel value="express" control={<Radio />} label="Express (2-3 days)" />
              <FormControlLabel value="overnight" control={<Radio />} label="Overnight (Next day)" />
            </RadioGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Group" description="Radio buttons arranged horizontally.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Select Plan</FormLabel>
            <RadioGroup name="plan" defaultValue="pro" row>
              <FormControlLabel value="free" control={<Radio />} label="Free" />
              <FormControlLabel value="pro" control={<Radio />} label="Pro" />
              <FormControlLabel value="enterprise" control={<Radio />} label="Enterprise" />
            </RadioGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Using RadioGroup"
          description="MUI RadioGroup provides shared name propagation and layout."
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Shipping Method</FormLabel>
            <RadioGroup name="shipping-group" defaultValue="standard">
              <FormControlLabel value="standard" control={<Radio />} label="Standard (5-7 days)" />
              <FormControlLabel value="express" control={<Radio />} label="Express (2-3 days)" />
              <FormControlLabel value="overnight" control={<Radio />} label="Overnight (Next day)" />
            </RadioGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup title="Horizontal Layout" description="RadioGroup with row orientation.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Select Plan</FormLabel>
            <RadioGroup name="plan-group" defaultValue="pro" row>
              <FormControlLabel value="free" control={<Radio />} label="Free" />
              <FormControlLabel value="pro" control={<Radio />} label="Pro" />
              <FormControlLabel value="enterprise" control={<Radio />} label="Enterprise" />
            </RadioGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Error State"
          description="FormControl error applies styling to child radios and shows a message."
        >
          <FormControl component="fieldset" error variant="standard">
            <FormLabel component="legend">Shipping Method *</FormLabel>
            <RadioGroup name="shipping-error">
              <FormControlLabel value="standard" control={<Radio />} label="Standard (5-7 days)" />
              <FormControlLabel value="express" control={<Radio />} label="Express (2-3 days)" />
              <FormControlLabel value="overnight" control={<Radio />} label="Overnight (Next day)" />
            </RadioGroup>
            <FormHelperText>
              <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
              Please select a shipping method
            </FormHelperText>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Warning State"
          description="FormControl color=&quot;warning&quot; applies warning styling to the group."
        >
          <FormControl component="fieldset" color="warning" variant="standard">
            <FormLabel component="legend">Shipping Method</FormLabel>
            <RadioGroup name="shipping-warning" defaultValue="standard">
              <FormControlLabel value="standard" control={<Radio />} label="Standard (5-7 days)" />
              <FormControlLabel value="express" control={<Radio />} label="Express (2-3 days)" />
              <FormControlLabel value="overnight" control={<Radio />} label="Overnight (Next day)" />
            </RadioGroup>
            <FormHelperText>
              <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
              Express shipping may have additional fees
            </FormHelperText>
          </FormControl>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={groupProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Fieldset and Legend">
            Use <code>FormControl component=&quot;fieldset&quot;</code> with{' '}
            <code>FormLabel component=&quot;legend&quot;</code> for semantic grouping.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Arrow keys move selection within a <code>RadioGroup</code>; <kbd>Tab</kbd> moves focus
            into and out of the group.
          </A11yCard>
          <A11yCard icon="tag" title="Group Association">
            All radios in a group share the same <code>RadioGroup name</code>. MUI propagates the
            name to children so only one option can be selected at a time.
          </A11yCard>
          <A11yCard icon="check-badge" title="Error and Warning States">
            Parent <code>FormControl</code> owns validation; <code>FormHelperText</code> announces
            the message. Face colors inherit from FormControl via theme.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
