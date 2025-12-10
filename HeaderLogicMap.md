# Header Logic Map

This document defines which Header component is used for each route and the specific logic/features active in that context.

## Overview

The application uses two distinct header types depending on the "depth" of navigation:

1.  **HeaderHubs**: Used on hub-level and selection/list screens, usually with date picker.
2.  **HeaderContent**: Used on content consumption screens (article detail, formats, PDF, podcast, etc.).

Some routes intentionally use no header (e.g., hard redirects).

---

## 1. Root & Perfil

| Route | Header | Reason |
| :--- | :--- | :--- |
| `/` | **None / AppHeader** | Entry hub selector. |
| `/PerfilHub` | **HeaderContent** | Profile/settings behave like a “content” section, not date-scoped. |

---

## 2. Noticias Hub

| Route | Header | Reason |
| :--- | :--- | :--- |
| `/NoticiasHub/:date` | **HeaderHubs** | User is selecting articles. Needs date picker. |
| `/NoticiasHub/:date/:slug` | **HeaderContent** | Inside specific article. No date picker needed. Share icon active. |
| `/NoticiasHub/:date/:slug/:format` | **HeaderContent** | Consuming specific format. Same behavior as article detail. |

---

## 3. Resumen Hub

| Route | Header | Reason |
| :--- | :--- | :--- |
| `/ResumenHub/:date` | **HeaderHubs** | Hub-level view. User selects summary module. Date picker required. |
| `/ResumenHub/:date/Las5DelDia` | **HeaderHubs** | Selection/list context (5 curated articles). Date picker keeps user in "Las 5" mode. |
| `/ResumenHub/:date/Las5DelDia/:slug` | **HeaderContent** | Inside one of the 5 articles. Focus is on content. |
| `/ResumenHub/:date/Las5DelDia/:slug/:format` | **HeaderContent** | Consuming specific format of curated article. |
| `/ResumenHub/:date/LaOpinionDelDia` | **HeaderHubs** | List of daily opinion pieces. Selection mode. Date picker available. |
| `/ResumenHub/:date/LaOpinionDelDia/:slug` | **HeaderContent** | Inside one opinion article. |
| `/ResumenHub/:date/LaOpinionDelDia/:slug/:format` | **HeaderContent** | Consuming specific format for opinion article. |
| `/ResumenHub/:date/ElPodcastDelDia` | **HeaderContent** | Podcast player is content consumption. |
| `/ResumenHub/:date/LasFotosDelDia` | **HeaderContent** | User is in content experience (gallery). |
| `/ResumenHub/:date/LosCartonesDelDia` | **HeaderContent** | Consuming daily cartoon content. |
| `/ResumenHub/:date/LosJuegosDelDia` | **None** | Redirects to external URL. |

---

## 4. EPaper Hub

| Route | Header | Reason |
| :--- | :--- | :--- |
| `/EPaper/:date` | **HeaderHubs** | Hub-level view. Date picker selects day’s edition. |
| `/EPaper/:date/:editionNumber` | **HeaderContent** | Reading specific edition. Pure content consumption (PDF + AI Chat). |

---

## 5. 404 / Misc

| Route | Header | Reason |
| :--- | :--- | :--- |
| `*` | **None / Minimal** | Simple “Page not found”. |

---

## Summary Table

| Route Pattern | Header |
| :--- | :--- |
| `/` | None / AppHeader |
| `/NoticiasHub/:date` | HeaderHubs |
| `/NoticiasHub/:date/:slug` | HeaderContent |
| `/NoticiasHub/:date/:slug/:format` | HeaderContent |
| `/ResumenHub/:date` | HeaderHubs |
| `/ResumenHub/:date/Las5DelDia` | HeaderHubs |
| `/ResumenHub/:date/Las5DelDia/:slug` | HeaderContent |
| `/ResumenHub/:date/Las5DelDia/:slug/:format` | HeaderContent |
| `/ResumenHub/:date/LaOpinionDelDia` | HeaderHubs |
| `/ResumenHub/:date/LaOpinionDelDia/:slug` | HeaderContent |
| `/ResumenHub/:date/LaOpinionDelDia/:slug/:format` | HeaderContent |
| `/ResumenHub/:date/ElPodcastDelDia` | HeaderContent |
| `/ResumenHub/:date/LasFotosDelDia` | HeaderContent |
| `/ResumenHub/:date/LosCartonesDelDia` | HeaderContent |
| `/ResumenHub/:date/LosJuegosDelDia` | None (redirect) |
| `/EPaper/:date` | HeaderHubs |
| `/EPaper/:date/:editionNumber` | HeaderContent |
| `/PerfilHub` | HeaderContent |
| `*` | None / Minimal |
