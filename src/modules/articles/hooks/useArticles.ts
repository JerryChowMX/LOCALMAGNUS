import { useState, useEffect } from 'react';
import { fetchArticles } from '../api/articlesApi';
import type { Article, Meta } from '../api/articlesApi';

export const useArticles = (page: number = 1, pageSize: number = 10) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadArticles = async () => {
            setLoading(true);
            try {
                const response = await fetchArticles(page, pageSize);
                setArticles(response.data);
                setMeta(response.meta);
                setError(null);
            } catch (err) {
                setError('Failed to load articles');
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, [page, pageSize]);

    return { articles, meta, loading, error };
};
