/**
 * Health Check Controller
 * 
 * Provides /healthz endpoint for Railway/load balancers to verify service health.
 * Checks database connectivity and returns appropriate status codes.
 */

export default {
    async check(ctx) {
        const startTime = Date.now();
        const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};

        // Database health check
        try {
            const dbStart = Date.now();
            await strapi.db.query('api::article.article').count();
            checks.database = {
                status: 'healthy',
                latencyMs: Date.now() - dbStart,
            };
        } catch (error: any) {
            checks.database = {
                status: 'unhealthy',
                error: error.message || 'Database connection failed',
            };
        }

        // Determine overall health
        const isHealthy = Object.values(checks).every((c) => c.status === 'healthy');

        ctx.status = isHealthy ? 200 : 503;
        ctx.body = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            instance: process.env.RAILWAY_REPLICA_ID || process.env.HOSTNAME || 'unknown',
            uptime: process.uptime(),
            checks,
            totalLatencyMs: Date.now() - startTime,
        };
    },

    /**
     * Simple liveness probe - always returns 200 if the process is alive
     */
    async liveness(ctx) {
        ctx.body = { status: 'alive', timestamp: new Date().toISOString() };
    },

    /**
     * Readiness probe - returns 200 only if ready to accept traffic
     */
    async readiness(ctx) {
        try {
            // Quick DB check
            await strapi.db.query('api::article.article').count();
            ctx.body = { status: 'ready', timestamp: new Date().toISOString() };
        } catch (error) {
            ctx.status = 503;
            ctx.body = { status: 'not_ready', timestamp: new Date().toISOString() };
        }
    },
};
