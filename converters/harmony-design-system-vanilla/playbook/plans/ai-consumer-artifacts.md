# AI consumer artifacts — harmony-design-system-vanilla

Converter: `harmony-design-system-vanilla`  
Status: **required** (bootstrap stubs ship with harness; filled per element on execute)  
Updated: 2026-09-09

## Goal

Machine-readable / agent-oriented artifacts for `@dltkrichardhuska/harmony-design-system-vanilla` so AI coding systems and humans consume Harmony via **npm or static zip** as:

- **Native recipes** — real HTML + documented classes
- **Hybrid** — same recipe **plus** optional light-DOM Custom Element helpers
- **Web components** — encapsulated Custom Elements when needed

## Deliverable set (required)

| Artifact | Location | Role |
|----------|----------|------|
| **`AGENTS.md`** | `packages/ui/` | Install (npm **and** static), product choice, stylesheet/register, `.dark`, catalog→surface map, Do/Don’t, WCAG 2.3 AA |
| **`llms.txt`** | `packages/ui/` | Compact barrel: native tags/classes and/or CE tags + paths + one-liners |
| **`docs/components/*.md`** | `packages/ui/docs/components/` | Per-element API + a11y + Don’t |
| **`docs/components/README.md`** | same | Index |
| **`docs/foundation/*.md`** | when foundation ships | Token usage |
| **`docs/shell/*.md`** | when shell ships | Shell pieces |
| **`custom-elements.json`** | `packages/ui/` | Custom Elements Manifest — **generated** (`npm run gen:cem`); only for shipped CEs; never hand-edit |
| **Cursor rule snippet** | Getting Started + CONSUMER.md | Thin pointer to `AGENTS.md` |

**No shadcn registry** — CEM covers Custom Elements; native recipes live in docs + `AGENTS.md` catalog map.

## Per-product delivery

Author once against multi-product source; flatten specializes into `dist-products/<product>/` and `dist-static/<product>/`:

- Prepend **single-product banner** to `AGENTS.md` / `llms.txt`
- Rewrite import examples to `@pkg/<product>` (npm) and relative static paths
- Drop product-exclusive elements from other products’ barrels/docs

## Maintenance checklist

### Every `native` sync

1. [ ] `docs/components/<Name>.md` — native skeleton (HTML first)
2. [ ] `docs/components/README.md` — index row
3. [ ] `AGENTS.md` — catalog map → **tag + classes** (not a `harmony-*` tag)
4. [ ] `llms.txt` — barrel line for the recipe
5. [ ] Product CSS includes the component recipe; rebuild products/static kits
6. [ ] Both npm and static consume paths remain documented
7. [ ] **Do not** add a CEM entry

### Every `hybrid` sync

1. [ ] All `native` checklist items (CSS recipe is source of truth)
2. [ ] Docs show **both** native HTML and CE examples as equal
3. [ ] Public `.d.ts` / CE surface matches hybrid Consumer API
4. [ ] `npm run gen:cem` after CE export changes
5. [ ] `AGENTS.md` notes hybrid (native path + optional tag)

### Every `web-component` sync

1. [ ] `docs/components/<Name>.md` — full CE skeleton
2. [ ] `docs/components/README.md` — index row
3. [ ] `AGENTS.md` — catalog→tag map
4. [ ] `llms.txt` — barrel line
5. [ ] Public `.d.ts` matches Consumer API + docs
6. [ ] `npm run gen:cem` after export changes
7. [ ] Rebuild products/static kits when styles or elements change
8. [ ] Both npm and static consume paths remain documented

## Required `docs/components/<Name>.md` skeletons

### Native

1. Title + one-line summary + strategy `native`
2. Stylesheet load — **npm and static** snippets (product `styles.css`)
3. Analog tag(s) + class recipe
4. Composition examples (normal HTML / synced Harmony children — no wrappers)
5. Native attributes kept
6. A11y contract (WCAG 2.3 AA; forced-colors via document CSS)
7. Examples
8. **Don’t** (no React/Lit/MUI/Tailwind; no product switching; no inventing Astro-only props; no required CE wrapper)

### Hybrid

1. Same as native, then:
2. Optional Custom Element — tag, attr→class map, light DOM
3. **Both paths valid** examples
4. Form/selector notes if CE is not a built-in
5. CEM / register snippets for the CE path only

### Web-component

1. Title + one-line summary  
2. Import / register — **npm and static** snippets  
3. Attributes / properties (Harmony + platform)  
4. Events / methods  
5. Slots / CSS parts  
6. A11y contract (WCAG 2.3 AA; shadow-local forced-colors)  
7. Examples  
8. **Don’t** (no React/Lit/MUI/Tailwind; no product switching; no inventing Astro-only props)

## Anti-patterns

- Shipping an element with only a demo page  
- npm-only docs when static kit exists  
- Hand-editing `custom-elements.json`  
- Docs disagreeing with `userDecision` / Consumer API  
- Teaching `theme-*` or runtime product switching  
- Documenting hybrid with CE-only examples (native path must remain complete)  
- Catalog map that invents a `harmony-*` tag for a pure `native` element  
