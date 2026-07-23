# Visual match gate (all targets)

Canonical gate for **every** conversion verify run: `demo`, `foundation`, `shell`, `<ComponentName>`, and external (Figma) targets.

Load with [DESIGNER_COMPARE.md](DESIGNER_COMPARE.md), [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md), and the target `playbook/VERIFIER.md`.

**The gate is rendered appearance.** DOM structure, CSS property names, prop names, and source token strings are irrelevant unless they change what a designer **sees** on the review surface.

---

## North star

A skilled Harmony designer reviewing reference and converted implementations side by side would judge them **equivalent** for the scoped element — in perceived look, layout rhythm, spacing, alignment, color, typography, and page content.

If a designer would notice a difference, it is a defect unless the **human** explicitly accepts it (recorded in the defect report or manifest).

---

## Mandatory evidence (before PASS)

| Target type | Required evidence |
|-------------|-------------------|
| **component-library** (browser) | Side-by-side browse of matching routes on reference (`:4321`) and converted (e.g. `:5176`) |
| **external** (Figma) | Reference PNG + converted host screenshot for the same scope |

Optional supplements (never substitutes):

- Capture artifacts under `verification/artifacts/`
- Alignment or swatch audit scripts (evidence only — see below)
- Source files to resolve ambiguities

If review surfaces are unreachable → **BLOCKED**. Never PASS from source-only review.

---

## Visual matrix rules

Every scoped verify run must include a **Visual parity** table with **three columns**:

| Item | Reference (rendered) | Converted (rendered) | Status |

Rules:

1. **Reference (rendered)** and **Converted (rendered)** describe what a designer **sees** — not CSS values, DOM selectors, or file paths.
2. Mark **present** only when designer-visible outcome matches (or human has accepted a documented difference).
3. **Forbidden:** collapsed two-column matrices (`Item | Status`) without rendered descriptions.
4. **Forbidden:** marking **present** because a probe returned matching CSS properties.

### All scopes — not just foundation

Apply the visual matrix to every scope type:

| Scope | Visual items to compare (examples) |
|-------|-------------------------------------|
| **foundation** | Swatch colors (rendered), typography samples, spacing bars, shadow cards |
| **component** | Variant rows, state demos, action alignment, icon size, spacing rhythm |
| **shell** | Layout anatomy, spacing, colors as shown |
| **demo** | Header, sidebar, footer, responsive drawer |
| **external** | Section layout, variant tiles, labels — from PNG pair |

---

## Prohibited shortcuts (never sufficient for PASS)

| Shortcut | Why it fails |
|----------|--------------|
| CSS property match on **different** DOM elements | Same `paddingLeft` on unrelated nodes ≠ same visual alignment |
| Copying reference CSS tokens into wrong DOM context | e.g. `.alert__actions` padding applied inside `.MuiAlert-message` |
| Collapsed visual matrix without rendered columns | Hides whether appearance actually matches |
| Ad-hoc probes under `verification/artifacts/diag/` as pass/fail gates | Diagnostic scripts are not verdict scripts |
| Source-only or theme-mapper review | User never sees the mapper — they see the page |
| JSON/token string equality | Rendered appearance may differ (alpha compositing, layout context) |
| "Structurally similar" or "MUI-native equivalent" without browse | DOM differences are OK only when **appearance** matches |

---

## Layout and spacing

For alignment, spacing, and placement:

1. **Prefer** side-by-side browse: "Does the link line up with the message text?"
2. **Or** compare **relative positions** — e.g. `linkRect.left - messageRect.left` on reference vs converted (should match each other, typically ≈ 0 when aligned).
3. **Never** close layout defects because absolute CSS values (`paddingLeft`, `marginTop`) match reference on **different** structural roles.

Optional evidence script: [audit-rendered-alignment.mjs](../scripts/audit-rendered-alignment.mjs) — produces rect deltas; agent still judges.

Example (Alert link-only):

```bash
node .cursor/skills/conversion-verify/scripts/audit-rendered-alignment.mjs \
  --conversion harmony-design-system-react-mui \
  --route /components/alerts \
  --pairs '[{"label":"Learn more vs message","findText":"only a link","ref":{"container":".alert--enhanced","anchor":".alert__message","control":".alert__link"},"conv":{"container":".MuiAlert-outlined","anchor":".MuiAlert-message","control":".MuiLink-root"}}]'
```

---

## Allowed script use (evidence only)

Scripts under `.cursor/skills/conversion-verify/scripts/` may produce **evidence** for the verifier agent:

| Script | Evidence type | Verdict |
|--------|---------------|---------|
| `audit-palette-swatches.mjs` | Rendered swatch colors | Agent judges |
| `audit-rendered-alignment.mjs` | Relative rect deltas | Agent judges |
| `capture-html.mjs` | HTML/PNG of a URL | Agent judges |

**Scripts never decide PASS or FAIL.** Header comments and skill docs state this explicitly.

**Do not** use conversion-local ad-hoc probes in `conversions/<id>/verification/artifacts/diag/` as automated gates — they may inform investigation only.

---

## Regression example: Alert enhanced actions (react-mui)

**Reference:** `.alert__actions` is a **sibling** of the icon+text row; `padding-left: 28px` aligns actions with message text from the **content** left edge.

**Wrong fix:** Apply `paddingLeft: '28px'` to `.MuiAlert-message > .MuiStack-root` because actions live **inside** the message column (already past the icon). Result: "Learn more" double-indented vs message — **worse than default MUI**.

**Wrong verify:** Probe reported `paddingLeft === '28px'` on both sides → marked **present** → PASS.

**Correct verify:** Browse or rect-audit — link left edge should align with message left edge on **both** surfaces; compare the **delta**, not the absolute padding.

---

## Human confirmation (mandatory)

The verifier **recommends** PASS/FAIL. The **human** decides good enough.

### When AskQuestion is required

**conversion-agent** must **AskQuestion** before:

- Recommending final PASS when the report has any `accepted` or `deferred` visual/tokens/structure items (even if `open == 0`)
- Updating manifest element status to `synced`
- Recording a visual gap as `accepted` in the defect report without prior human answer

### Recording confirmation

In the defect report:

```markdown
## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending \| confirmed |
| Confirmed by | human (via AskQuestion) \| explicit user instruction |
| Notes | … |
```

When human accepts a gap: set defect status to `accepted`, record `userDecision` on manifest element if syncing, and set Human confirmation to **confirmed**.

### Verifier rules

- Verifier **must not** mark visual defects `accepted` on its own — only `open`, `fixed`, or recommend `deferred`/`accepted` for human decision.
- Verifier PASS recommendation with zero open defects still requires human confirmation before sync (unless user explicitly said "mark synced if PASS").

---

## Scope coverage

This gate applies **equally** to:

- `demo` — demo chrome look and behavior
- `foundation` — all five routes
- `shell` — shell doc pages
- `<ComponentName>` — every example section and variant/state
- `all` — full portfolio verify
- External targets (Figma) — PNG pair compare per [COMPARE_IMAGE.md](COMPARE_IMAGE.md)

---

## Related

- [DESIGNER_COMPARE.md](DESIGNER_COMPARE.md) — full walkthrough
- [COMPARE_HTML.md](COMPARE_HTML.md) — browser-specific notes
- [COMPARE_IMAGE.md](COMPARE_IMAGE.md) — image host notes
- [DEFECT_REPORT.md](../../harmony-conversion/reference/DEFECT_REPORT.md) — report format
- [FIDELITY_PRINCIPLES.md](../../harmony-conversion/reference/FIDELITY_PRINCIPLES.md) — who decides good enough
- [VERIFICATION_LOOP.md](../../harmony-conversion/reference/VERIFICATION_LOOP.md) — execute loop human gate
