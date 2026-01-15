#!/usr/bin/env node
/**
 * Generate human-readable change descriptions from tracked changes
 * Compares current state with previous snapshot and creates designer-friendly descriptions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { trackChanges } from './track-changes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const historyFile = path.join(projectRoot, 'src/tokens/changes-history.json');

/**
 * Extract variant values from union type string
 */
function extractVariants(typeString) {
  if (!typeString || typeof typeString !== 'string') return [];
  
  // Split by | and extract quoted values
  const parts = typeString.split('|');
  const variants = [];
  
  parts.forEach(part => {
    const trimmed = part.trim();
    // Match single-quoted strings
    const singleQuoteMatch = trimmed.match(/'([^']+)'/);
    if (singleQuoteMatch) {
      variants.push(singleQuoteMatch[1]);
    } else {
      // Match double-quoted strings
      const doubleQuoteMatch = trimmed.match(/"([^"]+)"/);
      if (doubleQuoteMatch) {
        variants.push(doubleQuoteMatch[1]);
      }
    }
  });
  
  return variants;
}

/**
 * Extract token information from component tokens structure
 */
function extractTokenInfo(tokens) {
  if (!tokens) return { categories: [], tokenNames: [] };
  
  const categories = [];
  const tokenNames = [];
  
  // Check base tokens
  if (tokens.base) {
    Object.keys(tokens.base).forEach(category => {
      if (tokens.base[category] && Array.isArray(tokens.base[category])) {
        if (!categories.includes(category)) categories.push(category);
        tokens.base[category].forEach(token => {
          if (token && token.cssVar) {
            const name = token.cssVar.replace(/^--/, '');
            if (!tokenNames.includes(name)) tokenNames.push(name);
          }
        });
      }
    });
  }
  
  // Check theme-aware tokens
  if (tokens.themeAware) {
    Object.keys(tokens.themeAware).forEach(category => {
      if (tokens.themeAware[category] && Array.isArray(tokens.themeAware[category])) {
        if (!categories.includes(category)) categories.push(category);
        tokens.themeAware[category].forEach(token => {
          if (token && token.cssVar) {
            const name = token.cssVar.replace(/^--/, '');
            if (!tokenNames.includes(name)) tokenNames.push(name);
          }
        });
      }
    });
  }
  
  return { categories, tokenNames };
}

/**
 * Generate plain English description for component changes
 */
function describeComponentChange(change) {
  const { changeType, name, details } = change;
  
  if (changeType === 'added') {
    const component = details.component;
    const parts = [];
    
    // Extract variants from props
    const variants = [];
    if (component?.props) {
      Object.values(component.props).forEach(prop => {
        if (prop.type) {
          const extracted = extractVariants(prop.type);
          variants.push(...extracted);
        }
      });
    }
    const uniqueVariants = [...new Set(variants)];
    if (uniqueVariants.length > 0) {
      parts.push(`variants: ${uniqueVariants.join(', ')}`);
    }
    
    // List props (excluding generic ones)
    const props = component?.props ? Object.keys(component.props).filter(p => p !== 'class' && p !== 'style' && p !== 'key') : [];
    if (props.length > 0) {
      parts.push(`Props: ${props.join(', ')}`);
    }
    
    // Extract token information
    const tokenInfo = extractTokenInfo(component?.tokens);
    if (tokenInfo.categories.length > 0) {
      const tokenParts = [];
      tokenInfo.categories.forEach(cat => {
        // Show first few token names for each category
        const tokenNames = tokenInfo.tokenNames.slice(0, 5);
        if (tokenNames.length > 0) {
          tokenParts.push(`${cat} (${tokenNames.join(', ')})`);
        } else {
          tokenParts.push(cat);
        }
      });
      parts.push(`Tokens: ${tokenParts.join(', ')}`);
    }
    
    let description = `Added ${name} component`;
    if (parts.length > 0) {
      description += ` with ${parts.join('. ')}`;
    }
    
    return description;
  }
  
  if (changeType === 'removed') {
    return `Removed ${name} component`;
  }
  
  if (changeType === 'modified') {
    const { differences, oldComponent, newComponent } = details;
    const descriptions = [];
    
    // Check for prop changes - only what changed
    const propChanges = differences.filter(d => d.path.startsWith('props.'));
    if (propChanges.length > 0) {
      const addedProps = [];
      const removedProps = [];
      const modifiedProps = [];
      
      propChanges.forEach(diff => {
        const propName = diff.path.split('.').pop();
        if (diff.type === 'added') {
          addedProps.push(propName);
        } else if (diff.type === 'removed') {
          removedProps.push(propName);
        } else if (diff.type === 'modified') {
          modifiedProps.push(propName);
        }
      });
      
      // Check for variant changes in modified props
      const variantChanges = [];
      modifiedProps.forEach(propName => {
        const oldProp = oldComponent?.props?.[propName];
        const newProp = newComponent?.props?.[propName];
        if (oldProp?.type && newProp?.type) {
          const oldVariants = extractVariants(oldProp.type);
          const newVariants = extractVariants(newProp.type);
          const addedVariants = newVariants.filter(v => !oldVariants.includes(v));
          const removedVariants = oldVariants.filter(v => !newVariants.includes(v));
          
          if (addedVariants.length > 0) {
            variantChanges.push(`added variant${addedVariants.length > 1 ? 's' : ''} '${addedVariants.join("', '")}' to '${propName}'`);
          }
          if (removedVariants.length > 0) {
            variantChanges.push(`removed variant${removedVariants.length > 1 ? 's' : ''} '${removedVariants.join("', '")}' from '${propName}'`);
          }
        }
      });
      
      if (variantChanges.length > 0) {
        descriptions.push(...variantChanges);
      }
      
      if (addedProps.length > 0) {
        const propDetails = addedProps.map(prop => {
          const propData = newComponent?.props?.[prop];
          const type = propData?.type || 'unknown';
          return `'${prop}' (${type})`;
        });
        descriptions.push(`added prop${addedProps.length > 1 ? 's' : ''} ${propDetails.join(', ')}`);
      }
      if (removedProps.length > 0) {
        descriptions.push(`removed prop${removedProps.length > 1 ? 's' : ''} '${removedProps.join("', '")}'`);
      }
      if (modifiedProps.length > 0 && variantChanges.length === 0) {
        descriptions.push(`updated prop${modifiedProps.length > 1 ? 's' : ''} '${modifiedProps.join("', '")}'`);
      }
    }
    
    // Check for token changes - be specific
    const tokenChanges = differences.filter(d => d.path.startsWith('tokens.'));
    if (tokenChanges.length > 0) {
      const tokenDescriptions = [];
      tokenChanges.forEach(diff => {
        if (diff.type === 'added') {
          const tokenPath = diff.path.replace('tokens.', '');
          const parts = tokenPath.split('.');
          if (parts.length >= 2) {
            tokenDescriptions.push(`added ${parts[0]} token '${parts[1]}'`);
          }
        } else if (diff.type === 'modified') {
          const tokenPath = diff.path.replace('tokens.', '');
          const parts = tokenPath.split('.');
          if (parts.length >= 2) {
            const oldVal = diff.oldValue;
            const newVal = diff.newValue;
            if (oldVal !== undefined && newVal !== undefined) {
              tokenDescriptions.push(`changed ${parts[0]} token '${parts[1]}' from ${oldVal} to ${newVal}`);
            } else {
              tokenDescriptions.push(`updated ${parts[0]} token '${parts[1]}'`);
            }
          }
        }
      });
      
      if (tokenDescriptions.length > 0) {
        descriptions.push(...tokenDescriptions);
      } else {
        descriptions.push('updated design tokens');
      }
    }
    
    // Check for dependency changes
    const depChanges = differences.filter(d => d.path === 'dependencies' || d.path.startsWith('dependencies.'));
    if (depChanges.length > 0) {
      const addedDeps = depChanges.filter(d => d.type === 'added').map(d => {
        if (d.path === 'dependencies') return d.newValue;
        return d.path.split('.').pop();
      });
      const removedDeps = depChanges.filter(d => d.type === 'removed').map(d => {
        if (d.path === 'dependencies') return d.oldValue;
        return d.path.split('.').pop();
      });
      
      if (addedDeps.length > 0) {
        descriptions.push(`added dependency${addedDeps.length > 1 ? 'ies' : ''} '${addedDeps.join("', '")}'`);
      }
      if (removedDeps.length > 0) {
        descriptions.push(`removed dependency${removedDeps.length > 1 ? 'ies' : ''} '${removedDeps.join("', '")}'`);
      }
    }
    
    if (descriptions.length === 0) {
      return `Updated ${name} component`;
    }
    
    return `Updated ${name} component: ${descriptions.join(', ')}`;
  }
  
  return `Changed ${name} component`;
}

/**
 * Extract token name and value from path and differences
 */
function extractTokenDetails(diff, oldTokens, newTokens) {
  const parts = diff.path.split('.');
  let tokenName = parts[0]; // Usually the top-level token name
  
  // For nested structures, try to get meaningful name
  if (parts.length >= 2) {
    // Check if it's a theme structure (themes.cp.primary.light)
    if (parts[0] === 'themes' && parts.length >= 4) {
      tokenName = `${parts[2]}.${parts[3]}`;
    } else if (parts.length >= 2) {
      tokenName = parts[1];
    }
  }
  
  let oldValue = diff.oldValue;
  let newValue = diff.newValue;
  
  // Try to extract values from token structure
  if (oldValue === undefined && oldTokens) {
    const pathParts = diff.path.split('.');
    let current = oldTokens;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }
    oldValue = current;
  }
  
  if (newValue === undefined && newTokens) {
    const pathParts = diff.path.split('.');
    let current = newTokens;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }
    newValue = current;
  }
  
  return { tokenName, oldValue, newValue };
}

/**
 * Generate plain English description for token changes
 */
function describeTokenChange(change) {
  const { changeType, name, category, details } = change;
  
  if (changeType === 'added') {
    const { tokens } = details;
    const tokenList = [];
    
    // Extract token names and values from the added tokens
    if (tokens && typeof tokens === 'object') {
      if (tokens.themes) {
        // Theme-aware tokens
        Object.keys(tokens.themes).forEach(themeName => {
          const theme = tokens.themes[themeName];
          if (theme.primary) {
            tokenList.push(`'primary' (light: ${theme.primary.light}, dark: ${theme.primary.dark})`);
          }
          if (theme.palette) {
            Object.keys(theme.palette.light || {}).forEach(key => {
              const lightVal = theme.palette.light[key];
              const darkVal = theme.palette.dark?.[key];
              if (darkVal) {
                tokenList.push(`'${key}' (light: ${lightVal}, dark: ${darkVal})`);
              } else {
                tokenList.push(`'${key}' (${lightVal})`);
              }
            });
          }
        });
      } else {
        // Simple token structure
        Object.keys(tokens).forEach(key => {
          const value = tokens[key];
          if (typeof value === 'object' && value !== null) {
            if (value.light && value.dark) {
              tokenList.push(`'${key}' (light: ${value.light}, dark: ${value.dark})`);
            } else if (value.value) {
              tokenList.push(`'${key}' (${value.value})`);
            } else {
              tokenList.push(`'${key}'`);
            }
          } else {
            tokenList.push(`'${key}' (${value})`);
          }
        });
      }
    }
    
    if (tokenList.length > 0) {
      return `Added ${category} tokens: ${tokenList.slice(0, 5).join(', ')}${tokenList.length > 5 ? ` and ${tokenList.length - 5} more` : ''}`;
    }
    
    return `Added new ${category} tokens`;
  }
  
  if (changeType === 'removed') {
    const { tokens } = details;
    const tokenList = [];
    
    // Extract token names from removed tokens
    if (tokens && typeof tokens === 'object') {
      if (tokens.themes) {
        Object.keys(tokens.themes).forEach(themeName => {
          const theme = tokens.themes[themeName];
          if (theme.primary) tokenList.push('primary');
          if (theme.palette) {
            Object.keys(theme.palette.light || {}).forEach(key => {
              tokenList.push(key);
            });
          }
        });
      } else {
        Object.keys(tokens).forEach(key => tokenList.push(key));
      }
    }
    
    if (tokenList.length > 0) {
      return `Removed ${category} tokens: '${tokenList.slice(0, 5).join("', '")}'${tokenList.length > 5 ? ` and ${tokenList.length - 5} more` : ''}`;
    }
    
    return `Removed ${category} tokens`;
  }
  
  if (changeType === 'modified') {
    const { differences, oldTokens, newTokens } = details;
    const addedTokens = [];
    const modifiedTokens = [];
    const removedTokens = [];
    
    // Group differences by type
    differences.forEach(diff => {
      const { tokenName, oldValue, newValue } = extractTokenDetails(diff, oldTokens, newTokens);
      
      if (diff.type === 'added') {
        // Check if this is a completely new token (not just a nested property)
        const pathParts = diff.path.split('.');
        if (pathParts.length <= 2 || (pathParts[0] === 'themes' && pathParts.length <= 4)) {
          addedTokens.push({ name: tokenName, value: newValue });
        }
      } else if (diff.type === 'removed') {
        const pathParts = diff.path.split('.');
        if (pathParts.length <= 2 || (pathParts[0] === 'themes' && pathParts.length <= 4)) {
          removedTokens.push({ name: tokenName, value: oldValue });
        }
      } else if (diff.type === 'modified') {
        // Only track value changes, not structural changes
        if (diff.path.includes('.value') || diff.path.includes('.light') || diff.path.includes('.dark') || diff.path.includes('.pixels')) {
          modifiedTokens.push({ name: tokenName, oldValue, newValue });
        }
      }
    });
    
    const descriptions = [];
    
    // Format added tokens
    if (addedTokens.length > 0) {
      const addedList = addedTokens.slice(0, 3).map(t => {
        if (t.value !== undefined) {
          return `'${t.name}' (${t.value})`;
        }
        return `'${t.name}'`;
      });
      descriptions.push(`added ${addedList.join(', ')}${addedTokens.length > 3 ? ` and ${addedTokens.length - 3} more` : ''}`);
    }
    
    // Format modified tokens with old → new values
    if (modifiedTokens.length > 0) {
      const modifiedList = modifiedTokens.slice(0, 3).map(t => {
        if (t.oldValue !== undefined && t.newValue !== undefined) {
          return `'${t.name}' from ${t.oldValue} to ${t.newValue}`;
        } else if (t.newValue !== undefined) {
          return `'${t.name}' to ${t.newValue}`;
        }
        return `'${t.name}'`;
      });
      descriptions.push(`changed ${modifiedList.join(', ')}${modifiedTokens.length > 3 ? ` and ${modifiedTokens.length - 3} more` : ''}`);
    }
    
    // Format removed tokens
    if (removedTokens.length > 0) {
      const removedList = removedTokens.slice(0, 3).map(t => `'${t.name}'`);
      descriptions.push(`removed ${removedList.join(', ')}${removedTokens.length > 3 ? ` and ${removedTokens.length - 3} more` : ''}`);
    }
    
    if (descriptions.length === 0) {
      return `Updated ${category} tokens`;
    }
    
    return `Updated ${category} tokens: ${descriptions.join(', ')}`;
  }
  
  return `Changed ${category} tokens`;
}

/**
 * Generate human-readable description for a change
 */
function generateDescription(change) {
  if (change.type === 'component') {
    return describeComponentChange(change);
  } else if (change.type === 'token') {
    return describeTokenChange(change);
  }
  return `Changed ${change.name}`;
}

/**
 * Load existing history
 */
function loadHistory() {
  try {
    if (fs.existsSync(historyFile)) {
      return JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
    }
  } catch (e) {
    console.warn('⚠️  Could not read changes-history.json, creating new history');
  }
  
  return {
    lastSnapshot: null,
    changes: []
  };
}

/**
 * Save history
 */
function saveHistory(history) {
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

/**
 * Main function
 */
function generateChanges() {
  console.log('🔄 Tracking changes...');
  
  const result = trackChanges();
  const { changes, currentState } = result;
  
  if (changes.length === 0) {
    console.log('✅ No changes detected');
    // Still update the snapshot even if no changes
    const history = loadHistory();
    history.lastSnapshot = currentState;
    saveHistory(history);
    return;
  }
  
  console.log(`📝 Found ${changes.length} change${changes.length > 1 ? 's' : ''}`);
  
  // Generate descriptions for each change
  const changesWithDescriptions = changes.map(change => ({
    ...change,
    description: generateDescription(change),
    date: new Date().toISOString()
  }));
  
  // Load existing history
  const history = loadHistory();
  
  // Add new changes to history
  history.changes = [
    ...changesWithDescriptions,
    ...history.changes
  ];
  
  // Update snapshot
  history.lastSnapshot = currentState;
  
  // Save history
  saveHistory(history);
  
  console.log('✅ Changes tracked and saved');
  console.log('\n📋 Recent changes:');
  changesWithDescriptions.forEach(change => {
    const icon = change.changeType === 'added' ? '➕' : change.changeType === 'removed' ? '➖' : '🔄';
    console.log(`   ${icon} ${change.description}`);
  });
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('generate-changes.js')) {
  generateChanges();
}

export { generateChanges, generateDescription };
