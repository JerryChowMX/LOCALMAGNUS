/**
 * Comment lifecycle hooks
 * 
 * Server-side validation and sanitization for comments.
 * Prevents XSS, enforces length limits, and ensures data integrity.
 */

// Simple HTML entity encoder (no external deps)
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

// Strip any HTML tags completely
function stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '');
}

// Validation constants
const MAX_COMMENT_LENGTH = 2000;
const MIN_COMMENT_LENGTH = 1;

// Validate and sanitize comment content
function sanitizeContent(content: any): string {
    if (!content || typeof content !== 'string') {
        throw new Error('Comment content is required');
    }

    // Strip HTML and trim
    let sanitized = stripHtml(content).trim();

    // Escape any remaining special chars for safety
    sanitized = escapeHtml(sanitized);

    // Validate length
    if (sanitized.length < MIN_COMMENT_LENGTH) {
        throw new Error('Comment cannot be empty');
    }

    if (sanitized.length > MAX_COMMENT_LENGTH) {
        throw new Error(`Comment exceeds maximum length of ${MAX_COMMENT_LENGTH} characters`);
    }

    return sanitized;
}

export default {
    beforeCreate(event) {
        const { params } = event;
        const ctx = strapi.requestContext.get();

        // Require authentication
        if (!ctx?.state?.user) {
            throw new Error('Authentication required to post comments');
        }

        // Set the author to the logged-in user
        params.data.author = ctx.state.user.id;

        // Sanitize content
        params.data.content = sanitizeContent(params.data.content);
    },

    beforeUpdate(event) {
        const { params } = event;

        // Only validate if content is being updated
        if (params.data.content !== undefined) {
            params.data.content = sanitizeContent(params.data.content);
        }
    },
};
