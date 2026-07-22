import { useEffect, useState } from 'react';
import {
  Stepper,
  Step,
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

const stepperPropRows: PropRow[] = [
  { name: 'activeStep', type: 'number', default: '0', description: 'Zero-based index of the active step' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
  { name: 'nonLinear', type: 'boolean', default: 'false', description: 'Allow jumping to any step (all steps clickable)' },
  { name: 'onStepClick', type: '(index: number) => void', default: '—', description: 'Fires with the step index in non-linear mode (replaces the Astro stepper:step-clicked event)' },
  { name: 'children', type: 'Step[]', default: '—', description: 'Step components (no items[] API)' },
];

const stepPropRows: PropRow[] = [
  { name: 'completed', type: 'boolean', default: 'false', description: 'Mark step as completed' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable step interaction' },
  { name: 'error / warning / success', type: 'boolean', default: 'false', description: 'Semantic state indicator (priority: error > warning > success > completed)' },
  { name: 'icon', type: 'string', default: '—', description: 'Harmony Icon name; replaces the number' },
  { name: 'description', type: 'ReactNode', default: '—', description: 'Text below the label (replaces the Astro description slot)' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Step label' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function SteppersDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Stepper');
  }, []);

  const [linearVsActive, setLinearVsActive] = useState(0);
  const [sectionActive, setSectionActive] = useState(1);
  const [disabledActive, setDisabledActive] = useState(1);

  return (
    <article>
      <DemoPageHeader
        title="Stepper"
        description="Steppers display progress through a sequence of logical and numbered steps. Labels sit below the indicators; steps support success, warning, and error states."
      />

      <ImportSnippet
        code={`import {
  Stepper,
  Step,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Stepper activeStep={1}>
  <Step completed success>Account</Step>
  <Step>Profile</Step>
  <Step>Review</Step>
</Stepper>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Default linear stepper"
          description="One active step (no completed or success props). The component disables all steps after the active step—only the current step is interactive."
        >
          <div className="w-full max-w-6xl">
            <Stepper activeStep={0}>
              <Step>Step 1</Step>
              <Step>Step 2</Step>
              <Step>Step 3</Step>
              <Step>Step 4</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Stepper with Alternative Label"
          description="Labels are positioned below the step indicators. This example illustrates the four possible indicator appearances only (success, warning, error, default)."
        >
          <div className="w-full max-w-4xl">
            <Stepper activeStep={2}>
              <Step success>Account verified</Step>
              <Step warning>Review information</Step>
              <Step error>Fix errors</Step>
              <Step>Complete setup</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Linear Stepper with Multiple Steps"
          description="Complete linear workflow showing proper step progression. Future steps are disabled until previous steps are completed."
        >
          <div className="w-full max-w-6xl">
            <Stepper activeStep={2}>
              <Step completed success>Select campaign settings</Step>
              <Step completed success>Create an ad group</Step>
              <Step>Create an ad</Step>
              <Step>Review campaign</Step>
              <Step>Launch campaign</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Linear vs Non-linear Stepper"
          description="Linear (default): one active step, all later steps disabled by the component. Non-linear: every step is clickable—wire onStepClick to change the active step."
        >
          <div className="w-full max-w-6xl space-y-6">
            <div className="rounded border border-[var(--border-color)] bg-[var(--elevated-bg)] p-4 text-sm text-secondary">
              <p className="mb-2 font-semibold text-foreground">How linear vs non-linear works</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Linear (default)</strong> — only one step is active; the component
                  disables every step after <code>activeStep</code>.
                </li>
                <li>
                  <strong>Non-linear</strong> — set <code>nonLinear</code>; every step stays
                  focusable and clickable and fires <code>onStepClick</code>.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Linear (default)</h4>
              <Stepper activeStep={0}>
                <Step>Step 1</Step>
                <Step>Step 2</Step>
                <Step>Step 3</Step>
                <Step>Step 4</Step>
              </Stepper>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Non-linear</h4>
              <Stepper activeStep={linearVsActive} nonLinear onStepClick={setLinearVsActive}>
                <Step>Step 1</Step>
                <Step>Step 2</Step>
                <Step>Step 3</Step>
                <Step>Step 4</Step>
              </Stepper>
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Non-linear stepper with icons (sections)"
          description="Use the Step icon prop to show icons instead of numbers—good for settings, account areas, or any non-linear navigation."
        >
          <div className="w-full max-w-6xl">
            <Stepper activeStep={sectionActive} nonLinear onStepClick={setSectionActive}>
              <Step icon="home">Overview</Step>
              <Step icon="user">Profile</Step>
              <Step icon="cog-6-tooth">Settings</Step>
              <Step icon="document">Documents</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Stepper with Descriptions"
          description="Steps can include descriptions below the label. Labels use Lexend (display font); descriptions use Figtree (body font)."
        >
          <div className="w-full max-w-6xl">
            <Stepper activeStep={1}>
              <Step completed success description="Verify your email and password">
                Account Setup
              </Step>
              <Step description="Add your personal details">Profile Information</Step>
              <Step description="Configure your settings">Preferences</Step>
              <Step description="Finalize your account">Review &amp; Complete</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Stepper with Disabled Steps"
          description="Steps can be explicitly disabled. In non-linear mode, one step is disabled (greyed out, not clickable) while the user can still jump to other steps."
        >
          <div className="w-full max-w-6xl">
            <Stepper activeStep={disabledActive} nonLinear onStepClick={setDisabledActive}>
              <Step completed success>Account Setup</Step>
              <Step>Profile Information</Step>
              <Step disabled description="Temporarily unavailable">
                Payment Method
              </Step>
              <Step>Summary</Step>
            </Stepper>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <h3 className="mb-3 text-base font-semibold text-foreground">Stepper</h3>
        <PropsTable props={stepperPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold text-foreground">Step</h3>
        <PropsTable props={stepPropRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          In non-linear mode, steps are keyboard accessible. Use <kbd>Tab</kbd> to move between
          steps and <kbd>Enter</kbd> or <kbd>Space</kbd> to activate a step.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          The stepper uses <code>role=&quot;group&quot;</code>, <code>aria-current=&quot;step&quot;</code>{' '}
          on the active step, and <code>aria-hidden</code> on decorative indicators and connectors.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce the step number, label, and current state (active, completed,
          error, warning).
        </A11yCard>
        <A11yCard title="Visual Indicators" icon="swatch">
          State is conveyed by icons and text as well as color, so color is not the only indicator.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
