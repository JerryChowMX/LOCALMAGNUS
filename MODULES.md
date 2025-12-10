# Modules

Magnus is structured into feature modules. Each module is self-contained in `src/modules/[feature]`.

## Structure

Each module follows this structure:
- `api/`: API calls and types
- `components/`: Module-specific components
- `hooks/`: Custom hooks
- `pages/`: Page components
- `utils/`: Helper functions

## Articles Module (`src/modules/articles`)

Handles the display and management of articles.

### Pages
- `ArticlesListPage`: Displays a grid of articles with pagination.
- `ArticleDetailPage`: Displays the full content of an article.

### Components
- `NewsCard`: Card component for article previews.
- `Tag`: Category tag.

### Hooks
- `useArticles`: Fetches articles with pagination.

## Noticias Hub Module (`src/modules/noticiasHub`)

Primary feed for Magnus, date-scoped.

### Pages
- `NoticiasHubPage`: Daily feed of articles.
- `NoticiasArticlePage`: Article detail with format chooser.
- `NoticiasArticleFormatPage`: Specific format view (original, audio, etc.).

### Components
- `HeaderHubs`: Navigation and date picker.
- `HeaderContent`: Article actions.
- `ArticleCard`: Feed item.
- `ArticleFormatsList`: Format selector.

## Resumen Hub Module (`src/modules/resumenHub`)

Curated daily digest with 6 distinct sections.

### Pages
- `ResumenHubPage`: Hub root with 6 options.
- `ResumenLas5Page` & sub-pages: "Las 5 noticias del día".
- `ResumenOpinionPage` & sub-pages: "La opinión del día".
- `ResumenPodcastPage`: "El podcast del día".
- `ResumenFotosPage`: "Las fotografías del día".
- `ResumenCartonesPage`: "Los cartones del día".
- `ResumenJuegosRedirectPage`: Redirects to external games.

### Components
- `ResumenOptionCard`: Navigation card.
- `ResumenArticleCard`: Article card with banner.
- `ResumenArticleFormatsList`: Format selector.
- `ResumenPodcastPlayer`: Audio player.
- `ResumenPhotoGallery`: Photo grid.
- `ResumenCartoonStrip`: Cartoon viewer.

## EPaper Hub Module (`src/modules/epaper`)

Daily digital newspaper viewer.

### Pages
- `EpaperHubPage`: List of editions for a date.
- `EpaperEditionPage`: PDF viewer for a specific edition.

### Components
- `EpaperCard`: Edition preview card.
- `PdfViewer`: PDF rendering component (currently mock).

## Global Components

### AI Chat Bar (`src/components/AiChatBar`)
- Glassmorphic floating chat interface.
- Collapsed state: Docked pill at bottom.
- Expanded state: Full modal overlay.
