# Search Bar Improvements

**Branch:** `feature/ui-integration`  
**Date:** January 9, 2026  
**Status:** Ready for commit

---

## Overview

Implemented context-aware search functionality across the application. Previously, all search bars (on Articles, Videos, and Podcasts pages) only searched for articles. Now each section searches its own content type:

| Page | Search Mode | Returns |
|------|-------------|---------|
| Notas (Articles) | `articles` | Articles |
| Videos del Día | `videos` | Video posts |
| Podcasts | `podcasts` | Podcasts |

---

## Files Created

### Backend (Strapi)

| File | Purpose |
|------|---------|
| *(Modified)* `magnus-strapi/src/api/search/controllers/search.ts` | Added `searchVideos()` and `searchPodcasts()` controller methods |
| *(Modified)* `magnus-strapi/src/api/search/routes/search.ts` | Added routes for `/search/videos` and `/search/podcasts` |

### Frontend - Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useVideoSearch.ts` | **NEW** - Hook for video search with debouncing and abort control |
| `src/hooks/usePodcastSearch.ts` | **NEW** - Hook for podcast search with debouncing and abort control |

### Frontend - API Layer

| File | Purpose |
|------|---------|
| *(Modified)* `src/api/searchApi.ts` | Added `searchVideos()` and `searchPodcasts()` methods, plus type definitions |

### Frontend - Components

| File | Purpose |
|------|---------|
| *(Modified)* `src/components/Search/SearchModal.tsx` | Added `mode` prop, conditional rendering for each content type |
| *(Modified)* `src/components/Search/SearchModal.css` | Added styles for video and podcast search results |
| *(Modified)* `src/components/Header/HeaderCenteredStack.tsx` | Added `searchMode`, `onVideoSelect`, `onPodcastSelect` props |
| *(Modified)* `src/components/Header/HeaderCenteredStack.css` | Added `.header-centered-stack__search` class (removed inline styles) |

### Frontend - Pages

| File | Purpose |
|------|---------|
| *(Modified)* `src/modules/videosDelDia/pages/VideosDelDiaPage.tsx` | Passes `searchMode="videos"` to header |
| *(Modified)* `src/modules/podcasts/pages/PodcastHubPage.tsx` | Passes `searchMode="podcasts"` to header |

---

## API Endpoints

### POST `/api/search/videos`

**Request Body:**
```json
{
  "query": "string",
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

**Searches Fields:**
- `title`
- `dek` (description)
- `slug`

**Response:**
```json
{
  "results": [VideoPostRaw],
  "meta": {
    "total": number,
    "page": number,
    "pageSize": number,
    "pageCount": number,
    "queryTime": number
  }
}
```

### POST `/api/search/podcasts`

**Request Body:**
```json
{
  "query": "string",
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

**Searches Fields:**
- `title`
- `info` (description)
- `author`
- `slug`

**Response:**
```json
{
  "results": [PodcastSearchResult],
  "meta": {
    "total": number,
    "page": number,
    "pageSize": number,
    "pageCount": number,
    "queryTime": number
  }
}
```

---

## Component API Changes

### SearchModal

**New Props:**
```typescript
interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'articles' | 'videos' | 'podcasts';  // NEW - default: 'articles'
    onVideoSelect?: (video: any) => void;        // NEW - callback for video selection
    onPodcastSelect?: (podcast: any) => void;    // NEW - callback for podcast selection
}
```

### HeaderCenteredStack

**New Props:**
```typescript
interface HeaderCenteredStackProps {
    variant?: "light" | "dark";
    currentDate: string;
    onDateChange: (date: string) => void;
    onBack?: () => void;
    showBackButton?: boolean;
    searchMode?: 'articles' | 'videos' | 'podcasts';  // NEW
    onVideoSelect?: (video: any) => void;              // NEW
    onPodcastSelect?: (podcast: any) => void;          // NEW
}
```

---

## UI Design

### Article Search Results (unchanged)
- Horizontal card layout
- Thumbnail on left (150x100px)
- Title + category on right
- Chevron indicator

### Video Search Results
- Horizontal card layout
- Thumbnail with play overlay icon
- Duration badge on thumbnail
- Title + dek (description)

### Podcast Search Results
- **Square card design** (full-width, 1:1 aspect ratio)
- Full-bleed cover art as background
- Gradient overlay (dark at bottom for legibility)
- Title centered at bottom
- Duration with headphones icon
- Glassmorphism play button (top-right, always visible)
- No hover effects (mobile-first)

---

## CSS Classes Added

```css
/* Video Search */
.search-result-card--video
.search-result-image-wrapper--video
.search-result-play-overlay
.search-result-duration

/* Podcast Search */
.search-results-grid--podcast
.search-result-card--podcast-square
.podcast-card-bg
.podcast-card-bg--placeholder
.podcast-card-gradient
.podcast-card-content
.podcast-card-title
.podcast-card-duration
.podcast-card-play

/* Header */
.header-centered-stack__search
```

---

## Design System Compliance

All new CSS uses design tokens:
- `--spacing-*` for margins/padding
- `--font-size-*`, `--font-family-*`, `--font-weight-*` for typography
- `--text-*`, `--bg-*` for colors
- `--radius-*` for border radius
- `--shadow-*` for shadows
- `--glass-*` for glassmorphism effects
- `--overlay-bg` for overlays
- `--magnus-blue`, `--magnus-blue-dark` for brand colors

**No inline styles used.**

---

## Search Features

Both new search endpoints inherit from the existing article search:

1. **Spanish Stopword Filtering** - Common words (el, la, de, con, etc.) are excluded
2. **Accent Normalization** - "méxico" matches "mexico"
3. **Multi-term AND Logic** - All search terms must match
4. **Field Expansion** - Each term searches multiple fields with OR logic
5. **Query Validation** - Min 2 chars, max 100 chars, max 6 terms
6. **Pagination** - Page-based with configurable page size (max 50)

---

## Testing

### Manual Testing Checklist

- [ ] Search on Notas page returns articles only
- [ ] Search on Videos page returns videos only
- [ ] Search on Podcasts page returns podcasts only
- [ ] Video results show play overlay and duration
- [ ] Podcast results show square cards with gradient
- [ ] Glassmorphism play button visible on podcast cards
- [ ] Spanish accents work (búsqueda, México, etc.)
- [ ] Empty state shows correctly
- [ ] Loading spinner appears during search

### API Testing

```bash
# Test video search
curl -X POST http://localhost:1337/api/search/videos \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "pagination": {"page": 1, "limit": 10}}'

# Test podcast search
curl -X POST http://localhost:1337/api/search/podcasts \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "pagination": {"page": 1, "limit": 10}}'
```

---

## Notes

1. **Callbacks**: `onVideoSelect` and `onPodcastSelect` are currently stubbed with `console.log`. Future implementation could:
   - Navigate to the video/podcast
   - Play content immediately
   - Add to playlist/queue

2. **Mobile-First**: No hover effects on podcast cards since this is a mobile-first app.

3. **Placeholder Text**: Each search mode has its own placeholder:
   - Articles: "Buscar noticias, autores, temas..."
   - Videos: "Buscar videos..."
   - Podcasts: "Buscar podcasts..."

---

## Related Files (Not Modified)

- `src/hooks/useArticleSearch.ts` - Original article search hook (unchanged)
- `src/utils/searchUtils.ts` - Query validation utilities (unchanged)
- `magnus-strapi/src/api/search/content-types/` - Search log content type (unchanged)
