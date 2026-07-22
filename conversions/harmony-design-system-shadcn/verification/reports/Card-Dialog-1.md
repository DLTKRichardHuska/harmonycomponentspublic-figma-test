# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Card`, `Dialog` |
| iteration | `1` |
| artifactType | `html` + `png` + `json` |
| generatedAt | `2026-07-20T20:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 4 |

**Result:** FAIL

**FAIL: open visual defect on Dialog close control (default header); minor content gaps on Card/Dialog docs.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/cards`, `http://localhost:4321/components/dialogs` |
| converted (live) | `http://localhost:5177/components/cards`, `http://localhost:5177/components/dialogs` |
| artifacts dir | `conversions/harmony-design-system-shadcn/verification/artifacts/card-dialog-1/` |
| reference cards top / full | `ref-cards-top.png`, `ref-cards-full.png` |
| converted cards top / full | `conv-cards-top.png`, `conv-cards-full.png` |
| cards elevated / interactive / primary | `ref-cards-*.png`, `conv-cards-*.png` |
| dialogs top / full | `ref-dialogs-top.png`, `conv-dialogs-top.png`, `*-full.png` |
| dialog open panels | `ref-dialog-basic-panel.png`, `conv-dialog-basic-panel.png`, `*-primary-*`, `*-right-*`, `*-three-*`, `*-combined-*`, `*-scroll-*`, `*-confirm-*` |
| probes | `ref-basic-probe.json`, `conv-basic-probe.json`, `ref-primary-probe.json`, `conv-primary-probe.json`, `conv-right-probe.json` |
| inventories | `ref-cards-inventory.json`, `conv-cards-inventory.json`, `ref-dialogs-inventory.json`, `conv-dialogs-inventory.json` |

## Content parity

### Card (`/components/cards`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Cards | present | Converted badge shows in-progress (expected pre-sync) |
| Intro description | present | Wording differs (stack-specific); intent matches |
| Examples / Props / Accessibility nav | present | |
| Basic Card | present | |
| Card with Header | present | As Convenience API + Compound header (approved dual-path) |
| Card with Header Icons (All Three / Close Only) | present | Via `CardAction` + `Button` icon (approved) |
| Header Icons — With Subtitle | missing | Reference third example (title + subtitle + three icons) not on demo |
| Elevated / Interactive / Primary / Primary+variants | present | |
| With Footer | present | Additive stack demo (compound) |
| Props table | present | Approved Consumer API (incl. `asChild`) |
| A11y: Semantic Structure / Interactive / Focus | present | |
| A11y: Screen Reader Support | missing | Reference fourth a11y card omitted |
| ImportSnippet (package) | present | Required conversion chrome |

**Content gaps (open):** 2 (With Subtitle example; Screen Reader a11y card)

### Dialog (`/components/dialogs`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Dialogs | present | |
| Examples / Props / Accessibility nav | present | |
| Basic Dialog | present | Convenience + composed footer demos |
| Confirmation / destructive | present | |
| Three buttons (Yes / No / Cancel) | present | Convenience tertiary |
| Right-aligned buttons | present | |
| Primary header | present | |
| Combined variants | present | |
| Long content (scrollable body) | present | |
| Controlled open | present | Additive (Radix); approved |
| Resizable Dialog | accepted | UnsupportedEquivalentCallout; manifest `gaps` / `userDecision` |
| Layout section | missing | Educational sticky-layout copy not on demo |
| Props tables | present | Split Content / Header / Footer — covers approved API |
| A11y cards | different | Focus trap / Labelling / Sticky vs ARIA / Keyboard / Focus / Screen Reader — outcomes covered, card set differs |
| ImportSnippet (package) | present | |

**Content gaps (open):** 1 (Layout section)

### Docs / import / Consumer API

| Check | Status |
|-------|--------|
| Element-specific ImportSnippet with package name | PASS |
| No duplicated Getting Started global setup | PASS |
| `docs/components/Card.md` dual-path + Harmony props | PASS |
| `docs/components/Dialog.md` dual-path + Radix surface | PASS |
| `AGENTS.md` Card / Dialog sections | PASS |
| Approved dual-path convenience | PASS (matches plan / `userDecision`) |
| Resizable accepted gap + callout | PASS |

### Stack elegance

| Check | Status |
|-------|--------|
| Card: shadcn compound + `cva` + Harmony tokens | PASS |
| Dialog: `@radix-ui/react-dialog` + Harmony header/footer | PASS |
| Package `Icon` / `Button` (no Lucide at call sites) | PASS |
| No undocumented foreign UI kits | PASS |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Card basic: white surface, thin gray border, radius, body padding | Flat white card in gray demo well | Same look and rhythm | present |
| Card header: bold title + muted subtitle + body | Clear hierarchy | Same hierarchy (convenience + compound) | present |
| Card header actions: settings / more / close, far-right | Icon row top-right | Same icons and placement via `CardAction` | present |
| Card elevated: soft drop shadow | Lifted shadow on white card | Matching soft elevation | present |
| Card interactive pair | Two side-by-side titled cards | Same layout and chrome | present |
| Card primary: ~6px theme-blue top border | Thick blue top edge on Featured Card | Matching primary top border | present |
| Card primary + elevated / interactive | Blue top + shadow / hover affordance | Matching combination | present |
| Dialog width ~700px, rounded, border, shadow | Wide centered modal | Matching width (probe 700px) and chrome | present |
| Dialog default header: light header bar, dark title, muted gray X | Visible gray close (`#6B7280`) | Close renders **white** on light header — nearly invisible | different |
| Dialog primary header: blue bar, white title + white X | Inverse chrome on primary | Matching primary header + inverse close | present |
| Dialog footer left: Confirm (fill) + Cancel (outline) | Left-aligned theme buttons | Matching | present |
| Dialog footer right: Cancel then Confirm at end | Right-aligned pair | Matching order and alignment | present |
| Dialog three-button: Yes / No / Cancel (link) | Primary + secondary + tertiary | Matching | present |
| Dialog overlay dim | Dimmed page behind modal | Matching | present |
| Dialog resizable grip | Grip when `resizable` | Omitted with callout (accepted) | accepted |

**Visual gaps (open):** 1 (default-header close color)

## Side-by-side visual / behavior summary

**Matches**

- Card surfaces, borders, radius, title/description hierarchy, elevated shadow, interactive pair, primary top border combinations
- Dialog panel size, sticky header/footer anatomy, primary header fill, left/right footer alignment, Yes/No/Cancel tertiary pattern, overlay
- Dual-path demos and package ImportSnippet as required for this target

**Differs (defects)**

- Default Dialog close control is white-on-light (designer-visible); caused by close styling using `group-has-[[data-variant=primary]]` which also matches footer `Button data-variant="primary"`
- Missing Card “With Subtitle” header-icons example and Screen Reader a11y card; missing Dialog Layout educational section

**Differs (not defects)**

- ImportSnippet / coverage % / in-progress badge
- Astro `icon1/2/3` / `openDialog` APIs replaced per approved Consumer API
- Resizable grip omitted with documented callout

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Do not mark `Card` / `Dialog` synced until close-control visual is remediated (or explicitly accepted) and human accepts remaining content gaps |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Default-header dialog shows a clearly visible muted-gray X close control in the top-right of the header
- **converted:** Same default-header dialogs show a white X on the light header — effectively invisible until hover/focus
- **description:** Designer would notice the close affordance is missing or broken on every non-primary Dialog that includes a primary Confirm button
- **evidence:** Browse `http://localhost:5177/components/dialogs` → Open Dialog / Open Right-Aligned Dialog; artifacts `conv-dialog-basic-panel.png`, `conv-dialog-right-panel.png`; probes `conv-basic-probe.json` (`closeColor: rgb(255,255,255)` vs ref `rgb(107,114,128)`). Root cause: `DialogContent` close uses `group-has-[[data-variant=primary]]/dialog` which matches footer `Button[data-variant=primary]`, not only `DialogHeader`
- **remediationHint:** Scope inverse close styles to header primary only (e.g. `group-has-[[data-slot=dialog-header][data-variant=primary]]/dialog` or put the close inside `DialogHeader` and style from header variant)

### DEF-002

- **status:** open
- **category:** structure
- **reference:** “Card with Header Icons” includes a third example “With Subtitle” (title + optional description + three icons)
- **converted:** Header actions section shows All Three Icons and Close Only only
- **description:** Designer reviewing content inventory would note one reference example is missing
- **evidence:** `ref-cards-inventory.json` vs `conv-cards-inventory.json`; reference `src/pages/components/cards.astro`
- **remediationHint:** Add a third demo card composing `CardTitle` + `CardDescription` + `CardAction` icons

### DEF-003

- **status:** open
- **category:** structure
- **reference:** Accessibility includes “Screen Reader Support” a11y card; Dialogs page includes a “Layout” section explaining sticky header/footer + token widths
- **converted:** Card a11y stops at Focus Indicators; Dialogs has no Layout section (a11y cards rephrased)
- **description:** Educational doc sections present on reference are missing on converted demos
- **evidence:** Content inventories; reference `cards.astro` / `dialogs.astro` vs `CardsDemo.tsx` / `DialogsDemo.tsx`
- **remediationHint:** Restore Screen Reader a11y card on Cards; add Layout blurb (or sticky-chrome note) on Dialogs if parity with reference docs is required

### DEF-004

- **status:** accepted
- **category:** behavior
- **reference:** Resizable dialog shows bottom-right resize grip
- **converted:** UnsupportedEquivalentCallout for `Dialog.resizable`
- **description:** Accepted conversion gap per custom instructions / manifest `gaps` / `userDecision`
- **evidence:** Demo callout on `/components/dialogs`; `conversion.manifest.json` Dialog `gaps`
- **remediationHint:** none

## Blocked items

None — review surfaces reachable on `:4321` and `:5177`.

## Verifier notes

- Designer compare completed with rendered browse + screenshot pairs; visual matrix uses Reference | Converted | Status columns
- Close defect confirmed by rendered appearance and probe (not CSS-only closure on mismatched nodes) — probe used only to explain the visible white-on-light close
- Consumer API dual-path approved; resizable accepted with callout
- Recommendation: FAIL until DEF-001 fixed; then re-verify Dialog close on default + primary headers before human accept → `synced`

## Recommendation

**FAIL** — remediate Dialog default close color (DEF-001), optionally restore DEF-002/003 content, re-verify, then AskQuestion for human visual accept before marking `Card` / `Dialog` synced.
