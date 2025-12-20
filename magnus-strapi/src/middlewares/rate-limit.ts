/**
 * Rate Limiting Middleware for Strapi
 * 
 * Multi-bucket rate limiting with Redis persistence.
 * Includes both per-minute rate limits AND daily quotas for expensive endpoints.
 * Uses fail-open pattern: if Redis unavailable, allows requests.
 */

import type { Core } from '@strapi/strapi';
import { safeGet, safeSet, safeIncr, safeExpire, isRedisConnected } from '../utils/redis';

interface RateLimitConfig {
    pattern: RegExp;
    limit: number;
    windowMs: number;
    useUserId?: boolean;
    dailyQuota?: number;
    globalDailyLimit?: number;
}

// Route-specific rate limits with optional daily quotas
const rateLimits: RateLimitConfig[] = [
    // Auth endpoints - strict limit to prevent brute force
    { pattern: /^\/api\/auth\//i, limit: 5, windowMs: 60 * 1000 },

    // Registration - very strict to prevent account farming
    { pattern: /^\/api\/auth\/local\/register$/i, limit: 3, windowMs: 3600 * 1000 }, // 3/hour

    // Comments - moderate limit
    { pattern: /^\/api\/comments$/i, limit: 10, windowMs: 60 * 1000, useUserId: true },

    // Articles - higher limit for reading
    { pattern: /^\/api\/articles/i, limit: 60, windowMs: 60 * 1000 },

    // AI endpoints - strict per-user limit + daily quota + global limit
    { pattern: /^\/api\/ai\//i, limit: 10, windowMs: 60 * 1000, useUserId: true, dailyQuota: 50, globalDailyLimit: 10000 },

    // TTS endpoints - strict per-user limit + daily quota + global limit
    { pattern: /^\/api\/tts/i, limit: 5, windowMs: 60 * 1000, useUserId: true, dailyQuota: 30, globalDailyLimit: 5000 },

    // Generate TTS (custom controller) - strict daily quota
    { pattern: /^\/api\/articles\/.*\/generate-tts/i, limit: 3, windowMs: 60 * 1000, useUserId: true, dailyQuota: 10, globalDailyLimit: 1000 },
];

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

function getSecondsUntilMidnightUTC(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
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

        const ip = getClientIp(ctx);
        const userId = getUserId(ctx);
        const today = getTodayString();

        // --- GLOBAL DAILY LIMIT CHECK (for expensive endpoints) ---
        if (limitConfig.globalDailyLimit) {
            const routeType = path.split('/')[2] || 'unknown';
            const globalKey = `global:${routeType}:${today}`;

            const globalCount = await safeIncr(globalKey);
            if (globalCount === 1) {
                await safeExpire(globalKey, getSecondsUntilMidnightUTC());
            }

            ctx.set('X-GlobalBudget-Remaining', Math.max(0, limitConfig.globalDailyLimit - globalCount).toString());

            if (globalCount > limitConfig.globalDailyLimit) {
                ctx.status = 503;
                ctx.body = {
                    error: {
                        status: 503,
                        name: 'ServiceUnavailableError',
                        message: 'Service temporarily unavailable. Daily system limit reached.',
                    },
                };
                strapi.log.warn(`Global limit exceeded: ${globalKey} (${globalCount}/${limitConfig.globalDailyLimit})`);
                return;
            }
        }

        // --- PER-USER DAILY QUOTA CHECK (for expensive endpoints) ---
        if (limitConfig.dailyQuota) {
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

            const routeType = path.split('/')[2] || 'unknown';
            const quotaKey = `quota:${routeType}:user:${userId}:${today}`;

            const quotaCount = await safeIncr(quotaKey);
            if (quotaCount === 1) {
                await safeExpire(quotaKey, getSecondsUntilMidnightUTC());
            }

            const remaining = Math.max(0, limitConfig.dailyQuota - quotaCount);
            ctx.set('X-DailyQuota-Limit', limitConfig.dailyQuota.toString());
            ctx.set('X-DailyQuota-Remaining', remaining.toString());
            ctx.set('X-DailyQuota-Reset', 'midnight-utc');

            if (quotaCount > limitConfig.dailyQuota) {
                ctx.status = 429;
                ctx.body = {
                    error: {
                        status: 429,
                        name: 'DailyQuotaExceededError',
                        message: `Daily quota of ${limitConfig.dailyQuota} requests exceeded. Resets at midnight UTC.`,
                        details: {
                            limit: limitConfig.dailyQuota,
                            used: quotaCount,
                        },
                    },
                };
                strapi.log.warn(`Daily quota exceeded: ${quotaKey} (${quotaCount}/${limitConfig.dailyQuota})`);
                return;
            }
        }

        // --- PER-MINUTE RATE LIMIT CHECK ---
        const identifier = limitConfig.useUserId && userId ? `user:${userId}` : `ip:${ip}`;
        const windowSeconds = Math.ceil(limitConfig.windowMs / 1000);
        const rateLimitKey = `ratelimit:${path}:${identifier}`;

        // Get current count
        const currentData = await safeGet(rateLimitKey);
        let count = 1;
        let resetTime = Date.now() + limitConfig.windowMs;

        if (currentData) {
            try {
                const parsed = JSON.parse(currentData);
                if (parsed.resetTime > Date.now()) {
                    count = parsed.count + 1;
                    resetTime = parsed.resetTime;
                }
            } catch {
                // Invalid data, start fresh
            }
        }

        // Save updated count
        const ttl = Math.ceil((resetTime - Date.now()) / 1000);
        await safeSet(rateLimitKey, JSON.stringify({ count, resetTime }), Math.max(ttl, 1));

        const remaining = Math.max(0, limitConfig.limit - count);
        const resetSeconds = Math.ceil((resetTime - Date.now()) / 1000);

        ctx.set('RateLimit-Limit', limitConfig.limit.toString());
        ctx.set('RateLimit-Remaining', remaining.toString());
        ctx.set('RateLimit-Reset', resetSeconds.toString());

        if (count > limitConfig.limit) {
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
            strapi.log.warn(`Rate limit exceeded: ${rateLimitKey} (${count}/${limitConfig.limit})`);
            return;
        }

        return next();
    };
};
