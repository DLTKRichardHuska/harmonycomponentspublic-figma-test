import { useEffect } from 'react';
import {
  Icon,
  ListMenu,
  ListMenuButton,
  ListMenuItem,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const listMenuProps: PropRow[] = [
  { name: 'variant', type: "'default' | 'no-borders'", default: "'default'", description: 'Show or hide separators between items' },
  { name: 'children', type: 'node', default: '—', description: 'ListMenuItem rows' },
  { name: '...ul attrs', type: 'HTMLAttributes<ul>', default: '—', description: 'Native ul attributes + ref' },
];

const listMenuButtonProps: PropRow[] = [
  { name: 'isActive', type: 'boolean', default: 'false', description: 'Marks the row as active (data-active for styling)' },
  { name: 'icon', type: 'string', default: '—', description: 'Harmony Icon name rendered before the label' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Render the child (e.g. an <a> or router Link) instead of a button' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button row' },
  { name: '...button attrs', type: 'ButtonHTMLAttributes', default: '—', description: 'onClick and native button attributes + ref' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function ListMenusDemo() {
  useEffect(() => {
    document.title = demoPageTitle('List Menu');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="List Menu"
        description="List menus display a vertical list of interactive items for navigation or selection."
      />

      <ImportSnippet
        code={`import {
  ListMenu,
  ListMenuItem,
  ListMenuButton,
  Icon,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<ListMenu>
  <ListMenuItem>
    <ListMenuButton isActive icon="home">Dashboard</ListMenuButton>
  </ListMenuItem>
  <ListMenuItem>
    <ListMenuButton asChild>
      <a href="/profile">
        <Icon name="user" size="md" />
        <span>Profile</span>
      </a>
    </ListMenuButton>
  </ListMenuItem>
</ListMenu>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic List Menu" description="Standard navigation menu.">
          <div className="max-w-xs">
            <ListMenu>
              <ListMenuItem>
                <ListMenuButton isActive icon="home">
                  Dashboard
                </ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="user">Profile</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="cog-6-tooth">Settings</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="arrow-right-on-rectangle">Logout</ListMenuButton>
              </ListMenuItem>
            </ListMenu>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Without icons"
          description="Menu items can use labels only; icons on each row are optional."
        >
          <div className="max-w-xs">
            <ListMenu>
              <ListMenuItem>
                <ListMenuButton isActive>Overview</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton>Details</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton>History</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton>Export</ListMenuButton>
              </ListMenuItem>
            </ListMenu>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Links" description="Menu as navigation links via asChild + <a>.">
          <div className="max-w-xs">
            <ListMenu>
              <ListMenuItem>
                <ListMenuButton asChild isActive>
                  <a href="#">
                    <Icon name="document" size="md" className="shrink-0 text-white" />
                    <span>Documents</span>
                  </a>
                </ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton asChild>
                  <a href="#">
                    <Icon
                      name="photo"
                      size="md"
                      className="shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--theme-primary)]"
                    />
                    <span>Images</span>
                  </a>
                </ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton asChild>
                  <a href="#">
                    <Icon
                      name="film"
                      size="md"
                      className="shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--theme-primary)]"
                    />
                    <span>Videos</span>
                  </a>
                </ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton asChild>
                  <a href="#">
                    <Icon
                      name="musical-note"
                      size="md"
                      className="shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--theme-primary)]"
                    />
                    <span>Audio</span>
                  </a>
                </ListMenuButton>
              </ListMenuItem>
            </ListMenu>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="No Borders" description="List menu without separators between items.">
          <div className="max-w-xs">
            <ListMenu variant="no-borders">
              <ListMenuItem>
                <ListMenuButton isActive icon="home">
                  Dashboard
                </ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="user">Profile</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="cog-6-tooth">Settings</ListMenuButton>
              </ListMenuItem>
              <ListMenuItem>
                <ListMenuButton icon="arrow-right-on-rectangle">Logout</ListMenuButton>
              </ListMenuItem>
            </ListMenu>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={listMenuProps} />
        <div className="mt-6">
          <PropsTable props={listMenuButtonProps} />
        </div>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Roles" icon="tag">
          <code>ListMenu</code> renders a <code>ul</code> and each <code>ListMenuItem</code> a <code>li</code>;{' '}
          <code>ListMenuButton</code> is an interactive control (a <code>button</code>, or any element via{' '}
          <code>asChild</code>).
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          <kbd>Tab</kbd> moves between rows; <kbd>Enter</kbd>/<kbd>Space</kbd> activate buttons; links follow normal
          link activation.
        </A11yCard>
        <A11yCard title="Active State" icon="check-circle">
          Use <code>isActive</code> for the current page or destination; announce context via surrounding nav
          landmarks when the menu is used for navigation.
        </A11yCard>
        <A11yCard title="Icons" icon="photo">
          Leading icons are decorative. When composing a custom image, set <code>alt</code> to the item label.
        </A11yCard>
      </DemoSection>
    </article>
  );
}
