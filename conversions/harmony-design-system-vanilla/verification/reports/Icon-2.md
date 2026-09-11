# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Icon` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-09T21:05:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Icon-1.md` (FAIL; DEF-001–DEF-004 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 7 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/icons` (HTTP 200, VP light) |
| converted | Live `http://localhost:5178/components/icons` (HTTP 200, pierce `demo-app` / `demo-icons-page` shadow) |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/icon-2/` (`ref-vp-light-top.png`, `conv-vp-light-top.png`, `conv-vp-light-a11y.png`, `conv-vp-dark-top.png`, `conv-forced-colors.png`, `compare-notes.json`) |

Rendered evidence: Playwright browse of both routes after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred (unchanged)

- Custom Elements / Shadow DOM / `harmony-icon` vs Astro `<Icon>`
- No `variant`; no Tabler (DEF-005 deferred)
- Full 324 Hero outline grid vs 284 categorized (DEF-006 deferred)
- 65 public custom SVGs vs 40 curated (DEF-007 deferred)
- Demo product stylesheet swap; no `data-product` on the element
- Forced-colors appearance vs Astro (no reference HC baseline)

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Icons + outline intro | present | Converted copy covers full 24/outline + custom + register |
| Section: Icon Props / API | present | Converted **Icon API** table: name, size, label, class, slot, registerIcons; no variant (approved) |
| Usage + Icon Sizes (home xs–xl) | present | Captions `xs (12px)` … `xl (32px)`; glyphs 12/16/20/24/32 |
| Icon Selection Guide / Tabler | deferred | DEF-005 |
| Hero catalog | deferred | DEF-006 — 324 flat grid, 0 missing fallbacks |
| Custom catalog | deferred | DEF-007 — 65 names, 0 missing fallbacks; gantt/pin render |
| Accessibility | present | Heading + decorative-vs-label copy; Edit/Delete labeled buttons; standalone labeled icon |
| npm + static consume snippets | present | Static closer is `</script>` (no backslash) |
| `?` fallback + registerIcons + slot | present | Unchanged demos |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Heading + intro | Icons + Hero Outline intro | Icons + outline/custom/register intro | present |
| API table | Props table under title | Vanilla API table (no variant) with omission note | present |
| Size glyphs | Home outlines 12–32 px | Same measured sizes | present |
| Size captions | xs (12px) … xl (32px) | xs (12px) … xl (32px) | present |
| currentColor | Inherit theme/text | Host class paints check-circle `rgb(42, 120, 198)` | present |
| Accessibility examples | Pencil/trash in labeled buttons | Same affordance: labeled Edit/Delete buttons + labeled info icon | present |
| Hero outlines | Outline catalog | 324 outline cells, same stroke language | present |
| Dark mode | Outline homes on dark docs | `.dark`; white/gray outlines on dark canvas | present |
| Forced-colors | n/a | Glyphs CanvasText; fallback `?` Canvas/CanvasText; a11y button 2px Highlight outline | present |
| Chrome nav/header icons | n/a | `harmony-icon` SVGs resolve | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Icon-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Accessibility section | **fixed** — section + labeled buttons + standalone `label` |
| DEF-002 | No on-page API table | **fixed** — Icon API table (approved omissions noted) |
| DEF-003 | Size captions without px | **fixed** — `xs (12px)` … `xl (32px)` |
| DEF-004 | Static snippet `<\/script>` | **fixed** — displayed `</script>` |

No regressions vs Icon-1 passing checks: size metrics, 324/65 grids with zero unknown glyphs, decorative `aria-hidden`, labeled `role=img`, fallback `?`, VP primary currentColor, dark toggle, static/npm snippets, HC glyphs visible.

## Consumer API / AI / static kit

Unchanged from Icon-1 and still matching the approved Consumer API. Demo snippets match `/vp/elements` and static `styles.css` + `elements.js`.

## WCAG 2.3 AA / forced-colors

- Decorative icons remain `aria-hidden`; icon buttons name the **button** (`Edit document`, `Delete item`)
- Standalone `label="Information"` / `Registered diamond` → `role="img"` + `aria-label`
- HC: icons remain CanvasText; fallback `?` stays contrasted; labeled example button shows Highlight outline

No open a11y defects.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. conversion-agent must AskQuestion before `elements.Icon.status = synced`. Deferred DEF-005–007 remain plan-approved gaps. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **description:** Accessibility section restored on the converted Icons demo (labeled Edit/Delete buttons; standalone labeled icon).
- **evidence:** `conv-vp-light-a11y.png`; live h2 includes Accessibility

### DEF-002

- **status:** fixed
- **category:** structure
- **description:** On-page Icon API table lists name, size, label, class, slot, registerIcons; variant/Tabler called out as omitted.
- **evidence:** `conv-vp-light-top.png`

### DEF-003

- **status:** fixed
- **category:** visual
- **description:** Size captions match reference pixel labels; glyphs still 12/16/20/24/32.
- **evidence:** `compare-notes.json` sizeCaptions + sizes

### DEF-004

- **status:** fixed
- **category:** structure
- **description:** Static zip snippet shows a normal `</script>` closer.
- **evidence:** snippet textContent `staticHasClose: true`, `staticHasBackslash: false`

### DEF-005

- **status:** deferred
- **category:** structure
- **description:** Tabler section omitted (accepted gap).

### DEF-006

- **status:** deferred
- **category:** structure
- **description:** Flat 324 Hero grid vs categorized 284 (approved kit-build).

### DEF-007

- **status:** deferred
- **category:** visual
- **description:** 65 public custom SVGs vs 40 curated names (approved pack).

## Blocked items

None.

## Verifier notes

Content inventory and three-column visual matrix completed from live `:4321` vs `:5178` after remediation (including dark and `forced-colors: active`). DEF-001–DEF-004 closed. Deferred plan gaps unchanged. **PASS: zero conversion defects.**
