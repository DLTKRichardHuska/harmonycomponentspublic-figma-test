import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HarmonyThemeProvider } from '@dltkrichardhuska/harmony-design-system-shadcn';
import '@dltkrichardhuska/harmony-design-system-shadcn/styles/globals.css';
import { App } from './pages/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HarmonyThemeProvider defaultProduct="cp" defaultMode="light">
        <App />
      </HarmonyThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
