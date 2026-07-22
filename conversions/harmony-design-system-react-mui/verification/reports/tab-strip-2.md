# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `TabStrip` |
| iteration | 2 |
| artifactType | `image` |
| generatedAt | 2026-07-21T00:41:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| previousReport | `verification/reports/stepper-tabstrip-1.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 4 |
| **total** | 5 |

**Result:** PASS-recommended (pending human confirmation)

Per-element recommendation:

| Element | Recommendation | Reason |
|---------|----------------|--------|
| **TabStrip** | **PASS (pending human confirmation)** | The "With Add Tab Button" example is now implemented via pure MUI composition (Tabs + adjacent add IconButton) and renders correctly — the iteration‑1 skip is resolved (FIX-001). Previously accepted gaps (per‑tab actions, "More" overflow menu, compact/pill) remain shown as `UnsupportedEquivalentCallout`. No regressions in previously‑passing examples. `accepted > 0`, so AskQuestion required before sync. |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | http://localhost:4321/components/tab-strip |
| converted | http://localhost:5176/components/tab-strip |
| capture scripts | `verification/artifacts/tab-strip-2/capture.mjs`, `capture2.mjs` (evidence only) |
| full pages | `conv-full.png` (converted), inventories `ref-inventory.json` / `conv-inventory.json` |
| examples section | `conv-examples.png` |
| add-tab focus | `ref-addtab-focus.png`, `ref-addtab-wide.png`, `conv-addtab-focus.png` |
| scrollable overflow | `conv-scrollable.png` |

Both dev servers confirmed reachable (HTTP 200). Rendered evidence reviewed side-by-side (CP / light). Servers already running; not restarted.

---

## TabStrip

### Content parity — TabStrip

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| Article nav | present | Reference `Examples/Props/Accessibility`; converted adds `Harmony mapping` (converted-demo convention) |
| Example: Basic Tabs | present | |
| Example: With Icons (Left) | present | |
| Example: With Icons (Right) | present | |
| Example: With Icons (Centered Over Text) | present | |
| Example: Disabled Tab | present | |
| Example: Enforced Icon Position | present | |
| Example: With Add Tab Button | present | **Newly implemented (FIX-001)** — MUI `Tabs` + adjacent `IconButton` (aria-label "Add tab"); appends + selects a new tab. No custom wrapper. |
| Example: Per-tab actions (open/close/⋮) | accepted | Skipped — covered by callout #1 |
| Example: With Overflow Handling ("More(N)") | accepted | Replaced by "Scrollable overflow" (`variant="scrollable"`) — accepted equivalent |
| Example: Manual Overflow Control | accepted | Skipped — part of overflow-menu callout |
| Example: Compact Variant | accepted | Skipped — callout #2 |
| Example: VP Pill Variant | accepted | Skipped — callout #2 (also VP-only) |
| Props tables (Tabs + Tab) | present | Documents MUI Tabs/Tab API (approved existing-mui surface) |
| Harmony → MUI mapping | present | `showAddTab` row now documents the composite equivalent (Tabs + adjacent IconButton); per-tab actions/More menu and compact/pill remain "Not supported — see callout" |
| Accessibility section | present | |

**Content gaps (open):** 0

### Callout coverage (previously accepted gaps)

| Callout | Rendered text (converted) | Status |
|---------|---------------------------|--------|
| #1 Per-tab actions + More menu | "Harmony per-tab actions (open / close / ⋮) and the \"More\" overflow menu has no supported equivalent here… (Add-tab is available via composition — see the 'With Add Tab Button' example.)" | present — `showAddTab` correctly removed from this skip and redirected to the composite example |
| #2 Compact / Pill | "Harmony variant=\"compact\" / variant=\"pill\" has no supported equivalent here…" | present |

### Visual parity — TabStrip

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tabs — selected tab | Blue label + blue underline indicator | Blue label + blue underline indicator | present |
| Basic tabs — inactive tabs | Grey labels, no underline | Grey labels, no underline | present |
| Tab strip bottom divider | Full-width thin divider under row | Full-width thin divider under row | present |
| Icons left (start) | Icon before label, inline | Icon before label, inline | present |
| Icons right (end) | Icon after label, inline | Icon after label, inline | present |
| Icons centered/top | Icon stacked above label, centered | Icon stacked above label, centered | present |
| Disabled tab | Muted/greyed label, not selectable | Muted/greyed label, not selectable | present |
| Enforced icon position | Consistent top icons across tabs | Consistent top icons across tabs | present |
| Scrollable overflow | Harmony "More(N)" dropdown | MUI scrollable strip with scroll chevron in bordered box | accepted (MUI-native equivalent, unchanged from iter 1) |
| **Add-tab affordance** | Labeled "＋ Add Tab" button at the **far-right end** of the full-width strip, inside the strip border | Icon-only "＋" `IconButton` positioned **immediately adjacent** to the last tab | present — recognizable equivalent (accepted composite difference ACC-06; see below) |
| Label typography / weight | Sans, medium, comfortable padding | Sans, medium, comfortable padding | present |

**Visual gaps (open):** 0

---

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | TabStrip still carries accepted gaps (per-tab actions / "More" menu / compact / pill callouts; scrollable overflow equivalent) plus one accepted composite-equivalent presentation difference for the add-tab affordance (ACC-06). conversion-agent must AskQuestion before marking `TabStrip` `synced`. No open defects remain. |

## Defects

None open.

### FIX-001 (resolved since iteration 1)

- **status:** fixed
- **category:** structure / content
- **element:** TabStrip
- **iteration-1 state:** "With Add Tab Button" example was skipped via `UnsupportedEquivalentCallout` (`showAddTab` listed as no MUI equivalent).
- **iteration-2 state:** Example is now present and implemented with pure MUI composition — a standard `<Tabs>` plus an adjacent `<IconButton aria-label="Add tab">` (plus icon) that appends and selects a new tab. `showAddTab` was removed from the skip callout and is documented as a composite equivalent in the Harmony → MUI mapping table. Renders correctly on the converted surface.
- **evidence:** `conv-addtab-focus.png` (converted Tabs + ＋ IconButton), `ref-addtab-wide.png` (reference ＋ Add Tab), `conv-inventory.json` (`addTabBtn: 1`, example title "With Add Tab Button" present).

### Accepted items (no action — human to confirm)

| Ref | Element | Accepted difference | Basis |
|-----|---------|---------------------|-------|
| ACC-03 | TabStrip | Per-tab actions (open/close/⋮) and "More" overflow dropdown omitted (callout #1) | manifest gaps + user brief |
| ACC-04 | TabStrip | Overflow shown via `variant="scrollable"` instead of Harmony "More" menu | manifest userDecision |
| ACC-05 | TabStrip | `variant="compact"` / `variant="pill"` omitted (callout #2) | manifest gaps + user brief |
| ACC-06 | TabStrip | Add-tab affordance presented as an icon-only "＋" `IconButton` adjacent to the tabs, vs reference's labeled "＋ Add Tab" button at the far-right end of the strip. Same action + accessible name (`aria-label="Add tab"`); differs in label text and position. | approved composite equivalent (user brief: "adjacent add IconButton"); designer-recognizable equivalent |

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Content inventory and the three-column visual matrix were completed from side-by-side rendered review of `:4321` and `:5176` (CP / light). No visual row was marked `present` from CSS/probe output — all judgments are from rendered screenshots.
- **Confirm #1 (add-tab present & reasonable):** PASS. The composition renders a working add affordance. It is not pixel-identical to the reference (icon-only vs labeled "Add Tab"; adjacent vs far-right placement), but it is a recognizable, accessible equivalent that matches the approved composite design in the user brief. Surfaced as ACC-06 for human sign-off rather than a blocking defect.
- **Confirm #2 (accepted gaps still callouts):** PASS. Both callouts render; `showAddTab` correctly moved out of the skip callout and into the composite mapping/example.
- **Confirm #3 (no regressions):** PASS. Basic, Icons (Left/Right/Top), Disabled, Enforced Icon Position, and Scrollable overflow all render as in iteration 1.
- Manifest not modified; `TabStrip` remains `in-progress`. Final acceptance (and any `synced` transition) is a human decision per FIDELITY_PRINCIPLES / VISUAL_MATCH_GATE.
- Scope of this run is TabStrip only; `latest-defect-report.md` was intentionally left untouched to preserve the iteration-1 Stepper defects (DEF-001/DEF-002) that are out of scope here.
