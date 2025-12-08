# Article Population Audit
**Date**: December 8, 2025
**Status**: Verified & Functional

## 1. Overview
This audit documents the current state of the article population workflow in the Magnus application. It covers how data is fetched from Strapi, mapped to frontend structures, and rendered in the `StandardOneArticle` template.

## 2. Data Architecture

### Strapi Backend
*   **Content_Blocks**: The Article Content-Type uses a Dynamic Zone `content_blocks` allowing for flexible content structures.
    *   **Supported Components**: `rich-text`, `quote`, `gallery`, `embed`, and the newly added `audio`.
*   **Relations**:
    *   `related_articles`: A self-referencing relation to manually or automatically link articles for the "Sigue leyendo" section.
    *   `author`, `category`, `tags`: Standard relations populated for metadata.
*   **Audio**:
    *   **Top-Level**: `audio` field (Media) on the Article type for the "Audio Summary" / Podcast feature.
    *   **Block-Level**: `content.audio` component for embedding audio clips within the article body.

### Frontend Data Services
There are currently two parallel data fetching paths that have been synchronized:
1.  **`src/services/articleApi.ts`**:
    *   **Usage**: Primary service for `NoticiasHub` and standard navigation.
    *   **Status**: Updated to populate `related_articles` and handle deep nesting for images/categories.
2.  **`src/api/articlesApi.ts`**:
    *   **Usage**: Used for rapid development routes (`/articulo/:slug`) and direct navigation from Recommended Articles.
    *   **Status**: Updated to include `content_block` normalization logic (Rich Text, Quotes, Audio) matching the main mapper.

## 3. Component Implementation Status

### Core Template (`StandardOneArticle.tsx`)
*   **Layout**: Refined to match design requirements (Date -> Title -> Dek -> Metadata -> Hero Image).
*   **Dek (Summary)**:
    *   **Implementation**: Uses `react-markdown` with `remark-gfm`.
    *   **Status**: Correctly renders Markdown syntax (italics, bold) within the summary.

### Content Blocks (`contentBlocks` array)
1.  **Rich Text**:
    *   **Mapping**: Normalizes `content` or `text` fields from Strapi.
    *   **Rendering**: Styled paragraph and heading output.
2.  **Gallery**:
    *   **Mapping**: Deep maps nested image data from Strapi v4/v5 structures.
    *   **Rendering**: Displays as a 2-column grid.
    *   **Features**: Includes caption support below the grid.
3.  **Audio**:
    *   **Mapping**: Mapped from `content.audio` blocks.
    *   **Rendering**: Renders the `AudioPlayer` component inline with an optional title.
4.  **Quotes**:
    *   **Mapping**: Normalizes `quote_text` to `quote`.
    *   **Rendering**: Distinctive style with colored left border.

### Audio Features
*   **Audio Summary**: Requires `audioUrl` on the main article object. Renders a distinct player at the top of the article.
*   **Article Audio**: Renders wherever placed in the content flow.

### Recommended Articles ("Sigue leyendo")
*   **Data Source**: `relatedArticles` array in `ArticleStandard`.
*   **Design**:
    *   Background: White (`#ffffff`).
    *   CTA ("Ver todos"): Magnus Orange (`var(--color-brand-orange)`).
    *   Cards: Clean design, **Category tag removed** per user request.
*   **Interaction**: Clicking a card navigates to `/articulo/:slug`.
    *   **Fix**: Confirmed that body content loads correctly after navigation (previously fixed a mapping issue in `articlesApi.ts`).

## 4. Action Items / Recommendations
1.  **Refactor Mappers (COMPLETED)**:
    *   **Action**: Consuming redundant logic, I created a reusable helper `normalizeContentBlocks` in `src/utils/articleMapper.ts`.
    *   **Result**: Both `articleApi.ts` and `articlesApi.ts` now consume this shared logic, ensuring consistent content block parsing across all routes.
2.  **Strapi Synchronization**: Ensure the local schema definitions (`magnus-strapi`) are kept in sync with any manual changes made in the Strapi Admin panel to prevent population errors (400 Bad Request).
