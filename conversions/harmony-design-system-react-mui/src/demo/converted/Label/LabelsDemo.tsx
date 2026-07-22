import { useEffect } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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

const labelProps: PropRow[] = [
  { name: 'htmlFor', type: 'string', default: '—', description: 'Associated input id (Harmony for)' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Shows required asterisk' },
  {
    name: 'children + helper',
    type: 'ReactNode',
    default: '—',
    description: 'Label text; helper as Typography caption beside the label',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'for', type: '—', description: 'FormLabel htmlFor' },
  { name: 'required', type: '—', description: 'FormLabel required' },
  {
    name: 'helper',
    type: '—',
    description: 'Typography component="span" variant="caption" color="textSecondary" after label text',
  },
  { name: 'default slot', type: '—', description: 'FormLabel children' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function LabelsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Labels');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Labels"
        description="Labels identify form inputs and provide context for users."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Label" description="Standard label for inputs.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <TextField id="name" placeholder="Enter your name" fullWidth />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Required Label" description="Label with required indicator.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="email" required>
              Email Address
            </FormLabel>
            <TextField id="email" type="email" placeholder="you@example.com" required fullWidth />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Helper Text" description="Label with additional context.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="phone">
              Phone Number{' '}
              <Typography component="span" variant="caption" color="textSecondary">
                (optional)
              </Typography>
            </FormLabel>
            <TextField id="phone" type="tel" placeholder="(555) 555-5555" fullWidth />
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={labelProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard icon="tag" title="Label Association">
          Always set <code>htmlFor</code> on <code>FormLabel</code> (Harmony <code>for</code>) to match the
          control <code>id</code>.
        </A11yCard>
        <A11yCard icon="exclamation-circle" title="Required Indicators">
          When using <code>required</code> on the label, also set <code>required</code> on the associated
          input for validation and screen reader announcements.
        </A11yCard>
        <A11yCard icon="eye" title="Screen Reader Support">
          Screen readers announce label text when associated inputs receive focus. Include helper text in the
          label content so it is announced with the control.
        </A11yCard>
        <A11yCard icon="tag" title="Semantic HTML">
          Labels use semantic <code>&lt;label&gt;</code> elements (via <code>FormLabel</code>), which provide the
          proper relationship with form controls and enable clicking the label to focus the associated input.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
