# {{TARGET_NAME}}

Harmony Design System target: **{{TARGET_ID}}** (component-library).

> **Status: placeholder** — sync and conversion not yet implemented.

## Relationship to reference

This project mirrors the canonical Astro Harmony Design System at the repo root. It is synced one-way from the reference; do not edit the Astro source expecting this target to update automatically until sync is implemented.

## Standalone usage

This target is a **single independent project**. From this folder:

```bash
npm install
npm run dev        # demo/docs site (placeholder)
npm run build:lib  # library bundle for npm publish (placeholder)
```

You can copy this entire folder out of the parent repo and run the same commands.

## Layout

| Path | Role |
|------|------|
| `src/components/` | Converted components (library source) |
| `src/layouts/` | Shell layout |
| `src/styles/` | Foundation tokens and styles |
| `src/pages/` | Demo/docs site |
| `docs/CONSUMER.md` | How to consume this target's API |

## Consumer documentation

See [docs/CONSUMER.md](docs/CONSUMER.md).
