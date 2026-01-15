#!/usr/bin/env node
/**
 * Watch mode for automatic change tracking
 * Watches component and token JSON files for changes
 * Automatically tracks changes when files are modified
 */

import { watch } from 'chokidar';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateChanges } from './generate-changes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Files to watch for change tracking
const watchPaths = [
  path.join(projectRoot, 'src/tokens/components.json'),
  path.join(projectRoot, 'src/tokens/colors.json'),
  path.join(projectRoot, 'src/tokens/typography.json'),
  path.join(projectRoot, 'src/tokens/spacing.json'),
  path.join(projectRoot, 'src/tokens/elevations.json')
];

// Debounce timer to avoid multiple tracking calls
let trackTimer = null;
const DEBOUNCE_MS = 500; // Wait 500ms after last change before tracking

function trackChanges() {
  console.log('\n🔄 Tracking changes...');
  try {
    generateChanges();
  } catch (error) {
    console.error('❌ Error tracking changes:', error);
  }
}

function debouncedTrack() {
  if (trackTimer) {
    clearTimeout(trackTimer);
  }
  trackTimer = setTimeout(trackChanges, DEBOUNCE_MS);
}

// Initialize watcher
console.log('👀 Watching for component and token changes...');
watchPaths.forEach(watchPath => {
  const relativePath = watchPath.replace(projectRoot + '/', '');
  console.log(`   - ${relativePath}`);
});
console.log('\n💡 Changes will be tracked automatically when files are modified...\n');

const watcher = watch(watchPaths, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true // Don't trigger on initial scan
});

watcher
  .on('change', (filePath) => {
    const relativePath = filePath.replace(projectRoot + '/', '');
    console.log(`📝 Detected change: ${relativePath}`);
    debouncedTrack();
  })
  .on('add', (filePath) => {
    const relativePath = filePath.replace(projectRoot + '/', '');
    console.log(`➕ Detected new file: ${relativePath}`);
    debouncedTrack();
  })
  .on('unlink', (filePath) => {
    const relativePath = filePath.replace(projectRoot + '/', '');
    console.log(`➖ Detected file removal: ${relativePath}`);
    debouncedTrack();
  })
  .on('error', (error) => {
    console.error('❌ Watcher error:', error);
  });

// Keep process alive
process.on('SIGINT', () => {
  console.log('\n👋 Stopping changelog watcher...');
  watcher.close();
  process.exit(0);
});
