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
            id: number | string;
        };
    } | undefined;
    parent: {
        data: {
            id: number;
        } | null;
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
        author: attrs.author,
        article: attrs.article,
        parent: attrs.parent
    };
}

export interface CreateCommentPayload {
    content: string;
    article: number | string;
    parent?: number; // Optional parent comment ID for replies
}

export const commentsApi = {
    // Fetch comments for a specific article (including parent info for nesting)
    getCommentsByArticle: async (articleId: number | string) => {
        // Explicit populate for author (users-permissions) and parent
        const idFilter = typeof articleId === 'string' ? `filters[article][documentId][$eq]=${articleId}` : `filters[article][id][$eq]=${articleId}`;
        const query = `${idFilter}&populate[0]=author&populate[1]=parent&sort=createdAt:asc`;

        const response = await strapiClient.get<{ data: any[] }>(`comments?${query}`);

        console.log('Raw Strapi response:', JSON.stringify(response, null, 2));

        const rawData = response.data || [];
        return { data: rawData.map(normalizeComment) };
    },

    // Create a new comment or reply
    createComment: async (payload: CreateCommentPayload) => {
        const requestData: any = {
            content: payload.content,
            article: payload.article
        };

        // Add parent if this is a reply
        if (payload.parent) {
            requestData.parent = payload.parent;
        }

        const response = await strapiClient.post<{ data: any }>('comments', {
            data: requestData
        });

        const normalized = response.data ? normalizeComment(response.data) : null;
        return { data: normalized };
    }
};
