export default {
    /**
     * Cron job to publish scheduled articles
     * Runs every 5 minutes
     */
    '*/5 * * * *': async ({ strapi }) => {
        try {
            const now = new Date();

            // Find articles that are scheduled and ready to publish
            // We use 'api::article.article'
            const articlesToPublish = await strapi.entityService.findMany('api::article.article', {
                filters: {
                    state: 'scheduled',
                    publishedAt: { $lte: now.toISOString() }
                }
            });

            if (articlesToPublish.length > 0) {
                strapi.log.info(`Found ${articlesToPublish.length} scheduled articles to publish.`);

                for (const article of articlesToPublish) {
                    await strapi.entityService.update('api::article.article', article.id, {
                        data: {
                            state: 'published'
                        }
                    });
                    strapi.log.info(`Published article: ${article.title} (ID: ${article.id})`);
                }
            }
        } catch (err) {
            strapi.log.error('Error in scheduled publishing cron job:', err);
        }
    },
};
