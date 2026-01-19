import type { StrapiArticle } from '../types/strapi';
import type { ArticleStandard } from '../types/articles';
import { STRAPI_ORIGIN } from '../lib/env';

// Helper to normalize content blocks
export const normalizeContentBlocks = (blocks: any[] | string | undefined): any[] => {
    let normalizedBlocks: any[] = [];
    if (Array.isArray(blocks)) {
        normalizedBlocks = blocks.map((block: any) => {
            const componentType = block.__component || block.type;
            if (componentType?.includes('rich-text')) {
                return {
                    ...block,
                    text: block.content || block.text
                };
            }
            if (componentType?.includes('quote')) {
                return {
                    ...block,
                    quote: block.quote_text || block.quote
                };
            }
            if (componentType?.includes('audio')) {
                return {
                    ...block,
                    audioUrl: block.file?.url,
                    title: block.title
                };
            }
            return block;
        });
    } else if (typeof blocks === 'string') {
        // Obsolete or simple text fallback
        normalizedBlocks = [{ type: 'paragraph', text: blocks }];
    }
    return normalizedBlocks;
};

export const mapStrapiToStandard = (strapiArticle: StrapiArticle): ArticleStandard => {
    // 1. Map Content Blocks
    // Strapi might return 'blocks' (Rich Text) or we used 'content' in some types.
    const rawBlocks = strapiArticle.blocks as any[] | string | undefined;

    // Fallback if we have raw text content in 'content' field instead of blocks
    const contentFallback = !rawBlocks && (strapiArticle as any).content ? (strapiArticle as any).content : undefined;

    const blocks = normalizeContentBlocks(rawBlocks || contentFallback);

    return {
        id: strapiArticle.documentId,
        layoutType: 'standard-one',
        title: strapiArticle.title,
        dek: strapiArticle.summary, // Mapping summary to dek
        slug: strapiArticle.slug,
        coverImage: strapiArticle.hero_image ? {
            url: strapiArticle.hero_image.url,
            alt: strapiArticle.hero_image.alternativeText,
            caption: strapiArticle.title // Default caption to title if missing
        } : undefined,
        category: {
            id: strapiArticle.category?.slug || 'general',
            name: strapiArticle.category?.name || 'General',
            slug: strapiArticle.category?.slug || 'general'
        },
        tags: strapiArticle.tags?.map(t => ({
            id: t.slug,
            name: t.name,
            slug: t.slug
        })) || [],
        publishedAt: strapiArticle.publishedAt,
        readTimeMinutes: strapiArticle.reading_time,
        audioUrl: strapiArticle.audioUrl,
        author: {
            id: strapiArticle.author?.slug || 'unknown',
            name: strapiArticle.author?.name || 'Vanguardia',
            slug: strapiArticle.author?.slug || 'vanguardia',
            avatarUrl: strapiArticle.author?.profile_picture?.url,
            role: 'Columnista' // Placeholder, add to Strapi if needed
        },
        // Extended fields
        isSpecial: strapiArticle.isSpecial || false,

        // Summaries
        audio_summary: strapiArticle.audio_summary ? {
            episode_label: strapiArticle.audio_summary.episode_label,
            podcast_title: strapiArticle.audio_summary.podcast_title,
            audio_file: strapiArticle.audio_summary.audio_file ? { url: strapiArticle.audio_summary.audio_file.url } : undefined
        } : undefined,

        video_summary: strapiArticle.video_summary ? {
            video_file: strapiArticle.video_summary.video_file ? { url: strapiArticle.video_summary.video_file.url } : undefined,
            thumbnail: strapiArticle.video_summary.thumbnail ? { url: strapiArticle.video_summary.thumbnail.url } : undefined,
            duration_seconds: strapiArticle.video_summary.duration_seconds
        } : undefined,

        ppt_summary: strapiArticle.ppt_summary ? {
            ppt_file: strapiArticle.ppt_summary.ppt_file ? { url: strapiArticle.ppt_summary.ppt_file.url } : undefined,
            slide_count: strapiArticle.ppt_summary.slide_count
        } : undefined,

        infographic_summary: strapiArticle.infographic_summary ? {
            image_file: strapiArticle.infographic_summary.image_file ? { url: strapiArticle.infographic_summary.image_file.url } : undefined,
        } : undefined,

        // TTS
        tts_status: strapiArticle.tts_status,
        tts_audio: strapiArticle.tts_audio ? { url: strapiArticle.tts_audio.url } : undefined,
        tts_metadata: strapiArticle.tts_metadata ? { url: strapiArticle.tts_metadata.url } : undefined,

        contentBlocks: blocks,
        relatedArticles: strapiArticle.relatedArticles?.map(ra => {
            const imgUrl = ra.hero_image?.url;
            return {
                title: ra.title,
                category: ra.category?.name || 'General',
                image: imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${STRAPI_ORIGIN}${imgUrl}`) : '',
                slug: ra.slug
            };
        }) || []
    };
};
