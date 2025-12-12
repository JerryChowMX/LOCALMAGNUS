import { useState, useEffect } from 'react';
import { articleApi } from '../services/articleApi';

export interface StrapiArticle {
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    reading_time: number;
    hero_image?: {
        url: string;
        alternativeText?: string;
    };
    author?: {
        name: string;
        slug: string;
        profile_picture?: {
            url: string;
        };
    };
    category?: {
        name: string;
        slug: string;
        color: string;
    };
    tags?: Array<{
        name: string;
        slug: string;
    }>;
    blocks?: any[];
    summary?: string;
    audioUrl?: string;
    executive_summary?: {
        summary_text: string;
        bullet_points: any[];
        generated_at?: string;
        tokens_used?: number;
        ai_provider?: string;
        version?: string;
    };
    audio_summary?: {
        audio_file?: {
            url: string;
        };
        duration_seconds?: number;
        voice?: string;
        transcript?: string;
        generated_at?: string;
        file_size?: number;
    };
    video_summary?: {
        video_file?: {
            url: string;
        };
        thumbnail?: {
            url: string;
        };
        duration_seconds?: number;
        resolution?: string;
        generated_at?: string;
        file_size?: number;
    };
    ppt_summary?: {
        ppt_file?: {
            url: string;
        };
        slide_count?: number;
        generated_at?: string;
        file_size?: number;
    };
    infographic_summary?: {
        image_file?: {
            url: string;
        };
        generated_at?: string;
        file_size?: number;
    };

}

export const useStrapiArticles = (page = 1, pageSize = 10, date?: string) => {
    const [data, setData] = useState<StrapiArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await articleApi.getArticles(page, pageSize, date);
                setData(response.articles || []);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load articles from Strapi'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [page, pageSize, date]);

    return { data, isLoading, error };
};

export const useStrapiArticle = (slug: string, options?: { status?: 'draft' | 'published' }) => {
    const [data, setData] = useState<StrapiArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const article = await articleApi.getArticleBySlug(slug, options);
                setData(article);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load article from Strapi'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [slug, options?.status]);

    return { article: data, isLoading, error };
};
