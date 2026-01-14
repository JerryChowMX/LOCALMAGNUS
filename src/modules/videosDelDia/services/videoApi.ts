/**
 * Video API service for Videos del Día
 */

import type { VideoPost, VideoPostRaw } from '../types/video.types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';
const STRAPI_ORIGIN = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';



/**
 * Normalize raw Strapi video post to clean VideoPost
 */
const normalizeVideoPost = (raw: VideoPostRaw): VideoPost => {
    const videoUrl = raw.video?.url
        ? (raw.video.url.startsWith('http') ? raw.video.url : `${STRAPI_ORIGIN}${raw.video.url}`)
        : '';

    const posterUrl = raw.poster?.url
        ? (raw.poster.url.startsWith('http') ? raw.poster.url : `${STRAPI_ORIGIN}${raw.poster.url}`)
        : undefined;

    // Get URL from related article if available, otherwise fallback (or undefined)
    const relatedSlug = raw.related_article?.slug;
    const relatedDate = raw.related_article?.article_date || raw.publishedAt?.split('T')[0];

    const originalArticleUrl = relatedSlug && relatedDate
        ? `/Notas/${relatedDate}/${relatedSlug}`
        : undefined;

    return {
        id: raw.id,
        documentId: raw.documentId,
        title: raw.title,
        slug: raw.slug,
        dek: raw.dek,
        videoUrl,
        posterUrl,
        priority: raw.priority || 0,
        durationSeconds: raw.duration_seconds,
        publishedAt: raw.publishedAt,
        video_date: raw.video_date,
        likeCount: raw.like_count || 0,
        originalArticleUrl,
    };
};

/**
 * Fetch video posts for a specific date
 */
export const getVideosByDate = async (
    date: string,
    page: number = 1,
    pageSize: number = 10
): Promise<{ videos: VideoPost[]; hasMore: boolean; total: number }> => {
    // Use exact match on video_date (edition date) instead of publishedAt range
    const params = new URLSearchParams({
        'filters[video_date][$eq]': date,
        'sort[0]': 'priority:desc',
        'sort[1]': 'publishedAt:desc',
        'sort[2]': 'id:desc',
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
    });
    // Strapi 5: populate as array indices
    params.append('populate[0]', 'video');
    params.append('populate[1]', 'poster');
    params.append('populate[2]', 'related_article');

    const url = `${STRAPI_URL}/video-posts?${params}`;
    console.log('[VideoAPI] Fetching:', url);
    
    const response = await fetch(url);
    console.log('[VideoAPI] Response status:', response.status);

    if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
    }

    const json = await response.json();
    console.log('[VideoAPI] Response data:', json);
    const videos = (json.data || []).map(normalizeVideoPost);
    console.log('[VideoAPI] Normalized videos:', videos);
    const pagination = json.meta?.pagination || {};

    return {
        videos,
        hasMore: pagination.page < pagination.pageCount,
        total: pagination.total || 0,
    };
};

/**
 * Like a video post
 */
export const likeVideo = async (documentId: string): Promise<{ likeCount: number }> => {
    const response = await fetch(`${STRAPI_URL}/video-posts/${documentId}/like`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Failed to like video: ${response.status}`);
    }

    return response.json();
};

/**
 * Unlike a video post
 */
export const unlikeVideo = async (documentId: string): Promise<{ likeCount: number }> => {
    const response = await fetch(`${STRAPI_URL}/video-posts/${documentId}/unlike`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Failed to unlike video: ${response.status}`);
    }

    return response.json();
};

export const videoApi = {
    getVideosByDate,
    likeVideo,
    unlikeVideo,
};
