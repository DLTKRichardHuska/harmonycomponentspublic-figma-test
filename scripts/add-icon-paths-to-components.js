#!/usr/bin/env node
/**
 * Add Icon Paths to Component JSON Files
 * 
 * Reads component JSON files and adds iconPath fields for all hardcoded/default icons.
 * This documents where each icon comes from (heroicons or custom SVG).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectIconSource } from './detect-icon-sources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const componentsDir = path.join(rootDir, 'mcp-data', 'components');

/**
 * Component icon mappings - hardcoded/default icons used by each component
 */
const componentIconMappings = {
  'alert.json': {
    defaultIcons: {
      info: 'information-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'exclamation-circle',
    },
    closeIcon: 'x-mark',
  },
  'dialog.json': {
    closeIcon: 'x-mark',
  },
  'dropdown.json': {
    chevronIcon: 'chevron-down',
  },
  'accordion.json': {
    chevronIcon: 'chevron-down',
  },
  'datepicker.json': {
    navIcons: {
      left: 'chevron-left',
      right: 'chevron-right',
    },
  },
  'monthpicker.json': {
    navIcons: {
      left: 'chevron-left',
      right: 'chevron-right',
    },
  },
  'weekpicker.json': {
    navIcons: {
      left: 'chevron-left',
      right: 'chevron-right',
    },
  },
  'timepicker.json': {
    incrementIcons: {
      up: 'chevron-up',
      down: 'chevron-down',
    },
  },
  'numberinput.json': {
    controlIcons: {
      decrement: 'minus',
      increment: 'plus',
    },
  },
  'checkbox.json': {
    checkIcon: 'check',
    validationIcons: {
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    },
  },
  'radiobutton.json': {
    validationIcons: {
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    },
  },
  'step.json': {
    statusIcons: {
      success: 'check',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    },
  },
  'chip.json': {
    dismissIcon: 'x-mark',
  },
  'avatar.json': {
    defaultIcon: 'user', // Always displayed icon (component doesn't support images yet)
  },
  'link.json': {
    externalIcon: 'arrow-top-right-on-square',
  },
  'shellpanel.json': {
    actionIcons: {
      close: 'x-mark',
      maximize: 'arrows-pointing-out',
      minimize: 'arrows-pointing-in',
      external: 'arrow-top-right-on-square',
    },
  },
  'pickerpopup.json': {
    closeIcon: 'x-mark',
  },
  'tabstrip.json': {
    actionIcons: {
      add: 'plus',
      more: 'ellipsis-horizontal',
      external: 'arrow-top-right-on-square',
      close: 'x-mark',
    },
  },
  'floatingnav.json': {
    navIcons: {
      chevron: 'chevron-down',
      refresh: 'arrow-path',
      pin: 'pin',
    },
  },
  'shellheader.json': {
    chevronIcon: 'chevron-down',
  },
  'checkboxgroup.json': {
    validationIcons: {
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    },
  },
  'radiogroup.json': {
    validationIcons: {
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
    },
  },
};

/**
 * Process icon and add path information
 */
function processIcon(iconName) {
  if (!iconName) return null;
  const sourceInfo = detectIconSource(iconName);
  return {
    name: iconName,
    source: sourceInfo.source,
    path: sourceInfo.path,
  };
}

/**
 * Add icon paths to a component JSON file
 */
function addIconPathsToComponent(fileName) {
  const filePath = path.join(componentsDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }

  const iconMapping = componentIconMappings[fileName];
  if (!iconMapping) {
    console.log(`⏭️  No icon mapping for: ${fileName}`);
    return;
  }

  console.log(`\nProcessing ${fileName}...`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);

  // Initialize iconPaths section if it doesn't exist
  if (!data.iconPaths) {
    data.iconPaths = {};
  }

  // Process all icons in the mapping
  const processedIcons = {};

  // Default icons (e.g., Alert variant icons)
  if (iconMapping.defaultIcons) {
    processedIcons.defaultIcons = {};
    for (const [variant, iconName] of Object.entries(iconMapping.defaultIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.defaultIcons[variant] = iconInfo;
      }
    }
  }

  // Single icons
  const singleIconFields = ['closeIcon', 'chevronIcon', 'fallbackIcon', 'externalIcon', 'defaultIcon'];
  for (const field of singleIconFields) {
    if (iconMapping[field]) {
      const iconInfo = processIcon(iconMapping[field]);
      if (iconInfo) {
        processedIcons[field] = iconInfo;
      }
    }
  }

  // Navigation icons
  if (iconMapping.navIcons) {
    processedIcons.navIcons = {};
    for (const [direction, iconName] of Object.entries(iconMapping.navIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.navIcons[direction] = iconInfo;
      }
    }
  }

  // Control icons
  if (iconMapping.controlIcons) {
    processedIcons.controlIcons = {};
    for (const [action, iconName] of Object.entries(iconMapping.controlIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.controlIcons[action] = iconInfo;
      }
    }
  }

  // Increment icons
  if (iconMapping.incrementIcons) {
    processedIcons.incrementIcons = {};
    for (const [direction, iconName] of Object.entries(iconMapping.incrementIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.incrementIcons[direction] = iconInfo;
      }
    }
  }

  // Validation icons
  if (iconMapping.validationIcons) {
    processedIcons.validationIcons = {};
    for (const [type, iconName] of Object.entries(iconMapping.validationIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.validationIcons[type] = iconInfo;
      }
    }
  }

  // Status icons
  if (iconMapping.statusIcons) {
    processedIcons.statusIcons = {};
    for (const [status, iconName] of Object.entries(iconMapping.statusIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.statusIcons[status] = iconInfo;
      }
    }
  }

  // Action icons
  if (iconMapping.actionIcons) {
    processedIcons.actionIcons = {};
    for (const [action, iconName] of Object.entries(iconMapping.actionIcons)) {
      const iconInfo = processIcon(iconName);
      if (iconInfo) {
        processedIcons.actionIcons[action] = iconInfo;
      }
    }
  }

  // Check icon
  if (iconMapping.checkIcon) {
    const iconInfo = processIcon(iconMapping.checkIcon);
    if (iconInfo) {
      processedIcons.checkIcon = iconInfo;
    }
  }

  // Dismiss icon
  if (iconMapping.dismissIcon) {
    const iconInfo = processIcon(iconMapping.dismissIcon);
    if (iconInfo) {
      processedIcons.dismissIcon = iconInfo;
    }
  }

  // Default icon (for Avatar - always displayed, not a fallback)
  if (iconMapping.defaultIcon) {
    const iconInfo = processIcon(iconMapping.defaultIcon);
    if (iconInfo) {
      processedIcons.defaultIcon = iconInfo;
    }
  }

  // Update the data
  data.iconPaths = processedIcons;

  // Add metadata
  if (!data._iconPathMetadata) {
    data._iconPathMetadata = {
      description: "Icon paths document where hardcoded/default icons come from (heroicons or custom SVG)",
      resolutionOrder: ["heroicons", "custom", "unknown"],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`✓ Updated ${fileName} with icon paths`);
}

// Main execution
const componentFiles = Object.keys(componentIconMappings);

console.log(`Processing ${componentFiles.length} component files...\n`);

for (const file of componentFiles) {
  addIconPathsToComponent(file);
}

console.log(`\n✓ All component files updated with icon paths!`);
