# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Dialog` |
| iteration | `2` |
| artifactType | `image` |
| generatedAt | `2026-07-20T20:50:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 5 |

**Result:** PASS

Re-verify after Dialog-1 FAIL remediation (CP × light). Prior DEF-001–004 confirmed fixed on live `:4321` / `:5176`. Accepted skips for `headerVariant="primary"` / Combined Variants and `resizable` unchanged. Do **not** mark Dialog `synced` without human confirmation.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/dialogs` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/dialogs` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/dialog-2/ref-page-top.png` / `conv-page-top.png` |
| screenshot | `verification/artifacts/dialog-2/ref-basic-panel.png` / `conv-basic-panel.png` |
| screenshot | `verification/artifacts/dialog-2/ref-confirm-panel.png` / `conv-confirm-panel.png` |
| screenshot | `verification/artifacts/dialog-2/ref-three-panel.png` / `conv-three-panel.png` |
| screenshot | `verification/artifacts/dialog-2/ref-right-panel.png` / `conv-right-panel.png` |
| screenshot | `verification/artifacts/dialog-2/ref-long-panel.png` / `conv-long-panel.png` |
| screenshot | `verification/artifacts/dialog-2/ref-*-page.png` / `conv-*-page.png` (open-dialog page context) |
| screenshot | `verification/artifacts/dialog-2/ref-a11y.png` / `conv-a11y.png` |
| probe | `verification/artifacts/dialog-2/ref-probe.json` / `conv-probe.json` |
| probe | `verification/artifacts/dialog-2/recheck-probe.json` |
| inventory | `verification/artifacts/dialog-2/ref-inventory.json` / `conv-inventory.json` |
| capture script | `verification/artifacts/dialog-2/capture.mjs` |

## Content parity

Scoped to Dialog doc page. Accepted skips documented via `UnsupportedEquivalentCallout` (do not fail).

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Dialogs / sticky header-footer / 600–700px |
| Article nav (Examples, Layout, Props, Accessibility) | present | Converted also adds Harmony mapping (OK) |
| Examples: Basic Dialog | present | |
| Examples: Confirmation Dialog | present | |
| Examples: Three buttons (Yes, No, Cancel) | present | |
| Examples: Right-Aligned Buttons | present | Right alignment fixed — see visual |
| Examples: Long Content (Scrollable Body) | present | Body scrolls — see visual |
| Examples: Primary Header Variant | accepted | `UnsupportedEquivalentCallout` for `headerVariant="primary"` |
| Examples: Combined Variants | accepted | Covered by same primary-header skip / userDecision |
| Examples: Resizable Dialog | accepted | `UnsupportedEquivalentCallout` for `resizable` |
| Section: Layout | present | |
| Section: Props | present | MUI-oriented props table (expected for existing-mui) |
| Section: Accessibility — ARIA Roles | present | |
| Section: Accessibility — Keyboard Navigation | present | |
| Section: Accessibility — Focus Management | present | |
| Section: Accessibility — Screen Reader Support | present | Restored (was DEF-004) |
| Trigger buttons (Open Dialog, Delete Item, etc.) | present | Primary / destructive colors match intent |

**Content gaps (open):** 0

## Visual parity

CP × light. In-scope open dialogs only. Resize grip on reference default dialogs noted as accepted skip (do not fail).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic — paper size / radius / shadow | ~700px wide, 12px radius, soft XL shadow, paper surface | Same 700px / 12px / matching shadow / paper surface | present |
| Basic — title + close | Bold title left; gray X right; header bottom divider | Same title/close rhythm and divider | present |
| Basic — body text | Secondary gray copy, padded | Matching secondary copy and padding | present |
| Basic — footer actions | Confirm (filled primary) then Cancel (outline) **left-aligned**; footer top divider | Same button styles and left alignment | present |
| Confirmation — destructive primary | Red Delete + blue outline Cancel, left-aligned | Same red Delete + outline Cancel, left-aligned | present |
| Three buttons — hierarchy | Yes filled, No outline, Cancel text/tertiary, left-aligned | Same three-button hierarchy and left alignment | present |
| Three buttons — short-label width | Yes/No/Cancel sized to label (compact ~57–82px) | Compact ~64–82px (no forced 120px desktop min-width); designer-equivalent | present |
| Right-aligned — footer actions | Cancel then Confirm clustered at **footer right** | Cancel then Confirm clustered at **footer right** (matches) | present |
| Long scrollable — sticky chrome | Header + footer fixed; body overflows (~664 vs 600) and scrolls | Header + footer fixed; body overflows (~688 vs 600) and scrolls | present |
| Backdrop | Dimmed overlay behind panel | Matching dimmed overlay | present |
| Resize grip (reference default) | Visible bottom-right grip on in-scope panels | Absent | accepted |
| Primary / Combined header examples | Live primary-blue headers on reference | Callouts only (skipped) | accepted |
| Accessibility — Screen Reader card | Fourth a11y card visible | Fourth a11y card visible with matching guidance | present |

**Visual gaps (open):** 0

## Side-by-side visual summary

| Example | Designer takeaway |
|---------|-------------------|
| Basic | Looks equivalent — title, close, body, left Confirm/Cancel |
| Confirmation | Looks equivalent — red Delete + outline Cancel |
| Three buttons | Hierarchy and compact short labels match reference rhythm |
| Right-aligned | **Fixed** — actions sit on the right on both surfaces |
| Long scrollable | **Fixed** — body overflows under sticky chrome and scrolls |
| Accessibility | **Fixed** — Screen Reader Support card present on both |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **PASS: zero conversion defects.** Accepted skips for primary header / resizable already recorded in manifest `userDecision` — not re-opened. Do not mark Dialog `synced` until human confirms via AskQuestion. |

**conversion-agent** must **AskQuestion** before any manifest status change when Status is `pending`.

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** Right-Aligned Buttons — Cancel + Confirm sit at the **right** edge of the footer
- **converted:** Same example — Cancel + Confirm sit at the **right** edge (DialogActions `justifyContent: flex-end`)
- **description:** Prior left-alignment gap is gone. Designer sees matching right-clustered Cancel/Confirm on both surfaces.
- **evidence:** Live `:4321` / `:5176` Right-Aligned example; `ref-right-panel.png` vs `conv-right-panel.png`; probes firstBtnLeft 859 / lastBtnLeft 955 on both; footer `justifyContent: flex-end`
- **remediationHint:** —

### DEF-002

- **status:** fixed
- **category:** behavior
- **reference:** Long Content — body overflows max height; only body scrolls; header/footer stay fixed
- **converted:** Long Content — body overflows (`scrollHeight` 688 > `clientHeight` 600); scrolls under sticky chrome
- **description:** Designer can scroll the middle region while title and actions stay fixed — matches reference intent.
- **evidence:** `ref-long-panel.png` vs `conv-long-panel.png`; probes long.body 664/600 (ref) vs 688/600 (conv); recheck `canScroll: true`, `scrollTop` advances after scroll
- **remediationHint:** —

### DEF-003

- **status:** fixed
- **category:** visual
- **reference:** Footer actions size to label width on desktop (Yes/No/Cancel relatively compact)
- **converted:** Desktop short labels compact (~64px Yes/No); 120px min-width + flex only at md-down breakpoint
- **description:** Designer no longer sees equal wide ~120px pills at desktop. Residual MUI Button default min-width (~64px vs ref ~57px) is not designer-noticeable relative to the prior 120px gap.
- **evidence:** `ref-three-panel.png` / `conv-three-panel.png`; desktop probe widths ~57–82 (ref) vs ~64–82 (conv); `recheck-probe.json` convMdDown minWidth 120px + flex 1
- **remediationHint:** —

### DEF-004

- **status:** fixed
- **category:** structure
- **reference:** Accessibility includes Screen Reader Support card
- **converted:** Accessibility shows ARIA Roles, Keyboard Navigation, Focus Management, and Screen Reader Support
- **description:** Designer reading Accessibility finds the fourth Screen Reader Support card on conversion matching reference.
- **evidence:** `ref-a11y.png` / `conv-a11y.png`; live `#accessibility` browse; recheck `hasScreenReader: true`
- **remediationHint:** —

### DEF-005

- **status:** accepted
- **category:** api
- **reference:** Primary Header / Combined Variants / Resizable live examples
- **converted:** `UnsupportedEquivalentCallout` for `headerVariant="primary"` (incl. Combined) and `resizable`
- **description:** Skipped per custom instructions and manifest `userDecision` / `skippedProps` — not fail conditions for this iteration.
- **evidence:** Converted examples section callouts; manifest Dialog `skippedProps` / `gaps`
- **remediationHint:** —

## Blocked items

_None._ Both review surfaces reachable. Catalog dependencies Icon + Button are `synced`.

## Dependencies

| Dependency | Manifest status | Notes |
|------------|-----------------|-------|
| Button | synced | Footer actions |
| Icon | synced | Close `HarmonyIcon` x-mark |

## Verifier notes

- Designer compare completed from live browse + panel screenshots (not source-only).
- Visual matrix uses three rendered columns; right-align, long-scroll, and footer widths judged from on-screen appearance (probes only as supporting evidence).
- Examples purity: demo uses inline MUI + `HarmonyIcon` — no file-local wrapper components in example zones.
- Do **not** mark Dialog `synced`. Do **not** remediate in this verify pass.
- **Recommendation: PASS: zero conversion defects.**
