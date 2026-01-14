import { useState, useEffect, useRef } from 'react';
import { searchApi, type PodcastSearchResponse } from '../api/searchApi';
import { searchUtils } from '../utils/searchUtils';

export const usePodcastSearch = (query: string) => {
    const [results, setResults] = useState<PodcastSearchResponse['results']>([]);
    const [meta, setMeta] = useState<PodcastSearchResponse['meta'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // Validation
        const validation = searchUtils.validateQuery(query);

        if (!validation.valid) {
            setResults([]);
            setMeta(null);
            return;
        }

        // Search Block
        const performSearch = async () => {
            // Cancel previous
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            setIsLoading(true);
            setError(null);

            try {
                const response = await searchApi.searchPodcasts({
                    query: query,
                    pagination: { page: 1, limit: 20 }
                }, controller.signal);

                setResults(response.results);
                setMeta(response.meta);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    return;
                }
                console.error('Podcast search hook error:', err);
                setError(err.message || 'Error al buscar podcasts');
                setResults([]);
            } finally {
                if (abortControllerRef.current === controller) {
                    setIsLoading(false);
                }
            }
        };

        performSearch();

        return () => {
            // Cleanup on unmount or deps change
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };

    }, [query]);

    return { results, meta, isLoading, error };
};
