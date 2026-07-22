import { useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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

const listProps: PropRow[] = [
  { name: 'disablePadding', type: 'boolean', default: 'true (theme)', description: 'Removes default List vertical padding' },
  { name: 'children', type: 'node', default: '—', description: 'ListItemButton children' },
];

const listItemButtonProps: PropRow[] = [
  { name: 'selected', type: 'boolean', default: 'false', description: 'Active / selected item styling' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Bottom separator (default variant); omit for no-borders' },
  { name: 'component', type: 'elementType', default: '—', description: 'e.g. "a" for link items' },
  { name: 'href', type: 'string', default: '—', description: 'When component="a"' },
  { name: 'children', type: 'node', default: '—', description: 'ListItemIcon + ListItemText' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'items[]', type: '—', description: 'Map to ListItemButton children' },
  { name: 'as="button"', type: '—', description: 'ListItemButton (default)' },
  { name: 'as="link"', type: '—', description: 'ListItemButton component="a" href={…}' },
  { name: 'item.active', type: '—', description: 'selected' },
  { name: 'item.label', type: '—', description: 'ListItemText' },
  { name: 'item.icon', type: '—', description: 'ListItemIcon + HarmonyIcon fontSize="inherit"' },
  { name: 'item.isCustom + customSrc', type: '—', description: 'ListItemIcon + <img alt={label}>' },
  { name: 'variant="default"', type: '—', description: 'ListItemButton divider on all but last' },
  { name: 'variant="no-borders"', type: '—', description: 'Omit divider prop' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function ListMenusDemo() {
  useEffect(() => {
    document.title = demoPageTitle('List Menu');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="List Menu"
        description="List menus display a vertical list of interactive items for navigation or selection."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic List Menu" description="Standard navigation menu.">
          <Box sx={{ maxWidth: 320 }}>
            <List>
              <ListItemButton selected divider>
                <ListItemIcon>
                  <HarmonyIcon name="home" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton divider>
                <ListItemIcon>
                  <HarmonyIcon name="user" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton divider>
                <ListItemIcon>
                  <HarmonyIcon name="cog-6-tooth" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HarmonyIcon name="arrow-right-on-rectangle" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Without icons"
          description="Menu items can use labels only; icons on each item are optional."
        >
          <Box sx={{ maxWidth: 320 }}>
            <List>
              <ListItemButton selected divider>
                <ListItemText primary="Overview" />
              </ListItemButton>
              <ListItemButton divider>
                <ListItemText primary="Details" />
              </ListItemButton>
              <ListItemButton divider>
                <ListItemText primary="History" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Export" />
              </ListItemButton>
            </List>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Links" description="Menu as navigation links.">
          <Box sx={{ maxWidth: 320 }}>
            <List>
              <ListItemButton component="a" href="#" selected divider>
                <ListItemIcon>
                  <HarmonyIcon name="document" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Documents" />
              </ListItemButton>
              <ListItemButton component="a" href="#" divider>
                <ListItemIcon>
                  <HarmonyIcon name="photo" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Images" />
              </ListItemButton>
              <ListItemButton component="a" href="#" divider>
                <ListItemIcon>
                  <HarmonyIcon name="film" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Videos" />
              </ListItemButton>
              <ListItemButton component="a" href="#">
                <ListItemIcon>
                  <HarmonyIcon name="musical-note" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Audio" />
              </ListItemButton>
            </List>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="No Borders" description="List menu without separators between items.">
          <Box sx={{ maxWidth: 320 }}>
            <List>
              <ListItemButton selected>
                <ListItemIcon>
                  <HarmonyIcon name="home" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HarmonyIcon name="user" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HarmonyIcon name="cog-6-tooth" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HarmonyIcon name="arrow-right-on-rectangle" fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={listProps} />
        <Box sx={{ mt: 3 }}>
          <PropsTable props={listItemButtonProps} />
        </Box>
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Roles" icon="tag">
          List renders as a list container; <code>ListItemButton</code> is an interactive control (button or link via{' '}
          <code>component</code>).
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          <kbd>Tab</kbd> moves between items; <kbd>Enter</kbd>/<kbd>Space</kbd> activate buttons; links follow normal
          link activation.
        </A11yCard>
        <A11yCard title="Selected State" icon="check-circle">
          Use <code>selected</code> for the current page or active destination; announce context via surrounding nav
          landmarks when used for navigation.
        </A11yCard>
        <A11yCard title="Icons" icon="photo">
          Decorative icons sit in <code>ListItemIcon</code>; labels come from <code>ListItemText</code>. Custom images
          should set <code>alt</code> to the item label.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
