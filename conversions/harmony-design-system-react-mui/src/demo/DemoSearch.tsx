import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { DemoIcon } from './demoIconMap';
import { demoLayoutSx } from './demoLayoutSx';
import { searchComponents } from './demoSearchIndex';
import { useDemoPreferences } from './DemoPreferencesProvider';

export function DemoSearch() {
  const { product } = useDemoPreferences();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = searchComponents(query, product).slice(0, 12);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      containerRef.current?.querySelector('input')?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          <DemoIcon name="magnifying-glass" />
        </Box>
        <InputBase
          placeholder="Search components..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          sx={demoLayoutSx.searchInput}
          inputProps={{ 'aria-label': 'Search components' }}
        />
        <Typography
          component="kbd"
          variant="overline"
          color="text.secondary"
          sx={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'background.paper',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
          }}
        >
          ⌘K
        </Typography>
      </Box>
      {open && query.trim() && results.length > 0 && (
        <List sx={demoLayoutSx.searchResults} dense disablePadding>
          {results.map((item) => (
            <ListItemButton
              key={item.href}
              component={RouterLink}
              to={item.href}
              onClick={() => {
                setOpen(false);
                setQuery('');
              }}
            >
              <Box sx={{ mr: 1.5, display: 'flex', color: 'text.secondary' }}>
                <DemoIcon name={item.icon} />
              </Box>
              <ListItemText primary={item.title} secondary={item.section} />
            </ListItemButton>
          ))}
        </List>
      )}
      {open && query.trim() && results.length === 0 && (
        <Box sx={demoLayoutSx.searchResults}>
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            No results for &ldquo;{query}&rdquo;
          </Typography>
        </Box>
      )}
    </Box>
  );
}
