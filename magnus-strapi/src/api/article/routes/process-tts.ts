export default {
    routes: [
        {
            method: 'POST',
            path: '/articles/process-tts',
            handler: 'api::article.article.processTts',
            config: {
                auth: false, // Internal webhook uses custom secret header for auth
            },
        },
    ],
};
