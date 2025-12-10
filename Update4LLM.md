# Update for Incoming LLM: Project Magnus

**Date:** 2025-12-02
**Status:** Phase 1 (Noticias Hub), Phase 2 (Resumen Hub), & Phase 3 (EPaper Hub) Complete.

---

## 🛑 CRITICAL DIRECTIVES (DO NOT IGNORE)

The project has shifted to a **STRICT IMPLEMENTATION** phase. Previous loose patterns are **BANNED**.

1.  **Styling Rule**:
    *   **NO** inline styles (e.g., `style={{ padding: 20 }}`).
    *   **NO** CSS-in-JS.
    *   **NO** logic in CSS.
    *   **Pattern**: `Component.tsx` (Logic/JSX) + `Component.css` (Visuals).
    *   **Source**: All values must come from `src/theme/tokens.ts` via CSS variables (e.g., `var(--spacing-md)`, `var(--color-surface)`).

2.  **Routing & Headers**:
    *   You **MUST** follow `RoutingRegistry.md` and `HeaderLogicMap.md` exactly.
    *   Do not invent routes. Do not guess header behavior.
    *   **HeaderHubs**: For list/hub views (with date picker).
    *   **HeaderContent**: For consumption views (back + share).

3.  **Hooks**:
    *   Hooks return **logic/state only** (booleans, data).
    *   Hooks **NEVER** return styles or CSS properties.
    *   Example: `useScrolledHeader` returns `{ isScrolled }`. The Component applies `.header--scrolled`.

---

## 🏗️ Architecture & State

*   **Map**: See `ARCHITECTURE_MAP.md` for the visual hierarchy.
*   **Registry**: See `ComponentRegistry.md` for the authorized component list.
*   **Routing**: See `RoutingRegistry.md` for the authorized route list.

### Completed Modules (Reference Implementation)
*   **Noticias Hub** (`src/modules/noticiasHub`):
    *   Fully refactored. Reference for Hub/List views.
*   **Resumen Hub** (`src/modules/resumenHub`):
    *   Fully refactored. Reference for Grid/Card layouts.
*   **EPaper Hub** (`src/modules/epaper`):
    *   Fully refactored. Reference for simple Hub/Reader flows.
*   **Typography System**:
    *   Implemented new system with Blinker/Inter fonts.
    *   Updated `tokens.ts`, `theme.css`, and `Typography` component.
    *   **Audited & Updated**: All core modules (`Noticias`, `Resumen`, `EPaper`) now strictly follow `TYPOGRAPHY_GUIDELINES.md`.

*   **UI Components**:
    *   **Button**: Refactored with `variant` ("primary", "secondary", "ghost", "glass") and `size` ("sm", "md", "lg"). Added `fullWidth` prop.
    *   **Home Page**: Implemented `HomeHubsPage` with glassmorphism buttons.
    *   **Home Screen Polish**: Implemented strict layout (Logo stack, Welcome block, Footer) matching visual specs. Added Brand Orange token. Refined spacing, logo size, and date formatting based on user feedback.
    *   **Header Hubs**: Refactored `HeaderHubs` to match strict specification (Back button with date, Logo block, Filter button). Verified across all Hub pages. Refined styling for larger logo and perfect alignment. Implemented Glassmorphism using specific tokens (`--glass-bg-header-*`) and dynamic date logic (e.g., "martes, 2 de diciembre"). Adjusted layout to "push down" controls for better visual balance, fixed date label alignment to prevent overflow, and enforced consistent button height for perfect vertical alignment. Removed header bottom border based on user feedback to improve date picker visual integration.
    *   **Date Logic**: Implemented `RedirectToToday` in `AppRouter` to automatically redirect Hub root paths (e.g., `/NoticiasHub`) to the current date, ensuring the default view is always "Today".
    *   **Date Picker**: Integrated `react-datepicker` into `HeaderHubs` with custom glassmorphism styling (`HeaderHubsDatePicker.css`). Replaced prompt-based selection.
    *   **Date Picker**: Integrated `react-datepicker` into `HeaderHubs` with custom glassmorphism styling (`HeaderHubsDatePicker.css`). Replaced prompt-based selection.

### Pending Modules (Legacy/Dirty State)
*   **None**. All core modules have been refactored.

---

## ⚠️ Self-Correction & Critique

*   **Past Mistake**: We initially allowed inline styles for rapid prototyping. This resulted in inconsistent UI and hard-to-maintain code.
*   **Correction**: We have purged inline styles from Noticias Hub.
*   **Risk**: The incoming LLM might look at `ResumenHubPage.tsx` (which hasn't been fixed yet) and think it's okay to copy that pattern. **IT IS NOT.**
*   **Instruction**: Ignore the implementation details of pending modules. Only trust the **Noticias Hub** implementation and the **Registry** documents.

---

## 🚀 Immediate Next Steps

1.  **Verification**: Run full project build and test suite (if available).
2.  **Integration**: Prepare for Strapi integration.
