# Conversion fidelity principles

Canonical definition of **what verify compares** and **how compare works**. All converter playbooks and **conversion-verify** compare docs must align with this.

## North star

**Designer-equivalent fidelity:** a skilled Harmony designer reviewing reference vs converted implementation side by side would judge them **equivalent** for the scoped element — in **perceived look**, **act**, and **page content**.

- Same **perceived** colors, typography, spacing, elevation, and layout rhythm on the review surface
- Same **page content** — sections, headings, examples, labels, demo blocks, asset usage, counts
- Same variants and states visible on the doc page (primary, disabled, loading, etc.)
- Same interaction affordances (what looks clickable, what reads as disabled, focus visible)
- Same **accessibility outcomes** (equivalent name, role, state communicated to users — not identical DOM or ARIA markup)

**Designer bar for equivalence:** if a designer would notice a difference in a side-by-side review, it is a defect unless explicitly deferred with rationale in the defect report and manifest.

Implementation details (prop names, DOM shape, file layout, theme mapper existence) are **not** defects by themselves — only when they change what users **see** or **can do** on the review surface.

## Rendered evidence rule

Token JSON, theme mappers, and source file parity are **necessary, not sufficient** for PASS.

The verifier must judge what **appears** on the review surface (browser or host screenshot), including:

- Alpha compositing and background context (e.g. semi-transparent swatches on page vs card surfaces)
- Product theme and light/dark mode switches
- Responsive layout at breakpoints where reference demonstrates behavior

Source-only review cannot justify PASS. See [DESIGNER_COMPARE.md](../../conversion-verify/reference/DESIGNER_COMPARE.md) and [VISUAL_MATCH_GATE.md](../../conversion-verify/reference/VISUAL_MATCH_GATE.md).

## Visual match gate

The **gate is rendered appearance** for every scope (`demo`, `foundation`, `shell`, components, external). Full rules: [VISUAL_MATCH_GATE.md](../../conversion-verify/reference/VISUAL_MATCH_GATE.md).

Summary:

- DOM/CSS/source differences are **not** defects by themselves — only when they change what a designer **sees**.
- **CSS/DOM match ≠ visual match** when structure differs (e.g. same `paddingLeft` on different elements).
- Visual matrix rows require **Reference (rendered) | Converted (rendered) | Status** — never collapse to Item | Status.
- Scripts produce evidence; agents judge — probes never decide PASS/FAIL.
- Human confirms before visual gaps are `accepted` or manifest `synced`.

## Judgment-based compare — not a binary script

| Phase | Who | What |
|-------|-----|------|
| **Capture** | Scripts / MCP (automated) | Produce reproducible **evidence** (HTML snapshot, PNG, host JSON) |
| **Compare** | **Verifier agent (AI)** | Side-by-side review surfaces + content inventory + visual matrix; apply **designer** judgment; write defect report |
| **Pass/fail** | Agent-authored report | **PASS** when zero open defects after judgment — not when a script returns `diff === 0` |

There is **no** automated DOM diff, pixel-diff gate, or binary PASS/FAIL script for fidelity. Capture scripts **never** decide pass or fail — they only write artifact files.

Compare is the same kind of review a designer would do: browse both implementations, inventory content, compare rendered appearance, note gaps in plain language.

**Never substitute:** CSS property equality on mismatched elements, reference token copied into wrong DOM context, or probe output for side-by-side visual judgment.

## What is explicitly not required

| Not required | Why |
|--------------|-----|
| Identical HTML or DOM trees | Different frameworks and component libraries produce different markup |
| Same prop names or parameter syntax | `variant="primary"` vs `color="primary"` vs Figma variant property |
| Same element types (`button` vs `div` with role) | MUI, Figma, Vue, etc. have their own primitives |
| Same class names or CSS variable names on nodes | Token mapping is internal to each target |
| Same capture artifact format across targets | Figma has no HTML; some targets may use JSON or MCP-native views |
| Same JSON token string when rendered appearance matches | Judge rendered swatch, not file equality |

A defect is **never** "converted uses `<div>` instead of `<button>`" or "prop is named `color` not `variant`" unless that difference prevents equivalent configuration or breaks user-visible behavior.

## API / parameter equivalence

Judge `api` only when missing configurability **changes visible states or examples** on the reference doc page:

| Reference (Harmony) | Converted (examples) | Equivalent when |
|---------------------|----------------------|-----------------|
| Astro prop / variant API | MUI component props + theme | Doc page shows same variant/state examples |
| `disabled`, `loading`, sizes | Target library props | Same states visible in demo |
| `theme-only` strategy | MUI primitive + Harmony `ThemeProvider` | Rendered result matches reference |
| Custom Harmony component | Package export or thin wrapper | Demo reproduces reference examples |
| Figma component | Component properties / variants | Screenshot shows same variant/state set |

File `api` defects when a reference capability has **no reasonable equivalent** that affects what designers or users see — not when names differ.

## Artifacts are evidence for judgment

Verify produces **artifacts** so the agent can judge with stable inputs:

| artifactType | Typical use | Compare still judgment-based |
|--------------|-------------|------------------------------|
| `html` | Rendered snapshot (component-library) | Agent compares look/act from live review + artifacts |
| `image` | Screenshot (Figma, visual hosts) | Agent compares visual intent section by section |
| `json` | Structured host data | Agent compares properties/structure semantics |
| `other` | Target-defined | Agent follows playbook |

**Manual capture is not allowed.** Scripts or MCP produce artifacts; the **verifier agent** performs compare.

## Compare dimensions (all targets)

Use these categories in defect reports ([DEFECT_REPORT.md](DEFECT_REPORT.md)). Phrase defects as what **a designer would see**:

| Category | Question (designer judgment) |
|----------|--------------------------------|
| `visual` | Does it **look** the same to a designer? Layout, spacing, alignment, icons, typography, **rendered** color |
| `behavior` | Does it **act** the same in the fixture? States and affordances match reference intent |
| `tokens` | Do **rendered** colors and typography match reference for theme/mode/product? |
| `structure` | Is reference **content** present? Sections, examples, labels, anatomy parts — not DOM parity |
| `a11y` | Equivalent **outcomes** for name, role, state — not attribute parity |
| `api` | Does missing configurability remove a **visible** variant/state from the doc page? |
| `mapping` | Does output match approved strategy in `conversion.manifest.json`? |

Weigh `visual`, `structure` (content), `behavior`, and `tokens` (rendered) highest — same as a designer sign-off.

## Who decides "good enough"

Fidelity is a **judgment call**. There is no repo-wide binary threshold and no script that finalizes acceptance.

| Role | Responsibility |
|------|----------------|
| **Converter playbook** (`converters/<id>/playbook/`) | Defines scope-specific acceptance criteria, known intentional gaps, and how verify/remediate applies to this target (MUI, Figma, etc.) |
| **Verifier agent** | Side-by-side review, content inventory, visual matrix; writes defect report with **recommendation** (PASS / FAIL / blocked). **Must not** mark visual defects `accepted` without human confirmation. |
| **Human** | Reviews report and plan; accepts or rejects; decides when remaining gaps are acceptable — **required** before `synced` |
| **conversion-agent (execute)** | Updates `conversion.manifest.json` only after **human confirms** scope is good enough — not on verifier PASS alone |

Global skills (**conversion-verify**, **conversion-fidelity-verifier**) **route and capture** — they do **not** own acceptance criteria or final sign-off.

### Acceptance outcomes

| Outcome | When | Manifest / report |
|---------|------|-------------------|
| **Verifier recommends PASS** | Content inventory complete + visual matrix clean + zero open defects | Human still confirms before `status: synced` unless user explicitly said "mark synced if PASS" |
| **Human accepts with known gaps** | Human agrees deferred/blocked defects are OK for this release — including **skipped** reference features with no target equivalent (per `AskQuestion` + manifest `gaps`) | Record in `elements.<scope>.userDecision`; defect status `deferred` or `accepted`; `status` may be `synced` or `gap` per human + converter playbook |
| **Not good enough** | Open defects remain and human has not accepted | Keep `in-progress` or `gap`; remediate or re-plan |

Use **AskQuestion** when the verifier reports FAIL but remediate is costly, or PASS with `deferred` items — human chooses: remediate, accept gap, or block.

### Converter playbook requirement

Each converter `playbook/VERIFICATION.md` must include an **Acceptance** section:

- What "good enough" means for this target (per scope type if needed)
- Intentional differences (e.g. MUI-native patterns Figma cannot represent)
- When to recommend PASS with deferred items vs FAIL
- How human acceptance is recorded (`userDecision`, plan approval, defect report notes)

## Per-target capture (converter-owned)

Each converter declares in `playbook/VERIFICATION.md`:

1. **artifactType** — how converted evidence is obtained
2. **Capture** — automated only (Playwright, MCP, etc.) — **no compare logic in scripts**
3. **Compare** — designer judgment per this document, [DESIGNER_COMPARE.md](../../conversion-verify/reference/DESIGNER_COMPARE.md), and [VISUAL_MATCH_GATE.md](../../conversion-verify/reference/VISUAL_MATCH_GATE.md); scope-specific notes
4. **Remediate** — fix gaps per target playbook

## Capture fixtures (not DOM templates)

A **capture fixture** is a reproducible render of the scoped element (variants + states) at a known URL or host node — typically the reference docs page and the conversion demo page declared in the target `playbook/VERIFIER.md`.

Fixtures make **evidence** reproducible (theme, mode, variants). They do not define a binary compare target.

## Related

- [VERIFICATION_LOOP.md](VERIFICATION_LOOP.md)
- [DEFECT_REPORT.md](DEFECT_REPORT.md)
- [DESIGNER_COMPARE.md](../../conversion-verify/reference/DESIGNER_COMPARE.md)
- [VISUAL_MATCH_GATE.md](../../conversion-verify/reference/VISUAL_MATCH_GATE.md)
- `.cursor/skills/conversion-verify/reference/COMPARE_HTML.md`
- `.cursor/skills/conversion-verify/reference/COMPARE_IMAGE.md`
