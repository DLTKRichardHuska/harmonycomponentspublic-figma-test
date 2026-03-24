# /build-layout

Compose a page layout inside a **Harmony-themed MUI or shadcn** app. The Harmony theme has been applied via the mapping playbook. Components come from the host framework, not from `reference-components/`.

## Instructions

1. **Parse the request.** The user provides:
   - A layout description (e.g. "settings page with form inputs and toggles")
   - Optional: theme/mode notes (e.g. "PPM light") — apply via `document.documentElement` classes
   - Optional: `--dry-run` (output the composition plan without writing files)

2. **Check prerequisites.**
   - **Theme applied:** Harmony CSS imported, `theme-*` class on `<html>`, host theme wired with Harmony tokens.
   - **Shell:** MUI shell (AppBar/Drawer/etc.) or shadcn layout exists. Reference `reference-components/ShellLayout.tsx` for expected structure if needed.
   - If the theme has not been applied, direct the user to `/integrate` first.

3. **Match to a layout pattern.**
   - Read the layout-builder skill's Layout Patterns section.
   - Find the closest match to the user's description.
   - If no pattern matches, compose from the description directly using the composition constraints.
   - If the user's description is ambiguous, ask ONE clarifying question.

4. **Check for a documented pattern in design-patterns.**
   - Search the design-patterns registry (`.cursor/skills/design-patterns/reference/`) for a matching pattern.
   - If found, use its anatomy (and Component Tree if present) as the structural reference.
   - If not found, use the layout-builder skill's reference pattern.

5. **Resolve components.**
   - Map each component to the host framework:
     - **MUI:** `Card` → `MuiCard`, `Button` → `MuiButton`, `TextField` → `MuiTextField`, etc.
     - **shadcn:** `Card` → shadcn `Card`, `Button` → shadcn `Button`, `Input` → shadcn `Input`, etc.

6. **Dry-run (if `--dry-run`).**
   Output:
   - Layout pattern used (or "custom from description")
   - Components needed and their host framework equivalents
   - Composition structure (indented tree)
   - Do not write any files. Stop here.

7. **Compose the layout.**
   - Create a new page in the project's pages directory.
   - Import from the host framework (MUI or shadcn), NOT from `reference-components/`.
   - Compose per pattern anatomy and composition constraints (nesting, spacing, grid).
   - Apply Harmony spacing tokens and classes only. No arbitrary px values or non-token spacing.

8. **Wire into the app.**
   - Add a route for the new page in the project's router.
   - Do not modify shell components unless the user explicitly asks.

9. **Verify.**
   - Delegate to the **layout-verifier** agent:
     - All components from the pattern anatomy are present.
     - Nesting follows composition constraints (no Card-in-Card, etc.).
     - Spacing uses Harmony tokens only.
     - No arbitrary/non-token styles.
   - Run build command to confirm compilation. Do not start a dev server.
   - If deviations found, fix and re-verify. Loop cap: 3 rounds.

10. **Report.**
    - Page file created: [path]
    - Components used: [list with host framework names]
    - Pattern used: [name or "custom"]
    - Wiring: [route added]
    - Verification: [pass / STUCK with deviation list]

## Important

- Build with **MUI or shadcn** components. `reference-components/` is read-only spec.
- All spacing and layout must use Harmony design tokens.
- The layout-builder skill is the guide for patterns and constraints. The design-patterns `reference/` docs are the optional source for documented pattern anatomy.
