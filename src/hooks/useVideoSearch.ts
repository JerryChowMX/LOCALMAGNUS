import { useState, useEffect, useRef } from 'react';
import { searchApi, type VideoSearchResponse } from '../api/searchApi';
import { searchUtils } from '../utils/searchUtils';

export const useVideoSearch = (query: string) => {
    const [results, setResults] = useState<VideoSearchResponse['results']>([]);
    const [meta, setMeta] = useState<VideoSearchResponse['meta'] | null>(null);
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
                const response = await searchApi.searchVideos({
                    query: query,
                    pagination: { page: 1, limit: 20 }
                }, controller.signal);

                setResults(response.results);
                setMeta(response.meta);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    return;
                }
                console.error('Video search hook error:', err);
                setError(err.message || 'Error al buscar videos');
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
