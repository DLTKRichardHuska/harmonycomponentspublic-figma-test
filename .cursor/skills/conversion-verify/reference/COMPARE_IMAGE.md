# Image artifact compare (readonly)

Used by **external** target verifier agents (e.g. Figma) when `artifactType: image`.

**Read first:**

1. [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md)
2. [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md) — **mandatory** visual match gate (all scopes)
3. [DESIGNER_COMPARE.md](DESIGNER_COMPARE.md) — **mandatory** designer walkthrough

Image compare when the target has no HTML (Figma, etc.). Same north star and **same gate** as browser targets — designer-equivalent look, act, and visible content parity. Evidence is a PNG pair instead of live browse.

## Inputs

| Artifact | Source | Path pattern |
|----------|--------|--------------|
| Reference | Shadcn/demo or docs PNG per target playbook (e.g. `capture-shadcn-reference.mjs` for Figma) | `verification/artifacts/reference-<scope>.png` |
| Converted | Host MCP (e.g. Figma `get_screenshot`) | `verification/artifacts/<scope>.png` |

Reference images are **never manual** — follow the target `playbook/VERIFIER.md` capture steps.

If converted screenshot unavailable (MCP blocked) → **BLOCKED** — do not PASS from reference image alone.

## Compare process

1. **Content inventory** — list every section, label, variant, and text node visible in reference doc page; map to Figma frame/layer structure per DESIGNER_COMPARE § C.
2. **Visual matrix** — compare reference PNG to converted PNG section by section, variant by variant; judge **rendered** color, spacing, typography, elevation, **alignment** per DESIGNER_COMPARE § D and VISUAL_MATCH_GATE.md. Use **Reference (rendered) | Converted (rendered) | Status** columns — not Item | Status.
3. Load reference Astro source and Figma property defs to resolve ambiguities — not as substitute for image compare.
4. Record defects per [DEFECT_REPORT.md](../../harmony-conversion/reference/DEFECT_REPORT.md) with designer phrasing.

Judgment-based — no automated pixel diff gate.

## Check categories

| Category | What to compare |
|----------|-----------------|
| `visual` | Layout, spacing, alignment, iconography, **rendered** color |
| `tokens` | Color and typography vs reference **as shown in images** |
| `structure` | Missing sections, labels, variant tiles, component parts |
| `behavior` | States shown in Figma (hover, disabled) when reference demonstrates them |
| `api` | Only when missing Figma properties remove a **visible** variant from the frame |

## Limitations

Image compare cannot verify focus order, keyboard interaction, or live ARIA. Flag required a11y checks as `deferred` with reason when Figma cannot represent them — do not silently PASS.

## Figma capture

Target verifier agent calls **user-Figma** MCP per target `conversion/VERIFICATION.md` — never manual export from Figma UI.

If MCP unavailable → **BLOCKED: cannot verify.**

## Output

Recommend PASS only when content inventory and visual matrix are clean per [VISUAL_MATCH_GATE.md](VISUAL_MATCH_GATE.md):

**PASS: zero conversion defects.**

Human must confirm before manifest `synced` — **AskQuestion** via **conversion-agent** even on verifier PASS.
