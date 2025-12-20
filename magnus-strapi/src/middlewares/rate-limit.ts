/**
 * Rate Limiting Middleware for Strapi
 * 
 * Multi-bucket rate limiting with in-memory store.
 * Includes both per-minute rate limits AND daily quotas for expensive endpoints.
 * 
 * For production scaling, replace the Map store with Redis.
 */

import type { Core } from '@strapi/strapi';

interface RateLimitConfig {
    pattern: RegExp;
    limit: number;
    windowMs: number;
    useUserId?: boolean;
    dailyQuota?: number; // For expensive endpoints
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

interface DailyQuotaEntry {
    count: number;
    resetDate: string; // YYYY-MM-DD
}

// In-memory stores (replace with Redis for horizontal scaling)
const rateLimitStore = new Map<string, RateLimitEntry>();
const dailyQuotaStore = new Map<string, DailyQuotaEntry>();

// Route-specific rate limits with optional daily quotas
const rateLimits: RateLimitConfig[] = [
    // Auth endpoints - strict limit to prevent brute force
    { pattern: /^\/api\/auth\//i, limit: 5, windowMs: 60 * 1000 },

    // Comments - moderate limit, prefer userId if authenticated
    { pattern: /^\/api\/comments$/i, limit: 10, windowMs: 60 * 1000, useUserId: true },

    // Articles - higher limit for reading
    { pattern: /^\/api\/articles/i, limit: 60, windowMs: 60 * 1000 },

    // AI endpoints - strict per-user limit + daily quota
    { pattern: /^\/api\/ai\//i, limit: 10, windowMs: 60 * 1000, useUserId: true, dailyQuota: 50 },

    // TTS endpoints - strict per-user limit + daily quota
    { pattern: /^\/api\/tts/i, limit: 5, windowMs: 60 * 1000, useUserId: true, dailyQuota: 30 },

    // Generate TTS (custom controller) - strict daily quota
    { pattern: /^\/api\/articles\/.*\/generate-tts/i, limit: 3, windowMs: 60 * 1000, useUserId: true, dailyQuota: 10 },
];

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
    // Clean up daily quotas older than today
    const today = new Date().toISOString().split('T')[0];
    for (const [key, entry] of dailyQuotaStore.entries()) {
        if (entry.resetDate !== today) {
            dailyQuotaStore.delete(key);
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

function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

function checkDailyQuota(key: string, quota: number): { allowed: boolean; used: number; remaining: number } {
    const today = getTodayString();
    let entry = dailyQuotaStore.get(key);

    // Reset if new day
    if (!entry || entry.resetDate !== today) {
        entry = { count: 0, resetDate: today };
    }

    if (entry.count >= quota) {
        return { allowed: false, used: entry.count, remaining: 0 };
    }

    entry.count++;
    dailyQuotaStore.set(key, entry);

    return { allowed: true, used: entry.count, remaining: quota - entry.count };
}

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
    return async (ctx: any, next: () => Promise<void>) => {
        const path = ctx.request.path;
        const method = ctx.request.method;

        // Find matching rate limit config
        const limitConfig = rateLimits.find(rl => rl.pattern.test(path));

        if (!limitConfig) {
            return next();
        }

        // Skip rate limiting for safe methods on read routes (except auth)
        if (method === 'GET' && !path.includes('/auth/')) {
            if (!path.includes('/articles')) {
                return next();
            }
        }

        // Build the rate limit key
        const ip = getClientIp(ctx);
        const userId = getUserId(ctx);
        const identifier = limitConfig.useUserId && userId ? `user:${userId}` : `ip:${ip}`;

        // Check daily quota first (for expensive endpoints)
        if (limitConfig.dailyQuota) {
            // Require auth for quota-limited endpoints
            if (!userId) {
                ctx.status = 401;
                ctx.body = {
                    error: {
                        status: 401,
                        name: 'UnauthorizedError',
                        message: 'Authentication required for this endpoint',
                    },
                };
                return;
            }

            const quotaKey = `daily:${path.split('/')[2]}:user:${userId}`;
            const quotaResult = checkDailyQuota(quotaKey, limitConfig.dailyQuota);

            // Set daily quota headers
            ctx.set('X-DailyQuota-Limit', limitConfig.dailyQuota.toString());
            ctx.set('X-DailyQuota-Remaining', quotaResult.remaining.toString());
            ctx.set('X-DailyQuota-Reset', 'midnight');

            if (!quotaResult.allowed) {
                ctx.status = 429;
                ctx.body = {
                    error: {
                        status: 429,
                        name: 'DailyQuotaExceededError',
                        message: `Daily quota of ${limitConfig.dailyQuota} requests exceeded. Resets at midnight.`,
                        details: {
                            limit: limitConfig.dailyQuota,
                            used: quotaResult.used,
                        },
                    },
                };

                strapi.log.warn(`Daily quota exceeded: ${quotaKey} (${quotaResult.used}/${limitConfig.dailyQuota})`);
                return;
            }
        }

        // Per-minute rate limiting
        const rateLimitKey = `${path}:${identifier}`;
        const now = Date.now();
        let entry = rateLimitStore.get(rateLimitKey);

        if (!entry || now > entry.resetTime) {
            entry = {
                count: 0,
                resetTime: now + limitConfig.windowMs,
            };
        }

        entry.count++;
        rateLimitStore.set(rateLimitKey, entry);

        const remaining = Math.max(0, limitConfig.limit - entry.count);
        const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

        ctx.set('RateLimit-Limit', limitConfig.limit.toString());
        ctx.set('RateLimit-Remaining', remaining.toString());
        ctx.set('RateLimit-Reset', resetSeconds.toString());

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

            strapi.log.warn(`Rate limit exceeded: ${rateLimitKey} (${entry.count}/${limitConfig.limit})`);
            return;
        }

        return next();
    };
};
