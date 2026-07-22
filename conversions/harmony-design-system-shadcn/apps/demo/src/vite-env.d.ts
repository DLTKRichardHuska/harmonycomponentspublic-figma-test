/// <reference types="vite/client" />

// Allow side-effect CSS imports (e.g. the package's styles/globals.css) under
// TypeScript 7, which no longer implicitly resolves unknown asset imports.
declare module '*.css';
