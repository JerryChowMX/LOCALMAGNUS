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
  // CORS configuration - explicit origin allowlist
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      // Production: replace with actual domains
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        // Add production domains here:
        // 'https://magnus.example.com',
      ],
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
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
