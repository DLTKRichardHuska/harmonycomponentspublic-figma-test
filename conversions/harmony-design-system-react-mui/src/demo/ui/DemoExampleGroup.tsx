import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface DemoExampleGroupProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

/** Subsection within a component demo Examples block (h3 + optional description + preview frame). */
export function DemoExampleGroup({ title, description, children }: DemoExampleGroupProps) {
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        {description && (
          <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 0.5 }} component="div">
            {description}
          </Typography>
        )}
      </Box>
      <Paper
        variant="outlined"
        sx={{
          // Match reference .example-preview (space-6 / radius-lg), not theme spacing multipliers
          p: '24px',
          bgcolor: 'background.paper',
          borderColor: 'divider',
          borderRadius: '8px',
          overflow: 'visible',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

interface DemoExamplesStackProps {
  children: ReactNode;
}

/** Vertical spacing between example groups inside DemoSection id="examples". */
export function DemoExamplesStack({ children }: DemoExamplesStackProps) {
  return (
    <Stack spacing={2} sx={{ gap: 2 }}>
      {children}
    </Stack>
  );
}
