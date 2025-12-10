# Routing Registry

This document serves as the authoritative source for all routes in the Magnus application.

## 0. Route Param Types (TypeScript)

```typescript
// yyyy-mm-dd, e.g. "2025-01-10"
export type DateParam = string;

export type ArticleFormatParam =
  | "original"   // Leer nota original
  | "ejecutivo"  // Resumen Ejecutivo
  | "audio"      // Resumen de audio
  | "guiada";    // Presentación guiada

export interface NoticiasRouteParams {
  date: DateParam;
  slug: string;
  format?: ArticleFormatParam;
}

export interface ResumenLas5RouteParams {
  date: DateParam;
  slug?: string;
  format?: ArticleFormatParam;
}

export interface ResumenOpinionRouteParams {
  date: DateParam;
  slug?: string;
  format?: ArticleFormatParam;
}

export interface EPaperRouteParams {
  date: DateParam;
  editionNumber?: string;
}
```

---

## 1. Root & Global

### HomeHubs
- **Path**: `/`
- **Component**: `Home` (Planned: `HomeHubsPage`)
- **Header**: None or simple AppHeader
- **Description**: Entry screen that lets the user choose one of the 4 hubs: Noticias, Resumen, EPaper, Perfil.

---

## 2. Noticias Hub Routes

### NoticiasHubList
- **Path**: `/NoticiasHub/:date`
- **Params**: `{ date: DateParam }`
- **Component**: `NoticiasHubPage`
- **Header**: `HeaderHubs`
- **Description**: Main daily news feed. Date picker in header changes route to `/NoticiasHub/:newDate`.

### NoticiasArticle
- **Path**: `/NoticiasHub/:date/:slug`
- **Params**: `{ date: DateParam; slug: string }`
- **Component**: `NoticiasArticlePage`
- **Header**: `HeaderContent`
- **Description**: Article detail “format chooser” screen for Noticias.

### NoticiasArticleFormat
- **Path**: `/NoticiasHub/:date/:slug/:format`
- **Params**: `{ date: DateParam; slug: string; format: ArticleFormatParam }`
- **Component**: `NoticiasArticleFormatPage`
- **Header**: `HeaderContent`
- **Description**: Actual content view for a selected format of a Noticias article.

---

## 3. Resumen Hub Routes

### ResumenHubHome
- **Path**: `/ResumenHub/:date`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenHubPage`
- **Header**: `HeaderHubs`
- **Description**: Curated digest entry. Shows 6 options: Las 5, Podcast, Opinion, Photos, Cartoons, Games.

### ResumenLas5List
- **Path**: `/ResumenHub/:date/Las5DelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenLas5Page`
- **Header**: `HeaderHubs`
- **Description**: Shows the 5 curated articles of the day.

### ResumenLas5Article
- **Path**: `/ResumenHub/:date/Las5DelDia/:slug`
- **Params**: `{ date: DateParam; slug: string }`
- **Component**: `ResumenLas5ArticlePage`
- **Header**: `HeaderContent`
- **Description**: Detail view for one of the 5 articles, with format selector.

### ResumenLas5ArticleFormat
- **Path**: `/ResumenHub/:date/Las5DelDia/:slug/:format`
- **Params**: `{ date: DateParam; slug: string; format: ArticleFormatParam }`
- **Component**: `ResumenLas5ArticleFormatPage`
- **Header**: `HeaderContent`
- **Description**: Renders the selected format for that curated article.

### ResumenOpinionList
- **Path**: `/ResumenHub/:date/LaOpinionDelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenOpinionPage`
- **Header**: `HeaderHubs`
- **Description**: List of daily opinion/column articles.

### ResumenOpinionArticle
- **Path**: `/ResumenHub/:date/LaOpinionDelDia/:slug`
- **Params**: `{ date: DateParam; slug: string }`
- **Component**: `ResumenOpinionArticlePage`
- **Header**: `HeaderContent`
- **Description**: Detail view for opinion article.

### ResumenOpinionArticleFormat
- **Path**: `/ResumenHub/:date/LaOpinionDelDia/:slug/:format`
- **Params**: `{ date: DateParam; slug: string; format: ArticleFormatParam }`
- **Component**: `ResumenOpinionArticleFormatPage`
- **Header**: `HeaderContent`
- **Description**: Renders the selected format for opinion article.

### ResumenPodcast
- **Path**: `/ResumenHub/:date/ElPodcastDelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenPodcastPage`
- **Header**: `HeaderContent` (when playing)
- **Description**: Daily curated podcast.

### ResumenPhotos
- **Path**: `/ResumenHub/:date/LasFotosDelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenFotosPage`
- **Header**: `HeaderContent`
- **Description**: Daily photo gallery.

### ResumenCartoons
- **Path**: `/ResumenHub/:date/LosCartonesDelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenCartonesPage`
- **Header**: `HeaderContent`
- **Description**: Daily cartoons strip.

### ResumenGamesRedirect
- **Path**: `/ResumenHub/:date/LosJuegosDelDia`
- **Params**: `{ date: DateParam }`
- **Component**: `ResumenJuegosRedirectPage`
- **Header**: None (Redirect)
- **Description**: Redirects to external games portal.

---

## 4. EPaper Hub Routes

### EPaperHub
- **Path**: `/EPaper/:date`
- **Params**: `{ date: DateParam }`
- **Component**: `EpaperHubPage`
- **Header**: `HeaderHubs`
- **Description**: Daily EPaper hub. Date picker selects the day’s edition(s).

### EPaperEdition
- **Path**: `/EPaper/:date/:editionNumber`
- **Params**: `{ date: DateParam; editionNumber: string }`
- **Component**: `EpaperEditionPage`
- **Header**: `HeaderContent`
- **Description**: Full reading view for a specific EPaper edition, with AI chat overlay.

---

## 5. Perfil / Config Hub (Stubs)

### PerfilHub
- **Path**: `/PerfilHub`
- **Component**: `PerfilHubPage` (TBD)
- **Header**: TBD
- **Description**: Manages user profile, settings, membership, etc.

---

## 6. 404 & Fallback

### NotFound
- **Path**: `*`
- **Component**: `NotFoundPage` (TBD)
- **Description**: Shown when no route matches. Offer navigation back to `/`.
