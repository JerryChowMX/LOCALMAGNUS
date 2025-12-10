/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
    async incrementView(ctx) {
        const { id } = ctx.params;

        const article = await strapi.entityService.findOne('api::article.article', id, {
            fields: ['view_count']
        });

        if (!article) {
            return ctx.notFound('Article not found');
        }

        const updated = await strapi.entityService.update('api::article.article', id, {
            data: {
                view_count: (article.view_count || 0) + 1
            }
        });

        return { view_count: updated.view_count };
    }
}));
