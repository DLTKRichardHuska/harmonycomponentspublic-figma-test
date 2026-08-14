# Standalone `createHarmonyTheme`

One-off self-contained ESM module that exports `createHarmonyTheme` with **no imports from this package’s source tree**. Token JSON and all theme mappers are inlined.

## Requirements

- `@mui/material` ^9 (peer) — still needed at runtime for `createTheme` / component class helpers
- Fonts are **not** included; load Figtree / Lexend / JetBrains Mono yourself if needed

## Usage

```ts
import { ThemeProvider } from '@mui/material/styles';
import { createHarmonyTheme } from './createHarmonyTheme.js';

const theme = createHarmonyTheme({ product: 'cp' });

<ThemeProvider theme={theme}>{/* app */}</ThemeProvider>
```

Copy `createHarmonyTheme.js` (and optionally `createHarmonyTheme.d.ts`) wherever you need them. This file is **not** part of the published package `exports`.

## Regenerate

From `conversions/harmony-design-system-react-mui`:

```bash
npm run build:standalone
```

Normal library usage (`@dltkrichardhuska/harmony-design-system-react-mui/theme`) is unchanged.
