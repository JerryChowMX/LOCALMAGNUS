/**
 * Video API service for Videos del Día
 */

import type { VideoPost, VideoPostRaw } from '../types/video.types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';
const STRAPI_ORIGIN = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';

/**
 * Get timezone-aware day boundaries for Monterrey (UTC-6)
 */
const getMonterreyDayBoundaries = (dateString: string): { start: string; end: string } => {
    // dateString format: YYYY-MM-DD
    // Monterrey is UTC-6, so midnight local = 06:00 UTC
    const start = `${dateString}T06:00:00.000Z`;

    // Calculate next day
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const nextDay = date.toISOString().split('T')[0];
    const end = `${nextDay}T06:00:00.000Z`;

    return { start, end };
};

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
    const { start, end } = getMonterreyDayBoundaries(date);

    const params = new URLSearchParams({
        'filters[publishedAt][$gte]': start,
        'filters[publishedAt][$lt]': end,
        'sort[0]': 'priority:desc',
        'sort[1]': 'publishedAt:desc',
        'sort[2]': 'id:desc',
        'populate[video]': '*',
        'populate[poster]': '*',
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
    });

    const response = await fetch(`${STRAPI_URL}/video-posts?${params}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
    }

    const json = await response.json();
    const videos = (json.data || []).map(normalizeVideoPost);
    const pagination = json.meta?.pagination || {};

    return {
        videos,
        hasMore: pagination.page < pagination.pageCount,
        total: pagination.total || 0,
    };
};

export const videoApi = {
    getVideosByDate,
};
