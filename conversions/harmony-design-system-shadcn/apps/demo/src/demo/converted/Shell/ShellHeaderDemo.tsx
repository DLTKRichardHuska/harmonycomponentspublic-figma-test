import { useEffect } from 'react';
import { ShellHeader } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoExampleGroup, ImportSnippet } from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

export function ShellHeaderDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Shell Header');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Shell Header"
        description="Top brand bar with product name/logo, an optional company picker, and a user avatar. The brand (name + logo) is auto-supplied by the active product — switch products in the top bar to see it change. The bottom gradient bar reflects the selected company color."
      />

      <ImportSnippet
        code={`import { ShellHeader } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

// Brand is auto-supplied by the product build — no productName/logoSrc needed.
// The company list is per-customer: pass the companies the signed-in user can switch between.
const companies = [
  { id: 'northwind', name: 'Northwind Traders', color: '#0F9D58' },
  { id: 'contoso', name: 'Contoso Ltd', color: '#5077FF' },
  { id: 'fabrikam', name: 'Fabrikam Inc', color: '#FF507B' },
];

<ShellHeader
  companies={companies}
  defaultSelectedId="contoso"
  onCompanyChange={(company) => console.log(company.id)}
/>`}
      />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="With company picker"
          description="Brand follows the active product. Click the company name to switch companies; the indicator and gradient update."
        >
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
            <ShellHeader companyName="Acme Corporation" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Custom company list"
          description="The company list varies per customer — pass your own via the companies prop. defaultSelectedId sets the initially selected company (or use selectedId to control it)."
        >
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
            <ShellHeader
              companies={[
                { id: 'northwind', name: 'Northwind Traders', color: '#0F9D58' },
                { id: 'contoso', name: 'Contoso Ltd', color: '#5077FF' },
                { id: 'fabrikam', name: 'Fabrikam Inc', color: '#FF507B' },
              ]}
              defaultSelectedId="contoso"
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Without company picker" description="Brand + avatar only.">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
            <ShellHeader showCompanyPicker={false} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Custom actions"
          description="The actions slot fully replaces the company picker + avatar."
        >
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
            <ShellHeader
              actions={<span className="text-sm text-secondary">Custom actions region</span>}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Brand override"
          description="Pass productName (and optionally logoSrc) to override the product default — e.g. a sub-brand or custom app name. This one stays fixed regardless of the selected product."
        >
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)]">
            <ShellHeader productName="Acme Suite" showCompanyPicker={false} />
          </div>
        </DemoExampleGroup>
      </DemoSection>
    </article>
  );
}
