import { useEffect } from 'react';
import {
  Card,
  FloatingNav,
  LeftSidebar,
  RightSidebar,
  ShellFooter,
  ShellHeader,
  ShellLayout,
  ShellPageHeader,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { DemoArticleNav, DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';
import { ShellDemoFrame } from './ShellDemoFrame';

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#composition', label: 'Composition', icon: 'puzzle-piece' },
] as const;

function DemoContent() {
  return (
    <Card className="p-6">
      <h2 className="mb-2 text-xl font-semibold text-foreground">Page Content Area</h2>
      <p className="text-secondary">
        The shell provides the structure; you provide the content. This card lives in the scrollable
        <code> main </code> region.
      </p>
    </Card>
  );
}

export function ShellLayoutDemo() {
  const { product } = useHarmonyTheme();
  const isCp = product === 'cp';

  useEffect(() => {
    document.title = demoPageTitle('Shell Layout');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Shell Layout"
        description="ShellLayout is a thin, prop-driven grid frame. It has no runtime product detection: you compose the pieces you want (a FloatingNav for CP, a ShellFooter for VP/PPM/Maconomy) and the grid adapts to which slots are present. Product identity (brand name, logo, sidebar variant) flows from the theme provider, so the shell pieces need no product props."
      />

      <ImportSnippet
        code={`import {
  ShellLayout,
  ShellHeader,
  LeftSidebar,
  RightSidebar,
  ShellPageHeader,
  ShellFooter,
  FloatingNav,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

// In a single-product build (or under HarmonyThemeProvider) the header brand and
// sidebar variant come from the active product — no productName/logoSrc/variant needed.
<ShellLayout
  productVariant="standard"
  header={<ShellHeader companyName="Acme Corporation" />}
  leftSidebar={<LeftSidebar />}
  rightSidebar={<RightSidebar />}
  footer={<ShellFooter tabs={tabs} />}
>
  <ShellPageHeader title="Projects" />
  {/* page content */}
</ShellLayout>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Full Shell Layout"
          description="Follows the product switcher in the header. CP composes a FloatingNav and omits the footer; VP/PPM/Maconomy compose a ShellFooter and omit the floating nav. The header brand and sidebars come from the active product automatically."
        >
          <ShellDemoFrame>
            <ShellLayout
              productVariant={isCp ? 'cp' : 'standard'}
              header={<ShellHeader companyName="Acme Corporation" />}
              leftSidebar={<LeftSidebar />}
              rightSidebar={<RightSidebar />}
              {...(isCp
                ? { floatingNav: <FloatingNav /> }
                : {
                    footer: (
                      <ShellFooter
                        defaultValue="projects"
                        tabs={[
                          { id: 'projects', label: 'Projects' },
                          { id: 'reports', label: 'Reports' },
                          { id: 'settings', label: 'Settings' },
                        ]}
                      />
                    ),
                  })}
            >
              <ShellPageHeader
                title={isCp ? 'Dashboard' : 'Projects'}
                subtitle={isCp ? undefined : 'All active engagements'}
                primaryButton={
                  isCp ? { text: 'Save', icon: 'check' } : { text: 'New project', icon: 'plus' }
                }
                outlineButtons={isCp ? undefined : [{ text: 'Export' }]}
              />
              <DemoContent />
            </ShellLayout>
          </ShellDemoFrame>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="composition" title="Composition, not theme detection">
        <p className="max-w-3xl text-sm text-secondary">
          The reference Astro shell auto-switched sidebars/footer/floating-nav by reading the{' '}
          <code>theme-*</code> class at runtime. This library never switches products at runtime.
          Product <em>identity</em> (brand name, logo, sidebar variant) is supplied by the theme
          provider — a single-product build bakes it in, and the review demo above derives it from
          the switcher. Product <em>surface</em> is still an explicit composition: the example passes{' '}
          <code>floatingNav</code> and no <code>footer</code> for CP, or <code>footer</code> and no{' '}
          <code>floatingNav</code> for the others. <code>ShellLayout</code> only reads which slots are
          present to lay out the grid.
        </p>
      </DemoSection>
    </article>
  );
}
