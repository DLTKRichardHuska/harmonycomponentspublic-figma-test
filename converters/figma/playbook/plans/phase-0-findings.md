# Phase 0 findings — Figma converter (rerun)

**Status:** complete — Decision gate refreshed for the new shadcn model
**Date:** 2026-07-21 (rerun; supersedes 2026-07-16)
**Spike file:** [Harmony Phase0 Rerun (state + CC / shadcn)](https://www.figma.com/design/5HzIdKyx73pcnxOteKOaax) (`fileKey`: `5HzIdKyx73pcnxOteKOaax`)
**Created under:** Deltek, Inc. org plan (`organization::1303904496611212311`) — disposable spike; created under the org this time so Code Connect could be exercised.

This rerun re-validates both spikes against the updated shadcn conversion (single-source / N per-product packages, Tailwind v4, mode-only provider). It supersedes the earlier findings, whose 0b recommendation (react-mui) is now obsolete.

---

## Executive summary

| Investigation | Verdict (rerun) |
|---------------|-----------------|
| **0a — State in Figma** | **Re-proven live.** `setSharedPluginData` / `getSharedPluginData` round-trip works and persists across separate `use_figma` calls; `review` status representable; coversheet stays in sync. Schema updated to the per-product model. |
| **0b — Code Connect / Make** | **Target = shadcn per-product packages (confirmed).** Figma component properties are an **identity mirror** of the shadcn Button API (verified via `get_context_for_code_connect`). Code Connect can be authored **directly via MCP** (`add_code_connect_map` parserless template) — no CLI/npm-auth needed to author. **Hard gate:** the mapping write requires the component to be **published to a team/org library**, and the Plugin API **cannot publish** — publish is a manual human step. |

---

## 0a — State storage feasibility (re-proven)

### What was tested (live)
1. Created a blank design file under the **Deltek org** via `create_new_file`.
2. Wrote schema-v2 JSON to `figma.root.setSharedPluginData('harmony','conversionState', …)`.
3. Built a Coversheet page (auto-layout) with title + version + status text.
4. In a **second** `use_figma` call: read state back, mutated `Button` → `review`, wrote back, and synced the coversheet status text node by ID.

### Results

| Check | Result |
|-------|--------|
| Write shared plugin data | Pass — 484 bytes persisted |
| Read on subsequent MCP call | Pass — `roundTrip: true`, `persistedAcrossCalls: true` |
| `review` status representable | Pass — `buttonStatus: "review"` round-tripped |
| Update coversheet from state | Pass — status text node `3:5` synced |
| Private `setPluginData` | Still **not supported** in `use_figma` — use shared plugin data |

### State model (schema v2 — one file per product)

> Updated after the spike: the final decision is **one Figma file per product** (not combined groups), because per-product brand `logo` is an image that Figma variable modes cannot hold. Each file stores a single `product` identity. See [`file-and-state-structure.md`](file-and-state-structure.md) for the authoritative schema.

```json
{
  "schemaVersion": 2,
  "referenceVersion": "0.9.0",
  "product": "vp",
  "role": "canonical",
  "derivedFrom": null,
  "codeConnect": {
    "target": "harmony-design-system-shadcn",
    "package": "@dltkrichardhuska/harmony-design-system-shadcn-vp",
    "tailwind": "v4-globals-import",
    "provider": "mode-only"
  },
  "elements": {
    "Colors": { "status": "not-started", "nodeId": null },
    "Button": { "status": "not-started", "nodeId": null, "shadcnExport": "Button", "codeConnectStatus": "none" }
  },
  "updatedAt": "ISO-8601"
}
```

- Each Figma file is scoped to **one product** (`role`: `canonical` for VP, `derived` for PPM/Maconomy, `superset` for CP; `derivedFrom` → `vp` for the duplicates).
- Because each file is one product, the Code Connect package is implied by `product` — no per-element product list.
- Statuses: `not-started → in-progress → review → synced` (+ `gap`).

**Repo still holds only:** product → `fileKey` bindings in `converters/figma/external.config.json`.

---

## 0b — Code Connect / Figma Make (rerun against shadcn)

### Constraints (re-confirmed)
1. **Org/Enterprise required** — Deltek org (`organization::1303904496611212311`, org tier, Full seat) qualifies. Starter team does not.
2. **Component must be published** to a team/org library before a mapping can be **written** (`add_code_connect_map` returns `"Published component not found…"` for an unpublished component). Note: `get_code_connect_suggestions` and `get_context_for_code_connect` **do** work on an unpublished org draft — only the mapping *write* is publish-gated.
3. **Publishing is not automatable here.** The Plugin API exposes `figma.teamLibrary` with **no** publish method (introspection returned zero keys; `figma.publishLibraryAsync` does not exist). Publishing is a **manual** Assets-panel action (or enterprise REST outside MCP).

### What was tested (live)
1. Created a `Button` COMPONENT_SET mirroring the shadcn Button Consumer API.
2. `get_context_for_code_connect` on the set returned the property schema below.
3. Attempted `add_code_connect_map` with a **parserless identity template** importing from the per-product package.

### Property mirror confirmed (identity mapping)

`get_context_for_code_connect` on node `4:11` returned:

| Figma property | Type | Options | shadcn prop |
|---|---|---|---|
| `variant` | VARIANT | `primary`, `secondary` | `variant` (identity) |
| `size` | VARIANT | `sm`, `md` | `size` (identity) |
| `disabled` | BOOLEAN | — | `disabled` (identity) |
| `label` | TEXT | — | `children` |

This validates the plan's core thesis: **because Figma props are authored to the shadcn Consumer API, the Code Connect map is near-identity** (`figma.enum` value→value). The trial template:

```ts
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { primary: 'primary', secondary: 'secondary' })
const size = instance.getEnum('size', { sm: 'sm', md: 'md' })
const disabled = instance.getBoolean('disabled')
const label = instance.getString('label')
export default {
  example: figma.code`<Button variant="${variant}" size="${size}" ${disabled ? 'disabled' : ''}>${label}</Button>`,
  imports: ["import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn-vp/components'"],
  id: 'button',
  metadata: { nestable: true },
}
```

### Two authoring paths (new evidence)

| Path | Mechanism | Pros | Cons |
|---|---|---|---|
| **MCP parserless** (`add_code_connect_map` / `send_code_connect_mappings` with `template` + `templateDataJson.isParserless`) | Agent writes the template directly through Figma MCP | No `@figma/code-connect` install, no npm auth, no `tsconfig` types; fits the in-Cursor convert loop | Still publish-gated; template lives in Figma backend, not version-controlled unless also mirrored to a `.figma.ts` |
| **CLI** (`.figma.tsx` + `npx figma connect publish`) | Files committed in shadcn repo, published via CLI | Version-controlled, reviewable, `figma-types` autocomplete | Requires CLI install + Figma token + still needs the Figma component published |

Both are viable. Recommendation: **primary path = MCP parserless authoring in the convert loop**, optionally **mirrored to committed `.figma.ts` in the shadcn repo** for review/history. The earlier plan assumed CLI-only; MCP authoring is the simpler default and removes the npm-auth burden for authoring.

### Per-product package resolution (confirmed approach)
- Author the mapping **once per component** against the **source package** surface (identical API across product builds).
- The `imports`/`example` reference a product package (`…-vp` used in the trial); **Code Connect custom instructions** tell Make to install the package matching the file's product (CP file → `-cp`).
- Make global setup in custom instructions: `import '.../styles/globals.css'` (Tailwind v4, **no preset/config**), **mode-only** `HarmonyThemeProvider` (`defaultMode` only), `Icon` name strings (never Lucide/Tabler/Heroicons directly).

### Blocker recorded
**Library publish is a manual prerequisite** for writing/validating any Code Connect mapping. This is unchanged by the shadcn update and applies to both authoring paths. The converter playbook must include an explicit **"human publishes the Figma library"** step before the Code Connect step of an element can complete. Autonomous end-to-end publish is not possible via MCP.

---

## What changed vs the 2026-07-16 findings

1. **Code Connect target: react-mui → shadcn per-product packages.** The old Option B (MUI snippets) is obsolete.
2. **Mapping is identity, not a translation table.** Figma props mirror shadcn names/values, so the old "per-element MUI prop mapping table" is no longer needed.
3. **MCP parserless authoring path discovered** — simpler than the CLI-only assumption; no npm auth to author.
4. **Publish confirmed to be manual-only** (Plugin API cannot publish) — now an explicit playbook gate, verified by introspection.
5. **Make setup updated** for Tailwind v4 (`globals.css` import, no preset) and **mode-only** provider (no `defaultProduct`); install target is the **per-product** package.
6. **Spike created under the org** (not starter) so Code Connect tooling was exercisable.

---

## Decision gate checklist (rerun)

- [x] **0a:** Adopt shared plugin data + coversheet sync as conversion state home (schema v2, per-product).
- [x] **0b target:** Code Connect maps to **shadcn per-product packages**; Figma props mirror shadcn (identity map).
- [x] **0b authoring:** primary path = **MCP parserless** template in the convert loop; optional committed `.figma.ts` mirror in the shadcn repo.
- [x] **0b timing:** per element, after visual `synced`, gated on **shadcn component `synced`**.
- [x] **Publish gate:** playbook must include a **manual library-publish** step before Code Connect completes.
- [x] **Make distribution:** per-product private package + user-configured registry auth; Tailwind v4 + mode-only provider in custom instructions.

---

## Auth / plan notes

| Plan | Key | Relevance |
|------|-----|-----------|
| richardhuska's team (starter) | `team::1347641108368812240` | Not usable for Code Connect / production |
| Deltek, Inc. (org) | `organization::1303904496611212311` | Required for production files + Code Connect; used for this rerun spike |

---

## Spike artifacts

- Figma file: https://www.figma.com/design/5HzIdKyx73pcnxOteKOaax
- Shared plugin data namespace/key: `harmony` / `conversionState` (schema v2)
- Coversheet node IDs (spike): overview frame `3:2`, title `3:3`, version text `3:4`, status text `3:5`
- Button component set: `4:11` (props `variant`, `size`, `disabled#4:0`, `label#4:5`)
- Code Connect write result: blocked — `"Published component not found"` (publish is manual)
