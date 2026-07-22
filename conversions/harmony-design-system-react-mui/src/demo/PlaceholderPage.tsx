import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { DemoStatusBadge } from './demoStatusBadge';
import { getConversionStatusForScope, type ElementStatus } from './manifestStatus';
import { demoPageTitle } from '@/demo/demoPageTitle';

const REFERENCE_BASE = 'https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test/blob/main';

interface PlaceholderPageProps {
  title: string;
  scope: string;
  referencePath?: string;
}

function statusDescription(status: ElementStatus): string {
  if (status === 'gap') {
    return 'This scope is an accepted gap for this conversion. The demo route exists so navigation matches the reference docs site; full content is deferred by human decision.';
  }
  return 'This scope has not been converted yet. Use the reference Astro documentation while the React + MUI implementation is in progress.';
}

export function PlaceholderPage({ title, scope, referencePath }: PlaceholderPageProps) {
  const conversionStatus = getConversionStatusForScope(scope);
  const docPath = referencePath ?? inferReferencePath(scope, title);

  useEffect(() => {
    document.title = demoPageTitle(title);
  }, [title]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 4, mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography variant="h3" component="h1">
            {title}
          </Typography>
          <DemoStatusBadge badgeVariant={conversionStatus.variant}>{conversionStatus.label}</DemoStatusBadge>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '42rem' }}>
          {statusDescription(conversionStatus.status)}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Manifest scope: <code>{scope}</code>
      </Typography>
      {docPath && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href={`${REFERENCE_BASE}/${docPath}`} target="_blank" rel="noopener noreferrer">
            View reference documentation
          </Link>
        </Typography>
      )}
    </Box>
  );
}

function inferReferencePath(scope: string, title: string): string | undefined {
  const foundationScopes = ['Colors', 'Typography', 'Spacing', 'Elevations', 'Dela'];
  if (foundationScopes.includes(scope)) {
    return `src/pages/foundation/${scope.toLowerCase()}.astro`;
  }
  const shellScopes = [
    'ShellLayout',
    'ShellHeader',
    'ShellFooter',
    'ShellPageHeader',
    'PageContent',
    'LeftSidebar',
    'RightSidebar',
    'ShellPanel',
  ];
  if (shellScopes.includes(scope)) {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    return `src/pages/shell/${slug}.astro`;
  }
  if (scope === 'FloatingNav') return 'src/pages/cp/floating-nav.astro';
  if (scope === 'Kanban') return 'src/pages/components/kanban.astro';
  const kebab = title.toLowerCase().replace(/\s+/g, '-');
  return `src/pages/components/${kebab}.astro`;
}
