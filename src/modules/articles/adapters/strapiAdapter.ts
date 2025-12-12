import type { Article } from '../types';

/**
 * Adapts a raw Strapi response object into a strictly typed Article object.
 * Handles flattening of nested Media and Relation fields common in Strapi v4.
 */
export const adaptStrapiArticleToClient = (data: any): Article => {
    if (!data || !data.attributes) {
        console.warn("adaptStrapiArticleToClient: Received invalid data", data);
        // Return a dummy object or throw, depending on error handling strategy.
        // For now, we return a minimal valid structure to prevent crashes.
        return {
            id: 0,
            attributes: {
                title: "Error loading article",
                summary: "",
                content: [],
                image: { url: "" },
                publishedAt: "",
                updatedAt: "",
            }
        };
    }

    const { id, attributes } = data;

    return {
        id: id,
        attributes: {
            ...attributes,

            // Flatten Image (Media Field)
            image: attributes.image?.data?.attributes ? {
                url: attributes.image.data.attributes.url,
                caption: attributes.image.data.attributes.caption,
                alternativeText: attributes.image.data.attributes.alternativeText,
            } : (attributes.image?.url ? attributes.image : { url: "" || "/placeholder.jpg" }),
            // Fallback for when 'image' is already flat (e.g. from Mock) or missing.

            // Flatten Author (Relation)
            author: attributes.author?.data?.attributes ? {
                name: attributes.author.data.attributes.name,
                avatar: attributes.author.data.attributes.avatar?.data?.attributes?.url,
                role: attributes.author.data.attributes.role,
            } : (attributes.author?.name ? attributes.author : undefined),

            // Dynamic Zones usually come as array, pass through.
            content: Array.isArray(attributes.content) ? attributes.content : [],
        }
    };
};
