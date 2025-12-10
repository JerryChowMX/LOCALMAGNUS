# Analysis: Incorrect Data Hook in Format Page

You found a broken link because the **Format Page** is still trying to fetch data from the old/mock system, while the **Article Page** uses the new Strapi integration.

## The Disconnect

1.  **Article Page (`NoticiasArticlePage.tsx`)**
    *   Uses: `useStrapiArticle` (from `hooks/useStrapiArticles.ts`)
    *   Source: `articleApi.ts` -> Strapi `/articles` endpoint.
    *   **Status**: ✅ Works (Fetches real data).

2.  **Format Page (`NoticiasArticleFormatPage.tsx`)**
    *   Uses: `useNoticiasArticle` (from `hooks/useNoticiasArticle.ts`)
    *   Source: `noticiasApi.ts` -> Strapi `/noticias-articles` (Likely invalid) OR Mock Data.
    *   **Status**: ❌ Broken. It tries to find your new Strapi article (e.g., `coahuila...`) in the *Mock Data*, doesn't find it, and returns `null` or an error.

## The Fix

We need to update `NoticiasArticleFormatPage.tsx` to use the **same hook** as the Article Page:

*   Refactor it to use `useStrapiArticle` instead of `useNoticiasArticle`.
*   Ensure it reads the `hero_image` and `content` correctly from the Strapi data structure.

This will ensure that when you click "Original", it fetches the same valid article data that you saw on the previous screen.
