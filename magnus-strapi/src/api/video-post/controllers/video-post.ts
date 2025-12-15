/**
 * video-post controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::video-post.video-post', ({ strapi }) => ({
    async like(ctx) {
        const { documentId } = ctx.params;

        try {
            // Find the video post by documentId
            const entry = await strapi.documents('api::video-post.video-post').findOne({
                documentId,
            });

            if (!entry) {
                return ctx.notFound('Video post not found');
            }

            // Increment like count
            const updatedEntry = await strapi.documents('api::video-post.video-post').update({
                documentId,
                data: {
                    like_count: (entry.like_count || 0) + 1,
                },
            });

            return { likeCount: updatedEntry.like_count };
        } catch (error) {
            ctx.throw(500, error);
        }
    },

    async unlike(ctx) {
        const { documentId } = ctx.params;

        try {
            // Find the video post by documentId
            const entry = await strapi.documents('api::video-post.video-post').findOne({
                documentId,
            });

            if (!entry) {
                return ctx.notFound('Video post not found');
            }

            // Decrement like count (don't go below 0)
            const updatedEntry = await strapi.documents('api::video-post.video-post').update({
                documentId,
                data: {
                    like_count: Math.max((entry.like_count || 0) - 1, 0),
                },
            });

            return { likeCount: updatedEntry.like_count };
        } catch (error) {
            ctx.throw(500, error);
        }
    },
}));
