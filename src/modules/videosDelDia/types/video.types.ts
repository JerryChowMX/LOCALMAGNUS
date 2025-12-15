/**
 * Video Post types for Videos del Día feed
 */

export interface VideoPost {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    dek?: string;
    videoUrl: string;
    posterUrl?: string;
    priority: number;
    durationSeconds?: number;
    publishedAt: string;
    video_date?: string;
    likeCount: number;
    originalArticleUrl?: string; // Derived from related article slug
}

export interface VideoPostRaw {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    dek?: string;
    video?: {
        url: string;
        formats?: Record<string, { url: string }>;
    };
    poster?: {
        url: string;
        formats?: Record<string, { url: string }>;
    };
    priority: number;
    duration_seconds?: number;
    publishedAt: string;
    video_date?: string;
    like_count?: number;
    related_article?: {
        slug: string;
        [key: string]: any;
    } | null;
}

export interface VideoFeedState {
    videos: VideoPost[];
    isLoading: boolean;
    hasMore: boolean;
    currentPage: number;
    error: string | null;
}
