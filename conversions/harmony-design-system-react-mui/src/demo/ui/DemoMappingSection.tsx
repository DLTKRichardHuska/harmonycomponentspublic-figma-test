import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PropsTable } from './PropsTable';
import type { PropRow } from './types';

interface DemoMappingSectionProps {
  id?: string;
  title?: string;
  rows: PropRow[];
}

export function DemoMappingSection({
  id = 'mapping',
  title = 'Harmony → MUI mapping',
  rows,
}: DemoMappingSectionProps) {
  return (
    <Box id={id} sx={{ mt: 6 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        {title}
      </Typography>
      <PropsTable props={rows} />
    </Box>
  );
}
