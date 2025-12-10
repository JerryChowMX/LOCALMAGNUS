import { useState, useEffect, type DependencyList } from 'react';

export interface ApiDataResult<T> {
    data: T;
    isFallback: boolean;
}

export interface UseApiDataReturn<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    isFallback: boolean;
}

/**
 * Generic hook for fetching data from API with loading, error, and fallback states
 * @param fetcher - Async function that returns data and isFallback flag
 * @param deps - Dependency array for useEffect
 * @returns Object with data, isLoading, error, and isFallback states
 */
export function useApiData<T>(
    fetcher: () => Promise<ApiDataResult<T>>,
    deps: DependencyList = []
): UseApiDataReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetch = async () => {
            setIsLoading(true);
            try {
                const result = await fetcher();
                if (!cancelled) {
                    setData(result.data);
                    setIsFallback(result.isFallback);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch'));
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetch();

        return () => {
            cancelled = true;
        };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, isLoading, error, isFallback };
}
