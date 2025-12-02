# Design System Documentation

A complete design system with foundation elements, shell layout components, and 25 production-ready UI components with full dark/light theme support.

## Features

- 🎨 **Foundation System** - Colors, typography, spacing, and elevations
- 🏗️ **Shell Layout** - Complete application layout with header, sidebars, and footer
- ✅ **25 UI Components** - From basic buttons to complex dialogs
- 🌓 **Dual Theme Support** - Beautiful dark and light modes
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ♿ **Accessible** - Built with semantic HTML and ARIA attributes
- ⚡ **Fast & Lightweight** - Single HTML file with CDN resources
- 🎯 **Production Ready** - Copy and use immediately

## Foundation System

### Design Tokens
1. **Color** - Primary palette, semantic colors, zinc scale
2. **Typography** - Font families (Lexend, Figtree), type scale, weights
3. **Spacing** - Consistent spacing scale from 2px to 96px
4. **Elevations** - Shadow system for depth and hierarchy

## Shell Layout Components

### Application Shell
5. **Shell Layout** - Complete application structure
6. **Shell Header** - Top navigation with branding and user controls
7. **Shell Footer** - Bottom tab bar for workspace navigation
8. **Page Content** - Main content area with header and layouts
9. **Left Sidebar** - Primary navigation with icon menu
10. **Right Sidebar** - Secondary actions and quick access panel

## UI Components Included

### Interactive Components
11. **Buttons** - Multiple variants (primary, secondary, outline, ghost, destructive, icon)
12. **Button Groups** - Horizontal groups and segmented controls
13. **Accordion** - Expandable/collapsible content panels
14. **Tab Strip** - Horizontal tab navigation (underline, pill, with icons)
15. **Dialogs** - Modal overlays and popups
16. **Dropdowns** - Select menus and custom dropdowns
17. **Toggle Switches** - On/off controls with descriptions

### Form Components
18. **Inputs** - Text, textarea, password with icons
19. **Specialty Inputs** - Number, URL, currency inputs
20. **Checkboxes** - Single checkboxes with states
21. **Checkbox Groups** - Multiple selection groups
22. **Radio Buttons** - Single selection inputs
23. **Radio Groups** - Grouped radio selections (vertical, card style)
24. **Labels** - Form labels with helper text
25. **Date Picker** - Calendar date selection

### Display Components
26. **Badges** - Status indicators with color variants
27. **Cards** - Content containers (basic, with icons, interactive, featured)
28. **Chips** - Dismissible tags with icons
29. **Alerts** - Success, info, warning, error notifications
30. **Tooltips** - Hover information overlays
31. **Progress Bar** - Linear progress indicators
32. **Spinner** - Loading indicators

### Navigation Components
33. **Links** - Text links with icons and variants
34. **List Menu** - Vertical navigation menus
35. **Scrollbar** - Custom styled scrollbars

## Technology Stack

- **Tailwind CSS CDN** - Utility-first CSS framework
- **Heroicons** - For component examples and content
- **Tabler Icons** - For UI chrome and navigation
- **Vanilla JavaScript** - For interactivity
- **Custom Fonts**:
  - **Lexend** - Headers and titles
  - **Figtree** - Body copy

## Color Palette

### Dark Theme
- **Background**: Obsidian (#09090b), Charcoal (#18181b)
- **Accent**: Acid (#ccff00)
- **Text**: #e5e5e5
- **Borders**: #222222

### Light Theme
- **Background**: White (#ffffff), Concrete (#f4f4f5)
- **Accent**: Acid (#ccff00)
- **Text**: #09090b
- **Borders**: Zinc variants

## Usage

### Quick Start

1. Open `index.html` in any modern web browser
2. Browse through all 25 components
3. Use the left sidebar to navigate between components
4. Toggle between light and dark themes using the theme button

### Copying Components

1. Find the component you want to use
2. Copy the HTML markup
3. Paste into your project
4. Customize colors, spacing, and content as needed

### Theme Toggle

The theme toggle button in the header allows you to switch between dark and light modes. The preference is saved in localStorage and persists across sessions.

### Mobile View

On mobile devices, the sidebar is hidden by default. The layout is fully responsive and optimized for all screen sizes.

## Interactive Features

### Accordion
Click on accordion headers to expand/collapse content panels.

### Dialog
Click "Open Dialog" button to display modal overlays. Click outside or use the close button to dismiss.

### Theme Toggle
Click the sun/moon icon in the header to switch between light and dark themes.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

All components use Tailwind CSS utility classes, making them easy to customize:

- **Colors**: Modify the color classes (e.g., `bg-zinc-900`, `text-white`)
- **Spacing**: Adjust padding and margin classes (e.g., `px-4`, `py-2`)
- **Sizing**: Change width and height classes (e.g., `w-full`, `h-10`)
- **Borders**: Modify border radius and width (e.g., `rounded-md`, `border-2`)

## File Structure

```
/components/
├── index.html          # Main file with all components
└── README.md          # This file
```

## Credits

- **Design System**: Custom design
- **Icons**: Heroicons & Tabler Icons
- **CSS Framework**: Tailwind CSS
- **Fonts**: Google Fonts (Lexend, Figtree)

## Version

**v1.0.0** - Initial release with 25 components

---

Built with ❤️ for designers and developers

