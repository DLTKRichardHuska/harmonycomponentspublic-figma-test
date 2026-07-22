import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
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

const stepperProps: PropRow[] = [
  { name: 'activeStep', type: 'number', default: '0', description: 'Zero-based index of the active step' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'nonLinear', type: 'boolean', default: 'false', description: 'Allow jumping to any step (use StepButton)' },
  { name: 'alternativeLabel', type: 'boolean', default: 'false', description: 'Place labels under the indicator (horizontal)' },
  { name: 'children', type: 'node', default: '—', description: 'Two or more Step components' },
];

const stepProps: PropRow[] = [
  { name: 'completed', type: 'boolean', default: '—', description: 'Mark the step as completed' },
  { name: 'disabled', type: 'boolean', default: '—', description: 'Disable step interaction' },
  { name: 'error (StepLabel)', type: 'boolean', default: 'false', description: 'Show error state on StepLabel' },
  { name: 'icon (StepLabel)', type: 'node', default: '—', description: 'Custom icon in place of the number' },
  { name: 'optional (StepLabel)', type: 'node', default: '—', description: 'Description below the label' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'activeStep / orientation / nonLinear', type: '—', description: 'Same props on MUI Stepper' },
  { name: 'labels below indicator', type: '—', description: 'Stepper alternativeLabel' },
  { name: 'Step label slot', type: '—', description: 'StepLabel children' },
  { name: 'Step description slot', type: '—', description: 'StepLabel optional' },
  { name: 'Step completed / disabled', type: '—', description: 'Step props' },
  { name: 'Step error', type: '—', description: 'StepLabel error' },
  { name: 'Step icon', type: '—', description: 'StepLabel / StepButton icon + HarmonyIcon' },
  { name: 'Step warning / success', type: '—', description: 'Not supported — see callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const linearSteps = ['Select campaign settings', 'Create an ad group', 'Create an ad', 'Review campaign', 'Launch campaign'];
const jumpSteps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
const sectionSteps = [
  { label: 'Overview', icon: 'home' },
  { label: 'Profile', icon: 'user' },
  { label: 'Settings', icon: 'cog-6-tooth' },
  { label: 'Documents', icon: 'document' },
];

export function SteppersDemo() {
  const [nonLinearActive, setNonLinearActive] = useState(0);
  const [sectionActive, setSectionActive] = useState(1);
  const [disabledActive, setDisabledActive] = useState(1);

  useEffect(() => {
    document.title = demoPageTitle('Stepper');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Stepper"
        description="Steppers display progress through a sequence of logical and numbered steps, providing a wizard-like workflow."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="Step warning / success (distinct statuses)"
          reason="MUI Step exposes only completed and error states; there is no separate warning or success status. Use completed for success and error for failures."
        />

        <DemoExampleGroup
          title="Default linear stepper"
          description="One active step; MUI disables navigation beyond it in linear mode."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={0} alternativeLabel>
              {jumpSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="States: completed, active, error"
          description="Indicator appearances supported by MUI. The order is for demo only and does not represent a real workflow."
        >
          <Box sx={{ width: '100%', maxWidth: 640 }}>
            <Stepper activeStep={2} alternativeLabel>
              <Step completed>
                <StepLabel>Account verified</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review information</StepLabel>
              </Step>
              <Step>
                <StepLabel error>Fix errors</StepLabel>
              </Step>
              <Step>
                <StepLabel>Complete setup</StepLabel>
              </Step>
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Linear stepper with multiple steps"
          description="Completed steps show a check; future steps are disabled until previous steps complete."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={2} alternativeLabel>
              {linearSteps.map((label, index) => (
                <Step key={label} completed={index < 2}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Non-linear stepper"
          description="Set nonLinear and use StepButton so every step is clickable. Click a step to make it active."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={nonLinearActive} nonLinear alternativeLabel>
              {jumpSteps.map((label, index) => (
                <Step key={label}>
                  <StepButton onClick={() => setNonLinearActive(index)}>{label}</StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Non-linear stepper with icons (sections)"
          description="Use StepButton icon to show icons instead of numbers — good for sections to jump between."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={sectionActive} nonLinear alternativeLabel>
              {sectionSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepButton
                    onClick={() => setSectionActive(index)}
                    icon={<HarmonyIcon name={step.icon} fontSize="inherit" />}
                  >
                    {step.label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Stepper with descriptions"
          description="Steps can include a description below the label via StepLabel optional."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={1} alternativeLabel>
              <Step completed>
                <StepLabel optional={<Typography variant="caption">Verify your email and password</Typography>}>
                  Account Setup
                </StepLabel>
              </Step>
              <Step>
                <StepLabel optional={<Typography variant="caption">Add your personal details</Typography>}>
                  Profile Information
                </StepLabel>
              </Step>
              <Step>
                <StepLabel optional={<Typography variant="caption">Configure your settings</Typography>}>
                  Preferences
                </StepLabel>
              </Step>
              <Step>
                <StepLabel optional={<Typography variant="caption">Finalize your account</Typography>}>
                  Review &amp; Complete
                </StepLabel>
              </Step>
            </Stepper>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Stepper with disabled steps"
          description="Disable a step with the Step disabled prop. In non-linear mode other steps stay clickable."
        >
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Stepper activeStep={disabledActive} nonLinear alternativeLabel>
              <Step completed>
                <StepButton onClick={() => setDisabledActive(0)}>Account Setup</StepButton>
              </Step>
              <Step>
                <StepButton onClick={() => setDisabledActive(1)}>Profile Information</StepButton>
              </Step>
              <Step disabled>
                <StepLabel optional={<Typography variant="caption">Temporarily unavailable</Typography>}>
                  Payment Method
                </StepLabel>
              </Step>
              <Step>
                <StepButton onClick={() => setDisabledActive(3)}>Summary</StepButton>
              </Step>
            </Stepper>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={stepperProps} />
        <Box sx={{ mt: 3 }}>
          <PropsTable props={stepProps} />
        </Box>
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Structure" icon="tag">
          The <code>Stepper</code> groups <code>Step</code> children; the active step is announced via{' '}
          <code>StepLabel</code> state. Non-linear steppers use <code>StepButton</code> for real button semantics.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          In non-linear mode, <kbd>Tab</kbd> moves between step buttons and <kbd>Enter</kbd>/<kbd>Space</kbd> activate
          them.
        </A11yCard>
        <A11yCard title="States" icon="check-circle">
          Completed, active, error, and disabled states are conveyed through MUI Step / StepLabel styling and are not
          color-only.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
