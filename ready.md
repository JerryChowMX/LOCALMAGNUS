# MAGNUS Dark Mode Integration - Readiness Analysis

## Theme Overview
The current codebase has a partial foundation for theming but is incomplete for a functional Dark Mode. The theme state is managed via a `useProfile` hook and persisted to the backend, which is a good start for persistence. However, there is **no mechanism to apply this theme to the DOM** (e.g., injecting a class or attribute), and the CSS variables in `src/theme/theme.css` lack dark mode definitions. Additionally, there are inconsistent variable naming conventions between the global theme and local component styles.

## Issues & Risks

*   **[CRITICAL] No Theme Application to DOM**: The "Modo oscuro" toggle updates the user settings in the backend/state, but this state is not observed or applied to the `<html>` or `<body>` tags. Consequently, toggling the switch has no visual effect on the global theme.
*   **[CRITICAL] Missing Dark Mode Tokens**: `src/theme/theme.css` defines variables (e.g., `--bg-primary`, `--text-primary`) only for the `:root` scope (Light Mode). There are no overrides (e.g., `[data-theme='dark']`) to change these values when dark mode is active.
*   **[WARNING] Inconsistent Token Usage**: `PerfilHubPage.css` uses variables like `--surface-color` and `--text-color-primary`, which do not match the standard tokens defined in `src/theme/theme.css` (e.g., `--bg-primary`, `--text-primary`). This fragmentation makes global theming difficult.
*   **[WARNING] Conflicting Global Styles**: `src/index.css` contains a `@media (prefers-color-scheme: light)` block and other root styles that might conflict with or override the intended design system in `src/theme/theme.css`.
*   **[INFO] No Global Context**: While `useProfile` handles data fetching, there is no synchronous, app-wide `ThemeContext` to provide the current theme to components instantly without re-fetching or passing props down, which might cause hydration mismatches or "flash of wrong theme".

## Concrete Recommendations

1.  **Create a Global `ThemeContext`**: Wrap the application in a `ThemeProvider` that initializes the theme from local storage (for immediate load) and syncs with the user profile settings.
2.  **Implement DOM Injection**: In the `ThemeProvider`, use a `useLayoutEffect` to add `data-theme="dark"` or `data-theme="light"` to the `<html>` element based on the current active theme.
3.  **Define Dark Mode Tokens**: Update `src/theme/theme.css` to include a `[data-theme='dark']` block that overrides all color variables (e.g., `--bg-primary: #111111;`, `--text-primary: #FFFFFF;`).
4.  **Standardize CSS Variables**: Refactor `PerfilHubPage.css` and other components to use the standard tokens from `src/theme/theme.css` instead of ad-hoc variable names.
5.  **Clean Up `index.css`**: Remove conflicting color schemes and rely on `src/theme/theme.css` as the single source of truth for application colors.
6.  **Update Toggle Logic**: Modify the "Modo oscuro" button to call the `toggleTheme` method from the new `ThemeContext`, ensuring immediate UI feedback while the backend update happens in the background.

## Toggle Path Verification

**Current Path:**
"Modo oscuro" button → `updateSettings` (in `useProfile`) → API Call (`perfilApi.updateAppSettings`) → State Update (`settings.theme`) → **STOP** (No DOM update)

**Status:** **INCOMPLETE / BROKEN**. The path successfully updates the data model but fails to propagate to the view layer (CSS/DOM).

**Proposed Path:**
"Modo oscuro" button → `setTheme` (in `ThemeContext`) → DOM update (`data-theme` attribute) → CSS Variables update (via CSS selectors) → UI Re-render.
*(Async side effect: Sync with API/Backend)*
