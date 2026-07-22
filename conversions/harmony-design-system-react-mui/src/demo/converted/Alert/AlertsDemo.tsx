import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoExamplesStack,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

const severityIcons = {
  info: 'information-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
} as const;

const alertProps: PropRow[] = [
  {
    name: 'severity',
    type: "'error' | 'info' | 'success' | 'warning'",
    default: "'success'",
    description: 'Alert type and color — maps Harmony variant',
  },
  {
    name: 'variant',
    type: "'standard' | 'outlined' | 'filled'",
    default: "'standard'",
    description: 'standard = Harmony default style; outlined = Harmony enhanced style',
  },
  {
    name: 'onClose',
    type: '() => void',
    default: '—',
    description: 'When set, shows dismiss button — maps Harmony dismissible',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    default: 'severity default',
    description: 'Custom icon — use HarmonyIcon with Harmony icon names',
  },
  {
    name: 'action',
    type: 'ReactNode',
    default: '—',
    description: 'Trailing actions — compose Button, Link, etc. for enhanced alerts',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'variant info/success/warning/error', type: '—', description: 'severity="info" | "success" | "warning" | "error"' },
  { name: "style='default'", type: '—', description: 'variant="standard"' },
  { name: "style='enhanced'", type: '—', description: 'variant="outlined"' },
  { name: 'title', type: '—', description: '<AlertTitle> child' },
  { name: 'message (slot)', type: '—', description: 'Alert children' },
  { name: 'dismissible', type: '—', description: 'onClose handler' },
  {
    name: 'primaryButton / secondaryButton',
    type: '—',
    description: 'Compose as Alert children with <Button size="small"> in a <Stack direction="row">',
  },
  {
    name: 'linkText + linkHref',
    type: '—',
    description: 'Compose as Alert children with <Link href="…"> in the action Stack',
  },
  {
    name: 'progressValue',
    type: '—',
    description: 'Compose <LinearProgress color={severity}> below message — see Enhanced with Progress',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function AlertsDemo() {
  const [dismissibleInfoOpen, setDismissibleInfoOpen] = useState(true);
  const [enhancedSuccessOpen, setEnhancedSuccessOpen] = useState(true);
  const [enhancedWarningOpen, setEnhancedWarningOpen] = useState(true);
  const [actionsSuccessOpen, setActionsSuccessOpen] = useState(true);
  const [actionsInfoOpen, setActionsInfoOpen] = useState(true);
  const [progressSuccessOpen, setProgressSuccessOpen] = useState(true);
  const [progressWarningOpen, setProgressWarningOpen] = useState(true);

  useEffect(() => {
    document.title = demoPageTitle('Alerts');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Alerts"
        description="Alerts display important messages that require user attention. Use @mui/material/Alert with severity and variant — standard maps Harmony default, outlined maps Harmony enhanced."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExamplesStack>
          <DemoExampleGroup title="Variants" description="Different alert styles for various contexts.">
            <Stack spacing={2}>
              <Alert
                severity="info"
                variant="standard"
                icon={<HarmonyIcon name={severityIcons.info} fontSize="inherit" />}
              >
                <AlertTitle>Information</AlertTitle>
                This is an informational message for the user.
              </Alert>
              <Alert
                severity="success"
                variant="standard"
                icon={<HarmonyIcon name={severityIcons.success} fontSize="inherit" />}
              >
                <AlertTitle>Success</AlertTitle>
                Your changes have been saved successfully.
              </Alert>
              <Alert
                severity="warning"
                variant="standard"
                icon={<HarmonyIcon name={severityIcons.warning} fontSize="inherit" />}
              >
                <AlertTitle>Warning</AlertTitle>
                Please review the changes before proceeding.
              </Alert>
              <Alert
                severity="error"
                variant="standard"
                icon={<HarmonyIcon name={severityIcons.error} fontSize="inherit" />}
              >
                <AlertTitle>Error</AlertTitle>
                Something went wrong. Please try again.
              </Alert>
            </Stack>
          </DemoExampleGroup>

          <DemoExampleGroup title="Dismissible" description="Alerts that can be closed by the user.">
            {dismissibleInfoOpen && (
              <Alert
                severity="info"
                variant="standard"
                onClose={() => setDismissibleInfoOpen(false)}
                icon={<HarmonyIcon name={severityIcons.info} fontSize="inherit" />}
                slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
              >
                <AlertTitle>Dismissible Alert</AlertTitle>
                Click the X button to dismiss this alert.
              </Alert>
            )}
          </DemoExampleGroup>

          <DemoExampleGroup title="Without Title" description="Simpler alerts without a title.">
            <Stack spacing={2}>
              <Alert severity="info" variant="standard" icon={<HarmonyIcon name={severityIcons.info} fontSize="inherit" />}>
                A simple informational message.
              </Alert>
              <Alert severity="success" variant="standard" icon={<HarmonyIcon name={severityIcons.success} fontSize="inherit" />}>
                Operation completed successfully.
              </Alert>
            </Stack>
          </DemoExampleGroup>

          <DemoExampleGroup
            title="Enhanced Variant"
            description={
              <>
                Enhanced alerts with left border accent, shadow, and card background — use{' '}
                <code>variant=&quot;outlined&quot;</code>.
              </>
            }
          >
            <Stack spacing={2}>
              {enhancedSuccessOpen && (
                <Alert
                  severity="success"
                  variant="outlined"
                  onClose={() => setEnhancedSuccessOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.success} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Alert Title</AlertTitle>
                  Alert Description
                </Alert>
              )}
              {enhancedWarningOpen && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  onClose={() => setEnhancedWarningOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.warning} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Warning Alert</AlertTitle>
                  This is a warning message with enhanced styling.
                </Alert>
              )}
            </Stack>
          </DemoExampleGroup>

          <DemoExampleGroup
            title="Enhanced with Actions"
            description="Compose action buttons and links as Alert children."
          >
            <Stack spacing={2}>
              {actionsSuccessOpen && (
                <Alert
                  severity="success"
                  variant="outlined"
                  onClose={() => setActionsSuccessOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.success} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Success Alert</AlertTitle>
                  <Typography component="div" variant="body2">
                    This alert includes primary and secondary buttons, plus a link.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary" size="small">
                      Button Text
                    </Button>
                    <Button variant="outlined" color="primary" size="small">
                      Button Text
                    </Button>
                    <Link href="#">Link Text</Link>
                  </Stack>
                </Alert>
              )}
              {actionsInfoOpen && (
                <Alert
                  severity="info"
                  variant="outlined"
                  onClose={() => setActionsInfoOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.info} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Information Alert</AlertTitle>
                  <Typography component="div" variant="body2">
                    This alert includes only a link action.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Link href="#">Learn more</Link>
                  </Stack>
                </Alert>
              )}
            </Stack>
          </DemoExampleGroup>

          <DemoExampleGroup
            title="Enhanced with Progress"
            description={
              <>
                Enhanced alerts with progress bar for countdown or status — compose{' '}
                <code>&lt;LinearProgress&gt;</code> as an Alert child (Harmony <code>progressValue</code> has no MUI
                prop equivalent).
              </>
            }
          >
            <Stack spacing={2}>
              {progressSuccessOpen && (
                <Alert
                  severity="success"
                  variant="outlined"
                  onClose={() => setProgressSuccessOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.success} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Progress Alert</AlertTitle>
                  This alert shows a progress bar indicating 75% completion.
                  <Box sx={{ pt: 1 }}>
                    <LinearProgress variant="determinate" value={75} color="success" />
                  </Box>
                </Alert>
              )}
              {progressWarningOpen && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  onClose={() => setProgressWarningOpen(false)}
                  icon={<HarmonyIcon name={severityIcons.warning} fontSize="inherit" />}
                  slotProps={{ closeButton: { 'aria-label': 'Dismiss' } }}
                >
                  <AlertTitle>Countdown Alert</AlertTitle>
                  This alert shows a progress bar at 45%.
                  <Box sx={{ pt: 1 }}>
                    <LinearProgress variant="determinate" value={45} color="warning" />
                  </Box>
                </Alert>
              )}
            </Stack>
          </DemoExampleGroup>
        </DemoExamplesStack>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={alertProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard icon="exclamation-circle" title="Role">
          MUI Alert renders with <code>role=&quot;alert&quot;</code> to announce important messages to screen
          readers.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
