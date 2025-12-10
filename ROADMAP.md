# MAGNUS – Project Roadmap

**Current Status:** Phase 3 Complete (Core Modules Refactored & Typography System Implemented).
**Next Priority:** Phase 4 (Strapi Integration).

---

## ✅ Completed Phases

### Phase 1: Noticias Hub Refactor
-   [x] Audit and refactor `NoticiasHubPage`.
-   [x] Implement `HeaderHubs` and `HeaderContent`.
-   [x] Create strict component-level CSS.
-   [x] Establish "Golden Standard" for list views.

### Phase 2: Resumen Hub Refactor
-   [x] Audit and refactor `ResumenHubPage` and sub-pages (Las 5, Opinión, etc.).
-   [x] Implement `ResumenOptionCard`, `ResumenArticleCard`.
-   [x] Enforce strict styling guidelines.

### Phase 3: EPaper Hub Refactor
-   [x] Audit and refactor `EpaperHubPage` and `EpaperEditionPage`.
-   [x] Implement `EpaperCard` and `PdfViewer`.
-   [x] Ensure module consistency.

### Typography System
-   [x] Implement `Blinker` (Display) and `Inter` (Body) fonts.
-   [x] Create strict typography tokens and utility classes.
-   [x] Refactor `Typography` component.
-   [x] Audit all modules for typography compliance.

---

## 🚀 Upcoming Phases

### Phase 4: Strapi Integration (Data Layer)
**Goal:** Replace mock data with real content from Strapi CMS.
-   [ ] **Setup**: Initialize Strapi project and define Content Types (Article, Edition, Author, Category).
-   [ ] **API Client**: Create a robust HTTP client (Axios/Fetch) with interceptors.
-   [ ] **Services**: Implement `ArticlesService`, `EditionsService`, `ResumenService`.
-   [ ] **Integration**: Connect React components to use real data hooks.
-   [ ] **Media**: Handle image optimization and CDN URLs.

### Phase 5: Authentication & User Features
**Goal:** Enable user accounts, subscriptions, and personalization.
-   [ ] **Auth System**: Implement Login, Register, and Forgot Password flows.
-   [ ] **User Profile**: Create Profile page and "My Account" settings.
-   [ ] **Saved Articles**: Implement "Read Later" / Bookmarks functionality.
-   [ ] **Paywall/Access Control**: Restrict premium content based on subscription status.

### Phase 6: Search & Discovery
**Goal:** Help users find content easily.
-   [ ] **Global Search**: Implement search bar in Header.
-   [ ] **Search Results Page**: Display results with filters (Date, Section, Type).
-   [ ] **Tags/Topics**: Implement tag navigation.

### Phase 7: Polish, Performance & Testing
**Goal:** Ensure a production-ready, high-performance application.
-   [ ] **Performance**: Code splitting, lazy loading, bundle analysis.
-   [ ] **SEO**: Meta tags, Open Graph, Sitemap generation.
-   [ ] **Testing**: Unit tests (Vitest) for utils/hooks, E2E tests (Playwright) for critical flows.
-   [ ] **Accessibility**: Audit and fix a11y issues (ARIA, contrast, keyboard nav).

### Phase 8: Mobile & Native (Future)
**Goal:** Expand to mobile platforms.
-   [ ] **PWA**: Configure Progressive Web App capabilities.
-   [ ] **React Native / Expo**: Evaluate code sharing for native app.

---

## 📅 Timeline Estimates (Rough)

-   **Phase 4 (Strapi)**: 1-2 Weeks
-   **Phase 5 (Auth)**: 1 Week
-   **Phase 6 (Search)**: 3-4 Days
-   **Phase 7 (Polish)**: 1 Week
