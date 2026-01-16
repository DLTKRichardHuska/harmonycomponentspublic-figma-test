#!/usr/bin/env node
/**
 * Generate components.json from component-props-inventory.json
 * Uses hash-based change detection to avoid unnecessary regeneration
 * Only regenerates when component files, tokens, CSS, or inventory change
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Paths
const componentsDir = path.join(projectRoot, 'src/components/ui');
const layoutsDir = path.join(projectRoot, 'src/layouts');
const tokensDir = path.join(projectRoot, 'src/tokens');
const stylesDir = path.join(projectRoot, 'src/styles');
const dataDir = path.join(projectRoot, 'src/data');
const inventoryFile = path.join(projectRoot, 'component-props-inventory.json');
const componentsJsonFile = path.join(projectRoot, 'mcp-data/components.json');
const cacheFile = path.join(projectRoot, '.cache/components-regeneration-cache.json');
const themeConfigFile = path.join(projectRoot, 'src/data/theme-config.ts');

// Files to track
const tokenFiles = ['colors.json', 'spacing.json', 'typography.json', 'elevations.json'];
const cssFiles = ['components.css'];

/**
 * Compute hash of file content
 */
function computeFileHash(content) {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

/**
 * Safely hash a file, returning null on error
 */
function safeHashFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return computeFileHash(content);
  } catch (error) {
    console.warn(`⚠️  Failed to hash ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Get all component files
 */
function getComponentFiles() {
  if (!fs.existsSync(componentsDir)) {
    return [];
  }
  return fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.astro'))
    .sort();
}

/**
 * Get all layout files
 */
function getLayoutFiles() {
  if (!fs.existsSync(layoutsDir)) {
    return [];
  }
  return fs.readdirSync(layoutsDir)
    .filter(f => f.endsWith('.astro'))
    .sort();
}

/**
 * Parse Props interface from layout file
 */
function parseLayoutProps(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const interfaceRegex = /interface\s+Props\s*\{([^}]+)\}/s;
    const match = fileContent.match(interfaceRegex);
    
    if (!match) {
      return null;
    }
    
    const propsText = match[1];
    const props = {};
    const propLines = propsText.split('\n').filter(line => line.trim());
    
    for (const line of propLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        continue;
      }
      
      const propMatch = trimmed.match(/^(\w+)(\?)?:\s*([^;]+);?/);
      if (propMatch) {
        const [, propName, optional, propType] = propMatch;
        props[propName] = {
          type: propType.trim(),
          optional: !!optional,
          default: null
        };
      }
    }
    
    // Try to extract default values from destructuring
    const destructureRegex = /const\s*\{([^}]+)\}\s*=\s*Astro\.props/s;
    const destructureMatch = fileContent.match(destructureRegex);
    
    if (destructureMatch) {
      const destructureText = destructureMatch[1];
      const assignments = destructureText.split(',');
      
      for (const assignment of assignments) {
        const defaultMatch = assignment.match(/(\w+)\s*=\s*([^,]+)/);
        if (defaultMatch) {
          const [, propName, defaultValue] = defaultMatch;
          const trimmedPropName = propName.trim();
          const trimmedDefault = defaultValue.trim();
          
          if (props[trimmedPropName]) {
            props[trimmedPropName].default = trimmedDefault;
          }
        }
      }
    }
    
    return props;
  } catch (error) {
    console.warn(`⚠️  Failed to parse layout props from ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Load theme configuration
 */
function loadThemeConfig() {
  if (!fs.existsSync(themeConfigFile)) {
    return null;
  }
  
  try {
    // Read the TypeScript file
    const content = fs.readFileSync(themeConfigFile, 'utf-8');
    
    // Extract theme config data using regex patterns
    // Match each theme block: themeName: { name: '...', fullName: '...', ... }
    const themeConfig = {};
    const themeRegex = /(\w+):\s*\{[\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?fullName:\s*['"]([^'"]+)['"][\s\S]*?primaryColor:\s*['"]([^'"]+)['"][\s\S]*?\}/g;
    
    let match;
    while ((match = themeRegex.exec(content)) !== null) {
      const [, themeId, name, fullName, primaryColor] = match;
      
      // Extract companies if present
      const companiesMatch = content.substring(match.index).match(/companies:\s*\[([\s\S]*?)\]/);
      const companies = [];
      
      if (companiesMatch) {
        const companyRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?gradientColor:\s*['"]([^'"]+)['"]\s*\}/g;
        let companyMatch;
        while ((companyMatch = companyRegex.exec(companiesMatch[1])) !== null) {
          companies.push({
            id: companyMatch[1],
            name: companyMatch[2],
            gradientColor: companyMatch[3]
          });
        }
      }
      
      themeConfig[themeId] = {
        name,
        fullName,
        primaryColor,
        companies: companies.length > 0 ? companies : undefined
      };
    }
    
    return Object.keys(themeConfig).length > 0 ? themeConfig : {
      note: 'Theme config file exists but could not be parsed',
      file: 'src/data/theme-config.ts',
      availableThemes: ['cp', 'vp', 'ppm', 'maconomy']
    };
  } catch (error) {
    console.warn('⚠️  Failed to load theme config:', error.message);
    return {
      note: 'Theme config file exists but could not be loaded',
      file: 'src/data/theme-config.ts',
      availableThemes: ['cp', 'vp', 'ppm', 'maconomy']
    };
  }
}

/**
 * Normalize path for consistent comparison
 */
function normalizePath(filePath) {
  return path.normalize(filePath).replace(/\\/g, '/');
}

/**
 * Load cache from file
 */
function loadCache() {
  if (!fs.existsSync(cacheFile)) {
    return null;
  }
  try {
    const content = fs.readFileSync(cacheFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('⚠️  Failed to load cache, will regenerate:', error.message);
    return null;
  }
}

/**
 * Save cache to file
 */
function saveCache(cache) {
  const cacheDir = path.dirname(cacheFile);
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.warn('⚠️  Failed to save cache:', error.message);
  }
}

/**
 * Check if regeneration is needed
 */
function shouldRegenerate(cache) {
  const changes = {
    componentsAdded: [],
    componentsRemoved: [],
    componentsModified: [],
    layoutsAdded: [],
    layoutsRemoved: [],
    layoutsModified: [],
    tokensChanged: false,
    tokensRemoved: [],
    cssChanged: false,
    inventoryChanged: false,
    themeConfigChanged: false,
    reason: null
  };

  // Initial generation check
  if (!cache || !fs.existsSync(componentsJsonFile)) {
    return { shouldRegenerate: true, changes: { ...changes, reason: 'Initial generation' } };
  }

  // Check component files (added/removed/modified)
  const currentFiles = getComponentFiles();
  const previousFiles = cache.componentFiles || [];
  
  changes.componentsAdded = currentFiles.filter(f => !previousFiles.includes(f));
  changes.componentsRemoved = previousFiles.filter(f => !currentFiles.includes(f));
  
  // Check component modifications (mtime first, then hash if needed)
  for (const file of currentFiles) {
    const filePath = path.join(componentsDir, file);
    try {
      const stats = fs.statSync(filePath);
      const cachedMtime = cache.mtimes?.[file];
      
      // Fast check: compare mtime first
      if (stats.mtimeMs !== cachedMtime) {
        // mtime changed, check hash
        const currentHash = safeHashFile(filePath);
        if (currentHash && currentHash !== cache.hashes?.[file]) {
          changes.componentsModified.push(file);
        }
      }
    } catch (error) {
      // File might have been deleted or is unreadable, treat as changed
      changes.componentsModified.push(file);
    }
  }

  // Check token files
  const previousTokenFiles = Object.keys(cache.tokenHashes || {});
  const missingTokenFiles = previousTokenFiles.filter(f => 
    !fs.existsSync(path.join(tokensDir, f))
  );
  if (missingTokenFiles.length > 0) {
    changes.tokensRemoved = missingTokenFiles;
    changes.tokensChanged = true;
  }

  for (const tokenFile of tokenFiles) {
    const filePath = path.join(tokensDir, tokenFile);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    try {
      const stats = fs.statSync(filePath);
      const cachedMtime = cache.tokenMtimes?.[tokenFile];
      
      if (stats.mtimeMs !== cachedMtime) {
        const currentHash = safeHashFile(filePath);
        if (currentHash && currentHash !== cache.tokenHashes?.[tokenFile]) {
          changes.tokensChanged = true;
        }
      }
    } catch (error) {
      // Treat as changed if we can't read it
      changes.tokensChanged = true;
    }
  }

  // Check CSS files
  for (const cssFile of cssFiles) {
    const filePath = path.join(stylesDir, cssFile);
    if (!fs.existsSync(filePath)) {
      continue;
    }
    try {
      const stats = fs.statSync(filePath);
      const cachedMtime = cache.cssFileMtimes?.[cssFile];
      
      if (stats.mtimeMs !== cachedMtime) {
        const currentHash = safeHashFile(filePath);
        if (currentHash && currentHash !== cache.cssFileHashes?.[cssFile]) {
          changes.cssChanged = true;
        }
      }
    } catch (error) {
      // Treat as changed if we can't read it
      changes.cssChanged = true;
    }
  }

  // Check inventory file
  if (fs.existsSync(inventoryFile)) {
    try {
      const stats = fs.statSync(inventoryFile);
      const cachedMtime = cache.inventoryMtime;
      
      if (stats.mtimeMs !== cachedMtime) {
        const currentHash = safeHashFile(inventoryFile);
        if (currentHash && currentHash !== cache.inventoryHash) {
          changes.inventoryChanged = true;
        }
      }
    } catch (error) {
      // Treat as changed if we can't read it
      changes.inventoryChanged = true;
    }
  } else {
    // Inventory file missing - this is a problem, but we'll try to proceed
    console.warn('⚠️  component-props-inventory.json not found');
    changes.inventoryChanged = true;
  }

  // Check layout files
  const currentLayoutFiles = getLayoutFiles();
  const previousLayoutFiles = cache.layoutFiles || [];
  
  changes.layoutsAdded = currentLayoutFiles.filter(f => !previousLayoutFiles.includes(f));
  changes.layoutsRemoved = previousLayoutFiles.filter(f => !currentLayoutFiles.includes(f));
  
  for (const file of currentLayoutFiles) {
    const filePath = path.join(layoutsDir, file);
    try {
      const stats = fs.statSync(filePath);
      const cachedMtime = cache.layoutMtimes?.[file];
      
      if (stats.mtimeMs !== cachedMtime) {
        const currentHash = safeHashFile(filePath);
        if (currentHash && currentHash !== cache.layoutHashes?.[file]) {
          changes.layoutsModified.push(file);
        }
      }
    } catch (error) {
      changes.layoutsModified.push(file);
    }
  }

  // Check theme config file
  if (fs.existsSync(themeConfigFile)) {
    try {
      const stats = fs.statSync(themeConfigFile);
      const cachedMtime = cache.themeConfigMtime;
      
      if (stats.mtimeMs !== cachedMtime) {
        const currentHash = safeHashFile(themeConfigFile);
        if (currentHash && currentHash !== cache.themeConfigHash) {
          changes.themeConfigChanged = true;
        }
      }
    } catch (error) {
      changes.themeConfigChanged = true;
    }
  }

  const hasChanges = 
    changes.componentsAdded.length > 0 ||
    changes.componentsRemoved.length > 0 ||
    changes.componentsModified.length > 0 ||
    changes.layoutsAdded.length > 0 ||
    changes.layoutsRemoved.length > 0 ||
    changes.layoutsModified.length > 0 ||
    changes.tokensChanged ||
    changes.tokensRemoved.length > 0 ||
    changes.cssChanged ||
    changes.inventoryChanged ||
    changes.themeConfigChanged;

  return { shouldRegenerate: hasChanges, changes };
}

/**
 * Generate components.json from inventory, layouts, and theme config
 */
function generateComponentsJson() {
  if (!fs.existsSync(inventoryFile)) {
    throw new Error(`component-props-inventory.json not found at ${inventoryFile}`);
  }

  const inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'));
  
  // Parse layout files
  const layouts = {};
  const layoutFiles = getLayoutFiles();
  
  for (const file of layoutFiles) {
    const filePath = path.join(layoutsDir, file);
    const layoutName = file.replace('.astro', '');
    const props = parseLayoutProps(filePath);
    
    layouts[layoutName] = {
      filePath: `src/layouts/${file}`,
      hasProps: props !== null,
      props: props || {},
      description: `${layoutName} Layout Component`
    };
  }
  
  // Load theme configuration
  const themeConfig = loadThemeConfig();
  
  // Build the complete JSON structure
  const componentsJson = {
    components: inventory,
    layouts: layouts,
    themeConfig: themeConfig,
    metadata: {
      lightDarkMode: {
        description: 'Light/Dark mode is controlled via CSS classes on the <html> element',
        implementation: {
          darkMode: 'Add "dark" class to <html> element: <html class="dark">',
          lightMode: 'Remove "dark" class or omit it: <html> or <html class="theme-cp">',
          toggle: 'document.documentElement.classList.toggle("dark")',
          persistence: 'Use localStorage to save user preference'
        },
        cssClasses: {
          dark: 'Applied to <html> element to enable dark mode',
          theme: 'Applied as "theme-{name}" where name is cp, vp, ppm, or maconomy'
        },
        examples: [
          '<html class="theme-cp dark">',
          '<html class="theme-vp">',
          '<html class="theme-ppm dark">'
        ]
      },
      themes: {
        available: ['cp', 'vp', 'ppm', 'maconomy'],
        description: 'Each theme has its own color palette and styling. Apply via "theme-{name}" class on <html> element.',
        lightDarkSupport: 'All themes support both light and dark modes via the "dark" class'
      }
    }
  };

  return componentsJson;
}

/**
 * Update cache with current file states
 */
function updateCache() {
  const cache = {
    version: '1.0.0',
    componentFiles: [],
    hashes: {},
    mtimes: {},
    layoutFiles: [],
    layoutHashes: {},
    layoutMtimes: {},
    tokenHashes: {},
    tokenMtimes: {},
    cssFileHashes: {},
    cssFileMtimes: {},
    inventoryHash: null,
    inventoryMtime: null,
    themeConfigHash: null,
    themeConfigMtime: null,
    lastGenerated: new Date().toISOString()
  };

  // Update component files
  const componentFiles = getComponentFiles();
  cache.componentFiles = componentFiles;
  
  for (const file of componentFiles) {
    const filePath = path.join(componentsDir, file);
    try {
      const stats = fs.statSync(filePath);
      cache.mtimes[file] = stats.mtimeMs;
      const hash = safeHashFile(filePath);
      if (hash) {
        cache.hashes[file] = hash;
      }
    } catch (error) {
      // Skip files we can't read
    }
  }

  // Update token files
  for (const tokenFile of tokenFiles) {
    const filePath = path.join(tokensDir, tokenFile);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        cache.tokenMtimes[tokenFile] = stats.mtimeMs;
        const hash = safeHashFile(filePath);
        if (hash) {
          cache.tokenHashes[tokenFile] = hash;
        }
      } catch (error) {
        // Skip files we can't read
      }
    }
  }

  // Update CSS files
  for (const cssFile of cssFiles) {
    const filePath = path.join(stylesDir, cssFile);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        cache.cssFileMtimes[cssFile] = stats.mtimeMs;
        const hash = safeHashFile(filePath);
        if (hash) {
          cache.cssFileHashes[cssFile] = hash;
        }
      } catch (error) {
        // Skip files we can't read
      }
    }
  }

  // Update inventory file
  if (fs.existsSync(inventoryFile)) {
    try {
      const stats = fs.statSync(inventoryFile);
      cache.inventoryMtime = stats.mtimeMs;
      const hash = safeHashFile(inventoryFile);
      if (hash) {
        cache.inventoryHash = hash;
      }
    } catch (error) {
      // Skip if we can't read it
    }
  }

  // Update layout files
  const layoutFiles = getLayoutFiles();
  cache.layoutFiles = layoutFiles;
  
  for (const file of layoutFiles) {
    const filePath = path.join(layoutsDir, file);
    try {
      const stats = fs.statSync(filePath);
      if (!cache.layoutMtimes) cache.layoutMtimes = {};
      if (!cache.layoutHashes) cache.layoutHashes = {};
      cache.layoutMtimes[file] = stats.mtimeMs;
      const hash = safeHashFile(filePath);
      if (hash) {
        cache.layoutHashes[file] = hash;
      }
    } catch (error) {
      // Skip files we can't read
    }
  }

  // Update theme config file
  if (fs.existsSync(themeConfigFile)) {
    try {
      const stats = fs.statSync(themeConfigFile);
      cache.themeConfigMtime = stats.mtimeMs;
      const hash = safeHashFile(themeConfigFile);
      if (hash) {
        cache.themeConfigHash = hash;
      }
    } catch (error) {
      // Skip if we can't read it
    }
  }

  return cache;
}

/**
 * Write components.json atomically
 */
function writeComponentsJson(componentsJson) {
  // Ensure mcp-data directory exists
  const mcpDataDir = path.dirname(componentsJsonFile);
  if (!fs.existsSync(mcpDataDir)) {
    fs.mkdirSync(mcpDataDir, { recursive: true });
  }
  
  // Write to temp file first, then rename (atomic write)
  const tempFile = componentsJsonFile + '.tmp';
  const jsonContent = JSON.stringify(componentsJson, null, 2);
  
  fs.writeFileSync(tempFile, jsonContent, 'utf-8');
  fs.renameSync(tempFile, componentsJsonFile);
}

/**
 * Main function
 */
function main() {
  try {
    // Load cache
    const cache = loadCache();
    
    // Check if regeneration is needed
    const { shouldRegenerate: needsRegeneration, changes } = shouldRegenerate(cache);
    
    if (!needsRegeneration) {
      // No changes detected, skip regeneration
      return;
    }

    // Log what changed (for debugging)
    if (changes.reason) {
      console.log(`📝 ${changes.reason}`);
    } else {
      const changeList = [];
      if (changes.componentsAdded.length > 0) {
        changeList.push(`${changes.componentsAdded.length} component(s) added`);
      }
      if (changes.componentsRemoved.length > 0) {
        changeList.push(`${changes.componentsRemoved.length} component(s) removed`);
      }
      if (changes.componentsModified.length > 0) {
        changeList.push(`${changes.componentsModified.length} component(s) modified`);
      }
      if (changes.tokensChanged) {
        changeList.push('tokens changed');
      }
      if (changes.cssChanged) {
        changeList.push('CSS changed');
      }
      if (changes.inventoryChanged) {
        changeList.push('inventory changed');
      }
      if (changes.layoutsAdded.length > 0 || changes.layoutsRemoved.length > 0 || changes.layoutsModified.length > 0) {
        changeList.push('layouts changed');
      }
      if (changes.themeConfigChanged) {
        changeList.push('theme config changed');
      }
      if (changeList.length > 0) {
        console.log(`📝 Changes detected: ${changeList.join(', ')}`);
      }
    }

    // Generate components.json
    const componentsJson = generateComponentsJson();
    
    // Write atomically
    writeComponentsJson(componentsJson);
    
    // Update cache
    const newCache = updateCache();
    saveCache(newCache);
    
    console.log('✅ components.json generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate components.json:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, shouldRegenerate, generateComponentsJson };
