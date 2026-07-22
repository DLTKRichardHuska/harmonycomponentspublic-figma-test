# Conversion workflow (Cursor only)



Conversion sync, planning, execution, and fidelity verification run **only through Cursor agents and skills** with a **human in the loop** — not through npm scripts, manual CLI steps, or CI.

There are **no npm commands for conversion**. Agents invoke Node helper scripts via Shell when needed.



## Who does what



| Role | Responsibility |

|------|----------------|

| **Human** | Natural-language requests, review plans, approve execution, answer AskQuestion prompts |

| **conversion-agent** | Orchestrates modes: readiness, status, plan, verify-only, execute |

| **Target verifier agents** | Automated capture (via agent Shell) + compare + defect report |

| **Converter agents** (`converters/<id>/playbook/`) | Apply conversion steps; **recreate demo site** in component-library output (placeholders first) |

| **Node capture scripts** | **Agent implementation detail** — agents invoke via Shell; users never run these directly |



The npm scripts `conversion-targets:*` have been **removed**. Agents use `validate_converter.mjs` and `validate_conversion.mjs` via Shell — not a user interface.



## Natural language (primary interface)



Users coordinate with prompts like:



- *"Create a plan for updating the react+mui conversion to match the latest reference implementation"*

- *"Is the Button component converted to react+mui?"*

- *"What gaps are there in the current Button conversion's implementation?"*

- *"Verify the demo site has been converted properly"*



You may also use **`/conversion-agent`** with a mode or scope. Slash commands are shortcuts — not required.



## Intended user journey



```

1. Human edits reference     →  Astro Harmony DS (src/components/ui/, tokens, etc.)

2. Human asks (natural lang) →  conversion-agent picks mode (status, plan, verify, …)

3. Agent reads manifests     →  reports sync state, gaps, readiness

4. Human asks for plan       →  agent writes plan file; AskQuestion for ambiguities

5. Human reviews/adjusts     →  revise plan until satisfied

6. Human approves            →  explicit go-ahead

7. Agent executes            →  conversion-loop; agent runs capture scripts internally

8. Agent reports results     →  defect report, manifest updates, next steps in plain language

```



Steps are composable. The user can ask only for status, only for verify, or the full guided flow.



## Primary entry point



Load the **conversion-agent** skill. It maps user intent to modes and delegates to target playbooks and verifier agents.



## Phases (conversion-agent modes)



| Mode | Writable? | When to use |

|------|-----------|-------------|

| **readiness** | No | Are target playbooks/skills built enough to plan or execute? |

| **status** | No | What's synced vs reference; is component X converted; gap analysis |

| **plan** | Plan file only | Before any conversion; reviewable plan + AskQuestion |

| **execute** | Yes | **Only after user approval** |

| **verify-only** | Reports only | "Verify demo site / Button / foundation" — agent runs capture + compare |

| **guided** (default) | Mixed | Full journey when intent is open-ended |



## Human approval gate



**Never execute conversion (modify target output) without explicit user approval**, except when the user clearly requests a scoped test run.



If approval is ambiguous, use **AskQuestion** before execute mode.

## Conversion decisions: element strategy (mandatory user confirmation)

Before implementing any catalog element, the human chooses the **element strategy** — never assume a default. Target playbooks require **AskQuestion** before plan or execute.

**Vocabulary is per converter** — read `converters/<id>/converter.manifest.json` → `elementStrategies` (and the converter playbook). Do not use another target’s strategy ids.

| Converter | Typical choices | Manifest `strategy` |
|-----------|-----------------|---------------------|
| react-mui | Existing MUI / Custom export / Skip | `existing-mui` \| `custom` \| `skip` |
| shadcn | Package component / Skip | `component` \| `skip` |
| figma | Host component / Variable / Skip | `figma-component` \| `figma-variable` \| `skip` |

### React+MUI notes

**Deprecated aliases:** `theme-only` → same as `existing-mui`. **`thin-wrapper` is not valid** — wrappers defeat drop-in adoption for existing MUI projects.

### Sub-decisions for `existing-mui` elements

After element strategy is confirmed, inventory reference props/features and get user sign-off:

| Artifact | Manifest field | Purpose |
|----------|----------------|---------|
| Prop mappings | `propMappings[]` | Harmony prop → target prop/slot/children |
| Skipped props | `skippedProps[]`, `gaps[]` | No target equivalent; user accepts skip |
| Composite equivalents | `compositeEquivalents[]` | Harmony feature via composed target children — **demo-only inline JSX** in example demonstrations, component trees with props only; not package exports, MUI wrappers, or fidelity styling |

**React+MUI:** component demo files must not define local React components; doc scaffolding imports from `src/demo/ui/` only. Example demonstrations must not use inline `sx`/`style`/`className` to emulate Harmony catalog props — use theme augmentation in `map*ToTheme.ts` or **AskQuestion** for skip/custom. **Neutral layout sx** (`maxWidth`, Stack `spacing`/`gap`/`flexWrap` for arranging independent examples) is allowed only when it does **not** reproduce a Harmony prop. If the only way to match a Harmony feature is example styling (e.g. `justifyContent: 'flex-end'` for `buttonAlignment="right"`), that is fidelity `sx` — **AskQuestion** skip|custom during plan; during remediate, **AskQuestion** again — never silently add it to chase a verifier FAIL. See `converters/harmony-design-system-react-mui/playbook/SKILL.md` § Examples purity / Neutral layout sx vs fidelity sx.

**Static hover/focus docs columns:** when MUI only exposes CSS/MUI pseudo-states, do not invent staging `className`s — omit static Hover/Focus columns; verify via real interaction. **Do not** use `UnsupportedEquivalentCallout` for this docs presentation limit (callouts are for skipped component functionality only). Agents must **AskQuestion before any hard-rule exception** (purity, wrappers, invented props, staging classes); verifier FAIL does not authorize a purity violation. See playbook **No silent purity exceptions**.

**Workflow:** inventory → **AskQuestion element strategy** → (if existing-mui) prop/composite sign-off → **AskQuestion** for non-native sub-features (include **Skip**) → (if package export) **AskQuestion Consumer API** → record `gaps[]`, `propMappings`, `compositeEquivalents`, `skippedProps`, `userDecision` → implement only chosen paths → demo: skipped **functional** features use `UnsupportedEquivalentCallout` (not docs-presentation omissions).

**Skip does not apply to catalog dependencies** — see Hard dependencies below.

See [MANIFEST_GUIDE.md](MANIFEST_GUIDE.md) and converter playbook Step 4.

## Consumer public API (mandatory for package exports)

Reference Astro components are **visual and interaction demos**. They do **not** define a full library API for embedding in app code (events, polymorphism, controlled state, etc.). Conversions ship **usable package components** for other codebases, so each package export needs an explicit **consumer public API** — parameters, events, and patterns familiar to that target stack.

| When required | When not required |
|---------------|-------------------|
| react-mui **`custom`** exports and **custom sub-exports** (e.g. `DelaButton`) | react-mui **`existing-mui`** — consumers keep `@mui/material` APIs via theme |
| shadcn **`component`** package exports | **`skip`** |
| figma **`figma-component`** / **`figma-variable`** — use the playbook **strategy packet** (Figma property inventory + `state` + axes; identity-mirrors shadcn) | figma **`skip`** |

**Target stack wins.** Do not invent Harmony-shaped props from the Astro demo API when the platform has a familiar pattern:

| Converter | Design consumer API from |
|-----------|--------------------------|
| react-mui | Closest MUI analog (`Button`, `Chip`, `SvgIcon`, …) via MUI docs/MCP; if none, usual MUI component patterns (`sx`, event handlers, `...rest`) |
| shadcn | shadcn + Tailwind + Radix patterns (`cva`, `asChild`/`Slot`, HTML attribute spreads, Radix controlled props) — optimized for AI consumers |

### Consumer API packet (AskQuestion — wait for sign-off)

Before implementing (or changing) a package export’s public surface, present and get approval on:

1. **Base / analog** — closest platform component or pattern
2. **Inherited props / events / slots** — what is forwarded or mirrored from the analog
3. **Harmony-specific additions** — explicit list only
4. **Omissions / divergences** — intentional differences from the analog or from reference Astro props
5. **Docs impact** — demo, consumer guide, and (shadcn) AI artifacts (`docs/components/`, `AGENTS.md`, `llms.txt`)

Record the approved packet in the plan’s **Consumer API (user confirmed)** section and in element `userDecision` (prose). See [CONVERSION_PLAN.md](CONVERSION_PLAN.md).

### Initial convert and version / resync updates

| Situation | Gate |
|-----------|------|
| **Initial** convert of a package export | Full Consumer API packet before plan approval / apply |
| **Version bump or scoped re-verify** that introduces or changes consumer surface | Re-present packet for the **delta only** (new/changed props, events, polymorphism) — not a full re-approval of unchanged surface |
| Visual-only remediations that do **not** change the public TypeScript/React API | No Consumer API re-AskQuestion |

Execute must **not** ship or expand a package export’s public API without this sign-off. Plan approval that omitted Consumer API is incomplete for package-export scopes.

## Hard dependencies (catalog components)

Catalog components required by reference source or doc examples are **blocking**. Target-specific playbooks and **conversion-agent** enforce this at **plan**, execute, and verify.

| Rule | Detail |
|------|--------|
| **Order** | Convert dependencies to `synced` **before** marking dependents `synced` |
| **Complete means complete** | `synced` requires every reference doc example section — no missing parts due to unconverted dependencies |
| **No dependency skip** | Do not use `UnsupportedEquivalentCallout`, accepted gaps, or partial PASS to defer dependency work |
| **Plan gate** | Before any strategy AskQuestion for element X, inventory catalog deps from reference source + docs. If any required dep is not `synced`: **stop** — do not write `plans/X.md`, do not ask strategy/prop-skip questions for X |
| **AskQuestion** | When blocked, ask only *which dependency to plan next* (or confirm planning the blocker) — **not** whether to bypass. Human must convert blockers first |
| **Forbidden agent offers** | Never offer: partial / text-only convert of X, skip/defer dependency, callout in place of dep, or “do some of X now.” Only redirect to planning/converting the blocking dependency |
| **Circular deps only exception** | When A↔B cycle is genuine, partial work on **both** allowed while `in-progress`; **neither** `synced` until the full cycle is complete and verified |
| **Status source** | Component-library: `conversion.manifest.json`. **External (figma):** host `harmony`/`conversionState` — same gate rules; record `blockedBy` there |

Record `blockedBy: [<ElementKey>]` in the conversion manifest (or host state for external) while a dependent stays `in-progress`.




| User intent | Example prompt | What the agent runs |

|-------------|------------------|---------------------|

| Target readiness | "Is react+mui ready to convert Button?" | readiness + scope filter |

| Component status | "Is Button converted to react+mui?" | status + mapping + source read |

| Gap analysis | "What gaps in the Button conversion?" | status + gaps subsection |

| Full target status | "Status of conversion targets" | status all targets |

| Plan sync with reference | "Plan updating react+mui to match latest reference" | plan (scoped) |

| Plan one component | "Plan converting Button to react+mui" | plan + AskQuestion |

| Verify demo | "Verify the demo site has been converted properly" | verify-only → target verifier agent |

| Verify one component | "Verify Button conversion" | verify-only scoped |

| Execute (after approval) | "Go ahead with the Button plan" | execute → conversion-loop |



Scope values: `foundation` (alias → `Colors`, `Typography`, `Spacing`, `Elevations`, `Dela`), individual foundation page keys, `shell`, `components`, `<ComponentName>`, or `all`. Mark each foundation page `synced` separately after verify; do not use a single `elements.foundation` key.



## Verification (agent-driven + human sign-off)

When the user asks to verify:

1. **conversion-agent** (verify-only) resolves target + scope.
2. Invokes **target verifier agent** (e.g. **harmony-design-system-react-mui-verifier**).
3. Verifier loads [VISUAL_MATCH_GATE.md](../conversion-verify/reference/VISUAL_MATCH_GATE.md) — gate is **rendered appearance** for all scopes; DOM/CSS differences irrelevant unless visible.
4. Capture scripts produce **evidence only**; verifier **judges** fidelity and writes defect report with three-column visual matrix + PASS/FAIL **recommendation**.
5. **conversion-agent** presents **side-by-side visual summary** and **AskQuestion** — visual match acceptable? — before treating PASS as acceptance or updating manifest ([FIDELITY_PRINCIPLES.md](FIDELITY_PRINCIPLES.md), [VERIFICATION_LOOP.md](VERIFICATION_LOOP.md)).

Verifier PASS is not automatic sign-off. Human confirms visual match or accepts documented gaps. Never close layout/visual defects from CSS property match alone.



## Plan artifact



```

conversions/<conversion-id>/plans/<scope>.md

```



Format: [CONVERSION_PLAN.md](CONVERSION_PLAN.md)



## Execution engine



After approval, **conversion-agent** delegates to **conversion-loop**:



- Apply → converter `playbook/SKILL.md`

- Verify → target verifier agent + **conversion-verify**

- Remediate → target `conversion/VERIFICATION.md`



See [VERIFICATION_LOOP.md](VERIFICATION_LOOP.md).



## Example session



```

User: Is the Button component converted to react+mui?



Agent: [status — mapping shows theme-only strategy, capture fixture exists, not fully synced;

        lists gaps vs reference Button.astro variants]



User: What gaps are there in the current Button conversion?



Agent: [status — Gaps subsection: missing destructive variant in capture fixture, …]



User: Create a plan for updating react+mui to match the latest reference.



Agent: [plan — status sweep, phased plan file, AskQuestion on priority scopes]



User: Verify the demo site has been converted properly.



Agent: [verify-only — runs capture via Shell, invokes verifier, reports PASS/FAIL + report path]

```



## Reference-first



1. User completes reference design system changes.

2. Conversion always reads **current** Astro source as truth.

3. Agents read **`src/data/component-catalog.ts`** and **`src/data/navigation.ts`** directly for inventory and demo routes — no generated inventory JSON.

## Version and coverage

Each conversion tracks **`referenceVersion`** (repo release-train label, matching `package.json.version`) and **`coverage`**. See [COVERAGE.md](COVERAGE.md) and [RELEASE_READINESS.md](RELEASE_READINESS.md).

| Scenario | Engineering action |
|----------|-------------------|
| **New reference semver / release train** | Run `sync_conversion_versions.mjs`; reset element statuses when bare semver changes; `compute_coverage.mjs --write` → 0% |
| **Same version label, reference edited** | Do **not** auto-reset coverage — scoped re-verify only; note delta in plan |
| **Element verified + human accepts** | Set `synced` or accepted `gap` + `userDecision`; run `compute_coverage.mjs --write` |
| **Ready to release** | Run `validate_release_readiness.mjs --release-version <semver>`; user creates GitHub Release; workflow publishes packages |

**Portfolio orchestration:** use **`/conversion-management`** for status, plans, release readiness, and coordinated execution. Single-target work uses **`/conversion-agent`**.

## Demo site (conversion output — component-library only)

**Converter agents** (via target `playbook/SKILL.md`) recreate the reference demo site inside the paired conversion project. This does **not** apply to **external** converters — their preview is host-defined (e.g. Figma).

### First execute step

When conversion output needs a browsable demo (component-library type), **bootstrap the demo site first** — before foundation, shell, or component sync:

1. Read reference **`src/data/navigation.ts`** and **`src/data/component-catalog.ts`** — no parallel demo route registry.
2. Scaffold routing, nav shell, and a page for **every** reference doc route under `conversions/<id>/src/pages/` + `src/demo/`.
3. For each scope **not yet converted**, render a **placeholder** page (scope name, `not-started` / manifest status, link to reference doc). Same pattern as the Astro reference site’s unconverted stubs.
4. As scopes sync, replace placeholders with real demo modules under `src/demo/converted/` and update nav when reference nav changes.

The demo site is the conversion’s **verify harness** and human review surface — not optional for component-library targets.

### Ongoing

- Converted scopes: add or update modules in `src/demo/converted/`.
- Unconverted scopes: keep placeholder until that element is synced.
- Status sweeps: compare reference nav + catalog vs conversion demo routes and `src/demo/converted/`.

