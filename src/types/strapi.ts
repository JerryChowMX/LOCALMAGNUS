export interface StrapiAttributes {
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    [key: string]: any;
}

export interface StrapiData<T = StrapiAttributes> {
    id: number;
    attributes: T;
}

export interface StrapiCollectionResponse<T = StrapiAttributes> {
    data: StrapiData<T>[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiSingleResponse<T = StrapiAttributes> {
    data: StrapiData<T> | null;
    meta: object;
}

export interface StrapiMediaAttributes {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail?: StrapiMediaFormat;
        small?: StrapiMediaFormat;
        medium?: StrapiMediaFormat;
        large?: StrapiMediaFormat;
    } | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
}

export interface StrapiMediaFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    url: string;
}

export interface StrapiMedia {
    data: StrapiData<StrapiMediaAttributes> | null;
}

export interface StrapiMediaArray {
    data: StrapiData<StrapiMediaAttributes>[] | null;
}

// Article-specific types
export interface StrapiAuthorAttributes {
    name: string;
    slug: string;
    bio?: string;
    profile_picture?: StrapiMedia;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}

export interface StrapiCategoryAttributes {
    name: string;
    slug: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}

export interface StrapiTagAttributes {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}

export interface StrapiArticleAttributes {
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    reading_time: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    hero_image?: StrapiMedia;
    author?: {
        data: StrapiData<StrapiAuthorAttributes> | null;
    };
    category?: {
        data: StrapiData<StrapiCategoryAttributes> | null;
    };
    tags?: {
        data: StrapiData<StrapiTagAttributes>[] | null;
    };
    related_articles?: {
        data: StrapiData<StrapiArticleAttributes>[] | null;
    };
    executive_summary?: {
        summary_text: string;
        bullet_points: any[];
        generated_at?: string;
        tokens_used?: number;
        ai_provider?: string;
        version?: string;
    };
    audio_summary?: {
        episode_label?: string;
        podcast_title?: string;
        audio_file?: StrapiMedia;
        voice?: string;
        generated_at?: string;
        file_size?: number;
    };
    tts_status: 'none' | 'pending' | 'ready' | 'error';
    tts_audio?: StrapiMedia;
    tts_metadata?: StrapiMedia;
    tts_hash?: string;
    tts_last_error?: string;
}

// Flattened/Normalized Article type for frontend use
export interface StrapiArticle {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    reading_time: number;
    isSpecial?: boolean;
    externalUrl?: string;
    hero_image?: {
        url: string;
        alternativeText?: string;
    };
    author?: {
        name: string;
        slug: string;
        profile_picture?: {
            url: string;
        };
    };
    category?: {
        name: string;
        slug: string;
        color: string;
    };
    tags?: Array<{
        name: string;
        slug: string;
    }>;
    blocks?: any[];
    summary?: string;
    audioUrl?: string;
    audio_summary?: {
        episode_label?: string;
        podcast_title?: string;
        audio_file?: {
            url: string;
        };
        voice?: string;
        generated_at?: string;
        file_size?: number;
    };

    relatedArticles?: Array<{
        title: string;
        slug: string;
        hero_image?: {
            url: string;
        };
        category?: {
            name: string;
        }
    }>;
    executive_summary?: {
        summary_text: string;
        bullet_points: any[];
        generated_at?: string;
        tokens_used?: number;
        ai_provider?: string;
        version?: string;
    };
    video_summary?: {
        video_file?: {
            url: string;
        };
        thumbnail?: {
            url: string;
        };
        duration_seconds?: number;
        resolution?: string;
        generated_at?: string;
        file_size?: number;
    };
    ppt_summary?: {
        ppt_file?: {
            url: string;
        };
        slide_count?: number;
        generated_at?: string;
        file_size?: number;
    };
    infographic_summary?: {
        image_file?: {
            url: string;
        };
        generated_at?: string;
        file_size?: number;
    };
    tts_status: 'none' | 'pending' | 'ready' | 'error';
    tts_audio?: {
        url: string;
    };
    tts_metadata?: {
        url: string;
    };
}
