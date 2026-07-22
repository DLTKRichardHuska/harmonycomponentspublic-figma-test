import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
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
  { name: 'legend', type: 'string', default: '—', description: 'FormLabel / legend text' },
  { name: 'error', type: 'boolean', default: 'false', description: 'FormControl error' },
  { name: 'warning', type: 'boolean', default: 'false', description: 'FormControl color="warning"' },
  { name: 'errorMessage', type: 'string', default: '—', description: 'FormHelperText' },
  { name: 'warningMessage', type: 'string', default: '—', description: 'FormHelperText' },
  {
    name: 'orientation',
    type: "'vertical' | 'horizontal'",
    default: "'vertical'",
    description: 'FormGroup row for horizontal',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'legend', type: '—', description: 'FormLabel component="legend" in FormControl fieldset' },
  { name: 'orientation horizontal', type: '—', description: 'FormGroup row' },
  { name: 'error / warning', type: '—', description: 'FormControl error / color="warning"' },
  { name: 'errorMessage / warningMessage', type: '—', description: 'FormHelperText + HarmonyIcon' },
  { name: 'children', type: '—', description: 'FormControlLabel + Checkbox inside FormGroup' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function CheckboxGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Checkbox Groups');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Checkbox Groups"
        description="Checkbox groups allow users to select multiple options from a related set."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Group" description="Simple checkbox group with fieldset.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Notification Preferences</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name="notif-email" defaultChecked />}
                label="Email notifications"
              />
              <FormControlLabel control={<Checkbox name="notif-sms" />} label="SMS notifications" />
              <FormControlLabel
                control={<Checkbox name="notif-push" defaultChecked />}
                label="Push notifications"
              />
              <FormControlLabel control={<Checkbox name="notif-marketing" />} label="Marketing emails" />
            </FormGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup title="Inline Group" description="Checkboxes arranged horizontally.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Select Categories</FormLabel>
            <FormGroup row>
              <FormControlLabel control={<Checkbox name="cat-news" defaultChecked />} label="News" />
              <FormControlLabel control={<Checkbox name="cat-sports" />} label="Sports" />
              <FormControlLabel control={<Checkbox name="cat-tech" defaultChecked />} label="Technology" />
              <FormControlLabel control={<Checkbox name="cat-ent" />} label="Entertainment" />
            </FormGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Using FormControl + FormGroup"
          description="Fieldset FormControl provides legend and shared validation state for the group."
        >
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Notification Preferences</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name="notif-email-group" defaultChecked />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-sms-group" />}
                label="SMS notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-push-group" defaultChecked />}
                label="Push notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-marketing-group" />}
                label="Marketing emails"
              />
            </FormGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup title="Horizontal Layout" description="FormGroup with row orientation.">
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Select Categories</FormLabel>
            <FormGroup row>
              <FormControlLabel control={<Checkbox name="cat-news-group" defaultChecked />} label="News" />
              <FormControlLabel control={<Checkbox name="cat-sports-group" />} label="Sports" />
              <FormControlLabel
                control={<Checkbox name="cat-tech-group" defaultChecked />}
                label="Technology"
              />
              <FormControlLabel control={<Checkbox name="cat-ent-group" />} label="Entertainment" />
            </FormGroup>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Error State"
          description="FormControl error applies styling to child checkboxes and shows a message."
        >
          <FormControl component="fieldset" error variant="standard">
            <FormLabel component="legend">Notification Preferences *</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name="notif-error-email" />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-error-sms" />}
                label="SMS notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-error-push" />}
                label="Push notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-error-marketing" />}
                label="Marketing emails"
              />
            </FormGroup>
            <FormHelperText>
              <HarmonyIcon name="exclamation-circle" fontSize="inherit" />
              Please select at least one notification method
            </FormHelperText>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Warning State"
          description="FormControl color=&quot;warning&quot; applies warning styling to the group."
        >
          <FormControl component="fieldset" color="warning" variant="standard">
            <FormLabel component="legend">Notification Preferences</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox name="notif-warning-email" defaultChecked />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-warning-sms" />}
                label="SMS notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-warning-push" defaultChecked />}
                label="Push notifications"
              />
              <FormControlLabel
                control={<Checkbox name="notif-warning-marketing" />}
                label="Marketing emails"
              />
            </FormGroup>
            <FormHelperText>
              <HarmonyIcon name="exclamation-triangle" fontSize="inherit" />
              Marketing emails may contain promotional content
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
            <code>FormLabel component=&quot;legend&quot;</code> to group related checkboxes for assistive
            technology.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Use <kbd>Tab</kbd> between checkboxes and <kbd>Space</kbd> to toggle selection.
          </A11yCard>
          <A11yCard icon="check-badge" title="Error and Warning States">
            Parent <code>FormControl</code> owns validation. Messages via <code>FormHelperText</code>{' '}
            are announced with the group; face colors inherit from FormControl via theme.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Screen readers announce the group legend, individual checkbox labels, and their checked
            state. Error and warning messages are clearly communicated when present.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
