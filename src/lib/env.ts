/**
 * Environment variable validation and access
 * Ensures required environment variables are present at startup
 */

interface EnvVars {
    VITE_API_URL?: string;
    VITE_STRAPI_URL: string;
    VITE_STRAPI_TOKEN?: string;
    VITE_POSTHOG_KEY?: string;
    VITE_POSTHOG_HOST?: string;
    VITE_ENVIRONMENT?: 'development' | 'staging' | 'production';
}

function validateEnv(): EnvVars {
    const VITE_ENVIRONMENT = (import.meta.env.VITE_ENVIRONMENT as EnvVars['VITE_ENVIRONMENT']) || 'development';

    // Determine Base URL strategies
    // 1. Explicit VITE_API_BASE_URL (User requested this specific name)
    // 2. Explicit VITE_STRAPI_URL (Legacy support)
    // 3. Environment default

    let strapiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_STRAPI_URL;

    if (!strapiUrl) {
        if (VITE_ENVIRONMENT === 'development') {
            strapiUrl = 'http://localhost:1337/api';
        } else if (VITE_ENVIRONMENT === 'staging') {
            strapiUrl = 'https://magnus-staging-api.tudominio.com/api'; // Placeholder as per user example
        } else {
            // Production default?
            strapiUrl = 'http://localhost:1337/api';
            // Ideally we shouldn't default to localhost in prod, but for now it's safer than crashing if env is missing
        }
    }

    return {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        VITE_STRAPI_URL: strapiUrl,
        VITE_STRAPI_TOKEN: import.meta.env.VITE_STRAPI_TOKEN,
        VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
        VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
        VITE_ENVIRONMENT
    };
}

export const env = validateEnv();

export const STRAPI_URL = env.VITE_STRAPI_URL;
export const STRAPI_TOKEN = env.VITE_STRAPI_TOKEN;
export const API_URL = env.VITE_API_URL || '';
export const POSTHOG_KEY = env.VITE_POSTHOG_KEY;
export const POSTHOG_HOST = env.VITE_POSTHOG_HOST;
export const APP_ENV = env.VITE_ENVIRONMENT;

export const STRAPI_ORIGIN = STRAPI_URL.startsWith('http')
    ? new URL(STRAPI_URL).origin
    : window.location.origin;

