#!/usr/bin/env node
/**
 * Track changes between current state and previous snapshot
 * Compares components and tokens to detect additions, removals, and modifications
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// File paths
const componentsFile = path.join(projectRoot, 'src/tokens/components.json');
const colorsFile = path.join(projectRoot, 'src/tokens/colors.json');
const typographyFile = path.join(projectRoot, 'src/tokens/typography.json');
const spacingFile = path.join(projectRoot, 'src/tokens/spacing.json');
const elevationsFile = path.join(projectRoot, 'src/tokens/elevations.json');
const historyFile = path.join(projectRoot, 'src/tokens/changes-history.json');

/**
 * Deep comparison of two objects
 */
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

/**
 * Get differences between two objects
 */
function getDifferences(oldObj, newObj, path = '') {
  const differences = [];
  
  if (oldObj === undefined && newObj !== undefined) {
    return [{ path, type: 'added', oldValue: undefined, newValue: newObj }];
  }
  
  if (oldObj !== undefined && newObj === undefined) {
    return [{ path, type: 'removed', oldValue: oldObj, newValue: undefined }];
  }
  
  if (typeof oldObj !== 'object' || typeof newObj !== 'object' || oldObj === null || newObj === null) {
    if (oldObj !== newObj) {
      return [{ path, type: 'modified', oldValue: oldObj, newValue: newObj }];
    }
    return [];
  }
  
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const oldVal = oldObj[key];
    const newVal = newObj[key];
    
    if (!(key in oldObj)) {
      differences.push({ path: currentPath, type: 'added', oldValue: undefined, newValue: newVal });
    } else if (!(key in newObj)) {
      differences.push({ path: currentPath, type: 'removed', oldValue: oldVal, newValue: undefined });
    } else {
      differences.push(...getDifferences(oldVal, newVal, currentPath));
    }
  }
  
  return differences;
}

/**
 * Load current state
 */
function loadCurrentState() {
  const state = {
    components: {},
    tokens: {
      colors: null,
      typography: null,
      spacing: null,
      elevations: null
    }
  };
  
  try {
    const componentsData = JSON.parse(fs.readFileSync(componentsFile, 'utf-8'));
    state.components = componentsData.components || {};
  } catch (e) {
    console.warn('⚠️  Could not read components.json');
  }
  
  try {
    state.tokens.colors = JSON.parse(fs.readFileSync(colorsFile, 'utf-8'));
  } catch (e) {
    console.warn('⚠️  Could not read colors.json');
  }
  
  try {
    state.tokens.typography = JSON.parse(fs.readFileSync(typographyFile, 'utf-8'));
  } catch (e) {
    console.warn('⚠️  Could not read typography.json');
  }
  
  try {
    state.tokens.spacing = JSON.parse(fs.readFileSync(spacingFile, 'utf-8'));
  } catch (e) {
    console.warn('⚠️  Could not read spacing.json');
  }
  
  try {
    state.tokens.elevations = JSON.parse(fs.readFileSync(elevationsFile, 'utf-8'));
  } catch (e) {
    console.warn('⚠️  Could not read elevations.json');
  }
  
  return state;
}

/**
 * Load previous snapshot
 */
function loadPreviousSnapshot() {
  try {
    if (fs.existsSync(historyFile)) {
      const history = JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
      return history.lastSnapshot || null;
    }
  } catch (e) {
    console.warn('⚠️  Could not read changes-history.json');
  }
  return null;
}

/**
 * Track component changes
 */
function trackComponentChanges(oldComponents, newComponents) {
  const changes = [];
  
  // Find added components
  for (const name of Object.keys(newComponents)) {
    if (!oldComponents || !(name in oldComponents)) {
      changes.push({
        type: 'component',
        category: 'component',
        changeType: 'added',
        name: name,
        details: { component: newComponents[name] }
      });
    }
  }
  
  // Find removed components
  if (oldComponents) {
    for (const name of Object.keys(oldComponents)) {
      if (!(name in newComponents)) {
        changes.push({
          type: 'component',
          category: 'component',
          changeType: 'removed',
          name: name,
          details: { component: oldComponents[name] }
        });
      }
    }
  }
  
  // Find modified components
  if (oldComponents) {
    for (const name of Object.keys(newComponents)) {
      if (name in oldComponents) {
        const oldComp = oldComponents[name];
        const newComp = newComponents[name];
        
        if (!deepEqual(oldComp, newComp)) {
          const differences = getDifferences(oldComp, newComp);
          if (differences.length > 0) {
            changes.push({
              type: 'component',
              category: 'component',
              changeType: 'modified',
              name: name,
              details: { differences, oldComponent: oldComp, newComponent: newComp }
            });
          }
        }
      }
    }
  }
  
  return changes;
}

/**
 * Track token changes
 */
function trackTokenChanges(oldTokens, newTokens, category) {
  const changes = [];
  
  if (!oldTokens && newTokens) {
    // All tokens are new
    changes.push({
      type: 'token',
      category: category,
      changeType: 'added',
      name: `All ${category} tokens`,
      details: { tokens: newTokens }
    });
    return changes;
  }
  
  if (oldTokens && !newTokens) {
    // All tokens removed
    changes.push({
      type: 'token',
      category: category,
      changeType: 'removed',
      name: `All ${category} tokens`,
      details: { tokens: oldTokens }
    });
    return changes;
  }
  
  if (!oldTokens || !newTokens) {
    return changes;
  }
  
  // Compare token structures
  const differences = getDifferences(oldTokens, newTokens);
  
  if (differences.length > 0) {
    // Group differences by top-level key for better readability
    const groupedChanges = {};
    
    for (const diff of differences) {
      const topLevelKey = diff.path.split('.')[0];
      if (!groupedChanges[topLevelKey]) {
        groupedChanges[topLevelKey] = [];
      }
      groupedChanges[topLevelKey].push(diff);
    }
    
    // Create change entries for each top-level token group
    for (const [key, diffs] of Object.entries(groupedChanges)) {
      const hasAdditions = diffs.some(d => d.type === 'added');
      const hasRemovals = diffs.some(d => d.type === 'removed');
      const hasModifications = diffs.some(d => d.type === 'modified');
      
      let changeType = 'modified';
      if (hasAdditions && !hasRemovals && !hasModifications) {
        changeType = 'added';
      } else if (hasRemovals && !hasAdditions && !hasModifications) {
        changeType = 'removed';
      }
      
      changes.push({
        type: 'token',
        category: category,
        changeType: changeType,
        name: `${category} - ${key}`,
        details: { differences: diffs, oldTokens, newTokens }
      });
    }
  }
  
  return changes;
}

/**
 * Main function to track all changes
 */
export function trackChanges() {
  const currentState = loadCurrentState();
  const previousSnapshot = loadPreviousSnapshot();
  
  const allChanges = [];
  
  // Track component changes
  const componentChanges = trackComponentChanges(
    previousSnapshot?.components,
    currentState.components
  );
  allChanges.push(...componentChanges);
  
  // Track token changes
  const colorChanges = trackTokenChanges(
    previousSnapshot?.tokens?.colors,
    currentState.tokens.colors,
    'colors'
  );
  allChanges.push(...colorChanges);
  
  const typographyChanges = trackTokenChanges(
    previousSnapshot?.tokens?.typography,
    currentState.tokens.typography,
    'typography'
  );
  allChanges.push(...typographyChanges);
  
  const spacingChanges = trackTokenChanges(
    previousSnapshot?.tokens?.spacing,
    currentState.tokens.spacing,
    'spacing'
  );
  allChanges.push(...spacingChanges);
  
  const elevationsChanges = trackTokenChanges(
    previousSnapshot?.tokens?.elevations,
    currentState.tokens.elevations,
    'elevations'
  );
  allChanges.push(...elevationsChanges);
  
  return {
    changes: allChanges,
    currentState: currentState
  };
}

// If run directly, test the function
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('track-changes.js')) {
  const result = trackChanges();
  console.log(JSON.stringify(result, null, 2));
}
