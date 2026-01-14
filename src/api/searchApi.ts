import type { StrapiArticle } from '../types/strapi';
import type { VideoPostRaw } from '../modules/videosDelDia/types/video.types';

// We assume we have a base API client or we use fetch directly. 
// Looking at project structure, there is `src/api` folder.
// Let's check `api` folder content first, but I'll write a standalone client for now or use `axios` if installed.
// `package.json` had `qs`, doesn't explicitly show `axios` in `magnus-strapi` but `src` might use something.
// I'll use `fetch` and the VITE_API_URL or similar environment variable.

const API_URL = import.meta.env.VITE_STRAPI_URL || import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface SearchParams {
    query: string;
    filters?: any;
    pagination?: {
        page: number;
        limit: number;
    };
}

export interface SearchMeta {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    queryTime: number;
}

export interface SearchResponse {
    results: StrapiArticle[];
    meta: SearchMeta;
}

// Raw podcast result from Strapi search
export interface PodcastSearchResult {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    info?: string;
    duration?: number;
    author?: string;
    publishedAt: string;
    audio_file?: {
        url: string;
        formats?: Record<string, { url: string }>;
    };
    cover_art?: {
        url: string;
        formats?: Record<string, { url: string }>;
    };
}

export interface VideoSearchResponse {
    results: VideoPostRaw[];
    meta: SearchMeta;
}

export interface PodcastSearchResponse {
    results: PodcastSearchResult[];
    meta: SearchMeta;
}

export const searchApi = {
    async searchArticles(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse> {
        const response = await fetch(`${API_URL}/search/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || 'Error en la búsqueda');
        }

        return response.json();
    },

    async searchVideos(params: SearchParams, signal?: AbortSignal): Promise<VideoSearchResponse> {
        const response = await fetch(`${API_URL}/search/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || 'Error en la búsqueda de videos');
        }

        return response.json();
    },

    async searchPodcasts(params: SearchParams, signal?: AbortSignal): Promise<PodcastSearchResponse> {
        const response = await fetch(`${API_URL}/search/podcasts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || 'Error en la búsqueda de podcasts');
        }

        return response.json();
    }
};
