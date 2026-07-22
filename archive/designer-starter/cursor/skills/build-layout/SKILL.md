---
name: build-layout
description: "Compose a page layout inside a Harmony-themed MUI or shadcn shell. Use when the user wants to build a page (settings, dashboard, form, list/detail) after the Harmony theme has been applied via the mapping playbook."
disable-model-invocation: true
---

# /build-layout

Compose a page layout inside a **Harmony-themed MUI or shadcn** app. The Harmony theme has been applied via [docs/MAPPING_PLAYBOOK.md](../../../docs/MAPPING_PLAYBOOK.md) passes 1-8. Components come from the host framework (MUI or shadcn), not from `reference-components/`.

## Instructions

1. **Parse the request.** The user provides:
   - A layout description (e.g. "settings page with form inputs and toggles")
   - Optional: theme/mode (e.g. "VP dark") — apply via `document.documentElement` classes (`theme-vp`, `dark`, etc.)
   - **Framework:** MUI or shadcn (check which the project uses)
   - Optional: `--dry-run` (output the composition plan without writing files)

2. **Check prerequisites.**
   - Confirm the Harmony theme has been applied (check for `harmony-styles/` imports in the project entry point, or `var(--theme-primary)` in theme files).
   - Confirm the shell exists (MUI `AppBar`/`Drawer` or shadcn layout components). Reference `reference-components/ShellLayout.tsx` for the expected structure if needed.
   - If the theme has not been applied, direct the user to run `/integrate` first.

3. **Match to a layout pattern.**
   - Read the layout-builder skill's Layout Patterns section.
   - Find the closest match to the user's description.
   - If no pattern matches, compose from the description directly using the composition constraints from the skill.
   - If the user's description is ambiguous, ask ONE clarifying question.

4. **Check for a documented pattern in design-patterns.**
   - Search the design-patterns registry for a matching pattern.
   - If found, use its anatomy (and Component Tree if present) as the structural reference.
   - If not found, use the layout-builder skill's reference pattern.

5. **Resolve components.**
   - Map each component in the layout to the host framework:
     - **MUI:** `Button` → `MuiButton`, `Card` → `MuiCard`, `TextField` → `MuiTextField`, etc.
     - **shadcn:** `Button` → shadcn `Button`, `Card` → shadcn `Card`, `Input` → shadcn `Input`, etc.
   - Use `reference-components/*.tsx` as **read-only spec** for expected behavior and props — do not import them into the host app.
   - If a component has no host equivalent, note it and implement with the closest available primitive or HTML styled with Harmony tokens.

6. **Dry-run (if `--dry-run`).**
   Output:
   - Layout pattern used (or "custom from description")
   - Components needed and their host framework equivalents
   - Composition structure (indented tree):
     ```
     AppShell / Layout
       └── content area
           ├── PageHeader (title: "Settings")
           ├── Card (elevated)
           │   ├── TextField (name)
           │   ├── Switch (notifications)
           │   └── Switch (dark mode)
           └── ButtonBar
               ├── Button (outlined) "Cancel"
               └── Button (contained/primary) "Save"
     ```
   - Do not write any files. Stop here.

7. **Compose the layout.**
   - Create a new page file (e.g. `SettingsPage.tsx`) in the project's pages directory.
   - Import from the host framework (MUI or shadcn), NOT from `reference-components/`.
   - All styling must use Harmony tokens (`var(--space-*)`, `var(--radius-*)`, etc.) applied through the theme. No arbitrary hex or px values.

8. **Wire into the app.**
   - Add a route for the new page in the project's router.
   - Do not modify the shell layout unless the user explicitly asks.

9. **Verify.**
   - Delegate to the **layout-verifier** agent:
     - All components from the pattern anatomy are present.
     - Nesting follows composition constraints (no Card-in-Card, etc.).
     - Spacing uses Harmony tokens only.
     - No arbitrary/non-token styles.
   - If deviations found, fix and re-verify. Loop cap: 3 rounds.

10. **Report.**
    - Page file created: [path]
    - Components used: [list with host framework names]
    - Pattern used: [name or "custom"]
    - Wiring: [route added / manual wiring needed]
    - Verification: [pass / STUCK with deviation list]

## Important

- Build with **MUI or shadcn** components, not with Harmony React components from `reference-components/`. Those are read-only spec.
- All spacing and layout must use Harmony design tokens via the applied theme.
- The layout-builder skill is the guide for patterns and constraints. The design-patterns registry is the optional source for documented pattern anatomy.
- If `--dry-run`, output the full composition plan but do not write any files or invoke the verifier.
