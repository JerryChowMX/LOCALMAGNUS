// Preview URL generation based on content type
const getPreviewPathname = (uid: string, { document }: { document: any }): string | null => {
  const { slug, publishedAt } = document;

  switch (uid) {
    case "api::article.article":
      if (!slug) return null;
      // Use published date or current date for MAGNUS routing
      const dateStr = publishedAt
        ? new Date(publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      return `/Notas/${dateStr}/${slug}`;
    default:
      return null;
  }
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Preview feature configuration
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL', 'http://localhost:5173'),
      async handler(uid: string, { documentId, locale, status }: { documentId: string; locale?: string; status?: string }) {
        const document = await strapi.documents(uid as any).findOne({ documentId });
        const pathname = getPreviewPathname(uid, { document });

        if (!pathname) return null;

        // Query parameter approach for Vite/React frontend
        const params = new URLSearchParams({
          preview: 'true',
          status: status || 'draft'
        });

        const clientUrl = env('CLIENT_URL', 'http://localhost:5173');
        return `${clientUrl}${pathname}?${params}`;
      },
    },
  },
});
