import { useQuery } from '@tanstack/react-query';
import { fetchStandardArticles, fetchStandardArticle } from '../api/articlesApi';
// Remove StrapiArticle type import as we are switching to ArticleStandard
// import type { StrapiArticle } from '../types/strapi';

// Keys for query caching
export const articleKeys = {
    all: ['articles'] as const,
    lists: () => [...articleKeys.all, 'list'] as const,
    list: (page: number, pageSize: number, date?: string) =>
        [...articleKeys.lists(), { page, pageSize, date }] as const,
    details: () => [...articleKeys.all, 'detail'] as const,
    detail: (slug: string) => [...articleKeys.details(), slug] as const,
};

/**
 * Hook to fetch paginated articles with caching
 */
export const useArticles = (page = 1, pageSize = 10, date?: string) => {
    return useQuery({
        queryKey: articleKeys.list(page, pageSize, date),
        queryFn: async () => {
            const response = await fetchStandardArticles(page, pageSize, date);
            return response.articles;
        },
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        gcTime: 15 * 60 * 1000,   // Cache kept for 15 minutes
        placeholderData: (previousData) => previousData, // Keep showing old data while fetching new
    });
};

/**
 * Hook to fetch a single article by slug with caching
 */
export const useArticle = (slug: string) => {
    return useQuery({
        queryKey: articleKeys.detail(slug),
        queryFn: async () => {
            if (!slug) return null;
            return await fetchStandardArticle(slug);
        },
        enabled: !!slug, // Only run if slug is present
        staleTime: 10 * 60 * 1000,
    });
};
