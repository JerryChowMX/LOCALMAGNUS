export default ({ env }) => ({
    graphql: {
        enabled: true,
        config: {
            endpoint: '/graphql',
            shadowCRUD: true,
            // Disable playground in production for security
            playgroundAlways: env('NODE_ENV') !== 'production',
            depthLimit: 7,
            amountLimit: 100,
            apolloServer: {
                tracing: false,
                introspection: env('NODE_ENV') !== 'production',
            },
        },
    },
    // Upload provider - Cloudflare R2 for production
    // Falls back to local storage if R2 not configured
    upload: {
        config: {
            provider: env('CLOUDFLARE_ACCOUNT_ID')
                ? '@strapi/provider-upload-cloudflare-r2'
                : 'local',
            providerOptions: env('CLOUDFLARE_ACCOUNT_ID') ? {
                accountId: env('CLOUDFLARE_ACCOUNT_ID'),
                accessKeyId: env('CLOUDFLARE_ACCESS_KEY_ID'),
                secretAccessKey: env('CLOUDFLARE_SECRET_ACCESS_KEY'),
                bucket: env('CLOUDFLARE_R2_BUCKET', 'magnus-media'),
                // Public URL for CDN access (optional but recommended)
                publicUrl: env('CLOUDFLARE_R2_PUBLIC_URL'),
            } : {},
            actionOptions: {
                upload: {},
                delete: {},
            },
        },
    },
});
