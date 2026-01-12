#!/usr/bin/env node
/**
 * Apply color contrast fixes to colors.json
 * Only applies fixes that work for all failure cases
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const colorsPath = path.join(__dirname, '../src/tokens/colors.json');
const fixesPath = path.join(__dirname, '../color-contrast-fixes.json');
const backupPath = path.join(__dirname, '../src/tokens/colors.json.backup');

// Parse path like "themes.cp.palette.light.mutedText" and set value
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Get nested value
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

console.log('🔧 Applying Color Contrast Fixes...\n');

try {
  // Read current colors
  const colorsData = fs.readFileSync(colorsPath, 'utf-8');
  const colors = JSON.parse(colorsData);
  
  // Create backup
  console.log('💾 Creating backup...');
  fs.writeFileSync(backupPath, colorsData, 'utf-8');
  console.log(`   Backup saved to: ${backupPath}\n`);
  
  // Read fixes
  if (!fs.existsSync(fixesPath)) {
    console.error('❌ Fix report not found. Run fix-color-contrast.js first.');
    process.exit(1);
  }
  
  const fixesData = fs.readFileSync(fixesPath, 'utf-8');
  const fixesReport = JSON.parse(fixesData);
  
  // Filter to only fixes that work for all cases
  const safeFixes = fixesReport.fixes.filter(fix => fix.fixesAllFailures);
  
  console.log(`📊 Found ${safeFixes.length} safe fixes (out of ${fixesReport.fixes.length} total)\n`);
  
  if (safeFixes.length === 0) {
    console.log('⚠️  No safe fixes to apply. All fixes need manual review.');
    process.exit(0);
  }
  
  // Apply fixes
  const applied = [];
  const skipped = [];
  
  safeFixes.forEach(fix => {
    const currentValue = getNestedValue(colors, fix.path);
    
    if (!currentValue) {
      skipped.push({ fix, reason: 'Path not found' });
      return;
    }
    
    if (currentValue === fix.suggestedValue) {
      skipped.push({ fix, reason: 'Already applied' });
      return;
    }
    
    // Apply the fix
    setNestedValue(colors, fix.path, fix.suggestedValue);
    applied.push({
      path: fix.path,
      oldValue: currentValue,
      newValue: fix.suggestedValue,
      token: fix.token,
      theme: fix.theme,
      mode: fix.mode
    });
  });
  
  // Write updated colors
  if (applied.length > 0) {
    console.log(`✅ Applying ${applied.length} fixes...\n`);
    
    applied.forEach(({ path, oldValue, newValue, token, theme, mode }) => {
      console.log(`   ${path}:`);
      console.log(`     ${oldValue} → ${newValue}`);
    });
    
    fs.writeFileSync(colorsPath, JSON.stringify(colors, null, 2) + '\n', 'utf-8');
    
    console.log(`\n✅ Applied ${applied.length} fixes to ${colorsPath}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review the changes`);
    console.log(`   2. Update CSS variables in tokens.css if needed`);
    console.log(`   3. Run audit again to verify fixes`);
    console.log(`   4. If needed, manually review and apply remaining ${fixesReport.fixes.length - safeFixes.length} fixes`);
    
    if (skipped.length > 0) {
      console.log(`\n⚠️  Skipped ${skipped.length} fixes:`);
      skipped.forEach(({ fix, reason }) => {
        console.log(`   ${fix.path}: ${reason}`);
      });
    }
  } else {
    console.log('ℹ️  No fixes to apply (all already applied or paths not found)');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\n💡 If something went wrong, restore from backup:');
  console.error(`   cp ${backupPath} ${colorsPath}`);
  process.exit(1);
}
