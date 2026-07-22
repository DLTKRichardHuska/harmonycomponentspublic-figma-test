import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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

const tooltipProps: PropRow[] = [
  { name: 'title', type: 'node', default: '—', description: 'Tooltip text content (Harmony text)' },
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right' | …",
    default: "'top'",
    description: 'Tooltip position (Harmony position) — theme default is top',
  },
  {
    name: 'arrow',
    type: 'boolean',
    default: 'true',
    description: 'Show directional arrow — enabled by theme defaultProps',
  },
  {
    name: 'children',
    type: 'element',
    default: '—',
    description: 'Trigger element — must forward a ref to a DOM node',
  },
  {
    name: 'describeChild',
    type: 'boolean',
    default: 'false',
    description: 'When true, title acts as accessible description instead of label',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'text', type: 'string', description: 'title' },
  { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", description: 'placement (same values)' },
  { name: 'slot / children', type: '—', description: 'Tooltip children (must forward ref)' },
  { name: 'CSS arrow', type: '—', description: 'arrow (theme default true)' },
  {
    name: 'cornerVariant',
    type: "'top' | 'bottom' | 'left' | 'right'",
    description: 'Not supported — see Corner variants callout',
  },
];

const exampleRowSx = { gap: 1.5, flexWrap: 'wrap', alignItems: 'center' } as const;
const positionsRowSx = {
  gap: 3,
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  p: 4,
} as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function TooltipsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Tooltips');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Tooltips"
        description="Tooltips display informative text when users hover over an element."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Tooltip" description="Hover to see the tooltip.">
          <Stack direction="row" sx={exampleRowSx}>
            <Tooltip describeChild title="This is a tooltip">
              <Button variant="outlined" color="inherit">
                Hover me
              </Button>
            </Tooltip>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Positions" description="Tooltips can appear in any direction.">
          <Stack direction="row" sx={positionsRowSx}>
            <Tooltip describeChild title="Appears on top" placement="top">
              <Button variant="outlined" color="inherit">
                Top
              </Button>
            </Tooltip>
            <Tooltip describeChild title="Appears on bottom" placement="bottom">
              <Button variant="outlined" color="inherit">
                Bottom
              </Button>
            </Tooltip>
            <Tooltip describeChild title="Appears on left" placement="left">
              <Button variant="outlined" color="inherit">
                Left
              </Button>
            </Tooltip>
            <Tooltip describeChild title="Appears on right" placement="right">
              <Button variant="outlined" color="inherit">
                Right
              </Button>
            </Tooltip>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="On Different Elements" description="Tooltips work on any element.">
          <Stack direction="row" sx={exampleRowSx}>
            <Tooltip title="Icon button info">
              <IconButton color="primary" aria-label="Information">
                <HarmonyIcon name="information-circle" fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip describeChild title="More information about this text">
              <Typography
                component="span"
                sx={{
                  cursor: 'help',
                  textDecoration: 'underline',
                  textDecorationStyle: 'dotted',
                }}
              >
                Hover for info
              </Typography>
            </Tooltip>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Corner Variants"
          description="Corner variants make one side's corners sharp while keeping the other corners rounded."
        >
          <UnsupportedEquivalentCallout
            feature="cornerVariant"
            reason="MUI Tooltip has no prop for sharp one-side corners or hiding the arrow per corner. Accepted gap per userDecision."
          />
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={tooltipProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="ARIA Attributes">
            MUI Tooltip uses <code>role=&quot;tooltip&quot;</code> and associates content with the trigger via{' '}
            <code>aria-describedby</code> (or labels the child by default). Pass <code>describeChild</code> when the
            trigger already has a visible label.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Access">
            Tooltips appear on hover for mouse users and on focus for keyboard users. When a tooltip trigger receives
            keyboard focus, the tooltip is displayed to provide context.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Screen readers announce tooltip content when the associated element receives focus. Tooltips should
            supplement, not replace, accessible labels on interactive elements.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Important Information">
            Do not rely solely on tooltips for critical information. Important details should be visible in the UI or
            provided through accessible labels, as tooltips may not be discovered by all users.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
