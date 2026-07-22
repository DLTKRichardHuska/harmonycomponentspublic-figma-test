# Verification playbook — figma

Converter id: `figma`  
**artifactType:** `image`  
**Verifier agent:** `playbook/VERIFIER.md` (invoked as **figma-verifier**)  
Path: `converters/figma/`  
Host: Figma via MCP (`user-Figma`)

Compare follows [FIDELITY_PRINCIPLES.md](../../../.cursor/skills/harmony-conversion/reference/FIDELITY_PRINCIPLES.md) and [DESIGNER_COMPARE.md](../../../.cursor/skills/conversion-verify/reference/DESIGNER_COMPARE.md): **designer-perceived** look, behavior (prototype), and configurability vs the **shadcn** reference — not layer-tree parity alone.

> **Manual capture is not allowed.** Reference images via **shadcn demo** capture (`capture-shadcn-reference.mjs`); Figma side via MCP `get_screenshot` + curl save only.

## Artifact model

| Role | Format | Location |
|------|--------|----------|
| Reference | PNG from **shadcn demo** (product theme) | `verification/artifacts/reference-<scope>.png` |
| Converted | PNG from Figma MCP | `verification/artifacts/<product>-<scope>.png` |
| Reports | Markdown | `verification/reports/<scope>-<iteration>.md` |

---

## Capture (automated)

### 0. Resolve target

```bash
node converters/figma/scripts/resolve-capture-target.mjs --product <vp|ppm|maconomy|cp> --scope <ElementKey>
```

Prints `fileKey`, artifact path, and MCP args. Then read `nodeId` from the bound file:

```js
// use_figma (readonly)
const state = JSON.parse(figma.root.getSharedPluginData('harmony', 'conversionState') || '{}');
return state.elements.<ElementKey>.nodeId;
```

### 1. Reference (shadcn demo)

```bash
node converters/figma/scripts/capture-shadcn-reference.mjs --scope <scope> --product <vp|ppm|maconomy|cp> --out converters/figma/verification/artifacts/reference-<scope>.png
```

Do **not** use Astro `capture-reference.mjs` for Figma component fidelity. (Astro capture remains for other converters.)

### 2. Converted (Figma MCP)

1. Confirm **user-Figma** MCP available — else **BLOCKED**.
2. `resolve-capture-target.mjs` + `conversionState.elements.<scope>.nodeId`.
3. Call MCP **`get_screenshot`** with `fileKey`, `nodeId`, prefer `maxDimension: 2048`.
4. **Hard — no base64 in context:** never set `enableBase64Response: true`. Never rely on inline image/base64 tool output as the saved artifact. Never use `await node.screenshot()` for verification capture (rare single-glyph debug only, outside this path).
5. Save PNG from the returned **URL** only (PowerShell: use `curl.exe`, not alias `curl`):

```bash
curl.exe -L -o converters/figma/verification/artifacts/<product>-<scope>.png "<screenshot-url>"
```

Embedding screenshot base64 into the agent transcript = **process defect** (re-capture correctly).

Verify against the **VP canonical** file first; derived files (PPM/Maconomy/CP) are spot-checked for brand/hue/superset deltas rather than fully re-walked.

**Icon / Icons library:** prefer one screenshot of Icons-library glyphs (or a representative grid) + one of product page samples (`Components / Icons`). Structure/token checks via compact `use_figma` return (counts / defect ids) — not per-glyph image dumps. Glyph art audit targets the **shared Icons library** file, not a product-local `IconGlyph` set.

---

## Compare (readonly)

The **figma-verifier** agent runs the designer walkthrough per [COMPARE_IMAGE.md](../../../.cursor/skills/conversion-verify/reference/COMPARE_IMAGE.md).

**Persona:** designer building a Figma library component that looks, acts (hover prototype), and is configured like the **shadcn** reference.

| Step | Requirement |
|------|-------------|
| Content inventory | Every shadcn demo / docs example section vs Figma frame text/layers |
| Visual matrix | Each variant/state screenshot compared to shadcn |
| Layout and spacing | `visual` |
| Color and typography | `tokens` / `visual` — judge rendered appearance |
| Token binding | `tokens` — fills/strokes/text color bound to `Color` vars; text uses `Typography` styles; shadows use `Elevation` effect styles (logo image exempt). Unbound paint = defect |
| Variants and states | `structure` / `visual` |
| Variant grid | `structure` — VARIANT props laid out on confirmed X/Y axes (hierarchy only if 3+ props); component set keeps dashed purple outline |
| HTML states | `structure` / `visual` — when plan includes `state`, values match confirmation; `default` cells have While Hovering → Change to `hover` where `hover` exists; paints match CSS pseudo-classes |
| Consumer API completeness | `structure` — every shadcn doc/cva prop either present in Figma (wired) or listed deferred with rationale; no silent omissions |
| Property wiring | `structure` — no orphan BOOLEAN/TEXT/INSTANCE_SWAP (defs without `componentPropertyReferences`); VARIANT options match confirmed inventory |
| Glyph art (Icons library) | `structure` / `tokens` — when scope is Icon: GROUP not Frame; SCALE/SCALE; filled (Outline Stroke), no live stroke; fill bound to `text-primary`; component name = shadcn `name`. Product Icon: `size` + `name` INSTANCE_SWAP → library |
| Update-in-place | `structure` — if host state had a prior `nodeId` for this element, the verified set must still be that node (recreate = defect) |
| Publish-ready | `structure` — **hard fail before PASS / `needs-publish`:** unused props block Figma library publish; refuse PASS while orphans remain. Code Connect must not be attempted until publish-ready + human publish |
| Labels and iconography | `visual` |

Flag a11y gaps Figma cannot represent as `deferred` with explicit rationale.

Write defect report per [DEFECT_REPORT.md](../../../.cursor/skills/harmony-conversion/reference/DEFECT_REPORT.md) including **Content parity** and **Visual parity** sections. Prefer `converters/figma/verification/reports/` (external target — no `conversions/figma/`).

### Token retrospective (orchestrator — at PASS → `review`)

The **readonly verifier does not invent cost metrics**. When the conversion-agent / implementor promotes the element to `review` after PASS, append a **Token retrospective** to the same report (and the human handoff). Required fields: Forecast vs actual; Inefficient moments; Kept efficient; Follow-ups (1–3). Qualitative only — no fabricated token counts. See playbook Step 3. A PASS→`review` handoff without this section is **incomplete**.

## Acceptance (good enough)

**Designer bar** — both PNGs reviewed; content + visual matrices clean; Figma configurable like shadcn.

| Scope | Good enough when |
|-------|------------------|
| **foundation** | Token swatches, typography samples, spacing/elevation examples match product × mode |
| **component** | Every shadcn demo example variant/state visible in Figma with matching labels and wired props |

- **PASS:** Rendered evidence (both PNGs) + zero open defects + publish-ready. Implementor↔verifier loop continues until PASS; then human review/tweak.
- **Not sufficient:** node exists in Figma, reference PNG only, readiness stub, FAIL marked `synced`, partial Consumer API mirror
- **Defer / accept:** only for documented technology limits (a11y, interaction) with explicit rationale — never to skip incomplete API or visual debt

---

## Remediate

**Writable phase** — Figma MCP updates per defect, **in place** on the existing set (see playbook Update-in-place). Re-capture via MCP after edits; re-run designer walkthrough. Loop until PASS before handing to human.

---

## Verify-only

Invoke **figma-verifier** agent. Capture + designer compare only; no Figma writes. Report PASS/FAIL; do not mark host `synced` from verify-only.
