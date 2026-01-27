# @deltek/harmony-components

> Enterprise design system for Astro applications with 40+ production-ready UI components, layouts, and comprehensive theming support.

## Features

- 🎨 **40+ UI Components** - From basic inputs to complex shell layouts
- 🏗️ **Enterprise Shell Layout** - Complete application structure with header, sidebars, and footer
- 🎭 **Multi-Theme Support** - CP, VP, PPM, and Maconomy themes with light/dark modes
- 🎯 **Design Tokens** - Colors, typography, spacing, and elevation scales
- ♿ **Accessible** - Built with semantic HTML and ARIA attributes
- 📱 **Responsive** - Optimized for all screen sizes
- ⚡ **Zero Runtime JS** - Pure Astro components with vanilla CSS

## Installation

### Prerequisites

Ensure you have Node.js and npm installed, and that your project uses Astro.

### Install from GitHub

```bash
# Install the design system from GitHub
npm install git+https://github.com/DLTKfrancesmunoz/harmonycomponents.git

# Or install a specific version
npm install git+https://github.com/DLTKfrancesmunoz/harmonycomponents.git#v1.0.0
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install astro @tabler/icons heroicons
```

If you already have Astro in your project, you only need to install the icon libraries.

## Quick Start

### 1. Import Global Styles

In your main layout or `src/pages/_app.astro`:

```astro
---
import '@deltek/harmony-components/styles/reset.css';
import '@deltek/harmony-components/styles/tokens.css';
import '@deltek/harmony-components/styles/global.css';
import '@deltek/harmony-components/styles/components.css';
---
```

**Recommended import order:**
1. reset.css
2. tokens.css
3. global.css
4. components.css
5. layout.css (optional)
6. utilities.css (optional)

### 2. Use Components

```astro
---
import { Button, Card, Input } from '@deltek/harmony-components/ui';
---

<Card>
  <h2>Welcome to Harmony</h2>
  <Input label="Email" type="email" />
  <Button variant="primary">Submit</Button>
</Card>
```

### 3. Use Layouts

```astro
---
import ShellLayout from '@deltek/harmony-components/layouts/ShellLayout.astro';
---

<ShellLayout
  productName="My App"
  theme="cp"
  logoSrc="/my-logo.svg"
>
  <div slot="main-content">
    <!-- Your page content -->
  </div>
</ShellLayout>
```

## Available Imports

### Components

```typescript
// Import all components at once
import { Button, Card, Dialog, Input, Dropdown } from '@deltek/harmony-components/ui';

// Import individual components
import Button from '@deltek/harmony-components/ui/Button.astro';
import Card from '@deltek/harmony-components/ui/Card.astro';
```

**Available Components:**

**Form Controls:**
- Button, ButtonGroup
- Input, Textarea, NumberInput, RangeInput
- Checkbox, RadioButton, Toggle
- DateInput, Label

**Display:**
- Card, Badge, NotificationBadge, Chip
- Alert, Tooltip, Spinner, ProgressBar
- Table, Icon

**Navigation:**
- TabStrip, Stepper, Step, FloatingNav, Link

**Layout:**
- LeftSidebar, RightSidebar
- ShellPageHeader, ShellPanel

**Interactive:**
- Dialog, Dropdown, Accordion
- Kanban, KanbanCard

### Layouts

```astro
import ShellLayout from '@deltek/harmony-components/layouts/ShellLayout.astro';
import DocsLayout from '@deltek/harmony-components/layouts/DocsLayout.astro';
```

#### ShellLayout Props

```typescript
interface ShellLayoutProps {
  productName?: string;        // Product name in header
  logoSrc?: string;            // Path to logo SVG
  theme?: 'cp' | 'vp' | 'ppm' | 'mac';  // Theme selection
  companyName?: string;        // Company name for picker
  showCompanyPicker?: boolean; // Show/hide company picker
  showLeftSidebar?: boolean;   // Show/hide left sidebar
  showRightSidebar?: boolean;  // Show/hide right sidebar
  showFooter?: boolean;        // Show/hide footer
}
```

**Slots:**
- `main-content` - Primary page content
- `left-sidebar` - Custom left sidebar content
- `right-sidebar` - Custom right sidebar content
- `header-actions` - Custom header actions
- `footer-tabs` - Custom footer tabs

### Styles

```typescript
// Import individual stylesheets
import '@deltek/harmony-components/styles/reset.css';      // CSS reset
import '@deltek/harmony-components/styles/tokens.css';     // Design tokens as CSS variables
import '@deltek/harmony-components/styles/global.css';     // Global styles
import '@deltek/harmony-components/styles/components.css'; // Component styles
import '@deltek/harmony-components/styles/layout.css';     // Layout utilities
import '@deltek/harmony-components/styles/utilities.css';  // Utility classes
```

### Design Tokens

```typescript
// Import all tokens
import { colors, spacing, typography, elevations } from '@deltek/harmony-components/tokens';

// Import specific token sets
import { semanticColors, themeColors } from '@deltek/harmony-components/tokens';

// Import raw JSON
import colorsJson from '@deltek/harmony-components/tokens/colors.json';
import spacingJson from '@deltek/harmony-components/tokens/spacing.json';
import typographyJson from '@deltek/harmony-components/tokens/typography.json';
import elevationsJson from '@deltek/harmony-components/tokens/elevations.json';
```

### Public Assets

Assets like logos are included in the package:

```astro
---
// Reference logos from the package's public folder
// Note: You may need to copy these to your project's public folder
---
<img src="/node_modules/@deltek/harmony-components/public/logos/CPVPLogo.svg" alt="Logo" />
```

## Theme System

Harmony supports four product themes, each with light and dark modes:

| Theme | Code | Products |
|-------|------|----------|
| Costpoint/Vantagepoint | `cp` | Costpoint, Vendor Portal |
| Vantagepoint | `vp` | Vendor Portal |
| PPM | `ppm` | Project Portfolio Management |
| Maconomy | `mac` | Maconomy |

### Setting Theme

```astro
<ShellLayout theme="cp">
  <!-- Content automatically themed -->
</ShellLayout>
```

### Dark Mode

Dark mode is automatically applied based on user system preferences using `prefers-color-scheme` media query. All components support both light and dark modes.

## Customization

### Extension Points

Harmony components are designed to be used as-is, with customization through:

1. **Props** - All components accept standard HTML attributes
2. **Slots** - Layouts and complex components provide named slots
3. **CSS Custom Properties** - Override design tokens via CSS variables
4. **Class Names** - Add custom classes via the `class` prop

### DO NOT Modify Source

**Important**: Do not copy and modify component source files. This breaks the upgrade path and prevents bug fixes. Instead:

- Use props to configure behavior
- Use slots to inject custom content
- Use CSS custom properties to adjust styling
- Wrap components if you need additional functionality

### Example: Custom Button Style

```astro
---
import { Button } from '@deltek/harmony-components/ui';
---

<style>
  .my-custom-button {
    --button-padding: 1rem 2rem;
    --button-border-radius: 0.5rem;
  }
</style>

<Button class="my-custom-button" variant="primary">
  Custom Styled Button
</Button>
```

## Updating the Design System

To get the latest changes from the design system:

```bash
# Update to the latest version
npm update @deltek/harmony-components

# Or install a specific version
npm install git+https://github.com/DLTKfrancesmunoz/harmonycomponents.git#v1.0.1
```

## TypeScript Support

All components export TypeScript interfaces for props:

```typescript
import type { Props as ButtonProps } from '@deltek/harmony-components/ui/Button.astro';
import type { Props as CardProps } from '@deltek/harmony-components/ui/Card.astro';
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties

## Contributing

This package is maintained by the Deltek Design Systems team. For issues, feature requests, or contributions, please contact the design systems team or open an issue in the GitHub repository.

## License

UNLICENSED - Internal use only for Deltek projects.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

---

Built with ❤️ by the Deltek Design Systems Team
