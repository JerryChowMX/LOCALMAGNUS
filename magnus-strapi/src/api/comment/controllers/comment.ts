/**
 * comment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
    async find(ctx) {
        // Parse query params
        const filters = ctx.query.filters as Record<string, any> || {};
        const sort = ctx.query.sort;

        // Use documentService with proper filters and population
        const documents = await strapi.documents('api::comment.comment').findMany({
            filters: filters,
            sort: sort || ['createdAt:asc'],
            populate: {
                author: {
                    fields: ['id', 'username', 'email', 'description']
                },
                parent: {
                    fields: ['id', 'documentId', 'content']
                },
                article: {
                    fields: ['id', 'documentId']
                }
            },
            status: 'published'
        });

        return {
            data: documents,
            meta: {
                pagination: {
                    page: 1,
                    pageSize: 25,
                    pageCount: 1,
                    total: documents.length
                }
            }
        };
    }
}));
