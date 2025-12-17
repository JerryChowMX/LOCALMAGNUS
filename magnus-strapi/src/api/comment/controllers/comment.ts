/**
 * comment controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
    async find(ctx) {
        // Use documentService with correct Strapi v5 syntax
        const documents = await strapi.documents('api::comment.comment').findMany({
            filters: ctx.query.filters,
            sort: ctx.query.sort,
            populate: ['author', 'parent', 'article'],
            pagination: ctx.query.pagination
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
