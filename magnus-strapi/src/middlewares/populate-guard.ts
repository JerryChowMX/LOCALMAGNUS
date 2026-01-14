/**
 * Populate Guard Middleware
 * 
 * CRITICAL: Prevents populate=* from being used in production.
 * This query pattern causes N+1 queries and massive payload sizes.
 * 
 * Also limits content_blocks nesting depth to prevent payload explosion.
 */

const MAX_POPULATE_DEPTH = 3;
const BLOCKED_ENDPOINTS = ['/api/articles', '/api/videos', '/api/podcasts', '/api/epapers'];

/**
 * Count the depth of a populate object.
 */
function countPopulateDepth(obj: any, depth = 0): number {
    if (!obj || typeof obj !== 'object') return depth;

    let maxDepth = depth;

    for (const key of Object.keys(obj)) {
        if (key === 'populate') {
            const nestedDepth = countPopulateDepth(obj[key], depth + 1);
            maxDepth = Math.max(maxDepth, nestedDepth);
        } else if (typeof obj[key] === 'object') {
            const nestedDepth = countPopulateDepth(obj[key], depth);
            maxDepth = Math.max(maxDepth, nestedDepth);
        }
    }

    return maxDepth;
}

/**
 * Check if request is to a blocked endpoint.
 */
function isBlockedEndpoint(path: string): boolean {
    return BLOCKED_ENDPOINTS.some(endpoint => path.startsWith(endpoint));
}

export default (_config: any, { strapi }: { strapi: any }) => {
    return async (ctx: any, next: () => Promise<void>) => {
        const isProduction = process.env.NODE_ENV === 'production';
        const path = ctx.request.path;

        // Only enforce on API endpoints in production
        if (!isProduction || !path.startsWith('/api/')) {
            return next();
        }

        // Check for populate=* (the dangerous pattern)
        const populate = ctx.query.populate;

        if (populate === '*') {
            strapi.log.warn(`[PopulateGuard] Blocked populate=* on ${path}`);
            ctx.status = 400;
            ctx.body = {
                error: {
                    status: 400,
                    name: 'ValidationError',
                    message: 'populate=* is not allowed in production. Use explicit field selection.',
                    details: {
                        path,
                        recommendation: 'Use populate[field][fields]=field1,field2 syntax'
                    }
                }
            };
            return;
        }

        // Check populate depth on blocked endpoints
        if (isBlockedEndpoint(path) && typeof populate === 'object') {
            const depth = countPopulateDepth({ populate });

            if (depth > MAX_POPULATE_DEPTH) {
                strapi.log.warn(`[PopulateGuard] Blocked deep populate (depth=${depth}) on ${path}`);
                ctx.status = 400;
                ctx.body = {
                    error: {
                        status: 400,
                        name: 'ValidationError',
                        message: `Populate depth exceeds maximum of ${MAX_POPULATE_DEPTH}`,
                        details: {
                            path,
                            depth,
                            maxAllowed: MAX_POPULATE_DEPTH
                        }
                    }
                };
                return;
            }
        }

        await next();
    };
};
