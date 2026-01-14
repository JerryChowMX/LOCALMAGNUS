export default {
    routes: [
        {
            method: 'POST',
            path: '/search/articles',
            handler: 'search.searchArticles',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/search/videos',
            handler: 'search.searchVideos',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/search/podcasts',
            handler: 'search.searchPodcasts',
            config: {
                auth: false,
            },
        },
    ],
};
