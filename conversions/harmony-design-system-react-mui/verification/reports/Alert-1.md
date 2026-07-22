# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Alert` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-06T20:30:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 4 |
| **total** | 7 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/alerts` (HTTP 200, CP light) |
| converted | Live review `http://localhost:5176/components/alerts` (HTTP 200, CP light) |
| screenshots | `verification/artifacts/diag/ref-alert-i1.png`, `conv-alert-i1.png` |
| style probe | `verification/artifacts/diag/probe-alert-i1.mjs`, `probe-alert-i1-light.mjs`, `probe-alert-actions.mjs`, `probe-alert-layout.mjs` |

Rendered evidence reviewed on both dev servers. Source-only review not used for PASS/FAIL.

## Content parity

Inventory of reference `alerts.astro` doc page vs converted `AlertsDemo.tsx` at `/components/alerts`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | accepted | Converted adds MUI severity/variant mapping note — acceptable target framing |
| Article nav: Examples, Props, Accessibility | accepted | Converted adds Harmony mapping link; nav links omit reference Tabler icons |
| Section: Variants (4 severities) | present | Same titles and copy |
| Section: Dismissible | present | Close affordance visible |
| Section: Without Title (2 alerts) | present | |
| Section: Enhanced Variant (2 alerts) | present | |
| Section: Enhanced with Actions (2 alerts) | present | Action labels match; layout differs visually (DEF-003) |
| Section: Enhanced with Progress (2 alerts) | accepted | Replaced with `UnsupportedEquivalentCallout` naming ProgressBar dependency — expected blocked section |
| Section: Props table | present | MUI-native props table with Harmony mapping descriptions |
| Section: Accessibility — Role | present | Wording references MUI `role="alert"` — equivalent meaning |
| Extra: Harmony → MUI mapping table | accepted | Target-specific addition |

**Content gaps (open):** 0

## Visual parity

Rendered appearance matrix — CP product, light mode (primary review surface).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Info standard alert bg/border/text | `rgba(51,102,255,0.1)` / 1px border / title+msg colors match | Same semantic colors | present |
| Success / warning / error standard fills | Themed rgba tints + borders | Match probed severities | present |
| Standard alert border-radius | `8px` (`--radius-lg`) | `12px` on `MuiAlert-root` | different |
| Enhanced card bg + shadow | `rgb(247,248,250)` + md shadow | Match | present |
| Enhanced left accent bar | `8px` colored strip | `8px` `borderLeft` — equivalent | present |
| Enhanced title/message typography | semibold title, 13px message | Match probed weights/colors | present |
| Enhanced action button height | `24px` (Button size xs) | `33–35px` (Button size small) | different |
| Enhanced actions row placement | Actions row `16px` below message in dedicated `.alert__actions` | Buttons embedded inside `.MuiAlert-message` — overlap/inline with message block | different |
| Action link font size | `12px` | `12px` | present |
| Progress examples | Two alerts with progress bars | Info callout only | accepted |
| Dismissible close control | X in alert corner | MUI close button | present |

**Visual gaps (open):** 3 (DEF-001, DEF-002, DEF-003)

## Defects

### DEF-001 — Standard alert corner radius too large

- **status:** open
- **category:** visual
- **reference:** Designer would see default (standard) alerts with `8px` rounded corners on all four variant rows.
- **converted:** Standard alerts render with `12px` border-radius on the alert root.
- **description:** Default alert shape reads noticeably rounder than reference; enhanced alerts correctly use `8px`.
- **evidence:** CP light `getComputedStyle` — ref info alert `borderRadius: 8px`, conv `borderRadius: 12px`; `mapAlertToTheme.ts` root override sets `borderRadius: '12px'` while reference uses `--radius-lg` (0.5rem / 8px).
- **remediationHint:** Set standard-variant root radius to `8px` (or token equivalent) in `mapAlertToTheme.ts`.

### DEF-002 — Enhanced action buttons oversized vs reference xs

- **status:** open
- **category:** visual
- **reference:** Enhanced-with-actions examples use Harmony Button size xs — probed height `24px`, font `12px`.
- **converted:** Demo composes `Button size="small"` — probed height `33–35px`, font `14px`.
- **description:** Primary/secondary action buttons in Enhanced with Actions read larger and heavier than reference, breaking visual rhythm with the compact enhanced alert layout.
- **evidence:** CP light probe on Success Alert with actions — ref buttons 24px tall; conv 33px; `AlertsDemo.tsx` lines 291–296 use `size="small"`.
- **remediationHint:** Theme `MuiButton` for alert action context or use smallest available size once Button xs gap is resolved; until then document as accepted only if human accepts.

### DEF-003 — Enhanced actions layout not in dedicated row below message

- **status:** open
- **category:** structure
- **reference:** Action buttons and link sit in `.alert__actions` below the icon/title/message row, indented with `padding-left: 28px` and `16px` gap below message text.
- **converted:** Button/link `Stack` is nested inside `MuiAlert-message` as alert children, causing inline placement within the message column rather than a separate actions row.
- **description:** Designer would see action controls cramped inside the message area instead of on a distinct row beneath the description, unlike reference enhanced alerts.
- **evidence:** Layout probe — ref message-to-button gap `16px` (buttons below message); conv gap `-34px` (buttons overlap message box vertical extent); reference DOM uses `.alert__actions` sibling to `.alert__inner`.
- **remediationHint:** Move action `Stack` to MUI `action` slot or structure matching reference `.alert__actions` placement with equivalent padding.

### DEF-004 — Enhanced with Progress blocked pending ProgressBar

- **status:** accepted
- **category:** mapping
- **reference:** Two enhanced alerts with progress bars at 75% and 45%.
- **converted:** `UnsupportedEquivalentCallout` for `Enhanced with Progress (progressValue)` naming ProgressBar dependency.
- **description:** Expected blocked section per playbook — ProgressBar element not synced; callout correctly names dependency.
- **evidence:** Live page text includes "Not supported in this conversion" and "Requires ProgressBar element conversion first"; `conversion.manifest.json` ProgressBar `not-started`.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

**Mapping strategy (iteration 1 expectations):**

- Demo `AlertsDemo.tsx` imports `@mui/material/Alert`, `AlertTitle`, etc. directly — no Harmony prop wrapper in demo or package export. Confirmed: no `Alert` export in `src/index.ts`.
- Theme-only styling via `mapAlertToTheme.ts` wired in `mapFoundationTokens.ts` → `MuiAlert`, `MuiAlertTitle`, `MuiLink` overrides.
- Progress section correctly shows `UnsupportedEquivalentCallout` instead of silent omission.

Recommend remediate DEF-001–003 and re-verify iteration 2. Human acceptance required before manifest `Alert` status update (currently `not-started`).
