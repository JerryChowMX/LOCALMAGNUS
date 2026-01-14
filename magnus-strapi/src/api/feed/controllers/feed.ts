/**
 * Optimized Feed Controller
 * Returns minimal article data for list views - NO populate=*
 * 
 * This endpoint is specifically designed for high-concurrency scenarios.
 * It returns only the fields needed for article cards/lists.
 */

export default {
    async articles(ctx) {
        const {
            page = 1,
            pageSize = 10,
            category,
            sort = 'publishedAt:desc'
        } = ctx.query;

        const pageNum = parseInt(page as string, 10);
        const limit = Math.min(parseInt(pageSize as string, 10), 50); // Cap at 50

        const filters: any = {};

        if (category) {
            filters.category = { slug: category };
        }

        try {
            const articles = await strapi.entityService.findMany('api::article.article', {
                filters,
                // Minimal populate - only what cards need
                populate: {
                    hero_image: true,
                    category: true,
                    author: true,
                },
                sort: [sort],
                start: (pageNum - 1) * limit,
                limit,
            } as any);

            // Transform to thin response - only needed fields
            const thinArticles = (articles as any[]).map((article: any) => ({
                id: article.id,
                documentId: article.documentId,
                title: article.title,
                dek: article.dek,
                slug: article.slug,
                publishedAt: article.publishedAt,
                read_time_minutes: article.read_time_minutes,
                layout_type: article.layout_type,
                hero_image: article.hero_image ? {
                    url: article.hero_image.url,
                    alternativeText: article.hero_image.alternativeText,
                } : null,
                category: article.category ? {
                    name: article.category.name,
                    slug: article.category.slug,
                } : null,
                author: article.author ? {
                    name: article.author.name,
                    slug: article.author.slug,
                } : null,
            }));

            const total = await strapi.entityService.count('api::article.article', { filters });

            return {
                data: thinArticles,
                meta: {
                    pagination: {
                        page: pageNum,
                        pageSize: limit,
                        total,
                        pageCount: Math.ceil(total / limit),
                    },
                },
            };
        } catch (error) {
            strapi.log.error('Feed articles error:', error);
            ctx.throw(500, 'Failed to fetch articles feed');
        }
    },

    async videos(ctx) {
        const { page = 1, pageSize = 10 } = ctx.query;
        const pageNum = parseInt(page as string, 10);
        const limit = Math.min(parseInt(pageSize as string, 10), 20);

        try {
            const videos = await strapi.entityService.findMany('api::video.video' as any, {
                populate: {
                    thumbnail: true,
                    video_file: true,
                },
                sort: [{ publishedAt: 'desc' }],
                start: (pageNum - 1) * limit,
                limit,
            } as any);

            const thinVideos = (videos as any[]).map((video: any) => ({
                id: video.id,
                documentId: video.documentId,
                title: video.title,
                description: video.description,
                publishedAt: video.publishedAt,
                thumbnail: video.thumbnail ? { url: video.thumbnail.url } : null,
                video_file: video.video_file ? { url: video.video_file.url } : null,
            }));

            const total = await strapi.entityService.count('api::video.video' as any, {});

            return {
                data: thinVideos,
                meta: {
                    pagination: { page: pageNum, pageSize: limit, total, pageCount: Math.ceil(total / limit) },
                },
            };
        } catch (error) {
            strapi.log.error('Feed videos error:', error);
            ctx.throw(500, 'Failed to fetch videos feed');
        }
    },

    async podcasts(ctx) {
        const { page = 1, pageSize = 10 } = ctx.query;
        const pageNum = parseInt(page as string, 10);
        const limit = Math.min(parseInt(pageSize as string, 10), 20);

        try {
            const podcasts = await strapi.entityService.findMany('api::podcast.podcast' as any, {
                populate: {
                    cover_image: true,
                    audio_file: true,
                },
                sort: [{ publishedAt: 'desc' }],
                start: (pageNum - 1) * limit,
                limit,
            } as any);

            const thinPodcasts = (podcasts as any[]).map((podcast: any) => ({
                id: podcast.id,
                documentId: podcast.documentId,
                title: podcast.title,
                description: podcast.description,
                duration: podcast.duration,
                publishedAt: podcast.publishedAt,
                cover_image: podcast.cover_image ? { url: podcast.cover_image.url } : null,
                audio_file: podcast.audio_file ? { url: podcast.audio_file.url } : null,
            }));

            const total = await strapi.entityService.count('api::podcast.podcast' as any, {});

            return {
                data: thinPodcasts,
                meta: {
                    pagination: { page: pageNum, pageSize: limit, total, pageCount: Math.ceil(total / limit) },
                },
            };
        } catch (error) {
            strapi.log.error('Feed podcasts error:', error);
            ctx.throw(500, 'Failed to fetch podcasts feed');
        }
    },
};
