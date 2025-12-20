/**
 * Rate Limiting Middleware for Strapi
 * 
 * Multi-bucket rate limiting with in-memory store.
 * Limits are applied based on route patterns and user authentication status.
 * 
 * For production scaling, replace the Map store with Redis.
 */

import type { Core } from '@strapi/strapi';

interface RateLimitConfig {
    pattern: RegExp;
    limit: number;
    windowMs: number;
    useUserId?: boolean; // Use userId instead of IP for authenticated routes
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (replace with Redis for horizontal scaling)
const store = new Map<string, RateLimitEntry>();

// Route-specific rate limits
const rateLimits: RateLimitConfig[] = [
    // Auth endpoints - strict limit to prevent brute force
    { pattern: /^\/api\/auth\//i, limit: 5, windowMs: 60 * 1000 },

    // Comments - moderate limit, prefer userId if authenticated
    { pattern: /^\/api\/comments$/i, limit: 10, windowMs: 60 * 1000, useUserId: true },

    // Articles - higher limit for reading
    { pattern: /^\/api\/articles/i, limit: 60, windowMs: 60 * 1000 },

    // AI endpoints - strict per-user limit
    { pattern: /^\/api\/ai\//i, limit: 10, windowMs: 60 * 1000, useUserId: true },

    // TTS endpoints - strict per-user limit
    { pattern: /^\/api\/tts/i, limit: 5, windowMs: 60 * 1000, useUserId: true },

    // Generate TTS (custom controller)
    { pattern: /^\/api\/articles\/.*\/generate-tts/i, limit: 3, windowMs: 60 * 1000, useUserId: true },
];

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

function getClientIp(ctx: any): string {
    return (
        ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        ctx.request.headers['x-real-ip'] ||
        ctx.request.ip ||
        'unknown'
    );
}

function getUserId(ctx: any): string | null {
    return ctx.state?.user?.id?.toString() || null;
}

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
    return async (ctx: any, next: () => Promise<void>) => {
        const path = ctx.request.path;
        const method = ctx.request.method;

        // Find matching rate limit config
        const limitConfig = rateLimits.find(rl => rl.pattern.test(path));

        if (!limitConfig) {
            // No rate limit for this route
            return next();
        }

        // Skip rate limiting for safe methods on read routes (except auth)
        if (method === 'GET' && !path.includes('/auth/')) {
            // Still apply limit for GET on articles to prevent scraping
            if (!path.includes('/articles')) {
                return next();
            }
        }

        // Build the rate limit key
        const ip = getClientIp(ctx);
        const userId = getUserId(ctx);
        const identifier = limitConfig.useUserId && userId ? `user:${userId}` : `ip:${ip}`;
        const key = `${path}:${identifier}`;

        const now = Date.now();
        let entry = store.get(key);

        // Initialize or reset if window expired
        if (!entry || now > entry.resetTime) {
            entry = {
                count: 0,
                resetTime: now + limitConfig.windowMs,
            };
        }

        entry.count++;
        store.set(key, entry);

        // Calculate remaining
        const remaining = Math.max(0, limitConfig.limit - entry.count);
        const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

        // Set standard rate limit headers
        ctx.set('RateLimit-Limit', limitConfig.limit.toString());
        ctx.set('RateLimit-Remaining', remaining.toString());
        ctx.set('RateLimit-Reset', resetSeconds.toString());

        // Check if limit exceeded
        if (entry.count > limitConfig.limit) {
            ctx.status = 429;
            ctx.body = {
                error: {
                    status: 429,
                    name: 'TooManyRequestsError',
                    message: 'Rate limit exceeded. Please try again later.',
                    details: {
                        retryAfter: resetSeconds,
                    },
                },
            };

            // Log the rate limit hit
            strapi.log.warn(`Rate limit exceeded: ${key} (${entry.count}/${limitConfig.limit})`);

            return;
        }

        return next();
    };
};
