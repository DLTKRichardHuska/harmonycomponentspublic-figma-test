import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/theme/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    '@fontsource/figtree',
    '@fontsource/figtree/*',
    '@fontsource/lexend',
    '@fontsource/lexend/*',
    '@fontsource/jetbrains-mono',
    '@fontsource/jetbrains-mono/*',
  ],
});
