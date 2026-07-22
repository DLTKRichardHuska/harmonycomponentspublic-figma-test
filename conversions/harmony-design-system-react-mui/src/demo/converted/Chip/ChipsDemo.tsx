import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import { demoPageTitle } from '@/demo/demoPageTitle';

const chipProps: PropRow[] = [
  { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Chip size' },
  { name: 'variant', type: '"fill" | "outline"', default: '"fill"', description: 'Visual style variant' },
  {
    name: 'state',
    type: '"enabled" | "disabled" | "hover" | "focused" | "pressed"',
    default: '"enabled"',
    description: 'Interactive state',
  },
  {
    name: 'type',
    type: '"chip" | "horiz-dots" | "vert-dots" | "overflow"',
    default: '"chip"',
    description: 'Chip type/content',
  },
  { name: 'label', type: 'string', default: '"Chip"', description: 'Text shown when no slot content' },
  { name: 'overflowCount', type: 'number', default: '10', description: 'Number to display for overflow type' },
  { name: 'selected', type: 'boolean', default: 'false', description: 'Selected state (legacy)' },
  { name: 'removable', type: 'boolean', default: 'false', description: 'Shows remove button' },
  { name: 'icon', type: 'string', default: '—', description: 'Leading icon class' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'variant fill', type: '—', description: 'variant="filled"' },
  { name: 'variant outline', type: '—', description: 'variant="outlined"' },
  { name: 'size sm', type: '—', description: 'size="small"' },
  { name: 'size md', type: '—', description: 'size="medium"' },
  { name: 'size lg', type: '—', description: 'Not supported — see Sizes callout' },
  { name: 'state disabled', type: '—', description: 'disabled' },
  { name: 'state hover/focused/pressed', type: '—', description: 'MUI pseudo-states — see States callout' },
  { name: 'removable', type: '—', description: 'onDelete handler' },
  { name: 'icon', type: '—', description: 'icon={<HarmonyIcon fontSize="inherit" />}' },
  { name: 'implicit clickability', type: '—', description: 'onClick — pointer/hover only when onClick is set' },
  { name: 'type overflow', type: '—', description: 'label={`+${count}`} composite' },
  {
    name: 'type horiz-dots',
    type: '—',
    description: 'icon={<HarmonyIcon name="ellipsis-horizontal" />} + onClick',
  },
  {
    name: 'type vert-dots',
    type: '—',
    description: 'icon={<HarmonyIcon name="ellipsis-vertical" />} + onClick',
  },
  { name: 'selected (legacy)', type: '—', description: 'Not supported — see Legacy callout' },
];

const exampleRowSx = { gap: 1, flexWrap: 'wrap', alignItems: 'center' } as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function ChipsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Chips');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Chips"
        description="Chips are compact elements that represent tags, filters, or small pieces of information."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Sizes" description="Chips come in three sizes: Small (16px), Medium (24px), and Large (32px).">
          <Stack direction="row" spacing={1} sx={{ ...exampleRowSx, alignItems: 'flex-end' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Small
              </Typography>
              <Chip label="Chip Text" size="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Medium
              </Typography>
              <Chip label="Chip Text" size="medium" />
            </Box>
          </Stack>
          <UnsupportedEquivalentCallout
            feature='size="lg"'
            reason="MUI Chip supports only small and medium sizes. Harmony large (32px) has no native equivalent."
          />
        </DemoExampleGroup>

        <DemoExampleGroup title="Variants - Fill" description="Filled chips with solid background using the primary theme color.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Small" variant="filled" size="small" />
            <Chip label="Medium" variant="filled" size="medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Variants - Outline"
          description="Outlined chips with transparent background and primary color border."
        >
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Small" variant="outlined" size="small" />
            <Chip label="Medium" variant="outlined" size="medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="States - Enabled" description="Default enabled state for chips.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Fill Enabled" variant="filled" />
            <Chip label="Outline Enabled" variant="outlined" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="States - Disabled" description="Disabled state for non-interactive chips.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Fill Disabled" variant="filled" disabled />
            <Chip label="Outline Disabled" variant="outlined" disabled />
          </Stack>
        </DemoExampleGroup>

        <UnsupportedEquivalentCallout
          feature='state="hover" | "focused" | "pressed"'
          reason="MUI Chip uses CSS pseudo-states for hover, focus, and pressed. Static state demos are not supported."
        />

        <DemoExampleGroup
          title="Clickable chips"
          description="MUI chips show pointer cursor and hover styling only when onClick is set."
        >
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Filter tag" variant="filled" onClick={() => {}} />
            <Chip label="Active filter" variant="filled" onClick={() => {}} onDelete={() => {}} />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Types - Text Chips" description="Standard text chips with customizable content.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="Small Text" size="small" />
            <Chip label="Medium Text" size="medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Types - Horizontal Dots" description="Chips with horizontal ellipsis dots for menu actions.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip
              icon={<HarmonyIcon name="ellipsis-horizontal" fontSize="inherit" />}
              size="small"
              aria-label="More options"
              onClick={() => {}}
            />
            <Chip
              icon={<HarmonyIcon name="ellipsis-horizontal" fontSize="inherit" />}
              size="medium"
              aria-label="More options"
              onClick={() => {}}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Types - Vertical Dots" description="Chips with vertical ellipsis dots for menu actions.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip
              icon={<HarmonyIcon name="ellipsis-vertical" fontSize="inherit" />}
              size="small"
              aria-label="More options"
              onClick={() => {}}
            />
            <Chip
              icon={<HarmonyIcon name="ellipsis-vertical" fontSize="inherit" />}
              size="medium"
              aria-label="More options"
              onClick={() => {}}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Types - Overflow" description="Chips showing overflow count (e.g., +10 for additional items).">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="+10" size="small" />
            <Chip label="+10" size="medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons" description="Chips with leading icons.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip icon={<HarmonyIcon name="user" fontSize="inherit" />} label="John Doe" size="small" />
            <Chip icon={<HarmonyIcon name="tag" fontSize="inherit" />} label="Featured" size="medium" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Removable Chips" description="Chips that can be removed with a close button.">
          <Stack direction="row" spacing={1} sx={exampleRowSx}>
            <Chip label="React" size="small" onDelete={() => {}} />
            <Chip label="TypeScript" size="medium" onDelete={() => {}} />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Legacy - Selected State" description="Legacy selected prop (backward compatibility).">
          <UnsupportedEquivalentCallout
            feature="selected (legacy)"
            reason="MUI Chip has no selected prop. Use variant/color or application state to indicate selection."
          />
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={chipProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Chips with <code>onClick</code> are keyboard accessible. Use <kbd>Tab</kbd> to navigate to clickable chips
            and <kbd>Enter</kbd> or <kbd>Space</kbd> to activate them.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Focus States">
            Clickable chips include visible focus indicators via <code>:focus-visible</code>. Focus indicators meet
            WCAG 2.1 requirements for contrast and visibility.
          </A11yCard>
          <A11yCard icon="tag" title="Removable Chips">
            When chips are removable, the delete icon is keyboard accessible. Provide context via the chip label for
            screen reader users.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Chip text content is announced by screen readers. For icon-only chips (dots, overflow), use{' '}
            <code>aria-label</code> attributes.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
