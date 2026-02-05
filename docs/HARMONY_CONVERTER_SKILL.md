# Harmony Converter Skill — Reference

This document describes what the **harmony-converter** skill (Cursor skill used by an AI agent to convert Harmony Astro components to other frameworks) must include. Implement these instructions in the skill so the agent behaves correctly.

## 1. Default state

- **Default state is what the component source shows.** Components are prepopulated: when you read an Astro component, the frontmatter and template show a full default (default prop values and/or default slot content). There are no empty holders.
- This applies to **all** components, not only the shell. Use the component source as the source of truth for the default UI.

## 2. Contextual UI

- Preserve **contextual behavior** from data attributes and client script. Example: the shell panel header is **gradient** when the Dela AI item (or any RightSidebar item with `useGradientHeader`) is active, and **theme primary** for other sidebar items. This is implemented via `data-use-gradient-header`, `data-gradient-header`, and script in RightSidebar and ShellPanel.
- Replicate **both branches** in the target framework; do not flatten to a single visual. Read the conditional logic from the template and script and map it to the target (e.g. state + handlers in React).

## 3. Icon resolution (theme-aware)

- Icon resolution is **explicit and theme-scoped**. Do not assume Heroicons for every icon.
- Use the **theme-scoped icon manifest** for the **target theme** (cp, vp, ppm, maconomy). Manifest path in the repo: `src/data/icon-manifest.json`. Structure: top-level keys `cp`, `vp`, `ppm`, `maconomy`; each theme lists icon names with `source` (`hero` | `tabler` | `custom`) and `path`; for `custom`, optional `svg` may be present.
- For each icon name in the component, look up the icon in the manifest for the target theme; use `source` and for custom use `path` or `svg`. Do not substitute or assume Heroicons for all.

## 4. Icon sizes

- **Icon sizes are not in the manifest.** They are defined **per usage** in the component template via the Icon component’s `size` prop (`xs` | `sm` | `md` | `lg` | `xl`).
- Read and preserve the `size` prop from each Icon usage in the Astro template. Do not infer or default sizes; take them from the component source.

## 5. Mode (light/dark)

- **Mode (light/dark) does not change** default structure or icon resolution. Do not add mode-specific branches for defaults or icon lookup.

## 6. Shell layout and theme

- Shell layout **default structure is theme-dependent**: CP theme includes floating nav and no footer by default; PPM, VP, and Maconomy include a footer and different left/right sidebar sections. When converting ShellLayout, preserve the theme-driven visibility of floating nav, footer, and sidebar content (e.g. from theme detection or variant props).
