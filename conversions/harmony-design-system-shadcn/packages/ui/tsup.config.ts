import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/theme/index.tsx', 'src/lib/utils.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  external: ['react', 'react-dom', 'clsx', 'tailwind-merge', 'class-variance-authority'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
