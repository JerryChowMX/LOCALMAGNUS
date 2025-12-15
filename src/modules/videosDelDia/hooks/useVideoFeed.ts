/**
 * Hook for managing video feed state and pagination
 */

import { useState, useEffect, useCallback } from 'react';
import { videoApi } from '../services/videoApi';
import type { VideoPost } from '../types/video.types';

interface UseVideoFeedOptions {
    date: string;
    pageSize?: number;
}

interface UseVideoFeedReturn {
    videos: VideoPost[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    error: string | null;
    loadMore: () => void;
    refresh: () => void;
}

export const useVideoFeed = ({ date, pageSize = 10 }: UseVideoFeedOptions): UseVideoFeedReturn => {
    const [videos, setVideos] = useState<VideoPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Initial load and date change handler
    const loadInitial = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1);

        try {
            const result = await videoApi.getVideosByDate(date, 1, pageSize);
            setVideos(result.videos);
            setHasMore(result.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load videos');
            setVideos([]);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [date, pageSize]);

    // Load more for infinite scroll
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const result = await videoApi.getVideosByDate(date, nextPage, pageSize);

            // Dedupe by id to handle edge cases
            setVideos(prev => {
                const existingIds = new Set(prev.map(v => v.id));
                const newVideos = result.videos.filter(v => !existingIds.has(v.id));
                return [...prev, ...newVideos];
            });

            setCurrentPage(nextPage);
            setHasMore(result.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more videos');
        } finally {
            setIsLoadingMore(false);
        }
    }, [date, currentPage, pageSize, isLoadingMore, hasMore]);

    // Refresh function
    const refresh = useCallback(() => {
        loadInitial();
    }, [loadInitial]);

    // Effect: Load on mount and when date changes
    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return {
        videos,
        isLoading,
        isLoadingMore,
        hasMore,
        error,
        loadMore,
        refresh,
    };
};
