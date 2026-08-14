import { defineConfig } from 'tsup';

/**
 * One-off standalone bundle: inlines all local theme + token code.
 * Leaves @mui/material as external. Does not touch dist/ or fonts.
 */
export default defineConfig({
  entry: {
    createHarmonyTheme: 'src/theme/standalone-entry.ts',
  },
  outDir: 'standalone',
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: false,
  external: [/^@mui\/material(\/|$)/],
});
