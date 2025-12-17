/**
 * Custom routes for aichat - ping and stream endpoints
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/aichats/ping',
            handler: 'aichat.ping',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/aichats/stream',
            handler: 'aichat.chat',
            config: {
                auth: false,
            },
        },
    ],
};
