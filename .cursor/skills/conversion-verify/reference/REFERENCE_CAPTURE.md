# Reference capture (Astro) — agent procedure



Used by **conversion-verify** skill when a verifier agent needs reference HTML or PNG.



**Not for Cursor users.** The human says *"verify …"*; the agent runs capture via Shell.



## Agent steps



1. Resolve scope in `converters/reference/preview-routes.json`.

2. Run capture via Shell from repo root (see **conversion-verify** SKILL.md).

3. Confirm artifact written to conversion `verification/artifacts/reference-<scope>.html` (or `.png`).



## Dev server



Scripts start `npm run dev` at repo root (port **4321**) if not already running, unless `CAPTURE_REUSE_SERVER=1`.



## Adding routes



When adding `src/pages/preview/<name>.astro`, update `converters/reference/preview-routes.json`. Element inventory: read `src/data/component-catalog.ts` directly.



## Foundation scope



`/preview/conversion-foundation` — token and typography capture fixture.

