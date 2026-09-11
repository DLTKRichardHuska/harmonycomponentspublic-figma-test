import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const conversionRoot = resolve(__dirname, '../..');

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5178,
    strictPort: true,
    fs: {
      allow: [conversionRoot],
    },
  },
  preview: {
    port: 5178,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@conversion-manifest': resolve(conversionRoot, 'conversion.manifest.json'),
    },
  },
});
