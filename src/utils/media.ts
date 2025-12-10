/**
 * Helper to get the full URL of a Strapi media asset.
 * Handles both relative paths (from Strapi) and absolute URLs (external).
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
    if (url == null) {
        return null;
    }

    // Return absolute URLs as is
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Prepend Strapi URL to relative paths
    let strapiUrl = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    // If strapiUrl ends with /api, remove it as media is served from root
    if (strapiUrl.endsWith('/api')) {
        strapiUrl = strapiUrl.slice(0, -4);
    }

    return `${strapiUrl}${url}`;
}
