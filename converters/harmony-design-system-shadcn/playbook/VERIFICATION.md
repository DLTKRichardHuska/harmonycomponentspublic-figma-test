# Verification — harmony-design-system-shadcn

Capture is scripted; compare is verifier-agent judgment; **acceptance is converter playbook + human**.

See [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [VISUAL_MATCH_GATE.md](../../../.cursor/skills/conversion-verify/reference/VISUAL_MATCH_GATE.md).

## UX designer review lens (hard)

Verify each element **as a UX designer** reviewing reference vs converted side by side — not as a DOM auditor.

| Judge | Do not judge as defects |
|-------|-------------------------|
| Perceived look (color, type, space, elevation, rhythm) | Identical HTML / DOM trees |
| Behavior and interaction affordances | Same element types (`button` vs Radix/`div`+role) |
| Doc page content (sections, examples, labels, counts) | Same class names or CSS variable names on nodes |
| Accessibility **outcomes** (name, role, state for users) | Matching Astro markup structure |

**HTML differences are expected and often desired** — they are how this conversion leverages shadcn/ui + Tailwind + Radix elegantly. Never FAIL solely because markup differs from the reference Astro library. FAIL only when a designer would notice a difference in look, behavior, or page content (unless deferred with `userDecision` / gaps).

## Surfaces

| Surface | URL |
|---------|-----|
| Reference Astro | `http://localhost:4321` |
| Converted demo | `http://localhost:5177` (`apps/demo`, `npm run dev` from conversion root) |

## Bootstrap checks (demo harness)

FAIL bootstrap scope if any missing:

- Getting Started at `/getting-started` is **first** nav item before Changelog
- Home `/` Quick Start leads with **Installation** → `/getting-started`
- Demo imports package only by `@dltkrichardhuska/harmony-design-system-shadcn/...`
- `ImportSnippet` helper exists under `apps/demo/src/demo/ui/`
- Sidebar shows **Coverage** for the current `referenceVersion`
- Demo reproduces the reference's **product/theme-driven nav sections** — switching product surfaces that product's package deliverables in a `"<Product> Components"` sidebar group (e.g. CP → Floating Nav, Kanban), matching `renderThemeSpecificNav` + `theme-config.ts` in the reference. "Reproduce structure" is intent-level: it includes runtime product-driven nav and per-product deliverable demos, **not** static href coverage alone. Runtime nav lives in the demo chrome and is unaffected by the packages' "composition, not runtime switching" decision (that governs delivered packages only).

## Converted page docs checks

For each converted demo page (foundation/components/shell):

- Element-specific package import snippet present (published package name)
- Does **not** repeat full Getting Started global setup (may link to `/getting-started`)
- Snippets match actual `packages/ui` exports

## Consumer API / AI artifact checks

For each synced or in-progress **`component`** package export:

- Public TypeScript/React surface matches the approved **Consumer API** in the plan / `userDecision`
- `docs/components/<Name>.md` includes prop **and** event/callback / polymorphism tables consistent with that approval
- Docs must cover **both** approved slices: (a) **Harmony-specific** props and (b) **inherited / stack / code-added** surfaces — FAIL if either slice is missing from AI docs while present in the packet / public TypeScript surface
- Docs include stock-shadcn / Hybrid C **Don’t** guidance where relevant
- `AGENTS.md` / `llms.txt` do not contradict the approved surface; `llms.txt` barrel lists the new exports; `docs/components/README.md` indexes the doc
- Catalog name ≠ export name → catalog→export map updated in AGENTS/llms
- Missing an approved interactive or configurability surface → FAIL (docs defect if code is correct but AI artifacts omit it)

Visual fidelity rules are unchanged. Completeness is vs the **approved Consumer API**, not 1:1 Astro — do not invent API requirements beyond the approved packet (including Astro props intentionally omitted).

## Stack elegance checks

- No undocumented foreign UI libraries or non-stack styling systems
- Approved exceptions must appear in manifest `userDecision` / `gaps[]`
- New stack friction found during verify → FAIL until AskQuestion + recorded decision
- Prefer stack-native markup even when it differs from Astro — do not remediate toward reference HTML
- Prefer Tailwind **preset utilities** over avoidable `var(--…)` in new/changed component classes (spot-check) — FAIL systematic regressions like `bg-[var(--card-bg)]` / `gap-[var(--space-` / `duration-[var(--transition-`
- `--transition-*` must not reappear in `packages/ui` tokens or classes
- Registry items (if in scope): no Lucide / no `iconLibrary`

## Loop

1. Capture pair (reference vs demo) for scope
2. Verifier recommends PASS/FAIL with **designer** side-by-side visual/behavior summary (not DOM diff)
3. AskQuestion: visual/behavior match acceptable? (remediate / accept gap / reject)
4. Remediations subject to stack elegance — no silent purity/stack exceptions; do not “fix” by cloning Astro HTML
5. Human confirms before `elements.<scope>.status = synced`
6. `compute_coverage.mjs --conversion harmony-design-system-shadcn --write`

## Defect reports

Write under `conversions/harmony-design-system-shadcn/verification/reports/<Scope>-<n>.md`.
