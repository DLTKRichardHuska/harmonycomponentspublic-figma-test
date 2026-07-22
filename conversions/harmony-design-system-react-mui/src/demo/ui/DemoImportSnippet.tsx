import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const PACKAGE_COMPONENTS = '@dltkrichardhuska/harmony-design-system-react-mui/components';

export interface DemoImportSnippetProps {
  /** Named export(s) to import, e.g. `HarmonyIcon` or `DelaButton, type DelaButtonProps`. */
  namedExport: string;
  /** Optional heading above the code block. Defaults to "Import". */
  title?: string;
}

/**
 * Shows the consumer import for a custom package export.
 */
export function DemoImportSnippet({ namedExport, title = 'Import' }: DemoImportSnippetProps) {
  const code = `import { ${namedExport} } from '${PACKAGE_COMPONENTS}';`;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box
        component="pre"
        sx={(theme) => ({
          ...theme.typography.code,
          m: 0,
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.default',
          overflow: 'auto',
          whiteSpace: 'pre',
        })}
      >
        <Box component="code" sx={{ fontFamily: 'inherit' }}>
          {code}
        </Box>
      </Box>
    </Paper>
  );
}
