import { useEffect } from 'react';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoCodeBlock,
  DemoExampleGroup,
  DemoIconGrid,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import {
  customIconCategories,
  iconCategories,
  totalCustomIcons,
  totalHeroIcons,
} from './iconCategories';
import { demoPageTitle } from '../../demoPageTitle';

const sizePx: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const propRows: PropRow[] = [
  {
    name: 'name',
    type: 'string',
    default: '—',
    description: 'Icon name (Heroicons, Tabler, or custom identifier)',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    default: "'md'",
    description: 'Icon size (maps to --icon-* tokens)',
  },
  {
    name: 'variant',
    type: "'outline' | 'solid'",
    default: "'outline'",
    description: 'Icon style variant',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Optional Tailwind / CSS class on the root',
  },
];

export function IconsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Icons');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Icons"
        description="The Harmony Design System uses Heroicons (Outline) as the primary icon library, with Tabler and custom SVGs as fallbacks."
      />

      <ImportSnippet
        code={`import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Icon name="arrow-down" />
<Icon name="check-circle" size="lg" />
<Icon name="home" variant="solid" />`}
      />

      <DemoSection id="props" title="Icon Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="examples" title="Usage" description="Available size variants">
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Icon Sizes</p>
          <div className="flex flex-wrap items-end gap-6">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Icon name="home" size={size} />
                <span className="text-xs text-secondary">
                  {size} ({sizePx[size]}px)
                </span>
              </div>
            ))}
          </div>
        </div>
        <DemoCodeBlock>{`<Icon name="home" size="xs" />
<Icon name="home" size="md" />
<Icon name="home" size="xl" />`}</DemoCodeBlock>
      </DemoSection>

      <DemoSection title="Icon Selection Guide">
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Icon Hierarchy for Application Development</h3>
          <p className="mb-3 text-sm text-secondary">
            When building applications with this design system, follow this priority order:
          </p>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-secondary">
            <li>
              <strong className="text-foreground">Check Heroicons First</strong> — 284 outline icons for
              common UI needs
              <br />
              <code className="text-xs">{`<Icon name="home" />`}</code>
            </li>
            <li>
              <strong className="text-foreground">Use Tabler Icons as Fallback</strong> — 4,600+ icons when
              Heroicons doesn&apos;t have what you need
              <br />
              <code className="text-xs">{`<Icon name="brand-github" />`}</code>
              <br />
              <a
                className="text-xs text-primary underline"
                href="https://tabler.io/icons"
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse Tabler Icons →
              </a>
            </li>
            <li>
              <strong className="text-foreground">Custom Icons for Domain-Specific Needs</strong> — Project
              management, risk management, etc.
              <br />
              <code className="text-xs">{`<Icon name="gantt-chart" />`}</code>
            </li>
          </ol>
          <p className="mt-3 text-sm text-secondary">
            <strong className="text-foreground">Note:</strong> This documentation uses Heroicons and Custom
            icons for consistency. Tabler is available via the same <code>Icon</code> name API when needed.
            Do not remap to Lucide — Harmony names and shapes differ.
          </p>
        </div>

        <DemoExampleGroup title="Heroicons (Primary)" description="Via Icon component">
          <div className="mb-2 flex gap-4">
            <Icon name="home" size="lg" />
            <Icon name="user" size="lg" />
            <Icon name="cog" size="lg" />
          </div>
          <DemoCodeBlock>{`<Icon name="home" />
<Icon name="user" size="md" />`}</DemoCodeBlock>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Tabler Icons (Secondary Fallback)"
          description="Resolved by name through Icon when Heroicons has no match"
        >
          <div className="mb-2 flex items-center gap-4">
            <Icon name="code-bracket" size="sm" />
            <Icon name="database" size="lg" />
            <Icon name="terminal" size="lg" />
          </div>
          <DemoCodeBlock>{`<Icon name="database" />
<Icon name="terminal" />`}</DemoCodeBlock>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Custom Icons (Tertiary)"
          description="Domain-specific project icons from public SVGs"
        >
          <div className="mb-2 flex gap-4">
            <Icon name="gantt-chart" size="lg" />
            <Icon name="Risk Shield" size="lg" />
            <Icon name="dock-center" size="lg" />
          </div>
          <DemoCodeBlock>{`<Icon name="gantt-chart" />
<Icon name="Risk Shield" />`}</DemoCodeBlock>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection
        title="Hero Icons - Outline (24x24)"
        description={`All ${totalHeroIcons} outline icons from heroicons.com.`}
      >
        {Object.entries(iconCategories).map(([category, icons]) => (
          <DemoExampleGroup
            key={category}
            title={category}
            description={`${icons.length} icons`}
          >
            <DemoIconGrid icons={icons} />
          </DemoExampleGroup>
        ))}
      </DemoSection>

      <DemoSection
        title="Custom Icons"
        description={`${totalCustomIcons} domain-specific icons for project management, risk management, and specialized UI features.`}
      >
        {Object.entries(customIconCategories).map(([category, icons]) => (
          <DemoExampleGroup
            key={category}
            title={category}
            description={`${icons.length} icons`}
          >
            <DemoIconGrid icons={icons} />
          </DemoExampleGroup>
        ))}
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard icon="eye" title="Icon Accessibility">
          <p className="mb-3">
            All icons include <code>aria-hidden=&quot;true&quot;</code> by default. When using icons without
            text labels, add an <code>aria-label</code> to the parent button or link for screen reader users.
          </p>
          <DemoCodeBlock>{`<button aria-label="Edit document">
  <Icon name="pencil" />
</button>

<button aria-label="Delete item">
  <Icon name="trash" />
</button>`}</DemoCodeBlock>
        </A11yCard>
      </DemoSection>
    </article>
  );
}
