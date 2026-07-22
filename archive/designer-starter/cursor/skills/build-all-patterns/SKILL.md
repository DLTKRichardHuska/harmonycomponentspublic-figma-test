---
name: build-all-patterns
description: "Build all pattern pages: one page per pattern, using MUI or shadcn with Harmony theme applied. Layout and fidelity verification, checkpoints every 5."
disable-model-invocation: true
---

# /build-all-patterns

Build all pattern pages: one page per pattern, each implemented with **MUI or shadcn** components and the Harmony theme. Content patterns render in the content area; shell-modifying patterns configure the relevant shell regions. Runs dual verification (layout + fidelity) on each. Checkpoints every 5 for user review.

## Instructions

1. **User input.** The user provides:
   - The **host framework** in use (MUI or shadcn — detect from package.json if not specified).
   - Optional: `--dry-run` — list all patterns that would be built. Do not build anything.
   - Optional: `--category [name]` — build only patterns in that category.
   - Optional: `--start-from [slug]` — resume from a specific pattern.

2. **Read the pattern registry.**
   - Run `python .cursor/skills/design-patterns/scripts/search_patterns.py --list` to get all patterns.
   - Build a list of { slug, name, category, markdown path } for every pattern.
   - If `--category` is provided, filter to only that category.
   - Total expected: ~45 patterns (or subset if filtered).

3. **Check what's already built.**
   - For each pattern, check whether the page component already exists in the output directory.
   - If the file exists AND its route is in the slug→component map, mark as SKIP.
   - If ALL patterns are already built, report "All pattern pages already built" and stop.

4. **Check prerequisites.**
   - The Harmony theme must be applied (check for `harmony-styles/` imports and `theme-*` class on `<html>`).
   - A shell must exist (MUI AppBar/Drawer or shadcn layout). Reference `reference-components/ShellLayout.tsx` for expected structure.
   - Routing must be set up. If not, create it as part of step 6.

5. **Dry-run (if `--dry-run`).**
   Output:
   - Total patterns found: [N]
   - Already built (SKIP): [list]
   - Patterns to build: [list with slug, name, category]
   - For each: components needed from Component Tree, mapped to host framework equivalents
   - Do not build anything. Stop here.

6. **Set up routing and index (if not already present).**
   - Install router if needed (`react-router-dom`).
   - Create index page listing all patterns as links grouped by category.
   - Create slug→component map.
   - Each route points directly to the pattern component. No shared wrapper.

7. **Build each pattern page (one at a time, in order).**
   For each pattern (ordered by category, then alphabetical):

   **a. Pre-flight (before writing any code):**
   Print:
   1. Pattern name and slug.
   2. Pattern markdown path being read.
   3. Components listed in the Component Tree → mapped to host framework equivalents.
   4. Required elements from Key Elements table.
   5. Named items that must appear.
   6. What the output file will contain (brief).

   **b. Build the page component:**
   - Read the pattern markdown: Anatomy, Component Tree, Key Elements, Usage Guidelines, AI Agent Checklist.
   - Create the page component file (e.g. `src/patterns/WizardDialog.tsx`).
   - **Build with MUI or shadcn components**, not Harmony React components from `reference-components/`.
   - The shell is built from MUI/shadcn per Pass 7 of the mapping playbook. Each pattern page imports the shell layout and renders its own instance with appropriate props/slots.
   - Use every component listed in the Component Tree, mapped to host framework equivalents.
   - Use realistic demo data. Do NOT use "Lorem ipsum" or generic placeholders.
   - Wire behaviors: dismissible chips, dialog open/close, filter effects, tab switching. State can be local.

   **c. Add to routing.**

   **d. VERIFICATION GATE — required output before pattern N is complete:**

   ```
   === VERIFICATION: [Pattern Name] ([slug]) ===

   LAYOUT VERIFIER:
   [Run layout-verifier agent. Paste full deviation list or "PASS: zero deviations."]

   Round 2 (if needed): [deviation list after fixes]
   Round 3 (if needed): [deviation list after fixes]
   Layout result: [PASS | STUCK (N deviations)]

   FIDELITY VERIFIER:
   [Run pattern-fidelity-verifier agent. Paste full deviation list or "PASS: zero deviations."]

   Round 2 (if needed): [deviation list after fixes]
   Round 3 (if needed): [deviation list after fixes]
   Fidelity result: [PASS | STUCK (N deviations)]

   PATTERN STATUS: [PASS | STUCK (layout) | STUCK (fidelity) | STUCK (both)]
   === END VERIFICATION: [Pattern Name] ===
   ```

   **e. Log result.**

   **g. Checkpoint (every 5 patterns):**
   After every 5 completed patterns, stop and output a summary table. Wait for user to say "continue."

8. **After all patterns are built:**
   - Update the index page with links to all completed pattern pages.
   - Verify the index page compiles.

9. **Final report.**

   | # | Pattern | Category | Layout | Fidelity | Status |
   |---|---------|----------|--------|----------|--------|

   Summary: Total, Built (PASS), STUCK, SKIPPED, ERRORS.

## Important

- **Build with MUI or shadcn components.** `reference-components/` is read-only spec for expected behavior.
- **VERIFICATION IS A HARD GATE.** Cannot start the next pattern until verification output exists for the current one.
- **If you cannot invoke the verifier agents, perform their checks yourself.** Read the agent definitions and apply every check manually.
- All spacing and layout must use Harmony design tokens. No arbitrary values.
- Pattern markdowns are the source of truth. They are framework-agnostic design blueprints.
- Do not simplify, stub, or placeholder any pattern. If the markdown says 7 view options, the built page has 7 view options.
- Checkpoint every 5 patterns. Do not build more than 5 without user confirmation.
