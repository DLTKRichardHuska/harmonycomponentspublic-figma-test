# Converter — harmony-design-system-vanilla

Playbooks for the **frameworkless** Harmony conversion: native HTML + CSS recipes, optional hybrid Custom Element helpers, encapsulated Custom Elements, native ESM.

**Element strategies:** `native` | `hybrid` | `web-component` | `skip` (prefer native → hybrid → web-component).

| File | Role |
|------|------|
| `playbook/SKILL.md` | Engineer agent |
| `playbook/VERIFICATION.md` | Verify / remediate loop |
| `playbook/VERIFIER.md` | QA verifier agent |
| `playbook/plans/ai-consumer-artifacts.md` | AI + human artifact set |
| `scripts/sync-tokens.mjs` | Copy/adapt reference tokens |

Output: `conversions/harmony-design-system-vanilla/` (npm workspace: `packages/ui` + `apps/demo`).  
Consume: npm product subpaths **or** per-product static zip under `packages/ui/dist-static/`.
