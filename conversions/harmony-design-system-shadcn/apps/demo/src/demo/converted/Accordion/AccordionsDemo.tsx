import { useEffect, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Exclusive vs multi-expand (maps Astro allowMultiple)' },
  { name: 'value / defaultValue', type: 'string | string[]', default: '—', description: 'Controlled / uncontrolled open item value(s)' },
  { name: 'onValueChange', type: 'fn', default: '—', description: 'Radix change handler' },
  { name: 'AccordionItem.value', type: 'string', default: '—', description: 'Required item identity' },
  { name: 'AccordionItem.disabled', type: 'boolean', default: 'false', description: 'Prevents expanding that section' },
  { name: 'AccordionTrigger / AccordionContent', type: 'children', default: '—', description: 'Compose header and body (no items[] API)' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#example-with-label', label: 'With label', icon: 'tag' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

function AccordionWithLabel({
  label,
  children,
  ...accordionProps
}: {
  label: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<typeof Accordion>) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-[var(--space-1-5)]" role="group" aria-labelledby={labelId}>
      <p
        id={labelId}
        className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-base)] font-[var(--font-normal)] text-[var(--text-primary)]"
      >
        {label}
      </p>
      <Accordion {...accordionProps}>{children}</Accordion>
    </div>
  );
}

export function AccordionsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Accordion');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Accordion"
        description="Accordions organize content into collapsible sections, helping users navigate large amounts of information."
      />

      <ImportSnippet
        code={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Body</AccordionContent>
  </AccordionItem>
</Accordion>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="items[] / item-* slots"
          reason="shadcn Accordion uses compound AccordionItem / Trigger / Content children instead of an Astro items array or named slots."
        />

        <DemoExampleGroup title="Basic Accordion" description="Standard accordion with single item open.">
          <div className="max-w-2xl">
            <Accordion type="single" collapsible>
              <AccordionItem value="what">
                <AccordionTrigger>What is this design system?</AccordionTrigger>
                <AccordionContent>
                  This is a comprehensive design system built with accessibility, performance, and flexibility in
                  mind. It includes foundation elements, shell layout components, and production-ready UI components.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="start">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Start by exploring the Foundation section to understand our design tokens. Then check out the Shell
                  Layout for page structure, and finally browse the Components for ready-to-use UI elements.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a11y">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes! All components are built with accessibility as a priority. They include proper ARIA attributes,
                  keyboard navigation, and follow WCAG guidelines.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DemoExampleGroup>

        <div id="example-with-label">
          <DemoExampleGroup
            title="With Label"
            description='Compose a heading above the accordion with role="group" and aria-labelledby for accessibility.'
          >
            <div className="max-w-2xl">
              <AccordionWithLabel label="Account preferences" type="single" collapsible>
                <AccordionItem value="notifications">
                  <AccordionTrigger>Notifications</AccordionTrigger>
                  <AccordionContent>Choose how you receive updates and alerts.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy">
                  <AccordionTrigger>Privacy</AccordionTrigger>
                  <AccordionContent>Control what data is stored and shared.</AccordionContent>
                </AccordionItem>
              </AccordionWithLabel>
            </div>
          </DemoExampleGroup>
        </div>

        <DemoExampleGroup title="With Default Open" description="Accordion with an item open by default.">
          <div className="max-w-2xl">
            <Accordion type="single" collapsible defaultValue="colors">
              <AccordionItem value="colors">
                <AccordionTrigger>Can I customize the colors?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! The design system uses CSS custom properties (variables) for all colors. You can override
                  them in your project to match your brand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="browsers">
                <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                <AccordionContent>
                  We support all modern browsers including Chrome, Firefox, Safari, and Edge. IE11 is not supported.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="commercial">
                <AccordionTrigger>Can I use this commercially?</AccordionTrigger>
                <AccordionContent>
                  Yes, this design system is available for commercial use. Please check the license for specific terms.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Allow Multiple" description="Multiple items can be open simultaneously.">
          <div className="max-w-2xl">
            <Accordion type="multiple">
              <AccordionItem value="what">
                <AccordionTrigger>What is this design system?</AccordionTrigger>
                <AccordionContent>
                  This is a comprehensive design system built with accessibility, performance, and flexibility in mind.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="start">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Start by exploring the Foundation section, then Shell Layout, then Components.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a11y">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes — ARIA attributes, keyboard navigation, and WCAG guidelines.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Disabled Sections"
          description="Set disabled on an item to prevent expanding that section and to apply disabled header styling."
        >
          <div className="max-w-2xl">
            <Accordion type="multiple">
              <AccordionItem value="editable">
                <AccordionTrigger>Editable section</AccordionTrigger>
                <AccordionContent>This section can be expanded or collapsed.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="locked" disabled>
                <AccordionTrigger>Locked section</AccordionTrigger>
                <AccordionContent>This content is not available yet.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="another">
                <AccordionTrigger>Another editable section</AccordionTrigger>
                <AccordionContent>
                  Disabled sections are skipped in the tab order and cannot be opened.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Focus"
          description="Focused section headers use the same grey background as the hover state."
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              Tab through the headers below or click to move focus and see the focus state.
            </p>
            <Accordion type="multiple">
              <AccordionItem value="what">
                <AccordionTrigger>What is this design system?</AccordionTrigger>
                <AccordionContent>Foundation, shell, and UI components.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="start">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>Explore Foundation, then Shell, then Components.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="a11y">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes — built with accessibility as a priority.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          Accordion headers are fully keyboard accessible. Use <kbd>Tab</kbd> to navigate to accordion items, and{' '}
          <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle expansion.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          Radix Accordion provides appropriate roles and expanded state for each section. Compose a group label with{' '}
          <code>role=&quot;group&quot;</code> and <code>aria-labelledby</code> when needed.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce section titles and expanded/collapsed state.
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled items use the <code>disabled</code> prop and are skipped in the tab order.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
