import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
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

const notificationBadgeProps: PropRow[] = [
  { name: 'type', type: "'dot' | 'number' | 'overflow'", default: "'number'", description: 'Badge content type' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Badge size' },
  {
    name: 'variant',
    type: "'error' | 'primary'",
    default: "'primary'",
    description: 'Badge color variant (error = red, primary = blue)',
  },
  { name: 'value', type: 'string | number', default: '1', description: 'Content value for number or overflow badges' },
  { name: 'border', type: 'boolean', default: 'false', description: 'Show white border' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'type dot', type: '—', description: 'variant="dot"' },
  { name: 'type number', type: '—', description: 'badgeContent={value}' },
  { name: 'type overflow', type: '—', description: 'badgeContent={count} max={99} — MUI renders "99+" when count exceeds max' },
  { name: 'variant primary', type: '—', description: 'color="primary"' },
  { name: 'variant error', type: '—', description: 'color="error"' },
  { name: 'border', type: '—', description: 'Not supported — no native MUI Badge prop; see Border callout' },
  { name: 'size sm/md/lg', type: '—', description: 'Not supported — theme targets md; see Sizes callout' },
  { name: 'standalone span', type: '—', description: 'Wrap IconButton or Avatar — see Wrapper pattern callout' },
];

const exampleRowSx = { gap: 1.5, flexWrap: 'wrap', alignItems: 'center' } as const;
const groupRowSx = { gap: 3, flexWrap: 'wrap' } as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function NotificationBadgesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Notification Badges');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Notification Badges"
        description='Notification badges are small indicators used to display notification counts as dots, numbers, or overflow text (e.g., "99+").'
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="standalone NotificationBadge span"
          reason="MUI Badge is a wrapper component. In consumer apps, wrap an IconButton, Avatar, or other anchor element."
        />

        <UnsupportedEquivalentCallout
          feature='size="sm" | "lg"'
          reason="MUI Badge has no size prop. Theme applies medium dimensions by default."
        />

        <UnsupportedEquivalentCallout
          feature='border={true}'
          reason="MUI Badge has no border prop. White ring styling cannot be applied via documented Badge props without custom slot styling."
        />

        <DemoExampleGroup title="Dot Badges" description="Simple circular dot indicators on an icon button.">
          <Stack direction="row" spacing={3} sx={groupRowSx}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Primary (Blue)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge variant="dot" color="primary">
                  <IconButton size="small" aria-label="Notifications">
                    <HarmonyIcon name="bell" />
                  </IconButton>
                </Badge>
              </Stack>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Error (Red)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge variant="dot" color="error">
                  <IconButton size="small" aria-label="Notifications">
                    <HarmonyIcon name="bell" />
                  </IconButton>
                </Badge>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Number Badges" description="Badges displaying specific counts on an icon button.">
          <Stack direction="row" spacing={3} sx={groupRowSx}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Primary (Blue)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge badgeContent={1} color="primary">
                  <IconButton size="small" aria-label="Notifications">
                    <HarmonyIcon name="bell" />
                  </IconButton>
                </Badge>
              </Stack>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Error (Red)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge badgeContent={5} color="error">
                  <IconButton size="small" aria-label="Notifications">
                    <HarmonyIcon name="bell" />
                  </IconButton>
                </Badge>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Overflow Badges"
          description="Counts above max render as overflow text (e.g. badgeContent={100} max={99} → 99+)."
        >
          <Stack direction="row" spacing={3} sx={groupRowSx}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Primary (Blue)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge badgeContent={100} max={99} color="primary">
                  <IconButton size="small" aria-label="Notifications">
                    <HarmonyIcon name="bell" />
                  </IconButton>
                </Badge>
              </Stack>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Error (Red)
              </Typography>
              <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
                <Badge badgeContent={100} max={99} color="error" overlap="rectangular">
                  <Avatar sx={{ width: 32, height: 32 }}>AB</Avatar>
                </Badge>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={notificationBadgeProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="ARIA Labels">
            Notification badges should include <code>aria-label</code> attributes on the anchor element to provide
            context for screen readers. For example, &quot;5 unread notifications&quot; or &quot;New message
            indicator&quot;.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Screen readers announce badge content when properly labeled. For number badges, the count is announced. For
            dot badges, ensure an <code>aria-label</code> describes what the indicator represents.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Color Contrast">
            All notification badge variants meet WCAG 2.1 AA contrast requirements. Text and background colors provide
            sufficient contrast for readability.
          </A11yCard>
          <A11yCard icon="tag" title="Live Regions">
            When badge counts update dynamically, consider using <code>aria-live=&quot;polite&quot;</code> or{' '}
            <code>aria-live=&quot;assertive&quot;</code> to announce changes to screen reader users.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
