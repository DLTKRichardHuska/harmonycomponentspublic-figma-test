# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Card` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-14T21:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 5 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/cards` (HTTP 200) |
| reference preview | Live review `http://localhost:4321/preview/cards` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/cards` (HTTP 200) |
| screenshots | `verification/artifacts/card-1/` (`ref-` / `conv-` light + dark `page` / `examples` / `a11y`; interactive hover) |
| probe / inventory | `verification/artifacts/card-1/probe.json` |
| diag probe | `verification/artifacts/diag/probe-card-1.mjs` |

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
| Body copy (light) | 14px regular muted secondary (`rgb(82, 89, 105)`) | 16px **semibold** primary (`rgb(55, 63, 78)`) — denser, darker | **different** |
| Header icon row | Three sm icons (~16px), gear / ellipsis / X, right-aligned | Same glyphs and order, but icons ~21px — visibly larger | **different** |
| Elevated (light) | Stronger lg shadow vs basic | Matching lg shadow via `raised` | present |
| Interactive rest (light) | Pointer affordance; sm shadow | CardActionArea pointer; matching shell | present |
| Interactive hover (light) | Primary blue border + lg shadow | Primary blue border + lg shadow | present |
| Primary top border examples | 4px theme-primary top accent (+ combos) | Callout only — no accent demos | accepted |
| Dark mode paper / border | Dark card fill + muted border | Matching dark fill / border | present |
| Dark mode shadow (basic + elevated) | Black-based sm / lg (`rgba(0,0,0,…)`) | Light slate shadows still (`rgba(15,23,42,…)`) — flatter / wrong tint | **different** |
| Dark interactive / elevated hierarchy | Clear elevation step on elevated | Elevation step present but light-tint shadows weaken the dark reading | **different** |
| A11y four-card stack | Four topic cards | Four equivalent topic cards | present |

**Visual gaps (open):** 3

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
| Notes | Required before any visual gap `accepted` and before manifest `synced`. Locked `primary` skip already mirrored by callout + manifest; human still confirms overall acceptance after open defects are fixed or explicitly accepted. |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Card body text reads as **14px regular muted secondary** (`text-sm text-secondary`).
- **converted:** Card body `Typography` reads as **16px semibold primary** (MUI `body2` → Harmony bodyEmphasized; `color="text.secondary"` does not apply a secondary color class).
- **description:** Designer would see body copy that looks larger, heavier, and darker than the reference — closer to emphasized body than muted supporting text — on every card example.
- **evidence:** Live browse light examples; `verification/artifacts/card-1/ref-light-examples.png` vs `conv-light-examples.png`; `probe.json` bodyFontSize/bodyColor; computed `fontWeight: 600` on converted body Typography.
- **remediationHint:** Use a Typography mapping that matches reference `text-sm` + secondary (e.g. size/color that yields ~14px muted), and ensure the secondary color prop actually applies (`textSecondary` / theme path). Do not rely on `body2` here — theme maps `body2` to bodyEmphasized.

### DEF-002

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** In dark mode, default cards use black-tinted `shadow-sm`; elevated uses black-tinted `shadow-lg`.
- **converted:** In dark mode, cards still cast light-mode slate shadows (`rgba(15, 23, 42, …)`) for both default and `raised`.
- **description:** Designer would see flatter, wrong-tint elevation in dark mode — elevated cards do not read with the same depth as reference.
- **evidence:** Live browse dark; `ref-dark-examples.png` / `conv-dark-examples.png`; `probe.json` dark shadows; ref elevated `rgba(0,0,0,0.4)…` vs conv `rgba(15,23,42,0.1)…`.
- **remediationHint:** `mapCardToTheme.ts` hardcodes `elevations.shadows.*.value` (light). Use dark `valueDark` (or CSS vars that switch with mode) for `MuiCard` default and `raised` shadows.

### DEF-003

- **status:** open
- **category:** visual
- **severity:** medium
- **reference:** Header action icons render at **~16×16** (Icon `sm`).
- **converted:** Header `HarmonyIcon` inside small `IconButton` renders at **~21×21**.
- **description:** Designer would notice oversized gear / menu / close icons in the header action cluster relative to reference.
- **evidence:** Live browse header-icons examples; icon bounding boxes in probe session; `ref-light-examples.png` vs `conv-light-examples.png`.
- **remediationHint:** Size icons to Harmony `sm` (16px) — e.g. explicit HarmonyIcon size or IconButton fontSize that yields 16px SVG, matching reference `.card__icon-btn` + Icon `sm`.

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

- Locked decisions honored: existing-mui Card; `elevated`→`raised`; `interactive`→CardActionArea; `primary` skipped with callout; header via CardHeader (+ IconButton / HarmonyIcon).
- Interactive hover border/shadow match on light (theme `:has(.MuiCardActionArea-root:hover)` works).
- Shell/chrome not in scope; component page compare only.
- Cannot recommend PASS while DEF-001–003 remain open.
- After remediations, re-run iteration 2 verify before human AskQuestion / manifest `synced`.
