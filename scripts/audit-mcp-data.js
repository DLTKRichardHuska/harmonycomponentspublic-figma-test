/**
 * MCP Data Audit Script
 * Compares component props and variants with MCP data to identify missing information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseComponent, extractProps } from './astro-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const COMPONENTS_DIR = path.join(rootDir, 'src/components/ui');
const MCP_DATA_DIR = path.join(rootDir, 'mcp-data/components');

/**
 * Extract variant names from a prop type string
 * Handles union types like: 'primary' | 'secondary' | 'tertiary'
 */
function extractVariantNamesFromType(typeString) {
  if (!typeString) return [];
  
  // Match union types: 'value1' | 'value2' | 'value3'
  const unionMatch = typeString.match(/^['"]([^'"]+)['"]\s*\|\s*(.+)$/);
  if (unionMatch) {
    const first = unionMatch[1];
    const rest = unionMatch[2];
    // Recursively extract from the rest
    const restVariants = extractVariantNamesFromType(rest);
    return [first, ...restVariants];
  }
  
  // Single quoted value
  const singleMatch = typeString.match(/^['"]([^'"]+)['"]$/);
  if (singleMatch) {
    return [singleMatch[1]];
  }
  
  return [];
}

/**
 * Get variant prop from component props
 */
function getVariantProp(componentProps) {
  if (!componentProps || typeof componentProps !== 'object') return null;
  
  // Check for variant prop (case-insensitive)
  for (const [propName, propData] of Object.entries(componentProps)) {
    if (propName.toLowerCase() === 'variant') {
      return propData;
    }
  }
  
  return null;
}

/**
 * Load and parse a component file
 */
async function parseComponentFile(componentPath) {
  try {
    const parsed = await parseComponent(componentPath);
    return parsed.props || {};
  } catch (error) {
    console.error(`Error parsing ${componentPath}:`, error.message);
    return {};
  }
}

/**
 * Load MCP data JSON file
 */
function loadMCPData(componentName) {
  const mcpFile = path.join(MCP_DATA_DIR, `${componentName.toLowerCase()}.json`);
  if (!fs.existsSync(mcpFile)) {
    return null;
  }
  
  try {
    return JSON.parse(fs.readFileSync(mcpFile, 'utf-8'));
  } catch (error) {
    console.error(`Error loading MCP data for ${componentName}:`, error.message);
    return null;
  }
}

/**
 * Get variant names from MCP data visual specifications
 */
function getVariantsFromMCPData(mcpData) {
  if (!mcpData || !mcpData.visualSpecifications) return [];
  
  const colors = mcpData.visualSpecifications.colors;
  if (!colors || !colors.variants) return [];
  
  return Object.keys(colors.variants);
}

/**
 * Audit a single component
 */
async function auditComponent(componentPath) {
  const componentName = path.basename(componentPath, '.astro');
  const issues = {
    component: componentName,
    missingVariants: [],
    missingProps: [],
    hasVariantProp: false,
    variantPropType: null,
    variantsInProps: [],
    variantsInMCP: [],
    hasMCPData: false,
  };
  
  // Parse component to get props
  const componentProps = await parseComponentFile(componentPath);
  issues.hasMCPData = true;
  
  // Check for variant prop
  const variantProp = getVariantProp(componentProps);
  if (variantProp) {
    issues.hasVariantProp = true;
    issues.variantPropType = variantProp.type;
    issues.variantsInProps = extractVariantNamesFromType(variantProp.type);
  }
  
  // Load MCP data
  const mcpData = loadMCPData(componentName);
  if (!mcpData) {
    issues.hasMCPData = false;
    return issues;
  }
  
  // Get variants from MCP data
  issues.variantsInMCP = getVariantsFromMCPData(mcpData);
  
  // Compare variants
  if (issues.hasVariantProp && issues.variantsInProps.length > 0) {
    for (const variant of issues.variantsInProps) {
      // Handle special cases like Button's pageHeader variants
      const variantKey = variant;
      const pageHeaderKey = `pageHeader${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
      
      if (!issues.variantsInMCP.includes(variantKey) && 
          !issues.variantsInMCP.includes(pageHeaderKey)) {
        issues.missingVariants.push(variant);
      }
    }
  }
  
  // Check for props in component but not in MCP data
  const mcpProps = mcpData.props || {};
  for (const propName of Object.keys(componentProps)) {
    if (!mcpProps[propName]) {
      issues.missingProps.push(propName);
    }
  }
  
  return issues;
}

/**
 * Generate audit report
 */
function generateReport(allIssues) {
  const report = {
    summary: {
      totalComponents: allIssues.length,
      componentsWithVariantProp: 0,
      componentsWithMissingVariants: 0,
      componentsWithMissingProps: 0,
      totalMissingVariants: 0,
      totalMissingProps: 0,
    },
    details: [],
  };
  
  for (const issues of allIssues) {
    if (issues.hasVariantProp) {
      report.summary.componentsWithVariantProp++;
    }
    
    if (issues.missingVariants.length > 0) {
      report.summary.componentsWithMissingVariants++;
      report.summary.totalMissingVariants += issues.missingVariants.length;
    }
    
    if (issues.missingProps.length > 0) {
      report.summary.componentsWithMissingProps++;
      report.summary.totalMissingProps += issues.missingProps.length;
    }
    
    if (issues.missingVariants.length > 0 || 
        issues.missingProps.length > 0 || 
        !issues.hasMCPData) {
      report.details.push(issues);
    }
  }
  
  return report;
}

/**
 * Main audit function
 */
async function auditMCPData() {
  console.log('🔍 Starting MCP Data Audit...\n');
  
  // Get all component files
  const componentFiles = fs
    .readdirSync(COMPONENTS_DIR)
    .filter((file) => file.endsWith('.astro'))
    .map((file) => path.join(COMPONENTS_DIR, file));
  
  console.log(`Found ${componentFiles.length} components to audit\n`);
  
  // Audit each component
  const allIssues = [];
  for (let i = 0; i < componentFiles.length; i++) {
    const componentPath = componentFiles[i];
    const componentName = path.basename(componentPath, '.astro');
    const progress = `[${i + 1}/${componentFiles.length}]`;
    
    process.stdout.write(`${progress} Auditing ${componentName}...`);
    const issues = await auditComponent(componentPath);
    allIssues.push(issues);
    
    if (issues.missingVariants.length > 0 || issues.missingProps.length > 0) {
      console.log(` ⚠️  Issues found`);
    } else if (!issues.hasMCPData) {
      console.log(` ❌ No MCP data`);
    } else {
      console.log(` ✅ OK`);
    }
  }
  
  // Generate report
  const report = generateReport(allIssues);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Audit Summary');
  console.log('='.repeat(60));
  console.log(`Total Components: ${report.summary.totalComponents}`);
  console.log(`Components with Variant Prop: ${report.summary.componentsWithVariantProp}`);
  console.log(`Components with Missing Variants: ${report.summary.componentsWithMissingVariants}`);
  console.log(`Components with Missing Props: ${report.summary.componentsWithMissingProps}`);
  console.log(`Total Missing Variants: ${report.summary.totalMissingVariants}`);
  console.log(`Total Missing Props: ${report.summary.totalMissingProps}`);
  
  // Print details
  if (report.details.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('📋 Detailed Issues');
    console.log('='.repeat(60));
    
    for (const issue of report.details) {
      console.log(`\n${issue.component}:`);
      
      if (!issue.hasMCPData) {
        console.log('  ❌ No MCP data file found');
      }
      
      if (issue.missingVariants.length > 0) {
        console.log(`  ⚠️  Missing Variants (${issue.missingVariants.length}):`);
        console.log(`     Props: ${issue.variantsInProps.join(', ')}`);
        console.log(`     MCP: ${issue.variantsInMCP.join(', ')}`);
        console.log(`     Missing: ${issue.missingVariants.join(', ')}`);
      }
      
      if (issue.missingProps.length > 0) {
        console.log(`  ⚠️  Missing Props (${issue.missingProps.length}): ${issue.missingProps.join(', ')}`);
      }
    }
  } else {
    console.log('\n✅ No issues found! All components have complete data.');
  }
  
  // Save report to file
  const reportFile = path.join(rootDir, 'mcp-audit-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📄 Full report saved to: ${reportFile}`);
  
  return report;
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  auditMCPData().catch(console.error);
}

export { auditMCPData, auditComponent, extractVariantNamesFromType };
