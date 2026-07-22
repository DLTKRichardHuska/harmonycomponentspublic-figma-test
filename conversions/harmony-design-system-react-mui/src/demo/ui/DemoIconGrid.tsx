import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';

const iconGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(4, 1fr)',
    sm: 'repeat(6, 1fr)',
    md: 'repeat(8, 1fr)',
    lg: 'repeat(10, 1fr)',
  },
  gap: 0.5,
} as const;

interface DemoIconGridProps {
  icons: readonly string[];
}

/** Catalog grid for icon reference pages — demo-site doc scaffolding only. */
export function DemoIconGrid({ icons }: DemoIconGridProps) {
  return (
    <Box sx={iconGridSx}>
      {icons.map((icon) => (
        <Box
          key={icon}
          title={icon}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            p: 1,
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'background-color 0.15s',
            '&:hover': {
              bgcolor: 'action.hover',
              '& .icon-cell': { color: 'primary.main' },
            },
          }}
        >
          <Box className="icon-cell" sx={{ color: 'text.secondary', transition: 'color 0.15s' }}>
            <HarmonyIcon name={icon} size="lg" />
          </Box>
          <Typography
            variant="overline"
            color="text.disabled"
            sx={{ textAlign: 'center', width: '100%' }}
            noWrap
          >
            {icon}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
