/**
 * Query Validator Middleware
 * 
 * Validates and restricts query parameters to prevent DoS attacks.
 * - Whitelists allowed sort fields
 * - Can be extended to validate other query params
 */

const ALLOWED_SORT_FIELDS = [
    'createdAt',
    'updatedAt',
    'publishedAt',
    'title',
    'id',
    'name',
    'slug',
];

export default () => {
    return async (ctx: any, next: () => Promise<void>) => {
        // Skip validation for admin and content-manager routes
        const path = ctx.request.path;
        if (path.startsWith('/admin') || path.startsWith('/content-manager')) {
            return next();
        }

        const sort = ctx.query.sort;

        if (sort) {
            const sortFields = Array.isArray(sort) ? sort : [sort];

            for (const field of sortFields) {
                // Extract field name from sort string (e.g., "createdAt:desc" -> "createdAt")
                const fieldName = String(field)
                    .replace(/:(asc|desc)$/i, '')
                    .replace(/\[.*\]/g, '')
                    .trim();

                if (fieldName && !ALLOWED_SORT_FIELDS.includes(fieldName)) {
                    ctx.status = 400;
                    ctx.body = {
                        error: {
                            status: 400,
                            name: 'ValidationError',
                            message: `Sort field '${fieldName}' is not allowed. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}`,
                        },
                    };
                    return;
                }
            }
        }

        return next();
    };
};
