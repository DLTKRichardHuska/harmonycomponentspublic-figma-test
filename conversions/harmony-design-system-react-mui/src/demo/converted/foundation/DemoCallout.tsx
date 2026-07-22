import type { ReactNode } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface DemoCalloutProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function DemoCallout({ title, icon, children }: DemoCalloutProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        bgcolor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="subtitle2"
        component="h3"
        sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        {icon}
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" component="div">
        {children}
      </Typography>
    </Paper>
  );
}
