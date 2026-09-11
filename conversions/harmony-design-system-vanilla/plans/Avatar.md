# Conversion plan — Avatar

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Avatar` |
| status | `completed` |
| createdAt | `2026-09-10T18:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| coverageAtPlan | `11% (6/55)` |

## Summary

Ship Avatar as a **web-component**: `<harmony-avatar>` with open Shadow DOM. Interactive mode fires host `click` (Enter/Space synthesize click). No public `.avatar` recipe required.

## Open questions

- [x] Element strategy — **resolved:** `web-component`
- [x] Consumer API — **resolved:** see below (click when interactive)

## Element strategy (user confirmed)

| Element | Strategy | Notes |
|---------|----------|-------|
| Avatar | `web-component` | Tag `harmony-avatar`; open Shadow DOM |

## Approach & stack fit (user confirmed)

- Initials normalized in element; missing initials/src → `user` icon
- Interactive: `role=button`, delegatesFocus, Enter/Space → `click`
- Image `alt=""`; accessible name on host
- Forced-colors: shadow-local

## Production gaps (user confirmed)

| Gap vs Astro | Decision |
|--------------|----------|
| Public `.avatar` recipe / native `button.avatar` | **Skip** — CE-only |
| Astro demo-hover/focus classes | **Skip** — real interaction |
| React `onClick` | **Skip** — use `addEventListener('click')` |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Tag | `harmony-avatar` |
| Attrs | `size` sm\|md\|lg; `variant` icon\|initials\|image; `initials`; `src`; `alt`; `interactive`; `disabled` |
| Events | `click` when interactive (keyboard synthesizes); disabled suppresses |
| Parts | `icon`, `initials`, `image` |
| Form | none |
| Docs | `docs/components/Avatar.md`, CEM, AGENTS, llms |

## Blocking dependencies

Icon is `synced`.

## Phases

### Phase 1 — Apply

- Shadow sheet + `HarmonyAvatar`; CEM; register
- Demo `/components/avatar`
- Docs / AGENTS / llms

### Phase 2 — Verification

- Capture vs reference; verifier; human accept → `synced`

## Approval

**Status: completed** — verifier PASS Avatar-2; plan execute approval 2026-09-10.
