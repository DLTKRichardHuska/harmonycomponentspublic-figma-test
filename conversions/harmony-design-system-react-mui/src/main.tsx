import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { App } from './pages/App';
import { DemoPreferencesProvider, useDemoPreferences } from './demo/DemoPreferencesProvider';
import { createHarmonyTheme } from './theme';

function ThemedApp() {
  const { product, mode } = useDemoPreferences();
  const theme = useMemo(() => createHarmonyTheme({ product }), [product]);

  return (
    <ThemeProvider theme={theme} defaultMode={mode}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <DemoPreferencesProvider>
          <ThemedApp />
        </DemoPreferencesProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
