import { useEffect } from 'react';
import { ProgressBar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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
  { name: 'value', type: 'number', default: '—', description: 'Current progress value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Progress bar height',
  },
  {
    name: 'variant',
    type: "'default' | 'success' | 'warning' | 'error'",
    default: "'default'",
    description: 'Color variant',
  },
  {
    name: 'showLabel',
    type: 'boolean',
    default: 'false',
    description: 'Show percentage label below the bar',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra Tailwind / CSS classes on the root',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function ProgressBarDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Progress Bar');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Progress Bar"
        description="Progress bars indicate the completion status of a task or process."
      />

      <ImportSnippet
        code={`import { ProgressBar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ProgressBar value={50} />
<ProgressBar value={75} size="lg" variant="success" />
<ProgressBar value={42} showLabel />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic" description="Standard progress bars at common completion levels.">
          <div className="flex max-w-md flex-col gap-3">
            <ProgressBar value={25} />
            <ProgressBar value={50} />
            <ProgressBar value={75} />
            <ProgressBar value={100} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Small, medium, and large track heights.">
          <div className="flex max-w-md flex-col gap-4">
            <ProgressBar value={60} size="sm" />
            <ProgressBar value={60} size="md" />
            <ProgressBar value={60} size="lg" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Variants" description="Default, success, warning, and error colors.">
          <div className="flex max-w-md flex-col gap-3">
            <ProgressBar value={75} variant="default" />
            <ProgressBar value={75} variant="success" />
            <ProgressBar value={75} variant="warning" />
            <ProgressBar value={75} variant="error" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Label" description="Optional percentage label below the bar.">
          <div className="max-w-md">
            <ProgressBar value={42} showLabel />
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Forwards <code>ref</code> and other safe <code>HTMLAttributes</code> on the root{' '}
          <code>div</code>. Built on Radix Progress.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="ARIA Attributes">
            Progress uses <code>role=&quot;progressbar&quot;</code> with{' '}
            <code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code>.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Assistive tech announces the current value. When <code>showLabel</code> is set, the
            percentage is also visible to all users.
          </A11yCard>
          <A11yCard icon="tag" title="Labels">
            Provide an <code>aria-label</code> (or associated text) describing what is progressing
            (e.g. &quot;Upload progress&quot;).
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
