import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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

/** flex-start so ButtonGroup stays content-width (Stack column defaults to stretch). */
const exampleStackSx = { gap: 2, alignItems: 'flex-start' } as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const buttonGroupProps: PropRow[] = [
  {
    name: 'variant',
    type: "'contained' | 'outlined' | 'text'",
    default: "'contained'",
    description: 'Group chrome — contained = Harmony default segmented shell; outlined = Harmony outline connected strip',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'Size applied to child buttons via ButtonGroup context',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Layout direction of the group',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables all buttons in the group',
  },
  {
    name: 'disableElevation',
    type: 'boolean',
    default: 'true',
    description: 'Removes elevation (Harmony theme default)',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Immediate Button children',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'variant default', type: '—', description: 'variant="contained" (segmented shell)' },
  { name: 'variant outline', type: '—', description: 'variant="outlined" (connected strip)' },
  { name: 'size sm', type: '—', description: 'size="small"' },
  { name: 'size md', type: '—', description: 'size="medium"' },
  { name: 'size lg', type: '—', description: 'size="large"' },
  { name: 'orientation', type: '—', description: 'orientation (same values)' },
  {
    name: 'selected segment',
    type: '—',
    description: 'Child Button variant="contained"',
  },
  {
    name: 'unselected segment',
    type: '—',
    description: 'Child Button variant="outlined"',
  },
  { name: 'slot / children', type: '—', description: 'ButtonGroup children' },
];

export function ButtonGroupsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Button Groups');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Button Groups"
        description="Button groups combine related buttons into a single visual unit."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Contained Variant (Container with Border)"
          description="Harmony default — bordered container with spaced segments. Selected buttons use contained primary; unselected use outlined."
        >
          <ButtonGroup variant="contained" aria-label="Default button group">
            <Button variant="contained">Selected</Button>
            <Button variant="outlined">Option 1</Button>
            <Button variant="outlined">Option 2</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Contained Variant - Toggle Example"
          description="Button group used as a toggle with selected and unselected states."
        >
          <ButtonGroup variant="contained" aria-label="View period">
            <Button variant="contained">Day</Button>
            <Button variant="outlined">Week</Button>
            <Button variant="outlined">Month</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Size Variants"
          description="Button groups support three sizes: small, medium (default), and large."
        >
          <Stack sx={exampleStackSx}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Small
              </Typography>
              <ButtonGroup variant="contained" size="small" aria-label="Small group">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Medium (default)
              </Typography>
              <ButtonGroup variant="contained" size="medium" aria-label="Medium group">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Large
              </Typography>
              <ButtonGroup variant="contained" size="large" aria-label="Large group">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Orientation Variants"
          description="Button groups can be displayed horizontally (default) or vertically."
        >
          <Stack sx={exampleStackSx}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Horizontal (default)
              </Typography>
              <ButtonGroup variant="contained" orientation="horizontal" aria-label="Horizontal group">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Vertical
              </Typography>
              <ButtonGroup variant="contained" orientation="vertical" aria-label="Vertical group">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled State" description="Button groups support disabled state for all buttons.">
          <ButtonGroup variant="contained" disabled aria-label="Disabled group">
            <Button variant="contained">Selected</Button>
            <Button variant="outlined">Option 1</Button>
            <Button variant="outlined">Option 2</Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Multiple Button Counts"
          description="Button groups work with various numbers of buttons (2-10+)."
        >
          <Stack sx={exampleStackSx}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                2 Buttons
              </Typography>
              <ButtonGroup variant="contained" aria-label="Two buttons">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                5 Buttons
              </Typography>
              <ButtonGroup variant="contained" aria-label="Five buttons">
                <Button variant="contained">Option 1</Button>
                <Button variant="outlined">Option 2</Button>
                <Button variant="outlined">Option 3</Button>
                <Button variant="outlined">Option 4</Button>
                <Button variant="outlined">Option 5</Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                10 Buttons
              </Typography>
              <ButtonGroup variant="contained" aria-label="Ten buttons">
                <Button variant="contained">1</Button>
                <Button variant="outlined">2</Button>
                <Button variant="outlined">3</Button>
                <Button variant="outlined">4</Button>
                <Button variant="outlined">5</Button>
                <Button variant="outlined">6</Button>
                <Button variant="outlined">7</Button>
                <Button variant="outlined">8</Button>
                <Button variant="outlined">9</Button>
                <Button variant="outlined">10</Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With icons and text"
          description="Buttons in the group can show both an icon and a label."
        >
          <Stack sx={exampleStackSx}>
            <ButtonGroup variant="contained" aria-label="Icons and text">
              <Button variant="contained" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
                Button 1
              </Button>
              <Button variant="outlined" startIcon={<HarmonyIcon name="squares-2x2" fontSize="inherit" />}>
                Button 2
              </Button>
              <Button variant="outlined" startIcon={<HarmonyIcon name="chart-bar" fontSize="inherit" />}>
                Button 3
              </Button>
            </ButtonGroup>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Small
              </Typography>
              <ButtonGroup variant="contained" size="small" aria-label="Icons small">
                <Button variant="contained" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
                  Button 1
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="squares-2x2" fontSize="inherit" />}>
                  Button 2
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="chart-bar" fontSize="inherit" />}>
                  Button 3
                </Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Medium
              </Typography>
              <ButtonGroup variant="contained" size="medium" aria-label="Icons medium">
                <Button variant="contained" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
                  Button 1
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="squares-2x2" fontSize="inherit" />}>
                  Button 2
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="chart-bar" fontSize="inherit" />}>
                  Button 3
                </Button>
              </ButtonGroup>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Large
              </Typography>
              <ButtonGroup variant="contained" size="large" aria-label="Icons large">
                <Button variant="contained" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
                  Button 1
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="squares-2x2" fontSize="inherit" />}>
                  Button 2
                </Button>
                <Button variant="outlined" startIcon={<HarmonyIcon name="chart-bar" fontSize="inherit" />}>
                  Button 3
                </Button>
              </ButtonGroup>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Contained Variant - With Icons"
          description="Button group with icon-only buttons in the contained (Harmony default) variant."
        >
          <ButtonGroup variant="contained" aria-label="Text formatting">
            <Button variant="contained" aria-label="Bold">
              <HarmonyIcon name="bold" fontSize="inherit" />
            </Button>
            <Button variant="outlined" aria-label="Italic">
              <HarmonyIcon name="italic" fontSize="inherit" />
            </Button>
            <Button variant="outlined" aria-label="Underline">
              <HarmonyIcon name="underline" fontSize="inherit" />
            </Button>
          </ButtonGroup>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Outlined Variant (Connected Buttons)"
          description="Harmony outline — connected buttons without a container border."
        >
          <ButtonGroup variant="outlined" aria-label="Alignment">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={buttonGroupProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Group label">
            Provide an accessible name with <code>aria-label</code> or <code>aria-labelledby</code> on the{' '}
            <code>ButtonGroup</code> root (<code>role=&quot;group&quot;</code>).
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            Buttons inside the group are in DOM order. Use <kbd>Tab</kbd> to move between them and{' '}
            <kbd>Enter</kbd> or <kbd>Space</kbd> to activate.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Selection">
            Selection is consumer-managed via child <code>Button</code> variants (
            <code>contained</code> vs <code>outlined</code>), not a built-in group value.
          </A11yCard>
          <A11yCard icon="eye" title="Icon-only buttons">
            Always include <code>aria-label</code> on icon-only buttons.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
