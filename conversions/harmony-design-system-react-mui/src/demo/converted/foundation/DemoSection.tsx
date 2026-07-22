import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DemoStatusBadge } from '@/demo/demoStatusBadge';

interface DemoSectionProps {
  id?: string;
  title: string;
  description?: string;
  badge?: string;
  titleVariant?: 'section' | 'label';
  children: ReactNode;
}

export function DemoSection({
  id,
  title,
  description,
  badge,
  titleVariant = 'section',
  children,
}: DemoSectionProps) {
  const isLabel = titleVariant === 'label';

  return (
    <Box component="section" id={id} sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: description ? 1.5 : 2 }}>
        <Typography
          variant={isLabel ? 'overline' : 'h5'}
          component="h2"
          sx={{
            color: isLabel ? 'text.disabled' : 'text.primary',
            fontWeight: isLabel ? 600 : 700,
          }}
        >
          {title}
        </Typography>
        {badge && <DemoStatusBadge>{badge}</DemoStatusBadge>}
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {children}
    </Box>
  );
}
