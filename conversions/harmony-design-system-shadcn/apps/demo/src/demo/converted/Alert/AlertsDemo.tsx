import { useEffect, useState } from 'react';
import { Alert } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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

const propRows: PropRow[] = [
  {
    name: 'variant',
    type: "'info' | 'success' | 'warning' | 'error'",
    default: "'info'",
    description: 'Severity and color',
  },
  {
    name: 'appearance',
    type: "'default' | 'enhanced'",
    default: "'default'",
    description: 'Layout — enhanced unlocks accent, actions, link, progress',
  },
  {
    name: 'title',
    type: 'string',
    default: '—',
    description: 'Title text (convenience API)',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    default: 'false',
    description: 'Show dismiss control',
  },
  {
    name: 'onDismiss',
    type: '() => void',
    default: '—',
    description: 'Called when dismiss is activated (controlled — does not unmount)',
  },
  {
    name: 'icon',
    type: 'string',
    default: 'severity default',
    description: 'Override default severity icon (Harmony Icon name)',
  },
  {
    name: 'primaryAction',
    type: 'AlertActionConfig',
    default: '—',
    description: 'Primary action button (enhanced)',
  },
  {
    name: 'secondaryAction',
    type: 'AlertActionConfig',
    default: '—',
    description: 'Secondary action button (enhanced)',
  },
  {
    name: 'linkText',
    type: 'string',
    default: '—',
    description: 'Inline link text (enhanced)',
  },
  {
    name: 'linkHref',
    type: 'string',
    default: '—',
    description: 'Inline link href (enhanced)',
  },
  {
    name: 'progressValue',
    type: 'number',
    default: '—',
    description: 'Progress 0–100 — composes ProgressBar (enhanced)',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Message body',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function AlertsDemo() {
  const [dismissibleOpen, setDismissibleOpen] = useState(true);
  const [enhancedOpen, setEnhancedOpen] = useState(true);

  useEffect(() => {
    document.title = demoPageTitle('Alerts');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Alerts"
        description="Alerts display important messages that require user attention."
      />

      <ImportSnippet
        code={`import { Alert } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Alert variant="info" title="Information">
  This is an informational message.
</Alert>
<Alert
  appearance="enhanced"
  variant="success"
  title="Done"
  primaryAction={{ label: 'View', onClick: () => {} }}
  progressValue={60}
>
  Upload complete.
</Alert>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Variants" description="Default appearance for each severity.">
          <div className="flex max-w-2xl flex-col gap-3">
            <Alert variant="info" title="Information">
              This is an informational message for the user.
            </Alert>
            <Alert variant="success" title="Success">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review the changes before proceeding.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Dismissible" description="Controlled hide via onDismiss + useState.">
          <div className="max-w-2xl space-y-3">
            {dismissibleOpen ? (
              <Alert
                variant="info"
                title="Dismissible alert"
                dismissible
                onDismiss={() => setDismissibleOpen(false)}
              >
                Click the X button to dismiss this alert.
              </Alert>
            ) : (
              <button
                type="button"
                className="text-sm font-medium text-[var(--theme-primary)] underline-offset-2 hover:underline"
                onClick={() => setDismissibleOpen(true)}
              >
                Show dismissible alert again
              </button>
            )}
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Enhanced"
          description="Accent border, actions, link, and composed ProgressBar via progressValue."
        >
          <div className="flex max-w-2xl flex-col gap-3">
            {enhancedOpen ? (
              <Alert
                appearance="enhanced"
                variant="success"
                title="Upload complete"
                dismissible
                onDismiss={() => setEnhancedOpen(false)}
                primaryAction={{
                  label: 'View file',
                  onClick: () => {
                    console.log('View file');
                  },
                }}
                secondaryAction={{
                  label: 'Dismiss',
                  onClick: () => setEnhancedOpen(false),
                }}
                linkText="Learn more"
                linkHref="#props"
                progressValue={100}
              >
                Your file finished uploading. ProgressBar is composed inside Alert.
              </Alert>
            ) : (
              <button
                type="button"
                className="text-sm font-medium text-[var(--theme-primary)] underline-offset-2 hover:underline"
                onClick={() => setEnhancedOpen(true)}
              >
                Show enhanced alert again
              </button>
            )}
            <Alert
              appearance="enhanced"
              variant="warning"
              title="Sync in progress"
              progressValue={45}
              primaryAction={{ label: 'Cancel', onClick: () => {} }}
              linkText="Details"
              linkHref="#accessibility"
            >
              Changes are still syncing to the server.
            </Alert>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Compound exports <code>AlertTitle</code>, <code>AlertDescription</code>, and{' '}
          <code>AlertAction</code> are available for custom layouts. Root has{' '}
          <code>role=&quot;alert&quot;</code>.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="Live region">
            Alerts use <code>role=&quot;alert&quot;</code> so assistive tech announces new messages
            without requiring focus.
          </A11yCard>
          <A11yCard icon="eye" title="Dismiss">
            Dismiss is controlled — call <code>onDismiss</code> and unmount (or hide) the alert in
            your state. The control has <code>aria-label=&quot;Dismiss&quot;</code>.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Actions">
            Prefer clear action labels. Link text should describe the destination, not
            &quot;click here&quot;.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
