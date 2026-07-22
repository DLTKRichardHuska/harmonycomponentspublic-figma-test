import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  changelogVersionSections,
  getCategoryLabel,
  type ChangelogCategory,
} from '../changelogData';
import { demoPageTitle } from '@/demo/demoPageTitle';

const categoryColor: Record<ChangelogCategory, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
  added: 'success',
  changed: 'info',
  deprecated: 'warning',
  removed: 'error',
  fixed: 'success',
  security: 'error',
};

export function ChangelogPage() {
  useEffect(() => {
    document.title = demoPageTitle('Changelog');
  }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 4, mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Changelog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '42rem' }}>
          Release history and in-progress changes for the Harmony Design System reference.
        </Typography>
      </Box>

      {changelogVersionSections.map((section) => (
        <Box key={section.version} sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            {section.label}
          </Typography>
          {section.subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {section.subtitle}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {section.entries.map((entry) => (
              <Card key={entry.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={getCategoryLabel(entry.category)}
                      color={categoryColor[entry.category]}
                      size="small"
                    />
                    {entry.breaking && <Chip label="Breaking" color="error" size="small" variant="outlined" />}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {entry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
