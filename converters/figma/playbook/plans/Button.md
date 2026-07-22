# Conversion plan — Button (Figma VP)

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Button` |
| status | `approved` |
| createdAt | `2026-07-22T02:30:00.000Z` |
| approvedAt | `2026-07-22T20:53:00.000Z` |
| product | `vp` |
| referenceVersion | `0.9.0` |

## Summary

Major redo of the existing Button component set (`nodeId` `6:2`) **in place** to match the **shadcn** Consumer API and rendered appearance. Reset from TEST-RUN `synced` → `not-started`. Hard deps (Icon + Dela + foundation) are `synced`. Visual baseline = shadcn demo `/components/buttons` (VP).

## Blocking dependencies

| Element | blockedBy | Action |
|---------|-----------|--------|
| — | — | Icon `44:28`, Dela, Colors/Typography/Spacing/Elevations are `synced` |

## Element strategy (user confirmed)

| Element | Strategy | userDecision |
|---------|----------|--------------|
| Button | `figma-component` | Full Consumer API mirror; update-in-place node `6:2`; shadcn visual baseline |

## Figma strategy packet (user confirmed)

### Consumer API → Figma props

| shadcn prop | Figma type | Notes |
|-------------|------------|-------|
| `variant` | VARIANT | primary, secondary, tertiary, outline, ghost, destructive, dela, dela-pill |
| `size` | VARIANT | xs, sm, md, lg |
| `buttonType` | VARIANT | theme, pageHeader (ignored visually for dela; still exposed) |
| `orientation` | VARIANT | horizontal, vertical |
| `iconPosition` | VARIANT | left, right |
| `disabled` | BOOLEAN | disabled paint / opacity (wired) |
| `loading` | BOOLEAN | spinner layer on; default content off |
| `loadingText` | TEXT | beside spinner when loading |
| `icon` | INSTANCE_SWAP | → **public Icon `44:28`** (not raw Icons-library glyphs; not legacy IconGlyph) |
| `fullWidth` | BOOLEAN | stretch layout wired on master/samples |
| label (`children`) | TEXT `label` | characters reference |
| HTML `state` | VARIANT | default \| hover \| focus — Figma-only |
| `asChild`, `className`, DOM `type`, handlers, `href` | **deferred** | out of Figma chrome |

### HTML `state`

- Values: `default` \| `hover` \| `focus`
- Hover: While Hovering → Change to matching `state=hover` sibling
- Axis: nested on X with `size`

### Axis plan (confirmed)

| Axis | Props |
|------|-------|
| X | `size` › `state` (hierarchy) |
| Y | `variant` |

**Ship grid:** `variant` × `size` × `state` = **96 cells**. Additional VARIANTs (`buttonType`, `orientation`, `iconPosition`) exposed; only default combinations authored where paint/layout differs; non-default combos on samples.

BOOLEAN/TEXT/INSTANCE_SWAP: `disabled`, `loading`, `loadingText`, `icon`, `fullWidth`, `label`.

### Tokens / wiring

- Dela / dela-pill → `Dela/gradient` + `dela-foreground` (+ Stars where shadcn shows it)
- secondary/tertiary/pageHeader → `--theme-btn-*` Color variables
- Typography/Button/xs|sm|md|lg text styles
- `icon` INSTANCE_SWAP → public Icon `44:28`
- All declared non-deferred props must have `componentPropertyReferences`

### Code Connect (icon string)

Shadcn `Button.icon` is a **string** (Harmony name), not a React node. Do **not** emit `icon={<Icon … />}`. Extract the nested Icon’s `name` INSTANCE_SWAP component name:

```ts
const iconInst = instance.getInstanceSwap('icon')
let iconName: string | undefined
if (iconInst && iconInst.type === 'INSTANCE') {
  const glyph = iconInst.getInstanceSwap('name')
  if (glyph && glyph.type === 'INSTANCE') iconName = glyph.name
}
// emit: iconName ? `icon="${iconName}"` : ''
```

Full templates: [`code-connect.md`](code-connect.md).

### Token / efficiency forecast (acknowledged)

From `estimate-apply-cost.mjs --axes 8,4 --states 3 --samples 20`:

| Risk | Level | Mitigation (hard) |
|------|-------|-------------------|
| Grid / volume | **High** (96 cells) | One master template + clone; parent owns sequential `use_figma`; no Task batch apply |
| Payload | Low | No SVG/CSS/token dumps through chat; Node prep via Shell |
| Loop | Med | One-pass; 1–2 captures + compact audit (URL + `curl.exe`) |
| Deps / redo | Low | Icon + Dela synced; axes locked before apply |

**No trim** — ship all three `state` values.

### Apply constraints (mandatory)

1. One master template + clone for 96 cells — forbid per-cell from-scratch
2. Parent owns writes — no Task for batch apply/remediate
3. No large payloads in chat; prefer Shell Node helpers; no Read of large apply files into transcript
4. One-pass apply; update-in-place `6:2` only; no recreate
5. Screenshots: URL + `curl.exe` only; max 1–2 per verify cycle
6. Compact `use_figma` returns (counts/ids/defects)
7. Axes locked mid-apply — remediates fix paint/wiring only

### Update-in-place

- Keep component set `nodeId` `6:2`
- Never delete/recreate the set
- Samples on `Components / Buttons` → `Page content`
- After structural edits → `needs-publish` before Code Connect rewrite

## Phases

1. Apply in place (inventory + tokens + grid + samples)
2. Implementor ↔ figma-verifier until PASS (shadcn reference capture)
3. Human review → `needs-publish` → publish → Code Connect → AskQuestion → `synced`

## Approval

**Status: approved** — strategy packet (inventory, axes X=`size`›`state` / Y=`variant`, deferred, tokens, Token forecast, Apply constraints) confirmed via Cursor plan execute 2026-07-22.

## Post-apply

| Field | Value |
|-------|-------|
| Host status | `review` (verifier PASS Button-3) |
| nodeId | `6:2` (held) |
| Grid | 106 children ≈ 96 + pageHeader/vertical/iconRight + hover extras |
| Reports | `verification/reports/Button-2.md` FAIL → `Button-3.md` PASS |
| Artifacts | `reference-Button.png`, `vp-Button.png` |

### Token retrospective (qualitative)

| Forecast | Actual |
|----------|--------|
| Grid High (96) | Held — expand-in-place (clone+appendChild) after empty-set invalidation lesson; no Task batch apply |
| Payload Low | Held — no SVG dumps; Stars cloned from existing Dela asset `86:34` |
| Loop Med | One FAIL→remediate→PASS cycle (Button-2 → Button-3); 2 screenshot captures total for verify |
| Deps Low | Held — Icon/Dela already synced |
| Inefficient moments | First apply attempts emptied the set (invalidates COMPONENT_SET) — fixed by never clearing all children; stroke bind field must be `color` not `STROKE`; reactions use `actions[]` + `ON_HOVER` |
| Kept efficient | Parent-owned sequential `use_figma`; curl-only screenshots; compact returns; master-clone pattern for 96 cells |
