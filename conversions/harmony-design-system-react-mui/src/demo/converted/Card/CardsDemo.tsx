import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
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

const cardProps: PropRow[] = [
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Adds shadow elevation' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Adds hover effects for clickable cards' },
  { name: 'primary', type: 'boolean', default: 'false', description: 'Adds 6px top border in theme primary color' },
  { name: 'withHeader', type: 'boolean', default: 'false', description: 'Shows card header section with title/subtitle' },
  { name: 'headerTitle', type: 'string', default: "'Card title'", description: 'Card header title text' },
  { name: 'headerSubtitle', type: 'string', default: "''", description: 'Card header subtitle text' },
  { name: 'icon1', type: 'string', default: 'undefined', description: 'Rightmost header icon name (e.g. "x-mark"). Omit to hide.' },
  { name: 'icon2', type: 'string', default: 'undefined', description: 'Middle header icon name (e.g. "ellipsis-vertical"). Omit to hide.' },
  { name: 'icon3', type: 'string', default: 'undefined', description: 'Leftmost header icon name (e.g. "cog-6-tooth"). Omit to hide.' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'root container', type: '—', description: 'Card (theme: outlined + paper/border/radius/shadow-sm)' },
  { name: 'body slot', type: '—', description: 'CardContent' },
  { name: 'footer slot', type: '—', description: 'CardActions' },
  { name: 'withHeader / headerTitle / headerSubtitle', type: '—', description: 'CardHeader title / subheader' },
  { name: 'icon1 / icon2 / icon3', type: '—', description: 'CardHeader action + IconButton + HarmonyIcon' },
  { name: 'elevated', type: '—', description: 'raised' },
  { name: 'interactive', type: '—', description: 'Wrap content in CardActionArea' },
  { name: 'primary', type: '—', description: 'Not supported — see Primary callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const cardMaxWidth = { maxWidth: 448 } as const;
const cardGridSx = {
  display: 'grid',
  gap: 2,
  maxWidth: 672,
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
} as const;

export function CardsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Cards');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Cards"
        description="Cards contain content and actions about a single subject. They're a flexible container for grouping related information."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="primary (6px top primary border)"
          reason="MUI Card has no prop for a theme-primary top accent border. Use Card header/media composition or a custom export if this accent becomes required."
        />

        <DemoExampleGroup title="Basic Card" description="Simple card with content.">
          <Box sx={cardMaxWidth}>
            <Card>
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  This is a basic card with some content. Cards are great for grouping related information together.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="Card with Header" description="Card with distinct header section.">
          <Box sx={cardMaxWidth}>
            <Card>
              <CardHeader title="Card Title" subheader="Subtitle or description" />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  Card body content goes here. You can add any content you need.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Card with Header Icons"
          description="Up to three icon buttons in the header, right-aligned. Pass any icon name; omit to hide that position."
        >
          <Stack spacing={2} sx={cardMaxWidth}>
            <Card>
              <CardHeader
                title="All Three Icons"
                action={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton size="small" aria-label="Settings">
                      <HarmonyIcon name="cog-6-tooth" size="sm" />
                    </IconButton>
                    <IconButton size="small" aria-label="More options">
                      <HarmonyIcon name="ellipsis-vertical" size="sm" />
                    </IconButton>
                    <IconButton size="small" aria-label="Close">
                      <HarmonyIcon name="x-mark" size="sm" />
                    </IconButton>
                  </Stack>
                }
              />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  Card with close, menu, and settings icons.
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="Close Only"
                action={
                  <IconButton size="small" aria-label="Close">
                    <HarmonyIcon name="x-mark" size="sm" />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  A single icon always appears at the far right.
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="With Subtitle"
                subheader="Optional description"
                action={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton size="small" aria-label="Settings">
                      <HarmonyIcon name="cog-6-tooth" size="sm" />
                    </IconButton>
                    <IconButton size="small" aria-label="More options">
                      <HarmonyIcon name="ellipsis-vertical" size="sm" />
                    </IconButton>
                    <IconButton size="small" aria-label="Close">
                      <HarmonyIcon name="x-mark" size="sm" />
                    </IconButton>
                  </Stack>
                }
              />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  Icons also work alongside a header subtitle.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Elevated Card" description="Card with shadow for more emphasis.">
          <Box sx={cardMaxWidth}>
            <Card raised>
              <CardHeader title="Elevated Card" />
              <CardContent>
                <Typography variant="body1" color="textSecondary">
                  This card has a shadow to make it stand out from the page background.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="Interactive Card" description="Clickable card with hover effects via CardActionArea.">
          <Box sx={cardGridSx}>
            <Card>
              <CardActionArea>
                <CardHeader title="Click Me" />
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    This card has hover effects and is clickable.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card>
              <CardActionArea>
                <CardHeader title="Click Me Too" />
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Another interactive card example.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Elevated + Interactive"
          description="Combine raised elevation with CardActionArea."
        >
          <Box sx={cardMaxWidth}>
            <Card raised>
              <CardActionArea>
                <CardHeader title="Elevated Interactive" />
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Raised card that remains clickable via CardActionArea.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={cardProps} />
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Harmony prop list above is for reference mapping. Consumers use documented MUI Card APIs (
          raised, CardHeader, CardContent, CardActions, CardActionArea) — not Harmony boolean/title props
          on Card.
        </Typography>
      </DemoSection>

      <DemoSection id="mapping" title="Harmony mapping">
        <DemoMappingSection rows={harmonyMappingRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Semantic Structure">
            Organize card content with CardHeader, CardContent, and CardActions so heading hierarchy and
            regions stay clear for assistive technology.
          </A11yCard>
          <A11yCard icon="keyboard" title="Interactive Cards">
            When using CardActionArea, the surface is keyboard-focusable. Keep supplemental actions (e.g.
            header IconButtons) outside the action area to avoid overlapping activation targets.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Focus Indicators">
            Interactive cards show a visible focus ring from ButtonBase / CardActionArea. Theme styles
            also emphasize the card border on focus-visible.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Use descriptive CardHeader titles so screen reader users understand each card&apos;s topic
            before listening to the body.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
