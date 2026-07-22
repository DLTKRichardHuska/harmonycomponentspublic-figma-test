import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { DemoHeader } from './DemoHeader';
import { DemoSidebar } from './DemoSidebar';
import { demoLayoutSx } from './demoLayoutSx';
import { DemoLayoutProvider, useDemoLayout } from './useDemoLayout';

function DemoShellInner() {
  const { mobileOpen, closeSidebar } = useDemoLayout();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <Box sx={demoLayoutSx.pageWrapper}>
      <DemoHeader />
      <Box
        sx={demoLayoutSx.sidebarBackdrop(mobileOpen)}
        onClick={closeSidebar}
        aria-hidden={!mobileOpen}
      />
      <Box sx={demoLayoutSx.contentWrapper}>
        <DemoSidebar />
        <Box component="main" sx={demoLayoutSx.main}>
          <Box sx={demoLayoutSx.mainInner}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function DemoShell() {
  return (
    <DemoLayoutProvider>
      <DemoShellInner />
    </DemoLayoutProvider>
  );
}
