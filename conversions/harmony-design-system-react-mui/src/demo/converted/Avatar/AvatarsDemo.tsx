import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
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

const avatarDemoPhotoSrc =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=128&h=128&fit=crop&q=80';

const avatarProps: PropRow[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Small 24×24, medium 32×32, large 40×40',
  },
  {
    name: 'variant',
    type: "'icon' | 'initials' | 'image'",
    default: "'icon'",
    description: 'Content mode (not MUI shape variant)',
  },
  {
    name: 'initials',
    type: 'string',
    default: '—',
    description: 'For initials content: up to two characters (names → first + last)',
  },
  { name: 'src', type: 'string', default: '—', description: 'Image URL for image content' },
  { name: 'alt', type: 'string', default: "''", description: 'Description for image content' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Wrap Avatar in ButtonBase for hover / focus / disabled',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'When interactive, disables ButtonBase',
  },
];

const harmonyMappingRows: PropRow[] = [
  {
    name: '(default shape)',
    type: '—',
    description: 'variant="rounded" via theme default (Harmony square look)',
  },
  {
    name: 'MUI shape circular / square',
    type: '—',
    description: 'variant="circular" | "square" — MUI superset; not in reference',
  },
  {
    name: 'size sm / md / lg',
    type: '—',
    description: 'sx width/height 24 / 32 / 40 (MUI docs size pattern); theme default is md (32)',
  },
  {
    name: 'corner radius / initials font by size',
    type: '—',
    description: 'Theme applies md radius (8px) and font (12px) for all sizes (accepted — no per-size chrome)',
  },
  {
    name: 'content icon',
    type: '—',
    description: 'children={<HarmonyIcon name="user" size="sm"|"md"|"lg" />} matching avatar size',
  },
  {
    name: 'content initials',
    type: '—',
    description: 'children={normalized initials string}',
  },
  {
    name: 'content image',
    type: '—',
    description: 'src + alt',
  },
  {
    name: 'interactive',
    type: '—',
    description: 'ButtonBase wrapping Avatar; hover via Avatar theme; focus-visible outline via MuiButtonBase theme',
  },
  {
    name: 'disabled',
    type: '—',
    description: 'ButtonBase disabled',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const exampleRowSx = { alignItems: 'flex-end', flexWrap: 'wrap' } as const;

export function AvatarsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Avatar');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Avatar"
        description="User avatar for shell header, tables, and cards: icon, initials, or photo. Defaults to MUI variant=&quot;rounded&quot; to match Harmony's square look."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Sizes (icon)" description="Small, medium, and large with default user icon. Size via width/height only (MUI docs).">
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <Avatar sx={{ width: 24, height: 24 }} aria-label="User">
              <HarmonyIcon name="user" size="sm" />
            </Avatar>
            <Avatar aria-label="User">
              <HarmonyIcon name="user" size="md" />
            </Avatar>
            <Avatar sx={{ width: 40, height: 40 }} aria-label="User">
              <HarmonyIcon name="user" size="lg" />
            </Avatar>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Content variants"
          description="Icon (default), initials, and a photograph. Harmony content variant ≠ MUI shape variant."
        >
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <Avatar aria-label="User">
              <HarmonyIcon name="user" size="md" />
            </Avatar>
            <Avatar aria-label="Jane Doe">JD</Avatar>
            <Avatar
              src={avatarDemoPhotoSrc}
              alt="Portrait of a person used as sample photo"
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Interactive"
          description="ButtonBase wraps Avatar (MUI Avatar-upload pattern). Hover and focus-visible via real pointer/keyboard interaction; disabled via ButtonBase."
        >
          <Stack direction="row" spacing={4} sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <ButtonBase aria-label="User">
                <Avatar aria-hidden>
                  <HarmonyIcon name="user" size="md" />
                </Avatar>
              </ButtonBase>
              <Typography variant="body2" color="text.secondary">
                Default
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <ButtonBase aria-label="User" disabled>
                <Avatar aria-hidden>
                  <HarmonyIcon name="user" size="md" />
                </Avatar>
              </ButtonBase>
              <Typography variant="body2" color="text.secondary">
                Disabled
              </Typography>
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="MUI shape supersets"
          description="Consumers can still opt into circular or square — available on MUI, not in the Harmony reference."
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar variant="rounded" aria-label="Rounded (default)">
              RD
            </Avatar>
            <Avatar variant="circular" aria-label="Circular">
              CR
            </Avatar>
            <Avatar variant="square" aria-label="Square">
              SQ
            </Avatar>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={avatarProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="eye" title="Roles and labels">
            Non-interactive avatars should expose an accessible name via <code>alt</code> (images) or{' '}
            <code>aria-label</code>. Interactive avatars use <code>ButtonBase</code> with an{' '}
            <code>aria-label</code>; mark decorative children <code>aria-hidden</code> when redundant.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
