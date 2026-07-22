import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
import { demoPageTitle } from '@/demo/demoPageTitle';

const accordionProps: PropRow[] = [
  { name: 'expanded / defaultExpanded', type: 'boolean', default: 'false', description: 'Controlled or initial open state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents expanding the section' },
  { name: 'onChange', type: '(event, expanded) => void', default: '—', description: 'Expansion change handler' },
  { name: 'disableGutters', type: 'boolean', default: 'true (theme)', description: 'Removes default MUI gutters' },
  { name: 'children', type: 'node', default: '—', description: 'Compose AccordionSummary + AccordionDetails' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'item title', type: '—', description: 'AccordionSummary children' },
  { name: 'item content / slots', type: '—', description: 'AccordionDetails children' },
  { name: 'defaultOpen', type: '—', description: 'defaultExpanded' },
  { name: 'disabled', type: '—', description: 'Accordion disabled' },
  { name: 'allowMultiple false', type: '—', description: 'Controlled exclusive expanded panel id' },
  { name: 'allowMultiple true', type: '—', description: 'Uncontrolled Accordion siblings (MUI default)' },
  { name: 'field label', type: '—', description: 'Typography above group + role="group"' },
  { name: 'expand icon', type: '—', description: 'expandIcon={<HarmonyIcon name="chevron-down" />}' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#example-with-label', label: 'With label' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const expandIcon = <HarmonyIcon name="chevron-down" fontSize="inherit" />;

export function AccordionsDemo() {
  const [basicExpanded, setBasicExpanded] = useState<string | false>(false);
  const [defaultOpenExpanded, setDefaultOpenExpanded] = useState<string | false>('faq-0');

  useEffect(() => {
    document.title = demoPageTitle('Accordion');
  }, []);

  const onBasicChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setBasicExpanded(isExpanded ? panel : false);
  };

  const onDefaultOpenChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setDefaultOpenExpanded(isExpanded ? panel : false);
  };

  return (
    <Box component="article">
      <DemoPageHeader
        title="Accordion"
        description="Accordions organize content into collapsible sections, helping users navigate large amounts of information."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Accordion" description="Standard accordion with single item open.">
          <Box sx={{ maxWidth: 672 }}>
            <Accordion
              expanded={basicExpanded === 'basic-0'}
              onChange={onBasicChange('basic-0')}
            >
              <AccordionSummary expandIcon={expandIcon}>What is this design system?</AccordionSummary>
              <AccordionDetails>
                This is a comprehensive design system built with accessibility, performance, and flexibility in mind.
                It includes foundation elements, shell layout components, and production-ready UI components.
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={basicExpanded === 'basic-1'}
              onChange={onBasicChange('basic-1')}
            >
              <AccordionSummary expandIcon={expandIcon}>How do I get started?</AccordionSummary>
              <AccordionDetails>
                Start by exploring the Foundation section to understand our design tokens. Then check out the Shell
                Layout for page structure, and finally browse the Components for ready-to-use UI elements.
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={basicExpanded === 'basic-2'}
              onChange={onBasicChange('basic-2')}
            >
              <AccordionSummary expandIcon={expandIcon}>Is it accessible?</AccordionSummary>
              <AccordionDetails>
                Yes! All components are built with accessibility as a priority. They include proper ARIA attributes,
                keyboard navigation, and follow WCAG guidelines.
              </AccordionDetails>
            </Accordion>
          </Box>
        </DemoExampleGroup>

        <Box id="example-with-label">
          <DemoExampleGroup
            title="With Label"
            description='Pass a heading above the accordion. The control uses role="group" and aria-labelledby for accessibility.'
          >
            <Stack spacing={1.5} sx={{ maxWidth: 672 }} role="group" aria-labelledby="accordion-prefs-label">
              <Typography id="accordion-prefs-label" variant="body1" component="p">
                Account preferences
              </Typography>
              <Box>
                <Accordion>
                  <AccordionSummary expandIcon={expandIcon}>Notifications</AccordionSummary>
                  <AccordionDetails>Choose how you receive updates and alerts.</AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={expandIcon}>Privacy</AccordionSummary>
                  <AccordionDetails>Control what data is stored and shared.</AccordionDetails>
                </Accordion>
              </Box>
            </Stack>
          </DemoExampleGroup>
        </Box>

        <DemoExampleGroup title="With Default Open" description="Accordion with an item open by default.">
          <Box sx={{ maxWidth: 672 }}>
            <Accordion
              expanded={defaultOpenExpanded === 'faq-0'}
              onChange={onDefaultOpenChange('faq-0')}
            >
              <AccordionSummary expandIcon={expandIcon}>Can I customize the colors?</AccordionSummary>
              <AccordionDetails>
                Absolutely! The design system uses CSS custom properties (variables) for all colors. You can override
                them in your project to match your brand.
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={defaultOpenExpanded === 'faq-1'}
              onChange={onDefaultOpenChange('faq-1')}
            >
              <AccordionSummary expandIcon={expandIcon}>What browsers are supported?</AccordionSummary>
              <AccordionDetails>
                We support all modern browsers including Chrome, Firefox, Safari, and Edge. IE11 is not supported.
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={defaultOpenExpanded === 'faq-2'}
              onChange={onDefaultOpenChange('faq-2')}
            >
              <AccordionSummary expandIcon={expandIcon}>Can I use this commercially?</AccordionSummary>
              <AccordionDetails>
                Yes, this design system is available for commercial use. Please check the license for specific terms.
              </AccordionDetails>
            </Accordion>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="Allow Multiple" description="Multiple items can be open simultaneously.">
          <Box sx={{ maxWidth: 672 }}>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>What is this design system?</AccordionSummary>
              <AccordionDetails>
                This is a comprehensive design system built with accessibility, performance, and flexibility in mind.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>How do I get started?</AccordionSummary>
              <AccordionDetails>
                Start by exploring the Foundation section, then Shell Layout, then Components.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>Is it accessible?</AccordionSummary>
              <AccordionDetails>
                Yes — ARIA attributes, keyboard navigation, and WCAG-oriented patterns.
              </AccordionDetails>
            </Accordion>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Disabled Sections"
          description="Set disabled on an item to prevent expanding that section and to apply disabled header styling."
        >
          <Box sx={{ maxWidth: 672 }}>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>Editable section</AccordionSummary>
              <AccordionDetails>This section can be expanded or collapsed.</AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary expandIcon={expandIcon}>Locked section</AccordionSummary>
              <AccordionDetails>This content is not available yet.</AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>Another editable section</AccordionSummary>
              <AccordionDetails>
                Disabled sections are skipped in the tab order and cannot be opened.
              </AccordionDetails>
            </Accordion>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Focus"
          description="Focused section headers use the same grey background as the hover state. Tab through headers or click to move focus."
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 672 }}>
            Tab through the headers below or click to move focus and see the focus state.
          </Typography>
          <Box sx={{ maxWidth: 672 }}>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>What is this design system?</AccordionSummary>
              <AccordionDetails>
                Focus styling comes from theme <code>:hover</code> / <code>Mui-focusVisible</code> overrides — not
                static docs staging classes.
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>How do I get started?</AccordionSummary>
              <AccordionDetails>Explore Foundation, Shell, then Components.</AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={expandIcon}>Is it accessible?</AccordionSummary>
              <AccordionDetails>Keyboard and screen-reader friendly headers and panels.</AccordionDetails>
            </Accordion>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={accordionProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          Accordion headers are keyboard accessible. Use <kbd>Tab</kbd> to navigate and <kbd>Enter</kbd> or{' '}
          <kbd>Space</kbd> to toggle expansion.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          Headers expose <code>aria-expanded</code> and control associations to panels. When a field label is shown,
          use <code>role=&quot;group&quot;</code> and <code>aria-labelledby</code>.
        </A11yCard>
        <A11yCard title="Screen Reader Support" icon="eye">
          Screen readers announce header text, expansion state, and content when expanded.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
