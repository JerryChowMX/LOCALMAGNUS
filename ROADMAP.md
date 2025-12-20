# MAGNUS – Project Roadmap

**Current Status:** Phase 6 In Progress (Search & Discovery).
**Last Updated:** December 2024

---

## ✅ Completed Phases

### Phase 1: Noticias Hub Refactor
- [x] Audit and refactor `NoticiasHubPage`.
- [x] Implement `HeaderHubs` and `HeaderContent`.
- [x] Create strict component-level CSS.
- [x] Establish "Golden Standard" for list views.

### Phase 2: Resumen Hub Refactor
- [x] Audit and refactor `ResumenHubPage` and sub-pages (Las 5, Opinión, etc.).
- [x] Implement `ResumenOptionCard`, `ResumenArticleCard`.
- [x] Enforce strict styling guidelines.

### Phase 3: EPaper Hub Refactor
- [x] Audit and refactor `EpaperHubPage` and `EpaperEditionPage`.
- [x] Implement `EpaperCard` and `PdfViewer`.
- [x] Ensure module consistency.

### Typography System
- [x] Implement `Blinker` (Display) and `Inter` (Body) fonts.
- [x] Create strict typography tokens and utility classes.
- [x] Refactor `Typography` component.
- [x] Audit all modules for typography compliance.

### Phase 4: Strapi Integration (Data Layer)
- [x] **Setup**: Strapi project initialized with Content Types (Article, Edition, Author, Category, Tag).
- [x] **API Client**: Robust `strapiClient.ts` with interceptors and error handling.
- [x] **Services**: `articlesApi.ts`, `epaperApi.ts`, `podcastApi.ts`, `commentsApi.ts`, `perfilApi.ts`.
- [x] **Hooks**: `useStrapiArticles`, `useComments`, `useSubscription`, etc.
- [x] **Adapters**: `strapiAdapter.ts` for data transformation.
- [x] **Media**: Image optimization and CDN URLs working.

### Phase 5: Authentication & User Features
- [x] **Auth System**: Login, Register, Forgot Password flows implemented.
- [x] **Social Login**: Google OAuth integration.
- [x] **Auth Context**: Global auth state with `AuthContext.tsx`.
- [x] **Protected Routes**: `ProtectedRoute.tsx` for gated content.
- [x] **User Profile**: `PerfilHubPage` with account settings.
- [x] **Subscription/Paywall**: `PaymentWallPage`, `useSubscription` hook.
- [x] **Comments**: Authenticated commenting system.

### Podcasts Module
- [x] Podcast Hub with episode listing.
- [x] Audio player with global context.
- [x] Persistent MiniPlayer across navigation.
- [x] Drag-and-drop playlist reordering.
- [x] Audio focus management (pause on video/TTS).

### Videos Module
- [x] Videos del Día hub.
- [x] Video player with custom controls.
- [x] Speed control (2x on hold).

### Article Views
- [x] Unified Article View with format tabs.
- [x] PDF Viewer integration (Presentación).
- [x] TTS Audio player.
- [x] Video embeds.
- [x] Fullscreen horizontal PPT display.

---

## 🚀 Upcoming Phases

### Phase 6: Search & Discovery
**Goal:** Help users find content easily.
- [ ] **Global Search**: Implement search bar in Header.
- [ ] **Search Results Page**: Display results with filters (Date, Section, Type).
- [ ] **Tags/Topics**: Implement tag-based navigation.
- [ ] **Trending/Popular**: Show trending articles.

### Phase 7: Polish, Performance & Testing
**Goal:** Ensure a production-ready, high-performance application.
- [ ] **Performance**: Code splitting, lazy loading, bundle analysis.
- [ ] **SEO**: Meta tags, Open Graph, Sitemap generation.
- [ ] **Testing**: Unit tests (Vitest), E2E tests (Playwright).
- [ ] **Accessibility**: ARIA, contrast, keyboard navigation audit.
- [ ] **Analytics**: PostHog integration for user tracking.

### Phase 8: Mobile & Native
**Goal:** Expand to mobile platforms.
- [ ] **PWA**: Service worker, manifest.json, offline support.
- [ ] **Capacitor**: Wrap React app for iOS/Android stores.
- [ ] **Push Notifications**: Native push via Capacitor.
- [ ] **App Store Submission**: iOS App Store & Google Play.

---

## 📅 Timeline Estimates

| Phase | Effort | Status |
|-------|--------|--------|
| Phase 1-5 | Complete | ✅ |
| Phase 6 (Search) | 3-4 Days | 🔜 Next |
| Phase 7 (Polish) | 1 Week | Pending |
| Phase 8 (Native) | 1-2 Weeks | Pending |

---

## 📋 Notes

- **Strapi CMS**: Running locally, articles being created and served.
- **Auth**: JWT-based with refresh tokens.
- **Design System**: Magnus brand guidelines, no rounded corners, strict typography.
