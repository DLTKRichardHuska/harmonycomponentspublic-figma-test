# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Toggle, Dropdown (Select), Accordion` |
| iteration | 1 |
| artifactType | `image` |
| generatedAt | 2026-07-20T22:40:00-06:00 |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 0 |

**Result:** PASS

Recommendation only — human confirmation required before manifest `synced` (see Human confirmation).

## Artifacts captured

Rendered CP / light on both surfaces. Reference `:4321`, converted demo `:5177`.

| Role | Path or URI |
|------|-------------|
| reference — toggle | `http://localhost:4321/components/toggle-switches` · `artifacts/toggle-dropdown-accordion-1/ref-toggle.png`, `ref-toggle-sizes.png` |
| converted — toggle | `http://localhost:5177/components/toggle-switches` · `conv-toggle.png`, `conv-toggle-sizes.png` |
| reference — dropdown | `http://localhost:4321/components/dropdowns` · `ref-dropdown.png`, `ref-dropdown-open2.png` |
| converted — dropdown | `http://localhost:5177/components/dropdowns` · `conv-dropdown.png`, `conv-dropdown-open2.png` |
| reference — accordion | `http://localhost:4321/components/accordion` · `ref-accordion.png`, `ref-acc-defaultopen.png`, `ref-acc-disabled.png` |
| converted — accordion | `http://localhost:5177/components/accordion` · `conv-accordion.png`, `conv-acc-defaultopen.png`, `conv-acc-disabled.png` |
| inventories | `conv-*-inventory.json` (section titles) |
| capture scripts | `capture.mjs`, `capture-open.mjs`, `capture-accordion.mjs`, `capture-toggle.mjs` (evidence only — no verdict) |

## Content parity

### Toggle — `/components/toggle-switches`

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Converted description drops the "…or two labeled options with the segmented variant" clause because segmented is a documented skip |
| ImportSnippet (package import) | present | Converted-only "Usage from npm" — package-name imports, no global setup |
| Example: Basic Toggle | present | |
| Example: States (unchecked/checked/disabled/checked+disabled) | present | |
| Example: Sizes (sm/md) | present | |
| Example: Without Label | present | |
| Example: Segmented toggle | accepted (gap) | Skipped per approved API → `UnsupportedEquivalentCallout` shown |
| Accessibility cards | present | Labels, Keyboard, ARIA, Screen Reader, Disabled State |
| Props table | present | |

### Dropdown → Select — `/components/dropdowns`

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| ImportSnippet (Select compound) | present | |
| Example: Basic Dropdown | present | |
| Example: With Label (Stacked) | present | |
| Example: With Label (Inline) | present | |
| Example: With Pre-selected Value | present | Priority defaults to "Medium" |
| Example: Disabled | present | |
| `options[]` / `trigger` / `option-*` slots | accepted (gap) | Compound `SelectItem` children per approved API → callout shown |
| Accessibility cards | present | Converted adds a "Screen Reader Support" card (enhancement) |
| Props table | present | |

### Accordion — `/components/accordion`

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | |
| ImportSnippet (compound) | present | |
| Example: Basic Accordion | present | See VP-1 note (default-open) |
| Example: With Label (group + aria-labelledby) | present | Composed externally per approved API |
| Example: With Default Open | present | Open panel styling matches |
| Example: Allow Multiple | present | See VP-1 note (default-open) |
| Example: Disabled Sections | present | Locked section greyed / non-interactive — matches |
| Example: Focus | present | |
| `items[]` / `item-*` slots | accepted (gap) | Compound children per approved API → callout shown |
| Accessibility cards | present | Converted adds a "Disabled State" card (enhancement) |
| Props table | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Toggle — off track | pale grey pill, white thumb left | pale grey pill, white thumb left | present |
| Toggle — on track | solid blue pill, white thumb right | solid blue pill, white thumb right | present |
| Toggle — disabled (off/on) | muted grey / faded blue, no interaction | muted grey / faded blue, no interaction | present |
| Toggle — sizes | Small track visibly smaller than Medium | Small track visibly smaller than Medium | present |
| Toggle — label layout | label text right of track, single row | label text right of track, single row | present |
| Dropdown — trigger (closed) | bordered field, placeholder text + chevron-down right | bordered field, placeholder text + chevron-down right | present |
| Dropdown — open list | white surface, 5 options (US/CA/UK/DE/FR), subtle borders | white popover, same 5 options, first item active-highlight | present |
| Dropdown — inline vs stacked label | label left (inline) / above (stacked) | label left (inline) / above (stacked) | present |
| Dropdown — disabled | greyed trigger, non-interactive | greyed trigger, non-interactive | present |
| Accordion — collapsed header | title left, chevron-down right, divider rows in card | title left, chevron-down right, divider rows in card | present |
| Accordion — open panel | chevron rotates up, body text below with padding | chevron rotates up, body text below with padding | present |
| Accordion — disabled item | "Locked section" greyed, chevron muted | "Locked section" greyed, chevron muted | present |
| Card surface / spacing / typography | Harmony CP card wrappers, same rhythm | equivalent | present |

**Visual gaps (open):** 0

### Notes (designer-visible, not defects)

- **VP-1 (behavior, informational):** In *Basic Accordion* and *Allow Multiple*, the converted demo opens the first item by default (`defaultValue`), while the reference renders those two examples fully collapsed. This is a demo-authoring choice, not a component capability gap — the converted rendering matches each example's own description ("single item open" / multi-expand) and open/closed styling is equivalent. Not counted as an open defect; flagged for human awareness.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Three documented API gaps (segmented / `options[]` / `items[]`) render as `UnsupportedEquivalentCallout` per approved plan. conversion-agent must AskQuestion before setting Toggle / Dropdown / Accordion `status: synced`. |

## Consumer API / AI-artifact check

Compared package public surface + AI docs vs plan's Consumer API (user confirmed). No contradictions; both approved slices (Harmony-specific + inherited/stack) documented.

| Element | docs/components/*.md | llms.txt | AGENTS.md | Verdict |
|---------|----------------------|----------|-----------|---------|
| Toggle | `Toggle.md` — Toggle + ToggleField, `size`, `checked`/`onCheckedChange`, segmented omitted | Toggle section present | no section (not required) | consistent |
| Select (Dropdown) | `Select.md` — compound + SelectField, Radix `value`/`onValueChange`, `options[]` omitted | Select (Dropdown) section present | no section | consistent |
| Accordion | `Accordion.md` — compound, `type` single/multiple, `collapsible`, `items[]` omitted, external group label | Accordion section present | no section | consistent |

- Bare Toggle / Select correctly carry **no** `label` prop (Hybrid C); `*Field` convenience present.
- Select export name is `Select` (catalog element stays Dropdown; demo title "Dropdown") — matches approval.
- Chevrons use package `Icon` `chevron-down` per plan (no Lucide).
- **Note (non-blocking):** `packages/ui/AGENTS.md` has no dedicated Toggle/Select/Accordion sections, but `llms.txt` and per-component docs cover them and AGENTS.md does not contradict the surface. Adding short AGENTS.md entries would improve consistency with earlier components; not a defect.

## Stack elegance

- Radix Switch / Select / Accordion + Tailwind + package `Icon`; no foreign UI kits, no Lucide, no parallel token system. No new friction found.

## Blocked items

None.

## Verifier notes

Readonly designer-lens compare. Content inventory and three-column visual matrix completed from rendered evidence (live routes + screenshots on both surfaces at CP/light) — no CSS-only or probe-only closure. DOM/prop/markup differences (Radix primitives, compound APIs, class names) were not treated as defects. Documented gaps are shown as demo callouts and recorded in the manifest. Recommend **PASS**; human confirmation pending before sync.
