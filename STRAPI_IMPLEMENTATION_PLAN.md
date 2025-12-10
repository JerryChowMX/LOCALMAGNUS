# Implementation Plan: Fix Article Format Page Data Source

## Objective
Enable `NoticiasArticleFormatPage` to successfully load and display article content (Original, Executive Summary, Audio) from the Strapi backend, resolving the "nothing happens" / "broken link" issue.

## Diagnosis
The `NoticiasArticleFormatPage` is currently using the legacy `useNoticiasArticle` hook which relies on `noticiasApi` and mock data. It needs to be migrated to use the `useStrapiArticle` hook which connects to the live Strapi backend.

## Proposed Changes

### 1. Update `NoticiasArticleFormatPage.tsx`
*   **Replace Hook**: Swap `useNoticiasArticle` with `useStrapiArticle` import and usage.
*   **Update Data Access**:
    *   Change `article.id` -> `article.documentId`.
    *   Change `article.content` -> `article.blocks` (for Original note).
    *   **Handle Content Rendering**:
        *   Strapi v5 standard articles might use Blocks (Rich Text) or a simple text field. We need to insure we can render the "Original" content.
        *   For now, we will assume `article.blocks` or a `content` text field exists. If it's Blocks, we might need a renderer, but for the MVP fix we'll check what fields are available (based on previous `articleApi.ts` changes, we mapped `blocks` or `content`).
    *   **Fallback Handling**: Ensure `FALLBACK_AUDIO_URL` is used if Strapi doesn't have an audio file yet.

### 2. Verify `useStrapiArticles.ts`
*   Ensure `StrapiArticle` interface includes necessary fields for the format page:
    *   `blocks` (for content)
    *   `summary` (for Executive Summary - we might need to map this from `excerpt` or a new field if Strapi has one)
    *   `audioUrl` (for Audio player)

### 3. Update `articleApi.ts` (Service)
*   Ensure `normalizeArticle` correctly maps these fields from the Strapi response.
    *   Map `summary` -> currently likely `excerpt` or a specific field.
    *   Map `audioUrl` -> check if `audio` field exists in Strapi or use placeholder.

## Step-by-Step Execution

1.  **Inspect Strapi Data Structure (Mental Check)**:
    *   We know `title`, `publishedAt`, `hero_image` work.
    *   We need to verify if `content` or `blocks` is populated in the API response.
2.  **Modify `useStrapiArticles.ts`**: Add missing fields to the interface (`summary`, `audioUrl`, `content`/`blocks`).
3.  **Modify `articleApi.ts`**: Update normalization to populate these fields.
4.  **Refactor `NoticiasArticleFormatPage.tsx`**: Implement the hook swap and field updates.
5.  **Verify**: Navigate to the "Original" format page and confirm content loads.

## Potential Risks
*   **Rich Text Rendering**: If Strapi returns complex Block JSON for content, simply dumping it into a `<Body>` tag won't work. We might need a simple `BlocksRenderer` or just `JSON.stringify` temporarily if it's complex, but ideally, we should render text.
*   **Missing Fields**: If Strapi doesn't have an "Audio" field yet, the audio format page will just show the fallback. This is acceptable for now.
