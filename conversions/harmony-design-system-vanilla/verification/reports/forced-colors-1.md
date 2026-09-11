# Forced-colors-1 — Vanilla High Contrast

| Field | Value |
|-------|-------|
| Scope | Cross-cutting `forced-colors: active` / Windows High Contrast |
| Target | `harmony-design-system-vanilla` |
| Date | `2026-09-04` |
| Engineer | Agent execute of `plans/forced-colors.md` |

## Summary

Shipped a dedicated forced-colors CSS layer into all four product builds (npm + static). Demo Shadow DOM sheets include local HC fallbacks. Playbooks and consumer docs document the contract.

**Build / ship evidence: PASS**  
**Human acceptance: PASS** (2026-09-09 — “Changes look good”)

## What shipped

| Artifact | Status |
|----------|--------|
| `packages/ui/src/styles/forced-colors.css` | Added — token remaps + light-DOM focus/control helpers |
| `packages/ui/scripts/build-product.mjs` | Concatenates forced-colors after flatten |
| Demo document + Shadow sheets | HC rules in `demo.css`, `DemoApp`, `DemoHeader`, `DemoNav`, `DemoCoverage`, `shared`, `pageStyles`, `foundationShared` |
| Colors demo Accessibility | New “Windows High Contrast” card |
| Playbook SKILL / VERIFICATION / VERIFIER | Forced-colors required for future components + verify gate |
| CONSUMER / AGENTS / llms / colors.md | Documented automatic OS behavior |

## Build evidence

`node packages/ui/scripts/build-product.mjs --all` — exit 0.

| Product | npm `styles.css` has `@media (forced-colors: active)` | `--page-bg: Canvas` present | Static kit same |
|---------|------------------------------------------------------|-----------------------------|-----------------|
| cp | Yes | Yes | Yes |
| vp | Yes | Yes | Yes |
| ppm | Yes | Yes | Yes |
| maconomy | Yes | Yes | Yes |

Flattened product tokens remain intact above the forced-colors section (e.g. light `--page-bg: #…` still present outside the media query).

## Manual Windows Contrast Themes matrix

**How to run (human):** Settings → Accessibility → Contrast themes → apply theme. Demo: `http://localhost:5178` (`npm run dev` from conversion root).

| Case | Product | Theme | Mode | Routes | Result |
|------|---------|-------|------|--------|--------|
| A1 | CP | One representative (e.g. Aquatic) | light + dark | chrome + `/foundation/*` | _pending_ |
| A2 | VP | Aquatic | light + dark | chrome + `/foundation/*` | _pending_ |
| A3 | VP | Desert | light + dark | chrome + `/foundation/colors` | _pending_ |
| A4 | VP | Dusk | light + dark | chrome + `/foundation/colors` | _pending_ |
| A5 | VP | Night Sky | light + dark | chrome + `/foundation/colors` | _pending_ |
| A6 | PPM | Same representative as A1 | light | chrome + colors | _pending_ |
| A7 | Maconomy | Same representative as A1 | light | chrome + colors | _pending_ |

### Pass criteria (per VERIFICATION.md)

- Readable body and chrome text
- Visible control borders and `:focus-visible` outlines (Tab through header product select + mode toggle)
- Nav current page and hover distinguishable without hue alone
- Elevation cards keep a border when shadows are suppressed
- Color swatches retain borders; Accessibility section documents HC
- No reliance on document CSS fixing Shadow DOM internals

### Optional DevTools substitute

Chrome/Edge → Rendering → **Emulate CSS media feature forced-colors: active** — useful for quick checks; still confirm at least one real Windows Contrast Theme before accepting.

## Defects

None from build evidence. Visual HC defects TBD after human matrix.

## Recommendation

Accepted by human (2026-09-09). Forced-colors infrastructure, demo fallbacks, and docs are complete. Future `harmony-*` components must include Shadow-local forced-colors rules (playbook hard rule).
