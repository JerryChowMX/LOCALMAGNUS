/**
 * Health Check Routes
 * 
 * Public endpoints for infrastructure health monitoring.
 * No authentication required.
 */

export default {
    routes: [
        {
            method: 'GET',
            path: '/healthz',
            handler: 'health.check',
            config: {
                auth: false,
                policies: [],
                description: 'Full health check with database connectivity',
            },
        },
        {
            method: 'GET',
            path: '/livez',
            handler: 'health.liveness',
            config: {
                auth: false,
                policies: [],
                description: 'Liveness probe - is the process alive?',
            },
        },
        {
            method: 'GET',
            path: '/readyz',
            handler: 'health.readiness',
            config: {
                auth: false,
                policies: [],
                description: 'Readiness probe - ready to accept traffic?',
            },
        },
    ],
};
