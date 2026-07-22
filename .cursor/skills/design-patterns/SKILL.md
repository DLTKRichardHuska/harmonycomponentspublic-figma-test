---
name: design-patterns
description: Comprehensive design pattern management system for multi-product design teams. Use this skill when (1) creating a new pattern from an existing component, (2) documenting UI/UX patterns for consistency, (3) looking up existing patterns for a specific product (PPM, CP, etc.), (4) referencing patterns when building new components, (5) searching for reusable patterns across products. Triggers on keywords like "pattern", "component pattern", "document this component", "create pattern from", "what patterns exist for [product]", "wizard pattern", "navigation pattern", "floating nav", or any request to standardize or reference design system patterns.
---

# Design Patterns Skill

A pattern management system enabling design teams to create, document, and reference UI/UX patterns across multiple products.

## Integration with Harmony Design System (Astro reference)

Patterns in this registry are **design-level blueprints** — they define anatomy, structure, flow, and when-to-use guidelines.

**When implementing or verifying a pattern in this repo:** Use Harmony **Astro components** from `src/components/ui/` and layouts from `src/layouts/`. Preview implementations live under `src/pages/preview/`.

- Pattern says `Dialog` → use `Dialog.astro`
- Pattern says `Button` → use `Button.astro`
- Pattern says `Card` → use `Card.astro`
- Pattern says `Table` → use `Table.astro` or product-specific table components

All styling uses Harmony tokens (`var(--space-*)`, `var(--radius-*)`, `var(--theme-primary)`, etc.) from `src/styles/tokens.css` and component CSS in `src/styles/components.css`.

## Core Capabilities

1. **Pattern Creation** - Generate pattern documentation from existing components
2. **Pattern Registry** - Maintain searchable pattern catalogs per product
3. **Pattern Reference** - Look up patterns for consistency when building new components
4. **Cross-Product Discovery** - Find patterns that could be reused across products

## Workflow Decision Tree

**Creating a new pattern?** → Run `scripts/create_pattern.py` or follow "Pattern Creation Workflow"
**Looking up existing patterns?** → See `reference/registry.md` or run `scripts/search_patterns.py`
**Building a new component?** → Check registry first, then follow existing pattern structure. Implement with Harmony Astro components. After implementation, follow the **harmony** skill checklist ([ADD_COMPONENT_CHECKLIST.md](../harmony/reference/ADD_COMPONENT_CHECKLIST.md)) so `index.ts`, `component-catalog.ts`, docs, and consumer lists stay aligned; run `npm run validate:catalog`.
**Documenting manually?** → Use template from `reference/PATTERN_TEMPLATE.md`

## Pattern Creation Workflow

### Quick Create (recommended)

Run from the project that contains the component:

```bash
python .cursor/skills/design-patterns/scripts/create_pattern.py FloatingNav
python .cursor/skills/design-patterns/scripts/create_pattern.py FloatingNav --product CP
```

The script will:
1. Search the project for a file matching the name
2. Detect category from folder path
3. Ask for product/theme if not provided
4. Analyze the component, generate the doc, and save to `reference/<name>.md`

Optional flags: `--product` (or `--theme`), `--category`, `--output`, `--author`, `--project-root`.

### Manual / agent-guided (when not using the script)

When creating a pattern without the script, gather this information:

**1. Pattern Identity**
- Pattern name (e.g., "Wizard Dialog", "Floating Navigation")
- Product context (PPM, CP, or "cross-product")
- Category (dialogs, navigation, forms, layouts, data-display, feedback)

**2. Source Analysis**
- Which component(s) implement this pattern?
- What problem does it solve?
- What are the key design decisions?

**3. Pattern Structure**
- Visual anatomy (diagram or description)
- Required vs optional elements
- Variants and when to use each

**4. Implementation Details**
- Component dependencies (Harmony Astro components from `src/components/ui/`)
- Props/configuration options
- Integration points

**5. Usage Guidelines**
- When to use this pattern
- When NOT to use this pattern
- Accessibility considerations

### Manual Create

Copy `reference/PATTERN_TEMPLATE.md` and fill in sections.

## Pattern Registry Structure

Patterns are organized by product, then category:

```
patterns/
├── ppm/                     # Project Portfolio Management
│   ├── _index.md
│   ├── dialogs/
│   ├── navigation/
│   ├── forms/
│   └── layouts/
├── cp/                      # CP Theme
│   ├── _index.md
│   ├── navigation/
│   └── layouts/
├── cross-product/           # Shared patterns
│   ├── _index.md
│   └── ...
└── registry.md              # Master index of all patterns
```

## Searching Patterns

### By Product
```bash
python .cursor/skills/design-patterns/scripts/search_patterns.py --product "PPM"
```

### By Category
```bash
python .cursor/skills/design-patterns/scripts/search_patterns.py --category "navigation"
```

### By Keyword
```bash
python .cursor/skills/design-patterns/scripts/search_patterns.py --query "accordion wizard"
```

### Full-Text Search
```bash
python .cursor/skills/design-patterns/scripts/search_patterns.py --query "sidebar completion tracking" --full-text
```

## Pattern Documentation Standards

Every pattern document must include:

### Required Sections
1. **Header** - Name, product, category, status, last updated
2. **Problem Statement** - What problem this solves
3. **Solution** - How the pattern solves it
4. **Anatomy** - Visual breakdown of components
5. **Usage Guidelines** - When to use, when not to use
6. **Implementation** - Harmony Astro components, integration points

### Optional Sections
- Variants
- Accessibility
- Related Patterns
- Version History

### Status Values
- `draft` - Under development
- `review` - Ready for team review
- `approved` - Accepted for use
- `deprecated` - Being phased out

## Integration with Cursor/AI Agents

Patterns are designed to be AI-readable for consistency when building new components.

**When building a new component:**
1. Agent searches registry for relevant patterns
2. Loads pattern documentation into context
3. Follows pattern structure and guidelines
4. Builds with **Harmony Astro components** using design tokens
5. Validates against preview pages in `src/pages/preview/` when available

**Example prompt for AI:**
```
I need to create a new wizard for PPM.
Check the design-patterns registry for wizard patterns.
Follow the existing wizard-dialog pattern structure.
Build with Harmony Dialog and Button Astro components.
```

## Cross-Product Pattern Adoption

When a product-specific pattern may be useful elsewhere:

1. Document it in the originating product's patterns
2. Mark with `cross-product-candidate: true` in frontmatter
3. During design reviews, evaluate for promotion
4. If promoted, copy to `cross-product/` with attribution

## Resources

- **Designer quick start**: `reference/designer-quickstart.md`
- **Pattern Template**: `reference/PATTERN_TEMPLATE.md`
- **Registry**: `reference/registry.md`
- **Example pattern**: `reference/wizard-dialog.md`
- **Creation Script**: `scripts/create_pattern.py`
- **Search Script**: `scripts/search_patterns.py`

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Create pattern | `python .cursor/skills/design-patterns/scripts/create_pattern.py <ComponentName>` (optional: `--product CP`) |
| Create pattern (manual) | Copy `reference/PATTERN_TEMPLATE.md` |
| Search patterns | `python .cursor/skills/design-patterns/scripts/search_patterns.py --query "..."` |
| List all patterns | `python .cursor/skills/design-patterns/scripts/search_patterns.py --list` |
| View registry | Open `reference/registry.md` |
