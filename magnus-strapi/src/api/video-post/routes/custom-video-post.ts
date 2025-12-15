/**
 * Custom routes for video-post
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/video-posts/:documentId/like',
            handler: 'video-post.like',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/video-posts/:documentId/unlike',
            handler: 'video-post.unlike',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
