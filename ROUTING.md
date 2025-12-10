# Routing System

Routing is centralized in `src/app/routes.ts`.

## Configuration

Define all routes in `src/app/routes.ts`. Use functions for dynamic routes.

```typescript
export const routes = {
  home: "/",
  articleDetail: (slug: string) => `/articles/${slug}`,
  articles: "/articles",
  noticiasHub: (date: string) => `/NoticiasHub/${date}`,
  noticiasArticle: (date: string, slug: string) => `/NoticiasHub/${date}/${slug}`,
  noticiasFormat: (date: string, slug: string, format: string) => `/NoticiasHub/${date}/${slug}/${format}`,
  resumenHub: (date: string) => `/ResumenHub/${date}`,
  resumenLas5: (date: string) => `/ResumenHub/${date}/Las5DelDia`,
  resumenLas5Article: (date: string, slug: string) => `/ResumenHub/${date}/Las5DelDia/${slug}`,
  resumenLas5Format: (date: string, slug: string, format: string) => `/ResumenHub/${date}/Las5DelDia/${slug}/${format}`,
  resumenOpinion: (date: string) => `/ResumenHub/${date}/LaOpinionDelDia`,
  resumenOpinionArticle: (date: string, slug: string) => `/ResumenHub/${date}/LaOpinionDelDia/${slug}`,
  resumenOpinionFormat: (date: string, slug: string, format: string) => `/ResumenHub/${date}/LaOpinionDelDia/${slug}/${format}`,
  resumenPodcast: (date: string) => `/ResumenHub/${date}/ElPodcastDelDia`,
  resumenFotos: (date: string) => `/ResumenHub/${date}/LasFotosDelDia`,
  resumenCartones: (date: string) => `/ResumenHub/${date}/LosCartonesDelDia`,
  resumenJuegos: (date: string) => `/ResumenHub/${date}/LosJuegosDelDia`,
  epaperHub: (date: string) => `/EPaper/${date}`,
  epaperEdition: (date: string, editionNumber: string) => `/EPaper/${date}/${editionNumber}`,
};
```

## Usage

Use the `routes` object when navigating.

```tsx
import { Link } from 'react-router-dom';
import { routes } from '../app/routes';

<Link to={routes.articleDetail('my-slug')}>Read Article</Link>
```
