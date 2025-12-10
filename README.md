# Magnus

Magnus is a premium, mobile-first news reading experience.

## Architecture

Magnus is built as a modular, scalable, TypeScript-based application.
It uses Vite + React + TypeScript with a strict Design Token system.

### Folder Structure

- `src/app`: App shell, providers, global routing config.
- `src/components`: Atomic, reusable, design-system components.
- `src/modules`: Feature modules (Articles, Audio, Epaper, etc.).
- `src/theme`: Design tokens, variables, spacing, typography.
- `src/api`: Backend clients.
- `src/hooks`: Global reusable logic hooks.
- `src/utils`: Helpers.
- `src/types`: Global TS types.

## Mobile-First Principles

- All styling is token-based.
- Components are designed to be composable and reusable.
- No DOM-specific hacks should be used to ensure future compatibility with React Native.

## Installation

```bash
npm install
npm run dev
```

## Strictness

TypeScript `strict: true` is enabled. No `any` is allowed.
