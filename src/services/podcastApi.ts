import { strapiClient } from "../api/strapiClient";
import { STRAPI_ORIGIN } from "../lib/env";
import type { Podcast } from "../modules/podcasts/types/podcast";



// Normalizer
const normalizePodcast = (data: any): Podcast => {
    // Strapi v5 check: Attributes might be at root or under 'attributes'
    const attrs = data.attributes || data;
    const id = data.documentId || data.id?.toString() || '0';

    // Handle Media Fields (Deep check for v4/v5 structure)
    const getUrl = (field: any) => {
        if (!field) return undefined;
        let url = undefined;

        // V4: field.data.attributes.url
        if (field.data?.attributes?.url) url = field.data.attributes.url;
        // V5/Flat: field.url or field.data.url or field[0].url if array
        else if (field.url) url = field.url;
        else if (field.data?.url) url = field.data.url;

        if (url && url.startsWith('/')) {
            return `${STRAPI_ORIGIN}${url}`;
        }
        return url;
    };

    return {
        id,
        title: attrs.title || 'Untitled Podcast',
        info: attrs.info || '',
        duration: attrs.duration || 0,
        publishedAt: attrs.publishedAt || new Date().toISOString(),
        author: attrs.author || 'Magnus Audio',
        audioUrl: getUrl(attrs.audio_file) || '',
        coverUrl: getUrl(attrs.cover_art)
    };
};

export const podcastApi = {
    async getDailyPodcasts(date: string): Promise<Podcast[]> {
        // Filter by Date (Same logic as Articles)
        const startDate = `${date}T00:00:00.000-06:00`;
        const endDate = `${date}T23:59:59.999-06:00`;

        const params = new URLSearchParams();
        params.append('filters[publishedAt][$gte]', startDate);
        params.append('filters[publishedAt][$lte]', endDate);
        // Explicit populate - NO populate=*
        params.append('populate[audio_file][fields]', 'url');
        params.append('populate[cover_art][fields]', 'url,alternativeText');
        params.append('sort[0]', 'publishedAt:asc'); // Oldest first (Episode 1 = First Uploaded) // Latest first? Or specific order? Let's say desc for now.

        try {
            const response = await strapiClient.get<any>(`/podcasts?${params.toString()}`);
            const data = response.data || [];

            // Map directly
            return data.map((item: any) => normalizePodcast(item));
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            return [];
        }
    }
};
