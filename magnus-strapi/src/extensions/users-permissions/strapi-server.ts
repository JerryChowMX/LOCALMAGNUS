/**
 * Extended Auth Controller for users-permissions plugin
 * 
 * Adds:
 * - Progressive login lockout after failed attempts
 * - Enhanced rate limiting beyond the global middleware
 * - Password validation on registration
 */

import type { Core } from '@strapi/strapi';

// In-memory store for login attempts (use Redis in production)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

// Configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MIN_PASSWORD_LENGTH = 8;

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of loginAttempts.entries()) {
        if (now > entry.lockUntil && entry.count === 0) {
            loginAttempts.delete(key);
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

function recordFailedLogin(identifier: string): { locked: boolean; remainingAttempts: number; lockUntil?: number } {
    const now = Date.now();
    let entry = loginAttempts.get(identifier);

    // Reset if lockout expired
    if (entry && now > entry.lockUntil) {
        entry = { count: 0, lockUntil: 0 };
    }

    if (!entry) {
        entry = { count: 0, lockUntil: 0 };
    }

    entry.count++;

    if (entry.count >= MAX_LOGIN_ATTEMPTS) {
        entry.lockUntil = now + LOCKOUT_DURATION_MS;
        loginAttempts.set(identifier, entry);
        return { locked: true, remainingAttempts: 0, lockUntil: entry.lockUntil };
    }

    loginAttempts.set(identifier, entry);
    return { locked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS - entry.count };
}

function isLocked(identifier: string): { locked: boolean; lockUntil?: number } {
    const entry = loginAttempts.get(identifier);
    if (!entry) return { locked: false };

    const now = Date.now();
    if (entry.lockUntil > now) {
        return { locked: true, lockUntil: entry.lockUntil };
    }

    // Lockout expired, reset
    if (entry.lockUntil > 0 && now > entry.lockUntil) {
        loginAttempts.delete(identifier);
    }

    return { locked: false };
}

function clearFailedLogins(identifier: string): void {
    loginAttempts.delete(identifier);
}

function validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        return { valid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one letter' };
    }

    return { valid: true };
}

export default (plugin: any) => {
    // Store original callback
    const originalCallback = plugin.controllers.auth.callback;

    // Override the callback (login) method
    plugin.controllers.auth.callback = async (ctx: any) => {
        const { identifier } = ctx.request.body;
        const ip = getClientIp(ctx);
        const lockKey = `${identifier || 'unknown'}:${ip}`;

        // Check if account/IP is locked
        const lockStatus = isLocked(lockKey);
        if (lockStatus.locked) {
            const retryAfter = Math.ceil((lockStatus.lockUntil! - Date.now()) / 1000);
            ctx.status = 429;
            ctx.body = {
                error: {
                    status: 429,
                    name: 'TooManyRequestsError',
                    message: 'Account temporarily locked due to too many failed login attempts',
                    details: {
                        retryAfter,
                    },
                },
            };
            return;
        }

        try {
            // Call original login method
            await originalCallback(ctx);

            // If successful (no error thrown and status is 200), clear failed attempts
            if (ctx.status === 200 && ctx.body?.jwt) {
                clearFailedLogins(lockKey);
            }
        } catch (error) {
            // Record failed attempt
            const result = recordFailedLogin(lockKey);

            if (result.locked) {
                ctx.status = 429;
                ctx.body = {
                    error: {
                        status: 429,
                        name: 'TooManyRequestsError',
                        message: 'Account locked due to too many failed login attempts. Try again in 15 minutes.',
                        details: {
                            retryAfter: Math.ceil(LOCKOUT_DURATION_MS / 1000),
                        },
                    },
                };
                return;
            }

            // Re-throw to let Strapi handle the error normally
            throw error;
        }
    };

    // Store original register
    const originalRegister = plugin.controllers.auth.register;

    // Override the register method to add password validation
    plugin.controllers.auth.register = async (ctx: any) => {
        const { password } = ctx.request.body;

        // Validate password strength
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

        // Call original register
        return originalRegister(ctx);
    };

    return plugin;
};
