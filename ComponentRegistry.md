# Component Registry

## 0. Architecture Reminder
All components follow:
- **Atomic hierarchy**
- **Design tokens** (`src/theme/tokens.ts`)
- **Strict TypeScript**
- **Mobile-first**
- **Future React Native compatibility**

---

## 1. GLOBAL COMPONENTS (`src/components`)
These components are universal and must never contain domain or module logic.

### 1.1 AiChatBar
- **Path**: `src/components/AiChatBar/`
- **Purpose**: EPaper floating AI assistant (glass morphism).
- **Subcomponents**:
  - `AiChatBarCollapsed`
  - `AiChatBarExpanded`
- **Notes**: Uses glass blur tokens. Appears only on EPaper Edition screens. Handles own open/close state.

### 1.2 Typography
- **Path**: `src/components/Typography/`
- **Components**:
  - `Heading`
  - `Text`
  - `Body`
  - `Caption`
  - `Headline` (display style)
- **Notes**: All variants use `fontToken`, `colorToken`, `weight`, and strict `as` prop.

### 1.3 Layout
- **Path**: `src/components/Layout/`
- **Components**:
  - `PageWrapper`: App shell, max-width, scroll, padding.
  - `Container`: Centered block.
  - `Section`: Vertical padded block.
  - `Stack`: Row/column flex composition.
  - `Spacer`: Empty spacing block.
  - `Grid`: Responsive grid.

### 1.4 Button
- **Path**: `src/components/Button/`
- **Variants**: "primary" | "secondary" | "ghost"

### 1.5 Pagination
- **Path**: `src/components/Pagination/`
- **Purpose**: For future infinite scrolling lists or archives.

---

## 2. NAVIGATION HEADERS
These are **GLOBAL** in concept but currently reside in `src/modules/noticiasHub/components` (shared by modules).

### 2.1 HeaderHubs
- **Path**: `src/modules/noticiasHub/components/HeaderHubs.tsx`
- **Used in**:
  - `/NoticiasHub/:Date`
  - `/ResumenHub/:Date` (and options)
  - `/EPaper/:Date`
- **Includes**: Left Chevron, MAGNUS + Vanguardia logo, Date label, “Filtrar” + calendar icon.
- **Variations**: Light/Dark.

### 2.2 HeaderContent
- **Path**: `src/modules/noticiasHub/components/HeaderContent.tsx`
- **Used in**:
  - Noticias full article / format
  - Resumen Las5 / Opinion article detail
  - EPaper edition PDF reader
  - Podcast player, Photos viewer, Cartoons viewer
- **Includes**: Back chevron, MAGNUS logo, Share icon.
- **Variations**: Light/Dark.

---

## 3. MODULE COMPONENTS (`src/modules/*`)

### 3.1 NOTICIAS HUB (`src/modules/noticiasHub`)
- **ArticleCard**: Used on `/NoticiasHub/:Date`. Shows pre-edited image, title over gradient.
- **ArticleFormatsList**: Used on article detail routes. Formats: "original", "ejecutivo", "audio", "guiada".

### 3.2 RESUMEN HUB (`src/modules/resumenHub`)
- **ResumenOptionCard**: Used on `/ResumenHub/:Date`. Represents the 6 daily sections.
- **ResumenArticleCard**: Used on Las5 and Opinion lists. Shows Image, Title, Banner badge.
- **ResumenArticleFormatsList**: Styled for Resumen.
- **ResumenPodcastPlayer**: Audio player component.
- **ResumenPhotoGallery**: Photo grid component.
- **ResumenCartoonStrip**: Cartoon viewer component.

### 3.3 E-PAPER MODULE (`src/modules/epaper`)
- **EpaperCard**: Used in `/EPaper/:Date`. Represents Edition number, Cover preview, Date.
- **PdfViewer**: Used in `/EPaper/:Date/:EditionNumber`.
- **EpaperEditionPage**: Combines `HeaderContent` + `PdfViewer` + `AiChatBar`.

---

## 4. SHARED UTILITIES (`src/utils`)
- `formatDate.ts`
- `slugify.ts`
- `buildRoute.ts`
- `scrollLock.ts`

## 5. SHARED TYPES (`src/types`)
- `NoticiasArticle`
- `ResumenArticle`
- `ResumenBanner`
- `ArticleFormat`
- `EPaperEdition`
- `DateString`

## 6. HOOKS (`src/hooks`)
- `useNoticiasArticles`
- `useNoticiasArticle`
- `useResumenLas5Articles`
- `useResumenOpinionArticles`
- `useEpaperList`
- `useEpaperEdition`
- `usePagination`
- `useTheme`
