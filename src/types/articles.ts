export interface ArticleStandard {
    id: number | string;
    layoutType: "standard-one";
    isSpecial: boolean;

    title: string;
    dek?: string | null;
    slug: string;

    coverImage?: {
        url: string;
        alt?: string | null;
        caption?: string | null;
    };
    heroImageCaption?: string | null;

    category: {
        id: number | string;
        name: string;
        slug: string;
    };

    tags: {
        id: number | string;
        name: string;
        slug: string;
    }[];

    publishedAt: string;
    readTimeMinutes: number;
    audioUrl?: string | null;

    author: {
        id: number | string;
        name: string;
        slug: string;
        avatarUrl?: string | null;
        role?: string;
    };

    // Summaries & TTS
    audio_summary?: {
        episode_label?: string;
        podcast_title?: string;
        audio_file?: { url: string };
    };
    video_summary?: {
        video_file?: { url: string };
        thumbnail?: { url: string };
        duration_seconds?: number;
    };
    ppt_summary?: {
        ppt_file?: { url: string };
        slide_count?: number;
    };
    infographic_summary?: {
        image_file?: { url: string };
    };

    tts_status?: string;
    tts_audio?: { url: string };
    tts_metadata?: { url: string };

    contentBlocks: Array<any>; // Using any for now as dynamic zones can be complex, will refine if needed

    relatedArticles?: Array<{
        title: string;
        category: string;
        image: string;
        slug: string;
    }>;
}
