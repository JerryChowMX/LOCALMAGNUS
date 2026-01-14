/**
 * Optimized Feed Routes
 * Public endpoints for high-performance list views
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/feed/articles',
            handler: 'feed.articles',
            config: {
                auth: false,
                policies: [],
                description: 'Get optimized article feed for list views',
            },
        },
        {
            method: 'GET',
            path: '/feed/videos',
            handler: 'feed.videos',
            config: {
                auth: false,
                policies: [],
                description: 'Get optimized video feed',
            },
        },
        {
            method: 'GET',
            path: '/feed/podcasts',
            handler: 'feed.podcasts',
            config: {
                auth: false,
                policies: [],
                description: 'Get optimized podcast feed',
            },
        },
    ],
};
