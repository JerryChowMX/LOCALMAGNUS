/**
 * Redis Client for Strapi
 * 
 * Shared Redis connection for rate limiting, quotas, and lockouts.
 * Uses fail-open pattern: if Redis is unavailable, allows requests (degraded mode).
 */

import Redis from 'ioredis';

let redis: Redis | null = null;
let isConnected = false;

/**
 * Initialize Redis connection.
 * Call this on Strapi bootstrap.
 */
export function initRedis(): Redis | null {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.warn('[Redis] REDIS_URL not configured. Using in-memory fallback (NOT for production).');
        return null;
    }

    try {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 3) {
                    console.error('[Redis] Max retries exceeded, giving up');
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 2000); // Exponential backoff
            },
            lazyConnect: true,
        });

        redis.on('connect', () => {
            isConnected = true;
            console.log('[Redis] Connected successfully');
        });

        redis.on('error', (err) => {
            isConnected = false;
            console.error('[Redis] Connection error:', err.message);
        });

        redis.on('close', () => {
            isConnected = false;
            console.warn('[Redis] Connection closed');
        });

        // Attempt connection
        redis.connect().catch((err) => {
            console.error('[Redis] Initial connection failed:', err.message);
        });

        return redis;
    } catch (err) {
        console.error('[Redis] Failed to initialize:', err);
        return null;
    }
}

/**
 * Get Redis client instance.
 */
export function getRedis(): Redis | null {
    return redis;
}

/**
 * Check if Redis is currently connected.
 */
export function isRedisConnected(): boolean {
    return isConnected && redis !== null;
}

/**
 * Safe GET with fail-open.
 * Returns null if Redis unavailable or key doesn't exist.
 */
export async function safeGet(key: string): Promise<string | null> {
    if (!redis) return null;

    try {
        return await redis.get(key);
    } catch (err) {
        console.error(`[Redis] GET failed for ${key}:`, (err as Error).message);
        return null; // Fail open
    }
}

/**
 * Safe SET with TTL and fail-open.
 * Silently fails if Redis unavailable.
 */
export async function safeSet(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (!redis) return false;

    try {
        await redis.set(key, value, 'EX', ttlSeconds);
        return true;
    } catch (err) {
        console.error(`[Redis] SET failed for ${key}:`, (err as Error).message);
        return false; // Fail open
    }
}

/**
 * Safe INCR with fail-open.
 * Returns 0 if Redis unavailable.
 */
export async function safeIncr(key: string): Promise<number> {
    if (!redis) return 0;

    try {
        return await redis.incr(key);
    } catch (err) {
        console.error(`[Redis] INCR failed for ${key}:`, (err as Error).message);
        return 0; // Fail open
    }
}

/**
 * Safe EXPIRE with fail-open.
 */
export async function safeExpire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!redis) return false;

    try {
        await redis.expire(key, ttlSeconds);
        return true;
    } catch (err) {
        console.error(`[Redis] EXPIRE failed for ${key}:`, (err as Error).message);
        return false;
    }
}

/**
 * Safe DEL with fail-open.
 */
export async function safeDel(key: string): Promise<boolean> {
    if (!redis) return false;

    try {
        await redis.del(key);
        return true;
    } catch (err) {
        console.error(`[Redis] DEL failed for ${key}:`, (err as Error).message);
        return false;
    }
}
