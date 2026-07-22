# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Card` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-14T21:20:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 5 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/cards` (HTTP 200) |
| reference preview | Live review `http://localhost:4321/preview/cards` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/cards` (HTTP 200) |
| screenshots | `verification/artifacts/card-2/` (`ref-` / `conv-` light + dark `page` / `examples` / `a11y`; interactive hover) |
| probe | `verification/artifacts/card-2/probe.json` |
| icon measure | `verification/artifacts/diag/probe-card-2-icons.mjs` |
| hover measure | `verification/artifacts/diag/probe-card-2-hover.mjs` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS/FAIL. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

## Content parity

Inventory of reference `src/pages/components/cards.astro` vs converted `CardsDemo.tsx` at `/components/cards`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Cards + stable badge | present | |
| Page description | present | Same lead copy |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Basic Card | present | Same body copy |
| Example: Card with Header | present | Same title/subtitle/body copy |
| Example: Card with Header Icons (3 demos) | present | All Three / Close Only / With Subtitle |
| Example: Elevated Card | present | |
| Example: Interactive Card (2-up) | present | CardActionArea composite per locked decision |
| Example: Primary Border Card | accepted | Replaced by `UnsupportedEquivalentCallout` — locked `primary` skip |
| Example: Primary Border + Other Variants | accepted | Omitted with same callout — locked `primary` skip |
| Extra: Elevated + Interactive | accepted | Target-specific demo of raised + CardActionArea — not a gap |
| Props table (Harmony prop list) | present | Converted notes consumers use MUI APIs |
| Extra: Harmony mapping | accepted | Target-specific mapping table |
| Accessibility: Semantic Structure | present | MUI-framed copy |
| Accessibility: Interactive Cards | present | CardActionArea guidance |
| Accessibility: Focus Indicators | present | |
| Accessibility: Screen Reader Support | present | |
| Catalog dependency Icon | present | `synced` — header icons use `HarmonyIcon` |

**Content gaps (open):** 0

## Visual parity

Rendered appearance — CP product; light (primary) and dark confirmed.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic card shell (light) | Soft paper fill, 1px gray border, 12px radius, subtle sm shadow | Same paper / border / radius / sm shadow | present |
| Header title | Lexend ~18px / 24lh, primary text, normal weight | Same Lexend / size / weight / color | present |
| Header subtitle | 14px secondary muted | Same size / muted secondary | present |
| Body copy (light) | 14px regular muted secondary (`rgb(82, 89, 105)`) | 14px regular muted secondary (`rgb(82, 89, 105)`) via `body1` + `textSecondary` + CardContent theme | present |
| Header icon row | Three sm icons (~16×16), gear / ellipsis / X, right-aligned | Same glyphs/order at 16×16 (`HarmonyIcon size="sm"`) | present |
| Elevated (light) | Stronger lg shadow vs basic | Matching lg shadow via `raised` | present |
| Interactive rest (light) | Pointer affordance; sm shadow | CardActionArea pointer; matching shell | present |
| Interactive hover (light) | Primary blue border + lg shadow | Primary blue border + lg shadow (same computed border/shadow/bg) | present |
| Primary top border examples | 4px theme-primary top accent (+ combos) | Callout only — no accent demos | accepted |
| Dark mode paper / border | Dark card fill + muted border | Matching dark fill / border | present |
| Dark mode shadow (basic + elevated) | Black-based sm / lg (`rgba(0,0,0,…)`) | Matching black-based sm / lg via `applyStyles('dark')` | present |
| Dark interactive / elevated hierarchy | Clear elevation step on elevated | Matching dark elevation depth | present |
| A11y four-card stack | Four topic cards | Four equivalent topic cards | present |

**Visual gaps (open):** 0

## Examples purity / mapping checks

| Check | Status |
|-------|--------|
| Direct `@mui/material` Card / CardHeader / CardContent / CardActionArea / IconButton | PASS |
| `HarmonyIcon` for header icons | PASS |
| No file-local React wrappers around MUI in example zone | PASS |
| No invented Harmony props on Card (`elevated`/`interactive`/`primary` as API) | PASS — uses `raised` + CardActionArea composition |
| Fidelity `sx` for Harmony visual props | PASS — layout-only maxWidth / grid / Stack |
| `UnsupportedEquivalentCallout` for skipped `primary` | PASS |
| Manifest `propMappings` / `skippedProps` / `gaps` / `userDecision` | PASS — aligns with locked decisions |
| Composite `dependsOn: Icon` | PASS — Icon is `synced` |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Required before manifest `synced`. Locked `primary` skip already mirrored by callout + manifest; open visual defects from iteration 1 are fixed — human still confirms overall acceptance. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Card body text reads as **14px regular muted secondary** (`text-sm text-secondary`).
- **converted (iter 1):** Card body `Typography` read as **16px semibold primary**.
- **converted (iter 2):** Body uses `variant="body1" color="textSecondary"`; CardContent theme forces 14px / normal weight. Matches reference size and color (`rgb(82, 89, 105)`).
- **description:** Designer would no longer notice oversized/heavier/darker body copy.
- **evidence:** Live browse light examples; `ref-light-examples.png` vs `conv-light-examples.png`; `probe.json` bodyFontSize/bodyColor; icon probe body weight 400.

### DEF-002

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** In dark mode, default cards use black-tinted `shadow-sm`; elevated uses black-tinted `shadow-lg`.
- **converted (iter 1):** Light-mode slate shadows persisted in dark (`rgba(15, 23, 42, …)`).
- **converted (iter 2):** Dark sm/lg match reference (`rgba(0,0,0,0.3)` / `rgba(0,0,0,0.4)…`) via `theme.applyStyles('dark', …)` in `mapCardToTheme`.
- **description:** Designer would see matching dark elevation depth and tint.
- **evidence:** Live browse dark; `ref-dark-examples.png` / `conv-dark-examples.png`; `probe.json` dark shadows for basic + Elevated Card.

### DEF-003

- **status:** fixed
- **category:** visual
- **severity:** medium
- **reference:** Header action icons render at **~16×16** (Icon `sm`).
- **converted (iter 1):** Header icons ~21×21.
- **converted (iter 2):** `HarmonyIcon size="sm"` yields **16×16** SVG bounding boxes matching reference.
- **description:** Designer would no longer notice oversized gear / menu / close icons.
- **evidence:** Live browse header-icons examples; `probe-card-2-icons.mjs` (ref and conv all 16×16); screenshot pairs.

### DEF-004

- **status:** accepted
- **category:** structure
- **severity:** — (locked decision)
- **reference:** “Primary Border Card” and “Primary Border + Other Variants” show theme-primary top accent (alone and with elevated/interactive).
- **converted:** Those example blocks are omitted; top of Examples shows `UnsupportedEquivalentCallout` for `primary`.
- **description:** Expected omission per locked userDecision (`primary → skip with UnsupportedEquivalentCallout`) and manifest `skippedProps` / `gaps`.
- **evidence:** Live browse; callout visible in `conv-light-examples.png`; manifest Card `userDecision`.

### DEF-005

- **status:** accepted
- **category:** structure
- **severity:** — (target framing)
- **reference:** No “Elevated + Interactive” or Harmony mapping sections.
- **converted:** Extra “Elevated + Interactive” example + Mapping section / nav link.
- **description:** Target-specific additions that document MUI composition; not content gaps.
- **evidence:** Live browse converted Examples / Mapping.

## Blocked items

None — both review surfaces reachable (HTTP 200).

## Verifier notes

- Re-verify after remediation of DEF-001–003 from Card-1.
- All three remediations confirmed on rendered surfaces (light + dark CP).
- Locked decisions still honored: existing-mui Card; `elevated`→`raised`; `interactive`→CardActionArea; `primary` skipped with callout; header via CardHeader (+ IconButton / HarmonyIcon).
- Recommend PASS with zero open defects. Human AskQuestion still required before manifest `synced`.
