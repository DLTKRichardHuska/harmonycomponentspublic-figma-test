---
name: Fix Date Time Picker Issues
overview: "Fix critical functionality issues with date/time pickers: add placeholder text, fix popup open/close behavior, and ensure icon clicks work. Follow DRY/SOLID principles, use design tokens, avoid hardcoded values and !important tags."
todos: []
---

# Fix Date/Time Picker Functionality Issues

## Issues Identified

1. **Missing placeholder text** - Input fields show no hint when empty (e.g., "Select date")
2. **Click outside doesn't close** - Popup remains open when clicking outside
3. **Clicking field again doesn't toggle** - Clicking the input when popup is open should close it
4. **Icon clicks don't open picker** - Calendar/clock icon clicks aren't working

## Implementation Plan

### 1. Add Placeholder Text to DateInput Component

**File**: `src/components/ui/DateInput.astro`

- Add placeholder text calculation in the frontmatter section (SSR-safe, before the `---`)
- Create a constant map for placeholder text based on `type` prop (DRY principle)
- Use design token `--text-muted` for placeholder color (already in CSS, no changes needed)
- Add `placeholder` attribute to the input element in the template
- **SSR Note**: Placeholder must be set in frontmatter, not in client-side script, to work during server-side rendering
- **No hardcoded values**: Use the type-to-text mapping pattern

### 2. Fix Popup Toggle Behavior

**File**: `src/components/ui/DateInput.astro`

- Refactor `openPicker` function to check if popup is already open (Single Responsibility)
- If open, close it instead of opening again (toggle behavior)
- Use `popup.classList.contains('is-open')` to check state
- **DRY**: Reuse existing `openPicker` and `closePicker` functions, don't duplicate logic
- Extract toggle logic into a reusable function if needed

### 3. Fix Icon Click Handler

**File**: `src/components/ui/DateInput.astro`

- Ensure icon click handler properly prevents default and stops propagation
- Verify icon has `pointer-events: auto` in CSS (already set via `--text-secondary` token)
- Make sure icon click uses the same toggle logic as input click (DRY)
- **No duplication**: Share the same handler function between input and icon

### 4. Fix Click Outside Handler

**File**: `src/components/ui/PickerPopup.astro`

- Review click outside handler logic for proper event target checking
- **Memory leak fix**: Store event handler references and remove them when component is destroyed
- **SOLID**: Each popup instance should manage its own event listeners
- Ensure handler works for all popup instances (no shared state issues)
- Use proper cleanup pattern to prevent memory leaks
- **No !important tags**: Use proper CSS specificity instead

### 5. Update CSS for Placeholder Styling (if needed)

**File**: `src/styles/components.css`

- Verify placeholder styling uses `--text-muted` token (already correct)
- Ensure no hardcoded color values
- Use existing `.date-input::placeholder` selector pattern
- **No !important**: Rely on CSS specificity and cascade

## Technical Details

### Placeholder Text Logic (SSR-Safe, DRY)

**Must be in frontmatter section (before `---`):**

```typescript
// In frontmatter, after props destructuring
// DRY: Single source of truth for placeholder text mapping
const PLACEHOLDER_TEXT_MAP: Record<string, string> = {
  'date': 'Select date',
  'time': 'Select time',
  'datetime-local': 'Select date & time',
  'month': 'Select month',
  'week': 'Select week'
} as const;

const placeholderText = PLACEHOLDER_TEXT_MAP[type] || PLACEHOLDER_TEXT_MAP['date'];
```

Then use in template:
```astro
<input placeholder={placeholderText} ... />
```

**Design Tokens Used:**
- `--text-muted` for placeholder color (already in CSS)

### Toggle Logic (DRY, Single Responsibility)

```typescript
// Single function handles both open and close (DRY)
const togglePicker = () => {
  if (inputEl.disabled) return;
  const isOpen = popup.classList.contains('is-open');
  if (isOpen) {
    (window as any).closePicker?.(popupId, inputEl);
  } else {
    (window as any).openPicker?.(popupId, inputEl);
  }
};

// Reuse for both input and icon (DRY)
inputEl.addEventListener('click', togglePicker);
icon?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  togglePicker();
});
```

### Click Outside Handler (SOLID, Memory Management)

```typescript
// Store handler reference for cleanup
const clickOutsideHandler = (e: MouseEvent) => {
  if (popup.classList.contains('is-open') && 
      !popup.contains(e.target as Node) &&
      (!triggerElement || !triggerElement.contains(e.target as Node))) {
    closePicker(popup as HTMLElement, triggerElement);
  }
};

document.addEventListener('click', clickOutsideHandler);

// Cleanup on component destroy (prevent memory leaks)
// Store cleanup function reference
```

## Design Tokens Reference

**Spacing:**
- `--space-*` tokens (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24)

**Typography:**
- `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, etc.
- `--font-sans`, `--font-display`, `--font-mono`
- `--font-light`, `--font-normal`, `--font-medium`, `--font-semibold`, `--font-bold`

**Colors:**
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- `--theme-primary`, `--theme-primary-hover`, `--theme-primary-light`
- `--border-color`, `--border-light`
- `--card-bg`, `--input-bg`, `--input-disabled-bg`
- `--hover-bg`

**Border Radius:**
- `--radius-04`, `--radius-08`, `--radius-12`, `--radius-16`, `--radius-24`, `--radius-100`
- Or semantic: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`

**Shadows:**
- `--shadow-none`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

**Z-index:**
- `--z-popover` (for popups)

## Code Quality Standards

### No Hardcoded Values
- ✅ Use design tokens for all spacing, colors, typography
- ✅ Use constants/maps for text values (like placeholder text)
- ❌ No magic numbers (e.g., `8px`, `#94A3B8`)
- ❌ No hardcoded strings repeated across code

### No !important Tags
- ✅ Use proper CSS specificity
- ✅ Use cascade and inheritance
- ❌ No `!important` in any CSS rules

### DRY Principles
- ✅ Single source of truth for mappings (PLACEHOLDER_TEXT_MAP)
- ✅ Reuse functions (togglePicker for both input and icon)
- ✅ Extract common logic into reusable functions
- ❌ No code duplication

### SOLID Principles
- ✅ Single Responsibility: Each function does one thing
- ✅ Open/Closed: Extend behavior through configuration, not modification
- ✅ Dependency Inversion: Depend on abstractions (window.openPicker/closePicker)
- ✅ Interface Segregation: Small, focused interfaces
- ✅ Liskov Substitution: Components work consistently

### Memory Management
- ✅ Clean up event listeners when components are destroyed
- ✅ Store handler references for proper cleanup
- ✅ Avoid memory leaks from orphaned event listeners

## SSR Safety Checklist

- [ ] Placeholder text is calculated in frontmatter (SSR section), not in client script
- [ ] No browser APIs used in placeholder calculation
- [ ] All constants (like dayNames pattern) remain in frontmatter
- [ ] Template uses SSR-calculated values directly
- [ ] Client-side scripts only handle interactivity, not initial rendering

## Code Quality Checklist

- [ ] No hardcoded values (colors, spacing, sizes)
- [ ] All values use design tokens
- [ ] No `!important` tags in CSS
- [ ] DRY: No code duplication
- [ ] SOLID: Functions follow single responsibility
- [ ] Memory management: Event listeners are cleaned up
- [ ] Constants are defined once and reused

## Testing Checklist

- [ ] Placeholder text appears when input is empty (works on initial page load/SSR)
- [ ] Placeholder text is appropriate for each input type
- [ ] Clicking input toggles popup (opens when closed, closes when open)
- [ ] Clicking icon toggles popup
- [ ] Clicking outside popup closes it
- [ ] Multiple pickers on same page work independently
- [ ] All picker types work (date, time, datetime-local, month, week)
- [ ] SSR renders correctly (no hydration mismatches)
- [ ] No memory leaks (event listeners cleaned up)
- [ ] No console errors or warnings
