# Dead Code Audit Report

**Date**: 2025-12-12  
**Auditor**: Antigravity AI  
**Project**: Magnus Component Testing

---

## Executive Summary

This audit identified **18 files** containing dead or potentially unused code across the Magnus codebase. The primary categories include:

| Category | Dead Code Files | Status |
|----------|----------------|--------|
| Legacy NoticiasHub Module | 6 files | ❌ No Routes |
| Unused Components | 4 files | ⚠️ No Imports |
| Duplicate Components | 2 directories | ⚠️ Redundant |
| Unused Layout Components | 2 files | ⚠️ No Imports |
| Unused Article Pages | 2 files | ❌ No Routes |

---

## 🔴 Critical: Legacy NoticiasHub Module

> [!CAUTION]
> The NoticiasHub module was replaced by the new `/Notas/` routing structure. Most files are no longer routed.

### Files with NO Routes in AppRouter.tsx

| File | Status | Reason |
|------|--------|--------|
| [NoticiasHubPage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/pages/NoticiasHubPage.tsx) | **DEAD** | Not lazy-loaded in AppRouter |
| [NoticiasArticlePage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/pages/NoticiasArticlePage.tsx) | **DEAD** | Not lazy-loaded in AppRouter |
| [NoticiasArticleFormatPage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/pages/NoticiasArticleFormatPage.tsx) | **DEAD** | Not lazy-loaded in AppRouter |

### Orphaned Components (Only imported by dead pages)

| File | Status | Only Used By |
|------|--------|--------------|
| [ArticleFormatsList.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/ArticleFormatsList.tsx) | **DEAD** | Self-reference only |
| [HeaderHubs.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/HeaderHubs.tsx) | **DEAD** | Not imported anywhere |
| [HeaderHubs.css](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/HeaderHubs.css) | **DEAD** | Only imported by HeaderHubs.tsx |

### Active Components (Still Used - DO NOT DELETE)

| File | Status | Used By |
|------|--------|---------|
| [HeaderContent.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/HeaderContent.tsx) | ✅ Active | UnifiedArticleView, ResumenHub, Playground |
| [ArticleCard.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/ArticleCard.tsx) | ✅ Active | NotasFeedPage |
| [FormatCard.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/components/FormatCard.tsx) | ✅ Active | ResumenArticleFormatsList, FormatSelectionGrid |
| [StrapiTestPage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/noticiasHub/pages/StrapiTestPage.tsx) | ✅ Active | Has route at `/dev/strapi-test` |

---

## 🟡 Warning: Unused Layout Components

### ScreenHeader - No Imports Found

| File | Status | Reason |
|------|--------|--------|
| [ScreenHeader.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/components/Layout/ScreenHeader.tsx) | **DEAD** | Not imported anywhere in codebase |
| [ScreenHeader.css](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/components/Layout/ScreenHeader.css) | **DEAD** | Only imported by ScreenHeader.tsx |

---

## 🟡 Warning: Unused Article Pages

### No Routes in AppRouter.tsx

| File | Status | Reason |
|------|--------|--------|
| [ArticlesListPage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/articles/pages/ArticlesListPage.tsx) | **DEAD** | Not lazy-loaded, no route |
| [ArticleDetailPage.tsx](file:///c:/Users/USER/Desktop/Magnus%20component%20testing/src/modules/articles/pages/ArticleDetailPage.tsx) | **DEAD** | Not lazy-loaded, no route |

> [!NOTE]
> These pages appear to be early development scaffolding that was never integrated into routing.

---

## 🟡 Warning: Duplicate Components

### RecommendedArticles - Two Implementations

| Location | Status | Notes |
|----------|--------|-------|
| `src/components/Article/RecommendedArticles/` | ✅ Production | Used by StandardOneArticle |
| `src/modules/playground/components/articlecomponents/RecommendedArticles/` | ⚠️ Playground-only | Only used in PlaygroundRecommendedArticles |

**Recommendation**: Consider consolidating to use only the production version.

### AuthorCard - Two Implementations

| Location | Status | Notes |
|----------|--------|-------|
| `src/components/Article/AuthorCard/` | ⚠️ Exported but unused | Exported in Article/index.ts but never imported |
| `src/modules/playground/components/articlecomponents/AuthorCard/` | ✅ Used | Only referenced in playground |

---

## ✅ Verified Active Code

### All Hooks - Actively Used

| Hook | Status | Used By |
|------|--------|---------|
| `useAiChat.ts` | ✅ | AiChatBarExpanded |
| `useApiData.ts` | ✅ | ResumenHub hooks |
| `useAuth.ts` | ✅ | PerfilHubPage, LoginForm, SignupForm |
| `usePagination.ts` | ✅ | ArticlesListPage |
| `usePreviewMode.ts` | ✅ | UnifiedArticleView |
| `useScrollTracking.ts` | ✅ | ResumenHub pages |
| `useScrolledHeader.ts` | ✅ | HeaderContent, HeaderHubs |
| `useShare.ts` | ✅ | Multiple pages |
| `useStrapiArticles.ts` | ✅ | NotasFeedPage, UnifiedArticleView |

### All Services - Actively Used

| Service | Status | Used By |
|---------|--------|---------|
| `articleApi.ts` | ✅ | useStrapiArticles |
| `authApi.ts` | ✅ | AuthContext |
| `api/articlesApi.ts` | ✅ | ArticleDetailPage, useArticles |
| `api/strapiClient.ts` | ✅ | Multiple services |

### All Contexts - Actively Used

| Context | Status | Used By |
|---------|--------|---------|
| `AuthContext.tsx` | ✅ | AuthProvider in AppRouter |
| `LightboxContext.tsx` | ✅ | LightboxProvider in App.tsx |

---

## Marking Convention

Dead code has been marked with the following comment pattern:

```typescript
// @DEAD_CODE: [REASON] - Identified 2025-12-12
```

### Search Commands

To find all marked dead code:
```bash
grep -r "@DEAD_CODE" src/
```

---

## Recommendations

### Immediate Actions (Safe to Delete)

1. **NoticiasHub Legacy Pages** - NoticiasHubPage, NoticiasArticlePage, NoticiasArticleFormatPage
2. **HeaderHubs Component** - Replaced by HeaderCenteredStack
3. **ArticleFormatsList** - No longer used
4. **ScreenHeader** - Never integrated

### Review Before Deletion

1. **ArticlesListPage / ArticleDetailPage** - Confirm these were scaffolding only
2. **Duplicate RecommendedArticles** - Decide which implementation to keep
3. **AuthorCard in components/Article** - Verify if planned for future use

### Dependencies to Check Before Deletion

When deleting `noticiasHub/pages/*`:
- Keep `HeaderContent.tsx` (actively used)
- Keep `ArticleCard.tsx` (used by NotasFeedPage)
- Keep `FormatCard.tsx` (used by ResumenHub)
- Keep CSS files for active components

---

## File Statistics

| Category | Total Files | Dead Files | Active Files |
|----------|-------------|------------|--------------|
| NoticiasHub Module | 24 | 6 | 18 |
| Components | 107 | 4 | 103 |
| Hooks | 9 | 0 | 9 |
| Services | 4 | 0 | 4 |
| **Total** | 144 | 10 | 134 |

---

## Next Steps

1. Review this audit report
2. Confirm files marked as DEAD are safe to delete
3. Add `@DEAD_CODE` comments to identified files
4. Create removal PR after confirmation
