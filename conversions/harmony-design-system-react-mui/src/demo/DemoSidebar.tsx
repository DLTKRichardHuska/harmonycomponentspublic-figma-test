import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { DemoIcon } from './demoIconMap';
import { demoLayoutSx } from './demoLayoutSx';
import {
  demoNavigation,
  isNavItemActive,
  navSectionCount,
  resolveKanbanHref,
} from './demoNavigation';
import { demoThemeConfig } from './demoThemeConfig';
import { useDemoPreferences } from './DemoPreferencesProvider';
import { useDemoLayout } from './useDemoLayout';
import { getCoveragePercent, getReferenceVersion } from './manifestStatus';

export function DemoSidebar() {
  const location = useLocation();
  const { product } = useDemoPreferences();
  const { mobileOpen, closeSidebar, isMobile } = useDemoLayout();
  const themeConfig = demoThemeConfig[product];
  const coverage = getCoveragePercent();
  const version = getReferenceVersion();

  const resolveHref = (href: string) => {
    if (href === '/components/kanban') return resolveKanbanHref(product);
    return href;
  };

  return (
    <>
      <Box
        id="docs-sidebar"
        component="aside"
        sx={demoLayoutSx.sidebar(mobileOpen)}
        aria-label="Documentation navigation"
      >
        <Box sx={demoLayoutSx.sidebarHeader}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={demoLayoutSx.sidebarLabel}>Navigation</Typography>
            <IconButton
              onClick={closeSidebar}
              aria-label="Close navigation"
              sx={{ ...demoLayoutSx.iconBtn, display: { xs: 'flex', lg: 'none' } }}
            >
              <DemoIcon name="x-mark" />
            </IconButton>
          </Box>
          <Box sx={demoLayoutSx.sidebarStats}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>
              <DemoIcon name="squares-plus" />
            </Box>
            {navSectionCount} Sections
          </Box>
        </Box>

        <Box component="nav" sx={demoLayoutSx.nav}>
            {demoNavigation.map((section) => (
              <Box key={section.title}>
                <Typography sx={demoLayoutSx.navSectionTitle}>{section.title}</Typography>
                {section.items.map((item) => {
                  const href = resolveHref(item.href);
                  const active = isNavItemActive(item.href, location.pathname);
                  return (
                    <Box
                      key={item.href}
                      component={RouterLink}
                      to={href}
                      onClick={() => {
                        if (isMobile) closeSidebar();
                      }}
                      sx={demoLayoutSx.navItem(active)}
                    >
                      <Box className="nav-item-icon" sx={{ display: 'flex' }}>
                        <DemoIcon name={item.icon} />
                      </Box>
                      {item.title}
                    </Box>
                  );
                })}
              </Box>
            ))}

            {themeConfig.components.length > 0 && (
              <Box>
                <Typography sx={demoLayoutSx.navSectionTitle}>
                  {themeConfig.name} Components
                </Typography>
                {themeConfig.components.map((item) => {
                  const active = isNavItemActive(item.href, location.pathname);
                  return (
                    <Box
                      key={item.href}
                      component={RouterLink}
                      to={item.href}
                      onClick={() => {
                        if (isMobile) closeSidebar();
                      }}
                      sx={demoLayoutSx.navItem(active)}
                    >
                      <Box className="nav-item-icon" sx={{ display: 'flex' }}>
                        <DemoIcon name={item.icon} />
                      </Box>
                      {item.title}
                    </Box>
                  );
                })}
              </Box>
            )}
        </Box>

        <Box sx={demoLayoutSx.sidebarFooter}>
          <Typography sx={demoLayoutSx.sidebarVersion}>v{version}</Typography>
          <Box sx={demoLayoutSx.sidebarProgress}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="overline" color="text.secondary">
                Coverage
              </Typography>
              <Typography variant="overline" color="text.primary">
                {coverage}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={coverage} sx={{ height: 4, borderRadius: 2 }} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
