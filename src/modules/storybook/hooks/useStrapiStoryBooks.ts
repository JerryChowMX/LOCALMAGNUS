import { useState, useEffect } from 'react';
import type { StoryBookArticle, StoryBookResponse } from '../types';

const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';

export const useStrapiStoryBooks = (date: string) => {
    const [data, setData] = useState<StoryBookArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Build query string
                // filters[StoryDate][$eq]=YYYY-MM-DD
                // populate=*
                const query = new URLSearchParams({
                    'filters[StoryDate][$eq]': date,
                    'populate': '*',
                    'sort[0]': 'publishedAt:desc' // Optional: sort by newest
                });

                const response = await fetch(`${API_URL}/story-books?${query.toString()}`);

                if (!response.ok) {
                    throw new Error(`Error fetching story books: ${response.statusText}`);
                }

                const json: StoryBookResponse = await response.json();
                setData(json.data || []);
            } catch (err) {
                console.error("Failed to fetch story books:", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        if (date) {
            fetchStories();
        }
    }, [date]);

    return { data, isLoading, error };
};
