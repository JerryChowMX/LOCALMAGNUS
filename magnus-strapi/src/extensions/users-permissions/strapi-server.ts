/**
 * Extended Auth Controller for users-permissions plugin
 * 
 * Adds:
 * - Progressive login lockout with Redis persistence
 * - Dual bucket lockout (IP+account AND account-only)
 * - Password validation on registration
 */

import { safeGet, safeSet, safeDel, safeIncr, safeExpire } from '../../utils/redis';

// Configuration
const IP_LOCKOUT_ATTEMPTS = 5;
const IP_LOCKOUT_DURATION_S = 900; // 15 minutes
const ACCOUNT_LOCKOUT_ATTEMPTS = 20;
const ACCOUNT_LOCKOUT_DURATION_S = 86400; // 24 hours
const MIN_PASSWORD_LENGTH = 8;

function getClientIp(ctx: any): string {
    return (
        ctx.request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        ctx.request.headers['x-real-ip'] ||
        ctx.request.ip ||
        'unknown'
    );
}

interface LockoutEntry {
    count: number;
    lockUntil: number;
}

async function getLockoutEntry(key: string): Promise<LockoutEntry | null> {
    const data = await safeGet(key);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function recordFailedLogin(
    key: string,
    maxAttempts: number,
    lockoutSeconds: number
): Promise<{ locked: boolean; remainingAttempts: number; lockUntil?: number }> {
    const now = Date.now();
    let entry = await getLockoutEntry(key);

    // Reset if lockout expired
    if (entry && entry.lockUntil > 0 && now > entry.lockUntil) {
        entry = null;
    }

    if (!entry) {
        entry = { count: 0, lockUntil: 0 };
    }

    entry.count++;

    if (entry.count >= maxAttempts) {
        entry.lockUntil = now + lockoutSeconds * 1000;
        await safeSet(key, JSON.stringify(entry), lockoutSeconds);
        return { locked: true, remainingAttempts: 0, lockUntil: entry.lockUntil };
    }

    // TTL slightly longer than lockout to handle edge cases
    await safeSet(key, JSON.stringify(entry), lockoutSeconds + 60);
    return { locked: false, remainingAttempts: maxAttempts - entry.count };
}

async function isLocked(key: string): Promise<{ locked: boolean; lockUntil?: number }> {
    const entry = await getLockoutEntry(key);
    if (!entry) return { locked: false };

    const now = Date.now();
    if (entry.lockUntil > now) {
        return { locked: true, lockUntil: entry.lockUntil };
    }

    return { locked: false };
}

async function clearLockout(key: string): Promise<void> {
    await safeDel(key);
}

function validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        return { valid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` };
    }

    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one letter' };
    }

    return { valid: true };
}

export default (plugin: any) => {
    const originalCallback = plugin.controllers.auth.callback;

    plugin.controllers.auth.callback = async (ctx: any) => {
        const { identifier } = ctx.request.body;
        const ip = getClientIp(ctx);

        // Dual bucket keys
        const ipBucketKey = `lockout:${identifier || 'unknown'}:${ip}`;
        const accountBucketKey = `lockout:account:${identifier || 'unknown'}`;

        // Check BOTH lockout buckets
        const ipLockStatus = await isLocked(ipBucketKey);
        const accountLockStatus = await isLocked(accountBucketKey);

        if (ipLockStatus.locked || accountLockStatus.locked) {
            const lockUntil = Math.max(
                ipLockStatus.lockUntil || 0,
                accountLockStatus.lockUntil || 0
            );
            const retryAfter = Math.ceil((lockUntil - Date.now()) / 1000);
            const scope = accountLockStatus.locked ? 'account' : 'ip';

            ctx.status = 429;
            ctx.body = {
                error: {
                    status: 429,
                    name: 'TooManyRequestsError',
                    message: scope === 'account'
                        ? 'Account temporarily locked due to too many failed login attempts from multiple locations'
                        : 'Too many failed login attempts. Please try again later.',
                    details: {
                        retryAfter: Math.max(retryAfter, 0),
                        scope,
                    },
                },
            };
            return;
        }

        try {
            await originalCallback(ctx);

            // If successful, clear BOTH lockout buckets
            if (ctx.status === 200 && ctx.body?.jwt) {
                await clearLockout(ipBucketKey);
                await clearLockout(accountBucketKey);
            }
        } catch (error) {
            // Record failed attempt in BOTH buckets
            const ipResult = await recordFailedLogin(ipBucketKey, IP_LOCKOUT_ATTEMPTS, IP_LOCKOUT_DURATION_S);
            const accountResult = await recordFailedLogin(accountBucketKey, ACCOUNT_LOCKOUT_ATTEMPTS, ACCOUNT_LOCKOUT_DURATION_S);

            // If either triggered lockout, return 429
            if (ipResult.locked || accountResult.locked) {
                const retryAfter = ipResult.locked ? IP_LOCKOUT_DURATION_S : ACCOUNT_LOCKOUT_DURATION_S;
                const scope = accountResult.locked ? 'account' : 'ip';

                ctx.status = 429;
                ctx.body = {
                    error: {
                        status: 429,
                        name: 'TooManyRequestsError',
                        message: scope === 'account'
                            ? 'Account locked due to too many failed attempts from multiple locations. Try again in 24 hours.'
                            : 'Account locked due to too many failed attempts. Try again in 15 minutes.',
                        details: {
                            retryAfter,
                            scope,
                        },
                    },
                };
                return;
            }

            throw error;
        }
    };

    const originalRegister = plugin.controllers.auth.register;

    plugin.controllers.auth.register = async (ctx: any) => {
        const { password } = ctx.request.body;

        const validation = validatePassword(password);
        if (!validation.valid) {
            ctx.status = 400;
            ctx.body = {
                error: {
                    status: 400,
                    name: 'ValidationError',
                    message: validation.message,
                },
            };
            return;
        }

        return originalRegister(ctx);
    };

    return plugin;
};
