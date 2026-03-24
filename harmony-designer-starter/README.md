# Harmony designer starter

Self-contained **Harmony React** preview for designers: full shell (`ShellLayout`) and components under `src/components/harmony/`, vendored global CSS (`harmony-styles/`), icon manifest (`harmony-data/`), a **downloaded SVG icon library** at **`icons/`** (Tabler outline + custom—no npm icon pack required to browse assets), plus curated **Cursor** skills, rules, and agents under `.cursor/`.

## Documentation

| Doc | Purpose |
|-----|---------|
| **[HARMONY_DESIGNER_HANDBOOK.md](HARMONY_DESIGNER_HANDBOOK.md)** | Full kit reference: install, skills, rules, agents, slash playbooks, project layout. |
| **[AGENTS.md](AGENTS.md)** | Short Cursor agent context (scope, paths). |
| **[.cursor/DESIGNER_GUIDE.md](.cursor/DESIGNER_GUIDE.md)** | Slash commands and skills quick reference. |

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown (default Vite port **5175**). The home route is the **template shell** (no dev theme switcher). Default theme is **PPM** light; see `src/App.tsx` to change `document.documentElement` classes.

## Build

```bash
npm run build
npm run preview
```

## Pattern tools (optional)

Python **3** recommended for design-patterns scripts:

```bash
python3 .cursor/skills/design-patterns/scripts/search_patterns.py --list
python3 .cursor/skills/design-patterns/scripts/create_pattern.py --help
```

Search defaults to `.cursor/skills/design-patterns/reference`. For full frontmatter parsing: `pip install pyyaml`.

## Package this folder

From **this directory** (`harmony-designer-starter` as the kit root):

```bash
./scripts/package-designer-kit.sh
```

Produces `dist-kit/harmony-designer-starter.zip` (excludes `node_modules`, `dist`, `.git`, and `dist-kit`).

## Kit version

See `KIT_VERSION` and `CHANGELOG.md`.

## License

Internal / UNLICENSED — align distribution with your organization’s policy (same as parent Harmony packages).
