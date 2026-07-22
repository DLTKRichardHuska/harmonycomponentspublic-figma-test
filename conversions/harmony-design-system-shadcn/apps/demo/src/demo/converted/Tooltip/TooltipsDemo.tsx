import { useEffect } from 'react';
import {
  Button,
  Icon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { UnsupportedEquivalentCallout } from '../../UnsupportedEquivalentCallout';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const propRows: PropRow[] = [
  { name: 'TooltipProvider', type: '—', default: '—', description: 'Wrap app or page (Radix delayDuration, etc.)' },
  { name: 'Tooltip / Trigger / Content', type: '—', default: '—', description: 'shadcn compound API' },
  { name: 'TooltipContent.text', type: 'string', default: '—', description: 'Convenience body (children win)' },
  { name: 'TooltipContent.position', type: "'top'|'bottom'|'left'|'right'", default: "'top'", description: 'Maps to Radix side' },
  { name: 'cornerVariant', type: '—', default: '—', description: 'Skipped — no Radix equivalent' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function TooltipsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Tooltips');
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <article>
        <DemoPageHeader
          title="Tooltips"
          description="Tooltips display brief helper text on hover or focus."
        />

        <ImportSnippet
          code={`import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="secondary">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent text="Helpful tip" position="top" />
  </Tooltip>
</TooltipProvider>`}
        />

        <DemoArticleNav links={[...articleNav]} />

        <DemoSection id="examples" title="Examples">
          <DemoExampleGroup title="On Button" description="Default top position.">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent text="Helpful tip" />
            </Tooltip>
          </DemoExampleGroup>

          <DemoExampleGroup title="Positions" description="top, bottom, left, and right.">
            <div className="flex flex-wrap items-center gap-4">
              {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                <Tooltip key={pos}>
                  <TooltipTrigger asChild>
                    <Button variant="outline">{pos}</Button>
                  </TooltipTrigger>
                  <TooltipContent text={`Tooltip on ${pos}`} position={pos} />
                </Tooltip>
              ))}
            </div>
          </DemoExampleGroup>

          <DemoExampleGroup title="On Icon Button" description="Icon-only trigger with aria-label.">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                  aria-label="Information"
                >
                  <Icon name="information-circle" size="md" />
                </button>
              </TooltipTrigger>
              <TooltipContent text="More information" />
            </Tooltip>
          </DemoExampleGroup>

          <DemoExampleGroup title="On Text" description="Dotted underline span as trigger.">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help border-b border-dotted border-[var(--text-muted)] text-sm text-[var(--text-primary)]">
                  Hover for details
                </span>
              </TooltipTrigger>
              <TooltipContent text="Additional context for this term" />
            </Tooltip>
          </DemoExampleGroup>

          <UnsupportedEquivalentCallout
            feature="cornerVariant"
            reason="Astro sharp-corner tooltip variants have no Radix Tooltip equivalent. Use default rounded Content with arrow."
          />
        </DemoSection>

        <DemoSection id="props" title="Props">
          <PropsTable props={propRows} />
        </DemoSection>

        <DemoSection id="accessibility" title="Accessibility">
          <A11yCard title="Focus and hover" icon="cursor-arrow-rays">
            Radix Tooltips show on hover and keyboard focus (improvement over Astro CSS-only hover).
            Use a button or <code>asChild</code> on a focusable element for the trigger.
          </A11yCard>
          <A11yCard title="Content" icon="chat-bubble-left">
            Keep tooltip text short; do not put essential information only in a tooltip.
          </A11yCard>
        </DemoSection>
      </article>
    </TooltipProvider>
  );
}
