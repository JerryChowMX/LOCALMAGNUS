import { strapiClient } from './strapiClient';
import type { User } from '../types/auth';

// Frontend Friendly Interface
export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
        data: {
            id: number;
            attributes: User;
        };
    } | undefined;
    article: {
        data: {
            id: number;
        };
    } | undefined;
}

// Helper to normalize Strapi response
function normalizeComment(data: any): Comment {
    const attrs = data.attributes || data;
    return {
        id: data.id,
        content: attrs.content || '',
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        author: attrs.author, // Keep nested for now as hook uses it, or flatten further if desired
        article: attrs.article
    };
}

export interface CreateCommentPayload {
    content: string;
    article: number;
}

export const commentsApi = {
    // Fetch comments for a specific article
    getCommentsByArticle: async (articleId: number) => {
        // Filter by article ID and populate author details
        const query = `filters[article][id][$eq]=${articleId}&populate=author&sort=createdAt:desc`;

        // Use get for generic request
        const response = await strapiClient.get<{ data: any[] }>(`comments?${query}`);

        const rawData = response.data || [];
        return { data: rawData.map(normalizeComment) };
    },

    // Create a new comment
    createComment: async (payload: CreateCommentPayload) => {
        // Wrap in { data: ... } for Strapi
        const response = await strapiClient.post<{ data: any }>('comments', {
            data: {
                content: payload.content,
                article: payload.article
            }
        });

        // Normalize single response
        const normalized = response.data ? normalizeComment(response.data) : null;
        return { data: normalized };
    }
};
