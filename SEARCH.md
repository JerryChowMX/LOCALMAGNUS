# MAGNUS Search Feature Documentation

This document provides a comprehensive technical overview of the search functionality in the MAGNUS application. It is intended for developers integrating, maintaining, or extending the search feature.

---

## 1. System Architecture

The search feature is a full-stack implementation involving a React frontend, a Strapi backend, and an AI integration for semantic understanding.

**Data Flow:**
1.  **User Input** -> Frontend (`SearchModal.tsx`)
2.  **API Request** -> `POST /api/search` (via `searchApi.ts`)
3.  **Backend Processing** -> Strapi Controller (`search.ts`)
4.  **Database Query** -> Multi-field filtering (Title, Excerpt, Author, Category, Tags, AI Keywords)
5.  **Response** -> Results displayed in Modal.

**Key Components:**
-   **Frontend**: React, React Portal, CSS Modules.
-   **Backend**: Strapi v5 (using `entityService`), Google Gemini AI (for keywords).

---

## 2. Frontend Implementation

### A. File Structure
-   `src/components/Search/SearchModal.tsx`: Main UI component.
-   `src/components/Search/SearchModal.css`: Styling and animations.
-   `src/hooks/useArticleSearch.ts`: Logic hook for state and API calls.
-   `src/api/searchApi.ts`: API client layer.

### B. UI & Layout Strategy (CSS)
The design prioritizes a "clean, sharp, and high-impact" aesthetic.

*   **Positioning Strategy**: usage of **React Portals** (`createPortal`) is mandatory. The modal is rendered directly into `document.body` to bypass stacking contexts of parent headers or containers.
*   **Z-Index**: `z-index: 9999` is applied to `.search-modal-overlay` to ensure it sits on top of all other UI elements (including sticky headers and video players).
*   **Design Tokens**: Uses global variables (e.g., `var(--bg-primary)`, `var(--magnus-blue)`) for theme consistency (Light/Dark mode).
*   **Specific Style Rules**:
    *   **No Rounded Corners**: Border radius is strictly set to `0` for result cards and images to maintain a brutalist/sharp look.
    *   **Image Dimensions**: Thumbnails are **150px x 100px** fixed size.
    *   **Typography**: Titles use `line-clamp: 4` to allow long headlines to be fully readable. Use `var(--font-family-title)`.

`src/components/Search/SearchModal.css` (Key Snippet):
```css
.search-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999; /* Critical for overlay priority */
    background-color: var(--bg-primary);
}
.search-result-card {
    border-radius: 0; /* Design Requirement */
    border-bottom: 1px solid var(--border-subtle);
}
```

### C. Component Logic (`SearchModal.tsx`)
1.  **Debounce**: Input is debounced by **300ms** to prevent API thrashing.
2.  **Immediate Trigger**: Pressing `Enter` bypasses the debounce timer for instant feedback.
3.  **Loading UX**:
    *   **Header Spinner**: Replaces the search icon during fetching.
    *   **Result Dimming**: Existing results opacity drops to `0.5` while new results load, preventing layout shift.
4.  **Image Handling**: Images must be prefixed with `STRAPI_ORIGIN` (import from `src/lib/env.ts`) to ensure they load from the correct backend URL in all environments.

---

## 3. Backend Implementation (Strapi)

### A. API Endpoint
*   **Route**: `POST /api/search`
*   **Public Access**: Configured in `config/middlewares.ts` and Public Role permissions to allow unauthenticated search.

### B. Controller Logic (`controllers/search.ts`)
The controller currently uses `strapi.entityService` (not `strapi.documents`) for stability and consistency.

**Search Algorithms:**
The search query performs a case-insensitive `$containsi` match across **6 fields**:
1.  `title`
2.  `excerpt`
3.  `author.name`
4.  `category.name`
5.  `tags.name`
6.  `search_keywords` (AI Generated - see below)

**Code Snippet:**
```typescript
{
  $or: [
    { title: { $containsi: term } },
    { author: { name: { $containsi: term } } },
    { search_keywords: { $containsi: term } }, // AI Semantic Match
    // ... others
  ]
}
```

### C. AI Semantic Search Integration
This is the "Secret Sauce" of the search engine.

*   **Mechanism**: Strapi Lifecycle Hook (`beforeCreate`, `beforeUpdate`) on the **Article** content type.
*   **File**: `src/api/article/content-types/article/lifecycles.ts`.
*   **Logic**:
    1.  When an article is saved, the hook extracts text from `content_blocks`.
    2.  It sends this text to **Google Gemini 1.5 Flash**.
    3.  Prompt: *"Generate 15 hidden keywords, synonyms, and related concepts (e.g. Fentanilo -> Drogas, Salud Pública)."*
    4.  Result is saved to the private `search_keywords` text field in the database.
*   **Benefit**: Allows users to find articles conceptually (e.g., searching "Addiction" finds an article about "Fentanyl" even if the word "Addiction" is never explicitly used).

---

## 4. Data Models & Database

### A. Article Schema
*   **New Field**: `search_keywords`
    *   Type: `Text` (Long text)
    *   Visibility: `private: true` (Not exposed in standard API, internal use only).

### B. Search Logs (Analytics)
*   **Concept**: Every search is logged for analytics.
*   **Content Type**: `search-log`.
*   **Fields**: `query`, `resultCount`, `userId` (optional), `queryTime` (ms), `tokens` (tokenized query terms).
*   **Note**: `publishedAt` is NOT used as this is a log-only type.

---

## 5. Development & Deployment

### A. Environment Variables
Ensure these are set in your `.env`:

*   **Backend**:
    *   `GOOGLE_AI_API_KEY`: Required for semantic keyword generation.
    *   `STRAPI_INTERNAL_URL`: Used for TTS webhooks (related feature).

*   **Frontend**:
    *   `VITE_STRAPI_URL`: URL of the Strapi backend (e.g., `http://localhost:1337`).

### B. Developer Workflow for Search
1.  **Modify UI**: Edit `SearchModal.css`. **Do not add rounded corners.**
2.  **Debug Results**: Check `search-log` in Strapi Admin to see what users are querying.
3.  **Improve AI**: Edit the prompt in `lifecycles.ts` to tune keyword generation.

### C. Deployment Checklist
*   [ ] Run `npm run build` in frontend.
*   [ ] Ensure `magnus-strapi` is redeployed to apply the new `search_keywords` column in the DB.
*   [ ] **CORS**: Verify `config/middlewares.ts` allows the frontend domain.
