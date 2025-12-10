# Las 5 del Día - Routes & Content

This document outlines the routes and content structure for the "Las 5 del Día" section within the Resumen Hub.

## Base Route
`/ResumenHub/:date/Las5DelDia`

## Article Routes
The following articles are currently defined in the mock data (`src/modules/resumenHub/mocks/resumenArticles.mock.ts`).

### Route Pattern
`/ResumenHub/:date/Las5DelDia/:slug`

### Current Articles (Mock Data)

| ID (Slug) | Title | Route Example |
| :--- | :--- | :--- |
| `portada` | Portada | `/ResumenHub/:date/Las5DelDia/portada` |
| `politicon` | Politicon | `/ResumenHub/:date/Las5DelDia/politicon` |
| `editorial` | Editorial | `/ResumenHub/:date/Las5DelDia/editorial` |
| `saltillo` | Saltillo | `/ResumenHub/:date/Las5DelDia/saltillo` |
| `dinero` | Dinero | `/ResumenHub/:date/Las5DelDia/dinero` |

## Format Routes
Each article can be viewed in specific formats (e.g., 'text', 'audio', etc., depending on implementation).

### Route Pattern
`/ResumenHub/:date/Las5DelDia/:slug/:format`

## Implementation Details
- **Page Component**: `src/modules/resumenHub/pages/ResumenLas5Page.tsx`
- **Data Hook**: `src/modules/resumenHub/hooks/useResumenLas5Articles.ts`
- **Mock Data**: `src/modules/resumenHub/mocks/resumenArticles.mock.ts`
- **Router**: `src/app/AppRouter.tsx`
