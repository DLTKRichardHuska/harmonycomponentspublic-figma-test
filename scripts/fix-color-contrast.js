#!/usr/bin/env node
/**
 * Calculate color adjustments needed to fix WCAG contrast failures
 * Generates suggested color values that meet contrast requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const colorsPath = path.join(__dirname, '../src/tokens/colors.json');
const outputPath = path.join(__dirname, '../color-contrast-fixes.json');

// WCAG 2.1 contrast requirements
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;
const WCAG_AA_UI = 3.0;

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

/**
 * Calculate relative luminance according to WCAG 2.1
 */
function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const normalize = (val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const r = normalize(rgb.r);
  const g = normalize(rgb.g);
  const b = normalize(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1, color2) {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate required luminance for a color to achieve target contrast ratio
 * @param {string} otherColor - The other color in the pair
 * @param {number} targetRatio - Target contrast ratio (e.g., 4.5)
 * @param {boolean} isForeground - If true, calculating foreground; if false, calculating background
 * @returns {number} Required relative luminance
 */
function calculateRequiredLuminance(otherColor, targetRatio, isForeground) {
  const otherLum = getRelativeLuminance(otherColor);
  
  if (isForeground) {
    // We need foreground to be darker or lighter than background
    // If background is light, foreground needs to be dark
    if (otherLum > 0.5) {
      // Background is light, need dark foreground
      // (L_light + 0.05) / (L_dark + 0.05) = ratio
      // L_dark = (L_light + 0.05) / ratio - 0.05
      return (otherLum + 0.05) / targetRatio - 0.05;
    } else {
      // Background is dark, need light foreground
      // (L_light + 0.05) / (L_dark + 0.05) = ratio
      // L_light = ratio * (L_dark + 0.05) - 0.05
      return targetRatio * (otherLum + 0.05) - 0.05;
    }
  } else {
    // Calculating background
    if (otherLum > 0.5) {
      // Foreground is light, need dark background
      return (otherLum + 0.05) / targetRatio - 0.05;
    } else {
      // Foreground is dark, need light background
      return targetRatio * (otherLum + 0.05) - 0.05;
    }
  }
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 1/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Adjust color lightness to achieve target luminance while preserving hue
 */
function adjustColorLightness(color, targetLum) {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const currentLum = getRelativeLuminance(color);
  
  // Binary search for the right lightness value
  let minLightness = 0;
  let maxLightness = 100;
  let bestLightness = hsl.l;
  let bestDiff = Infinity;
  
  // Try different lightness values
  for (let i = 0; i < 100; i++) {
    const testLightness = minLightness + (maxLightness - minLightness) / 2;
    const testRgb = hslToRgb(hsl.h, hsl.s, testLightness);
    const testHex = rgbToHex(testRgb.r, testRgb.g, testRgb.b);
    const testLum = getRelativeLuminance(testHex);
    const diff = Math.abs(testLum - targetLum);
    
    if (diff < bestDiff) {
      bestDiff = diff;
      bestLightness = testLightness;
    }
    
    if (diff < 0.001) {
      return testHex;
    }
    
    if (testLum < targetLum) {
      minLightness = testLightness;
    } else {
      maxLightness = testLightness;
    }
  }
  
  const finalRgb = hslToRgb(hsl.h, hsl.s, bestLightness);
  return rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
}

/**
 * Find a color that meets contrast requirements while preserving hue
 * @param {string} currentColor - Current color value
 * @param {string} otherColor - The other color in the pair
 * @param {number} targetRatio - Target contrast ratio
 * @param {boolean} adjustForeground - If true, adjust foreground; if false, adjust background
 * @returns {string} Suggested color hex value
 */
function findContrastingColor(currentColor, otherColor, targetRatio, adjustForeground = true) {
  const requiredLum = calculateRequiredLuminance(otherColor, targetRatio, adjustForeground);
  
  // Clamp luminance to valid range
  const clampedLum = Math.max(0, Math.min(1, requiredLum));
  
  // Adjust the current color's lightness to achieve target luminance while preserving hue
  let suggestedColor = adjustColorLightness(currentColor, clampedLum);
  
  // Verify it meets the requirement
  const ratio = adjustForeground 
    ? getContrastRatio(suggestedColor, otherColor)
    : getContrastRatio(otherColor, suggestedColor);
  
  // If still doesn't meet requirement, adjust more aggressively
  if (ratio < targetRatio) {
    const currentLum = getRelativeLuminance(suggestedColor);
    const otherLum = getRelativeLuminance(otherColor);
    const isDark = clampedLum < 0.5;
    
    // Calculate how much more we need to adjust
    const neededRatio = targetRatio / ratio;
    let newTargetLum;
    
    if (isDark) {
      // Need darker color
      newTargetLum = Math.max(0, clampedLum * (1 / neededRatio));
    } else {
      // Need lighter color
      newTargetLum = Math.min(1, clampedLum * neededRatio);
    }
    
    suggestedColor = adjustColorLightness(currentColor, newTargetLum);
  }
  
  return suggestedColor;
}

/**
 * Analyze failures and group by color token
 */
function analyzeFailures(colors) {
  const failures = [];
  
  // Import the audit functions (simplified version)
  const themes = ['cp', 'vp', 'ppm', 'maconomy'];
  const modes = ['light', 'dark'];
  const textColors = ['titleText', 'secondaryText', 'mutedText'];
  const backgroundColors = ['pageBackground', 'cardBackground', 'navBackground', 'inputBackground', 'inputDisabled', 'tableTotal', 'hover'];
  
  // Test text on backgrounds
  themes.forEach(theme => {
    modes.forEach(mode => {
      const palette = colors.themes[theme]?.palette?.[mode];
      if (!palette) return;
      
      textColors.forEach(textKey => {
        const textColor = palette[textKey];
        if (!textColor) return;
        
        backgroundColors.forEach(bgKey => {
          const bgColor = palette[bgKey];
          if (!bgColor) return;
          
          const ratio = getContrastRatio(textColor, bgColor);
          if (ratio < WCAG_AA_NORMAL) {
            failures.push({
              category: 'text-on-background',
              theme,
              mode,
              foregroundKey: textKey,
              backgroundKey: bgKey,
              foreground: textColor,
              background: bgColor,
              currentRatio: ratio,
              requiredRatio: WCAG_AA_NORMAL,
              context: `${textKey} on ${bgKey}`
            });
          }
        });
      });
    });
  });
  
  // Test links
  themes.forEach(theme => {
    modes.forEach(mode => {
      const palette = colors.themes[theme]?.palette?.[mode];
      if (!palette) return;
      
      const linkColor = palette.link;
      if (!linkColor) return;
      
      backgroundColors.forEach(bgKey => {
        const bgColor = palette[bgKey];
        if (!bgColor) return;
        
        const ratio = getContrastRatio(linkColor, bgColor);
        if (ratio < WCAG_AA_NORMAL) {
          failures.push({
            category: 'link-on-background',
            theme,
            mode,
            foregroundKey: 'link',
            backgroundKey: bgKey,
            foreground: linkColor,
            background: bgColor,
            currentRatio: ratio,
            requiredRatio: WCAG_AA_NORMAL,
            context: `link on ${bgKey}`
          });
        }
      });
    });
  });
  
  return failures;
}

/**
 * Group failures by color token and calculate fixes
 */
function calculateFixes(failures, colors) {
  const fixesByToken = new Map();
  
  // Group failures by the color token that needs fixing
  failures.forEach(failure => {
    const tokenKey = failure.foregroundKey;
    const theme = failure.theme;
    const mode = failure.mode;
    
    const key = `${theme}.${mode}.${tokenKey}`;
    
    if (!fixesByToken.has(key)) {
      fixesByToken.set(key, {
        theme,
        mode,
        tokenKey,
        currentValue: colors.themes[theme]?.palette?.[mode]?.[tokenKey],
        failures: [],
        suggestedValue: null,
        worstRatio: Infinity
      });
    }
    
    const fix = fixesByToken.get(key);
    fix.failures.push(failure);
    fix.worstRatio = Math.min(fix.worstRatio, failure.currentRatio);
  });
  
  // Calculate suggested values for each token
  fixesByToken.forEach((fix, key) => {
    const requiredRatio = fix.failures[0]?.requiredRatio || WCAG_AA_NORMAL;
    fix.requiredRatio = requiredRatio;
    
    // Find the background that requires the most extreme color adjustment
    // For light backgrounds, we need darker text; for dark backgrounds, we need lighter text
    let mostExtremeBg = null;
    let mostExtremeLum = null;
    
    fix.failures.forEach(failure => {
      const bgLum = getRelativeLuminance(failure.background);
      const requiredLum = calculateRequiredLuminance(failure.background, requiredRatio, true);
      
      if (mostExtremeLum === null) {
        mostExtremeLum = requiredLum;
        mostExtremeBg = failure.background;
      } else {
        // For light mode (light backgrounds), we need the darkest required luminance
        // For dark mode (dark backgrounds), we need the lightest required luminance
        const currentBgLum = getRelativeLuminance(mostExtremeBg);
        const isLightMode = bgLum > 0.5;
        const isCurrentLightMode = currentBgLum > 0.5;
        
        if (isLightMode && isCurrentLightMode) {
          // Both light - need darker (lower luminance)
          if (requiredLum < mostExtremeLum) {
            mostExtremeLum = requiredLum;
            mostExtremeBg = failure.background;
          }
        } else if (!isLightMode && !isCurrentLightMode) {
          // Both dark - need lighter (higher luminance)
          if (requiredLum > mostExtremeLum) {
            mostExtremeLum = requiredLum;
            mostExtremeBg = failure.background;
          }
        }
      }
    });
    
    // Calculate suggested color based on the most extreme case
    const suggested = findContrastingColor(
      fix.currentValue,
      mostExtremeBg,
      requiredRatio,
      true // Adjust foreground
    );
    
    fix.suggestedValue = suggested;
    
    // Verify the fix works for all failures with a small margin
    fix.fixesAll = fix.failures.every(f => {
      const newRatio = getContrastRatio(suggested, f.background);
      return newRatio >= requiredRatio - 0.01; // Small margin for floating point
    });
    
    // If it doesn't fix all, try a more aggressive adjustment
    if (!fix.fixesAll) {
      // Find the background that still fails
      const failingBg = fix.failures.find(f => {
        const newRatio = getContrastRatio(suggested, f.background);
        return newRatio < requiredRatio - 0.01;
      });
      
      if (failingBg) {
        // Recalculate with a slightly higher target ratio to ensure margin
        const moreAggressive = findContrastingColor(
          fix.currentValue,
          failingBg.background,
          requiredRatio * 1.05, // 5% margin
          true
        );
        
        // Verify this works for all
        const worksForAll = fix.failures.every(f => {
          const newRatio = getContrastRatio(moreAggressive, f.background);
          return newRatio >= requiredRatio - 0.01;
        });
        
        if (worksForAll) {
          fix.suggestedValue = moreAggressive;
          fix.fixesAll = true;
        }
      }
    }
  });
  
  return Array.from(fixesByToken.values());
}

/**
 * Generate fix report
 */
function generateFixReport(fixes) {
  const report = {
    summary: {
      totalFixes: fixes.length,
      fixesThatWorkForAll: fixes.filter(f => f.fixesAll).length,
      fixesNeedingReview: fixes.filter(f => !f.fixesAll).length
    },
    fixes: fixes.map(fix => ({
      path: `themes.${fix.theme}.palette.${fix.mode}.${fix.tokenKey}`,
      theme: fix.theme,
      mode: fix.mode,
      token: fix.tokenKey,
      currentValue: fix.currentValue,
      suggestedValue: fix.suggestedValue,
      currentRatio: fix.worstRatio.toFixed(2),
      requiredRatio: fix.requiredRatio,
      fixesAllFailures: fix.fixesAll,
      affectedFailures: fix.failures.length,
      failures: fix.failures.map(f => ({
        context: f.context,
        background: f.background,
        currentRatio: f.currentRatio.toFixed(2),
        newRatio: getContrastRatio(fix.suggestedValue, f.background).toFixed(2)
      }))
    }))
  };
  
  return report;
}

// Main execution
console.log('🔧 Calculating Color Contrast Fixes...\n');

try {
  const colorsData = fs.readFileSync(colorsPath, 'utf-8');
  const colors = JSON.parse(colorsData);
  
  console.log('📊 Analyzing failures...');
  const failures = analyzeFailures(colors);
  console.log(`   Found ${failures.length} contrast failures\n`);
  
  console.log('🧮 Calculating fixes...');
  const fixes = calculateFixes(failures, colors);
  console.log(`   Calculated ${fixes.length} color adjustments\n`);
  
  console.log('📝 Generating fix report...');
  const report = generateFixReport(fixes);
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log(`✅ Fix report generated: ${outputPath}\n`);
  console.log('📊 Summary:');
  console.log(`   Total fixes needed: ${report.summary.totalFixes}`);
  console.log(`   Fixes that work for all cases: ${report.summary.fixesThatWorkForAll}`);
  console.log(`   Fixes needing review: ${report.summary.fixesNeedingReview}\n`);
  
  // Show first few fixes
  console.log('🔍 Sample fixes:');
  report.fixes.slice(0, 5).forEach(fix => {
    console.log(`\n   ${fix.path}:`);
    console.log(`     Current: ${fix.currentValue} (ratio: ${fix.currentRatio}:1)`);
    console.log(`     Suggested: ${fix.suggestedValue} (fixes ${fix.affectedFailures} failures)`);
    console.log(`     Works for all: ${fix.fixesAllFailures ? '✅' : '⚠️  (needs review)'}`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
