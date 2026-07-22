import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';
import { DemoIcon } from './demoIconMap';
import { demoLayoutSx } from './demoLayoutSx';
import { DemoSearch } from './DemoSearch';
import { DEMO_PRODUCTS, demoThemeConfig } from './demoThemeConfig';
import { useDemoPreferences } from './DemoPreferencesProvider';
import { useDemoLayout } from './useDemoLayout';

export function DemoHeader() {
  const { product, mode, setProduct, toggleMode, productName, logoSrc } = useDemoPreferences();
  const { toggleSidebar } = useDemoLayout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <Box component="header" sx={demoLayoutSx.header}>
      <Box sx={demoLayoutSx.headerBrand}>
        <IconButton
          onClick={toggleSidebar}
          aria-label="Open navigation"
          aria-controls="docs-sidebar"
          sx={{ ...demoLayoutSx.iconBtn, display: { xs: 'flex', lg: 'none' } }}
        >
          <DemoIcon name="bars-3" />
        </IconButton>
        <Box component={RouterLink} to="/" sx={demoLayoutSx.headerBrandLink}>
          <Box component="img" src={logoSrc} alt="Logo" sx={demoLayoutSx.headerLogo} />
          <Typography component="h1" sx={demoLayoutSx.headerTitle}>
            Harmony{' '}
            <Box component="span" sx={demoLayoutSx.headerTitleProduct}>
              {productName}
            </Box>{' '}
            <Box component="span" sx={demoLayoutSx.headerTitleSuffix}>
              Design System
            </Box>
          </Typography>
        </Box>
      </Box>

      <Box sx={demoLayoutSx.headerCenter}>
        <DemoSearch />
      </Box>

      <Box sx={demoLayoutSx.headerActions}>
        <Box ref={menuRef} sx={{ position: 'relative' }}>
          <ButtonBase
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            sx={demoLayoutSx.themePickerBtn}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
          >
            <Box sx={demoLayoutSx.themePickerBtnIcon}>
              <DemoIcon name="swatch" />
            </Box>
            <Box component="span" sx={demoLayoutSx.themePickerBtnText}>
              {product.toUpperCase()}
            </Box>
            <Box sx={demoLayoutSx.themePickerBtnChevron}>
              <DemoIcon name="chevron-down" />
            </Box>
          </ButtonBase>
          {menuOpen && (
            <Box sx={demoLayoutSx.themePickerMenu} role="listbox">
              {DEMO_PRODUCTS.map((p) => (
                <ButtonBase
                  key={p}
                  role="option"
                  aria-selected={p === product}
                  onClick={() => {
                    setProduct(p);
                    setMenuOpen(false);
                  }}
                  sx={demoLayoutSx.themePickerOption}
                >
                  <Box component="span" sx={demoLayoutSx.themePickerOptionName}>
                    {demoThemeConfig[p].name}
                  </Box>
                  <Box sx={demoLayoutSx.themePickerOptionSwatch(demoThemeConfig[p].primaryColor)} />
                </ButtonBase>
              ))}
            </Box>
          )}
        </Box>

        <IconButton onClick={toggleMode} aria-label="Toggle color mode" sx={demoLayoutSx.iconBtn}>
          {mode === 'dark' ? <DemoIcon name="sun" /> : <DemoIcon name="moon" />}
        </IconButton>

        <Divider orientation="vertical" flexItem />

        <IconButton
          component="a"
          href="https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          sx={demoLayoutSx.iconBtn}
        >
          <DemoIcon name="brand-github" />
        </IconButton>
      </Box>
    </Box>
  );
}
