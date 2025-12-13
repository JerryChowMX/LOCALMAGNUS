import { strapiClient } from '../../../api/strapiClient';

export interface EpaperEdition {
    id: number;
    documentId: string;
    edition_date: string;
    title: string;
    cover_image?: {
        url: string;
        formats?: {
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
    pdf_file?: {
        url: string;
        name: string;
    };
    page_count?: number;
    description?: string;
}

interface StrapiEpaperResponse {
    data: Array<{
        id: number;
        documentId: string;
        edition_date: string;
        title: string;
        cover_image?: any;
        pdf_file?: any;
        page_count?: number;
        description?: string;
    }>;
}

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';
const STRAPI_API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';

// Public fetch for EPaper (no auth token needed)
const publicFetch = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${STRAPI_API_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
};

const mapEpaperEdition = (item: any): EpaperEdition => {
    return {
        id: item.id,
        documentId: item.documentId,
        edition_date: item.edition_date,
        title: item.title || 'Edición del día',
        cover_image: item.cover_image ? {
            url: item.cover_image.url?.startsWith('http')
                ? item.cover_image.url
                : `${STRAPI_URL}${item.cover_image.url}`,
            formats: item.cover_image.formats
        } : undefined,
        pdf_file: item.pdf_file ? {
            url: item.pdf_file.url?.startsWith('http')
                ? item.pdf_file.url
                : `${STRAPI_URL}${item.pdf_file.url}`,
            name: item.pdf_file.name
        } : undefined,
        page_count: item.page_count,
        description: item.description
    };
};

export const epaperApi = {
    /**
     * Get EPaper edition by date
     */
    getByDate: async (date: string): Promise<EpaperEdition | null> => {
        try {
            console.log('[epaperApi] Fetching EPaper for date:', date);
            const url = `/epapers?filters[edition_date][$eq]=${date}&populate=*&status=published`;
            console.log('[epaperApi] API URL:', url);

            // Use public fetch (no auth token) for EPaper content
            const response = await publicFetch<StrapiEpaperResponse>(url);
            console.log('[epaperApi] Response:', response);

            if (response.data && response.data.length > 0) {
                const edition = mapEpaperEdition(response.data[0]);
                console.log('[epaperApi] Mapped edition:', edition);
                return edition;
            }
            console.log('[epaperApi] No edition found for date:', date);
            return null;
        } catch (error) {
            console.error('[epaperApi] Error fetching by date:', error);
            return null;
        }
    },

    /**
     * Get all EPaper editions
     */
    getAll: async (): Promise<EpaperEdition[]> => {
        try {
            const response = await strapiClient.get<StrapiEpaperResponse>(
                `/epapers?populate=*&sort=edition_date:desc`
            );

            return response.data?.map(mapEpaperEdition) || [];
        } catch (error) {
            console.error('[epaperApi] Error fetching all:', error);
            return [];
        }
    }
};
