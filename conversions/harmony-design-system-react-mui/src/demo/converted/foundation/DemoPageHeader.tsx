import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { DemoStatusBadge } from '@/demo/demoStatusBadge';
import { findRoute, type DemoRouteKind } from '@/demo/demoAppRoutes';
import { getConversionStatusForScope } from '@/demo/manifestStatus';

const STATUS_ROUTE_KINDS = new Set<DemoRouteKind>(['foundation', 'component', 'shell', 'theme']);

interface DemoPageHeaderProps {
  title: string;
  description: ReactNode;
  /** Manifest element key; when omitted, resolved from the current route. */
  scope?: string;
  children?: ReactNode;
}

export function DemoPageHeader({ title, description, scope: scopeProp, children }: DemoPageHeaderProps) {
  const { pathname } = useLocation();
  const route = findRoute(pathname);
  const scope = scopeProp ?? route?.scope;
  const showStatus = Boolean(scope && route && STATUS_ROUTE_KINDS.has(route.kind));
  const conversionStatus = showStatus && scope ? getConversionStatusForScope(scope) : null;

  return (
    <Box component="header" sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: conversionStatus ? 2 : 0 }}>
        <Typography variant="h3" component="h1">
          {title}
        </Typography>
        {conversionStatus && (
          <DemoStatusBadge badgeVariant={conversionStatus.variant}>{conversionStatus.label}</DemoStatusBadge>
        )}
      </Box>
      <Typography
        variant="body1"
        color="textSecondary"
        component="div"
        sx={{ maxWidth: '42rem', mt: conversionStatus ? 0 : 1.5 }}
      >
        {description}
      </Typography>
      {children}
    </Box>
  );
}
