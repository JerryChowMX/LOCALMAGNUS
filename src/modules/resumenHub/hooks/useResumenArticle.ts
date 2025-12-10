import { useState, useEffect } from 'react';
import { resumenApi } from '../services/resumenApi';
import type { ResumenArticle } from '../../../types/resumen';

export const useResumenArticle = (slug: string | undefined) => {
    const [article, setArticle] = useState<ResumenArticle | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetch = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const { data } = await resumenApi.getArticleById(slug);
                setArticle(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [slug]);

    return { article, loading, error };
};
