/**
 * Middlewares Configuration
 * 
 * CORS is configured to use environment variable for production origins.
 * Set CORS_ORIGINS in your .env for production deployments.
 */

const getCorsOrigins = () => {
  // Default development origins
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175', // Fix: User is running on port 5175
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
  ];

  // Production origins from environment variable
  // Format: comma-separated list, e.g., "https://magnus.vercel.app,https://yourdomain.com"
  const prodOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];

  return [...devOrigins, ...prodOrigins];
};

export default [
  'strapi::logger',
  'strapi::errors',
  // Security headers configuration
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-ancestors': ["'none'"],
          'script-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        },
      },
      frameguard: {
        action: 'deny',
      },
      xssFilter: true,
      noSniff: true,
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    },
  },
  // CORS configuration - uses CORS_ORIGINS env var for production
  {
    name: 'strapi::cors',
    config: {
      origin: getCorsOrigins(),
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  },
  // Custom rate limiting middleware
  {
    name: 'global::rate-limit',
    config: {},
  },
  // Query validation middleware (sort field whitelist)
  {
    name: 'global::query-validator',
    config: {},
  },
  // Populate guard - blocks populate=* and deep nesting in production
  {
    name: 'global::populate-guard',
    config: {},
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
