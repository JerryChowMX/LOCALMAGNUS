import { useState, useEffect } from 'react';
import { articleApi } from '../services/articleApi';

import type { StrapiArticle } from '../types/strapi';

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
